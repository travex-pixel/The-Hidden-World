"""THE QUIET GAME — Episode 2: The Credit. Source of truth for the long-form script and shot plan.

usage: python series/the-quiet-game/make_the_credit.py   -> writes episodes/qg02-the-credit/episode.json

Two weeks after "The Favour". Leah suggests a fix over coffee; on Wednesday Daniel pitches it to Ruth as his own
and genuinely believes it is. Shot types come from renderer/widescreen.js; helpers from qg_lib.py.
"""
from __future__ import annotations
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
EP_ID = "qg02-the-credit"
SCENES: list[dict] = []
sys.path.insert(0, str(Path(__file__).resolve().parent))
from qg_lib import N, S, K, ARM, A, desk, DAN_DESK, LEAH_SIDE, scene as _scene  # noqa: E402


def scene(*a, **kw):
    _scene(SCENES, *a, **kw)


SLIDE_PITCH = {"title": "Northfield: evening runs via Barrow", "bullets": ["Late runs all leave after 18:00", "Barrow trucks idle after 18:00", "~40 late deliveries recovered a week"]}
MEET = {"kind": "table", "back": 742, "front": 900, "x0": -60, "x1": 1000, "slant": 80, "items": [{"kind": "laptop", "x": 760}, {"kind": "glass", "x": 380}, {"kind": "notebook", "x": 120}]}
LEAH_DESK = {"back": 720, "front": 880, "items": [{"kind": "monitor", "x": 640, "flip": False}, {"kind": "keyboard", "x": 1020}, {"kind": "notebook", "x": 1330, "colour": "#e06a4f"}]}

# ================================================================ COLD OPEN
scene("d01_cold_pitch", "ws_stage", {
    "env": "meeting_room", "grade": "power", "flash": True, "chip": "WEDNESDAY · 10:14", "bg_blur": 1, "slide": SLIDE_PITCH, "desk": MEET,
    "camera": {"zoom": [1.1, 1.0], "x": [80, 0]},
    "actors": [A("ruth", 250, 470, 0.64, [K(0, expr="neutral", gaze=[0.8, -0.1], turn=0.45)], arms=[ARM(0, l="steeple", r="steeple")], seated=True),
               A("leah", 520, 470, 0.64, [K(0, expr="neutral", gaze=[0.8, -0.15], turn=0.45), K(line=0, off=1.6, expr="realise", gaze=[0.8, -0.15], turn=0.45, tilt=-2)], arms=[ARM(0, l="desk", r="desk")], seated=True),
               A("daniel", 1520, 380, 0.84, [K(0, expr="confident", gaze=[-0.5, 0.1], turn=-0.35), K(line=0, off=2.0, expr="pleased", gaze=[-0.6, 0.15], turn=-0.4, tilt=3)],
                 arms=[ARM(0, l="point", r="rest"), ARM(line=0, off=2.4, l="rest", r="talk")], light="right")]},
    [S("daniel", "What if Northfield's late runs went through Barrow instead?", pause_before=0.4)],
    cue="power", chapter="Wednesday, 10:14", sfx=[(0.0, "swell")])

scene("d02_cold_leah", "ws_stage", {
    "env": "meeting_room", "grade": "cold", "flash": True, "bg_blur": 5, "slide": SLIDE_PITCH, "camera": {"zoom": [1.0, 1.1]},
    "desk": {"kind": "table", "back": 800, "front": 960, "slant": 40, "items": [{"kind": "notebook", "x": 700, "colour": "#e06a4f"}]},
    "actors": [A("leah", 960, 450, 1.25, [K(0, expr="neutral", gaze=[0.6, 0.0], turn=0.35), K(1.2, expr="frozen", gaze=[0.65, -0.05], turn=0.38), K(5.5, expr="tight", gaze=[0.2, 0.55], turn=0.12, tilt=3)],
                 arms=[ARM(0, l="desk", r="desk")], seated=True, light="right")]},
    [N("At 10:14 on Wednesday, Daniel Hale pitched the best idea of his career.", pause_before=0.6),
     N("There was one problem. It wasn't his.", pause_before=0.4), N("And the strange part? He had no idea.", pause_before=0.5)],
    cue="cold", pad=0.6, sfx=[(1.2, "thump")])

scene("d03_title", "ws_title", {"title": "THE QUIET GAME", "subtitle": "EPISODE 2 · THE CREDIT", "notice": "A fictional story. The psychology is real."},
      cue="hush", min_d=4.3, sfx=[(0.3, "swell")], note="Title card: The Quiet Game, Episode 2, The Credit.")

# ================================================================ 1 · THE SHORTLIST
scene("d04_calmer", "ws_stage", {
    "env": "open_plan", "grade": "day", "chip": "TWO WEEKS EARLIER", "rewind": 1.0, "bg_blur": 3, "chapter_tag": {"n": "CHAPTER 1", "title": "The shortlist", "hold": 5},
    "camera": {"zoom": [1.1, 1.0], "x": [-40, 0]}, "desk": desk({"kind": "mug", "x": 420, "colour": "#4f7cac"}),
    "actors": [A("daniel", seated=True, **DAN_DESK, acting=[K(0, expr="neutral", gaze=[0.55, 0.35], turn=0.32), K(line=2, off=0.4, expr="pleased", gaze=[0.75, -0.15], turn=0.45, tilt=-2)],
                 arms=[ARM(0, l="typing", r="typing"), ARM(line=2, off=0.4, l="desk", r="desk")]),
               A("leah", 1500, 360, 0.78, [K(0, expr="pleased", gaze=[-0.7, 0.25], turn=-0.45, x=2100), K(line=2, off=0.0, x=1500, dur=1.4), K(line=2, off=1.6, expr="pleased", gaze=[-0.7, 0.25], turn=-0.45, tilt=3)],
                 arms=[ARM(0, l="mug", r="rest")], mug_colour="#e06a4f", light="right")]},
    [N("Two weeks after the Ostrel report, things at Halvern were calmer.", pause_before=0.9), N("Every dashboard change was logged."),
     N("And Daniel and Leah were friends again.", pause_before=0.2)],
    cue="curious", chapter="The shortlist", sfx=[(0.0, "whoosh")])

scene("d05_announcement", "ws_insert", {
    "env": "open_plan", "grade": "neutral",
    "ui": {"kind": "email", "from": "Ruth Adeyemi", "to": "Client Reporting team", "subject": "Senior Analyst: shortlist conversations on Wednesday",
           "body": ["Team,", "", "We're appointing one Senior Analyst this month.", "Shortlisted: Daniel Hale and Leah Carter.",
                    "On Wednesday, bring one idea that would fix a depot.", "", "Ruth"], "highlight": ["Daniel Hale and Leah Carter"], "highlight_at": "L1+0.2"}},
    [N("Then Ruth announced a promotion.", pause_before=0.5), N("One Senior Analyst role. Two names on the shortlist."),
     N("Bring one idea that would fix a depot.", pause_before=0.3)],
    cue="tension-rise", sfx=[(0.3, "ping")], claims=["F1"])

scene("d05b_leah_stake", "ws_stage", {
    "env": "open_plan", "grade": "warm", "bg_blur": 4, "glass_office": False, "camera": {"zoom": [1.05, 1.0], "x": [30, 0]}, "desk": LEAH_DESK,
    "actors": [A("leah", 1040, 420, 0.86, [K(0, expr="neutral", gaze=[-0.55, 0.35], turn=-0.32, tilt=2), K(line=1, off=1.0, expr="tight", gaze=[-0.3, 0.5], turn=-0.2, tilt=3), K(line=2, off=0.6, expr="confident", gaze=[-0.5, 0.3], turn=-0.3)],
                 arms=[ARM(0, l="typing", r="typing"), ARM(line=1, off=0.4, r="chin", l="desk"), ARM(line=2, off=1.2, l="typing", r="typing")], light="right", seated=True)]},
    [N("For Leah, this was about more than a title.", pause_before=0.5), N("Two weeks earlier, she'd been blamed for a mistake that wasn't hers."),
     N("A promotion would mean nobody doubted her work again.", pause_before=0.3)],
    cue="intimate")

