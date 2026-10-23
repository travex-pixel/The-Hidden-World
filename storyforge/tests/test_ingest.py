"""Offline tests for storyforge.ingest: every network call is routed to fixtures."""
from __future__ import annotations

import email.message
import importlib.machinery
import json
import os
import shutil
import subprocess
import sys
import types
import urllib.error
import urllib.request
from pathlib import Path
from types import SimpleNamespace

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from storyforge.ingest import IngestError, audio, clean, ingest, net, podcast, video, web  # noqa: E402
from storyforge.schema import Segment, Source  # noqa: E402

FIX = Path(__file__).parent / "fixtures" / "ingest"
FEED_URL = "https://feeds.example.com/hidden-ledger.xml"
EP11 = "https://hiddenledger.example.com/episodes/11/"
ARTICLE_URL = "https://ledgerreview.example.com/2025/03/the-napkin"
LOOKUP_URL = "https://itunes.apple.com/lookup?id=1650000000&entity=podcastEpisode&limit=200"

ROUTES = {
    FEED_URL: ("feed.xml", "application/rss+xml"),
    "https://ledgerreview.example.com/podcast/feed.xml": ("feed.xml", "application/rss+xml"),
    EP11 + "transcript.vtt": ("feed_transcript.vtt", "text/vtt"),
    EP11 + "transcript.json": ("transcript.json", "application/json"),
    EP11 + "chapters.json": ("chapters.json", "application/json"),
    LOOKUP_URL: ("apple_lookup.json", "text/javascript"),
    ARTICLE_URL: ("article.html", "text/html"),
    "https://cdn.example.com/captions/talk.en.vtt": ("interview.srt", "text/plain"),
}


@pytest.fixture
def web_calls(monkeypatch):
    """Route net.fetch to fixtures; returns the list of URLs fetched."""
    calls: list[str] = []

    def fake_fetch(url: str, timeout: float = 30) -> tuple[bytes, str]:
        calls.append(url)
        if url not in ROUTES:
            raise IngestError(f"GET {url} failed: HTTP 404 Not Found")
        name, content_type = ROUTES[url]
        return (FIX / name).read_bytes(), content_type

    monkeypatch.setattr(net, "fetch", fake_fetch)
    monkeypatch.setattr(net, "download", lambda *a, **k: pytest.fail("unexpected download"))
    return calls


def assert_renumbered(source: Source) -> None:
    assert [s.id for s in source.segments] == [f"s{i:04d}" for i in range(1, len(source.segments) + 1)]


# --------------------------------------------------------------------------- clean


@pytest.mark.parametrize("value,seconds", [
    ("01:02:03", 3723.0), ("1:02:03.456", 3723.456), ("00:00:05,250", 5.25),
    ("02:03", 123.0), ("2:03.5", 123.5), ("10:00:00.000", 36000.0),
])
def test_parse_timestamp(value, seconds):
    assert clean.parse_timestamp(value) == pytest.approx(seconds)


def test_parse_timestamp_rejects_garbage():
    with pytest.raises(ValueError):
        clean.parse_timestamp("soon")
    assert clean.parse_duration("00:58:20") == 3500
    assert clean.parse_duration("3125") == 3125
    assert clean.parse_duration("") is None


def test_strip_markup_and_whitespace():
    raw = "so<00:00:01.000><c> what</c> <i>we</i>&amp;<b>they</b> {\\an8}said"
    assert clean.strip_markup(raw) == "so what we&they said"
    assert clean.normalize_ws("  a \n b ,  c\u00a0 . ") == "a b, c."
    assert clean.is_sound_cue("[Music]") and clean.is_sound_cue("♪ ♪") and not clean.is_sound_cue("[He] left")


def test_dedupe_rolling_drops_repeated_lines_and_hold_cues():
    cues = [Segment("", "welcome back", 0, 2), Segment("", "welcome back", 2, 2.01),
            Segment("", "welcome back\nto the show", 2.01, 4), Segment("", "to the show", 4, 4.01),
            Segment("", "to the show\ntoday", 4.01, 6)]
    assert clean.is_rolling(cues)
    out = clean.dedupe_rolling(cues)
    assert [c.text for c in out] == ["welcome back", "to the show", "today"]
    assert [c.start_s for c in out] == [0, 2.01, 4.01]


