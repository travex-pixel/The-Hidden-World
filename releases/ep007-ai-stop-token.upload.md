# Upload kit — Ep 007: *Every ChatGPT Answer Ends With a Word You Never See* (AI part 2)

**File:** `ep007-ai-stop-token.mp4` (1080×1920, about 41 s). **Subtitles:** `ep007-ai-stop-token.srt`. **Cover frame:** about 5.2 s (pink hidden token, "THE APP HIDES THIS") or 30.5 s ("ROLLED: ALSO").

## TikTok caption
```
Every ChatGPT answer ends with a word you never see 👀

It's a hidden END token. The AI has to ROLL it, like every other word. Sometimes it misses and keeps rambling. Sometimes the app just cuts it off mid-sentence.

Part 2 of how AI writes. Follow for part 3.

#chatgpt #ai #howaiworks #techexplained #llm #learnontiktok #hiddentech
```

## Instagram caption
```
Every ChatGPT answer ends with a word you never see. 🤫

AI writes one piece at a time, and "stop" is just another piece it has to roll. After a finished answer, the END token is ~90% likely… but not 100%. That's why it sometimes rambles on, or gets cut off mid-sentence by the app's limit.

Part 2 of how AI writes. Save it, and follow for part 3.

#chatgpt #ai #howitworks #techexplained #llm #invisibletech
```

## YouTube Shorts
Title:
```
Every ChatGPT Answer Ends With a Word You Never See
```
Description:
```
Chatbots stop by generating a special end-of-turn token, which the app hides. It competes in the same weighted roll as every other token, so it can lose (the answer rambles on), and apps also cap the length (the answer gets cut mid-sentence).

Illustration: probabilities are invented. The token shown is Meta Llama 3's documented end token; OpenAI's exact one isn't public.

Sources: Meta Llama 3 prompt format docs; Hugging Face generation docs; OpenAI API finish_reason ("stop" vs "length"); OpenAI Cookbook (non-deterministic by default).

#chatgpt #ai #shorts
```

## Pinned comment
```
Ever had ChatGPT stop mid-sentence? Now you know why ✂️
Part 3: who taught it what a "finished" answer looks like? 👇
```

## Seed comments (post from your own account or real collaborators)
```
So "regenerate" is literally a re-roll 💀
```
```
The fact that "stop" is just another word it has to pick is wild
```
```
This explains why it sometimes adds a random extra paragraph at the end
```
```
Part 1 was the dice, part 2 is the stop button. What's part 3?
```

## Ready answers
- **"Does ChatGPT use that exact token?"** That one is Meta's Llama. OpenAI hasn't published ChatGPT's current one, but chat models all use a hidden end-of-turn token the same way.
- **"Is it really random?"** The chat apps sample by default, so yes, it's a weighted random pick. Developers can turn the randomness down.
- **"Why does it get cut off?"** Apps set a maximum length. When it's reached, generation just stops, even mid-word.
