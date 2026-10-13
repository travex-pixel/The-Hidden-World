# Production log

- Duration: 192.7 s, 1920x1080 @ 30 fps, seed 1
- Wall-clock build: 694.7 s (render 599.4 s with 3 parallel pages; narration 0.2 s; audio 48.8 s)
- Machine: 4 CPU cores, software rasteriser (no GPU)
- Paid services: none. Narration Kokoro-82M via sherpa-onnx (local), music/SFX NumPy, art procedural Canvas 2D, render headless Chromium + ffmpeg.
- Marginal cost per episode: $0 on owned hardware. On GitHub Actions' standard 4-core runners the build fits easily in the free minutes of a public repository; on a private repo it uses roughly the wall-clock minutes above from the monthly allowance.
- Human time still required: script and fact-check review, visual review of storyboard.png / transitions.png, listening pass.