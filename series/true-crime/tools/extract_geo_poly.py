"""Filled-land map data for the vivid map fly-in (Natural Earth 10m, public domain).

usage: python series/true-crime/tools/extract_geo_poly.py <dl_dir> <lon_min> <lat_min> <lon_max> <lat_max> <tol_deg> <Country,Country,...> > geo.json
Reads ne_10m_land.geojson, ne_10m_admin0_lines.geojson and ne_50m_admin_0_countries.geojson from <dl_dir>.
Output: {"source", "bbox", "land": [ring...], "borders": [line...], "countries": {name: [ring...]}} with rings [[lon, lat], ...]."""
import json, sys
sys.path.insert(0, __file__.rsplit("/", 1)[0])
from extract_geo import dp


def rings_of(g):
    polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
    return [p[0] for p in polys]   # outer rings only


def main():
    d, a, b, c, e, tol, names = sys.argv[1], *map(float, sys.argv[2:7]), sys.argv[7].split(",")
    hit = lambda r: any(a - 5 <= x <= c + 5 and b - 5 <= y <= e + 5 for x, y in r)
    q = lambda r: [[round(x, 2), round(y, 2)] for x, y in r]
    land = []
    for f in json.load(open(f"{d}/ne_10m_land.geojson"))["features"]:
        for r in rings_of(f["geometry"]):
            if hit(r):
                s = dp(r, tol)
                if len(s) >= 4: land.append(q(s))
    borders = []
    for f in json.load(open(f"{d}/ne_10m_admin0_lines.geojson"))["features"]:
        g = f["geometry"]; parts = g["coordinates"] if g["type"] == "MultiLineString" else [g["coordinates"]]
        for l in parts:
            if hit(l):
                s = dp(l, tol)
                if len(s) >= 2: borders.append(q(s))
    countries = {n: [] for n in names}
    for f in json.load(open(f"{d}/ne_50m_admin_0_countries.geojson"))["features"]:
        n = f["properties"].get("ADMIN")
        if n in countries:
            for r in rings_of(f["geometry"]):
                s = dp(r, tol)
                if len(s) >= 4: countries[n].append(q(s))
    json.dump({"source": "Natural Earth 10m land, admin-0 boundary lines and 50m admin-0 country polygons (public domain), naturalearthdata.com",
               "bbox": [a, b, c, e], "land": land, "borders": borders, "countries": countries}, sys.stdout, separators=(",", ":"))


if __name__ == "__main__":
    main()
