# Production log

- Duration: 107.3 s, 1920x1080 @ 30 fps, seed 1
- Wall-clock build: 860.3 s (render 787.4 s with 3 parallel pages; narration 0.4 s; audio 43.0 s)
- Machine: 4 CPU cores, software rasteriser (no GPU)
- Paid services: none. Narration Piper TTS (local), music/SFX NumPy, art procedural Canvas 2D, render headless Chromium + ffmpeg.
- Marginal cost per episode: $0 on owned hardware. On GitHub Actions' standard 4-core runners the build fits easily in the free minutes of a public repository; on a private repo it uses roughly the wall-clock minutes above from the monthly allowance.
- Human time still required: script and fact-check review, visual review of storyboard.png / transitions.png, listening pass.