scene("d05c_daniel_stake", "ws_stage", {
    "env": "open_plan", "grade": "warm", "bg_blur": 4, "camera": {"zoom": [1.0, 1.06]}, "desk": desk({"kind": "mug", "x": 420, "colour": "#8c3b4a"}),
    "glass_figures": [{"x": 1640, "sway": True}],
    "actors": [A("daniel", seated=True, **DAN_DESK, acting=[K(0, expr="neutral", gaze=[0.6, 0.35], turn=0.32), K(line=1, off=0.4, expr="neutral", gaze=[0.9, -0.3], turn=0.55, tilt=-2), K(line=2, off=0.8, expr="tight", gaze=[0.5, 0.45], turn=0.3)],
                 arms=[ARM(0, l="typing", r="typing"), ARM(line=1, off=0.4, l="desk", r="desk")])]},
    [N("Daniel wanted it too.", pause_before=0.4), N("Graham had put his name forward weeks ago."),
     N("And Graham had made it clear he was expecting something big.", pause_before=0.2)],
    cue="intimate")

scene("d06_rivals", "ws_stage", {
    "env": "open_plan", "grade": "warm", "bg_blur": 3, "camera": {"zoom": [1.0, 1.05]}, "desk": desk(),
    "actors": [A("daniel", seated=True, **DAN_DESK, acting=[K(0, expr="neutral", gaze=[0.7, -0.15], turn=0.45), K(line=1, off=0.0, expr="pleased", gaze=[0.7, -0.18], turn=0.45, tilt=-3)],
                 arms=[ARM(0, l="desk", r="desk"), ARM(line=1, off=0.2, r="talk"), ARM(line=1, off=2.0, r="desk")]),
               A("leah", **LEAH_SIDE, acting=[K(0, expr="pleased", gaze=[-0.7, 0.25], turn=-0.45, tilt=2), K(line=0, off=1.0, expr="skeptical", gaze=[-0.7, 0.25], turn=-0.45, tilt=5)],
                 arms=[ARM(0, l="mug", r="rest"), ARM(line=0, off=0.3, r="point"), ARM(line=0, off=1.8, r="rest")], mug_colour="#e06a4f", light="right")]},
    [S("leah", "So. Rivals.", pause_before=0.5), S("daniel", "Friendly rivals. May the best idea win.", pause_before=0.4)],
    cue="intimate", pad=0.8)

# ================================================================ 2 · MONDAY
scene("d07_kettle", "ws_stage", {
    "env": "kitchen", "grade": "warm", "chip": "MONDAY · 10:41", "bg_blur": 3, "chapter_tag": {"n": "CHAPTER 2", "title": "Monday", "hold": 4}, "camera": {"zoom": [1.0, 1.05]},
    "actors": [A("daniel", 700, 420, 0.92, [K(0, expr="neutral", gaze=[0.2, 0.7], turn=0.15, tilt=3), K(line=1, off=1.5, expr="neutral", gaze=[0.5, 0.2], turn=0.35), K(line=2, off=0.0, expr="pleased", gaze=[0.3, 0.6], turn=0.2, tilt=2)],
                 arms=[ARM(0, r="phone", l="rest"), ARM(line=2, off=1.0, r="phone")]),
               A("leah", 1260, 400, 0.9, [K(0, expr="skeptical", gaze=[-0.3, -0.3], turn=-0.25, tilt=-4), K(line=1, off=0.0, expr="pleased", gaze=[-0.6, 0.05], turn=-0.42, tilt=3), K(line=2, off=0.8, expr="tight", gaze=[-0.6, 0.15], turn=-0.42)],
                 arms=[ARM(0, l="mug", r="chin"), ARM(line=1, off=0.0, r="talk"), ARM(line=2, off=0.6, r="rest")], mug_colour="#e06a4f", light="right")]},
    [S("leah", "Northfield's late runs all leave after six. Barrow's trucks sit empty after six.", pause_before=0.6),
     S("leah", "What if the evening runs went via Barrow?", pause_before=0.4),
     S("daniel", "Huh. Maybe.", pause_before=0.6)],
    cue="curious", chapter="Monday", sfx=[(1.0, "buzz")])

scene("d08_not_listening", "ws_stage", {
    "env": "kitchen", "grade": "neutral", "bg_blur": 5, "camera": {"zoom": [1.04, 1.12]},
    "actors": [A("daniel", 940, 450, 1.25, [K(0, expr="neutral", gaze=[0.2, 0.75], turn=0.12, tilt=3), K(line=1, off=0.6, expr="pleased", gaze=[0.15, 0.7], turn=0.1, tilt=2)],
                 arms=[ARM(0, r="phone", l="rest")], light="phone")]},
    [N("Daniel heard it. He just wasn't really listening.", pause_before=0.4), N("Remember that.", pause_before=0.3)],
    cue="curious", pad=0.8)

scene("d09_chat", "ws_insert", {
    "env": "open_plan", "grade": "neutral", "chip": "MONDAY · 11:02",
    "ui": {"kind": "chat", "title": "Leah Carter", "channels": [["Leah Carter", "#e06a4f"], ["Graham Royce", "#8c3b4a"], ["Ruth Adeyemi", "#5b5fb0"]],
           "messages": [{"from": "Leah Carter", "colour": "#e06a4f", "time": "11:02", "text": "Thinking more about Barrow. Running Northfield's evening routes through it could save ~40 late deliveries a week. Worth pitching Wednesday?", "at": 0.5},
                        {"from": "Daniel Hale", "colour": "#4f7cac", "time": "11:19", "text": "nice, could work", "at": "L0+0.6", "reaction": "+1 Leah"}]}},
    [N("At 11:02, Leah wrote it down. Daniel replied seventeen minutes later.", pause_before=1.6)],
    cue="curious", pad=1.4, sfx=[(0.5, "ping")], claims=["F1"])

scene("d10_make_it_yours", "ws_stage", {
    "env": "open_plan", "grade": "warm", "chip": "TUESDAY · 15:30", "bg_blur": 3, "camera": {"zoom": [1.0, 1.04]}, "desk": desk(),
    "actors": [A("daniel", seated=True, **DAN_DESK, acting=[K(0, expr="neutral", gaze=[0.6, 0.35], turn=0.32), K(line=0, off=0.4, expr="neutral", gaze=[0.7, -0.2], turn=0.45), K(line=1, off=0.0, expr="pleased", gaze=[0.7, -0.2], turn=0.45, tilt=-2), K(line=2, off=1.0, expr="tight", gaze=[0.6, 0.0], turn=0.4)],
                 arms=[ARM(0, l="typing", r="typing"), ARM(line=0, off=0.4, l="desk", r="desk"), ARM(line=1, off=0.2, r="talk"), ARM(line=1, off=2.0, r="desk")]),
               A("graham", 1480, 340, 0.84, [K(0, expr="pleased", gaze=[-0.6, 0.3], turn=-0.42, tilt=3, lean=-4), K(line=2, off=0.0, expr="lean_in", gaze=[-0.6, 0.32], turn=-0.42, tilt=4, lean=-6), K(line=2, off=2.4, expr="charm", gaze=[-0.6, 0.32], turn=-0.42, tilt=3, lean=-5)],
                 arms=[ARM(0, l="rest", r="mug"), ARM(line=2, off=0.0, r="talk"), ARM(line=2, off=3.0, r="mug")], mug_colour="#8c3b4a", light="right")]},
    [S("graham", "Ruth wants one big idea tomorrow. Got one?", pause_before=0.5), S("daniel", "I've been thinking about Northfield.", pause_before=0.4),
     S("graham", "Good. Make it yours. Ruth remembers whoever says it first.", pause_before=0.5)],
    cue="unease", pad=0.8)

