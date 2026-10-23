"""Local speech-to-text with faster-whisper or openai-whisper (imported lazily)."""
from __future__ import annotations

import importlib.util
import os
import shutil
import subprocess

from ..schema import Segment, Source, renumber
from . import IngestError, Options
from .clean import merge_cues, normalize_ws

AUDIO_EXTS = {".mp3", ".m4a", ".wav", ".ogg", ".opus", ".flac", ".aac"}
VIDEO_EXTS = {".mp4", ".mkv", ".webm", ".mov"}
INSTALL_HINT = ("pip install faster-whisper  (recommended)  or  pip install openai-whisper; "
                "or pass a transcript/subtitle file or a URL that has captions instead")


def pick_engine(choice: str) -> str:
    """Resolve ``auto``/``faster-whisper``/``whisper`` to an importable engine or raise."""
    if choice == "none":
        raise IngestError("this source has no transcript or captions and transcribe='none' was "
                          "passed; allow transcription (transcribe='auto') or pass a transcript file")
    available = [name for name, module in (("faster-whisper", "faster_whisper"), ("whisper", "whisper"))
                 if importlib.util.find_spec(module) is not None]
    if choice == "auto" and available:
        return available[0]
    if choice in available:
        return choice
    wanted = "a speech-to-text engine" if choice == "auto" else choice
    raise IngestError(f"transcription needs {wanted}, which is not installed: {INSTALL_HINT}")


def extract_audio(path: str, workdir: str) -> str:
    """Use ffmpeg to write a 16 kHz mono WAV of ``path``'s audio into ``workdir``."""
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise IngestError("ffmpeg is needed to read audio from video files; install it (e.g. apt install ffmpeg)")
    out = os.path.join(workdir, os.path.splitext(os.path.basename(path))[0] + ".16k.wav")
    proc = subprocess.run([ffmpeg, "-nostdin", "-y", "-loglevel", "error", "-i", path,
                           "-vn", "-ac", "1", "-ar", "16000", out], capture_output=True, text=True)
    if proc.returncode != 0:
        raise IngestError(f"ffmpeg could not extract audio from {path}: {proc.stderr.strip()[-400:]}")
    return out


def _run_faster_whisper(path: str, size: str, language: str | None) -> list[Segment]:
    from faster_whisper import WhisperModel
    model = WhisperModel(size, device="auto", compute_type="int8")
    segments, _info = model.transcribe(path, language=language, vad_filter=True)
    return [Segment("", s.text, float(s.start), float(s.end)) for s in segments]


def _run_whisper(path: str, size: str, language: str | None) -> list[Segment]:
    import whisper
    result = whisper.load_model(size).transcribe(path, language=language)
    return [Segment("", s["text"], float(s["start"]), float(s["end"])) for s in result["segments"]]


def transcribe(path: str, opts: Options) -> tuple[list[Segment], list[str]]:
    """Merged, timed segments plus a provenance note for one local audio or video file."""
    engine = pick_engine(opts.transcribe)
    if os.path.splitext(path)[1].lower() in VIDEO_EXTS:
        path = extract_audio(path, opts.workdir)
    size = os.environ.get("STORYFORGE_WHISPER_MODEL", "base")
    language = None if opts.language in ("", "auto") else opts.language
    run = _run_faster_whisper if engine == "faster-whisper" else _run_whisper
    cues = run(path, size, language)
    for c in cues:
        c.text = normalize_ws(c.text)
    cues = [c for c in cues if c.text]
    if not cues:
        raise IngestError(f"{engine} found no speech in {path}")
    return merge_cues(cues), [f"transcribed locally with {engine} {size} model; wording may contain recognition errors"]


def from_media_file(path: str, opts: Options, url: str | None = None) -> Source:
    """A Source for a bare audio or video file (no metadata beyond the file name)."""
    segments, notes = transcribe(path, opts)
    is_video = os.path.splitext(path)[1].lower() in VIDEO_EXTS
    title = os.path.splitext(os.path.basename(path))[0].replace("_", " ").strip()
    return Source(kind="video" if is_video else "audio", title=title or "Untitled recording",
                  segments=renumber(segments), url=url, language=opts.language,
                  duration_s=segments[-1].end_s, notes=notes)
