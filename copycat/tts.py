"""Narration provider for COPYCAT: Kokoro-82M (Apache-2.0, local ONNX) with a pronunciation lexicon,
content-hash cache and word-level timing. Falls back to the repo's existing Piper narrator when the
Kokoro model files are absent (provider chain: kokoro -> piper), and says so in the log.

Markup understood in a beat's `say` text:
  {cue}     marks the start time of the NEXT word as a named cue for the renderer / sfx
  *word(s)* emphasis (captions colour these)
"""
from __future__ import annotations
import hashlib, json, re, sys
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
KOKORO_DIR = ROOT / ".cache" / "kokoro"
KOKORO_URLS = {"kokoro-v1.0.onnx": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx",
               "voices-v1.0.bin": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin"}
CACHE = ROOT / ".cache" / "copycat" / "tts"
SR = 24000

# IPA overrides for names the grapheme-to-phoneme model gets wrong (checked against espeak output).
LEXICON = {
    "asta": "ˈæstə", "liebe": "lˈiːbeɪ", "licita": "lɪtʃˈiːɾə", "hage": "hˈɑːɡeɪ", "revchi": "ɹˈɛvtʃi", "ki": "kˈiː",
    "zetten": "zˈɛtɛn", "patolli": "pətˈoʊli", "vangeance": "vˈændʒəns", "noelle": "noʊˈɛl", "nacht": "nˈɑːkt",
    "secre": "sˈɛkɹeɪ", "gueldre": "ɡˈɛldɹə", "sukehiro": "sˌuːkɛhˈiəɹoʊ", "finral": "fˈɪnɹɑːl", "lucifero": "lˌuːsɪfˈɛɹoʊ",
    "zagred": "zˈæɡɹɛd", "novachrono": "nˌoʊvəkɹˈoʊnoʊ", "zogratis": "zoʊɡɹˈɑːtɪs", "yami": "jˈɑːmi", "yuno": "jˈuːnoʊ",
    "grimoire": "ɡɹɪmwˈɑːɹ", "anti-magic": "ˈæntimˈædʒɪk", "shonen": "ʃˈoʊnɛn",
}
_LEX_RE = re.compile(r"(?<![\w])(" + "|".join(sorted(map(re.escape, LEXICON), key=len, reverse=True)) + r")(['’]s)?(?![\w])", re.I)
_kokoro = None


def log(m): print(f"[tts] {m}", flush=True)


def kokoro_available() -> bool:
    return all((KOKORO_DIR / f).exists() for f in KOKORO_URLS)


def _engine():
    global _kokoro
    if _kokoro is None:
        from kokoro_onnx import Kokoro
        _kokoro = Kokoro(str(KOKORO_DIR / "kokoro-v1.0.onnx"), str(KOKORO_DIR / "voices-v1.0.bin"))
    return _kokoro


def _ph(chunk: str) -> str:
    m = re.match(r"^([\s,.;:!?—–…\-]*)(.*)$", chunk, re.S)
    lead, core = m.group(1).strip(), m.group(2).strip()
    if not re.search(r"\w", core):
        return (lead + " " + core).strip()
    return ((lead + " ") if lead else "") + _engine().tokenizer.phonemize(core, "en-us")


def phonemize(text: str) -> str:
    """Sentence -> phoneme string, with lexicon words swapped for their IPA."""
    text = text.replace("–", "-").replace("’", "'")
    out, pos = [], 0
    for m in _LEX_RE.finditer(text):
        if m.start() > pos:
            out.append(_ph(text[pos:m.start()]))
        ipa = LEXICON[m.group(1).lower()]
        if m.group(2):
            ipa += "s" if ipa[-1] in "ptkfθ" else "z"
        out.append(ipa); pos = m.end()
    if pos < len(text):
        out.append(_ph(text[pos:]))
    s = re.sub(r"\s+", " ", " ".join(p for p in out if p)).strip()
    return re.sub(r"\s+([,.;:!?…])", r"\1", s)


_wcache: dict[str, int] = {}


def _weight(word: str) -> int:
    w = re.sub(r"[^\w'\-]", "", word.lower())
    if not w:
        return 1
    if w not in _wcache:
        base = re.sub(r"['’]s$", "", w)
        ipa = LEXICON.get(base) or _engine().tokenizer.phonemize(w, "en-us")
        _wcache[w] = max(1, len(re.sub(r"[ˈˌː\s.,]", "", ipa)))
    return _wcache[w]


def parse_say(say: str) -> list[dict]:
    """Tokenise marked-up narration into [{text, word(bool), cues[], em(bool)}]."""
    toks, em = [], False
    for raw in say.split():
        cues = re.findall(r"\{(\w+)\}", raw); raw = re.sub(r"\{\w+\}", "", raw)
        if not raw:
            if toks is not None and cues: toks.append({"text": "", "word": False, "cues": cues, "em": False})
            continue
        stars = raw.count("*"); starts_em = raw.startswith("*") or (em and stars == 0) or (em and not raw.startswith("*"))
        this_em = em or raw.startswith("*")
        if stars % 2 == 1:
            em = not em
        text = raw.replace("*", "")
        toks.append({"text": text, "word": bool(re.search(r"\w", text)), "cues": cues, "em": bool(this_em)})
    # dangling cue-only tokens attach to the next word
    out, pending = [], []
    for t in toks:
        if not t["text"]:
            pending += t["cues"]; continue
        t["cues"] = pending + t["cues"]; pending = []; out.append(t)
    return out


def _sentences(toks: list[dict]) -> list[list[int]]:
    sents, cur = [], []
    for i, t in enumerate(toks):
        cur.append(i)
        if re.search(r"(?<!\.\.)[.!?]['\"”]?$", t["text"]) and not t["text"].endswith("..."):
            sents.append(cur); cur = []
    if cur: sents.append(cur)
    return sents


def _voice_style(spec: dict):
    k = _engine(); style = None
    for name, w in spec["blend"].items():
        v = k.get_voice_style(name) * float(w); style = v if style is None else style + v
    return style


def _trim(x: np.ndarray, thr=0.012, keep=0.03) -> np.ndarray:
    env = np.abs(x); idx = np.nonzero(env > thr * max(1e-6, env.max()) * 4)[0]
    if len(idx) == 0: return x
    a, b = max(0, idx[0] - int(keep * SR)), min(len(x), idx[-1] + int((keep + 0.05) * SR))
    return x[a:b]


def _pauses(x: np.ndarray, min_len=0.085) -> list[tuple[float, float]]:
    """Internal low-energy gaps (start, end) in seconds."""
    hop = int(0.005 * SR); n = len(x) // hop
    if n < 10: return []
    rms = np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)
    quiet = rms < max(0.02 * np.percentile(rms, 95), 1e-4) * 2.2
    gaps, i = [], 0
    while i < n:
        if quiet[i]:
            j = i
            while j < n and quiet[j]: j += 1
            if i > 4 and j < n - 4 and (j - i) * hop / SR >= min_len: gaps.append((i * hop / SR, j * hop / SR))
            i = j
        else: i += 1
    return gaps


