"""THE QUIET GAME — Episode 1: The Favour. Source of truth for the long-form script and shot plan.

usage: python series/the-quiet-game/make_the_favour.py   -> writes episodes/qg01-the-favour/episode.json

Every scene is one shot. Dialogue and narration are `lines` (narrator = characters/narrator.json), so the
pipeline times captions, lip sync and the soundtrack from the real synthesised audio. Shot types come from
renderer/widescreen.js (ws_stage, ws_insert, ws_explainer, ws_title, ws_end).
"""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
EP_ID = "qg01-the-favour"
SCENES: list[dict] = []

import sys  # noqa: E402
sys.path.insert(0, str(Path(__file__).resolve().parent))
from qg_lib import N, S, K, ARM, A, desk, DAN_DESK, LEAH_SIDE, scene as _scene  # noqa: E402


def scene(*a, **kw):
    _scene(SCENES, *a, **kw)


# ================================================================ COLD OPEN
scene("c01_cold_kitchen", "ws_stage", {
    "env": "kitchen", "grade": "cold", "flash": True, "chip": "THURSDAY · 16:42", "bg_blur": 4,
    "camera": {"zoom": [1.08, 1.0], "handheld": 0.6},
    "actors": [
        A("leah", 1500, 400, 0.62, [K(0, expr="tight", gaze=[0.6, 0], turn=0.5, x=1420), K(0.4, x=1880, dur=2.6)], arms=[ARM(0, l="cross", r="cross")], light="right"),
        A("daniel", 760, 460, 1.18, [K(0, expr="guilty", gaze=[0.5, 0.2], turn=0.35, tilt=-3), K(2.6, expr="tight", gaze=[0.1, 0.6], turn=0.1, tilt=2)], arms=[ARM(0, l="rest", r="rest")])]},
    [N("At 9:07 on Monday morning, Daniel Hale did his manager a favour.", pause_before=0.42)],
    cue="cold", chapter="Monday, 9:07", sfx=[(0.0, "swell"), (0.6, "door")], min_d=5.0)

scene("c02_cold_email", "ws_insert", {
    "env": "open_plan", "grade": "cold", "flash": True,
    "ui": {"kind": "email", "app": "Mail", "from": "Ruth Adeyemi", "to": "Client Reporting team", "subject": "Ostrel Q3: who built these numbers?",
           "body": ["Team,", "", "Ostrel say our Q3 figures don't reconcile with theirs.", "I'd like to understand how this happened before Friday.", "", "Ruth"],
           "highlight": ["who built these numbers"], "highlight_at": 1.0}},
    [N("By Thursday, a colleague was being blamed for a mistake she hadn't made.")],
    cue="cold", sfx=[(0.2, "ping")])

scene("c03_cold_graham", "ws_stage", {
    "env": "glass_office", "grade": "warm", "flash": True, "bg_blur": 4, "camera": {"zoom": [1.0, 1.07]},
    "actors": [A("graham", 960, 410, 1.25, [K(0, expr="pleased", gaze=[-0.2, 0.3], turn=-0.15, tilt=-2), K(line=1, off=0.2, expr="charm", gaze=[0, 0], turn=-0.05, tilt=-4)],
                 arms=[ARM(0, l="polish", r="polish"), ARM(line=1, off=0.4, l="steeple", r="steeple", dur=0.8)], glasses_off=[{"t": 0, "dur": 4.0}])]},
    [N("Daniel knew the truth. So did one other person: his manager."), N("And his manager never once raised his voice.", pause_before=0.26)],
    cue="intimate", pad=0.6)

scene("c04_title", "ws_title", {"title": "THE QUIET GAME", "subtitle": "EPISODE 1 · THE FAVOUR", "notice": "A fictional story. The psychology is real."},
      cue="hush", min_d=4.3, sfx=[(0.3, "swell")], note="Title card: The Quiet Game, Episode 1, The Favour.")

# ================================================================ 1 · THE TEAM
scene("c05_monday", "ws_stage", {
    "env": "open_plan", "grade": "day", "chip": "MONDAY · 08:52", "rewind": 1.0, "bg_blur": 3, "chapter_tag": {"n": "CHAPTER 1", "title": "The team", "hold": 5},
    "lower_third": {"who": "daniel", "name": "Daniel Hale", "role": "Reporting Analyst", "at": 4.8, "hold": 4.0},
    "camera": {"zoom": [1.12, 1.0], "x": [-60, 0]}, "desk": desk({"kind": "mug", "x": 420, "colour": "#4f7cac"}),
    "actors": [A("daniel", seated=True, **DAN_DESK, acting=[K(0, expr="neutral", gaze=[0.55, 0.35], turn=0.32, tilt=-2), K(line=2, off=1.0, expr="pleased", gaze=[0.5, 0.3], turn=0.3, tilt=-3)],
                 arms=[ARM(0, l="typing", r="typing")])]},
    [N("Rewind to Monday.", pause_before=0.77), N("Daniel Hale, thirty-two. Reporting analyst at a logistics firm."),
     N("The person everyone sends their spreadsheets to when they need them right.")],
    cue="curious", chapter="The team", sfx=[(0.0, "whoosh"), (1.4, "tick"), (1.7, "tick"), (2.1, "tick")])

scene("c06_leah_arrives", "ws_stage", {
    "env": "open_plan", "grade": "day", "bg_blur": 3, "camera": {"zoom": [1.0, 1.04]}, "desk": desk({"kind": "mug", "x": 420, "colour": "#4f7cac"}),
    "lower_third": {"who": "leah", "name": "Leah Carter", "role": "Data Analyst", "at": 1.2, "hold": 3.6, "x": 1380, "y": 700},
    "actors": [A("daniel", seated=True, **DAN_DESK, acting=[K(0, expr="neutral", gaze=[0.6, 0.3], turn=0.32), K(line=0, off=0.4, expr="pleased", gaze=[0.7, -0.1], turn=0.45, tilt=-3), K(line=1, off=0.0, expr="pleased", gaze=[0.7, -0.15], turn=0.45, tilt=-2)],
                 arms=[ARM(0, l="typing", r="typing"), ARM(line=0, off=0.6, r="desk", l="desk"), ARM(line=1, off=0.1, r="talk")]),
               A("leah", 1960, 380, 0.82, [K(0, expr="pleased", gaze=[-0.6, 0.1], turn=-0.4, x=2100), K(0.1, x=1520, dur=1.4), K(line=0, off=0.2, expr="pleased", gaze=[-0.7, 0.25], turn=-0.45, tilt=3), K(line=1, off=0.6, expr="pleased", gaze=[-0.6, 0.2], turn=-0.4, tilt=-2)],
                 arms=[ARM(0, l="paper", r="paper"), ARM(line=0, off=0.5, r="talk", l="rest")], light="right")]},
    [S("leah", "Final depot extract's in the folder. Every depot, every delivery.", pause_before=1.19),
     S("daniel", "You're a star. I'll have the client pack out by ten.")],
    cue="curious", sfx=[(0.2, "step"), (0.7, "step"), (1.2, "step")])

scene("c07_leah_desk", "ws_stage", {
    "env": "open_plan", "grade": "day", "bg_blur": 4, "glass_office": False, "camera": {"zoom": [1.05, 1.0], "x": [30, 0]},
    "desk": {"back": 720, "front": 880, "items": [{"kind": "monitor", "x": 640, "flip": False}, {"kind": "keyboard", "x": 1020}, {"kind": "notebook", "x": 1330, "colour": "#e06a4f"}]},
    "actors": [A("leah", 1040, 420, 0.86, [K(0, expr="neutral", gaze=[-0.55, 0.35], turn=-0.32, tilt=2), K(line=1, off=0.8, expr="skeptical", gaze=[-0.5, 0.3], turn=-0.3, tilt=4)],
                 arms=[ARM(0, l="typing", r="typing"), ARM(line=1, off=1.6, r="chin")], light="right", seated=True)]},
    [N("Leah Carter joined eight months ago. She builds the data."), N("Daniel turns it into the report the client sees.")],
    cue="curious")

scene("c08_coffee", "ws_stage", {
    "env": "open_plan", "grade": "warm", "bg_blur": 3, "camera": {"zoom": [1.0, 1.05], "x": [0, -20]},
    "desk": desk({"kind": "mug", "x": 1060, "colour": "#8c3b4a", "steam": True, "from": 3.3}),
    "lower_third": {"who": "graham", "name": "Graham Royce", "role": "Head of Client Reporting", "at": 5.2, "hold": 4.0, "x": 1300, "y": 640},
    "actors": [A("daniel", seated=True, **DAN_DESK, acting=[K(0, expr="neutral", gaze=[0.6, 0.35], turn=0.3), K(2.2, expr="pleased", gaze=[0.7, -0.2], turn=0.45, tilt=-3), K(line=1, off=0.0, expr="pleased", gaze=[0.65, -0.25], turn=0.45, tilt=-4), K(line=2, off=0.6, expr="pleased", gaze=[0.6, -0.2], turn=0.42, tilt=-2)],
                 arms=[ARM(0, l="typing", r="typing"), ARM(2.4, l="desk", r="desk")]),
               A("graham", 2080, 340, 0.84, [K(0, expr="pleased", gaze=[-0.5, 0.2], turn=-0.35, x=2080), K(0.2, x=1380, dur=2.4), K(2.8, expr="charm", gaze=[-0.6, 0.35], turn=-0.4, tilt=3), K(line=2, off=0.0, expr="charm", gaze=[-0.55, 0.3], turn=-0.38, tilt=4, lean=-3)],
                 arms=[ARM(0, r="mug", l="rest"), ARM(2.7, l="offer", dur=0.6), ARM(3.4, l="rest", dur=0.6), ARM(line=0, off=0.8, r="talk", dur=0.5), ARM(line=2, off=0.5, r="rest")], mug_colour="#8c3b4a", steam=True, light="right")]},
    [S("graham", "Flat white, no sugar. Big day.", pause_before=2.55), S("daniel", "You remembered."), S("graham", "I always remember.", pause_before=0.17)],
    cue="intimate", sfx=[(0.3, "step"), (1.0, "step"), (1.7, "step"), (3.3, "thud")])

