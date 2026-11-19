"""AssetDomainGate: anime projects may only receive assets tagged with an anime domain."""

ALLOWED = {
    "true_crime": {"true_crime", "live_action_crime", "documentary", "general_sfx", "ambient_bgm"},
    "live_action_crime": {"true_crime", "live_action_crime", "documentary", "general_sfx", "ambient_bgm"},
    "anime_black_clover": {"anime_black_clover", "anime_fantasy"},
    "anime_naruto": {"anime_naruto", "anime_fantasy"},
    "anime_fantasy": {"anime_black_clover", "anime_naruto", "anime_fantasy"},
    "documentary": {"documentary", "true_crime", "live_action_crime", "general_sfx", "ambient_bgm"},
    "general_sfx": {"general_sfx"},
    "ambient_bgm": {"ambient_bgm"},
}
AUDIO_DOMAINS = {"general_sfx", "ambient_bgm"}
DEFAULT_FRANCHISE = "black-clover"   # assets without a "franchise" field are the legacy Black Clover vault


class DomainViolation(Exception):
    pass


class AssetDomainGate:
    def __init__(self, project_domain: str, franchise: str = None):
        if project_domain not in ALLOWED:
            raise ValueError(f"unknown project domain {project_domain!r}; known: {sorted(ALLOWED)}")
        self.project_domain = project_domain
        self.anime = project_domain.startswith("anime_")
        # franchise isolation: a Black Clover frame never appears in a Naruto episode and vice versa
        self.franchise = franchise or {"anime_naruto": "naruto"}.get(project_domain, DEFAULT_FRANCHISE)

    def allows(self, asset: dict, kind: str = "visual") -> bool:
        dom = asset.get("domain")
        if self.anime and kind != "audio" and asset.get("franchise", DEFAULT_FRANCHISE) != self.franchise:
            return False
        if dom is None:
            return not self.anime and kind == "audio"  # missing tag: hard reject for anime
        if kind == "audio" and dom in AUDIO_DOMAINS:
            return True
        return dom in ALLOWED[self.project_domain]

    def filter(self, assets, kind: str = "visual") -> list:
        return [a for a in assets if self.allows(a, kind)]

    def require(self, asset: dict, kind: str = "visual") -> dict:
        if not self.allows(asset, kind):
            raise DomainViolation(
                f"asset {asset.get('id', '?')!r} has domain {asset.get('domain')!r}, "
                f"(franchise {asset.get('franchise', DEFAULT_FRANCHISE)!r}) not allowed in project domain "
                f"{self.project_domain!r} (franchise {self.franchise!r})")
        return asset

    def audit(self, assets, kind: str = "visual") -> dict:
        rej = [a.get("id", "?") for a in assets if not self.allows(a, kind)]
        return {"allowed": len(assets) - len(rej), "rejected": len(rej), "rejected_ids": rej}


DESIGNED_INSERT = "designed_insert"


def is_designed_insert(shot: dict) -> bool:
    """A shot rendered from our own graphics (copycat/inserts.py): not an imported asset, so the asset gate does not apply
    to the prop itself. Its blurred backdrop is still a vault asset and goes through AssetDomainGate like any other."""
    return shot.get("type") == "insert" and shot.get("provenance", DESIGNED_INSERT) == DESIGNED_INSERT
