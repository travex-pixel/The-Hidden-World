"""Ingest: turn a URL or local file into one normalized ``storyforge.schema.Source``.

``ingest(source)`` dispatches on what ``source`` is:

* a local file, by extension (subtitles, transcripts, JSON, HTML, PDF, audio/video);
* a Spotify URL (refused: DRM), an Apple Podcasts URL (resolved to its RSS feed);
* any URL a non-generic yt-dlp extractor accepts (YouTube, Vimeo, ...);
* anything else is fetched once and handled by content: RSS/Atom feed, subtitle,
  transcript, JSON, PDF, audio, or a web article.
"""
from __future__ import annotations

import os
import tempfile
from dataclasses import dataclass
from urllib.parse import urlparse
from urllib.request import url2pathname

from ..schema import Source


class IngestError(Exception):
    """Ingest could not produce a Source; the message says what to pass instead."""


@dataclass(frozen=True)
class Options:
    """Settings shared by every adapter."""
    episode: str | None
    language: str
    workdir: str
    transcribe: str


# Submodules import IngestError/Options from this package, so they load after them.
from . import files, net, podcast, video, web  # noqa: E402

TRANSCRIBE_CHOICES = ("auto", "faster-whisper", "whisper", "none")


def ingest(source: str, *, episode: str | None = None, language: str = "en",
           workdir: str | None = None, transcribe: str = "auto") -> Source:
    """Ingest a URL or local path into a Source with renumbered segments."""
    if transcribe not in TRANSCRIBE_CHOICES:
        raise IngestError(f"transcribe={transcribe!r} is not one of {', '.join(TRANSCRIBE_CHOICES)}")
    if workdir is None:
        workdir = tempfile.mkdtemp(prefix="storyforge-ingest-")
    os.makedirs(workdir, exist_ok=True)
    opts = Options(episode=episode, language=language, workdir=workdir, transcribe=transcribe)

    scheme = urlparse(source).scheme.lower()
    if scheme in ("http", "https"):
        return ingest_url(source, opts)
    path = url2pathname(urlparse(source).path) if scheme == "file" else os.path.expanduser(source)
    if not os.path.exists(path):
        raise IngestError(f"{source!r} is neither an http(s) URL nor an existing file")
    return files.ingest_file(path, opts)


def ingest_url(url: str, opts: Options) -> Source:
    """Route a URL to the adapter that understands it."""
    host = urlparse(url).netloc.lower()
    if host.endswith("spotify.com") or url.startswith("spotify:"):
        raise IngestError(
            "Spotify audio is DRM-protected and has no public transcript, so it cannot be ingested. "
            "Pass the show's RSS feed URL (with episode='<title>') or the episode's page on the "
            "show's own website or Apple Podcasts instead.")
    if host.endswith("podcasts.apple.com") or host.endswith("itunes.apple.com"):
        return podcast.ingest_apple(url, opts)
    fallback_note = None
    if video.is_supported(url):
        try:
            return video.ingest_video(url, opts)
        except IngestError as e:
            if video.is_video_only(url):
                raise
            fallback_note = f"yt-dlp could not use this page ({e}); read it as a web page instead"
    source = _ingest_by_content(url, opts)
    if fallback_note:
        source.notes.append(fallback_note)
    return source


def _ingest_by_content(url: str, opts: Options) -> Source:
    """Fetch a URL once and dispatch on what came back: feed, page, transcript, document or media."""
    if files.media_ext(url):
        return files.ingest_file(net.download(url, opts.workdir), opts, url=url)
    body, content_type = net.fetch(url)
    if podcast.looks_like_feed(body, content_type):
        return podcast.ingest_feed_bytes(body, url, opts)
    ext = files.ext_for(url, content_type)
    if ext in (".html", ".htm"):
        return web.ingest_page(body, url, opts)
    return files.from_bytes(body, ext, opts, url=url)


__all__ = ["IngestError", "Options", "ingest"]