scene("c10_inbox", "ws_insert", {
    "env": "open_plan", "grade": "warm",
    "ui": {"kind": "inbox", "items": [
        {"from": "Graham Royce", "date": "12 Sep", "subject": "Re: Leave request: approved. Go to the wedding, we'll cover.", "at": 0.3, "hot_at": "L1+0.0"},
        {"from": "Graham Royce", "date": "27 Sep", "subject": "Senior Analyst nominations: I've put your name forward.", "at": 0.5, "hot_at": "L2+0.0"},
        {"from": "Graham Royce", "date": "3 Oct", "subject": "Re: Friday: take the afternoon, you've earned it.", "at": 0.7, "hot_at": "L2+3.0"},
        {"from": "Facilities", "date": "4 Oct", "subject": "Kitchen fridge clear-out on Friday", "at": 0.9, "colour": "#6b7280"}]}},
    [N("He's patient, generous, and very good at remembering things.", pause_before=0.26), N("Last month, he approved Daniel's leave at a day's notice."), N("Two weeks ago, he put Daniel's name forward for promotion.")],
    cue="intimate", pad=1.2)

scene("c11_likes_him", "ws_stage", {
    "env": "open_plan", "grade": "warm", "bg_blur": 4, "camera": {"zoom": [1.04, 1.1]}, "desk": desk(),
    "actors": [A("daniel", 900, 440, 1.02, [K(0, expr="pleased", gaze=[0.3, 0.1], turn=0.2, tilt=-3), K(2.0, expr="pleased", gaze=[0.45, 0.4], turn=0.3, tilt=-1)],
                 arms=[ARM(0, r="mug", l="desk")], mug_colour="#8c3b4a", steam=True, seated=True)]},
    [N("Daniel likes him. Most people do.", pause_before=0.34)], cue="intimate", pad=1.0)

# ================================================================ 2 · THE FAVOUR
scene("c12_dashboard", "ws_insert", {
    "env": "open_plan", "grade": "neutral", "chip": "MONDAY · 09:03", "chapter_tag": {"n": "CHAPTER 2", "title": "The favour", "y": 860, "hold": 4},
    "ui": {"kind": "dashboard", "with_filter": 93.4, "without_filter": 92.6, "target": 93.0,
           "chips": ["Client: Ostrel Foods", "Period: Q3", "Exclude: NORTHFIELD (migration)"], "hot": 2, "circle_at": "L1+0.6", "remove_at": "L2+0.2",
           "depots": [["Ashby", 95.0], ["Barrow", 93.0], ["Carlton", 92.5], ["Northfield", 81.1]], "hot_depot": "Northfield"}},
    [N("At 9:03, Daniel notices something small.", pause_before=0.34),
     N("A filter left over from a system migration has removed one depot."),
     N("With Northfield included, on-time delivery is 92.6 percent. Without it, 93.4."),
     N("The client's contract target is 93.", pause_before=0.17)],
    cue="tension-rise", chapter="The favour", pad=0.8, claims=["F1"])

scene("c13_realise", "ws_stage", {
    "env": "open_plan", "grade": "cold", "bg_blur": 5, "camera": {"zoom": [1.0, 1.08]}, "desk": desk(),
    "actors": [A("daniel", 900, 450, 1.22, [K(0, expr="neutral", gaze=[0.6, 0.35], turn=0.35), K(0.8, expr="realise", gaze=[0.65, 0.3], turn=0.38, tilt=2), K(line=0, off=1.6, expr="tight", gaze=[0.2, 0.5], turn=0.15, tilt=3)],
                 arms=[ARM(0, l="typing", r="typing"), ARM(0.8, l="desk", r="desk", dur=0.3)], seated=True, light="right")]},
    [S("daniel", "Northfield's been filtered out.", pause_before=1.36, speed=1.1)], cue="unease", pad=1.2, sfx=[(0.8, "thump")])

scene("c14_knock", "ws_stage", {
    "env": "glass_office", "grade": "day", "chip": "09:07", "bg_blur": 2, "camera": {"zoom": [1.0, 1.03]},
    "desk": {"back": 724, "front": 884, "x0": 900, "x1": 2100, "slant": 50, "items": [{"kind": "laptop", "x": 1560}, {"kind": "mug", "x": 1120, "colour": "#8c3b4a"}, {"kind": "paper", "x": 1340}]},
    "actors": [A("graham", 1330, 420, 0.82, [K(0, expr="neutral", gaze=[0.3, 0.5], turn=0.2), K(1.6, expr="pleased", gaze=[-0.6, -0.1], turn=-0.4, tilt=2), K(line=1, off=0.5, expr="neutral", gaze=[-0.55, 0.0], turn=-0.4)],
                 arms=[ARM(0, l="typing", r="typing"), ARM(1.6, l="desk", r="desk")], seated=True, light="right"),
               A("daniel", -200, 400, 0.88, [K(0, expr="tight", gaze=[0.6, 0.1], turn=0.4, x=-200), K(0.1, x=560, dur=1.4), K(line=0, off=0.0, expr="neutral", gaze=[0.65, 0.05], turn=0.42, tilt=-2), K(line=1, off=0.4, expr="tight", gaze=[0.6, 0.1], turn=0.4)],
                 arms=[ARM(0, l="rest", r="rest"), ARM(line=0, off=0.8, r="talk"), ARM(line=1, off=2.0, r="rest")])]},
    [S("daniel", "Graham, got a minute? There's a filter on the Ostrel dashboard.", pause_before=1.44), S("daniel", "Northfield's been excluded since the migration.")],
    cue="unease", sfx=[(0.0, "door"), (0.4, "step"), (0.9, "step")])

scene("c15_thats_mine", "ws_stage", {
    "env": "glass_office", "grade": "day", "bg_blur": 3, "camera": {"zoom": [1.0, 1.05], "x": [0, 20]},
    "actors": [A("graham", 1180, 430, 1.05, [K(0, expr="neutral", gaze=[-0.5, 0.1], turn=-0.3), K(line=0, off=0.2, expr="pleased", gaze=[-0.55, 0.0], turn=-0.32, tilt=2), K(line=1, off=0.6, expr="tight", gaze=[-0.2, 0.4], turn=-0.15)],
                 arms=[ARM(0, l="steeple", r="steeple"), ARM(line=0, off=0.4, r="talk"), ARM(line=1, off=1.0, r="steeple", l="steeple")], light="right"),
               A("daniel", 340, 560, 1.45, [K(0, gaze=[0.6, 0], turn=0.5)], view="back")]},
    [S("graham", "Ah. That'll be mine. I set it up for the cut-over.", pause_before=0.26),
     S("daniel", "Without it, we're under target. Point eight under.", pause_before=0.17)],
    cue="unease")

scene("c16_polish", "ws_stage", {
    "env": "glass_office", "grade": "dusk", "bg_blur": 4, "camera": {"zoom": [1.02, 1.1]},
    "actors": [A("graham", 960, 410, 1.2, [K(0, expr="neutral", gaze=[0.1, 0.55], turn=0.05, tilt=2), K(line=1, off=0.0, expr="lean_in", gaze=[-0.25, 0.05], turn=-0.15, tilt=-3), K(line=1, off=2.6, expr="charm", gaze=[-0.3, 0.0], turn=-0.18, tilt=-4)],
                 arms=[ARM(0, l="polish", r="polish", dur=0.7), ARM(line=1, off=3.4, l="steeple", r="steeple", dur=0.8)],
                 glasses_off=[{"t": 0.0, "dur": 30}], light="right")]},
    [S("graham", "The pack goes at ten. Flag it now, and it's a week of calls over a rounding error.", pause_before=0.68),
     S("graham", "Leave it out of the notes for now. I'll fix it at source before the quarter closes.", pause_before=0.34)],
    cue="unease", pad=0.5)

scene("c17_hesitate", "ws_stage", {
    "env": "glass_office", "grade": "cold", "bg_blur": 5, "camera": {"zoom": [1.0, 1.06], "handheld": 0.4},
    "actors": [A("daniel", 900, 450, 1.25, [K(0, expr="tight", gaze=[0.5, 0.4], turn=0.3, tilt=2), K(1.4, expr="guilty", gaze=[0.6, 0.0], turn=0.35, tilt=-2)],
                 arms=[ARM(0, l="rest", r="rest"), ARM(0.6, r="neck", dur=0.7), ARM(2.0, r="rest", dur=0.6)])]},
    [S("daniel", "So we just... don't mention it?", pause_before=1.53)], cue="hush", sfx=[(0.2, "thump"), (1.0, "thump")], gain=-6)

