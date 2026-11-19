"""Fish Audio studio tests: HTTP is mocked, no network, no credit."""
import json
import pytest

from copycat import fish_audio as FA, cast_director as CD, pronunciation as PR, audio_drama as AD, voicecast as VC


def test_cache_key_stable_and_sensitive():
    k = FA.cache_key("s2.1-pro-free", "abc", "Hello there", 1.0, 0.7)
    assert k == FA.cache_key("s2.1-pro-free", "abc", "Hello there", 1.0, 0.7) and len(k) == 64
    for args in (("m2", "abc", "Hello there", 1.0, 0.7), ("s2.1-pro-free", "abd", "Hello there", 1.0, 0.7),
                 ("s2.1-pro-free", "abc", "Hello there!", 1.0, 0.7), ("s2.1-pro-free", "abc", "Hello there", 1.05, 0.7),
                 ("s2.1-pro-free", "abc", "Hello there", 1.0, 0.6)):
        assert FA.cache_key(*args) != k
    assert FA.cache_path("b001", k).name == f"b001_{k[:12]}.mp3"


def test_backoff_schedule_and_concurrency():
    assert [FA.backoff_delay(i, jitter=False) for i in range(5)] == [1.5, 3.0, 6.0, 12.0, 24.0]
    assert 1.5 <= FA.backoff_delay(0) <= 1.5 * 1.25 + 1e-9
    assert FA.concurrency_for("s2.1-pro-free") == 2 and FA.concurrency_for("s2.1-pro") == 4 and FA.MAX_RETRIES == 5


class _Resp:
    def __init__(self, status, content=b"", text=""):
        self.status_code, self.content, self.text = status, content, text


class _Session:
    def __init__(self, seq):
        self.seq, self.calls = list(seq), []

    def post(self, url, json=None, headers=None, timeout=None):
        self.calls.append({"json": json, "headers": headers})
        return self.seq.pop(0)


def _client(seq, model="s2.1-pro-free", monkeypatch=None):
    s = _Session(seq)
    sleeps = []
    c = FA.FishClient(model=model, session=s, sleep=sleeps.append, stats=FA.Stats())
    return c, s, sleeps


def test_retry_on_429_then_success(monkeypatch):
    monkeypatch.setenv("FISH_API_KEY", "k")
    c, s, sleeps = _client([_Resp(429), _Resp(503), _Resp(200, b"audio")])
    assert c.tts_bytes(c.body("hi", "ref", 1.0, 0.7)) == b"audio"
    assert c.stats.retries == 2 and c.stats.n429 == 1 and c.stats.n5xx == 1 and len(sleeps) == 2
    assert 1.5 <= sleeps[0] < 2.0 and 3.0 <= sleeps[1] < 3.8
    assert s.calls[0]["headers"]["model"] == "s2.1-pro-free" and s.calls[0]["json"]["format"] == "mp3"


def test_retries_exhausted(monkeypatch):
    monkeypatch.setenv("FISH_API_KEY", "k")
    c, s, sleeps = _client([_Resp(429)] * 6)
    with pytest.raises(FA.FishError):
        c.tts_bytes(c.body("hi", "ref", 1.0, 0.7))
    assert len(sleeps) == 5


def test_402_on_paid_model_falls_back_to_free(monkeypatch):
    monkeypatch.setenv("FISH_API_KEY", "k")
    c, s, _ = _client([_Resp(402, text="payment required"), _Resp(200, b"ok")], model="s2.1-pro")
    assert c.tts_bytes(c.body("hi", "ref", 1.0, 0.7)) == b"ok"
    assert c.model == FA.FREE_MODEL and s.calls[1]["headers"]["model"] == FA.FREE_MODEL and c.stats.fallbacks


def test_402_on_free_model_raises(monkeypatch):
    monkeypatch.setenv("FISH_API_KEY", "k")
    c, _, _ = _client([_Resp(402, text="no credit")])
    with pytest.raises(FA.FishError) as e:
        c.tts_bytes(c.body("hi", "ref", 1.0, 0.7))
    assert e.value.status == 402


def test_missing_key_dry_run(monkeypatch, capsys, tmp_path):
    monkeypatch.delenv("FISH_API_KEY", raising=False)
    monkeypatch.setattr(FA, "ROOT", tmp_path)          # no .env there
    monkeypatch.setattr(FA, "_notice_done", False)
    assert FA.available() is False
    assert "Add FISH_API_KEY=<your key> to .env to enable Fish Audio" in capsys.readouterr().err
    assert FA.available() is False
    assert capsys.readouterr().err == ""               # the notice is logged once


def test_dotenv_key(monkeypatch, tmp_path):
    monkeypatch.delenv("FISH_API_KEY", raising=False)
    (tmp_path / ".env").write_text("# c\nFISH_API_KEY='abc'\n")
    monkeypatch.setattr(FA, "ROOT", tmp_path)
    assert FA.api_key() == "abc"


def _item(title, tags=("male", "young"), desc="", **kw):
    d = {"_id": "x", "title": title, "tags": list(tags), "description": desc, "state": "trained", "dmca_taken_down": False,
         "licensed": False, "visibility": "public", "languages": ["en"]}
    d.update(kw)
    return d


def test_voice_filter_accepts_generic_archetypes():
    for t in ("Calm Storyteller", "Young boy", "Gruff Older Male", "Sarah", "Anime girl", "Demon"):
        assert CD.is_original_voice(_item(t))[0], t