def test_merge_cues_respects_speakers_and_limits():
    cues = [Segment("", f"Line {i}.", i * 4.0, i * 4.0 + 4, "A" if i < 12 else "B") for i in range(14)]
    out = clean.merge_cues(cues)
    assert [(s.start_s, s.end_s, s.speaker) for s in out] == [(0, 16, "A"), (16, 32, "A"), (32, 48, "A"),
                                                              (48, 56, "B")]
    assert out[0].text == "Line 0. Line 1. Line 2. Line 3."


def test_chunk_paragraph_splits_long_paragraphs_only():
    short = "One. Two. Three."
    assert clean.chunk_paragraph(short) == [short]
    long = " ".join(f"Sentence {i} ends here." for i in range(9))
    chunks = clean.chunk_paragraph(long)
    assert len(chunks) == 3 and " ".join(chunks) == long


# --------------------------------------------------------------------------- local files


def test_youtube_auto_vtt_is_deduplicated(tmp_path):
    src = ingest(str(FIX / "Xy12ab34Cd5.en.vtt"), workdir=str(tmp_path))
    assert src.kind == "video" and src.title == "Xy12ab34Cd5"
    assert_renumbered(src)
    text = src.text
    assert text.count("welcome back to the show") == 1
    assert "welcome back to the show today we're talking about how two guys" in text
    assert "bernie & arthur" in text and "<c>" not in text and "00:00" not in text
    assert src.segments[0].start_s == pytest.approx(0.16)
    assert src.segments[-1].end_s == pytest.approx(59.06)
    assert len(src.segments) >= 2
    assert all(s.end_s - s.start_s <= 40 for s in src.segments)
    assert any("auto-generated" in n for n in src.notes)


def test_srt_cues_are_merged_and_cleaned():
    src = ingest(str(FIX / "interview.srt"))
    assert_renumbered(src)
    assert "[Music]" not in src.text and "{\\an8}" not in src.text and "<i>" not in src.text
    assert "cavernous & nearly empty" in src.text
    assert 2 <= len(src.segments) <= 3
    assert src.segments[0].start_s == 3.5 and src.segments[-1].end_s == 40.0
    assert all(s.end_s - s.start_s <= 40 for s in src.segments)
    assert src.notes == []


def test_vtt_voice_tags_become_speakers():
    src = ingest(str(FIX / "feed_transcript.vtt"))
    assert [s.speaker for s in src.segments] == ["Maya Chen", "Tom Okafor", "Maya Chen"]
    assert src.segments[1].start_s == 11.4 and src.segments[1].end_s == 26.0


def test_timestamped_speaker_transcript_txt():
    src = ingest(str(FIX / "transcript.txt"))
    assert_renumbered(src)
    by_start = {s.start_s: s for s in src.segments}
    assert by_start[4.0].speaker == "Tom Okafor"
    assert by_start[12.0].text.endswith("into a coffee shop.")  # continuation line joined
    assert by_start[12.0].end_s == 27.0
    # three consecutive short Maya turns (00:27, 00:33, 00:38) merge into one unit
    assert by_start[27.0].speaker == "Maya Chen" and "Prices lower" in by_start[27.0].text
    assert by_start[27.0].end_s == 52.0
    assert by_start[74.0].text == "Note: that is a real marketing budget line item."
    assert "no timestamps in source" not in src.notes


def test_markdown_transcript_without_times():
    src = ingest(str(FIX / "notes.md"))
    assert src.title == "Napkin Sketch Notes"
    assert not src.timed and "no timestamps in source" in src.notes
    assert src.segments[0].speaker == "Maya Chen"
    assert src.segments[1].speaker == "Tom Okafor"  # bold label counts even when used once
    assert "Note: the napkin itself was never found." in src.text  # "Note:" is not a speaker
    long_turn = [s for s in src.segments if s.speaker == "Maya Chen"][1:]
    assert len(long_turn) >= 2  # an eleven-sentence turn is chunked
    assert "**" not in src.text and "#" not in src.text


def test_podcasting_json_transcript_file():
    src = ingest(str(FIX / "transcript.json"))
    assert src.kind == "podcast"
    assert [s.speaker for s in src.segments] == ["Maya Chen", "Tom Okafor", "Maya Chen", "Tom Okafor"]
    assert src.segments[0].text.startswith("Welcome back to The Hidden Ledger. Today we are in Atlanta,")
    assert src.segments[0].end_s == 17.5