scene("c18_quietly", "ws_stage", {
    "env": "glass_office", "grade": "dusk", "bg_blur": 4, "camera": {"zoom": [1.04, 1.0]},
    "actors": [A("graham", 1000, 440, 1.15, [K(0, expr="cool_smile", gaze=[-0.3, 0.1], turn=-0.2), K(line=0, off=1.2, expr="pleased", gaze=[-0.3, 0.05], turn=-0.2, tilt=-3)],
                 arms=[ARM(0, l="polish", r="polish"), ARM(1.0, l="steeple", r="steeple", dur=0.8)], glasses_off=[{"t": 0.0, "dur": 1.1}], light="right")]},
    [S("graham", "We correct it properly. Quietly. No drama.", pause_before=0.51)], cue="unease")

scene("c19_trust", "ws_stage", {
    "env": "glass_office", "grade": "warm", "bg_blur": 6, "camera": {"zoom": [1.1, 1.22]},
    "actors": [A("graham", 960, 470, 1.45, [K(0, expr="pleased", gaze=[-0.15, 0.1], turn=-0.1), K(0.5, expr="lean_in", gaze=[-0.08, 0.0], turn=-0.06, tilt=-4), K(line=0, off=1.4, expr="charm", gaze=[-0.05, 0.0], turn=-0.05, tilt=-5)],
                 arms=[ARM(0, l="steeple", r="steeple")], light="right")]},
    [S("graham", "I knew I could trust you.", pause_before=0.85)], cue="intimate", pad=1.6, gain=-3)

scene("c20_nod", "ws_stage", {
    "env": "glass_office", "grade": "warm", "bg_blur": 6, "camera": {"zoom": [1.05, 1.12]},
    "actors": [A("daniel", 920, 460, 1.3, [K(0, expr="tight", gaze=[0.4, 0.1], turn=0.25), K(0.6, expr="pleased", gaze=[0.35, 0.05], turn=0.22, tilt=5), K(1.0, tilt=-2), K(1.4, tilt=4), K(2.2, expr="tight", gaze=[0.1, 0.6], turn=0.1, tilt=1)],
                 arms=[ARM(0, l="rest", r="rest")])]},
    cue="intimate", min_d=2.8, note="Daniel nods, then looks down.")

scene("c21_sent", "ws_insert", {
    "env": "open_plan", "grade": "neutral", "chip": "09:58",
    "ui": {"kind": "report", "title": "Q3 Service Report", "sub": "Prepared for Ostrel Foods · Client Reporting", "kpi": "93.4%", "notes": "No exceptions this quarter.",
           "highlight_at": "L1+0.2", "sent_at": "L0+1.2", "sent_label": "09:58"}},
    [N("At 9:58, the report went out.", pause_before=0.51), N("Notes and exceptions: none this quarter.", pause_before=0.42)],
    cue="unease", sfx=[(1.6, "stamp")], claims=["F1"])

scene("c22_not_a_lie", "ws_stage", {
    "env": "open_plan", "grade": "neutral", "bg_blur": 3, "camera": {"zoom": [1.0, 1.07]}, "desk": desk({"kind": "mug", "x": 600, "colour": "#8c3b4a"}),
    "actors": [A("daniel", seated=True, **DAN_DESK, acting=[K(0, expr="neutral", gaze=[0.6, 0.35], turn=0.32), K(line=1, off=0.5, expr="pleased", gaze=[0.3, 0.6], turn=0.2, tilt=2)],
                 arms=[ARM(0, l="typing", r="typing"), ARM(line=1, off=0.0, l="desk", r="desk")])]},
    [N("It didn't feel like a lie."), N("It felt like a favour, for someone who'd done him plenty.", pause_before=0.26)],
    cue="intimate", pad=1.0)

# ================================================================ 3 · THE BLAME
scene("c23_client", "ws_insert", {
    "env": "open_plan", "grade": "cold", "chip": "TUESDAY · 14:20", "chapter_tag": {"n": "CHAPTER 3", "title": "The blame", "y": 860, "hold": 4},
    "ui": {"kind": "email", "from": "Sam Okoro, Head of Logistics, Ostrel Foods", "to": "Ruth Adeyemi", "cc": "Graham Royce", "subject": "Q3 service figures don't reconcile",
           "body": ["Hi Ruth,", "", "Our records put Q3 on-time delivery at 92.6%, below the 93% target.", "Your report says 93.4%. Northfield alone was 81%.",
                    "Can you explain the difference before Friday's review?", "", "Sam"], "highlight": ["92.6%", "93.4%"], "highlight_at": 2.0}},
    [N("On Tuesday afternoon, the client noticed.", pause_before=0.51)], cue="tension", chapter="The blame", pad=1.8, sfx=[(0.3, "ping")], claims=["F1"])

scene("c24_who_built", "ws_stage", {
    "env": "glass_office", "grade": "neutral", "bg_blur": 2, "camera": {"zoom": [1.0, 1.04]},
    "lower_third": {"who": "ruth", "name": "Ruth Adeyemi", "role": "Director of Operations", "at": 0.6, "hold": 3.6, "x": 64, "y": 660},
    "desk": {"back": 724, "front": 884, "x0": 900, "x1": 2100, "slant": 50, "items": [{"kind": "laptop", "x": 1560}, {"kind": "mug", "x": 1120, "colour": "#8c3b4a"}]},
    "actors": [A("ruth", 560, 390, 0.86, [K(0, expr="neutral", gaze=[0.6, 0.05], turn=0.4), K(line=0, off=0.4, expr="skeptical", gaze=[0.65, 0.05], turn=0.42, tilt=-2), K(line=1, off=0.6, expr="neutral", gaze=[0.6, 0.08], turn=0.4)],
                 arms=[ARM(0, l="paper", r="paper"), ARM(line=1, off=0.2, l="rest", r="rest")]),
               A("graham", 1330, 420, 0.82, [K(0, expr="pleased", gaze=[-0.6, -0.1], turn=-0.42), K(line=1, off=0.0, expr="neutral", gaze=[-0.55, 0.0], turn=-0.4, tilt=2), K(line=2, off=0.3, expr="pleased", gaze=[-0.55, -0.05], turn=-0.4, tilt=3)],
                 arms=[ARM(0, l="desk", r="desk"), ARM(line=1, off=0.4, r="talk"), ARM(line=2, off=0.3, r="open"), ARM(line=2, off=3.2, r="desk")], seated=True, light="right")]},
    [S("ruth", "Ostrel say our Q3 numbers don't reconcile. Who built the data?", pause_before=0.51),
     S("graham", "The extract is Leah's. She's still learning the depot feeds."),
     S("graham", "Let's not pile on her. I'll take her through the checks myself.", pause_before=0.26)],
    cue="tension")

scene("c25_nothing_false", "ws_stage", {
    "env": "glass_office", "grade": "dusk", "bg_blur": 5, "camera": {"zoom": [1.0, 1.1]},
    "actors": [A("graham", 980, 450, 1.25, [K(0, expr="pleased", gaze=[-0.4, 0.0], turn=-0.25, tilt=2), K(2.6, expr="cool_smile", gaze=[-0.35, 0.05], turn=-0.22), K(line=1, off=1.5, expr="neutral", gaze=[-0.2, 0.3], turn=-0.12)],
                 arms=[ARM(0, l="steeple", r="steeple")], light="right")]},
    [N("Nothing Graham said was false.", pause_before=0.26), N("The extract was Leah's. She was still learning.", pause_before=0.2)],
    cue="tension", claims=["C3"])

scene("c26_stayed", "ws_stage", {
    "env": "open_plan", "grade": "cold", "bg_blur": 2, "camera": {"zoom": [1.0, 1.06], "x": [0, -40]}, "desk": desk(),
    "glass_figures": [{"x": 1520, "head": "#1c1816", "body": "#3c3f78", "sway": True}, {"x": 1780, "head": "#7d7873", "body": "#b9a98c"}],
    "actors": [A("daniel", 700, 440, 0.86, [K(0, expr="tight", gaze=[0.8, -0.2], turn=0.5, tilt=-2), K(line=1, off=0.6, expr="guilty", gaze=[0.3, 0.5], turn=0.2), K(line=1, off=2.0, expr="neutral", gaze=[0.6, 0.35], turn=0.32)],
                 arms=[ARM(0, l="desk", r="desk"), ARM(line=1, off=2.0, l="typing", r="typing")], seated=True)]},
    [N("Daniel could have walked in. It would have taken one sentence.", pause_before=0.51), N("He stayed at his desk.", pause_before=0.68)],
    cue="cold", pad=1.0)

scene("c27_ruth_to_leah", "ws_insert", {
    "env": "open_plan", "grade": "cold", "chip": "WEDNESDAY · 09:15",
    "ui": {"kind": "email", "from": "Ruth Adeyemi", "to": "Leah Carter", "subject": "Q3 depot extract",
           "body": ["Leah,", "", "Please walk me through your Q3 depot extract by Thursday, 5pm.", "", "Thanks,", "Ruth"], "highlight": ["walk me through"], "highlight_at": 1.4}},
    cue="cold", min_d=3.6, sfx=[(0.3, "ping")], note="Email from Ruth to Leah: please walk me through your Q3 extract by Thursday.")

