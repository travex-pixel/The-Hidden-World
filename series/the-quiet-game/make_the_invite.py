"""THE QUIET GAME — Episode 3: The Invite. Source of truth for the long-form script and shot plan.

usage: python series/the-quiet-game/make_the_invite.py   -> writes episodes/qg03-the-invite/episode.json

First episode on voice engine v2 (Kokoro voices, whole-sentence lines with paged captions, room tone).
Leah is promoted; a week later Daniel is quietly removed from the Ostrel meeting, reads a one-word reply as a
verdict, and has to separate what happened from the story he is telling himself.
"""
from __future__ import annotations
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
EP_ID = "qg03-the-invite"
SCENES: list[dict] = []
sys.path.insert(0, str(Path(__file__).resolve().parent))
from qg_lib import N as _N, S, K, ARM, A, desk, DAN_DESK, LEAH_SIDE, scene as _scene  # noqa: E402


def scene(*a, **kw):
    _scene(SCENES, *a, **kw)


def N(text, **kw):          # Kokoro narrator: pace comes from characters/narrator.json, not a per-line factor
    kw.setdefault("speed", 1.0)
    return _N(text, **kw)


GLASS_MEETING = [{"x": 1480, "head": "#7d7873", "body": "#b9a98c", "sway": True}, {"x": 1640, "head": "#1a1210", "body": "#d9603f"}, {"x": 1800, "head": "#1c1816", "body": "#3c3f78", "sway": True}]
SLIDE_OSTREL = {"title": "Ostrel weekly", "bullets": ["Barrow evening runs: week 3", "Late deliveries: down 38", "Carlton next"]}
MEET = {"kind": "table", "back": 742, "front": 900, "x0": -60, "x1": 1000, "slant": 80, "items": [{"kind": "laptop", "x": 760}, {"kind": "glass", "x": 380}, {"kind": "notebook", "x": 120}]}

# ================================================================ COLD OPEN
scene("e01_cold_calendar", "ws_insert", {
    "env": "open_plan", "grade": "cold", "flash": True, "chip": "MONDAY · 08:59",
    "ui": {"kind": "email", "app": "Calendar", "from": "Calendar", "to": "Daniel Hale", "subject": "Updated: Ostrel weekly (Mondays, 10:00)",
           "body": ["Graham Royce updated this event.", "", "You are no longer an attendee."], "highlight": ["You are no longer an attendee."], "highlight_at": "L0+1.2"}},
    [N("At 8:59 on Monday, a meeting disappeared from Daniel's calendar.", pause_before=0.6)],
    cue="cold", chapter="Monday, 8:59", sfx=[(0.0, "swell"), (0.4, "ping")])

scene("e02_cold_daniel", "ws_stage", {
    "env": "open_plan", "grade": "cold", "flash": True, "bg_blur": 3, "camera": {"zoom": [1.0, 1.08]}, "desk": desk(),
    "glass_figures": GLASS_MEETING,
    "actors": [A("daniel", 700, 440, 0.95, [K(0, expr="neutral", gaze=[0.6, 0.35], turn=0.32), K(1.6, expr="tight", gaze=[0.9, -0.25], turn=0.55, tilt=-2), K(line=1, off=0.6, expr="guilty", gaze=[0.3, 0.55], turn=0.2, tilt=3)],
                 arms=[ARM(0, l="desk", r="desk")], seated=True)]},
    [N("Nobody told him why.", pause_before=0.8), N("And by lunchtime, he had decided exactly what it meant.", pause_before=0.4)],
    cue="cold", pad=0.8)

scene("e03_title", "ws_title", {"title": "THE QUIET GAME", "subtitle": "EPISODE 3 · THE INVITE", "notice": "A fictional story. The psychology is real."},
      cue="hush", min_d=4.3, sfx=[(0.3, "swell")], note="Title card: The Quiet Game, Episode 3, The Invite.")

# ================================================================ 1 · THE PROMOTION
scene("e04_announcement", "ws_insert", {
    "env": "open_plan", "grade": "warm", "chip": "ONE WEEK EARLIER", "rewind": 1.0, "chapter_tag": {"n": "CHAPTER 1", "title": "The promotion", "y": 860, "hold": 4},
    "ui": {"kind": "email", "from": "Ruth Adeyemi", "to": "Everyone, Halvern Logistics", "subject": "Please congratulate our new Senior Analyst",
           "body": ["All,", "", "Please congratulate Leah Carter, our new Senior Analyst.", "From Monday, Leah leads the Ostrel account day to day.",
                    "Daniel Hale continues on Carlton and the Barrow pilot.", "", "Ruth"], "highlight": ["Leah Carter, our new Senior Analyst"], "highlight_at": "L0+1.0"}},
    [N("A week earlier, Ruth had made her decision.", pause_before=1.2), N("Leah got the promotion.", pause_before=0.3)],
    cue="warm", chapter="The promotion", sfx=[(0.0, "whoosh"), (1.4, "ping")])

