"""Voice profiles: versioned JSON describing engine, model, reference clip and generation parameters.

Search order: voices/private/<name>/profile.json (vault, gitignored) then voices/<name>/profile.json.
Reference audio is referenced by path relative to the profile folder, or by `model://<package>/<file>`
for sample voices that ship inside a downloaded model package (so no audio is ever committed).
"""
from __future__ import annotations
import hashlib, json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
VOICES = ROOT / "voices"
_CACHE: dict = {}


def profile_dir(name: str) -> Path | None:
    for d in (VOICES / "private" / name, VOICES / name):
        if (d / "profile.json").exists():
            return d
    return None


def profile_exists(name: str) -> bool:
    return profile_dir(name) is not None


def load_profile(name: str) -> dict:
    if name in _CACHE:
        return _CACHE[name]
    d = profile_dir(name)
    if d is None:
        raise SystemExit(f"[voice] no profile 'voices/{name}/profile.json' (or voices/private/{name}/)")
    p = json.loads((d / "profile.json").read_text())
    for k in ("name", "version", "engine", "reference"):
        if k not in p:
            raise SystemExit(f"[voice] profile {name}: missing field '{k}'")
    p["_dir"] = str(d)
    _CACHE[name] = p
    return p


def reference_path(profile: dict) -> Path:
    ref = profile["reference"]
    if ref.startswith("model://"):
        from pipeline.voice.models import model_dir
        pkg, _, rel = ref[len("model://"):].partition("/")
        return model_dir(pkg) / rel
    return Path(profile["_dir"]) / ref


def profile_fingerprint(profile: dict) -> str:
    """Changes whenever anything that affects the audio changes: engine, model, params, reference content, version."""
    ref = reference_path(profile)
    h = hashlib.sha1()
    h.update(json.dumps({k: v for k, v in profile.items() if not k.startswith("_") and k != "validation"}, sort_keys=True).encode())
    if ref.exists():
        h.update(ref.read_bytes())
    return h.hexdigest()[:12]