scene("d11_midnight", "ws_stage", {
    "env": "home_night", "grade": "aftermath", "chip": "TUESDAY · 23:48", "bg_blur": 3, "camera": {"zoom": [1.0, 1.07]},
    "desk": {"back": 724, "front": 884, "x0": 360, "x1": 1560, "slant": 50, "colour": "#3a2e28", "items": [{"kind": "laptop", "x": 1120}, {"kind": "mug", "x": 600, "colour": "#4f7cac"}, {"kind": "notebook", "x": 820, "colour": "#2b3a55"}]},
    "actors": [A("daniel", 900, 440, 0.86, [K(0, expr="neutral", gaze=[0.5, 0.45], turn=0.3), K(line=1, off=0.5, expr="pleased", gaze=[0.5, 0.4], turn=0.3, tilt=-2), K(line=2, off=0.4, expr="confident", gaze=[0.3, 0.2], turn=0.2, tilt=-3)],
                 arms=[ARM(0, l="typing", r="typing"), ARM(line=2, off=0.4, r="chin", l="desk")], seated=True, light="phone")]},
    [N("On Tuesday night, Daniel worked on Northfield until midnight.", pause_before=0.6), N("He built the routes, the numbers, the slides."),
     N("By morning, the idea felt completely his.", pause_before=0.5)],
    cue="aftermath", pad=0.8, sfx=[(0.4, "tick"), (0.9, "tick"), (1.5, "tick")])

# ================================================================ 3 · THE PITCH
scene("d12_pitch", "ws_stage", {
    "env": "meeting_room", "grade": "power", "chip": "WEDNESDAY · 10:14", "bg_blur": 1, "slide": SLIDE_PITCH, "desk": MEET, "chapter_tag": {"n": "CHAPTER 3", "title": "The pitch", "hold": 4}, "camera": {"zoom": [1.0, 1.04]},
    "actors": [A("ruth", 250, 470, 0.64, [K(0, expr="neutral", gaze=[0.8, -0.1], turn=0.45), K(line=1, off=1.0, expr="pleased", gaze=[0.8, -0.1], turn=0.45, tilt=-2)], arms=[ARM(0, l="steeple", r="steeple")], seated=True),
               A("leah", 520, 470, 0.64, [K(0, expr="neutral", gaze=[0.8, -0.15], turn=0.45), K(line=0, off=1.8, expr="realise", gaze=[0.8, -0.15], turn=0.45, tilt=-2), K(line=1, off=1.5, expr="frozen", gaze=[0.6, 0.0], turn=0.35)], arms=[ARM(0, l="desk", r="desk")], seated=True),
               A("daniel", 1520, 380, 0.84, [K(0, expr="confident", gaze=[-0.5, 0.1], turn=-0.35), K(line=1, off=0.0, expr="pleased", gaze=[-0.7, 0.2], turn=-0.42, tilt=3)],
                 arms=[ARM(0, l="point", r="rest"), ARM(line=1, off=0.2, l="rest", r="talk"), ARM(line=1, off=3.6, r="open")], light="right")]},
    [S("daniel", "What if Northfield's late runs went through Barrow instead?", pause_before=0.6),
     S("daniel", "Barrow's trucks sit empty after six. We'd recover about forty late deliveries a week.", pause_before=0.4)],
    cue="power", chapter="The pitch")

scene("d13_whose", "ws_stage", {
    "env": "meeting_room", "grade": "neutral", "bg_blur": 3, "slide": SLIDE_PITCH, "camera": {"zoom": [1.0, 1.05]},
    "desk": {"kind": "table", "back": 800, "front": 960, "slant": 40, "items": [{"kind": "laptop", "x": 1300}]},
    "actors": [A("ruth", 960, 440, 1.08, [K(0, expr="pleased", gaze=[0.5, 0.0], turn=0.3), K(line=0, off=1.0, expr="skeptical", gaze=[0.55, 0.0], turn=0.32, tilt=-2)],
                 arms=[ARM(0, l="steeple", r="steeple"), ARM(line=0, off=0.4, r="talk"), ARM(line=0, off=2.4, r="steeple")])]},
    [S("ruth", "That's sharp. Whose idea was this?", pause_before=0.6)], cue="tension")

scene("d14_mine", "ws_stage", {
    "env": "meeting_room", "grade": "power", "bg_blur": 4, "slide": SLIDE_PITCH, "camera": {"zoom": [1.04, 1.12]},
    "actors": [A("daniel", 920, 440, 1.2, [K(0, expr="pleased", gaze=[-0.4, 0.1], turn=-0.25), K(line=0, off=0.2, expr="confident", gaze=[-0.45, 0.05], turn=-0.28, tilt=-2)],
                 arms=[ARM(0, l="rest", r="rest"), ARM(line=0, off=0.4, r="open")], light="right")]},
    [S("daniel", "Mine. I've been working on it since Monday.", pause_before=0.5)], cue="tension", pad=0.6)

scene("d15_leah_freezes", "ws_stage", {
    "env": "meeting_room", "grade": "cold", "bg_blur": 5, "slide": SLIDE_PITCH, "camera": {"zoom": [1.0, 1.1], "handheld": 0.4},
    "desk": {"kind": "table", "back": 800, "front": 960, "slant": 40, "items": [{"kind": "notebook", "x": 700, "colour": "#e06a4f"}]},
    "actors": [A("leah", 960, 450, 1.25, [K(0, expr="frozen", gaze=[0.6, -0.05], turn=0.38), K(1.6, expr="tight", gaze=[0.3, 0.5], turn=0.15, tilt=3)], arms=[ARM(0, l="desk", r="desk")], seated=True, light="right")]},
    cue="hush", min_d=3.0, gain=-6, sfx=[(0.4, "thump"), (1.2, "thump")], note="Leah freezes. Since Monday.")

scene("d16_graham_praise", "ws_stage", {
    "env": "meeting_room", "grade": "warm", "bg_blur": 2, "slide": SLIDE_PITCH, "desk": MEET, "camera": {"zoom": [1.0, 1.04]},
    "actors": [A("ruth", 250, 470, 0.64, [K(0, expr="pleased", gaze=[0.8, -0.1], turn=0.45), K(line=1, off=0.0, expr="neutral", gaze=[0.7, 0.05], turn=0.4)], arms=[ARM(0, l="steeple", r="steeple")], seated=True),
               A("leah", 520, 470, 0.64, [K(0, expr="tight", gaze=[0.3, 0.5], turn=0.15), K(line=1, off=0.6, expr="frozen", gaze=[-0.6, 0.05], turn=-0.35), K(line=2, off=0.0, expr="tight", gaze=[-0.6, 0.05], turn=-0.35)], arms=[ARM(0, l="desk", r="desk")], seated=True),
               A("graham", 1560, 380, 0.82, [K(0, expr="charm", gaze=[-0.6, 0.25], turn=-0.42, tilt=3)], arms=[ARM(0, l="rest", r="talk"), ARM(line=0, off=2.6, r="rest")], light="right")]},
    [S("graham", "That's exactly the thinking we need from a Senior Analyst.", pause_before=0.4), S("ruth", "Leah, what have you got?", pause_before=0.6),
     S("leah", "I... had something similar. I'll send it over.", pause_before=0.9)],
    cue="tension")