def synth_sentence(text: str, voice: dict) -> np.ndarray:
    ph = phonemize(text)
    key = hashlib.sha1(json.dumps([ph, voice, "kokoro-v1.0", 3], sort_keys=True).encode()).hexdigest()[:20]
    f = CACHE / f"{key}.npy"
    if f.exists():
        return np.load(f)
    CACHE.mkdir(parents=True, exist_ok=True)
    x, sr = _engine().create(ph, voice=_voice_style(voice), speed=float(voice.get("speed", 1.0)), lang="en-us", is_phonemes=True, trim=True)
    assert sr == SR
    x = _trim(np.asarray(x, np.float32))
    act = x[np.abs(x) > 0.02]; rms = float(np.sqrt(np.mean(act ** 2))) if len(act) else 0.05
    x = (x * (0.11 / max(rms, 1e-4))).astype(np.float32)          # consistent speech level across voices
    x = np.tanh(x * 1.0).astype(np.float32) if np.abs(x).max() > 0.98 else x
    np.save(f, x); (CACHE / f"{key}.txt").write_text(text + "\n" + ph + "\n")
    return x


def _time_words(x: np.ndarray, toks: list[dict]) -> list[tuple[float, float]]:
    """Start/end per token (seconds, relative to clip). Pauses detected in the audio anchor punctuation breaks."""
    dur = len(x) / SR
    widx = [i for i, t in enumerate(toks) if t["word"]]
    if not widx: return [(0.0, dur)] * len(toks)
    # split word list into phrases at punctuation that normally produces an audible pause
    phrases, cur = [], []
    for i in widx:
        cur.append(i)
        nxt_dash = i + 1 < len(toks) and not toks[i + 1]["word"]
        if re.search(r"[,;:—…]$|\.\.\.$", toks[i]["text"]) or nxt_dash:
            phrases.append(cur); cur = []
    if cur: phrases.append(cur)
    gaps = _pauses(x)
    need = len(phrases) - 1
    if need > 0 and len(gaps) >= need:
        gaps = sorted(sorted(gaps, key=lambda g: g[1] - g[0], reverse=True)[:need])
        bounds = [0.0] + [v for g in gaps for v in g] + [dur]
        spans = [(bounds[2 * k], bounds[2 * k + 1]) for k in range(len(phrases))]
    else:  # proportional fallback over the whole clip
        tot = sum(_weight(toks[i]["text"]) for i in widx) + 2 * need; spans, acc = [], 0.0
        for k, p in enumerate(phrases):
            w = sum(_weight(toks[i]["text"]) for i in p); spans.append((acc / tot * dur, (acc + w) / tot * dur)); acc += w + 2
    times = [None] * len(toks)
    for p, (a, b) in zip(phrases, spans):
        ws = [_weight(toks[i]["text"]) for i in p]; tot = float(sum(ws)); acc = 0.0
        for i, w in zip(p, ws):
            times[i] = (a + acc / tot * (b - a), a + (acc + w) / tot * (b - a)); acc += w
    last = (0.0, 0.0)
    for i in range(len(toks)):
        if times[i] is None: times[i] = (last[1], last[1])
        last = times[i]
    return times