scene("c28_leah_asks", "ws_stage", {
    "env": "open_plan", "grade": "neutral", "bg_blur": 3, "camera": {"zoom": [1.0, 1.04]}, "desk": desk(),
    "actors": [A("daniel", seated=True, **DAN_DESK, acting=[K(0, expr="neutral", gaze=[0.7, -0.1], turn=0.45), K(line=2, off=0.0, expr="tight", gaze=[0.5, 0.4], turn=0.3, tilt=2), K(line=3, off=0.6, expr="guilty", gaze=[0.65, -0.1], turn=0.42), K(line=4, off=0.0, expr="tight", gaze=[0.7, -0.12], turn=0.45)],
                 arms=[ARM(0, l="desk", r="desk"), ARM(line=2, off=0.6, r="neck", dur=0.6), ARM(line=3, off=0.4, r="desk")]),
               A("leah", **LEAH_SIDE, acting=[K(0, expr="tight", gaze=[-0.7, 0.2], turn=-0.45, tilt=2), K(line=1, off=0.3, expr="skeptical", gaze=[-0.7, 0.25], turn=-0.45, tilt=4), K(line=3, off=0.0, expr="realise", gaze=[-0.7, 0.2], turn=-0.45, tilt=0)],
                 arms=[ARM(0, l="cross", r="cross"), ARM(line=1, off=0.0, r="talk", l="rest"), ARM(line=3, off=0.2, r="open"), ARM(line=4, off=0.6, l="cross", r="cross")], light="right")]},
    [S("leah", "Ruth wants to go through my extract.", pause_before=0.42), S("leah", "I've checked it three times. It's right, isn't it?"),
     S("daniel", "It... looks right to me.", pause_before=0.42), S("leah", "Then where's the difference coming from?"), S("daniel", "I'll take another look.", pause_before=0.51)],
    cue="unease")

scene("c29_true_too", "ws_stage", {
    "env": "open_plan", "grade": "cold", "bg_blur": 5, "camera": {"zoom": [1.0, 1.08]}, "desk": desk(),
    "actors": [A("leah", 1600, 380, 0.55, [K(0, expr="tight", gaze=[0.5, 0], turn=0.3, x=1600), K(0.3, x=2080, dur=2.4)], arms=[ARM(0, l="rest", r="rest")], light="right"),
               A("daniel", 860, 450, 1.18, [K(0, expr="guilty", gaze=[0.7, -0.1], turn=0.4), K(1.4, expr="guilty", gaze=[0.2, 0.55], turn=0.15, tilt=3)], arms=[ARM(0, l="desk", r="desk")], seated=True)]},
    [N("That was true too. Every word.", pause_before=0.85)], cue="cold", pad=1.0)

scene("c30_count_on", "ws_stage", {
    "env": "open_plan", "grade": "warm", "bg_blur": 3, "camera": {"zoom": [1.0, 1.04]}, "desk": desk(),
    "actors": [A("daniel", seated=True, **DAN_DESK, acting=[K(0, expr="neutral", gaze=[0.6, 0.35], turn=0.32), K(line=0, off=0.3, expr="neutral", gaze=[0.7, -0.2], turn=0.45, tilt=-2), K(line=1, off=1.2, expr="tight", gaze=[0.7, -0.18], turn=0.45, tilt=2)],
                 arms=[ARM(0, l="typing", r="typing"), ARM(line=0, off=0.3, l="desk", r="desk")]),
               A("graham", 1480, 340, 0.84, [K(0, expr="pleased", gaze=[-0.6, 0.3], turn=-0.42, tilt=3, lean=-4), K(line=1, off=0.0, expr="charm", gaze=[-0.6, 0.32], turn=-0.42, tilt=4, lean=-5)],
                 arms=[ARM(0, l="rest", r="rest"), ARM(line=0, off=0.5, r="talk"), ARM(line=1, off=1.5, r="rest")], light="right")]},
    [S("graham", "How's Leah holding up? Keep an eye on her for me, would you?", pause_before=0.42),
     S("graham", "You're the one person here I can count on.", pause_before=0.26)],
    cue="intimate", pad=1.2)

scene("c31_standup", "ws_stage", {
    "env": "meeting_room", "grade": "neutral", "chip": "THURSDAY · 09:30", "bg_blur": 1, "camera": {"zoom": [1.0, 1.03]},
    "slide": {"title": "Process update", "bars": []},
    "desk": {"kind": "table", "back": 740, "front": 900, "x0": 200, "x1": 1500, "slant": 70, "items": [{"kind": "laptop", "x": 980}, {"kind": "glass", "x": 520}, {"kind": "notebook", "x": 760}, {"kind": "glass", "x": 1180}]},
    "actors": [A("leah", 560, 450, 0.7, [K(0, expr="neutral", gaze=[0.8, -0.2], turn=0.45), K(line=0, off=2.0, expr="tight", gaze=[0.5, 0.5], turn=0.3, tilt=2)], arms=[ARM(0, l="desk", r="desk")], seated=True),
               A("daniel", 1060, 450, 0.7, [K(0, expr="neutral", gaze=[0.8, -0.2], turn=0.45), K(line=1, off=0.5, expr="tight", gaze=[-0.3, 0.4], turn=-0.15)], arms=[ARM(0, l="desk", r="desk")], seated=True),
               A("graham", 1620, 360, 0.8, [K(0, expr="pleased", gaze=[-0.7, 0.2], turn=-0.42), K(line=1, off=0.0, expr="charm", gaze=[-0.65, 0.25], turn=-0.4, tilt=3)],
                 arms=[ARM(0, l="rest", r="talk"), ARM(line=1, off=0.0, r="open"), ARM(line=1, off=1.6, r="rest")], light="right")]},
    [S("graham", "From today, Leah's extracts get a second check before they go out.", pause_before=0.51), S("graham", "No blame. Just process.", pause_before=0.34)],
    cue="unease", pad=0.6)

scene("c32_nobody", "ws_stage", {
    "env": "meeting_room", "grade": "cold", "bg_blur": 2, "camera": {"zoom": [1.0, 1.08], "x": [0, -60]}, "slide": {"title": "Process update", "bars": []},
    "desk": {"kind": "table", "back": 740, "front": 900, "x0": 200, "x1": 1500, "slant": 70, "items": [{"kind": "laptop", "x": 980}, {"kind": "glass", "x": 520}, {"kind": "notebook", "x": 760}]},
    "actors": [A("leah", 560, 450, 0.7, [K(0, expr="tight", gaze=[0.3, 0.6], turn=0.2, tilt=3), K(line=1, off=0.2, expr="guilty", gaze=[0.1, 0.7], turn=0.05, tilt=4)], arms=[ARM(0, l="desk", r="desk")], seated=True),
               A("daniel", 1060, 450, 0.7, [K(0, expr="tight", gaze=[-0.3, 0.4], turn=-0.15), K(line=2, off=0.2, expr="guilty", gaze=[0.6, 0.3], turn=0.35)], arms=[ARM(0, l="desk", r="desk")], seated=True)]},
    [N("Nobody said a word.", pause_before=0.8), N("Leah assumed everyone thought it was her fault."), N("Daniel assumed someone else would say something."),
     N("Each silence made the next one easier.", pause_before=0.26)],
    cue="cold", gain=-4, claims=["C4"])

scene("c33_did_you_know", "ws_stage", {
    "env": "kitchen", "grade": "neutral", "chip": "THURSDAY · 16:40", "bg_blur": 3, "camera": {"zoom": [1.0, 1.05], "handheld": 0.35},
    "actors": [A("daniel", 700, 420, 0.92, [K(0, expr="neutral", gaze=[0.6, 0.05], turn=0.4), K(line=1, off=0.4, expr="frozen", gaze=[0.6, 0.0], turn=0.42), K(line=2, off=0.0, expr="guilty", gaze=[0.3, 0.5], turn=0.2, tilt=2), K(line=3, off=0.3, expr="tight", gaze=[0.6, 0.05], turn=0.4)],
                 arms=[ARM(0, r="mug", l="rest"), ARM(line=2, off=0.3, r="open", dur=0.5), ARM(line=3, off=0.2, r="rest")], mug_colour="#4f7cac"),
               A("leah", 1260, 400, 0.9, [K(0, expr="tight", gaze=[-0.6, 0.05], turn=-0.42), K(line=1, off=0.0, expr="cold", gaze=[-0.6, 0.0], turn=-0.42, tilt=-2), K(line=3, off=0.0, expr="cold", gaze=[-0.6, 0.0], turn=-0.42, tilt=2)],
                 arms=[ARM(0, l="cross", r="cross"), ARM(line=0, off=0.2, r="point", l="rest"), ARM(line=1, off=0.0, l="cross", r="cross")], light="right")]},
    [S("leah", "You built the client pack. You'd have seen every filter on that dashboard.", pause_before=0.51), S("leah", "Did you know?", pause_before=0.42),
     S("daniel", "Leah... it's complicated.", pause_before=0.85), S("leah", "No. It's really not.", pause_before=0.34)],
    cue="tension")