scene("d16b_corridor", "ws_stage", {
    "env": "open_plan", "grade": "neutral", "chip": "WEDNESDAY · 10:41", "bg_blur": 3, "camera": {"zoom": [1.0, 1.05], "handheld": 0.3},
    "actors": [A("daniel", 700, 410, 0.9, [K(0, expr="pleased", gaze=[0.6, 0.05], turn=0.4, tilt=3), K(line=2, off=0.0, expr="pleased", gaze=[0.6, 0.05], turn=0.4, tilt=-2)],
                 arms=[ARM(0, l="rest", r="talk"), ARM(line=0, off=2.0, r="rest"), ARM(line=2, off=0.2, r="open"), ARM(line=2, off=2.6, r="rest")]),
               A("leah", 1260, 400, 0.9, [K(0, expr="tight", gaze=[-0.6, 0.05], turn=-0.42), K(line=1, off=0.0, expr="frozen", gaze=[-0.6, 0.0], turn=-0.42), K(line=2, off=1.4, expr="cold", gaze=[-0.3, 0.4], turn=-0.25, tilt=3)],
                 arms=[ARM(0, l="paper", r="paper")], light="right")]},
    [S("daniel", "Leah! What did you think? Too much?", pause_before=0.6), S("leah", "It was a good idea.", pause_before=1.0),
     S("daniel", "Thanks. I've been thinking about it all week.", pause_before=0.4)],
    cue="cold", pad=1.2)

scene("d17_choice", "ws_stage", {
    "env": "meeting_room", "grade": "cold", "bg_blur": 5, "slide": SLIDE_PITCH, "camera": {"zoom": [1.06, 1.14]},
    "desk": {"kind": "table", "back": 800, "front": 960, "slant": 40, "items": [{"kind": "notebook", "x": 700, "colour": "#e06a4f"}]},
    "actors": [A("leah", 960, 450, 1.28, [K(0, expr="tight", gaze=[0.3, 0.5], turn=0.15, tilt=3), K(line=1, off=0.6, expr="cold", gaze=[0.6, 0.0], turn=0.38), K(line=2, off=0.4, expr="guilty", gaze=[0.2, 0.6], turn=0.1, tilt=3)],
                 arms=[ARM(0, l="desk", r="desk")], seated=True, light="right")]},
    [N("Leah had two obvious options.", pause_before=0.5), N("Accuse him, in front of the director, two days before a promotion."),
     N("Or say nothing, and let it go.", pause_before=0.3)],
    cue="cold", gain=-3, pad=0.8)

scene("d17b_rehearse", "ws_stage", {
    "env": "kitchen", "grade": "cold", "chip": "WEDNESDAY · 10:58", "bg_blur": 5, "camera": {"zoom": [1.02, 1.1]},
    "actors": [A("leah", 960, 440, 1.15, [K(0, expr="cold", gaze=[0.1, 0.1], turn=0.05), K(line=1, off=0.0, expr="tight", gaze=[0.3, 0.5], turn=0.15, tilt=4), K(line=2, off=0.0, expr="neutral", gaze=[0.05, 0.05], turn=0.0, tilt=-2)],
                 arms=[ARM(0, l="rest", r="point"), ARM(line=1, off=0.0, l="cross", r="cross"), ARM(line=2, off=0.2, l="rest", r="open")], light="right")]},
    [S("leah", "You stole my idea.", pause_before=0.8, speed=1.08), S("leah", "No.", pause_before=1.0), S("leah", "Can I show you something?", pause_before=1.2)],
    cue="hush", gain=-4, pad=0.9)

# ================================================================ 4 · DID HE STEAL IT?
scene("d18_question", "ws_stage", {
    "env": "kitchen", "grade": "neutral", "chip": "WEDNESDAY · 11:05", "bg_blur": 4, "chapter_tag": {"n": "CHAPTER 4", "title": "Did he steal it?", "hold": 4}, "camera": {"zoom": [1.0, 1.06]},
    "actors": [A("leah", 960, 440, 1.0, [K(0, expr="cold", gaze=[0.3, 0.3], turn=0.2), K(line=1, off=0.6, expr="skeptical", gaze=[0.0, 0.1], turn=0.0, tilt=4)], arms=[ARM(0, l="cross", r="cross")], light="right")]},
    [N("Leah was sure Daniel had taken her idea.", pause_before=0.5), N("But here's the uncomfortable question. Did he know?", pause_before=0.4)],
    cue="unease", chapter="Did he steal it?")

scene("d19_source", "ws_explainer", {"ex": {"kind": "source", "title": "Cryptomnesia", "sub": "FORCE 1", "from": "leah", "from_label": "Leah", "to": "daniel", "to_label": "Daniel",
    "idea": ["Northfield evening runs", "via Barrow"], "move_at": "L1+0.4", "relabel_at": "L2+0.8",
    "rows": [{"text": "Idea: kept", "ok": True, "at": "L3+0.2"}, {"text": "Source: lost", "ok": False, "at": "L3+1.6"}],
    "cite": "Brown & Murphy (1989), JEP: Learning, Memory, and Cognition", "cite_at": "L1+0.0"}},
    [N("Psychologists call it cryptomnesia: accidental plagiarism.", pause_before=0.3),
     N("In a 1989 study, people took turns naming ideas in small groups."),
     N("Later, some of them listed their partners' ideas as their own."),
     N("Memory tends to keep an idea, and quietly lose where it came from.", pause_before=0.3)],
    cue="curious", claims=["C1"])

scene("d19b_label", "ws_stage", {
    "env": "kitchen", "grade": "warm", "flash": True, "bg_blur": 4, "camera": {"zoom": [1.0, 1.06]},
    "actors": [A("daniel", 700, 420, 0.92, [K(0, expr="neutral", gaze=[0.2, 0.7], turn=0.15, tilt=3)], arms=[ARM(0, r="phone", l="rest")]),
               A("leah", 1260, 400, 0.9, [K(0, expr="pleased", gaze=[-0.6, 0.05], turn=-0.42, tilt=3)], arms=[ARM(0, l="mug", r="talk")], mug_colour="#e06a4f", light="right")]},
    [N("Our memories don't come with a label saying who said what.", pause_before=0.4),
     N("The brain rebuilds the source each time we remember, and it can get it wrong."),
     N("Daniel kept the idea from Monday. He lost the part with Leah in it.", pause_before=0.3)],
    cue="curious", claims=["C1"])

scene("d20_improve", "ws_stage", {
    "env": "home_night", "grade": "aftermath", "flash": True, "bg_blur": 4, "camera": {"zoom": [1.0, 1.06]},
    "desk": {"back": 724, "front": 884, "x0": 360, "x1": 1560, "slant": 50, "colour": "#3a2e28", "items": [{"kind": "laptop", "x": 1120}, {"kind": "notebook", "x": 820, "colour": "#2b3a55"}]},
    "actors": [A("daniel", 900, 440, 0.86, [K(0, expr="pleased", gaze=[0.5, 0.4], turn=0.3, tilt=-2)], arms=[ARM(0, l="typing", r="typing")], seated=True, light="phone")]},
    [N("Later studies found that improving someone else's idea", pause_before=0.4), N("makes you more likely to claim it later."),
     N("Daniel had spent a whole night improving it.", pause_before=0.3)],
    cue="curious", pad=0.6, claims=["C1b"])

