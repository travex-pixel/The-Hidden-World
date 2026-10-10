# Research record — Episode 001

**Episode:** ep001-cash-vs-profit — *Why a Billion-Dollar Company Can Run Out of Cash*
**Central question:** How can a business look wealthy and profitable, yet fail to pay a bill that is due today?
**Why it matters:** "Profitable" and "has cash" are routinely confused. The confusion explains a large share of real company failures and most small-business stress. It is also a clean, visual, counterintuitive mechanism.
**Proposed answer:** Profit is measured on an accrual basis over a period; cash flow is the actual timing of money moving. A credit sale raises profit immediately but raises cash only when the customer pays, while wages, suppliers and stock usually must be paid sooner. Misaligned timing can leave a profitable business unable to pay a bill today.

## Research-access note (honest)
In this build environment, direct page fetches to most external sites were blocked by the network policy (DNS/proxy failures for ifrs.org, sec.gov, ato.gov.au, asic.gov.au, wikipedia and others). Research was performed with the web-search tool, which returns indexed page excerpts and the page URLs. Every source below is a real URL returned by that search, and the claims cited are the passages the search index returned. Full-page reading was **not** possible here. Before publishing publicly, open each URL on your phone and confirm the quoted figures (especially the ASIC 52% figure). The pipeline accepts additional URLs and notes via `research.md` and `episode.json` `sources`.

## Key mechanisms and definitions
- **Accrual basis:** income is recorded when it is earned (e.g. the invoice is issued for completed work), not when the cash arrives. (S3, S4, S5)
- **Accounts receivable / debtors:** amounts customers owe for credit sales already recorded as income. (S4)
- **Profit:** revenue earned over a period minus expenses incurred in that period.
- **Cash flow:** actual cash receipts and payments; the statement of cash flows exists so users can assess "the ability of the entity to generate cash and cash equivalents and the needs of the entity to utilise those cash flows". (S1)
- **Operating cash outflows** include "cash payments to suppliers for goods and services" and "cash payments to and on behalf of employees". (S1, para 14)

## Sources actually consulted

