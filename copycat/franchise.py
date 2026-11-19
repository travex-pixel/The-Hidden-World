"""Franchise registry: one JSON per franchise in config/franchises/<id>.json.

A project picks its franchise with a top-level "franchise" key in script.json.
Projects without the key are Black Clover (the original copycat project), so
existing work keeps running unchanged.
"""
import json
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT = "black-clover"


@lru_cache(maxsize=None)
def load(franchise_id: str = DEFAULT) -> dict:
    path = ROOT / "config" / "franchises" / f"{franchise_id}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    data.setdefault("id", franchise_id)
    data.setdefault("vault_dir", f"assets/cache/{franchise_id}")
    data.setdefault("cast_config", f"config/{franchise_id}-cast.json")
    return data


def id_for_project(project: str) -> str:
    script = ROOT / "copycat" / "projects" / project / "script.json"
    if script.exists():
        return json.loads(script.read_text(encoding="utf-8")).get("franchise", DEFAULT)
    return DEFAULT


def for_project(project: str) -> dict:
    return load(id_for_project(project))


def vault_dir(project: str) -> Path:
    return ROOT / for_project(project)["vault_dir"]