scene("d21_overclaim", "ws_explainer", {"ex": {"kind": "overclaim", "title": "Everyone did most of the work", "sub": "FORCE 2", "note": "27 of 37 couples claimed more than their share", "note_at": "L2+0.2", "tag": "Illustration",
    "bars": [{"label": "Partner A says", "value": 58, "colour": "#d98a9a", "at": "L1+0.6"}, {"label": "Partner B says", "value": 56, "colour": "#7fc8e8", "at": "L2+0.0"}],
    "cite": "Ross & Sicoly (1979), JPSP", "cite_at": "L1+0.0"}},
    [N("The second force is the egocentric bias.", pause_before=0.3),
     N("In a classic 1979 study, most married couples each rated their own share of the housework"),
     N("higher than their partner did. Put together, their claims came to more than the whole."),
     N("Nobody was lying. We simply remember our own effort most vividly.", pause_before=0.3),
     N("Studies of co-authors find the same thing.", pause_before=0.4), N("Add up everyone's claimed share, and it's more than the whole."),
     N("It shrinks when people stop to think about what each person actually did.")],
    cue="curious", pad=0.8, claims=["C2", "C2b"])

scene("d22_not_fair", "ws_stage", {
    "env": "kitchen", "grade": "neutral", "bg_blur": 4, "camera": {"zoom": [1.0, 1.08]},
    "actors": [A("leah", 960, 440, 1.05, [K(0, expr="skeptical", gaze=[0.0, 0.1], turn=0.0, tilt=4), K(line=4, off=0.4, expr="neutral", gaze=[0.4, 0.3], turn=0.25), K(line=4, off=2.4, expr="confident", gaze=[0.1, 0.0], turn=0.05, tilt=-2)],
                 arms=[ARM(0, l="cross", r="cross"), ARM(line=4, off=0.4, l="rest", r="rest", dur=0.8)], light="right")]},
    [N("And credit doesn't land equally. In one study, men who offered new ideas", pause_before=0.4),
     N("were seen as more leader-like."), N("Women offering the same kind of ideas didn't get that boost."),
     N("None of this makes it fair. Leah still did the noticing.", pause_before=0.4), N("But it changed what she should do next.", pause_before=0.3)],
    cue="curious", pad=0.8, claims=["C3", "C5"])

# ================================================================ 5 · THE RECEIPTS
scene("d23_search", "ws_insert", {
    "env": "open_plan", "grade": "neutral", "chip": "WEDNESDAY · 11:12", "chapter_tag": {"n": "CHAPTER 5", "title": "The receipts", "y": 860, "hold": 4},
    "ui": {"kind": "chat", "title": "Daniel Hale", "channels": [["Daniel Hale", "#4f7cac"], ["Graham Royce", "#8c3b4a"], ["Ruth Adeyemi", "#5b5fb0"]], "search": {"text": "Barrow", "at": 0.6},
           "messages": [{"from": "Leah Carter", "colour": "#e06a4f", "time": "Mon 11:02", "text": "Thinking more about Barrow. Running Northfield's evening routes through it could save ~40 late deliveries a week. Worth pitching Wednesday?", "at": 1.2},
                        {"from": "Daniel Hale", "colour": "#4f7cac", "time": "Mon 11:19", "text": "nice, could work", "at": 1.4, "reaction": "+1 Leah"}],
           "highlight": 0, "highlight_at": "L1+0.6"}},
    [N("So Leah chose a third option. Not an accusation. A question, with evidence.", pause_before=1.8),
     N("She didn't need to win an argument about memory. She had a timestamp.", pause_before=0.4)],
    cue="power", gain=-4, pad=0.9, chapter="The receipts", claims=["F1"])

scene("d24_show_you", "ws_stage", {
    "env": "open_plan", "grade": "neutral", "bg_blur": 3, "camera": {"zoom": [1.0, 1.04]}, "desk": desk(),
    "actors": [A("daniel", seated=True, **DAN_DESK, acting=[K(0, expr="pleased", gaze=[0.7, -0.15], turn=0.45), K(line=1, off=1.2, expr="neutral", gaze=[0.65, 0.05], turn=0.42), K(line=2, off=0.0, expr="realise", gaze=[0.6, 0.1], turn=0.4)],
                 arms=[ARM(0, l="desk", r="desk")]),
               A("leah", **LEAH_SIDE, acting=[K(0, expr="neutral", gaze=[-0.7, 0.25], turn=-0.45), K(line=1, off=0.4, expr="neutral", gaze=[-0.5, 0.6], turn=-0.35, tilt=3), K(line=2, off=0.6, expr="tight", gaze=[-0.7, 0.25], turn=-0.45)],
                 arms=[ARM(0, l="rest", r="phone"), ARM(line=1, off=0.2, r="offer")], light="right")]},
    [S("leah", "Can I show you something?", pause_before=0.6), S("leah", "On Monday, I suggested running Northfield's evenings through Barrow.", pause_before=0.3),
     S("daniel", "That... was you.", pause_before=0.9)],
    cue="unease")

scene("d24b_reread", "ws_insert", {
    "env": "open_plan", "grade": "cold",
    "ui": {"kind": "chat", "title": "Leah Carter", "channels": [["Leah Carter", "#e06a4f"], ["Graham Royce", "#8c3b4a"], ["Ruth Adeyemi", "#5b5fb0"]],
           "messages": [{"from": "Leah Carter", "colour": "#e06a4f", "time": "Mon 11:02", "text": "Thinking more about Barrow. Running Northfield's evening routes through it could save ~40 late deliveries a week. Worth pitching Wednesday?", "at": 0.0},
                        {"from": "Daniel Hale", "colour": "#4f7cac", "time": "Mon 11:19", "text": "nice, could work", "at": 0.0, "reaction": "+1 Leah"}], "highlight": 1, "highlight_at": 1.0}},
    cue="hush", min_d=3.4, gain=-6, sfx=[(1.0, "thump")], note="Daniel reads his own reply from Monday: nice, could work.")

scene("d25_believe_you", "ws_stage", {
    "env": "open_plan", "grade": "warm", "bg_blur": 4, "camera": {"zoom": [1.0, 1.06]}, "desk": desk(),
    "actors": [A("daniel", seated=True, **DAN_DESK, acting=[K(0, expr="guilty", gaze=[0.6, 0.1], turn=0.4), K(line=1, off=0.6, expr="realise", gaze=[0.7, -0.15], turn=0.45), K(line=2, off=0.4, expr="tight", gaze=[0.7, -0.15], turn=0.45)],
                 arms=[ARM(0, l="desk", r="desk"), ARM(line=0, off=0.4, r="neck"), ARM(line=1, off=0.0, r="desk")]),
               A("leah", **LEAH_SIDE, acting=[K(0, expr="tight", gaze=[-0.7, 0.25], turn=-0.45), K(line=1, off=0.2, expr="neutral", gaze=[-0.7, 0.25], turn=-0.45, tilt=3), K(line=2, off=0.4, expr="pleased", gaze=[-0.7, 0.25], turn=-0.45, tilt=-2)],
                 arms=[ARM(0, l="rest", r="rest"), ARM(line=2, off=0.4, r="talk"), ARM(line=2, off=4.0, r="rest")], light="right")]},
    [S("daniel", "Leah, I honestly thought it was mine.", pause_before=0.6), S("leah", "I believe you. That's what worries me.", pause_before=0.7),
     S("leah", "Let's take it to Ruth together. I had the idea. You built the numbers.", pause_before=0.6)],
    cue="intimate")