def narrate_beat(say: str, voice: dict, cast: dict | None = None, sentence_gap=0.17) -> dict:
    """-> {audio (float32 mono @24k), duration, words:[{w,s,e,em,sp}], cues:{name:sec}}

    Speaker markup: a token `@name:` switches the voice to cast[name] for the rest of the beat (or until the next
    marker); `@n:` returns to the narrator. Words spoken by a cast member carry `sp` so captions can colour them."""
    toks = parse_say(say)
    if not toks: return {"audio": np.zeros(0, np.float32), "duration": 0.0, "words": [], "cues": {}}
    # resolve speaker markers into a per-token speaker, then drop the marker tokens (their cues move to the next word)
    cur, pend, keep = None, [], []
    for tk in toks:
        m = re.match(r"^@(\w+):$", tk["text"])
        if m:
            cur = None if m.group(1) in ("n", "narrator") else m.group(1); pend += tk["cues"]; continue
        if cast is not None and cur and cur not in cast: raise SystemExit(f"[tts] unknown speaker @{cur}: in {say!r}")
        tk["cues"] = pend + tk["cues"]; pend = []; tk["sp"] = cur; keep.append(tk)
    toks = keep
    parts, words, cues, t = [], [], {}, 0.0
    sents = []
    for sent in _sentences(toks):  # split further wherever the speaker changes mid-sentence
        run = [sent[0]]
        for i in sent[1:]:
            if toks[i]["sp"] != toks[run[-1]]["sp"]: sents.append(run); run = []
            run.append(i)
        sents.append(run)
    prev_sp = "__start__"
    for sent in sents:
        st = [toks[i] for i in sent]; text = " ".join(x["text"] for x in st); sp = st[0]["sp"]
        if not re.search(r"\w", text): continue
        if prev_sp != "__start__" and sp != prev_sp:  # breath between speakers
            parts.append(np.zeros(int(0.12 * SR), np.float32)); t += 0.12
        prev_sp = sp
        x = synth_sentence(text, cast[sp] if sp else voice); tm = _time_words(x, st)
        for tk, (a, b) in zip(st, tm):
            for cname in tk["cues"]: cues[cname] = round(t + a, 3)
            if tk["word"]:
                disp = re.sub(r"[,.;:]+$", "", tk["text"]).strip("\"“”")
                disp = re.sub(r"^[—–\-]+|[—–]+$", "", disp)
                if disp: words.append({"w": disp, "s": round(t + a, 3), "e": round(t + b, 3), **({"em": 1} if tk["em"] else {}), **({"sp": sp} if sp else {})})
        gap = 0.3 if text.rstrip().endswith("...") else sentence_gap
        parts += [x, np.zeros(int(gap * SR), np.float32)]; t += len(x) / SR + gap
    if not parts: return {"audio": np.zeros(0, np.float32), "duration": 0.0, "words": [], "cues": cues}
    audio = np.concatenate(parts[:-1]); return {"audio": audio, "duration": len(audio) / SR, "words": words, "cues": cues}


def caption_chunks(words: list[dict], max_words=4, max_chars=22) -> list[dict]:
    """Group absolute-timed words into short on-screen phrases, breaking at pauses."""
    chunks, cur = [], []
    def flush():
        nonlocal cur
        if cur: chunks.append(cur); cur = []
    for i, w in enumerate(words):
        if cur and (w.get("sp") != cur[-1].get("sp") or len(cur) >= max_words or sum(len(x["w"]) + 1 for x in cur) + len(w["w"]) > max_chars or w["s"] - cur[-1]["e"] > 0.28 or w.get("brk")):
            flush()
        cur.append(w)
        if re.search(r"[!?…]$|\.\.\.$", w["w"]): flush()
    flush()
    out = []
    for k, ch in enumerate(chunks):
        nxt = chunks[k + 1][0]["s"] if k + 1 < len(chunks) else None
        end = ch[-1]["e"] + 0.22
        if nxt is not None: end = min(end, nxt) if nxt - ch[-1]["e"] > 0.3 else nxt
        out.append({"start": round(ch[0]["s"], 3), "end": round(end, 3), "words": [{k2: v for k2, v in w.items() if k2 not in ("brk", "sp")} for w in ch], **({"sp": ch[0]["sp"]} if ch[0].get("sp") else {})})
    return out


if __name__ == "__main__":
    r = narrate_beat(" ".join(sys.argv[1:]) or "And one boy gets {none}*nothing*.", {"blend": {"am_michael": 0.62, "am_fenrir": 0.38}, "speed": 1.03})
    print(round(r["duration"], 2), r["cues"], [(w["w"], w["s"], w["e"]) for w in r["words"]])