scene("c34_alone", "ws_stage", {
    "env": "kitchen", "grade": "cold", "bg_blur": 4, "camera": {"zoom": [1.06, 1.0], "handheld": 0.5},
    "actors": [A("leah", 1400, 400, 0.62, [K(0, expr="tight", gaze=[0.6, 0], turn=0.5, x=1360), K(0.2, x=1900, dur=2.4)], arms=[ARM(0, l="cross", r="cross")], light="right"),
               A("daniel", 760, 460, 1.18, [K(0, expr="guilty", gaze=[0.5, 0.2], turn=0.35, tilt=-3), K(2.6, expr="tight", gaze=[0.1, 0.6], turn=0.1, tilt=2)], arms=[ARM(0, r="mug", l="rest")], mug_colour="#4f7cac")]},
    cue="cold", min_d=3.2, sfx=[(0.4, "step"), (0.9, "step"), (2.4, "door")], note="Leah walks out. Daniel is left alone.")

# ================================================================ 4 · THE QUIET FORCES
scene("c35_pause", "ws_stage", {
    "env": "kitchen", "grade": "cold", "flash": True, "bg_blur": 6, "camera": {"zoom": [1.0, 1.06]}, "chapter_tag": {"n": "CHAPTER 4", "title": "The quiet forces", "hold": 4},
    "actors": [A("daniel", 960, 460, 1.18, [K(0, expr="tight", gaze=[0.1, 0.6], turn=0.1, tilt=2)], arms=[ARM(0, r="mug", l="rest")], mug_colour="#4f7cac")]},
    [N("Let's pause. Daniel isn't a bad person.", pause_before=0.51), N("So why does a decent person stay quiet?", pause_before=0.26)],
    cue="hush", chapter="The quiet forces", sfx=[(0.0, "whoosh")])

scene("c36_forces", "ws_explainer", {"ex": {"kind": "forces", "items": [
    {"icon": "1", "label": "Reciprocity", "sub": "A favour can feel like a debt", "colour": "#d98a9a", "at": "L0+2.4"},
    {"icon": "2", "label": "Dissonance", "sub": "We change the story to match what we did", "colour": "#ffd38a", "at": "L0+3.1"},
    {"icon": "3", "label": "Pluralistic ignorance", "sub": "Everyone assumes everyone else is fine", "colour": "#7fc8e8", "at": "L0+3.8"}]}},
    [N("Psychologists would point to at least three quiet forces.", pause_before=0.34)], cue="curious", pad=2.4)

scene("c37_ledger", "ws_explainer", {"ex": {"kind": "ledger", "cite": "Gouldner (1960), American Sociological Review", "cite_at": 2.0,
    "gave": [{"text": "Leave approved at a day's notice", "at": "L2+0.0"}, {"text": "Name put forward for promotion", "at": "L2+0.9"}, {"text": "Flat white, no sugar", "at": "L2+1.8"}],
    "ask": {"text": "“Leave it out of the notes”", "at": "L3+0.6"}}},
    [N("The first is reciprocity."), N("Sociologist Alvin Gouldner described a near-universal norm:", pause_before=0.17),
     N("when someone helps us, we feel we owe them."),
     N("When Graham finally asked, saying no felt like refusing to pay a debt.")],
    cue="curious", claims=["C1"])

scene("c38_regan", "ws_explainer", {"ex": {"kind": "regan", "at": "L0+0.6", "cite": "Regan (1971), Journal of Experimental Social Psychology", "cite_at": 1.0}},
    [N("In one classic 1971 study, people given a free soft drink by a stranger", pause_before=0.26),
     N("later bought about twice as many of his raffle tickets as people given nothing.")],
    cue="curious", pad=0.8, claims=["C1"])

scene("c39_dissonance", "ws_explainer", {"ex": {"kind": "dissonance", "a": "I'm an honest person.", "b": "I stayed quiet.",
    "notes": [{"text": "It's only 0.8%.", "at": "L2+0.1"}, {"text": "Graham will fix it.", "at": "L2+1.7"}, {"text": "It's not my place.", "at": "L2+3.1"}],
    "caveat": {"text": "A tendency, not a law (see Vaidis et al., 2024)", "at": "L3+0.4"}, "cite": "Festinger (1957); Festinger & Carlsmith (1959)", "cite_at": 1.5}},
    [N("The second is cognitive dissonance: the discomfort of acting against your own values.", pause_before=0.26),
     N("We often ease it by changing the story, not the behaviour.", pause_before=0.26),
     N("It's only point eight percent. Graham will fix it. It's not my place.", pause_before=0.17),
     N("Recent large replications found weaker effects, so treat it as a tendency, not a law.", pause_before=0.42)],
    cue="tension-rise", claims=["C2"])

scene("c40_plural", "ws_explainer", {"ex": {"kind": "plural", "private_at": "L1+0.4", "private": [["This feels", "wrong"], ["Is it", "just me?"], ["Not my", "business"]],
    "assume": "Each assumes everyone else is fine", "assume_at": "L2+0.0", "cite": "Prentice & Miller (1993), JPSP", "cite_at": "L3+0.0"}},
    [N("The third is pluralistic ignorance.", pause_before=0.26), N("Many people privately doubt something, but each assumes the others are fine with it."),
     N("So nobody speaks."), N("In one Princeton study, students thought they were more uneasy about campus drinking", pause_before=0.34),
     N("than their peers were. Many of their peers felt exactly the same.")],
    cue="curious", claims=["C4"])

scene("c41_foot", "ws_explainer", {"ex": {"kind": "foot", "cite": "Freedman & Fraser (1966), JPSP", "cite_at": "L1+0.0", "steps": [
    {"text": "A flat white", "at": "L0+0.3"}, {"text": "Leave it out of the notes", "at": "L0+2.3"}, {"text": "Confirm the story", "at": "L0+4.1"}]}},
    [N("Once you've agreed to something small, the next request feels smaller than it is."),
     N("Psychologists call it the foot in the door.", pause_before=0.17)],
    cue="tension-rise", pad=1.2, claims=["C5"])

# ================================================================ 5 · THE PAPER TRAIL
scene("c42_text", "ws_insert", {
    "env": "home_night", "grade": "aftermath", "chip": "THURSDAY · 21:14", "chapter_tag": {"n": "CHAPTER 5", "title": "The paper trail", "y": 860, "hold": 4}, "hand_who": "daniel",
    "ui": {"kind": "phone", "contact": "Graham Royce", "time": "21:14", "colour": "#8c3b4a", "messages": [
        {"text": "Ruth wants five minutes with you before tomorrow's Ostrel review.", "at": 1.2, "typing_from": 0.3},
        {"text": "Just confirm it was an extract issue and we can all move on.", "at": 3.1, "typing_from": 2.1},
        {"text": "Thanks for having my back.", "at": 4.9, "typing_from": 4.0}]}},
    cue="cold", min_d=7.4, chapter="The paper trail", sfx=[(1.2, "buzz"), (3.1, "buzz"), (4.9, "buzz")],
    note="Text from Graham: Ruth wants five minutes before tomorrow's review. Just confirm it was an extract issue. Thanks for having my back.")

scene("c43_bigger", "ws_stage", {
    "env": "home_night", "grade": "aftermath", "bg_blur": 3, "camera": {"zoom": [1.0, 1.06]},
    "actors": [A("daniel", 880, 440, 1.0, [K(0, expr="tight", gaze=[0.1, 0.7], turn=0.1, tilt=3), K(line=1, off=1.4, expr="realise", gaze=[0.2, 0.6], turn=0.12, tilt=1)],
                 arms=[ARM(0, l="rest", r="phone")], light="phone")]},
    [N("The first favour was to stay quiet.", pause_before=0.51), N("This one was to say something untrue, to a director, about a colleague.", pause_before=0.26)],
    cue="cold", pad=1.0, sfx=[(0.0, "rain")])

scene("c44_control", "ws_stage", {
    "env": "home_night", "grade": "aftermath", "bg_blur": 2, "rain": True, "camera": {"zoom": [1.06, 1.0], "x": [-40, 0]},
    "actors": [A("daniel", 1180, 440, 0.95, [K(0, expr="tight", gaze=[-0.6, -0.1], turn=-0.45, tilt=-2), K(line=1, off=0.0, expr="neutral", gaze=[-0.3, 0.1], turn=-0.25), K(line=2, off=0.8, expr="confident", gaze=[0.0, 0.05], turn=-0.05, tilt=-2)],
                 arms=[ARM(0, l="cross", r="cross"), ARM(line=1, off=0.0, l="rest", r="rest", dur=0.8)], light="right")]},
    [N("Daniel couldn't know what Graham intended.", pause_before=0.42), N("But he could control four things:", pause_before=0.51),
     N("what he wrote down, what he confirmed, what he asked, and what he corrected.")],
    cue="aftermath")