scene("d26_own_it", "ws_stage", {
    "env": "open_plan", "grade": "dusk", "chip": "WEDNESDAY · 16:20", "bg_blur": 3, "camera": {"zoom": [1.0, 1.05]}, "desk": desk(),
    "actors": [A("daniel", seated=True, **DAN_DESK, acting=[K(0, expr="neutral", gaze=[0.6, 0.35], turn=0.32), K(line=0, off=0.4, expr="neutral", gaze=[0.7, -0.2], turn=0.45), K(line=1, off=0.0, expr="confident", gaze=[0.7, -0.22], turn=0.45, tilt=-2)],
                 arms=[ARM(0, l="typing", r="typing"), ARM(line=0, off=0.4, l="desk", r="desk"), ARM(line=1, off=0.3, r="open"), ARM(line=1, off=2.4, r="desk")]),
               A("graham", 1480, 340, 0.84, [K(0, expr="charm", gaze=[-0.6, 0.3], turn=-0.42, tilt=3, lean=-4), K(line=1, off=1.4, expr="tight", gaze=[-0.6, 0.3], turn=-0.42, tilt=0, lean=0)],
                 arms=[ARM(0, l="rest", r="talk"), ARM(line=0, off=3.4, r="rest")], light="right")]},
    [S("graham", "Ruth loved it. Don't overthink it. Ideas belong to whoever makes them happen.", pause_before=0.5),
     S("daniel", "Then it belongs to both of us.", pause_before=0.6)],
    cue="unease", pad=1.0)

# ================================================================ 6 · THE RECORD
scene("d27_correct", "ws_stage", {
    "env": "glass_office", "grade": "neutral", "chip": "THURSDAY · 09:00", "bg_blur": 2, "chapter_tag": {"n": "CHAPTER 6", "title": "The record", "hold": 4}, "camera": {"zoom": [1.0, 1.03]},
    "desk": {"back": 724, "front": 884, "x0": 1050, "x1": 2100, "slant": 50, "items": [{"kind": "laptop", "x": 1640}, {"kind": "paper", "x": 1400}]},
    "actors": [A("ruth", 1480, 420, 0.82, [K(0, expr="neutral", gaze=[-0.6, 0.0], turn=-0.42), K(line=1, off=0.4, expr="pleased", gaze=[-0.6, 0.0], turn=-0.42, tilt=-2)], arms=[ARM(0, l="steeple", r="steeple")], seated=True, light="right"),
               A("daniel", 520, 390, 0.86, [K(0, expr="tight", gaze=[0.6, 0.05], turn=0.4), K(line=0, off=0.0, expr="neutral", gaze=[0.65, 0.0], turn=0.42), K(line=1, off=0.0, expr="confident", gaze=[0.65, 0.0], turn=0.42)],
                 arms=[ARM(0, l="rest", r="rest"), ARM(line=0, off=0.6, r="talk"), ARM(line=1, off=1.6, r="rest")]),
               A("leah", 860, 400, 0.8, [K(0, expr="neutral", gaze=[0.6, 0.05], turn=0.4), K(line=1, off=1.0, expr="pleased", gaze=[-0.6, 0.0], turn=-0.4, tilt=3)], arms=[ARM(0, l="rest", r="rest")])]},
    [S("daniel", "Ruth, I need to correct something. The Barrow idea started with Leah, on Monday.", pause_before=0.6),
     S("daniel", "I built it out. But it was hers first.", pause_before=0.4)],
    cue="power", chapter="The record")

scene("d28_ruth_asks", "ws_stage", {
    "env": "glass_office", "grade": "power", "bg_blur": 4, "camera": {"zoom": [1.0, 1.06]},
    "actors": [A("ruth", 980, 440, 1.12, [K(0, expr="neutral", gaze=[-0.45, 0.05], turn=-0.3), K(line=0, off=0.2, expr="pleased", gaze=[-0.45, 0.05], turn=-0.3, tilt=-2), K(line=1, off=0.0, expr="confident", gaze=[-0.55, 0.05], turn=-0.36)],
                 arms=[ARM(0, l="steeple", r="steeple"), ARM(line=1, off=0.2, r="talk"), ARM(line=1, off=2.6, r="steeple")], light="right")]},
    [S("ruth", "Thank you for telling me.", pause_before=0.6), S("ruth", "Leah, walk me through how you spotted it.", pause_before=0.4)], cue="power")

scene("d29_leah_explains", "ws_stage", {
    "env": "glass_office", "grade": "warm", "bg_blur": 4, "camera": {"zoom": [1.0, 1.08]},
    "actors": [A("leah", 940, 440, 1.15, [K(0, expr="neutral", gaze=[0.45, 0.05], turn=0.3), K(line=0, off=0.4, expr="confident", gaze=[0.5, 0.05], turn=0.32, tilt=-2), K(line=1, off=0.4, expr="pleased", gaze=[0.5, 0.05], turn=0.32, tilt=3)],
                 arms=[ARM(0, l="rest", r="rest"), ARM(line=0, off=0.4, r="talk"), ARM(line=1, off=0.2, r="open"), ARM(line=1, off=2.8, r="rest")], light="left")]},
    [S("leah", "Every late run at Northfield leaves after six. I checked a month of logs.", pause_before=0.6),
     S("leah", "And every evening, Barrow's trucks sit empty.", pause_before=0.3)],
    cue="power")

scene("d30_cant_teach", "ws_stage", {
    "env": "glass_office", "grade": "power", "bg_blur": 3, "camera": {"zoom": [1.0, 1.04]},
    "desk": {"back": 724, "front": 884, "x0": 1050, "x1": 2100, "slant": 50, "items": [{"kind": "laptop", "x": 1640}]},
    "actors": [A("ruth", 1480, 420, 0.82, [K(0, expr="pleased", gaze=[-0.6, 0.0], turn=-0.42), K(line=0, off=0.6, expr="cool_smile", gaze=[-0.6, 0.0], turn=-0.42, tilt=-3)], arms=[ARM(0, l="steeple", r="steeple")], seated=True, light="right"),
               A("daniel", 520, 390, 0.86, [K(0, expr="neutral", gaze=[0.6, 0.05], turn=0.4), K(line=0, off=1.2, expr="pleased", gaze=[0.65, 0.0], turn=0.42, tilt=3)], arms=[ARM(0, l="rest", r="rest")]),
               A("leah", 860, 400, 0.8, [K(0, expr="pleased", gaze=[0.6, 0.05], turn=0.4, tilt=2)], arms=[ARM(0, l="rest", r="rest")])]},
    [S("ruth", "Noticing is the part I can't teach.", pause_before=0.6)], cue="warm", pad=0.8)

scene("d30b_ruth_email", "ws_insert", {
    "env": "open_plan", "grade": "warm", "chip": "THURSDAY · 14:05",
    "ui": {"kind": "email", "from": "Ruth Adeyemi", "to": "Operations; Client Reporting team", "subject": "Northfield evening pilot",
           "body": ["All,", "", "From Monday we pilot Northfield's evening runs via Barrow.", "The idea came from Leah Carter; Daniel Hale built the model.", "Please give them what they need.", "", "Ruth"],
           "highlight": ["The idea came from Leah Carter"], "highlight_at": "L0+1.0"}},
    [N("That afternoon, Ruth sent one email. Credit, in writing, to everyone.", pause_before=0.6)],
    cue="warm", pad=1.6, sfx=[(0.3, "ping")])

scene("d31_truth_cost", "ws_stage", {
    "env": "open_plan", "grade": "warm", "bg_blur": 3, "camera": {"zoom": [1.0, 1.06], "x": [0, -30]}, "desk": desk(),
    "glass_figures": [{"x": 1560, "head": "#1c1816", "body": "#3c3f78", "sway": True}],
    "actors": [A("daniel", 700, 440, 0.86, [K(0, expr="neutral", gaze=[0.6, 0.35], turn=0.32), K(line=1, off=0.6, expr="pleased", gaze=[0.8, -0.2], turn=0.5, tilt=-2)], arms=[ARM(0, l="typing", r="typing")], seated=True)]},
    [N("Ruth didn't decide the promotion that day.", pause_before=0.5),
     N("But she now knew who noticed things, and who told the truth when it cost him.", pause_before=0.3)],
    cue="warm", pad=0.8)

