"""API mode: Claude writes the Spec, the verifier checks it, Claude repairs what failed.

One streaming request with adaptive thinking and the Spec schema as structured output,
then up to N repair turns that append the verifier's findings to the same conversation
(the source stays in a cached prefix, so repairs are cheap).
"""
from __future__ import annotations

import copy
import json
import re
import sys

import anthropic

from ..schema import SPEC_SCHEMA, Source
from .prompt import system_prompt, user_message
from .verify import Report, verify

MODEL = "claude-opus-5-5"
BETAS = ["server-side-fallback-2026-07-01"]


def _text(message) -> str:
    return "".join(b.text for b in message.content if b.type == "text")


def _parse(text: str) -> dict:
    t = text.strip()
    m = re.search(r"```(?:json)?\s*(\{.*\})\s*```", t, re.S)
    if m:
        t = m.group(1)
    start, end = t.find("{"), t.rfind("}")
    return json.loads(t[start:end + 1])


class Analyst:
    def __init__(self, *, model: str = MODEL, effort: str = "high", structured: str = "auto",
                 client: anthropic.Anthropic | None = None, log=lambda *a: print(*a, file=sys.stderr)):
        self.client = client or anthropic.Anthropic()
        self.model, self.effort, self.structured, self.log = model, effort, structured, log
        self.usage: list[dict] = []

    def _call(self, system: str, messages: list, use_schema: bool):
        kwargs = dict(
            model=self.model, max_tokens=128000, system=system, messages=messages,
            thinking={"type": "adaptive"}, cache_control={"type": "ephemeral"},
            output_config={"effort": self.effort, **({"format": {"type": "json_schema", "schema": SPEC_SCHEMA}} if use_schema else {})},
            betas=BETAS, fallbacks="default",
        )
        with self.client.beta.messages.stream(**kwargs) as stream:
            msg = stream.get_final_message()
        u = msg.usage
        self.usage.append({"input": u.input_tokens, "output": u.output_tokens,
                           "cache_read": getattr(u, "cache_read_input_tokens", 0) or 0, "model": msg.model})
        if msg.stop_reason == "refusal":
            raise RuntimeError(f"the model declined this source ({getattr(msg.stop_details, 'category', None)})")
        if msg.stop_reason == "max_tokens":
            raise RuntimeError("the spec was cut off at max_tokens; try a shorter source or fewer sections")
        return msg

    def first_draft(self, system: str, messages: list):
        modes = {"on": [True], "off": [False], "auto": [True, False]}[self.structured]
        last = None
        for use_schema in modes:
            try:
                msg = self._call(system, messages, use_schema)
                return msg, _parse(_text(msg))
            except anthropic.BadRequestError as e:
                # very large schemas can exceed structured-output limits; retry with schema-in-prompt
                last = e
                if not use_schema:
                    raise
                self.log(f"structured output rejected ({e.message[:120]}); retrying with the schema in the prompt")
                messages = copy.deepcopy(messages)
                messages[0]["content"][-1]["text"] += "\n\nReturn the Spec as a single JSON object matching this schema:\n" + \
                    json.dumps(SPEC_SCHEMA, separators=(",", ":"))
                self.structured = "off"
        raise last  # pragma: no cover

    def run(self, source: Source, *, lens: str = "business", brief: str | None = None, max_repairs: int = 2) -> tuple[dict, Report]:
        system = system_prompt(source, lens)
        messages = [{"role": "user", "content": [{"type": "text", "text": user_message(source, brief)}]}]
        self.log(f"analysing {len(source.segments)} segments with {self.model} (effort {self.effort})")
        msg, spec = self.first_draft(system, messages)
        report = verify(spec, source)
        for attempt in range(max_repairs):
            if report.ok:
                break
            self.log(f"repair {attempt + 1}: {len(report.errors)} blocking problems")
            messages.append({"role": "assistant", "content": msg.content})
            messages.append({"role": "user", "content": [{"type": "text", "text": repair_request(report)}]})
            msg = self._call(system, messages, self.structured != "off")
            spec = _parse(_text(msg))
            report = verify(spec, source)
        return spec, report


def repair_request(report: Report) -> str:
    items = "\n".join(f"- {e}" for e in report.errors[:60])
    return ("The verifier checked your Spec against the source and found these blocking problems:\n"
            f"{items}\n\n"
            "Fix every one. For a quote that is not in the source, either copy the exact words from the transcript "
            "(with its segment_id) or remove the quote. For a number the source does not state, use the source's figure "
            "or remove it. Keep everything else unchanged. Return the complete corrected Spec JSON.")