scene("e05_congrats", "ws_stage", {
    "env": "kitchen", "grade": "warm", "bg_blur": 3, "camera": {"zoom": [1.0, 1.05]},
    "actors": [A("daniel", 700, 420, 0.92, [K(0, expr="pleased", gaze=[0.6, 0.05], turn=0.4, tilt=3), K(line=2, off=0.0, expr="confident", gaze=[0.6, 0.05], turn=0.4, tilt=-2)],
                 arms=[ARM(0, r="mug", l="rest"), ARM(line=0, off=0.2, r="talk"), ARM(line=0, off=2.4, r="mug")], mug_colour="#4f7cac"),
               A("leah", 1260, 400, 0.9, [K(0, expr="pleased", gaze=[-0.6, 0.05], turn=-0.42, tilt=-2), K(line=1, off=0.0, expr="skeptical", gaze=[-0.6, 0.05], turn=-0.42, tilt=4), K(line=2, off=1.2, expr="pleased", gaze=[-0.6, 0.05], turn=-0.42, tilt=-3)],
                 arms=[ARM(0, l="mug", r="rest")], mug_colour="#e06a4f", light="right")]},
    [S("daniel", "Senior Analyst Carter. Congratulations. You earned it.", pause_before=0.6),
     S("leah", "You're really not annoyed?", pause_before=0.5),
     S("daniel", "I'd have been annoyed if it was anyone else.", pause_before=0.5)],
    cue="warm")

scene("e05b_list", "ws_stage", {
    "env": "open_plan", "grade": "warm", "bg_blur": 3, "camera": {"zoom": [1.0, 1.05]}, "desk": desk(),
    "actors": [A("daniel", seated=True, **DAN_DESK, acting=[K(0, expr="pleased", gaze=[0.7, -0.2], turn=0.45), K(line=1, off=0.6, expr="neutral", gaze=[0.7, -0.2], turn=0.45)], arms=[ARM(0, l="desk", r="desk")]),
               A("graham", 1480, 340, 0.84, [K(0, expr="charm", gaze=[-0.2, 0.2], turn=-0.15, tilt=3), K(line=0, off=0.0, expr="pleased", gaze=[0.6, 0.1], turn=0.3, tilt=2), K(line=1, off=0.4, expr="cool_smile", gaze=[-0.6, 0.3], turn=-0.42)],
                 arms=[ARM(0, l="rest", r="mug"), ARM(line=0, off=0.3, r="talk"), ARM(line=1, off=2.0, r="mug")], mug_colour="#8c3b4a", light="right")]},
    [S("graham", "Congratulations, Leah. Ostrel's all yours now.", pause_before=0.6),
     S("graham", "Don't worry about the meeting list. I'll sort it.", pause_before=0.5)],
    cue="intimate", pad=0.8)

scene("e06_meant_it", "ws_stage", {
    "env": "kitchen", "grade": "warm", "bg_blur": 5, "camera": {"zoom": [1.04, 1.12]},
    "actors": [A("daniel", 940, 450, 1.2, [K(0, expr="pleased", gaze=[0.4, 0.05], turn=0.25, tilt=3), K(line=1, off=0.6, expr="neutral", gaze=[0.2, 0.4], turn=0.12)], arms=[ARM(0, r="mug", l="rest")], mug_colour="#4f7cac")]},
    [N("He meant it.", pause_before=0.5), N("Which is what made the next week so strange.", pause_before=0.3)],
    cue="intimate", pad=0.8)

# ================================================================ 2 · THE MISSING INVITE
scene("e07_through_glass", "ws_stage", {
    "env": "open_plan", "grade": "cold", "chip": "MONDAY · 10:00", "bg_blur": 2, "chapter_tag": {"n": "CHAPTER 2", "title": "The missing invite", "hold": 4},
    "camera": {"zoom": [1.0, 1.06], "x": [0, -40]}, "desk": desk(), "glass_figures": GLASS_MEETING,
    "actors": [A("daniel", 700, 440, 0.86, [K(0, expr="neutral", gaze=[0.9, -0.25], turn=0.55, tilt=-2), K(line=1, off=0.4, expr="tight", gaze=[0.9, -0.25], turn=0.55), K(line=1, off=2.6, expr="guilty", gaze=[0.3, 0.55], turn=0.2, tilt=3)],
                 arms=[ARM(0, l="desk", r="desk")], seated=True)]},
    [N("At ten o'clock, three people walked into the Ostrel meeting: Graham, Ruth, and Leah.", pause_before=0.6),
     N("Daniel watched them through the glass, and pretended to read a spreadsheet.", pause_before=0.4)],
    cue="unease", chapter="The missing invite", sfx=[(0.6, "door")])

scene("e07b_morning", "ws_stage", {
    "env": "open_plan", "grade": "cold", "chip": "MONDAY · 11:01", "bg_blur": 3, "camera": {"zoom": [1.0, 1.04]}, "desk": desk(),
    "actors": [A("daniel", seated=True, **DAN_DESK, acting=[K(0, expr="neutral", gaze=[0.6, 0.35], turn=0.32), K(line=0, off=0.0, expr="pleased", gaze=[0.8, -0.15], turn=0.5), K(line=1, off=0.0, expr="tight", gaze=[0.9, -0.1], turn=0.55)], arms=[ARM(0, l="typing", r="typing"), ARM(line=0, off=0.0, l="desk", r="desk")]),
               A("leah", 2100, 380, 0.78, [K(0, expr="neutral", gaze=[-0.6, 0.1], turn=-0.4, x=2100), K(0.2, x=1500, dur=1.2), K(line=0, off=0.0, expr="pleased", gaze=[-0.7, 0.25], turn=-0.45, x=1500), K(line=0, off=0.8, expr="tight", gaze=[0.6, 0.1], turn=0.4, x=1500), K(line=0, off=1.0, x=-300, dur=2.2)],
                 arms=[ARM(0, l="paper", r="paper")], light="right")]},
    [S("leah", "Morning! Sorry, running to Ruth.", pause_before=1.3, speed=0.95),
     N("She was busy. Daniel heard: she can't even look at me.", pause_before=1.2)],
    cue="unease", sfx=[(0.3, "step"), (0.8, "step"), (2.6, "step")])

