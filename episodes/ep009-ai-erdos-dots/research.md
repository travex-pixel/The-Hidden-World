# Research record — Episode 009

**Episode:** ep009-ai-erdos-dots — *AI Just Beat an 80-Year-Old Maths Problem. It's About Dots.*
**Central question:** What did an AI actually solve when it disproved Erdős's unit distance conjecture, and why does it matter outside maths?

## The result, plainly
Erdős (1946) asked: among n points in the plane, how many pairs can be at distance exactly 1? A square grid, scaled so a popular distance becomes 1, gives about n^(1+c/log log n) pairs, and Erdős conjectured that nothing grows faster (n^(1+o(1))). On 20 May 2026 OpenAI announced that an internal, general-purpose reasoning model had built point sets with at least n^(1+ε) unit distances for a fixed ε>0, so the conjecture is false. Nine mathematicians (Alon, Bloom, Gowers, Litt, Sawin, Shankar, Tsimerman, Wang, Wood) published a short human-verified version the same day; Sawin later made the exponent explicit at about 1.014. Lean 4 formalisations followed. The best upper bound, O(n^(4/3)) from 1984, still stands.

## Why the hook is about October 2025
In October 2025 OpenAI staff posted that GPT-5 had "solved" 10 open Erdős problems. Thomas Bloom called it "a dramatic misrepresentation": the model had found existing papers he was unaware of. The posts were deleted. That is the viewer's false belief ("AI just looks maths up"), and it is also what makes the May 2026 result different in kind: the construction was new and was checked by humans and by Lean.

## Real-world implications (what the sources support)
- None of the sources claim a practical use for the unit-distance count itself. The script says so out loud ("Nobody is building anything with this").
- The implications the reviewers stress are methodological: a general model, not a maths-specific one, with no step-by-step guidance, produced new mathematics that experts had missed for 80 years (Litt: the first autonomously produced result he finds "interesting in itself"; Alon: it is "changing dramatically the way mathematical research is being done"; Gowers: he would have recommended acceptance had a human submitted it to the Annals).
- Trust: Lean checks each step with a small kernel, so a verified proof does not rest on trusting the AI. That is the mechanism the episode lands on.
- Scale: erdosproblems.com lists 1,217 problems, 652 open; several fell to AI during 2026 (#728, #397, #124).

## Access note
Direct fetches of TechCrunch, Quanta, The Conversation and arXiv were blocked here; research used the web-search tool's indexed excerpts. Grid counts (20×20 grid, squared distance 65, 1,744 pairs) were computed locally and are checked in tests. Before publishing, open S1, S2 and S7.

## Sources
| ID | Source | Supports |
|----|--------|----------|
| S1 | [TechCrunch, 20 May 2026](https://techcrunch.com/2026/05/20/openai-claims-it-solved-an-80-year-old-math-problem-for-real-this-time/) | Announcement; "for real this time" framing after October 2025. |
| S2 | [Alon et al., Remarks on the disproof of the unit distance conjecture](https://arxiv.org/abs/2605.20695) | Human-verified version; nine authors; ε>0; ideas from algebraic number theory. |
| S3 | [Scientific American](https://www.scientificamerican.com/article/ai-just-solved-an-80-year-old-erdos-problem-and-mathematicians-are-amazed/) | Reactions: Litt, Alon, Gowers; general-purpose model; Sawin's 1.014. |
| S4 | [Pach, Raz, Solymosi 2025](https://arxiv.org/abs/2507.15679) | Problem statement, grid lower bound, 4/3 upper bound, conjecture as open before 2026. |
| S5 | [erdosproblems.com #90](https://www.erdosproblems.com/90) | Problem page; status. |
| S6 | [The Decoder, Oct 2025](https://the-decoder.com/leading-openai-researcher-announced-a-gpt-5-math-breakthrough-that-never-happened/) | The retracted claims; Bloom's and Bubeck's quotes. |
| S7 | [Quanta, 3 Aug 2026](https://www.quantamagazine.org/why-the-legendary-erdos-problems-are-falling-to-ai-20260803/) | Wider picture: Erdős problems falling to AI; novelty checks. |
| S8 | [Digg: Lean 4 verification open-sourced](https://digg.com/tech/9ud8f3ro) | Aleph Prover formalisation (~33,000 lines reported). |
| S9 | [Lean system description](https://lean-lang.org/papers/system.pdf) | Small trusted kernel checks proof terms. |
| S10 | [Epoch AI: FrontierMath Erdős](https://epoch.ai/latest/announcing-frontiermath-erdos) | 1,217 problems, 652 unsolved. |
| S11 | [Erdős #728 writeup](https://arxiv.org/abs/2601.07421) | Autonomous AI resolution, Lean proof, Tao vouched. |
| S12 | [Wikipedia list of Erdős conjectures](https://en.wikipedia.org/wiki/List_of_conjectures_by_Paul_Erd%C5%91s) | 2026 AI-assisted solutions. |

## Claim check
| Claim | Wording | Status |
|-------|---------|--------|
| C1 | "Last October, that's all it did, and OpenAI got laughed at." | Established (S6, S7). "Laughed at": Hassabis called it "so embarrassing"; posts deleted. |
| C2 | "In May, it found something nobody had seen in eighty years." | Established (S1–S3). 1946→2026. |
| C3 | "Three dots: three pairs. Four dots: five." / "Four hundred dots… one thousand seven hundred pairs" | Exact: u(3)=3, u(4)=5; 20×20 grid at squared distance 65 gives 1,744 (computed, tested). |
| C4 | "He said nothing beats the grid's pace. For eighty years, nothing did." | Established (S2, S4), simplified from n^(1+o(1)). |
| C5 | "They climb faster than any grid." / "Nine top mathematicians checked it." | Established (S2, S3). Growth rate n^(1+ε) eventually exceeds n^(1+c/log log n); no claim about specific small n. |
| C6 | On-screen pattern | Labelled "Illustration. Not the real construction." |
| C7 | "Nobody is building anything with this." | Fair reading of S2, S3: no application claimed. |
| C8 | "A computer checked every line… Tens of thousands of lines. It cannot be bluffed." | Lean kernel (S9); line counts from S8 (secondary; the two formalisations differ, so narration says "tens of thousands"). "Cannot be bluffed" = the kernel accepts only well-typed proof terms; kernel bugs remain theoretically possible. |
| C9 | "Over twelve hundred problems. About six hundred and fifty are still open." | S10: 1,217 / 652. |
| C10 | "This year, AI started crossing them off." | S11, S12. |
