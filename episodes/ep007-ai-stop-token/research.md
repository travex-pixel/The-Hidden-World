# Research record — Episode 007

**Episode:** ep007-ai-stop-token — *Every ChatGPT Answer Ends With a Word You Never See* (Invisible Tech, AI part 2)
**Central question:** If a chatbot writes one token at a time, how does it know when to stop?
**Answer:** The end is itself a token. Chat models are trained on conversations where every assistant turn ends with a special end-of-turn token. At each step that token competes in the weighted roll like any other. When it is drawn, the app hides it and stops. Separately, apps cap the length, which can cut an answer mid-sentence.

## Access note
Pages were read via the web-search tool's indexed excerpts. Token sequences were computed locally with `gpt-tokenizer@2.8.1` (cl100k_base).

## Sources
| ID | Source | Supports |
|----|--------|----------|
| S1 | [Meta: Llama 3 model cards and prompt formats](https://www.llama.com/docs/model-cards-and-prompt-formats/meta-llama-3/) | The model signals the end of the assistant message by generating `<|eot_id|>`. The chat template closes every message with it. `<|end_of_text|>` is the EOS token that halts generation. |
| S2 | [Hugging Face Transformers: generation](https://huggingface.co/docs/transformers/main_classes/text_generation) | Generation stops when the end-of-sequence token id is produced. |
| S3 | [OpenAI Cookbook: reproducible outputs](https://developers.openai.com/cookbook/examples/reproducible_outputs_with_the_seed_parameter) | Outputs are non-deterministic by default (sampling). |
| S4 | [OpenAI API types: finish_reason](https://v02.api.js.langchain.com/interfaces/_langchain_openai.OpenAIClient.Completions.CompletionChoice-1.html) | `stop` = natural stop point or stop sequence; `length` = max tokens reached. |
| S5 | [OpenAI community: incomplete completions](https://community.openai.com/t/through-api-how-to-get-the-rest-of-an-uncomplete-completion/21173) | A `length` finish means the model had more to say and the cap cut it off. |

## Claim check
| Claim | Wording | Status |
|-------|---------|--------|
| C1 | "It ends on a hidden word you never see… a special end token. Meta's Llama models use this one." | Established for chat LLMs (S1, S2). **OpenAI's exact end token for current ChatGPT models is not public**, so the on-screen token is labelled "Meta Llama 3". The hook says "ChatGPT's answer" because the mechanism is general. |
| C2 | "Roll it, and the app hides it and stops." / "always on the menu" | Established (S1, S2). |
| C3 | 0.1% mid-sentence; 90% / 6% / 4% after a full answer | Illustrative; labelled on screen. |
| C4 | "Every example answer ended with that token." | Established for chat fine-tuning data in that template (S1). Simplified: pre-training text also uses end-of-text markers. |
| C5 | "The roll lands on 'Also'. It keeps going." | Established mechanism (S3). The specific roll is an illustration. |
| C6 | "A hard limit… cuts the answer mid-sentence." | Established (S4, S5). |
| — | "So who taught it what a finished answer looks like?" | Threshold to the next episode (fine-tuning and human feedback). |

## Licences
Same as Episode 006: original three.js scenes, Piper alba voice (CC BY 4.0 data), synthesised audio, Nunito (OFL). The chat UI is generic, with no logos.