scene("e08_thanks", "ws_insert", {
    "env": "open_plan", "grade": "cold", "chip": "MONDAY · 11:20",
    "ui": {"kind": "chat", "title": "Graham Royce", "channels": [["Graham Royce", "#8c3b4a"], ["Leah Carter", "#e06a4f"], ["Ruth Adeyemi", "#5b5fb0"]],
           "messages": [{"from": "Daniel Hale", "colour": "#4f7cac", "time": "11:02", "text": "Hi Graham, I saw the Ostrel invite changed. All good?", "at": 0.4},
                        {"from": "Graham Royce", "colour": "#8c3b4a", "time": "11:20", "text": "Thanks.", "at": "L0+0.6"}], "highlight": 1, "highlight_at": "L1+0.2"}},
    [N("So Daniel sent a careful little message. Eighteen minutes later, Graham replied.", pause_before=1.4),
     N("One word. And a full stop.", pause_before=0.6)],
    cue="unease", pad=1.2, sfx=[(0.4, "ping")])

scene("e09_reads_it", "ws_stage", {
    "env": "open_plan", "grade": "cold", "bg_blur": 5, "camera": {"zoom": [1.0, 1.1], "handheld": 0.35}, "desk": desk(),
    "actors": [A("daniel", 900, 450, 1.22, [K(0, expr="neutral", gaze=[0.6, 0.35], turn=0.35), K(0.9, expr="realise", gaze=[0.6, 0.3], turn=0.35, tilt=2), K(2.0, expr="tight", gaze=[0.2, 0.55], turn=0.12, tilt=3)],
                 arms=[ARM(0, l="desk", r="desk"), ARM(1.6, r="neck", dur=0.6)], seated=True, light="right")]},
    cue="hush", min_d=3.0, gain=-6, sfx=[(0.6, "thump"), (1.4, "thump")], note="Daniel rereads the word Thanks.")

# ================================================================ 3 · THE STORY
scene("e10_awake", "ws_stage", {
    "env": "home_night", "grade": "aftermath", "chip": "MONDAY · 23:51", "bg_blur": 3, "rain": True, "chapter_tag": {"n": "CHAPTER 3", "title": "The story", "hold": 4}, "camera": {"zoom": [1.06, 1.0], "x": [-40, 0]},
    "actors": [A("daniel", 1180, 440, 0.95, [K(0, expr="tight", gaze=[-0.6, -0.1], turn=-0.45, tilt=-2), K(line=1, off=0.4, expr="cold", gaze=[-0.4, 0.2], turn=-0.3), K(line=3, off=0.4, expr="guilty", gaze=[-0.2, 0.5], turn=-0.15, tilt=3)],
                 arms=[ARM(0, l="cross", r="cross")], light="right")]},
    [N("By midnight, Daniel had written a whole story.", pause_before=0.6),
     N("Graham was punishing him for correcting the record. Twice.", pause_before=0.3),
     N("Leah had asked for him to be taken off the account, now that she was the boss.", pause_before=0.3),
     N("And everyone in that meeting had looked at his empty chair, and understood.", pause_before=0.3)],
    cue="cold", chapter="The story")

scene("e10b_unsent", "ws_insert", {
    "env": "home_night", "grade": "aftermath", "chip": "TUESDAY · 00:14",
    "ui": {"kind": "email", "from": "Daniel Hale", "to": "Graham Royce", "subject": "Re: Ostrel weekly", "type_at": 0.4, "cps": 30,
           "body": ["Graham,", "", "If you have a problem with me, I'd rather you said it to my face than took me off meetings."],
           "stamp": {"text": "NOT SENT", "colour": "#c0303a", "at": "L0+2.6"}}},
    [N("At fourteen minutes past midnight, he wrote a reply. Then, thankfully, he didn't send it.", pause_before=3.2)],
    cue="cold", pad=1.4, sfx=[(0.6, "tick"), (1.4, "tick"), (2.2, "tick")])

scene("e11_facts", "ws_explainer", {"ex": {"kind": "facts", "title": "Facts and the story", "sub": "WHAT DANIEL ACTUALLY KNEW",
    "facts": [{"text": "His name came off the invite", "at": "L0+0.6"}, {"text": "Graham replied: \"Thanks.\"", "at": "L0+1.8"}, {"text": "Leah now leads Ostrel", "at": "L0+3.0"}],
    "story": [{"text": "Graham is punishing me", "at": "L1+0.6"}, {"text": "Leah wanted me gone", "at": "L1+2.0"}, {"text": "Everyone noticed", "at": "L1+3.2"}]}},
    [N("Here's what he actually knew. His name came off an invite. Graham wrote one word. Leah leads the account now.", pause_before=0.4),
     N("Everything on the right was a story he'd built on top. Some of it might even have been true.", pause_before=0.5)],
    cue="curious")

# ================================================================ 4 · WHY IT HURTS
scene("e12_why", "ws_stage", {
    "env": "home_night", "grade": "aftermath", "flash": True, "bg_blur": 4, "chapter_tag": {"n": "CHAPTER 4", "title": "Why it hurts", "hold": 4}, "camera": {"zoom": [1.0, 1.06]},
    "actors": [A("daniel", 960, 450, 1.1, [K(0, expr="tight", gaze=[0.1, 0.5], turn=0.05, tilt=3)], arms=[ARM(0, l="cross", r="cross")], light="right")]},
    [N("Why does a missing calendar invite feel like a punch? Psychologists have spent decades on exactly that question.", pause_before=0.5)],
    cue="curious", chapter="Why it hurts")