| ID | Source | Publisher / date | What it supports |
|----|--------|------------------|------------------|
| S1 | [IAS 7 Statement of Cash Flows](https://www.ifrs.org/content/dam/ifrs/publications/html-standards/english/2026/issued/ias7.html) | IFRS Foundation, 2026 issued edition | Objective of cash-flow information; entities need cash to conduct operations, pay obligations; timing and certainty of cash generation; operating-flow categories (para 14). |
| S2 | [IFRS for SMEs Education Module 7](https://www.ifrs.org/content/dam/ifrs/supporting-implementation/smes/2025-modules/module-7.pdf) | IFRS Foundation, 2025 | Plain-language explanation of why cash flows differ from profit. |
| S3 | [Accounting methods for business income](https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/income-and-deductions-for-business/assessable-income/accounting-methods) | Australian Taxation Office | Accruals basis: income reported when earned even if not yet paid; carpenter example (job in April, paid in July). |
| S4 | [Debtor and creditor records](https://www.ato.gov.au/businesses-and-organisations/preparing-lodging-and-paying/record-keeping-for-business/setting-up-and-managing-records/debtor-and-creditor-records) | Australian Taxation Office | Accrual accounting records income and expenses when they take place, not when money changes hands; an invoice for completed work is recorded as income before payment. |
| S5 | [Publication 538, Accounting Periods and Methods](https://www.irs.gov/publications/p538) | US IRS, Jan 2022 | Accrual method: income reported in the year earned regardless of when payment is received. |
| S6 | [23-346MR ASIC annual corporate insolvency statistics](https://www.asic.gov.au/about-asic/news-centre/find-a-media-release/2023-releases/23-346mr-asic-s-annual-corporate-insolvency-statistics-shows-covid-19-impact-on-small-business) | ASIC, Dec 2023 | 1 July 2022 – 30 June 2023: "inadequate cash flow or high cash use" was the most frequently nominated cause of failure, in 52% of registered liquidators' reports; trading losses 49%; "other" 50%; liquidators typically nominate 3–4 causes per report. Earlier years (REP 558: 46.7% in 2016–17; 19-363MR: 51% in 2018–19) show the same ranking. |

Additional context sources found by search but not relied on for any on-screen claim: AASB 107 (Australian adoption of IAS 7); various accounting-software blogs describing the 30–90 day receivables gap (secondary, not cited).

## Claim-level fact check

| Claim | Script wording | Status | Evidence |
|-------|----------------|--------|----------|
| C1 | "Sell on credit, and the sale is recorded straight away. The actual cash arrives later." | **Established** | S3, S4, S5 all state income is recorded when earned/invoiced under accruals. Simplification check: "recorded straight away" = recorded when the sale is earned (delivery/invoice), which for a credit sale precedes payment. Accurate. |
| C2 | "Profit measures what a business earned over a period. Cash flow tracks money actually moving in and out." | **Established** | S1 objective and S2. Wording checked: profit is a period measure (income statement); cash flows are receipts/payments. Accurate as a plain-language definition. |
| C3 | "When the timing doesn't line up, even a profitable business can hit trouble. It's not the only way companies fail." | **Established, hedged** | S1 (need for cash to meet obligations; timing and certainty); S6 (other causes: trading losses, poor strategic management). Narration explicitly says it is not the only cause. |
| C4 | "Australian liquidators name cash-flow problems more than any other single cause." Caption: "cited in 52% of liquidator reports". | **Established (verify on publish)** | S6: 52%, most frequently nominated. "Single cause" wording used because the catch-all "other" category sits at 50%. Multiple causes are nominated per report, so 52% is "share of reports", not "share of failures caused". The caption says "cited in", which is correct. |
| C5 | On-screen figures: profit $500k, cash $40k, bill due $120k, payment $350k, new invoice $400k. | **Illustrative / fictional** | Internally consistent: revenue 2,400,000 − expenses 1,900,000 = profit 500,000; receivables = revenue − collected = 600,000; cash = 440,000 + 1,800,000 − 2,200,000 = 40,000 (cash paid = 1,900,000 expenses + 300,000 stock). Verified by `tests/test_financials.py`. Caption "A fictional company" shown in the opening scene. |
| C6 | Safe, vault, winding road and pipes imagery. | **Metaphor** | Not presented as accounting terminology. |
| — | "Wages are due Friday. Suppliers want paying on delivery. Stock has to be bought before it's sold." | **Illustrative, representative** | Describes common operating outflows (S1 para 14 lists payments to suppliers and employees). Specific timings belong to the fictional company. |
| — | Title "Billion-Dollar Company" vs narration "worth millions" | **Consistent** | The title states the general phenomenon (it applies at any scale); the fictional example is deliberately smaller so the numbers stay readable. |

## Uncertainties and limitations
- The 52% ASIC figure is from the 2022–23 reporting year; later years may differ. The caption names the year.
- ASIC statistics are nominated causes from liquidators, not audited root causes; they are the best official data available.
- The episode does not cover financing options (overdrafts, invoice factoring) that real businesses use to bridge the gap. Deliberately out of scope for 65 seconds.
- Full-page verification of sources was not possible from this environment (see access note).

## Misconceptions to avoid
- "Profit is fake / cash is the only truth": no — profit is a valid performance measure; the point is that they measure different things.
- "Receivables are worthless": no — they are assets; they are simply not spendable today.
- Do not imply a specific real company went bust this way.

## Visual opportunities
Reservoir vs pipeline; the gate that only takes cash; a profit report that looks glorious next to an almost-empty tank; a giant invoice rolling in at the end.

## Fact-checking outcome
**Pass with a publish-time verification step:** all factual claims map to official sources; the single statistic is flagged for manual confirmation on the ASIC page before public upload.

## Artwork text check (supplied illustrations)
The supplied panels contained machine-generated lettering, some of it wrong or unreadable. Each was checked against the episode data and corrected with an overlay before rendering:
- Panel 7 left tag read "$500k Profit / Cash: $120k". Cash in the story is $40k, so the tag now reads "Cash: $40k". The scrambled gauge numbers were replaced by a clean dial reading $40,000.
- Panel 6 sign read "Costomers who owe us $000k". Corrected to "Customers who owe us $600k" (the receivables figure). The safe display "$40l" now reads "$40k".
- Panels 8 and 10 showed "− $500,000" as the result of revenue minus expenses. Corrected to "= $500,000". Garbled sub-labels were rewritten.
- Panel 10's statistic pill was unreadable. It now reads "52% of liquidator reports" with the source "ASIC insolvency statistics, 2022–23", matching claim C4.
- Panel 5 pipe labels "MAGES" and "STOES" now read "WAGES" and "STOCK".
- Remaining unreadable background lettering (book spines, ledger columns, the vault plaque) carries no factual claim and was left as texture.
- Narration was made name-free ("this company", "the owner") because the supplied panels show different-looking owners in the opening and the payoff.

## Licences and attribution
- Narration: Piper TTS (MIT) with the `en_GB-alba-medium` voice; dataset licence CC BY 4.0 (Edinburgh DataShare). Attribution is included in `docs/CREDITS.md`.
- Fonts: Fraunces, Nunito (SIL OFL 1.1).
- Illustrations: supplied by the channel owner (see `docs/CREDITS.md`). Music and sound effects are generated by this repository's own code.
