"""Writes the five Season 1 episode files (episodes/s1e0N-*/episode.json) from one script, so
continuity details (the ring, 9:15, The Linden, Theo's outfit) live in one place."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
A = lambda **k: k
L = lambda who, text, **k: {"who": who, "text": text, **k}
CLOSE = dict(scale=2.2, y=790)
RING_FOLDER = {"who": "celeste", "ring": True, "action": "tap"}

def stage(env, grade, actors, cam=None, **extra):
    return {"env": env, "grade": grade, "camera": cam or {"zoom": [1.0, 1.06]}, "actors": actors, **extra}

def act(who, x, y, scale, light="left", view="front", acting=None, **k):
    return {"who": who, "view": view, "x": x, "y": y, "scale": scale, "light": light, "acting": acting or [A(t=0, expr="neutral")], **k}

def sc(i, name, scene, mind, music, shot, lines=None, sfx=None, caption=None, pad=0.3, cy=1640, trans="cut", gain=None, silent=False):
    d = {"id": f"s{i:02d}_{name}", "scene": scene, "min_duration": mind, "pad_after": pad, "music_cue": music, "sfx": sfx or [], "claims": ["C1"], "transition": trans, "caption_y": cy, "shot": shot}
    if lines: d["lines"] = lines
    if silent or not lines:
        d["silent"] = True; d["caption"] = caption or ""
    if gain is not None: d["music_gain_db"] = gain
    return d

def end_card(ep, nxt): return {"at_line_end": True, "ep": f"EPISODE {ep} OF 5", "next": nxt}

EPISODES = []

# ---------------------------------------------------------------- EPISODE 1
EPISODES.append(("s1e01-you-didnt-win", "You Didn't Win", [
    sc(1, "hook", "stage", 3.6, "cold", stage("dark", "cold", [act("mara", 540, 800, 2.2, light="phone", acting=[A(t=0, expr="calculating", gaze=[0.05, 0.85], turn=0.05, tilt=-3), A(line=0, off=-0.3, expr="realise", gaze=[0, 0], turn=0, tilt=0)])],
        cam={"zoom": [1.15, 1.0]}, phone_toast={"at": 0.15, "from": "Unknown", "text": "You didn't win. You were chosen."}),
        lines=[L("mara", "Who is this?", pause_before=1.7)], sfx=[{"at": 0.1, "name": "buzz"}], gain=-6),
    sc(2, "context", "document", 3.0, "unease", {"doc": {"title": "VENDOR PAYMENT AUTHORISATION", "rows": [["Payee", "Northgate Consulting Ltd"], ["Amount", "$480,000"], ["Prepared by", "T. Vance"], ["Approved by", "Mara Okafor"]], "reveal_row": 3, "reveal_at": 0.2}},
        lines=[L("narrator", "Yesterday, she exposed her boss for fraud.")], sfx=[{"at": 0.1, "name": "paper"}]),
    sc(3, "praise", "stage", 5.0, "intimate", stage("office_day", "warm", [
        act("celeste", 280, 700, 1.22, acting=[A(t=0, expr="cool_smile", gaze=[0.6, 0.1], turn=0.35, tilt=-2), A(line=2, off=0, expr="pleased", gaze=[0.55, 0.15], turn=0.3, tilt=-4)]),
        act("mara", 815, 770, 1.2, acting=[A(t=0, expr="pleased", gaze=[-0.6, 0.0], turn=-0.35, tilt=3), A(line=1, off=0, expr="pleased", gaze=[-0.3, 0.6], turn=-0.25, tilt=5), A(line=2, off=0.2, expr="pleased", gaze=[-0.6, 0], turn=-0.35, tilt=4)])]),
        lines=[L("celeste", "Brave work, Mara. The board noticed.", pause_after=0.3), L("mara", "I just read the numbers."), L("celeste", "Most people don't.")]),
    sc(4, "ring", "insert_hand", 2.2, "intimate", {"hand": RING_FOLDER, "surface": "folder", "grade": "warm"}, caption="Celeste Arden. Chief Financial Officer.", sfx=[{"at": 0.4, "name": "pen"}]),
    sc(5, "prediction", "phone_thread", 3.6, "unease", {"phone": {"contact": "Unknown", "time": "9:12", "messages": [A(at=0.3, me=False, text="At 9:15 she'll offer you Theo's job.", tone="cold"), A(at=1.9, me=False, text="Say yes.", tone="cold")]}},
        caption="Three minutes later.", sfx=[{"at": 0.3, "name": "buzz"}, {"at": 1.9, "name": "ping"}]),
    sc(6, "offer", "stage", 3.4, "intimate", stage("office_day", "warm", [act("celeste", 540, 790, 2.2, acting=[A(t=0, expr="confident", gaze=[-0.25, 0.05], turn=-0.15, tilt=-2)])], cam={"zoom": [1.0, 1.08]},
        clock={"from": "9:14", "to": "9:15", "flip_at": 0.5}), lines=[L("celeste", "I'd like you to run Partnerships.", pause_before=0.7)], sfx=[{"at": 0.5, "name": "tick"}]),
    sc(7, "yes", "stage", 2.4, "hush", stage("office_day", "cold", [act("mara", 540, 790, 2.2, light="right", acting=[A(t=0, expr="realise", gaze=[0.3, 0.1], turn=0.1), A(line=0, off=0.1, expr="calculating", gaze=[0.3, 0.05], turn=0.1, tilt=-2)])], cam={"zoom": [1.0, 1.1]}),
        lines=[L("mara", "Yes.", pause_before=0.8)], sfx=[{"at": 0.0, "name": "thump"}], gain=-8),
    sc(8, "reply", "phone_thread", 4.8, "cold", {"phone": {"contact": "Unknown", "time": "9:21", "messages": [A(at=0.3, me=True, text="Who are you?", tone="neutral"), A(at=1.6, me=False, text="Someone who knows how this ends.", tone="cold"), A(at=3.0, me=False, text="Tomorrow, ask Priya who she told.", tone="cold")]}},
        caption="She replied.", sfx=[{"at": 0.3, "name": "ping"}, {"at": 1.6, "name": "buzz"}, {"at": 3.0, "name": "buzz"}]),
    sc(9, "end", "stage", 2.6, "cold", stage("dark", "cold", [act("mara", 540, 800, 2.2, light="phone", acting=[A(t=0, expr="calculating", gaze=[0.0, 0.8], turn=0), A(t=0.8, expr="cool_smile", gaze=[0, 0], turn=0, tilt=-3)])], cam={"zoom": [1.0, 1.05]},
        end_card={"at": 1.3, "ep": "EPISODE 1 OF 5", "next": "Next: The Lie"}), caption="Who chose her? And why?", pad=0.4, trans="fade"),
]))

# ---------------------------------------------------------------- EPISODE 2
THEO_S = dict(outfit="shirt_sleeves")
EPISODES.append(("s1e02-the-lie", "The Lie", [
    sc(1, "hook", "stage", 5.0, "unease", stage("parking", "cold", [
        act("theo", 600, 690, 1.5, acting=[A(t=0, expr="tight", gaze=[-0.5, 0.05], turn=-0.3, tilt=2, x=760), A(t=0.6, expr="tight", gaze=[-0.45, 0.05], turn=-0.25, x=600), A(line=2, off=0, expr="cold", gaze=[-0.4, 0], turn=-0.2, tilt=-3)], **THEO_S),
        act("mara", 200, 900, 1.9, view="back", acting=[A(t=0, tilt=2)])], cam={"zoom": [1.1, 1.0]}, chip="THEO · SUSPENDED"),
        lines=[L("theo", "I didn't build Northgate.", pause_before=0.35, pause_after=0.25), L("mara", "You signed it.", pause_after=0.3), L("theo", "Because someone told me to.")], sfx=[{"at": 0.0, "name": "step"}, {"at": 0.35, "name": "step"}]),
    sc(2, "who", "stage", 1.8, "unease", stage("parking", "cold", [act("mara", 540, 790, 2.2, light="right", acting=[A(t=0, expr="skeptical", gaze=[-0.35, 0], turn=-0.2)])]), lines=[L("mara", "Who?", pause_before=0.2)]),
    sc(3, "midpoint", "stage", 3.2, "cold", stage("parking", "cold", [act("theo", 540, 790, 2.2, acting=[A(t=0, expr="cold", gaze=[0.1, 0.1], turn=0.1), A(line=0, off=1.0, expr="tight", gaze=[0, 0], turn=0), A(line=2, off=0, expr="smirk", gaze=[0, 0], turn=0, tilt=-3)], **THEO_S)], cam={"zoom": [1.0, 1.12]}),
        lines=[L("theo", "Someone who knew you'd catch me.", pause_before=0.3, pause_after=0.5), L("mara", "Why should I believe you?", pause_after=0.35), L("theo", "Don't. Just ask Priya who she told.")], sfx=[{"at": 0.0, "name": "swell"}]),
    sc(4, "the-lie", "stage", 5.5, "intimate", stage("office_day", "warm", [
        act("mara", 280, 730, 1.22, acting=[A(t=0, expr="calculating", gaze=[0.6, 0], turn=0.35)]),
        act("priya", 815, 760, 1.22, acting=[A(t=0, expr="pleased", gaze=[-0.6, 0], turn=-0.35, tilt=3), A(line=1, off=0, expr="pleased", gaze=[-0.6, 0], turn=-0.3, tilt=4), A(line=1, off=0.8, expr="guilty", gaze=[0.5, 0.55], turn=0.1, tilt=-2), A(line=1, off=1.4, expr="pleased", gaze=[-0.55, 0], turn=-0.3, tilt=3)])]),
        lines=[L("mara", "Did you tell anyone I flagged Northgate?", pause_after=0.45), L("priya", "No one. I swear.")]),
    sc(5, "message", "phone_thread", 3.2, "cold", {"phone": {"contact": "Unknown", "time": "11:02", "messages": [A(at=0.3, me=False, text="She's lying.", tone="cold"), A(at=1.4, me=False, text="Check her calendar. Thursday.", tone="cold")]}},
        caption="The unknown number again.", sfx=[{"at": 0.3, "name": "buzz"}, {"at": 1.4, "name": "buzz"}]),
    sc(6, "calendar", "calendar", 3.6, "hush", {"cal": {"title": "Priya Shah · This week", "day": "THU", "time": "7:00 PM", "event": "Dinner with C.A.", "detail": ["The Linden", "window table"], "reveal_at": 0.8,
        "filler": [[0, 560, 120, "Stand-up"], [1, 700, 160, "Q3 review"], [2, 520, 120, "1:1 Mara"], [4, 820, 140, "Offsite"]]}}, caption="Thursday, 7 p.m. Dinner with \"C.A.\"", sfx=[{"at": 0.8, "name": "thump"}], gain=-6),
    sc(7, "end", "stage", 2.8, "cold", stage("office_day", "cold", [act("mara", 540, 790, 2.2, light="right", acting=[A(t=0, expr="calculating", gaze=[0.2, 0.6], turn=0.1), A(line=0, off=0.3, expr="calculating", gaze=[0, 0], turn=0)])], cam={"zoom": [1.0, 1.08]},
        end_card={"at": 1.6, "ep": "EPISODE 2 OF 5", "next": "Next: The Window Table"}), lines=[L("mara", "Who's C.A.?", pause_before=0.2)], pad=0.6, trans="fade"),
]))

# ---------------------------------------------------------------- EPISODE 3
EPISODES.append(("s1e03-the-window-table", "The Window Table", [
    sc(1, "hook", "stage", 4.2, "unease", stage("restaurant_window", "cold", [
        act("priya", 390, 800, 0.95, layer="inside", acting=[A(t=0, expr="pleased", gaze=[0.6, 0], turn=0.35, tilt=4), A(t=2.2, expr="pleased", gaze=[0.55, 0.1], turn=0.3, tilt=-3)]),
        act("celeste", 720, 880, 1.0, view="back", layer="inside", shadowed=True, acting=[A(t=0, tilt=-3)]),
        act("mara", 860, 1120, 2.0, view="back", acting=[A(t=0, tilt=3)])], cam={"zoom": [1.08, 1.0]}, rain=True,
        phone_toast={"at": 0.2, "from": "Unknown", "text": "Window table. Don't let her see you."}),
        caption="Thursday, 7 p.m. The Linden.", sfx=[{"at": 0.0, "name": "rain"}, {"at": 0.2, "name": "buzz"}, {"at": 3.8, "name": "rain"}]),
    sc(2, "ring", "insert_hand", 2.6, "unease", {"hand": {"who": "celeste", "ring": True, "action": "rest"}, "surface": "cloth", "grade": "warm", "ring_label": {"x": 445, "y": 840, "r": 80}},
        caption="Her guest keeps their face in the shadows.", sfx=[{"at": 0.0, "name": "rain"}]),
    sc(3, "seen", "stage", 2.6, "cold", stage("restaurant_window", "cold", [
        act("priya", 330, 840, 1.55, layer="inside", acting=[A(t=0, expr="pleased", gaze=[0.5, 0.1], turn=0.2), A(t=0.6, expr="realise", gaze=[0, 0], turn=0, tilt=0)])], cam={"zoom": [1.0, 1.12]}, rain=True),
        caption="She sees her.", sfx=[{"at": 0.0, "name": "rain"}, {"at": 0.6, "name": "thump"}], gain=-6),
    sc(4, "exit", "stage", 2.4, "cold", stage("restaurant_window", "cold", [
        act("priya", 390, 800, 0.95, layer="inside", acting=[A(t=0, expr="realise", gaze=[-0.2, -0.2], turn=-0.2)]),
        act("celeste", 720, 860, 1.0, view="back", layer="inside", shadowed=True, acting=[A(t=0, tilt=-3), A(t=0.3, x=1000, y=820, dur=1.6)])], rain=True),
        caption="Her guest slips out the back.", sfx=[{"at": 0.0, "name": "rain"}, {"at": 0.4, "name": "step"}, {"at": 0.8, "name": "step"}, {"at": 1.4, "name": "door"}]),
    sc(5, "confront", "stage", 8.0, "cold", stage("restaurant_window", "cold", [
        act("priya", 280, 770, 1.22, light="right", acting=[A(t=0, expr="guilty", gaze=[0.55, 0.1], turn=0.3), A(line=2, off=0, expr="guilty", gaze=[0.5, 0.4], turn=0.25, tilt=-3), A(line=4, off=0, expr="tight", gaze=[0.3, 0.8], turn=0.1, tilt=-5)]),
        act("mara", 815, 750, 1.22, acting=[A(t=0, expr="cold", gaze=[-0.55, 0.05], turn=-0.3), A(line=3, off=0, expr="calculating", gaze=[-0.6, 0.05], turn=-0.35)])], cam={"zoom": [1.0, 1.05]}, rain=True),
        lines=[L("priya", "It's not what you think.", pause_after=0.35), L("mara", "Then tell me what it is.", pause_after=0.4), L("priya", "She said she was protecting you.", pause_after=0.3), L("mara", "Who?", pause_after=0.9), L("priya", "I can't.")],
        sfx=[{"at": 0.0, "name": "rain"}, {"at": 3.8, "name": "rain"}, {"at": 6.2, "name": "buzz"}, {"at": 7.6, "name": "rain"}]),
    sc(6, "think", "stage", 1.8, "hush", stage("restaurant_window", "cold", [act("mara", 540, 790, 2.2, light="right", acting=[A(t=0, expr="calculating", gaze=[0.3, 0.3], turn=0.1), A(t=1.0, expr="realise", gaze=[0.1, 0], turn=0.05)])], rain=True),
        caption="Then she remembers a hand.", sfx=[{"at": 0.0, "name": "rain"}], gain=-8),
    sc(7, "flashback", "insert_hand", 1.6, "hush", {"hand": RING_FOLDER, "surface": "folder", "grade": "warm", "ring_label": {"x": 445, "y": 840, "r": 80}}, caption="Monday. The CFO's office.", sfx=[{"at": 0.0, "name": "swell"}], gain=-8),
    sc(8, "end", "stage", 2.8, "cold", stage("restaurant_window", "cold", [act("mara", 540, 790, 2.2, light="right", acting=[A(t=0, expr="realise", gaze=[0, 0], turn=0), A(line=0, off=0.4, expr="cold", gaze=[0, 0], turn=0)])], cam={"zoom": [1.0, 1.1]}, rain=True,
        end_card={"at": 1.6, "ep": "EPISODE 3 OF 5", "next": "Next: The Sender"}), lines=[L("mara", "Celeste.", pause_before=0.3)], sfx=[{"at": 0.0, "name": "rain"}], pad=0.6, trans="fade"),
]))

# ---------------------------------------------------------------- EPISODE 4
EPISODES.append(("s1e04-the-sender", "The Sender", [
    sc(1, "hook", "phone_thread", 3.4, "cold", {"phone": {"contact": "Unknown", "time": "10:58 PM", "messages": [A(at=0.25, me=False, text="Floor 31. Eleven tonight.", tone="cold"), A(at=1.4, me=False, text="Come alone.", tone="cold")]}},
        caption="Three messages. Three predictions. All true.", sfx=[{"at": 0.25, "name": "buzz"}, {"at": 1.4, "name": "buzz"}]),
    sc(2, "arrive", "stage", 4.6, "unease", stage("boardroom_night", "cold", [act("mara", 560, 690, 1.45, light="right", acting=[A(t=0, expr="calculating", gaze=[-0.3, 0.1], turn=-0.2, x=780), A(t=0.8, expr="calculating", gaze=[0.1, 0.6], turn=0, x=560), A(t=2.4, expr="realise", gaze=[0.2, 0.9], turn=0.1)], behind_table=True)],
        table_phone={"x": 560, "y": 1340, "rot": -8, "lit_at": 2.4, "text": "I'm here."}), lines=[L("mara", "I'm here.", pause_before=1.4)], sfx=[{"at": 0.0, "name": "step"}, {"at": 0.45, "name": "step"}, {"at": 2.4, "name": "buzz"}]),
    sc(3, "reveal", "stage", 4.6, "cold", stage("boardroom_night", "cold", [act("theo", 560, 700, 1.5, acting=[A(t=0, expr="tight", gaze=[-0.3, 0.1], turn=-0.25, x=760), A(t=0.5, expr="cold", gaze=[0, 0], turn=0, x=560), A(line=1, off=0.3, expr="smirk", gaze=[0, 0], turn=0, tilt=-3)], behind_table=True, **THEO_S)], cam={"zoom": [1.06, 1.0]}),
        lines=[L("theo", "You'd never trust me.", pause_before=0.5, pause_after=0.4), L("theo", "So I made you trust a stranger.")], sfx=[{"at": 0.0, "name": "swell"}]),
    sc(4, "again", "stage", 2.2, "cold", stage("boardroom_night", "cold", [act("mara", 540, 790, 2.2, light="right", acting=[A(t=0, expr="cold", gaze=[-0.2, 0], turn=-0.1)])]), lines=[L("mara", "You used me. Again.", pause_before=0.15)]),
    sc(5, "mirror", "stage", 5.6, "cold", stage("boardroom_night", "cold", [act("theo", 540, 790, 2.2, acting=[A(t=0, expr="tight", gaze=[0.2, 0.1], turn=0.1), A(line=1, off=0, expr="cold", gaze=[0.3, 0.6], turn=0.15, tilt=4), A(line=2, off=0, expr="tight", gaze=[0, 0], turn=0)], **THEO_S)], cam={"zoom": [1.0, 1.1]}),
        lines=[L("theo", "Celeste used us both.", pause_after=0.3), L("theo", "She ran every move on me first.", pause_after=0.35), L("theo", "I signed because she called me brilliant.")]),
    sc(6, "plan", "stage", 5.4, "power", stage("boardroom_night", "power", [
        act("mara", 280, 730, 1.22, acting=[A(t=0, expr="calculating", gaze=[0.6, 0], turn=0.35), A(line=0, off=1.0, expr="confident", gaze=[0.6, 0], turn=0.35)], behind_table=True),
        act("theo", 815, 715, 1.25, acting=[A(t=0, expr="cold", gaze=[-0.6, 0], turn=-0.35), A(line=1, off=0, expr="smirk", gaze=[-0.55, 0], turn=-0.3)], behind_table=True, **THEO_S)]),
        lines=[L("mara", "Then we need proof she can't charm away.", pause_after=0.35), L("theo", "Priya has it. She recorded the dinner.")]),
    sc(7, "doorway", "stage", 3.8, "cold", stage("doorway", "cold", [act("celeste", 560, 760, 1.05, light="right", acting=[A(t=0, expr="cool_smile", gaze=[0, 0], turn=0)])], cam={"zoom": [1.0, 1.08]},
        end_card={"at": 2.4, "ep": "EPISODE 4 OF 5", "next": "Next: The Fifth Message"}), lines=[L("celeste", "Working late, you two?", pause_before=0.6)], sfx=[{"at": 0.0, "name": "door"}, {"at": 0.4, "name": "thump"}], pad=0.6, trans="fade", gain=-6),
]))

# ---------------------------------------------------------------- EPISODE 5
EPISODES.append(("s1e05-the-fifth-message", "The Fifth Message", [
    sc(1, "hook", "stage", 3.4, "intimate", stage("boardroom_day", "warm", [act("celeste", 540, 790, 2.2, acting=[A(t=0, expr="cool_smile", gaze=[-0.2, 0], turn=-0.1, tilt=-2), A(line=0, off=1.2, expr="confident", gaze=[-0.25, 0.05], turn=-0.12)])], cam={"zoom": [1.12, 1.0]}, table=False,
        clock={"from": "9:13", "to": "9:13"}), lines=[L("celeste", "You remind me of myself, Mara.", pause_before=0.2)]),
    sc(2, "problem", "stage", 3.0, "power", stage("boardroom_day", "power", [act("mara", 540, 640, 1.6, acting=[A(t=0, expr="cool_smile", gaze=[0.3, 0.4], turn=0.15, tilt=-2), A(line=1, off=0, expr="confident", gaze=[0.3, 0.4], turn=0.12, tilt=-3)])], low_angle=True, table=False, cam={"zoom": [1.08, 1.0], "y": [-30, 0]}),
        lines=[L("mara", "I know.", pause_after=0.35), L("mara", "That's the problem.")]),
    sc(3, "fifth", "phone_thread", 3.4, "cold", {"phone": {"contact": "Unknown", "time": "Last night", "messages": [A(at=0.3, me=False, text="9:15 tomorrow. You'll resign.", tone="cold")]}},
        caption="Last night, Celeste got a message too. From Theo's phone. Sent by Mara.", sfx=[{"at": 0.3, "name": "buzz"}]),
    sc(4, "recording", "recording", 4.0, "hush", {"rec": {"title": "Voice memo", "sub": "The Linden · Thu 7:42 PM", "voice": "celeste"}},
        lines=[L("celeste", "Theo signs. Mara catches him. And everyone thanks me.", fx="phone", pause_before=0.3)], gain=-8),
    sc(5, "priya", "stage", 4.2, "power", stage("boardroom_day", "power", [
        act("priya", 815, 750, 1.22, acting=[A(t=0, expr="guilty", gaze=[-0.6, 0.2], turn=-0.35, tilt=3), A(line=1, off=0, expr="neutral", gaze=[-0.6, 0], turn=-0.35)]),
        act("mara", 280, 730, 1.22, acting=[A(t=0, expr="calculating", gaze=[0.6, 0], turn=0.35), A(line=1, off=0.5, expr="pleased", gaze=[0.6, 0], turn=0.35)])], table=False),
        lines=[L("priya", "I'm sorry it took me so long.", pause_after=0.3), L("priya", "Compliance has the recording.")], sfx=[{"at": 0.0, "name": "door"}]),
    sc(6, "nine-fifteen", "stage", 3.2, "cold", stage("boardroom_day", "cold", [act("celeste", 540, 790, 2.2, light="right", acting=[A(t=0, expr="frozen", gaze=[0.2, 0], turn=0.1), A(line=0, off=0, expr="cold", gaze=[0, 0], turn=0), A(line=0, off=1.0, expr="cool_smile", gaze=[0, 0], turn=0, tilt=-2)])], table=False, cam={"zoom": [1.0, 1.1]},
        clock={"from": "9:14", "to": "9:15", "flip_at": 0.4}), lines=[L("celeste", "Well played.", pause_before=0.9)], sfx=[{"at": 0.4, "name": "tick"}]),
    sc(7, "ring-off", "insert_hand", 2.8, "aftermath", {"hand": {"who": "celeste", "ring": True, "action": "remove", "at": 0.4}, "surface": "folder", "grade": "cold"}, caption="She takes off the ring.", sfx=[{"at": 1.6, "name": "pen"}]),
    sc(8, "end", "stage", 6.0, "aftermath", stage("office_day", "power", [act("mara", 540, 760, 1.6, acting=[A(t=0, expr="confident", gaze=[0.4, -0.1], turn=0.2), A(t=3.6, expr="realise", gaze=[0.05, 0.85], turn=0.05), A(t=4.5, expr="smirk", gaze=[0, 0], turn=0, tilt=-3)])], cam={"zoom": [1.0, 1.06]},
        phone_toast={"at": 3.5, "from": "Unknown", "text": "Impressive. Want to play for real?"}, end_card={"at": 5.1, "ep": "END OF SEASON 1", "next": ""}),
        lines=[L("narrator", "The easiest person to steer", pause_after=0.15), L("narrator", "is the one who thinks they're steering.")], sfx=[{"at": 3.5, "name": "buzz"}], pad=1.0, trans="fade"),
]))

for n, (eid, title, scenes) in enumerate(EPISODES, 1):
    ep = {"id": eid, "number": n, "season": 1, "title": title, "series": "FIVE MESSAGES",
          "central_question": "Who is sending Mara messages that predict exactly what people will do, and why?",
          "template": "thriller", "narrator_voice": "en_GB-alba-medium", "narration_speed": 1.1,
          "target_duration_seconds": [26, 50], "visual_mode": "svg", "caption_style": "thriller",
          "cast": ["mara", "theo", "priya", "celeste"], "fiction_notice": "Fictional story. Characters, company and events are invented.",
          "music": {"style": "thriller", "bpm": 76}, "scenes": scenes,
          "claims": [{"id": "C1", "type": "illustrative", "text": "Fictional drama about flattery, conditional approval and predictable incentives; it makes no factual claim about real people.", "sources": []}],
          "sources": []}
    d = ROOT / "episodes" / eid; d.mkdir(parents=True, exist_ok=True)
    (d / "episode.json").write_text(json.dumps(ep, indent=2, ensure_ascii=False) + "\n")
    (d / "research.md").write_text(f"# Story notes: FIVE MESSAGES, Episode {n}: {title}\n\nFictional. See series/five-messages/bible.md for the full story, continuity rules and the psychology behind it.\n")
    (ROOT / "renderer" / "scenes" / f"{eid}.js").write_text("/* Uses the shared thriller scene types in renderer/cast.js: stage(, phone_thread(, document(, insert_hand(, calendar(, recording( */\n")
    print("wrote", eid, len(scenes), "shots")