scene("c45_notes", "ws_insert", {
    "env": "home_night", "grade": "aftermath",
    "ui": {"kind": "notes", "title": "Ostrel Q3: what happened", "items": [
        {"when": "Mon 09:03", "text": "Found the Northfield filter on the dashboard, left on since the migration.", "at": 0.6},
        {"when": "Mon 09:07", "text": "Told Graham. Agreed to leave it out of the client notes until fixed at source.", "at": 2.4},
        {"when": "Tue 14:20", "text": "Ostrel query. Graham tells Ruth the extract is Leah's.", "at": 4.4},
        {"when": "Wed 11:00", "text": "Re-checked Leah's extract. It is correct.", "at": 6.0}]}},
    [N("First, he wrote it down.", pause_before=0.34), N("Dates, times, facts. No adjectives.", pause_before=0.51)],
    cue="aftermath", pad=2.0, sfx=[(0.6, "tick"), (2.4, "tick"), (4.4, "tick"), (6.0, "tick")])

scene("c46_email", "ws_insert", {
    "env": "open_plan", "grade": "day", "chip": "FRIDAY · 08:12",
    "ui": {"kind": "email", "from": "Daniel Hale", "to": "Graham Royce", "subject": "Ostrel Q3: before I meet Ruth", "type_at": 0.4, "cps": 40,
           "body": ["Hi Graham,", "", "Just to confirm before I see Ruth: on Monday we agreed to leave the Northfield filter out of the client notes until it was fixed at source.",
                    "Has that fix been made? Leah's extract is correct, so I'd like to explain the difference accurately.", "Happy to draft the correction for Ostrel.", "", "Thanks, Daniel"],
           "highlight": ["Has that fix been made?"], "highlight_at": "L1+0.0", "stamp": {"text": "SENT", "at": "L2+1.6"}}},
    [N("Then he confirmed it in writing.", pause_before=0.51), N("He asked a neutral question. No accusation.", pause_before=1.53),
     N("Just the facts, and a way forward.", pause_before=0.26)],
    cue="power", gain=-5, pad=1.8)

scene("c47_same_page", "ws_stage", {
    "env": "open_plan", "grade": "neutral", "bg_blur": 3, "camera": {"zoom": [1.0, 1.05]}, "desk": desk(),
    "actors": [A("daniel", seated=True, **DAN_DESK, acting=[K(0, expr="neutral", gaze=[0.7, -0.2], turn=0.45), K(line=1, off=0.0, expr="tight", gaze=[0.7, -0.22], turn=0.45, tilt=2), K(line=3, off=0.0, expr="confident", gaze=[0.7, -0.25], turn=0.45, tilt=-2)],
                 arms=[ARM(0, l="desk", r="desk"), ARM(line=1, off=0.2, r="talk"), ARM(line=1, off=1.8, r="desk"), ARM(line=3, off=0.3, r="open"), ARM(line=3, off=2.2, r="desk")]),
               A("graham", 1500, 340, 0.86, [K(0, expr="pleased", gaze=[-0.6, 0.3], turn=-0.42, tilt=3), K(line=2, off=0.0, expr="charm", gaze=[-0.6, 0.32], turn=-0.42, tilt=4, lean=-3), K(line=3, off=1.0, expr="tight", gaze=[-0.6, 0.3], turn=-0.42, tilt=0, lean=0)],
                 arms=[ARM(0, l="paper", r="paper"), ARM(line=2, off=0.0, l="rest", r="talk"), ARM(line=3, off=0.4, r="rest")], light="right")]},
    [S("graham", "Daniel. Did we really need all that in an email?", pause_before=0.51), S("daniel", "I just want us to be accurate.", pause_before=0.26),
     S("graham", "I thought we were on the same page.", pause_before=0.34), S("daniel", "We are. That's why I wrote it down.", pause_before=0.51)],
    cue="unease")

scene("c48_warmth_drains", "ws_stage", {
    "env": "open_plan", "grade": "neutral", "bg_blur": 5, "camera": {"zoom": [1.04, 1.12]},
    "actors": [A("graham", 960, 450, 1.3, [K(0, expr="charm", gaze=[-0.3, 0.2], turn=-0.2, tilt=3), K(0.8, expr="cool_smile", gaze=[-0.3, 0.2], turn=-0.2, tilt=1, dur=0.8), K(1.8, expr="tight", gaze=[-0.25, 0.25], turn=-0.18, tilt=0, dur=0.8)],
                 arms=[ARM(0, l="rest", r="rest")], light="right")]},
    cue="hush", min_d=3.0, gain=-6, sfx=[(0.6, "thump")], note="Graham's smile fades.")

# ================================================================ 6 · FRIDAY, 10:00
TABLE = {"kind": "table", "back": 742, "front": 900, "x0": 150, "x1": 1770, "slant": 80, "items": [{"kind": "laptop", "x": 960}, {"kind": "glass", "x": 600}, {"kind": "notebook", "x": 1340}, {"kind": "glass", "x": 1500}]}
SLIDE = {"title": "Ostrel Foods · Q3 service", "bars": [["Ashby", 95.0], ["Barrow", 93.0], ["Carlton", 92.5], ["Total", 93.4, "#8a92a0"]], "target": 93.0}
scene("c49_meeting", "ws_stage", {
    "env": "meeting_room", "grade": "neutral", "chip": "FRIDAY · 10:00", "bg_blur": 1, "slide": SLIDE, "chapter_tag": {"n": "CHAPTER 6", "title": "Friday, 10:00", "hold": 4}, "camera": {"zoom": [1.0, 1.04]}, "desk": TABLE,
    "actors": [A("leah", 540, 460, 0.66, [K(0, expr="tight", gaze=[0.5, 0.3], turn=0.3)], arms=[ARM(0, l="desk", r="desk")], seated=True),
               A("ruth", 960, 440, 0.7, [K(0, expr="neutral", gaze=[-0.6, 0.3], turn=-0.3), K(line=0, off=1.8, expr="skeptical", gaze=[-0.7, 0.4], turn=-0.35, tilt=-2)], arms=[ARM(0, l="steeple", r="steeple")], seated=True),
               A("graham", 1400, 450, 0.7, [K(0, expr="pleased", gaze=[-0.6, 0.35], turn=-0.4), K(line=0, off=2.8, expr="charm", gaze=[-0.8, 0.45], turn=-0.45, tilt=3)], arms=[ARM(0, l="desk", r="desk")], seated=True, light="right"),
               A("daniel", 240, 700, 1.25, [K(0, gaze=[0.5, 0], turn=0.5)], view="back")]},
    [S("ruth", "Before Ostrel join us: Daniel, Graham says you can explain the data issue.", pause_before=0.68)],
    cue="tension", chapter="Friday, 10:00")

scene("c50_graham_nods", "ws_stage", {
    "env": "meeting_room", "grade": "warm", "bg_blur": 4, "slide": SLIDE, "camera": {"zoom": [1.0, 1.06]},
    "actors": [A("graham", 1000, 450, 1.15, [K(0, expr="pleased", gaze=[-0.5, 0.15], turn=-0.3), K(0.6, expr="charm", gaze=[-0.5, 0.1], turn=-0.3, tilt=5), K(1.1, tilt=-1), K(1.6, tilt=3)], arms=[ARM(0, l="steeple", r="steeple")], light="right")]},
    cue="hush", min_d=2.8, gain=-6, sfx=[(0.3, "thump"), (1.1, "thump"), (1.9, "thump")], note="Graham smiles at Daniel and nods.")

scene("c51_daniel_speaks", "ws_stage", {
    "env": "meeting_room", "grade": "neutral", "bg_blur": 4, "slide": SLIDE, "camera": {"zoom": [1.0, 1.08]},
    "actors": [A("daniel", 900, 460, 1.15, [K(0, expr="tight", gaze=[0.3, 0.5], turn=0.2, tilt=2), K(line=0, off=0.0, expr="neutral", gaze=[0.5, 0.05], turn=0.3), K(line=2, off=0.4, expr="neutral", gaze=[0.6, 0.05], turn=0.35, tilt=-2)],
                 arms=[ARM(0, l="desk", r="desk"), ARM(line=1, off=0.3, r="talk"), ARM(line=2, off=2.6, r="desk")], seated=True,
                 )], "desk": {"kind": "table", "back": 800, "front": 960, "slant": 40, "items": [{"kind": "notebook", "x": 700}]}},
    [S("daniel", "Leah's extract was correct.", pause_before=1.02), S("daniel", "The difference is a filter on our dashboard that excluded Northfield.", pause_before=0.26),
     S("daniel", "I spotted it on Monday, before the report went out, and told Graham.", pause_before=0.26)],
    cue="hush", gain=-4)

scene("c52_leah_reacts", "ws_stage", {
    "env": "meeting_room", "grade": "neutral", "bg_blur": 4, "slide": SLIDE, "camera": {"zoom": [1.0, 1.05]},
    "actors": [A("leah", 960, 460, 1.12, [K(0, expr="tight", gaze=[0.3, 0.5], turn=0.2), K(0.4, expr="realise", gaze=[0.5, 0.0], turn=0.3, tilt=-2)], arms=[ARM(0, l="desk", r="desk")], seated=True)],
    "desk": {"kind": "table", "back": 800, "front": 960, "slant": 40, "items": []}},
    cue="hush", min_d=2.0, gain=-4, note="Leah looks up.")

