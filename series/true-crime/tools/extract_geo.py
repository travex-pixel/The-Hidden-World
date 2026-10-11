"""Cut Natural Earth 10m coastlines (public domain) to a bounding box and simplify them for an on-screen map.

usage: python series/true-crime/tools/extract_geo.py <ne_10m_coastline.geojson> <lon_min> <lat_min> <lon_max> <lat_max> <tolerance_deg> > geo.json
Download: https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_coastline.geojson
Output: {"source": ..., "bbox": [...], "lines": [[[lon, lat], ...], ...]} — paste into episode.json under geo.<name>."""
import json, sys


def dp(pts, tol):
    """Douglas–Peucker simplification."""
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1; L = (dx * dx + dy * dy) ** 0.5 or 1e-12
    dmax, idx = 0, 0
    for i in range(1, len(pts) - 1):
        x, y = pts[i]
        d = abs(dy * x - dx * y + x2 * y1 - y2 * x1) / L if (dx or dy) else ((x - x1) ** 2 + (y - y1) ** 2) ** 0.5
        if d > dmax:
            dmax, idx = d, i
    if dmax <= tol:
        return [pts[0], pts[-1]]
    return dp(pts[: idx + 1], tol)[:-1] + dp(pts[idx:], tol)


def main():
    src, a, b, c, d, tol = sys.argv[1], *map(float, sys.argv[2:7])
    inside = lambda p: a <= p[0] <= c and b <= p[1] <= d
    out = []
    for f in json.load(open(src))["features"]:
        g = f["geometry"]
        parts = g["coordinates"] if g["type"] == "MultiLineString" else [g["coordinates"]]
        for line in parts:
            run = []
            for p in line:
                if inside(p):
                    run.append(p)
                elif run:
                    out.append(run); run = []
            if run:
                out.append(run)
    lines = [[[round(x, 4), round(y, 4)] for x, y in dp(r, tol)] for r in out if len(r) > 1]
    json.dump({"source": "Natural Earth 10m coastline (public domain), naturalearthdata.com", "bbox": [a, b, c, d], "lines": lines}, sys.stdout, separators=(",", ":"))


if __name__ == "__main__":
    main()