def test_serialized_source_round_trips(tmp_path):
    original = ingest(str(FIX / "interview.srt"))
    path = tmp_path / "source.json"
    original.save(str(path))
    again = ingest(str(path))
    assert again == original


def test_ytdlp_info_json_with_sibling_vtt():
    src = ingest(str(FIX / "Xy12ab34Cd5.info.json"))
    assert src.kind == "video"
    assert src.title == "How Two Fired Executives Built a Warehouse Empire"
    assert src.creator == "The Hidden Ledger"
    assert src.published == "2024-03-15" and src.duration_s == 61
    assert src.url == "https://www.youtube.com/watch?v=Xy12ab34Cd5"
    assert [(c.title, c.start_s) for c in src.chapters] == [("Cold open", 0.0), ("The napkin sketch", 21.0)]
    assert src.images[0].url.endswith("maxresdefault.jpg")
    assert any("auto-generated" in n for n in src.notes)
    assert src.text.count("welcome back to the show") == 1


def test_info_json_without_subtitles_says_what_to_pass(tmp_path):
    info = json.loads((FIX / "Xy12ab34Cd5.info.json").read_text())
    path = tmp_path / "lonely.info.json"
    path.write_text(json.dumps(info))
    with pytest.raises(IngestError, match="pass the video URL"):
        ingest(str(path))


def test_unrecognized_json(tmp_path):
    path = tmp_path / "data.json"
    path.write_text('{"hello": "world"}')
    with pytest.raises(IngestError, match="unrecognized JSON"):
        ingest(str(path))


def test_html_article_file_with_trafilatura():
    src = ingest(str(FIX / "article.html"))
    check_article(src)


def test_html_article_fallback_parser(monkeypatch):
    monkeypatch.setattr(web, "_trafilatura", lambda html, url: None)
    src = ingest(str(FIX / "article.html"))
    check_article(src)
    assert any("html.parser" in n for n in src.notes)


def check_article(src: Source) -> None:
    assert src.kind == "article"
    assert src.title == "The Napkin That Built a Warehouse Empire"
    assert src.creator == "Priya Raman"
    assert src.published == "2025-03-14"
    assert src.url == ARTICLE_URL
    assert "napkin" in src.text and "orange apron" in src.text
    for boilerplate in ("Subscribe now", "All rights reserved", "Related stories", "analytics"):
        assert boilerplate not in src.text
    urls = [i.url for i in src.images]
    assert urls[0] == "https://images.example.com/og/napkin-hero.jpg"
    assert "https://ledgerreview.example.com/media/2025/03/first-store-1979.jpg" in urls
    assert "https://images.example.com/apron.jpg" in urls
    assert not any("logo" in u or "related" in u for u in urls)
    captions = {i.url: i.caption for i in src.images}
    assert captions["https://ledgerreview.example.com/media/2025/03/first-store-1979.jpg"].startswith(
        "The first two stores opened in Atlanta")
    assert captions["https://images.example.com/apron.jpg"] == "An orange work apron on a hook"
    assert not src.timed


def test_pdf(tmp_path):
    pypdf = pytest.importorskip("pypdf")
    writer = pypdf.PdfWriter()
    writer.add_blank_page(width=200, height=200)
    writer.add_metadata({"/Title": "Blank"})
    path = tmp_path / "blank.pdf"
    with open(path, "wb") as f:
        writer.write(f)
    with pytest.raises(IngestError, match="no extractable text"):
        ingest(str(path))


def test_bad_inputs(tmp_path):
    with pytest.raises(IngestError, match="neither an http"):
        ingest(str(tmp_path / "missing.vtt"))
    odd = tmp_path / "thing.xyz"
    odd.write_text("?")
    with pytest.raises(IngestError, match="don't know how to read"):
        ingest(str(odd))
    with pytest.raises(IngestError, match="transcribe="):
        ingest(str(odd), transcribe="maybe")


def test_file_url():
    src = ingest((FIX / "interview.srt").as_uri())
    assert "store every week" in src.text


# --------------------------------------------------------------------------- transcription


