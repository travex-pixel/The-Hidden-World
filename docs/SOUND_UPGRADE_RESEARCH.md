# Sound upgrade research (17 Oct 2026)

Owner feedback: "It's a bit hard to hear the music and sound effects."

## Measured cause (Case Files 63 and 71, stems in out/<id>/stems/)
| | 63 | 71 |
|---|---|---|
| Music energy below 150 Hz | 73 % | 84 % |
| SFX energy below 150 Hz | 95 % | 98 % |
| Music under the voice (during speech) | 12.7 dB | 15.6 dB |
| Music in the gaps | -22.1 dBFS | -27.5 dBFS |

Phone speakers produce little below ~250 Hz and roll off from ~800 Hz, so almost all of the score and the effects is
inaudible on the device most viewers use; only the voice (midrange) gets through. A first fix (harmonic saturation of the
lows, sub high-pass, +4/+5 dB at 0.9/2.5 kHz) raised the music's level above 300 Hz by 9.4 dB
(out/share/sound_AB_phone_speaker.m4a: first 15 s of 71 through a phone-speaker simulation, before then after).

## Options (licences from web search; re-read the licence pages before relying on them)
- Music, free for Instagram: Pixabay Music (no credit; keep the licence certificate for Content ID disputes), Mixkit
  (no credit), Incompetech (CC BY credit), Bensound free (credit + link), Uppbeat free (~3/month, credit). Avoid the
  YouTube Audio Library off YouTube. Pixabay's API covers images/video, not music.
- SFX: Sonniss GDC bundles (royalty-free, no credit), Kenney (CC0), Freesound (CC0 filter), Mixkit, Pixabay,
  Zapsplat free (credit). BBC RemArc is non-commercial: do not use.
- Local AI audio (commercial use): Stable Audio Open Small (341M, 11 s clips, CPU-fast; Stability Community Licence,
  free under $1M revenue) for stingers; Stable Audio Open 1.0 (~10–20 min per 35 s on this CPU); ACE-Step 1.5 (MIT;
  CPU untested, RAM tight). MusicGen, AudioLDM2, YuE2 weights are non-commercial.
- This container's network policy blocks pixabay.com, kenney.nl, freesound.org, opengameart.org and huggingface.co,
  so licensed files have to be downloaded by the owner and uploaded.
- Mixing targets: bed ~10–14 dB under the voice, ducked 6–10 dB with a slow release; SFX presence at 2–4 kHz and hits
  placed between phrases; keep the low end mono (phone speakers are often mono); -14 LUFS / -1 dBTP (Meta normalises
  playback, so only the balance inside the mix matters).
- Instagram: music can be added in the app on top of an upload with separate volume sliders (Creator accounts get the
  full library; Business accounts get the Meta Sound Collection). No evidence that trending audio boosts reach.