def test_voice_filter_rejects_real_people_characters_and_brands():
    for t in ("Super Smash Bros. 4/Ultimate Announcer", "Mortal Kombat", "Goku", "Asta", "Donald Trump", "Elon Musk(Noise reduction)",
              "Markiplier.", "Taylor Swift", "Satoru Gojo", "Hatsune Miku", "Rick Sanchez", "mrbeast", "Slax"):
        assert not CD.is_original_voice(_item(t))[0], t
    assert not CD.is_original_voice(_item("Calm Storyteller", desc="An impression of a famous youtuber"))[0]
    assert not CD.is_original_voice(_item("Calm Storyteller", tags=("male", "jujutsu kaisen")))[0]


def test_voice_filter_state_flags():
    assert not CD.is_original_voice(_item("Sarah", state="draft"))[0]
    assert not CD.is_original_voice(_item("Sarah", dmca_taken_down=True))[0]
    assert not CD.is_original_voice(_item("Sarah", licensed=True))[0]
    assert not CD.is_original_voice(_item("Sarah", visibility="private"))[0]
    assert not CD.is_original_voice(_item("Sarah", languages=["zh"]))[0]


def test_distinctness_rule():
    a = {"f0_hz": 100, "centroid_hz": 500}
    assert not CD.differs(a, {"f0_hz": 105, "centroid_hz": 520})
    assert CD.differs(a, {"f0_hz": 120, "centroid_hz": 520})
    assert CD.differs(a, {"f0_hz": 101, "centroid_hz": 600})


def test_cast_child_resolution():
    cast = {"ASTA": {"_id": "a"}, "ASTA_CHILD": {"_id": "c", "chapters": ["cold_open", "ch1", "ch2"]}, "YUNO": {"_id": "y"}, "DEFAULT": {"_id": "d"}}
    assert VC.resolve_role(cast, "ASTA", "ch2") == "ASTA_CHILD"
    assert VC.resolve_role(cast, "ASTA", "ch3") == "ASTA"
    assert VC.resolve_role(cast, "ASTA@cold_open") == "ASTA_CHILD"
    assert VC.resolve_role(cast, "YUNO", "ch1") == "YUNO"       # no YUNO_CHILD in this cast
    assert VC.resolve_role(cast, "NOBODY", "ch1") == "DEFAULT"


def test_pronunciation_map():
    f = PR.apply_anime_pronunciation_map
    assert f("Hage") == "Hah-gay" and f("Liebe, Licita and Yuno") == "Lee-beh, Lee-chee-tah and Yoo-no"
    assert f("Yami Sukehiro spoke. Yami nodded.") == "Yah-mee Soo-keh-hee-roh spoke. Yah-mee nodded."
    assert f("Julius Novachrono") == "Joo-lee-us Noh-vah-kroh-no" and f("Gueldre Poizot") == "Gel-druh Pwah-zoh"
    assert f("Ki") == "Key" and f("Kind and Kicker") == "Kind and Kicker" and f("ki") == "ki"
    assert f("LIEBE") == "LEE-BEH" and f("grimoire") == "grim-wahr" and f("Grimoire") == "Grim-wahr"
    assert f("Asta") == "Asta" and f("Anti-Magic") == "Anti-Magic"
    assert f("Hager") == "Hager" and f("Noelle's") == "No-ell's"


def test_build_spoken_brackets_only():
    assert PR.build_spoken({"text": "Liebe.", "direction": "quiet, intense"}) == "[quiet, intense] Lee-beh."
    assert PR.build_spoken({"text": "Hello."}) == "Hello."
    assert PR.build_spoken({"text": "Hello.", "direction": "(whispers)"}) == "[whispers] Hello."
    assert "(" not in PR.build_spoken({"text": "x", "direction": "(a)"})


def test_pause_class_ranges_deterministic():
    for cls, (lo, hi) in AD.PAUSE_CLASSES.items():
        vals = {AD.pause_for({"id": f"b{i:03d}", "pause_class": cls}) for i in range(200)}
        assert all(lo <= v <= hi for v in vals) and len(vals) > 5
        assert AD.pause_for({"id": "b007", "pause_class": cls}) == AD.pause_for({"id": "b007", "pause_class": cls})
    assert AD.PAUSE_CLASSES == {"banter": (160, 220), "turn": (260, 340), "reveal": (550, 750)}
    assert AD.pause_for({"id": "b1", "pause_after_ms": 400}) == 400
    assert AD.pause_for({"id": "b1", "pause_after_ms": 5000}) == AD.PAUSE_MAX_MS
    assert AD.pause_for({"id": "b1", "pause_class": "bogus", "pause_after_ms": 300}) == 300


def test_emotion_dynamics_bounded():
    assert AD.emotion_dynamics_db({"direction": "shouting, intense"}) == 2.0
    assert AD.emotion_dynamics_db({"emotion": "whisper"}) == -2.0
    assert AD.emotion_dynamics_db({"emotion": "neutral", "text": "Fine."}) == 0.0
    assert abs(AD.emotion_dynamics_db({"direction": "shout whisper"})) <= AD.DYNAMICS_MAX_DB


def test_strip_cues_and_text_rate():
    assert FA.strip_cues("[quiet] Hello   there") == "Hello there"