scene("c53_correcting", "ws_stage", {
    "env": "meeting_room", "grade": "power", "bg_blur": 4, "slide": SLIDE, "camera": {"zoom": [1.08, 1.16]},
    "actors": [A("daniel", 900, 460, 1.15, [K(0, expr="neutral", gaze=[0.5, 0.05], turn=0.3), K(line=1, off=0.0, expr="guilty", gaze=[0.4, 0.3], turn=0.25), K(line=2, off=0.4, expr="confident", gaze=[0.5, 0.0], turn=0.3, tilt=-2)],
                 arms=[ARM(0, l="desk", r="desk"), ARM(line=2, off=0.2, r="open"), ARM(line=2, off=2.4, r="desk")], seated=True)],
    "desk": {"kind": "table", "back": 800, "front": 960, "slant": 40, "items": [{"kind": "notebook", "x": 700}]}},
    [S("daniel", "We agreed not to flag it.", pause_before=0.26), S("daniel", "I should have corrected that on Tuesday.", pause_before=0.42), S("daniel", "I'm correcting it now.", pause_before=0.34)],
    cue="power", gain=-3, pad=0.8)

scene("c54_graham_q", "ws_stage", {
    "env": "meeting_room", "grade": "cold", "bg_blur": 3, "slide": SLIDE, "camera": {"zoom": [1.0, 1.04]}, "desk": TABLE,
    "actors": [A("ruth", 760, 440, 0.86, [K(0, expr="skeptical", gaze=[-0.4, 0.2], turn=-0.25), K(0.4, expr="cold", gaze=[0.7, 0.05], turn=0.45, tilt=-2)], arms=[ARM(0, l="steeple", r="steeple")], seated=True),
               A("graham", 1360, 450, 0.82, [K(0, expr="frozen", gaze=[-0.7, 0.3], turn=-0.42), K(line=0, off=0.6, expr="tight", gaze=[-0.5, 0.0], turn=-0.35)], arms=[ARM(0, l="desk", r="desk")], seated=True, light="right")]},
    [S("ruth", "Graham?", pause_before=0.51)], cue="cold", pad=0.8)

scene("c55_fair_summary", "ws_stage", {
    "env": "meeting_room", "grade": "neutral", "bg_blur": 4, "slide": SLIDE, "camera": {"zoom": [1.0, 1.07]},
    "actors": [A("graham", 1000, 450, 1.15, [K(0, expr="tight", gaze=[-0.5, 0.1], turn=-0.3), K(line=0, off=1.0, expr="cool_smile", gaze=[-0.5, 0.05], turn=-0.3, tilt=2), K(line=1, off=0.6, expr="pleased", gaze=[-0.45, 0.1], turn=-0.28, tilt=3)],
                 arms=[ARM(0, l="steeple", r="steeple"), ARM(line=1, off=0.4, r="open"), ARM(line=1, off=3.0, r="steeple")], light="right")]},
    [S("graham", "That's... a fair summary.", pause_before=0.51), S("graham", "I meant to fix it before it mattered. I should have been clearer.", pause_before=0.34)],
    cue="cold")

scene("c56_calm", "ws_stage", {
    "env": "meeting_room", "grade": "neutral", "bg_blur": 5, "slide": SLIDE, "camera": {"zoom": [1.07, 1.14]},
    "actors": [A("graham", 1000, 460, 1.3, [K(0, expr="pleased", gaze=[-0.45, 0.1], turn=-0.28, tilt=3), K(2.0, expr="neutral", gaze=[-0.3, 0.3], turn=-0.2)], arms=[ARM(0, l="steeple", r="steeple")], light="right")]},
    [N("Calm. Reasonable. Not a raised voice, even now.", pause_before=0.26)], cue="cold", pad=0.8)

scene("c57_ruth_decides", "ws_stage", {
    "env": "meeting_room", "grade": "power", "bg_blur": 3, "slide": SLIDE, "camera": {"zoom": [1.0, 1.05]},
    "actors": [A("ruth", 960, 440, 1.08, [K(0, expr="neutral", gaze=[0.4, 0.05], turn=0.25), K(line=1, off=0.2, expr="confident", gaze=[0.2, 0.05], turn=0.1), K(line=2, off=0.0, expr="pleased", gaze=[-0.6, 0.05], turn=-0.4, tilt=-2)],
                 arms=[ARM(0, l="steeple", r="steeple"), ARM(line=0, off=0.4, r="talk"), ARM(line=1, off=0.2, r="point"), ARM(line=2, off=0.0, r="steeple", l="steeple")])],
    "desk": {"kind": "table", "back": 800, "front": 960, "slant": 40, "items": [{"kind": "laptop", "x": 1300}]}},
    [S("ruth", "Then Ostrel get the corrected figure today.", pause_before=0.42), S("ruth", "From now on, every dashboard change gets logged.", pause_before=0.26),
     S("ruth", "Leah, I'm sorry. You were right.", pause_before=0.51)],
    cue="power")

scene("c58_tuesday", "ws_stage", {
    "env": "meeting_room", "grade": "power", "bg_blur": 2, "slide": SLIDE, "camera": {"zoom": [1.0, 1.04]}, "desk": TABLE,
    "actors": [A("ruth", 1240, 440, 0.86, [K(0, expr="pleased", gaze=[-0.6, 0.05], turn=-0.4), K(line=0, off=0.6, expr="cool_smile", gaze=[-0.65, 0.05], turn=-0.42, tilt=-3)], arms=[ARM(0, l="steeple", r="steeple")], seated=True, light="right"),
               A("daniel", 640, 450, 0.86, [K(0, expr="tight", gaze=[0.6, 0.05], turn=0.4), K(line=1, off=0.0, expr="pleased", gaze=[0.6, 0.05], turn=0.4, tilt=3)], arms=[ARM(0, l="desk", r="desk")], seated=True)]},
    [S("ruth", "And Daniel? Next time, say it on Tuesday.", pause_before=0.51), S("daniel", "Next time, Tuesday.", pause_before=0.42)],
    cue="warm", pad=1.0)

# ================================================================ 7 · AFTER
scene("c59_kitchen_after", "ws_stage", {
    "env": "kitchen", "tod": "evening", "grade": "warm", "chip": "FRIDAY · 16:30", "bg_blur": 3, "chapter_tag": {"n": "CHAPTER 7", "title": "Two conversations", "hold": 4}, "camera": {"zoom": [1.0, 1.05]},
    "actors": [A("daniel", 700, 420, 0.92, [K(0, expr="neutral", gaze=[0.6, 0.05], turn=0.4), K(line=1, off=0.0, expr="guilty", gaze=[0.4, 0.4], turn=0.3), K(line=3, off=0.0, expr="realise", gaze=[0.6, 0.0], turn=0.42), K(line=4, off=0.5, expr="tight", gaze=[0.6, 0.05], turn=0.4)],
                 arms=[ARM(0, r="mug", l="rest"), ARM(line=3, off=0.2, r="open"), ARM(line=4, off=0.0, r="mug")], mug_colour="#4f7cac"),
               A("leah", 1260, 400, 0.9, [K(0, expr="neutral", gaze=[-0.6, 0.05], turn=-0.42), K(line=2, off=0.0, expr="skeptical", gaze=[-0.6, 0.05], turn=-0.42, tilt=3), K(line=4, off=0.3, expr="pleased", gaze=[-0.6, 0.05], turn=-0.42, tilt=-2)],
                 arms=[ARM(0, l="mug", r="rest"), ARM(line=2, off=0.0, r="talk"), ARM(line=2, off=3.0, r="rest")], mug_colour="#e06a4f", light="right")]},
    [S("leah", "You could have said it on Tuesday.", pause_before=0.68), S("daniel", "I know.", pause_before=0.42),
     S("leah", "Graham told me on Tuesday you'd raised concerns about my extract.", pause_before=0.51),
     S("daniel", "I never said that.", pause_before=0.51), S("leah", "I know. Now.", pause_before=0.42)],
    cue="aftermath", chapter="Two conversations")

scene("c60_split", "ws_explainer", {"ex": {"kind": "split", "title": "Two conversations", "sub": "TUESDAY AND WEDNESDAY", "link": "Each of them was watching the other", "link_at": "L2+0.0",
    "sides": [{"who": "daniel", "name": "Daniel", "quote": "Keep an eye on her for me.", "at": "L0+0.3"}, {"who": "leah", "name": "Leah", "quote": "Daniel has concerns about your extract.", "at": "L1+0.3"}]}},
    [N("Graham had asked Daniel to keep an eye on Leah.", pause_before=0.34), N("And he'd told Leah that Daniel had doubts about her.", pause_before=0.42),
     N("Each of them had been watching the other.", pause_before=0.51)],
    cue="aftermath", pad=1.0)

scene("c61_manipulator", "ws_stage", {
    "env": "glass_office", "tod": "night", "grade": "aftermath", "bg_blur": 3, "camera": {"zoom": [1.0, 1.08], "x": [40, 0]},
    "desk": {"back": 724, "front": 884, "x0": 600, "x1": 1500, "slant": 50, "items": [{"kind": "laptop", "x": 1240}, {"kind": "mug", "x": 760, "colour": "#8c3b4a"}]},
    "actors": [A("graham", 1000, 430, 0.84, [K(0, expr="neutral", gaze=[0.3, 0.55], turn=0.15), K(line=2, off=0.4, expr="cool_smile", gaze=[0.1, 0.5], turn=0.05)],
                 arms=[ARM(0, l="polish", r="polish")], glasses_off=[{"t": 0, "dur": 60}], seated=True, light="right")]},
    [N("Was Graham a manipulator?", pause_before=0.68), N("Or just a likeable man protecting himself, one small, reasonable request at a time?", pause_before=0.34),
     N("Daniel never found out for certain. He didn't need to.", pause_before=0.68)],
    cue="aftermath", claims=["C3"])

