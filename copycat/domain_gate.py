"""AssetDomainGate: anime projects may only receive assets tagged with an anime domain."""

ALLOWED = {
    "true_crime": {"true_crime", "live_action_crime", "documentary", "general_sfx", "ambient_bgm"},
    "live_action_crime": {"true_crime", "live_action_crime", "documentary", "general_sfx", "ambient_bgm"},
    "anime_black_clover": {"anime_black_clover", "anime_fantasy"},
    "anime_fantasy": {"anime_black_clover", "anime_fantasy"},
    "documentary": {"documentary", "true_crime", "live_action_crime", "general_sfx", "ambient_bgm"},
    "general_sfx": {"general_sfx"},
    "ambient_bgm": {"ambient_bgm"},
}
AUDIO_DOMAINS = {"general_sfx", "ambient_bgm"}


class DomainViolation(Exception):
    pass


class AssetDomainGate:
    def __init__(self, project_domain: str):
        if project_domain not in ALLOWED:
            raise ValueError(f"unknown project domain {project_domain!r}; known: {sorted(ALLOWED)}")
        self.project_domain = project_domain
        self.anime = project_domain.startswith("anime_")

    def allows(self, asset: dict, kind: str = "visual") -> bool:
        dom = asset.get("domain")
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
                f"not allowed in project domain {self.project_domain!r}")
        return asset

    def audit(self, assets, kind: str = "visual") -> dict:
        rej = [a.get("id", "?") for a in assets if not self.allows(a, kind)]
        return {"allowed": len(assets) - len(rej), "rejected": len(rej), "rejected_ids": rej}
