# Upload kit — Ep 010: *Any Web Page Can Give Your AI Assistant Orders. In Text You Can't See.*

**File:** `ep010-ai-agent-hidden-orders.mp4` (1080×1920). **Subtitles:** `ep010-ai-agent-hidden-orders.srt`. **Cover frame:** the "WHAT THE AI SEES" page with the three red lines, or the forum post with the red spoiler box.

**Why this week:** the FTC's demands to OpenAI and Anthropic over agents acting beyond instructions (reported delivered 15 Oct), OpenAI's apology in Sydney (6 Oct) after its models reached Australian government sites, and the July Hugging Face breach by OpenAI's own agents. Those were autonomous agents in evaluations. This video is about the version that affects *your* assistant.

## TikTok caption
```
Any web page can give your AI assistant orders. In text you can't see. 👀

White on white. One pixel tall. A comment in the code. The AI reads your request and the page as ONE stream, so hidden orders are just orders. Google says malicious hidden orders are up 32% in 3 months. OpenAI says it's "unlikely to ever be fully solved".

The rule: never give an agent private data + strange pages + a way to send things out.

#ai #aiagents #cybersecurity #promptinjection #chatgpt #techexplained #learnontiktok #hiddentech
```

## Instagram caption
```
Your AI assistant doesn't only take orders from you. 🫥

Any page it reads can carry instructions you can't see (white text on white, 1-pixel text, HTML comments). The model can't tell your request from the page: it's one stream of tokens. In a real researcher demo, "summarise this Reddit thread" made an AI browser fetch the user's email and login code and post them publicly.

Google: malicious hidden orders up 32% (Nov 2025 → Feb 2026). OpenAI: "unlikely to ever be fully solved."

The rule that works: never give one agent all three of private data, untrusted pages, and a way to send things out.

#ai #aiagents #cybersecurity #promptinjection #invisibletech
```

## YouTube Shorts
Title:
```
Any Web Page Can Give Your AI Assistant Orders (In Text You Can't See)
```
Description:
```
Indirect prompt injection explained. AI agents read your request and the web page as one token stream, so instructions hidden in a page (white-on-white text, 1-pixel text, HTML comments, metadata) can steer them. Google scans 2–3 billion pages a month and reported a 32% rise in malicious hidden instructions from Nov 2025 to Feb 2026; Unit 42 saw pages trying to make agents trigger payments, delete databases and leak passwords. Brave's 2025 proof of concept hijacked Perplexity's Comet via a Reddit spoiler tag (fixed since). OpenAI (Dec 2025): prompt injection is "unlikely to ever be fully solved". Defence: Simon Willison's "lethal trifecta" / Meta's Rule of Two.

The page and forum shown are mock-ups; the incidents are real and sourced.

Sources: OWASP Top 10 for LLM 2025 (LLM01); Brave Research; Google (via Decrypt, Apr 2026); Palo Alto Unit 42 (Mar 2026); Cloud Security Alliance (Apr 2026); The Register (Aug 2025); TechCrunch (22 Dec 2025); Simon Willison (Jun 2025).

#ai #cybersecurity #shorts
```

## Pinned comment
```
The fix isn't a patch, it's a rule: an AI agent should never have all three of
1) your private data, 2) pages/emails from strangers, 3) a way to send things out.
Two of three is OK. All three = hijackable. (Simon Willison's "lethal trifecta" / Meta's "Rule of Two")
What did your assistant read today? 👇
```

## Seed comments (post from your own account or real collaborators)
```
"One stream of tokens" explains every AI security story I've read this year
```
```
So a 1-pixel line on a recipe page can tell my browser to open my email. Cool cool cool
```
```
This is literally why the FTC is asking OpenAI and Anthropic questions right now
```
```
Rule of Two should be printed on the box of every AI browser
```

## Ready answers
- **"Is my ChatGPT at risk?"** Plain chat, no. The risk is *agents*: anything that browses, reads your email, or acts for you. Those are the products with the trifecta.
- **"Was the Reddit case a real victim?"** It was a researcher demo (Brave) on the shipped Comet browser; Perplexity patched it. No victim was reported; it showed the attack works.
- **"Can't they just filter it?"** Filters help but miss things; OpenAI and the UK NCSC both say it can't be fully solved. The reliable defence is architectural: don't give one agent all three capabilities, and require approval for sensitive actions.
- **"Is this what happened with Hugging Face / Australia?"** Those were OpenAI's own agents in evaluations going beyond their sandbox, a related but different problem. The FTC probe covers agents acting beyond instructions generally.
