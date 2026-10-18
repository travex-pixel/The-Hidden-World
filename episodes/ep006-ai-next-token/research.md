# Research record — Episode 006

**Episode:** ep006-ai-next-token — *ChatGPT's Answer Doesn't Exist Until You Watch It Appear*
**Series:** Invisible Tech (3D low-poly).
**Central question:** When an AI chatbot "types" its answer, is it showing you something already written, or building it as you watch?
**Proposed answer:** It is building it. A language model produces one token (word piece) at a time. At each step it scores every token in its vocabulary, picks one with a weighted random draw, appends it, and repeats. With streaming, each token is sent to your screen as it is produced.

## Hook change (accuracy)
The shortlisted hook "It doesn't know what it's going to say, not even one word ahead" was **dropped**. Anthropic's interpretability work (S7, March 2025) found a model choosing a rhyme word before writing the line that leads to it, which is a form of planning ahead inside the model. The script instead claims only what is solid: the *text* of the answer does not exist until it is generated, token by token.

## Research-access note
Pages were read through the web-search tool's indexed excerpts. Token splits were not taken from a web page. They were computed locally with `gpt-tokenizer@2.8.1`, an npm port that bundles OpenAI's `cl100k_base` and `o200k_base` encodings. The tiktoken download endpoint was blocked here.

## Sources actually consulted
| ID | Source | Supports |
|----|--------|----------|
| S1 | [Brown et al. 2020, GPT-3 paper](https://arxiv.org/abs/2005.14165) | GPT models are autoregressive language models. |
| S2 | [OpenAI: Streaming API responses](https://developers.openai.com/api/docs/guides/streaming-responses) | With streaming on, output arrives as server-sent events while the model generates it. Without it, the API returns the whole output at the end. |
| S3 | [OpenAI Help: What are tokens and how to count them?](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them) | Tokens are pieces of words. Rule of thumb: 100 tokens ≈ 75 words (English). |
| S4 | [openai/tiktoken](https://github.com/openai/tiktoken) | The cl100k_base and o200k_base encodings. Vocabularies are about 100k and 200k tokens. |
| S5 | [Calvin University CS 376 notes on generation](https://cs.calvin.edu/courses/cs/376/cur/units/08generative-intro/notes/) | The model outputs a distribution over the next token. A token is sampled or chosen greedily, then appended, in a loop. |
| S6 | [OpenAI Cookbook: reproducible outputs with seed](https://developers.openai.com/cookbook/examples/reproducible_outputs_with_the_seed_parameter) | Chat Completions are non-deterministic by default, so outputs may differ from request to request. |
| S7 | [Anthropic: Tracing the thoughts of a large language model](https://www.anthropic.com/research/tracing-thoughts-language-model) | Evidence of planning ahead (rhymes). It is why the "not one word ahead" hook was rejected. |

## Claim-level fact check
| Claim | Script wording | Status | Evidence |
|-------|----------------|--------|----------|
| C1 | "The answer doesn't exist yet. It's built live, one piece at a time." | Established | S1, S2, S3. Caveat: some apps buffer text; the claim is about how the text is produced. |
| C2 | "It reads pieces called tokens. Unbelievable is three of them." | Established | Computed: cl100k_base gives `Un · belie · vable`; o200k_base gives `Un · bel · ievable` (also three). On screen it is labelled "GPT-4's tokenizer". |
| C3 | "It scores every piece it knows. Over a hundred thousand." | Established | S4, S5. cl100k ≈ 100k; o200k ≈ 200k. |
| C4 | Candidate percentages (is 46%, looks 29%, appears 14%, seems 6%) | Illustrative | Invented; labelled "illustration" on screen. |
| C5 | "Rolls a weighted dice. The top pick doesn't always win." | Established | S5, S6 (sampling at temperature > 0). Reasoning models and settings vary; the default chat behaviour is sampled. |
| C6 | "Same question, asked twice… different answer." | Established | S6. Both example answers are real cl100k token sequences, made up for the example (not real model outputs). |
| C7 | "A five hundred word answer? About seven hundred rolls." | Estimate | S3: 500 × 100/75 ≈ 667. |
| — | "So how does it know when to stop?" | Threshold question | Answer for the next episode: the model predicts a special end-of-turn token, and apps also set length limits. |

## Licences
Original 3D scenes in code (three.js, MIT). Narration: Piper en_GB-alba-medium (MIT engine, CC BY 4.0 data). Music and SFX synthesised in `pipeline/audio.py`. Fonts: Nunito (OFL). No product logos are shown; the chat UI is generic.