scene("e13_cyberball", "ws_explainer", {"ex": {"kind": "cyberball", "title": "Cyberball", "sub": "FORCE 1 · OSTRACISM", "names": ["Player", "You", "Player"], "exclude_at": 4.6, "label": "No more throws",
    "cite": "Williams, Cheung & Choi (2000), JPSP; Zadro et al. (2004), JESP", "cite_at": "L0+0.0"}},
    [N("In one well-known experiment, people played a simple online game of catch with two strangers.", pause_before=0.3),
     N("After a few throws, the others quietly stopped passing them the ball.", pause_before=0.3),
     N("Being left out made people feel worse, and less like they belonged, even in a game with strangers they would never meet.", pause_before=0.4),
     N("In a later study, it still stung when people were told the other players were just a computer.", pause_before=0.3),
     N("And in the same research, people who had been left out were more likely to go along with the group afterwards. Exclusion makes us try harder to fit back in.", pause_before=0.4)],
    cue="curious", claims=["C1"])

scene("e14_work", "ws_stage", {
    "env": "open_plan", "grade": "neutral", "flash": True, "bg_blur": 3, "camera": {"zoom": [1.0, 1.06]}, "desk": desk(), "glass_figures": GLASS_MEETING,
    "actors": [A("daniel", 700, 440, 0.86, [K(0, expr="tight", gaze=[0.9, -0.25], turn=0.55, tilt=-2)], arms=[ARM(0, l="desk", r="desk")], seated=True)]},
    [N("At work, being ignored is often treated as harmless, nothing like being shouted at.", pause_before=0.4),
     N("But one study found it was more strongly linked to feeling you don't belong, and to people leaving their jobs years later.", pause_before=0.3)],
    cue="curious", claims=["C2"])

scene("e15_tone", "ws_explainer", {"ex": {"kind": "bars", "title": "The one-word email", "sub": "FORCE 2 · TONE", "chance": 50, "chance_at": "L2+0.2", "chance_label": "a coin flip",
    "rows": [{"label": "Senders expected", "value": 78, "colour": "#d98a9a", "at": "L1+0.6"}, {"label": "Readers got it right", "value": 56, "colour": "#7fc8e8", "at": "L2+0.0"}],
    "note": "\"Thanks.\" carries no tone. The reader supplies it.", "note_at": "L3+0.4", "cite": "Kruger, Epley, Parker & Ng (2005), JPSP", "cite_at": "L0+0.0"}},
    [N("Then there's the word itself.", pause_before=0.4),
     N("In one study, people sending emails expected readers to catch their tone, serious or sarcastic, about seventy-eight percent of the time.", pause_before=0.2),
     N("The readers got it right about fifty-six percent of the time. Barely better than a coin flip.", pause_before=0.3),
     N("Without a voice or a face, the reader fills in the tone. And when we're worried, we fill it in darker.", pause_before=0.4)],
    cue="tension-rise", claims=["C3"])

scene("e16_spotlight", "ws_explainer", {"ex": {"kind": "bars", "title": "The empty chair", "sub": "FORCE 3 · THE SPOTLIGHT EFFECT",
    "rows": [{"label": "Guessed noticed", "value": 50, "colour": "#d98a9a", "shown": "about half", "at": "L1+0.4"}, {"label": "Actually noticed", "value": 25, "colour": "#7fc8e8", "shown": "about a quarter", "at": "L1+2.2"}],
    "cite": "Gilovich, Medvec & Savitsky (2000), JPSP", "cite_at": "L0+0.0"}},
    [N("And that empty chair? Probably fewer people noticed it than Daniel thought.", pause_before=0.4),
     N("Students made to wear an embarrassing T-shirt into a room guessed that about half the people there noticed. About a quarter actually did.", pause_before=0.3),
     N("We are the main character in our own heads. Everyone else is busy being the main character in theirs.", pause_before=0.4)],
    cue="curious", claims=["C4"])

scene("e16b_thinner", "ws_stage", {
    "env": "home_night", "grade": "aftermath", "bg_blur": 3, "camera": {"zoom": [1.0, 1.06]},
    "actors": [A("daniel", 1180, 440, 0.95, [K(0, expr="guilty", gaze=[-0.2, 0.5], turn=-0.15, tilt=3), K(line=1, off=0.6, expr="neutral", gaze=[-0.5, 0.0], turn=-0.35), K(line=2, off=0.4, expr="confident", gaze=[0.0, 0.05], turn=-0.05, tilt=-2)],
                 arms=[ARM(0, l="cross", r="cross"), ARM(line=2, off=0.0, l="rest", r="rest", dur=0.8)], light="right")]},
    [N("None of this proved Daniel wrong. Maybe he really was being frozen out.", pause_before=0.6),
     N("But the facts were much thinner than the story, and the story was keeping him awake.", pause_before=0.4),
     N("There was only one way to find out which one was true.", pause_before=0.5)],
    cue="aftermath", pad=0.8, claims=["C6"])

# ================================================================ 5 · THE QUESTION
scene("e17_choice", "ws_stage", {
    "env": "open_plan", "grade": "neutral", "chip": "TUESDAY · 08:40", "bg_blur": 4, "chapter_tag": {"n": "CHAPTER 5", "title": "The question", "hold": 4}, "camera": {"zoom": [1.0, 1.06]}, "desk": desk(),
    "actors": [A("daniel", seated=True, **DAN_DESK, acting=[K(0, expr="tight", gaze=[0.6, 0.35], turn=0.32), K(line=1, off=0.4, expr="neutral", gaze=[0.3, 0.1], turn=0.15), K(line=1, off=2.6, expr="confident", gaze=[0.7, -0.15], turn=0.45, tilt=-2)],
                 arms=[ARM(0, l="desk", r="desk")])]},
    [N("On Tuesday morning, Daniel had two options. Keep polishing the story, or ask a question.", pause_before=0.6),
     N("He started with the person closest to the facts.", pause_before=0.4)],
    cue="curious", chapter="The question")

