"""Local files, and fetched bodies treated like files, dispatched by extension."""
from __future__ import annotations

import io
import json
import os
import re
from urllib.parse import unquote, urlparse

from ..schema import Source, renumber
from . import IngestError, Options, audio, net, podcast, subtitles, text, video, web
from .clean import paragraphs_to_segments

MEDIA_EXTS = audio.AUDIO_EXTS | audio.VIDEO_EXTS
KNOWN_EXTS = {".vtt", ".srt", ".txt", ".md", ".markdown", ".json", ".html", ".htm", ".pdf"} | MEDIA_EXTS
CONTENT_TYPE_EXTS = {
    "text/vtt": ".vtt", "application/x-subrip": ".srt", "application/srt": ".srt", "text/srt": ".srt",
    "text/plain": ".txt", "text/markdown": ".md", "application/json": ".json",
    "text/html": ".html", "application/xhtml+xml": ".html", "application/pdf": ".pdf",
    "audio/mpeg": ".mp3", "audio/mp4": ".m4a", "audio/x-m4a": ".m4a", "audio/aac": ".aac",
    "audio/wav": ".wav", "audio/x-wav": ".wav", "audio/ogg": ".ogg", "audio/opus": ".opus",
    "audio/flac": ".flac", "video/mp4": ".mp4", "video/webm": ".webm", "video/quicktime": ".mov",
    "video/x-matroska": ".mkv",
}


def _ext(name: str) -> str:
    return os.path.splitext(unquote(urlparse(name).path if "://" in name else name))[1].lower()


def media_ext(name: str) -> str | None:
    """The extension of ``name`` (path or URL) if it is an audio/video file."""
    ext = _ext(name)
    return ext if ext in MEDIA_EXTS else None


def ext_for(url: str, content_type: str) -> str:
    """Pick a handler extension: a known URL extension, else the content type, else HTML."""
    ext = _ext(url)
    if ext in KNOWN_EXTS:
        return ext
    return CONTENT_TYPE_EXTS.get(content_type, ".html")


def title_from_name(name: str) -> str:
    """A readable title from a file name or URL path."""
    base = os.path.basename(unquote(urlparse(name).path if "://" in name else name).rstrip("/"))
    if _ext(base) in (".vtt", ".srt"):  # drop yt-dlp's language suffix: "talk.en.vtt"
        base = re.sub(r"\.[a-z]{2,3}(?:-[A-Za-z]{2,4})?(?=\.\w+$)", "", base)
    base = re.sub(r"(\.info)?\.[A-Za-z0-9]{1,8}$", "", base)
    return re.sub(r"[_\-]+", " ", base).strip() or "Untitled"


def _decode(data: bytes) -> str:
    return data.decode("utf-8-sig", errors="replace")


def ingest_file(path: str, opts: Options, url: str | None = None) -> Source:
    """A Source for one local file, by extension."""
    ext = _ext(path)
    if ext in MEDIA_EXTS:
        return audio.from_media_file(path, opts, url=url)
    if ext not in KNOWN_EXTS:
        raise IngestError(f"don't know how to read {ext or 'extension-less'} file {path}; supported: "
                          f"{', '.join(sorted(KNOWN_EXTS))}")
    with open(path, "rb") as f:
        data = f.read()
    return from_bytes(data, ext, opts, url=url, title=title_from_name(path), path=path)


def from_bytes(data: bytes, ext: str, opts: Options, *, url: str | None = None,
               title: str | None = None, path: str | None = None) -> Source:
    """A Source from file content whose format is given by ``ext``."""
    title = title or title_from_name(url or path or "")
    if ext in MEDIA_EXTS:
        local = os.path.join(opts.workdir, net.safe_name(title) + ext)
        with open(local, "wb") as f:
            f.write(data)
        return audio.from_media_file(local, opts, url=url)
    if ext == ".pdf":
        return from_pdf(data, opts, url=url, title=title)
    if ext == ".json":
        return from_json(_parse_json(data, url or path), opts, url=url, title=title, path=path)
    if ext in (".html", ".htm"):
        return web.from_html(web.decode_html(data), url, opts.language)
    raw = _decode(data)
    if ext in (".vtt", ".srt"):
        segments, notes = subtitles.to_segments(raw, ext[1:])
        kind = "video"
    else:
        if ext in (".md", ".markdown"):
            md_title, raw = text.markdown_title(raw)
            title = md_title or title
        segments, notes = text.parse_transcript(raw)
        kind = "document"
    if not segments:
        raise IngestError(f"no text found in {url or path or 'the input'}")
    return Source(kind=kind, title=title, segments=renumber(segments), url=url,
                  duration_s=segments[-1].end_s, language=opts.language, notes=notes)


def _parse_json(data: bytes, where: str | None) -> object:
    try:
        return json.loads(_decode(data))
    except json.JSONDecodeError as e:
        raise IngestError(f"{where or 'input'} is not valid JSON: {e}") from e


def from_json(obj: object, opts: Options, *, url: str | None, title: str,
              path: str | None) -> Source:
    """A saved storyforge Source, a Podcasting 2.0 JSON transcript, or a yt-dlp ``.info.json``."""
    if not isinstance(obj, dict):
        obj = {}
    segments = obj.get("segments")
    if isinstance(segments, list) and "kind" in obj and "title" in obj:
        source = Source.from_dict(obj)
        renumber(source.segments)
        return source
    if isinstance(segments, list) and any(isinstance(s, dict) and "body" in s for s in segments):
        segs = podcast.segments_from_json_transcript(obj)
        return Source(kind="podcast", title=title, segments=renumber(segs), url=url,
                      duration_s=segs[-1].end_s, language=opts.language,
                      notes=["Podcasting 2.0 JSON transcript without episode metadata"])
    if "extractor" in obj or "webpage_url" in obj:
        if path is None:
            raise IngestError("a yt-dlp info.json only works as a local file next to its subtitles; "
                              f"pass the video URL ({obj.get('webpage_url', 'unknown')}) instead")
        return video.from_info_json(path, obj, opts)
    raise IngestError(f"unrecognized JSON in {url or path}: expected a storyforge Source, a Podcasting 2.0 "
                      "transcript ({\"segments\": [{\"startTime\", \"body\"}]}) or a yt-dlp .info.json")


def from_pdf(data: bytes, opts: Options, *, url: str | None, title: str) -> Source:
    """Text paragraphs from a PDF via pypdf."""
    try:
        from pypdf import PdfReader
    except ImportError as e:
        raise IngestError("reading PDFs needs pypdf (pip install pypdf); "
                          "or export the PDF's text and pass it as a .txt file") from e
    reader = PdfReader(io.BytesIO(data))
    pages = [page.extract_text() or "" for page in reader.pages]
    body = re.sub(r"(\w)-\n(\w)", r"\1\2", "\n\n".join(pages))  # re-join hyphenated line breaks
    paragraphs = [re.sub(r"\s*\n\s*", " ", p) for p in re.split(r"\n\s*\n", body)]
    segments = paragraphs_to_segments(paragraphs)
    if not segments:
        raise IngestError(f"no extractable text in {url or title}.pdf (scanned image?); OCR it first, "
                          "e.g. with ocrmypdf, and pass the result")
    meta = reader.metadata or {}
    return Source(kind="document", title=(meta.get("/Title") or title).strip(), segments=renumber(segments),
                  creator=(meta.get("/Author") or "").strip(), url=url, language=opts.language,
                  notes=["no timestamps in source",
                         "text extracted from PDF with pypdf; columns, headers and footnotes may be interleaved"])