def _fake_faster_whisper(monkeypatch, seen: dict) -> None:
    module = types.ModuleType("faster_whisper")
    module.__spec__ = importlib.machinery.ModuleSpec("faster_whisper", None)

    class WhisperModel:
        def __init__(self, size, device="auto", compute_type="int8"):
            seen["size"] = size

        def transcribe(self, path, language=None, vad_filter=True):
            seen["path"], seen["language"] = path, language
            segs = [SimpleNamespace(start=i * 5.0, end=i * 5.0 + 5, text=f" Sentence number {i}.")
                    for i in range(10)]
            return iter(segs), SimpleNamespace(language="en")

    module.WhisperModel = WhisperModel
    monkeypatch.setitem(sys.modules, "faster_whisper", module)


@pytest.mark.skipif(not shutil.which("ffmpeg"), reason="ffmpeg not installed")
def test_video_file_is_transcribed_via_ffmpeg(monkeypatch, tmp_path):
    clip = tmp_path / "clip.mp4"
    subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-f", "lavfi", "-i", "sine=frequency=440:duration=1",
                    "-f", "lavfi", "-i", "color=c=black:s=64x64:d=1", "-shortest", str(clip)], check=True)
    seen: dict = {}
    _fake_faster_whisper(monkeypatch, seen)
    monkeypatch.setenv("STORYFORGE_WHISPER_MODEL", "tiny")
    work = tmp_path / "work"
    src = ingest(str(clip), workdir=str(work))
    assert seen["size"] == "tiny" and seen["language"] == "en"
    assert seen["path"].endswith(".16k.wav") and os.path.dirname(seen["path"]) == str(work)
    assert src.kind == "video" and src.title == "clip"
    assert "transcribed locally with faster-whisper tiny model" in src.notes[0]
    assert src.segments[0].start_s == 0 and src.segments[-1].end_s == 50
    assert all(s.end_s - s.start_s <= 40 for s in src.segments) and len(src.segments) >= 2
    assert_renumbered(src)


def test_transcription_requires_an_engine(tmp_path):
    clip = tmp_path / "talk.mp3"
    clip.write_bytes(b"ID3")
    with pytest.raises(IngestError, match="transcribe='none'"):
        ingest(str(clip), transcribe="none")
    if importlib.util.find_spec("whisper") is None:
        with pytest.raises(IngestError, match="pip install"):
            ingest(str(clip), transcribe="whisper")


# --------------------------------------------------------------------------- podcasts


def test_rss_episode_with_podcast_transcript_and_chapters(web_calls, tmp_path):
    src = ingest(FEED_URL, episode="two founders", workdir=str(tmp_path))
    assert src.kind == "podcast"
    assert src.title == "Episode 11: Two Founders and a Warehouse"
    assert src.creator == "The Hidden Ledger"
    assert src.url == "https://hiddenledger.example.com/episodes/11"
    assert src.published == "2025-09-02" and src.duration_s == 3500
    assert src.language == "en"
    assert src.description == "Fired on a Friday, they sketched a store on a napkin. Bernie & Arthur’s first bet."
    assert [s.speaker for s in src.segments] == ["Maya Chen", "Tom Okafor", "Maya Chen"]  # VTT preferred
    assert [(c.title, c.start_s) for c in src.chapters] == [
        ("Cold open", 0), ("Fired on a Friday", 95.5), ("Atlanta, June 1979", 300)]
    assert src.images[0].url == "https://hiddenledger.example.com/art/ep11.jpg"
    assert any("podcast:transcript (text/vtt)" in n for n in src.notes)
    assert EP11 + "transcript.html" not in web_calls
    assert_renumbered(src)


def test_rss_transcript_falls_back_to_next_type(web_calls, monkeypatch):
    monkeypatch.delitem(ROUTES, EP11 + "transcript.vtt")
    src = ingest(FEED_URL, episode="hl-011")
    assert any("podcast:transcript (application/json)" in n for n in src.notes)
    assert any("could not be used" in n for n in src.notes)
    assert src.segments[0].speaker == "Maya Chen"


def test_rss_fuzzy_and_number_match(web_calls):
    assert ingest(FEED_URL, episode="Two Founder and Warehose").title.startswith("Episode 11")
    assert ingest(FEED_URL, episode="11").title.startswith("Episode 11")
    with pytest.raises(IngestError, match="Recent episodes: Episode 12"):
        ingest(FEED_URL, episode="completely unrelated words")


