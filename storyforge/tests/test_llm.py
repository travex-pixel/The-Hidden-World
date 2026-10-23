"""API-mode analyst against a fake client: request shape, repair loop, structured-output fallback."""
import copy
import json
import os
from types import SimpleNamespace

import anthropic
try:
    import httpx2 as httpx  # anthropic >= 1.0
except ImportError:  # pragma: no cover
    import httpx
import pytest

from storyforge.analyze.llm import Analyst
from storyforge.schema import Source

EX = os.path.join(os.path.dirname(os.path.dirname(__file__)), "examples", "moon-speech")
GOOD = json.load(open(os.path.join(EX, "spec.json"), encoding="utf-8"))
SRC = Source.load(os.path.join(EX, "source.json"))


def message(text, stop="end_turn"):
    return SimpleNamespace(
        content=[SimpleNamespace(type="thinking", thinking="", signature="sig"), SimpleNamespace(type="text", text=text)],
        stop_reason=stop, stop_details=None, model="claude-opus-5-5",
        usage=SimpleNamespace(input_tokens=1000, output_tokens=500, cache_read_input_tokens=0))


class FakeStream:
    def __init__(self, msg):
        self.msg = msg

    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False

    def get_final_message(self):
        return self.msg


class FakeClient:
    def __init__(self, replies, reject_schema=False):
        self.replies, self.calls, self.reject_schema = list(replies), [], reject_schema
        self.beta = SimpleNamespace(messages=SimpleNamespace(stream=self.stream))

    def stream(self, **kw):
        self.calls.append(copy.deepcopy(kw))
        if self.reject_schema and "format" in kw["output_config"]:
            req = httpx.Request("POST", "https://api.anthropic.com/v1/messages")
            raise anthropic.BadRequestError("schema too complex", response=httpx.Response(400, request=req), body=None)
        return FakeStream(self.replies.pop(0))


def bad_spec():
    s = copy.deepcopy(GOOD)
    s["sections"][4]["blocks"].insert(0, {"type": "quote", "text": "Houston will be the capital of the galaxy.",
                                          "who": "Kennedy", "segment_id": None, "style": "pull"})
    return s


def test_repair_loop_fixes_invented_quote():
    client = FakeClient([message(json.dumps(bad_spec())), message("```json\n" + json.dumps(GOOD) + "\n```")])
    spec, report = Analyst(client=client, log=lambda *a: None).run(SRC, lens="history")
    assert report.ok
    assert len(client.calls) == 2
    first, repair = client.calls
    # request shape: current model, adaptive thinking, effort, schema, server-side fallbacks, cached prefix
    assert first["model"] == "claude-opus-5-5" and first["thinking"] == {"type": "adaptive"}
    assert first["output_config"]["effort"] == "high" and first["output_config"]["format"]["type"] == "json_schema"
    assert first["fallbacks"] == "default" and "server-side-fallback-2026-07-01" in first["betas"]
    assert first["cache_control"] == {"type": "ephemeral"}
    # the repair turn replays the assistant content (thinking blocks included) and lists the problem
    assert repair["messages"][1]["role"] == "assistant" and repair["messages"][1]["content"][0].type == "thinking"
    assert "capital of the galaxy" in repair["messages"][2]["content"][0]["text"]


def test_falls_back_when_structured_output_is_rejected():
    client = FakeClient([message(json.dumps(GOOD))], reject_schema=True)
    spec, report = Analyst(client=client, log=lambda *a: None).run(SRC, lens="history")
    assert report.ok
    assert "format" not in client.calls[-1]["output_config"]
    assert "matching this schema" in client.calls[-1]["messages"][0]["content"][-1]["text"]


def test_refusal_and_truncation_are_explicit():
    for stop, needle in (("refusal", "declined"), ("max_tokens", "cut off")):
        client = FakeClient([message("{}", stop=stop)])
        with pytest.raises(RuntimeError, match=needle):
            Analyst(client=client, log=lambda *a: None, structured="on").run(SRC)
