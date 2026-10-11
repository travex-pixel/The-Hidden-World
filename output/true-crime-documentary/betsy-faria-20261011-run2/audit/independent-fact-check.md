# Independent adversarial fact-check (Stage C)

**Reviewer.** A separate review agent working in its own context, with no part in writing the film. Its brief was to find errors, not to approve. It read the claim ledger, bibliography, legal-status registry, script, transcript and packaging, and re-checked claims with its own web searches.

**Limitation (shared with the whole review).** No page could be opened in this environment; WebFetch and curl were blocked by the network policy. Every check rests on search-result excerpts. A separate model was not available, so independence comes from a separate context and an adversarial brief, not from a different model.

All 24 findings are recorded with claim and line IDs in `documentary/films/betsy-faria/evidence/review-findings.json` (stage C).

## Findings and how each was handled

| ID | Sev | Issue (short) | Adjudication | State |
|---|---|---|---|---|
| FC-01 | CRITICAL | The Shorts plan's suggested title "Why the first jury never heard about Pam Hupp" is false: she testified at that trial. Short 02 also gives no legal status. | **Agreed.** Title corrected in `shorts-cutdowns.md`. The Short 02 video stays blocked under LR-09. | Doc part resolved; video open |
| FC-02 | HIGH | Opening line asserts the murder ("for murdering his wife"). | Agreed; risk on C01 raised to HIGH. Fix needs a new voice line. | Open (re-render) |
| FC-03 | HIGH | Cold-open juxtaposition, plus the L07 question presupposing she should have been charged. | Agreed. A gate rule (G8b) now detects such questions automatically, and flags L07. | Open (re-render) |
| FC-04 | HIGH | "Hupp insisted on giving her the ride" is contradicted by a contemporaneous text ("she offered and I accepted"). | **Agreed.** C19 is now DISPUTED / HIGH. Recommend cutting L13. | Open (re-render) |
| FC-05 | HIGH | Prosecution theories presented without the retrial rebuttal; private witnesses accused. | Agreed; C32 raised to HIGH. | Open (re-render) |
| FC-06 | HIGH | Neumann segment implies involvement; ME qualifier omitted. | Agreed (same as LR-04). | Open (re-render) |
| FC-07 | HIGH | Test & Compare plan pairs an accusatory thumbnail with a title. | Agreed. Thumbnail B and alt titles 3 and 5 withdrawn in `title-options.md`. | Resolved (text) |
| FC-08 | MED | The 7:04 p.m. line hints at a dispute without stating it. | Agreed. | Open (re-render) |
| FC-09 | MED | L25→L26 implies the jury never heard about the beneficiary change; sources conflict. | Agreed; the conflict is recorded on C14 and C34. | Open (re-render) |
| FC-10 | MED | Passive voice hides that Betsy made the change. | Agreed. | Open (re-render) |
| FC-11 | MED | Serial-number detail unverified ("a bill" vs "bills"). | Agreed; C43 stays REQUIRES REVIEW and the contradiction is recorded. | Open (re-render) |
| FC-12 | MED | Askey denial lacks context (dismissal; reportedly immunity). | Agreed (same as LR-06); new source added. | Open (re-render) |
| FC-13 | MED | DNA wording and its on-screen credit. | Agreed (same as LR-07). | Open (re-render) |
| FC-14 | MED | Status out of date: the September 2026 motion in limine is not mentioned. | **Agreed. The ledger had it backwards.** The C13 note is corrected; new claim C61; the description now mentions the pending motion. | Description fixed; film open |
| FC-15 | MED | Short 03 has no outcome. | Agreed. | Open (Shorts re-cut) |
| FC-16 | MED | title-options rationale ("right man or woman"). | Agreed; rationale removed. Title still flagged under LR-01. | Resolved (text) |
| FC-17 | LOW | Pinned comment states a guess about the jury as fact. | Agreed; reworded. | Resolved (text) |
| FC-18 | MED | End card promises "sources for every claim" in the description; it was incomplete. | Agreed. The description now lists all 49 cited sources, and gate rule G15 enforces this from now on. | Resolved (text) |
| FC-19 | LOW | "Had reported… days earlier" compresses the timing. | Agreed. | Open (re-render) |
| FC-20 | LOW | On-screen "verdict was upheld" when jury vs judge is unconfirmed. | Agreed. | Open (re-render) |
| FC-21 | LOW | Settlement was with the investigators; some reports say $2.05M. | Agreed; recorded on C51. | Open (re-render) |
| FC-22 | LOW | Alford plea also covered ACA; self-defense claim omitted. | Agreed (optional addition). | Open |
| FC-23 | LOW | Merkel's response missing. | Agreed. | Open |
| FC-24 | LOW | "Nearly ten years" is 9 y 6.5 m; "Terminal cancer" rests on Wikipedia only. | Partly. "Nearly ten" is defensible rounding but imprecise; "terminal" needs a better source. | Open |

## Where the reviewer disagreed with the ledger

| Reviewer said | Decision |
|---|---|
| C01 should be HIGH risk | **Adopted.** |
| C19 should be DISPUTED / HIGH | **Adopted.** |
| C32 should be HIGH risk | **Adopted.** |
| C35 is a single origin (NRE and Oxygen both relay the Post-Dispatch) | **Adopted.** The gate now treats it as REQUIRES REVIEW. |
| C20 rests on thin sourcing | Adopted. It stays blocked as high risk until a primary source is read. |
| Any narrated REQUIRES REVIEW claim should block publication | **Partly adopted.** High- and medium-risk claims block (HIGH). Low-risk biographical details are now visible MEDIUM findings and sit on the human-verification list, rather than being hard blocks. |
| C13 "superseded" note had the dates backwards | **Adopted and corrected.** |
| C21 can be upgraded via the Major Case Squad report | **Adopted** (excerpt level): C21 → CORROBORATED. |
| Mitigations recorded in the ledger were never applied to the cut | **Correct.** Applying them needs a new render; listed for your approval. |

## Claims the reviewer tried and failed to confirm

- The serial-number sequence (C43).
- "Insisted" (C19).
- Chemotherapy that day (C24).
- Whether the 2013 jury heard about the beneficiary change.
- The exact 31 Jan 2028 date.
- The ruling on the October 2026 motion.
- Jury vs bench in a September 2026 FOX 2 report.
- Merkel's trial date.
- The date of Chaney's disqualification.
- The basis of Askey's dismissal.
- Hupp's motion to vacate (year and outcome).
- Jury vs judge in the insurance case.

## Post-April-2026 developments found

- **September 2026:** defense motion in limine to exclude Gumpenberger evidence, to be argued in October 2026; no ruling found.
- **October 2026:** Biography gives 31 Jan 2028 as the bench-trial date.
- **Nothing newer found:** no plea, verdict or new date in the Faria case; no charges in Neumann's death; no charges against Askey.