# ================================================================ 7 · THE NEXT MEETING
scene("d32_next_meeting", "ws_stage", {
    "env": "meeting_room", "grade": "neutral", "chip": "THE FOLLOWING MONDAY", "bg_blur": 1, "chapter_tag": {"n": "CHAPTER 7", "title": "Amplify", "hold": 4},
    "slide": {"title": "Weekly review", "bullets": ["Barrow evening runs: week 1", "Late deliveries: down 31"]}, "desk": MEET, "camera": {"zoom": [1.0, 1.04]},
    "actors": [A("daniel", 250, 470, 0.64, [K(0, expr="neutral", gaze=[0.8, -0.1], turn=0.45), K(line=0, off=0.2, expr="confident", gaze=[0.8, -0.1], turn=0.45)], arms=[ARM(0, l="desk", r="desk"), ARM(line=0, off=0.4, r="talk"), ARM(line=0, off=3.4, r="desk")], seated=True),
               A("leah", 520, 470, 0.64, [K(0, expr="neutral", gaze=[-0.8, -0.1], turn=-0.45), K(line=1, off=1.6, expr="skeptical", gaze=[0.8, -0.15], turn=0.45, tilt=-3)], arms=[ARM(0, l="desk", r="desk")], seated=True),
               A("graham", 1560, 380, 0.82, [K(0, expr="neutral", gaze=[-0.7, 0.25], turn=-0.45), K(line=1, off=0.0, expr="charm", gaze=[-0.7, 0.2], turn=-0.42, tilt=3)],
                 arms=[ARM(0, l="rest", r="rest"), ARM(line=1, off=0.2, r="open"), ARM(line=1, off=3.0, r="rest")], light="right")]},
    [S("daniel", "We should run the same check on Carlton. Its late runs leave after six too.", pause_before=0.6),
     S("graham", "Here's a thought. We check Carlton's evening runs as well.", pause_before=0.8)],
    cue="unease", chapter="Amplify")

scene("d33_building_on", "ws_stage", {
    "env": "meeting_room", "grade": "power", "bg_blur": 4, "slide": {"title": "Weekly review", "bullets": []}, "camera": {"zoom": [1.04, 1.12]},
    "desk": {"kind": "table", "back": 800, "front": 960, "slant": 40, "items": [{"kind": "notebook", "x": 700, "colour": "#e06a4f"}]},
    "actors": [A("leah", 960, 450, 1.2, [K(0, expr="skeptical", gaze=[0.6, 0.0], turn=0.35, tilt=-3), K(line=0, off=0.2, expr="confident", gaze=[0.6, 0.0], turn=0.35, tilt=-2), K(line=0, off=3.2, expr="pleased", gaze=[0.5, 0.05], turn=0.3, tilt=3)],
                 arms=[ARM(0, l="desk", r="desk"), ARM(line=0, off=0.3, r="talk"), ARM(line=0, off=3.6, r="desk")], seated=True, light="right")]},
    [S("leah", "Building on Daniel's point a minute ago, yes. Carlton's next.", pause_before=0.5)], cue="power", pad=0.8)

scene("d34_amplify", "ws_explainer", {"ex": {"kind": "amplify", "title": "Amplification", "sub": "A TACTIC WITH A NAME", "speaker": 4, "amplifier": 1,
    "idea": "Check Carlton too", "idea_at": "L0+0.6", "repeat": "“As Daniel said…”", "repeat_at": "L1+0.6",
    "cite": "J. Eilperin, The Washington Post, Sept 2016", "cite_at": "L0+0.0"}},
    [N("In 2016, women on President Obama's staff described a tactic they called amplification.", pause_before=0.4),
     N("When one of them made a key point, another repeated it, and credited her by name."),
     N("It's hard to take an idea that someone has just credited out loud.", pause_before=0.3)],
    cue="warm", claims=["C4"])

scene("d35_graham_maybe", "ws_stage", {
    "env": "meeting_room", "grade": "aftermath", "bg_blur": 5, "slide": {"title": "Weekly review", "bullets": []}, "camera": {"zoom": [1.06, 1.16]},
    "actors": [A("graham", 980, 450, 1.25, [K(0, expr="charm", gaze=[-0.4, 0.15], turn=-0.25, tilt=3), K(line=0, off=1.0, expr="cool_smile", gaze=[-0.35, 0.2], turn=-0.22), K(line=1, off=0.6, expr="neutral", gaze=[-0.2, 0.4], turn=-0.12)],
                 arms=[ARM(0, l="steeple", r="steeple")], light="right")]},
    [N("Maybe Graham hadn't heard Daniel.", pause_before=0.6), N("Maybe he had. Either way, everyone in the room now knew whose point it was.", pause_before=0.4)],
    cue="aftermath", pad=0.8, claims=["C3"])

scene("d36_closing", "ws_stage", {
    "env": "kitchen", "tod": "evening", "grade": "warm", "bg_blur": 4, "camera": {"zoom": [1.04, 1.12]},
    "actors": [A("daniel", 700, 430, 0.95, [K(0, expr="pleased", gaze=[0.6, 0.05], turn=0.4, tilt=3), K(line=2, off=0.0, expr="confident", gaze=[0.6, 0.05], turn=0.4, tilt=-2), K(line=3, off=0.0, expr="pleased", gaze=[0.6, 0.05], turn=0.4, tilt=3)],
                 arms=[ARM(0, r="mug", l="rest"), ARM(line=2, off=0.2, r="talk", l="rest"), ARM(line=2, off=3.0, r="mug")], mug_colour="#4f7cac"),
               A("leah", 1260, 410, 0.93, [K(0, expr="pleased", gaze=[-0.6, 0.05], turn=-0.42, tilt=-2), K(line=1, off=0.2, expr="skeptical", gaze=[-0.6, 0.05], turn=-0.42, tilt=4), K(line=2, off=1.8, expr="pleased", gaze=[-0.6, 0.05], turn=-0.42, tilt=-3)],
                 arms=[ARM(0, l="mug", r="rest"), ARM(line=1, off=0.2, r="point"), ARM(line=1, off=2.4, r="rest")], mug_colour="#e06a4f", light="right")]},
    [S("daniel", "Carlton next?", pause_before=0.6), S("leah", "Carlton next. And this time, I'm writing it down.", pause_before=0.5),
     S("daniel", "Send it to me. I'll forward it to Ruth, with your name on it.", pause_before=0.5),
     N("Most stolen ideas aren't stolen.", pause_before=1.0), N("They're forgotten, by the one person who remembers them as his own.", pause_before=0.6)],
    cue="warm", pad=1.6, gain=-2)

scene("d37_moves", "ws_explainer", {"ex": {"kind": "moves", "title": "Four moves", "sub": "IF IT HAPPENS TO YOU", "items": [
    {"title": "Put ideas in writing early", "sub": "A two-line message is a timestamp.", "at": "L1+0.2"},
    {"title": "Check the record before you accuse", "sub": "Memory is the weakest evidence in the room.", "at": "L2+0.0"},
    {"title": "Raise it privately, with curiosity", "sub": "“Can I show you something?”", "at": "L3+0.0"},
    {"title": "Amplify, and credit out loud", "sub": "“Building on Leah's point…”", "at": "L4+0.0"}]}},
    [N("So if someone presents your idea as theirs:", pause_before=0.6),
     N("put your ideas in writing early. A two-line message is a timestamp.", pause_before=0.2), N("Check the record before you accuse. Memory is weak evidence."),
     N("Raise it privately, with curiosity, not a verdict. \"Can I show you something?\""), N("And amplify others. Give credit out loud, and it tends to come back.")],
    cue="warm", chapter="What to do instead", pad=1.2)

