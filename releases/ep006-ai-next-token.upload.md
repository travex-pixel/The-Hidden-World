# Upload kit — Ep 006: *ChatGPT's Answer Doesn't Exist Until You Watch It Appear*

**File:** `ep006-ai-next-token.mp4`: 1080×1920, 30 fps, about 43.3 s, H.264 + AAC. Captions are burned in (karaoke style).
**Subtitles file:** `ep006-ai-next-token.srt`
**Cover frame:** about 23.9 s ("LOOKS WINS" with the spotlight and probability columns) or 33.5 s (two phones, "SAME QUESTION. DIFFERENT ANSWER.").

---

## Post captions

### TikTok
```
That "typing" in ChatGPT isn't an animation 🤯

The answer doesn't exist yet. It's built live, one piece at a time: score 100,000+ word-pieces, roll a weighted dice, add the winner, repeat. About 700 times for a 500-word answer.

Follow for part 2: how does it know when to stop?

#chatgpt #ai #howaiworks #techexplained #artificialintelligence #llm #learnontiktok #hiddentech
```

### Instagram Reels
```
ChatGPT doesn't write its answer and then type it out. 👀

It doesn't even see words: it sees tokens ("Unbelievable" = Un · belie · vable). For every single piece it scores 100,000+ options, rolls a weighted dice, adds the winner, and goes again.

That's why the same question can get a different answer.

Save this for the next time someone says "it's just a typing animation". Follow for more invisible tech.

#chatgpt #ai #howitworks #techexplained #llm #invisibletech
```

### YouTube Shorts
**Title:** `ChatGPT's Answer Doesn't Exist Until You See It`
**Description:**
```
An AI chatbot doesn't write the answer first. It generates it one token (word piece) at a time: it scores every token it knows, picks one with a weighted random draw, adds it, and repeats. With streaming on, you watch each piece arrive as it's made.

Illustration: the probabilities shown are invented for the example. Token splits are real (GPT-4's cl100k_base tokenizer).

Sources:
• OpenAI Help: What are tokens and how to count them?
• OpenAI docs: Streaming API responses
• OpenAI Cookbook: reproducible outputs with the seed parameter ("non-deterministic by default")
• openai/tiktoken (cl100k_base, about 100k tokens)
• Brown et al. 2020, "Language Models are Few-Shot Learners"

#chatgpt #ai #shorts
```

---

## Pinned comment
```
Try it: ask ChatGPT the exact same question twice (new chat each time).
Different answer? That's the dice.

Part 2: how does it decide when to STOP rolling? 👇
```

## Seed comments
Post these from your own account (or ask real collaborators to write their own). Don't use fake accounts; platforms suppress inauthentic engagement.

1. `"Unbelievable" being 3 pieces is genuinely unbelievable`
2. `So when it gives me a wrong answer, it just rolled badly? 💀`
3. `Wait, is this why regenerate gives a different answer?`
4. `700 rolls for one essay, and each one checks 100,000 options. That's insane.`
5. `Which hidden tech next: microwaves, contactless cards, or robot vacuums?`

## Ready answers for likely questions
- **"Is it always random?"** By default the chat apps sample, so yes, there's a weighted random choice. Developers can turn the randomness down (temperature), and then it mostly picks the top option.
- **"So it doesn't plan at all?"** Careful. Research has found models can plan ahead internally (for example, picking a rhyme before writing the line). What's true is that the *text* is produced one token at a time, live.
- **"Why 100,000?"** That's the size of GPT-4's token menu (cl100k). Newer models use bigger menus, about 200,000.
- **"How does it know when to stop?"** Next episode. (Short answer: there's a special "end" token it can roll, and apps also set length limits.)

## Accuracy notes
- The percentages in the dice scene are invented and labelled "Illustration · invented probabilities".
- Both example answers are real token sequences in GPT-4's tokenizer, written for the example. They are not real model outputs.
- The video shows a generic chat UI, with no OpenAI logo or branding.
