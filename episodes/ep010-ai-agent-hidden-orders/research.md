# Research record — Episode 010

**Episode:** ep010-ai-agent-hidden-orders — *Any Web Page Can Give Your AI Assistant Orders. In Text You Can't See.*
**Why now (19 October 2026):** the FTC's probe into OpenAI and Anthropic over agents acting beyond instructions (confirmed 1 October; civil investigative demands reported delivered 15 October), OpenAI's apology to Australia's parliamentary AI committee in Sydney (6 October) after its models reached government sites, and the July Hugging Face breach by OpenAI's own agents. Those three are about autonomous agents in evaluations. The video explains the mechanism that affects *the viewer's own* assistant: indirect prompt injection. The news is context in the captions, not a claim in the script.

**Central question:** Why can a web page hijack an AI agent, and why do OpenAI and Google say it may never be fully fixed?
**Answer:** The model reads the user's request and the fetched page as one token stream and cannot reliably tell instructions from data (the same token mechanism as Episode 006). Attackers hide instructions in text people can't see. Real pages have tried to make agents pay, delete databases and leak passwords. Defence is architectural (Willison's lethal trifecta / Meta's Rule of Two), not a patch.

## Access note
Direct fetches (arXiv, TechCrunch, Google's blog) were blocked; research used the web-search tool's indexed excerpts, cross-checked across outlets (The Register, Decrypt, CyberScoop, TechCrunch, Fortune, Al Jazeera, Bloomberg, CSA). Before publishing, open S3/S4 (Google and Unit 42 originals) to confirm the 32% and the "pay / delete databases" examples.

## Sources
| ID | Source | Supports |
|----|--------|----------|
| S1 | OWASP Top 10 for LLM 2025 (HackerOne summary) | Prompt injection retained at #1. |
| S2 | Brave: indirect prompt injection is a fundamental challenge | Agentic browsers must separate page content from user intent; the Comet and Opera Neon findings. |
| S3 | Google analysis via Decrypt (April 2026) | 2–3 billion pages a month scanned; +32% malicious IPI cases Nov 2025→Feb 2026; hiding methods (1-pixel text, near-transparent text, HTML comments, metadata); some tried to get IP + passwords; most low-grade. |
| S4 | Unit 42 (3 March 2026) | 22 techniques; in-the-wild attempts: Stripe/PayPal payments, deleting databases, leaking system prompts, approving scam ads. Attempts, not confirmed compromises. |
| S5 | Willison's lethal trifecta (June 2025) | Private data + untrusted content + external communication. |
| S6 | The Register (20 Aug 2025) | Comet PoC mechanics; Brave's view that content and intent must be separated. |
| S7 | Decrypt (Aug 2025) | Disclosure timeline; Perplexity's response. |
| S8 | CSA research note (26 April 2026) | IPI has moved from proof-of-concept to live exploitation; cites Google, Forcepoint and Unit 42 telemetry. |
| S9 | TechCrunch (22 Dec 2025) | OpenAI: prompt injection "unlikely to ever be fully 'solved'"; agent mode "expands the security threat surface". |
| S10 | CyberScoop | NCSC: may never be fully mitigated. |
| S11 | Computerwoche | Meta's Rule of Two; Willison's endorsement. |
| S12–S14 | Al Jazeera, Bloomberg | The October 2026 news context. |

## Claim check
| Claim | Wording | Status |
|-------|---------|--------|
| C1 | "Any web page it reads can give it orders." | Established (S1, S2). "Any" is the capability, not a claim that every page does. |
| C2 | "White text on white. One pixel tall. A comment in the code." | Established (S3, S4). The page shown is a mock-up, labelled. |
| C3 | "Your request and the page arrive as one stream of tokens. To the model, orders are orders." | Established, simplified (S2, S5). Modern systems add defences (adversarial training, approvals); the root cause remains. |
| C4 | The Reddit/Comet case | Established (S6, S7). It was a researcher proof of concept, not a reported victim; the script says "This was real" meaning the exploit worked on the shipped product, and the caption says "Real case"; the upload kit says "researcher demo". Fixed since. |
| C5 | "Google scans billions of pages a month. Hidden orders are up a third since last year." | Established (S3, S8): 2–3 billion a month; +32% relative, Nov 2025→Feb 2026. |
| C6 | "Pages told agents to pay, delete databases, leak passwords." | Established as *attempts* (S4: payments, database deletion; S3: passwords). On screen: "attempts seen in the wild". |
| C7 | "OpenAI says this is unlikely to ever be fully solved." | Verbatim-adjacent to S9. |
| C8 | "Private data, strange web pages, and a way to send things out. Never give an agent all three." | Willison (S5); Meta's Rule of Two (S11) says at most two without human approval. |
| — | "So what did your assistant read today?" | Threshold. |

## Deliberately left out
Vendor names in the narration except OpenAI's quote and Reddit (needed for the case); EchoLeak (a second case); the Hugging Face and Australia incidents (different mechanism).