scene("e18_ask_leah", "ws_stage", {
    "env": "kitchen", "grade": "warm", "bg_blur": 3, "camera": {"zoom": [1.0, 1.05]},
    "actors": [A("daniel", 700, 420, 0.92, [K(0, expr="tight", gaze=[0.6, 0.05], turn=0.4), K(line=0, off=0.0, expr="neutral", gaze=[0.6, 0.05], turn=0.4), K(line=2, off=0.0, expr="realise", gaze=[0.6, 0.0], turn=0.42), K(line=4, off=0.6, expr="pleased", gaze=[0.6, 0.05], turn=0.4, tilt=3)],
                 arms=[ARM(0, r="mug", l="rest"), ARM(line=0, off=0.2, r="open", dur=0.5), ARM(line=0, off=3.4, r="mug")], mug_colour="#4f7cac"),
               A("leah", 1260, 400, 0.9, [K(0, expr="pleased", gaze=[-0.6, 0.05], turn=-0.42), K(line=1, off=0.0, expr="neutral", gaze=[-0.6, 0.05], turn=-0.42, tilt=3), K(line=2, off=0.4, expr="realise", gaze=[-0.6, 0.0], turn=-0.42), K(line=4, off=0.0, expr="confident", gaze=[-0.6, 0.05], turn=-0.42, tilt=-2)],
                 arms=[ARM(0, l="mug", r="rest"), ARM(line=1, off=0.2, r="talk"), ARM(line=1, off=3.0, r="rest"), ARM(line=4, off=0.2, r="point"), ARM(line=4, off=2.0, r="rest")], mug_colour="#e06a4f", light="right")]},
    [S("daniel", "Can I ask you something, without it being weird? Was I taken off the Ostrel call on purpose?", pause_before=0.6),
     S("leah", "Graham set the list. He said you'd want a break from Ostrel, after everything.", pause_before=0.6),
     S("leah", "I assumed you'd asked for it.", pause_before=0.4),
     S("daniel", "I didn't.", pause_before=0.7),
     S("leah", "Then ask to come back. I want you in that room.", pause_before=0.6)],
    cue="intimate")

scene("e18b_noticed", "ws_stage", {
    "env": "kitchen", "grade": "warm", "bg_blur": 4, "camera": {"zoom": [1.0, 1.06]},
    "actors": [A("leah", 1000, 430, 1.05, [K(0, expr="neutral", gaze=[-0.45, 0.05], turn=-0.3), K(line=0, off=0.6, expr="pleased", gaze=[-0.45, 0.05], turn=-0.3, tilt=3)], arms=[ARM(0, l="mug", r="rest"), ARM(line=0, off=0.3, r="talk"), ARM(line=0, off=3.2, r="rest")], mug_colour="#e06a4f", light="right")]},
    [S("leah", "For what it's worth, I noticed you weren't there. I don't think anyone else did.", pause_before=0.6)],
    cue="intimate", pad=0.8)

scene("e19_email", "ws_insert", {
    "env": "open_plan", "grade": "day", "chip": "TUESDAY · 09:12",
    "ui": {"kind": "email", "from": "Daniel Hale", "to": "Graham Royce", "subject": "Ostrel weekly", "type_at": 0.4, "cps": 38,
           "body": ["Hi Graham,", "", "I noticed I'm no longer on the Ostrel weekly. I'd like to stay involved with the account, and I can make the time.",
                    "Could you add me back? Happy to talk if there's a reason I'm missing.", "", "Thanks,", "Daniel"],
           "highlight": ["Could you add me back?"], "highlight_at": "L1+0.4", "stamp": {"text": "SENT", "at": "L2+0.8"}}},
    [N("Then he wrote to Graham.", pause_before=1.2), N("A fact. A request. And an open door, in case there was a reason he didn't know.", pause_before=1.2),
     N("No accusation anywhere in it.", pause_before=0.6)],
    cue="power", gain=-5, pad=1.6, sfx=[(0.4, "tick"), (1.2, "tick")])

scene("e20_graham", "ws_stage", {
    "env": "open_plan", "grade": "neutral", "chip": "TUESDAY · 09:40", "bg_blur": 3, "camera": {"zoom": [1.0, 1.05]}, "desk": desk(),
    "actors": [A("daniel", seated=True, **DAN_DESK, acting=[K(0, expr="neutral", gaze=[0.7, -0.2], turn=0.45), K(line=1, off=0.0, expr="neutral", gaze=[0.7, -0.22], turn=0.45, tilt=-2), K(line=1, off=1.6, expr="confident", gaze=[0.7, -0.22], turn=0.45, tilt=-2)],
                 arms=[ARM(0, l="desk", r="desk"), ARM(line=1, off=0.3, r="open"), ARM(line=1, off=2.6, r="desk")]),
               A("graham", 1500, 340, 0.86, [K(0, expr="charm", gaze=[-0.6, 0.3], turn=-0.42, tilt=3, lean=-3), K(line=1, off=1.0, expr="tight", gaze=[-0.6, 0.3], turn=-0.42), K(line=2, off=0.0, expr="cool_smile", gaze=[-0.6, 0.3], turn=-0.42, tilt=2)],
                 arms=[ARM(0, l="rest", r="talk"), ARM(line=0, off=3.4, r="rest")], light="right")]},
    [S("graham", "Daniel. I took you off to lighten the load. I thought you'd earned a breather.", pause_before=0.6),
     S("daniel", "I appreciate that. I'd rather decide my own load.", pause_before=0.6),
     S("graham", "Fair enough. I'll add you back.", pause_before=0.9)],
    cue="unease")

