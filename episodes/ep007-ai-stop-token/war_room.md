# War room — Episode 007: *Every ChatGPT Answer Ends With a Word You Never See* (AI part 2)

1. **CTO:**
   - Stopping is just another roll. A special end-of-turn token sits in the model's vocabulary.
   - Chat training data ends every assistant turn with it, so after a complete answer it becomes very likely.
   - When it's drawn, the app hides it and stops. A separate length cap can also cut the answer off.
2. **CEO hooks (picked #1):**
   1. "You think ChatGPT's answer ends at the last full stop. It doesn't."
   2. "Every ChatGPT answer ends with a word you never see."
   3. "ChatGPT doesn't decide to stop. It rolls for it."
   4. "Why does ChatGPT sometimes stop mid-sentence?"
   5. "The last word of every AI answer is invisible."

   #1 opens on a belief everyone holds, breaks it in two words, and promises a hidden object. #4 becomes the payoff of the hard-limit beat.
3. **Sceptic (25.6 s, middle of 41.4 s):** "So it just knows when it's done?" Destroyed on screen: END at 90% loses the roll to "Also" at 6%, and the answer rambles on into a second sentence.
4. **Retention timeline:**

   | Time | Beat |
   |------|------|
   | 0–5.9 | The hook. The pink hidden token appears after the full stop (4.4 s), then THE APP HIDES THIS (5.2 s). |
   | 5.9–12.5 | The real end token, shown as Meta Llama 3's `<|eot_id|>`. It flies into the phone ("hidden · stop"). |
   | 12.5–19.7 | END is always on the menu: 0.1% mid-sentence, with a stamp. |
   | 19.7–25.6 | After a full answer, END shoots to 90%. Training-example cards fly past. |
   | 25.6–32.7 | Sceptic. The roulette lands on "Also" and the answer keeps going. |
   | 32.7–38.2 | The hard limit: 21/21 tokens, CUT OFF MID-SENTENCE. |
   | 38.2–41.4 | Frozen frame: "So who taught it what a finished answer looks like?" |

5. **Visual:**
   - The same night plaza as Episode 006, so the two read as one series.
   - The end token is the only pink object on screen.
   - Built on the shared `renderer/kit3d.js`, with a logarithmic depth buffer and no coplanar surfaces.
6. **Retention audit:**

   | Check | Score |
   |-------|-------|
   | First 0.8 s | 4 (answer typing on a phone, "ChatGPT" spoken at 0.7 s) |
   | Viewer's life in 5 s | 5 |
   | Payoff every 6–8 s | 5 |
   | Explainable to a friend | 5 |
   | Sceptic beaten on screen | 5 |
   | Door at the end | 5 |

   **Accuracy fix:** the end token shown is labelled as Llama 3's, because OpenAI's current end token isn't public.