def test_rss_latest_without_transcript_downloads_and_transcribes(web_calls, monkeypatch, tmp_path):
    with pytest.raises(IngestError, match="transcribe='none'"):
        ingest(FEED_URL, transcribe="none")

    downloads = []

    def fake_download(url, workdir):
        downloads.append((url, workdir))
        return os.path.join(workdir, "hl-012.mp3")

    def fake_transcribe(path, opts):
        assert path.endswith("hl-012.mp3")
        return ([Segment("", "Why a uniform became a promise.", 0.0, 12.0)],
                ["transcribed locally with faster-whisper base model"])

    monkeypatch.setattr(net, "download", fake_download)
    monkeypatch.setattr(audio, "pick_engine", lambda choice: "faster-whisper")
    monkeypatch.setattr(audio, "transcribe", fake_transcribe)
    src = ingest(FEED_URL, workdir=str(tmp_path))
    assert downloads == [("https://cdn.example.com/audio/hl-012.mp3", str(tmp_path))]
    assert src.title == "Episode 12: The Orange Apron" and src.duration_s == 3125
    assert src.notes[0].startswith("no episode requested")
    assert "transcribed locally with faster-whisper base model" in src.notes
    assert src.images[0].url == "https://hiddenledger.example.com/art/show.jpg"


def test_apple_podcasts_episode_url(web_calls):
    src = ingest("https://podcasts.apple.com/us/podcast/the-hidden-ledger/id1650000000?i=1000650000011")
    assert web_calls[:2] == [LOOKUP_URL, FEED_URL]
    assert src.title == "Episode 11: Two Founders and a Warehouse"
    assert any("Apple Podcasts" in n for n in src.notes)


def test_apple_podcasts_show_url_uses_episode_argument(web_calls):
    src = ingest("https://podcasts.apple.com/us/podcast/the-hidden-ledger/id1650000000", episode="warehouse")
    assert src.title == "Episode 11: Two Founders and a Warehouse"


def test_spotify_is_refused_with_advice():
    with pytest.raises(IngestError, match="DRM.*RSS feed"):
        ingest("https://open.spotify.com/episode/4rOoJ6Egrf8K2IrywzwOMk")


def test_looks_like_feed():
    assert podcast.looks_like_feed(b"\xef\xbb\xbf<?xml version='1.0'?>\n<rss>", "text/xml")
    assert podcast.looks_like_feed(b"", "application/atom+xml")
    assert not podcast.looks_like_feed(b"<!doctype html><html>", "text/html")


# --------------------------------------------------------------------------- web


def test_web_article_url(web_calls):
    src = ingest(ARTICLE_URL)
    check_article(src)
    assert web_calls == [ARTICLE_URL]


def test_web_page_with_episode_follows_rss_link(web_calls):
    src = ingest(ARTICLE_URL, episode="two founders")
    assert src.kind == "podcast" and src.title.startswith("Episode 11")
    assert web_calls[:2] == [ARTICLE_URL, "https://ledgerreview.example.com/podcast/feed.xml"]


def test_url_extension_beats_wrong_content_type(web_calls):
    src = ingest("https://cdn.example.com/captions/talk.en.vtt")
    assert src.title == "talk" and "store every week" in src.text


# --------------------------------------------------------------------------- yt-dlp


class FakeYDL:
    """Stands in for yt_dlp.YoutubeDL: returns the fixture info and 'downloads' the fixture VTT."""
    instances: list["FakeYDL"] = []
    info: dict = {}

    def __init__(self, params):
        self.params = params
        FakeYDL.instances.append(self)

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        return False

    def extract_info(self, url, download=False):
        assert download is False
        return json.loads(json.dumps(FakeYDL.info))

    @staticmethod
    def sanitize_info(info, remove_private_keys=False):
        return info

    def process_ie_result(self, info, download=True):
        assert self.params["skip_download"] and self.params["subtitlesformat"].startswith("vtt")
        lang = self.params["subtitleslangs"][0]
        dest = os.path.join(os.path.dirname(self.params["outtmpl"]), f"{info['id']}.{lang}.vtt")
        shutil.copy(FIX / "Xy12ab34Cd5.en.vtt", dest)
        return {**info, "requested_subtitles": {lang: {"ext": "vtt", "filepath": dest}}}