scene("e21_kindness", "ws_stage", {
    "env": "open_plan", "grade": "aftermath", "bg_blur": 5, "camera": {"zoom": [1.06, 1.16]},
    "actors": [A("graham", 980, 450, 1.25, [K(0, expr="cool_smile", gaze=[-0.4, 0.15], turn=-0.25, tilt=2), K(line=0, off=1.4, expr="neutral", gaze=[-0.2, 0.4], turn=-0.12)], arms=[ARM(0, l="rest", r="rest")], light="right")]},
    [N("Was it kindness? Or a quiet way of moving Daniel to the edge of the room? Graham's answer fitted both.", pause_before=0.6),
     N("And Daniel didn't need to know which. He only needed to be back in the room.", pause_before=0.5)],
    cue="aftermath", pad=0.8, claims=["C6"])

scene("e22_asks", "ws_explainer", {"ex": {"kind": "bars", "title": "Just ask", "sub": "FORCE 4 · WE UNDERESTIMATE YES", "unit": "", "max": 12,
    "rows": [{"label": "Expected to need", "value": 10, "colour": "#d98a9a", "shown": "about 2x", "at": "L0+2.4"},
             {"label": "Actually took", "value": 5, "colour": "#7fe0a0", "shown": "half", "at": "L0+4.0"}],
    "cite": "Flynn & Lake (2008), JPSP", "cite_at": "L0+0.0"}},
    [N("Here's the part most of us get wrong. In a series of studies, people asking strangers for help expected to need about twice as many asks as it actually took.", pause_before=0.4),
     N("We focus on what helping costs the other person, and forget how awkward it is to say no to a direct, polite request.", pause_before=0.4)],
    cue="curious", claims=["C5"])

scene("e23_ruth", "ws_stage", {
    "env": "glass_office", "grade": "power", "chip": "TUESDAY · 15:00", "bg_blur": 2, "camera": {"zoom": [1.0, 1.04]},
    "desk": {"back": 724, "front": 884, "x0": 1050, "x1": 2100, "slant": 50, "items": [{"kind": "laptop", "x": 1640}, {"kind": "paper", "x": 1400}]},
    "actors": [A("ruth", 1480, 420, 0.82, [K(0, expr="neutral", gaze=[-0.6, 0.0], turn=-0.42), K(line=1, off=0.2, expr="cool_smile", gaze=[-0.6, 0.0], turn=-0.42, tilt=-3), K(line=2, off=0.2, expr="confident", gaze=[-0.6, 0.0], turn=-0.42)], arms=[ARM(0, l="steeple", r="steeple"), ARM(line=2, off=0.3, r="talk"), ARM(line=2, off=3.0, r="steeple")], seated=True, light="right"),
               A("daniel", 560, 390, 0.86, [K(0, expr="neutral", gaze=[0.6, 0.05], turn=0.4), K(line=1, off=1.0, expr="pleased", gaze=[0.65, 0.0], turn=0.42, tilt=3)],
                 arms=[ARM(0, l="rest", r="rest"), ARM(line=0, off=0.4, r="talk"), ARM(line=0, off=3.4, r="rest")])]},
    [S("daniel", "Ruth, could I have fifteen minutes with you once a month? I'd like to know what you need from me.", pause_before=0.6),
     S("ruth", "Of course. I was wondering when you'd ask.", pause_before=0.7),
     S("ruth", "And if something changes and you don't know why, come and ask me first.", pause_before=0.5)],
    cue="power", pad=0.8)

# ================================================================ 6 · HOLDING THE DOOR
scene("e24_back", "ws_stage", {
    "env": "meeting_room", "grade": "warm", "chip": "THE NEXT MONDAY · 10:00", "bg_blur": 1, "slide": SLIDE_OSTREL, "desk": MEET, "chapter_tag": {"n": "CHAPTER 6", "title": "Holding the door", "hold": 4}, "camera": {"zoom": [1.0, 1.04]},
    "actors": [A("daniel", 250, 470, 0.64, [K(0, expr="pleased", gaze=[0.8, -0.1], turn=0.45), K(line=1, off=0.0, expr="confident", gaze=[0.8, -0.1], turn=0.45)], arms=[ARM(0, l="desk", r="desk"), ARM(line=1, off=0.3, r="talk"), ARM(line=1, off=2.6, r="desk")], seated=True),
               A("leah", 520, 470, 0.64, [K(0, expr="confident", gaze=[0.8, -0.15], turn=0.45), K(line=0, off=0.6, expr="pleased", gaze=[-0.8, -0.1], turn=-0.45, tilt=3)], arms=[ARM(0, l="desk", r="desk"), ARM(line=0, off=0.4, r="talk"), ARM(line=0, off=3.0, r="desk")], seated=True),
               A("graham", 1560, 380, 0.82, [K(0, expr="neutral", gaze=[-0.7, 0.25], turn=-0.45)], arms=[ARM(0, l="rest", r="rest")], light="right")]},
    [S("leah", "Good, everyone's here. Daniel, start us off with Carlton?", pause_before=0.6),
     S("daniel", "Happy to. Carlton's evening runs look a lot like Northfield's did.", pause_before=0.5)],
    cue="warm", chapter="Holding the door")

