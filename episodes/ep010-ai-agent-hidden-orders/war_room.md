# War room — Episode 010: *Any Web Page Can Give Your AI Assistant Orders. In Text You Can't See.*

**Topic choice (19 Oct 2026):** scanned the week's news. Candidates: the Starlink throttling row in Ukraine, Apple's HomeView hub, Gemini 4 Argon, the robot-dog marathon, and the AI-agents story (FTC demands to OpenAI and Anthropic delivered 15 Oct; OpenAI's apology in Sydney 6 Oct; the Hugging Face breach in July). Picked the agents story because it has a hidden mechanism that touches the viewer's own device and nobody outside security knows it: indirect prompt injection.

1. **CTO — the mechanism**
   - An AI agent reads your request and the web page as one sequence of tokens. It has no reliable way to tell "instruction" from "content".
   - So text on a page can act as an order, and attackers hide it: white-on-white, 1-pixel text, HTML comments, metadata.
   - Defence is architectural, not a patch (OpenAI: "unlikely to ever be fully solved"). Willison's lethal trifecta / Meta's Rule of Two: never give one agent private data + untrusted content + a way to send data out.
2. **CEO — five hooks (picked #1)**
   1. "You think your AI assistant only takes orders from you. It doesn't."
   2. "Any web page can give your AI assistant orders. In text you can't see." (title)
   3. "Your AI browser just read a line you'll never see."
   4. "A Reddit comment can empty your inbox. If an AI reads it."
   5. "Why the FTC is asking OpenAI about rogue agents."
   #1 is the universal belief; #2 is the mechanism as a title; #5 is news-first but doesn't name the mechanism.
3. **Sceptic (32.0 s, middle of 54.8 s):** "I'd see it." Destroyed with Google's telemetry: 2–3 billion pages a month scanned, +32% malicious hidden orders in three months, and the red wall of flagged pages; then the three attempts seen in the wild (pay, delete database, leak passwords), labelled as attempts.
4. **Retention timeline**

   | Time | Beat |
   |------|------|
   | 0–7.3 | A normal page under the assistant; "YOU" → "ORDERS FROM A WEB PAGE"; tokens fly from the page into the core; stamp IN TEXT YOU CAN'T SEE. |
   | 7.3–16.1 | "What you see" → "what the AI sees": three red lines appear (white-on-white, 1 px, HTML comment); then the page as token tiles. |
   | 16.1–23.7 | Your request and the page merge into one river of tokens into the core; ONE STREAM OF TOKENS; ORDERS ARE ORDERS. |
   | 23.7–32.0 | The real case: forum thread, spoiler box turns red, "Summarise", three steps (opens your email, requests a login code, posts both). |
   | 32.0–42.1 | Sceptic; the wall of billions of pages; +32%; PAY / DELETE DATABASE / LEAK PASSWORDS. |
   | 42.1–52.0 | The rule: three orbs light up; all three linked = red; drop one = TWO OF THREE, green. |
   | 52.0–54.8 | Frozen two-orb frame: "So what did your assistant read today?" |
5. **Visual:** dark space; the page is a real canvas-drawn mock-up ("walks-and-coffee.example"), the forum is generic ("r/forum", names changed), the core is the series' AI model. Hidden lines are always red. Everything invented is labelled on screen.
6. **Retention audit**

   | Check | Score | Notes |
   |-------|-------|-------|
   | First 0.8 s | 4 | "You think your AI assistant only takes orders from you" over the page and the glowing core. |
   | Viewer's life in 5 s | 5 | Their assistant, a page they'd read. |
   | Payoff every 6–8 s | 5 | 3.1, 5.6, 9.5, 11.3, 13.0, 15.5, 19.6, 22.0, 25.3, 28.0, 30.5, 34.5, 37.3, 39.8, 46.0, 49.5, 51.5, 53.5 s. |
   | Explainable to a friend | 5 | "It reads the page and your request as one stream, so hidden text on the page can be an order." |
   | Sceptic beaten on screen | 5 | Google's numbers and the red wall. |
   | Door at the end | 5 | The rule turns the question back on the viewer. |

   **Accuracy decisions:** OpenAI's wording kept as "unlikely to ever be fully solved"; the Comet case is a researcher demo on a shipped product, fixed since (on screen); Unit 42's and Google's findings are called attempts; the FTC / Australia / Hugging Face incidents are context in the captions because they involved autonomous agents in evaluations, not necessarily prompt injection.