scene("c62_closing_line", "ws_stage", {
    "env": "glass_office", "tod": "night", "grade": "aftermath", "bg_blur": 6, "camera": {"zoom": [1.06, 1.2]},
    "actors": [A("graham", 960, 470, 1.4, [K(0, expr="neutral", gaze=[0.2, 0.5], turn=0.1, tilt=2), K(line=1, off=0.3, expr="neutral", gaze=[0.05, 0.1], turn=0.02), K(line=2, off=0.8, expr="cool_smile", gaze=[0, 0], turn=0, tilt=-2)],
                 arms=[ARM(0, l="polish", r="polish"), ARM(line=1, off=0.0, l="steeple", r="steeple", dur=0.9)], glasses_off=[{"t": 0, "dur": 3.0}], light="right")]},
    [N("Because the trap was never the favour.", pause_before=0.68), N("The manager didn't need everyone to trust him.", pause_before=0.51),
     N("He only needed everyone to distrust each other.", pause_before=0.42)],
    cue="cold", pad=1.6, gain=-3)

# ================================================================ WHAT TO DO INSTEAD
scene("c63_moves", "ws_explainer", {"ex": {"kind": "moves", "title": "Four moves", "sub": "IF IT HAPPENS TO YOU", "items": [
    {"title": "Write down what was asked", "sub": "Dates, times, facts. No adjectives.", "at": "L2+1.0"},
    {"title": "Confirm it in writing", "sub": "“Just to confirm what we agreed…”", "at": "L3+0.0"},
    {"title": "Ask neutral questions", "sub": "“Has that fix been made?”", "at": "L4+0.0"},
    {"title": "Correct the record early", "sub": "Silence gets more expensive every day.", "at": "L5+0.0"}]}},
    [N("Most favours are just kindness.", pause_before=0.51),
     N("The warning sign is a favour that asks you to hide something.", pause_before=0.34),
     N("If that happens: write down what was asked.", pause_before=0.42), N("Confirm it in writing."), N("Ask neutral questions."),
     N("And correct the record early. Silence gets more expensive every day.")],
    cue="warm", chapter="What to do instead", pad=1.2)

scene("c64_end", "ws_end", {"question": "Have you ever been asked for a small favour at work that turned out not to be small?",
                            "tag": "EPISODE 1 · THE FAVOUR", "notice": "A fictional story. Characters and companies are invented.", "brand_at": "L1+3.2", "fade_out": 1.2},
    [N("Have you ever been asked for a small favour at work that turned out not to be small?", pause_before=0.68),
     N("What did you do, or what do you wish you'd done?", pause_before=0.51)],
    cue="outro", pad=2.6, caption_mode="none", transition="fade")


# ---------------------------------------------------------------- episode
SOURCES = [
    {"id": "S1", "title": "The norm of reciprocity: A preliminary statement (Gouldner, 1960), American Sociological Review 25(2):161-178", "publisher": "American Sociological Association / JSTOR", "url": "https://doi.org/10.2307/2092623", "accessed": "2026-10-11"},
    {"id": "S2", "title": "Effects of a favor and liking on compliance (Regan, 1971), Journal of Experimental Social Psychology 7(6):627-639", "publisher": "Elsevier", "url": "https://doi.org/10.1016/0022-1031(71)90025-4", "accessed": "2026-10-11"},
    {"id": "S3", "title": "Cognitive consequences of forced compliance (Festinger & Carlsmith, 1959), J. Abnormal and Social Psychology 58(2):203-210", "publisher": "American Psychological Association (PubMed 13640824)", "url": "https://pubmed.ncbi.nlm.nih.gov/13640824/", "accessed": "2026-10-11"},
    {"id": "S4", "title": "A multilab replication of the induced-compliance paradigm of cognitive dissonance (Vaidis et al., 2024), AMPPS 7(1)", "publisher": "SAGE / Association for Psychological Science", "url": "https://doi.org/10.1177/25152459231213375", "accessed": "2026-10-11"},
    {"id": "S5", "title": "Pluralistic ignorance and alcohol use on campus (Prentice & Miller, 1993), JPSP 64(2):243-256", "publisher": "American Psychological Association", "url": "https://doi.org/10.1037/0022-3514.64.2.243", "accessed": "2026-10-11"},
    {"id": "S6", "title": "Organizational silence (Morrison & Milliken, 2000), Academy of Management Review 25(4):706-725", "publisher": "Academy of Management", "url": "https://doi.org/10.2307/259200", "accessed": "2026-10-11"},
    {"id": "S7", "title": "Compliance without pressure: The foot-in-the-door technique (Freedman & Fraser, 1966), JPSP 4(2):195-202", "publisher": "American Psychological Association (PubMed 5969145)", "url": "https://pubmed.ncbi.nlm.nih.gov/5969145/", "accessed": "2026-10-11"},
    {"id": "S8", "title": "The slippery slope (Welsh, Ordonez, Snyder & Christian, 2015), Journal of Applied Psychology 100(1):114-127", "publisher": "American Psychological Association", "url": "https://doi.org/10.1037/a0036950", "accessed": "2026-10-11"},
]
CLAIMS = [
    {"id": "C1", "type": "established", "text": "Reciprocity: people tend to feel obliged to return favours; in Regan (1971) favour recipients bought about twice as many raffle tickets.", "sources": ["S1", "S2"]},
    {"id": "C2", "type": "established", "text": "Cognitive dissonance: discomfort when actions conflict with values, often reduced by changing beliefs; recent large replications found weaker effects.", "sources": ["S3", "S4"]},
    {"id": "C3", "type": "illustrative", "text": "Graham's intent is deliberately left ambiguous; the episode does not diagnose him.", "sources": []},
    {"id": "C4", "type": "established", "text": "Pluralistic ignorance: group members privately doubt a norm but assume others accept it (Prentice & Miller, 1993); organisational silence.", "sources": ["S5", "S6"]},
    {"id": "C5", "type": "established", "text": "Foot-in-the-door: agreeing to a small request raises compliance with a larger one (Freedman & Fraser, 1966); small transgressions can escalate (Welsh et al., 2015).", "sources": ["S7", "S8"]},
    {"id": "F1", "type": "illustrative", "text": "All company figures are invented and internally consistent: 93.4% excluding Northfield, 92.6% including it (Northfield 81.1% on 6.5% of volume).", "sources": []},
]

EPISODE = {
    "id": EP_ID, "number": 1, "series": "THE QUIET GAME", "title": "The Favour",
    "youtube_title": "The Nicest Person in the Office Might Be Playing You",
    "central_question": "When does a small favour at work stop being kindness and become a trap?",
    "template": "thriller", "format": "landscape", "narrator_voice": "en_GB-alba-medium", "target_duration_seconds": [420, 560],
    "visual_mode": "svg", "caption_style": "thriller", "cast": ["daniel", "graham", "leah", "ruth", "narrator"],
    "fiction_notice": "A fictional story. Characters, companies and events are invented. The psychology is real.",
    "music": {"bpm": 84},
    "figures": {"with_filter": 93.4, "without_filter": 92.6, "target": 93.0, "northfield": 81.1, "northfield_share": 0.065,
                "others": {"Ashby": [95.0, 0.3], "Barrow": [93.0, 0.3], "Carlton": [92.5, 0.4]}},
    "scenes": SCENES, "claims": CLAIMS, "sources": SOURCES,
    # YouTube thumbnail (pipeline/thumbnail.py): the friendly manager, the uneasy employee, the secret between them
    "thumbnail": {
        "actors": [
            A("graham", 640, 470, 1.22, [K(0, expr="charm", gaze=[0.35, 0.05], turn=0.25, tilt=4, lean=4)], arms=[ARM(0, r="rest", l="rest")], rim="#ffc27a"),
            A("daniel", 1420, 500, 1.55, [K(0, expr="guilty", gaze=[-0.85, 0.08], turn=-0.18, tilt=-3)], arms=[ARM(0, l="rest", r="rest")], light="right", rim="#7fe8ff")],
        "secret": {"x": 1000, "y": 880, "rot": -6, "shown": "93.4%", "real": "92.6%"},
        "text": {"x": 70, "y": 170, "size": 128, "a": "JUST A", "b": "FAVOUR?", "bw": 700}},
}

if __name__ == "__main__":
    d = ROOT / "episodes" / EP_ID
    d.mkdir(parents=True, exist_ok=True)
    (d / "episode.json").write_text(json.dumps(EPISODE, indent=1, ensure_ascii=False) + "\n")
    js = ROOT / "renderer" / "scenes" / f"{EP_ID}.js"
    if not js.exists():
        js.write_text("/* The Quiet Game, Episode 1. All scene types (ws_*) live in renderer/widescreen.js; nothing episode-specific is needed. */\n")
    words = sum(len(l["text"].split()) for s in SCENES for l in s.get("lines", []))
    print(f"wrote {d / 'episode.json'}: {len(SCENES)} scenes, {words} spoken words")