scene("e25_new_invite", "ws_insert", {
    "env": "open_plan", "grade": "neutral", "chip": "MONDAY · 14:30",
    "ui": {"kind": "email", "app": "Calendar", "from": "Graham Royce", "to": "Daniel Hale", "subject": "Invitation: Carlton planning (Thursday, 11:00)",
           "body": ["Attendees: Graham Royce, Daniel Hale", "", "Agenda: evening runs at Carlton."], "highlight": ["Attendees: Graham Royce, Daniel Hale"], "highlight_at": "L0+1.6"}},
    [N("That afternoon, a new invite arrived. Carlton planning. Graham, and Daniel.", pause_before=0.6),
     N("The whole evening-runs plan started with a pattern Leah spotted. Her name wasn't on it.", pause_before=0.5)],
    cue="unease", sfx=[(0.3, "ping")])

scene("e26_forward", "ws_insert", {
    "env": "open_plan", "grade": "warm",
    "ui": {"kind": "chat", "title": "Leah Carter", "channels": [["Leah Carter", "#e06a4f"], ["Graham Royce", "#8c3b4a"], ["Ruth Adeyemi", "#5b5fb0"]],
           "messages": [{"from": "Daniel Hale", "colour": "#4f7cac", "time": "14:34", "text": "You should be in Thursday's Carlton planning. I've forwarded the invite.", "at": 0.4},
                        {"from": "Leah Carter", "colour": "#e06a4f", "time": "14:36", "text": "Thank you. Holding the door?", "at": 2.6},
                        {"from": "Daniel Hale", "colour": "#4f7cac", "time": "14:36", "text": "Someone held it for me.", "at": 4.8}]}},
    cue="warm", min_d=7.4, sfx=[(0.4, "ping"), (2.6, "ping"), (4.8, "ping")],
    note="Daniel forwards the Carlton invite to Leah. Leah: Thank you. Holding the door? Daniel: Someone held it for me.")

scene("e26b_carlton", "ws_stage", {
    "env": "meeting_room", "grade": "neutral", "chip": "THURSDAY · 11:00", "bg_blur": 1, "slide": {"title": "Carlton planning", "bullets": ["Evening runs after 18:00", "Barrow model: reuse"]}, "desk": MEET, "camera": {"zoom": [1.0, 1.04]},
    "actors": [A("daniel", 250, 470, 0.64, [K(0, expr="pleased", gaze=[0.8, -0.1], turn=0.45)], arms=[ARM(0, l="desk", r="desk")], seated=True),
               A("leah", 520, 470, 0.64, [K(0, expr="confident", gaze=[0.8, -0.15], turn=0.45)], arms=[ARM(0, l="desk", r="desk")], seated=True),
               A("graham", 1560, 380, 0.82, [K(0, expr="frozen", gaze=[-0.7, 0.25], turn=-0.45), K(line=0, off=0.6, expr="charm", gaze=[-0.7, 0.25], turn=-0.45, tilt=3)], arms=[ARM(0, l="rest", r="rest"), ARM(line=0, off=0.4, r="open"), ARM(line=0, off=2.6, r="rest")], light="right")]},
    [S("graham", "Leah. Good. I was just about to add you.", pause_before=0.9)],
    cue="unease", pad=1.0)

scene("e27_closing", "ws_stage", {
    "env": "glass_office", "tod": "night", "grade": "aftermath", "bg_blur": 6, "camera": {"zoom": [1.06, 1.18]},
    "actors": [A("graham", 960, 470, 1.4, [K(0, expr="neutral", gaze=[0.2, 0.5], turn=0.1, tilt=2), K(line=1, off=0.4, expr="neutral", gaze=[0.05, 0.1], turn=0.02), K(line=2, off=0.6, expr="cool_smile", gaze=[0, 0], turn=0, tilt=-2)],
                 arms=[ARM(0, l="polish", r="polish"), ARM(line=1, off=0.0, l="steeple", r="steeple", dur=0.9)], glasses_off=[{"t": 0, "dur": 3.2}], light="right")]},
    [N("Maybe Graham forgot Leah. Maybe he didn't.", pause_before=0.8),
     N("Exclusion rarely looks like a slammed door.", pause_before=0.6),
     N("It looks like a door that nobody holds open.", pause_before=0.6)],
    cue="cold", pad=1.8, gain=-3, claims=["C6"])

scene("e28_moves", "ws_explainer", {"ex": {"kind": "moves", "title": "Four moves", "sub": "IF YOU'RE QUIETLY LEFT OUT", "items": [
    {"title": "Separate facts from the story", "sub": "What happened, and what you added.", "at": "L1+0.2"},
    {"title": "Ask the person closest to the facts", "sub": "“Can I ask you something, without it being weird?”", "at": "L2+0.0"},
    {"title": "Ask for what you want, in writing", "sub": "A fact, a request, an open door.", "at": "L3+0.0"},
    {"title": "Hold the door for someone else", "sub": "Forward the invite.", "at": "L4+0.0"}]}},
    [N("So if you're ever quietly left out of something at work, here are four moves.", pause_before=0.6),
     N("First, separate what happened from the story you're telling yourself.", pause_before=0.2),
     N("Ask the person closest to the facts, before you decide what it means."),
     N("Ask for what you want, in writing. A fact, a request, and an open door."),
     N("And when you notice someone else missing from the list, forward the invite.")],
    cue="warm", chapter="What to do instead", pad=1.2)

scene("e29_end", "ws_end", {"question": "Have you ever been quietly left out of something at work? Did you ask why?",
                            "tag": "EPISODE 3 · THE INVITE", "notice": "A fictional story. Characters and companies are invented.", "brand_at": "L1+3.0", "fade_out": 1.2},
    [N("Have you ever been quietly left out of something at work?", pause_before=0.8), N("Did you ask why?", pause_before=0.6)],
    cue="outro", pad=2.6, caption_mode="none", transition="fade")