scene("d38_end", "ws_end", {"question": "Has someone ever presented your idea as their own? Do you think they knew?",
                            "tag": "EPISODE 2 · THE CREDIT", "notice": "A fictional story. Characters and companies are invented.", "brand_at": "L1+3.0", "fade_out": 1.2},
    [N("Has someone ever presented your idea as their own?", pause_before=0.8), N("Do you think they knew?", pause_before=0.6)],
    cue="outro", pad=2.6, caption_mode="none", transition="fade")


# ---------------------------------------------------------------- episode
SOURCES = [
    {"id": "S1", "title": "Cryptomnesia: Delineating inadvertent plagiarism (Brown & Murphy, 1989), JEP: Learning, Memory, and Cognition 15(3):432-442", "publisher": "American Psychological Association", "url": "https://doi.org/10.1037/0278-7393.15.3.432", "accessed": "2026-10-11"},
    {"id": "S2", "title": "Source monitoring (Johnson, Hashtroudi & Lindsay, 1993), Psychological Bulletin 114(1):3-28", "publisher": "American Psychological Association", "url": "https://doi.org/10.1037/0033-2909.114.1.3", "accessed": "2026-10-11"},
    {"id": "S3", "title": "Egocentric biases in availability and attribution (Ross & Sicoly, 1979), JPSP 37(3):322-336", "publisher": "American Psychological Association", "url": "https://doi.org/10.1037/0022-3514.37.3.322", "accessed": "2026-10-11"},
    {"id": "S4", "title": "How female White House staffers cracked the code of power (Juliet Eilperin, The Washington Post, 13 Sept 2016; republished 18 Sept 2016)", "publisher": "The Washington Post via Daily Herald", "url": "https://www.dailyherald.com/20160918/business/how-female-white-house-staffers-cracked-the-code-of-power/", "accessed": "2026-10-11"},
    {"id": "S5", "title": "When elaboration leads to appropriation: Unconscious plagiarism in a creative task (Stark, Perfect & Newstead, 2005), Memory 13(6):561-573", "publisher": "Taylor & Francis (Plymouth research portal)", "url": "https://researchportal.plymouth.ac.uk/en/publications/when-elaboration-leads-to-appropriation-unconscious-plagiarism-in/", "accessed": "2026-10-11"},
    {"id": "S7", "title": "The social consequences of voice (McClean, Martin, Emich & Woodruff, 2018), Academy of Management Journal 61(5):1869-1891", "publisher": "Academy of Management", "url": "https://doi.org/10.5465/amj.2016.0148", "accessed": "2026-10-11"},
    {"id": "S8", "title": "The costs and benefits of undoing egocentric responsibility assessments in groups (Caruso, Epley & Bazerman, 2006), JPSP 91(5):857-871", "publisher": "American Psychological Association", "url": "https://doi.org/10.1037/0022-3514.91.5.857", "accessed": "2026-10-11"},
    {"id": "S6", "title": "Perfect & Stark (2012), Europe's Journal of Psychology 8(2): idea improvement and unconscious plagiarism", "publisher": "PsychOpen", "url": "https://ejop.psychopen.eu/index.php/ejop/article/view/459", "accessed": "2026-10-11"},
]
CLAIMS = [
    {"id": "C1", "type": "established", "text": "Cryptomnesia: people can reproduce others' ideas believing them to be their own (Brown & Murphy, 1989); source memory is fallible.", "sources": ["S1", "S2"]},
    {"id": "C1b", "type": "established", "text": "Generating improvements to someone else's idea increases later unconscious plagiarism of it (Stark, Perfect & Newstead, 2005; Perfect & Stark, 2012).", "sources": ["S5", "S6"]},
    {"id": "C2", "type": "established", "text": "Egocentric bias: in Ross & Sicoly (1979), 27 of 37 married couples overestimated their own share of responsibility (rating scale, not percentages); the on-screen percentages are illustrative.", "sources": ["S3"]},
    {"id": "C2b", "type": "established", "text": "Co-authors in multi-author teams believe they contributed more than is logically possible; considering others' contributions reduces overclaiming (Caruso, Epley & Bazerman, 2006).", "sources": ["S8"]},
    {"id": "C3", "type": "illustrative", "text": "Daniel's lapse is presented as a memory error, not a lie; Graham's intent is left ambiguous.", "sources": []},
    {"id": "C4", "type": "established", "text": "Women staffers in the Obama White House described 'amplification': repeating a colleague's key point and crediting her (Washington Post, 2016).", "sources": ["S4"]},
    {"id": "C5", "type": "established", "text": "Promotive voice raised men's status and leader emergence but not women's (McClean, Martin, Emich & Woodruff, 2018).", "sources": ["S7"]},
    {"id": "F1", "type": "illustrative", "text": "Invented figures: Northfield ~250 deliveries a week at 81.1% on time (~47 late); evening re-routing via Barrow recovers ~40; week one saw 31 fewer late deliveries.", "sources": []},
]

EPISODE = {
    "id": EP_ID, "number": 2, "series": "THE QUIET GAME", "title": "The Credit",
    "youtube_title": "He Stole Her Idea in the Meeting. He Didn't Even Know.",
    "central_question": "When a colleague presents your idea as theirs, are they lying, or did they genuinely forget?",
    "template": "thriller", "format": "landscape", "narrator_voice": "en_GB-alba-medium", "target_duration_seconds": [420, 560],
    "visual_mode": "svg", "caption_style": "thriller", "cast": ["daniel", "graham", "leah", "ruth", "narrator"],
    "fiction_notice": "A fictional story. Characters, companies and events are invented. The psychology is real.",
    "music": {"bpm": 88},
    "figures": {"northfield_weekly": 250, "northfield_on_time": 0.811, "recovered_per_week": 40, "week_one_reduction": 31},
    "scenes": SCENES, "claims": CLAIMS, "sources": SOURCES,
    "thumbnail": {
        "actors": [
            A("daniel", 680, 500, 1.2, [K(0, expr="smirk", gaze=[0.3, 0.0], turn=0.22, tilt=-4)], arms=[ARM(0, r="rest", l="rest")], rim="#ffd38a"),
            A("leah", 1440, 500, 1.55, [K(0, expr="cold", gaze=[-0.9, 0.08], turn=-0.2, tilt=3)], arms=[ARM(0, l="rest", r="rest")], light="right", rim="#7fe8ff")],
        "message": {"x": 1010, "y": 890, "rot": -5, "from": "Leah", "colour": "#e06a4f", "time": "Mon 11:02", "text": "What if Northfield's evening runs went via Barrow?", "wrap": 26},
        "text": {"x": 70, "y": 170, "size": 128, "a": "WHOSE", "b": "IDEA?", "bw": 520}},
}

if __name__ == "__main__":
    d = ROOT / "episodes" / EP_ID
    d.mkdir(parents=True, exist_ok=True)
    (d / "episode.json").write_text(json.dumps(EPISODE, indent=1, ensure_ascii=False) + "\n")
    js = ROOT / "renderer" / "scenes" / f"{EP_ID}.js"
    if not js.exists():
        js.write_text("/* The Quiet Game, Episode 2. All scene types (ws_*) live in renderer/widescreen.js; nothing episode-specific is needed. */\n")
    words = sum(len(l["text"].split()) for s in SCENES for l in s.get("lines", []))
    print(f"wrote {d / 'episode.json'}: {len(SCENES)} scenes, {words} spoken words")