@pytest.fixture
def fake_ytdlp(monkeypatch):
    import yt_dlp
    FakeYDL.instances = []
    FakeYDL.info = json.loads((FIX / "Xy12ab34Cd5.info.json").read_text())
    monkeypatch.setattr(yt_dlp, "YoutubeDL", FakeYDL)
    return FakeYDL


def test_youtube_url_uses_automatic_captions(fake_ytdlp, tmp_path):
    src = ingest("https://www.youtube.com/watch?v=Xy12ab34Cd5", workdir=str(tmp_path))
    second = fake_ytdlp.instances[1].params
    assert second["writeautomaticsub"] is True and second["writesubtitles"] is False
    assert second["subtitleslangs"] == ["en"]
    assert (tmp_path / "Xy12ab34Cd5.en.vtt").exists()
    assert src.title == "How Two Fired Executives Built a Warehouse Empire"
    assert src.chapters[1].title == "The napkin sketch"
    assert src.text.count("welcome back to the show") == 1
    assert src.notes[0].startswith("captions are auto-generated")


def test_youtube_url_prefers_manual_subtitles(fake_ytdlp, tmp_path):
    fake_ytdlp.info["subtitles"] = {"en-US": [{"ext": "vtt", "url": "https://example.com/en.vtt"}]}
    src = ingest("https://youtu.be/Xy12ab34Cd5", workdir=str(tmp_path))
    second = fake_ytdlp.instances[1].params
    assert second["writesubtitles"] is True and second["subtitleslangs"] == ["en-US"]
    assert src.notes[0] == "captions are the uploader's subtitles (en-US)"


def test_youtube_url_without_captions_needs_transcription(fake_ytdlp, tmp_path):
    fake_ytdlp.info["automatic_captions"] = {}
    with pytest.raises(IngestError, match="transcribe='none'"):
        ingest("https://www.youtube.com/watch?v=Xy12ab34Cd5", workdir=str(tmp_path), transcribe="none")


def test_choose_subtitles_order():
    info = {"language": "de", "subtitles": {"live_chat": [{}], "fr": [{}]},
            "automatic_captions": {"de-orig": [{}], "de": [{}], "en": [{}]}}
    assert video.choose_subtitles(info, "en") == ("en", True)
    assert video.choose_subtitles(info, "fr") == ("fr", False)
    assert video.choose_subtitles(info, "es") == ("de-orig", True)
    assert video.choose_subtitles({"subtitles": {}}, "en") is None


def test_ytdlp_suitability_ignores_generic():
    assert video.is_supported("https://www.youtube.com/watch?v=Xy12ab34Cd5")
    assert video.is_video_only("https://vimeo.com/123456")
    assert not video.is_supported(ARTICLE_URL)
    assert not video.is_supported(FEED_URL)


# --------------------------------------------------------------------------- net


def test_fetch_retries_on_503(monkeypatch):
    attempts, sleeps = [], []

    class Resp:
        headers = {"Content-Type": "application/json; charset=utf-8"}

        def read(self):
            return b"{}"

        def __enter__(self):
            return self

        def __exit__(self, *exc):
            return False

    def fake_urlopen(req, timeout):
        attempts.append(req.get_header("User-agent"))
        if len(attempts) < 3:
            raise urllib.error.HTTPError(req.full_url, 503, "Service Unavailable", email.message.Message(), None)
        return Resp()

    monkeypatch.setattr(urllib.request, "urlopen", fake_urlopen)
    monkeypatch.setattr(net.time, "sleep", sleeps.append)
    assert net.fetch("https://api.example.com/x") == (b"{}", "application/json")
    assert len(attempts) == 3 and attempts[0].startswith("Mozilla/5.0")
    assert sleeps == [1, 2]


def test_fetch_does_not_retry_404(monkeypatch):
    def fake_urlopen(req, timeout):
        raise urllib.error.HTTPError(req.full_url, 404, "Not Found", email.message.Message(), None)

    monkeypatch.setattr(urllib.request, "urlopen", fake_urlopen)
    monkeypatch.setattr(net.time, "sleep", lambda s: pytest.fail("should not sleep"))
    with pytest.raises(IngestError, match="HTTP 404"):
        net.fetch("https://api.example.com/missing")


def test_fetch_file_url():
    body, content_type = net.fetch((FIX / "chapters.json").as_uri())
    assert json.loads(body)["version"] == "1.2.0" and content_type == "application/json"