# ---------------------------------------------------------------- episode
SOURCES = [
    {"id": "S1", "title": "Cyberostracism: Effects of being ignored over the Internet (Williams, Cheung & Choi, 2000), JPSP 79(5):748-762", "publisher": "American Psychological Association (PubMed 11079239)", "url": "https://doi.org/10.1037/0022-3514.79.5.748", "accessed": "2026-10-12"},
    {"id": "S2", "title": "How low can you go? Ostracism by a computer is sufficient to lower self-reported levels of belonging, control, self-esteem, and meaningful existence (Zadro, Williams & Richardson, 2004), JESP 40(4):560-567", "publisher": "Elsevier (ResearchGate record)", "url": "https://www.researchgate.net/publication/222425729", "accessed": "2026-10-12"},
    {"id": "S3", "title": "Is negative attention better than no attention? (O'Reilly, Robinson, Berdahl & Banki, 2015), Organization Science 26(3):774-793", "publisher": "INFORMS", "url": "https://doi.org/10.1287/orsc.2014.0900", "accessed": "2026-10-12"},
    {"id": "S4", "title": "Egocentrism over e-mail: Can we communicate as well as we think? (Kruger, Epley, Parker & Ng, 2005), JPSP 89(6):925-936", "publisher": "American Psychological Association (PubMed 16393025)", "url": "https://pubmed.ncbi.nlm.nih.gov/16393025/", "accessed": "2026-10-12"},
    {"id": "S5", "title": "The spotlight effect in social judgment (Gilovich, Medvec & Savitsky, 2000), JPSP 78(2):211-222", "publisher": "American Psychological Association", "url": "https://doi.org/10.1037/0022-3514.78.2.211", "accessed": "2026-10-12"},
    {"id": "S6", "title": "If you need help, just ask: Underestimating compliance with direct requests for help (Flynn & Lake, 2008), JPSP 95(1):128-143", "publisher": "American Psychological Association", "url": "https://doi.org/10.1037/0022-3514.95.1.128", "accessed": "2026-10-12"},
    {"id": "S7", "title": "Ostracism (Williams, 2007), Annual Review of Psychology 58:425-452", "publisher": "Annual Reviews", "url": "https://doi.org/10.1146/annurev.psych.58.110405.085641", "accessed": "2026-10-12"},
]
CLAIMS = [
    {"id": "C1", "type": "established", "text": "Being excluded in Cyberball lowers mood and belonging, even with strangers, and even when told the others are a computer.", "sources": ["S1", "S2", "S7"]},
    {"id": "C2", "type": "established", "text": "Workplace ostracism was rated more acceptable than harassment yet more strongly linked to lower belonging and later turnover (correlational).", "sources": ["S3"]},
    {"id": "C3", "type": "established", "text": "Email senders expected ~78% of recipients to identify tone; recipients managed ~56%, near chance (Study 2; figures via secondary sources).", "sources": ["S4"]},
    {"id": "C4", "type": "established", "text": "Spotlight effect: T-shirt wearers guessed about half noticed; about a quarter did (exact figures vary by source).", "sources": ["S5"]},
    {"id": "C5", "type": "established", "text": "People expected to need about twice as many requests as it took to get help from strangers.", "sources": ["S6"]},
    {"id": "C6", "type": "illustrative", "text": "Graham's motives stay ambiguous; the episode does not claim the exclusion was deliberate.", "sources": []},
]

EPISODE = {
    "id": EP_ID, "number": 3, "series": "THE QUIET GAME", "title": "The Invite",
    "youtube_title": "They Quietly Removed Him From the Meeting. Here's What He Did Next.",
    "central_question": "When you're quietly left out at work, how much of the hurt comes from what happened, and how much from the story you tell yourself?",
    "template": "thriller", "format": "landscape", "voice_engine": "kokoro", "narrator_voice": "en_GB-alba-medium", "target_duration_seconds": [420, 560],
    "visual_mode": "svg", "caption_style": "thriller", "cast": ["daniel", "graham", "leah", "ruth", "narrator"],
    "fiction_notice": "A fictional story. Characters, companies and events are invented. The psychology is real.",
    "music": {"bpm": 86},
    "scenes": SCENES, "claims": CLAIMS, "sources": SOURCES,
    "thumbnail": {
        "actors": [
            A("graham", 560, 470, 1.15, [K(0, expr="cool_smile", gaze=[0.3, 0.05], turn=0.22, tilt=3)], arms=[ARM(0, r="rest", l="rest")], rim="#ffc27a"),
            A("daniel", 1430, 500, 1.55, [K(0, expr="guilty", gaze=[-0.85, 0.08], turn=-0.2, tilt=-3)], arms=[ARM(0, l="rest", r="rest")], light="right", rim="#7fe8ff")],
        "message": {"x": 1000, "y": 880, "rot": -4, "from": "Calendar", "colour": "#6b7280", "time": "08:59", "text": "You are no longer an attendee.", "wrap": 22},
        "text": {"x": 70, "y": 170, "size": 128, "a": "LEFT", "b": "OUT?", "bw": 440}},
}

if __name__ == "__main__":
    d = ROOT / "episodes" / EP_ID
    d.mkdir(parents=True, exist_ok=True)
    (d / "episode.json").write_text(json.dumps(EPISODE, indent=1, ensure_ascii=False) + "\n")
    js = ROOT / "renderer" / "scenes" / f"{EP_ID}.js"
    if not js.exists():
        js.write_text("/* The Quiet Game, Episode 3. All scene types (ws_*) live in renderer/widescreen.js; nothing episode-specific is needed. */\n")
    words = sum(len(l["text"].split()) for s in SCENES for l in s.get("lines", []))
    print(f"wrote {d / 'episode.json'}: {len(SCENES)} scenes, {words} spoken words")
