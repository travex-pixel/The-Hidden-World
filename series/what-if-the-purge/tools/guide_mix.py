"""Synthesised guide sound mix for WHAT IF: THE PURGE episodes (stand-in for the edit).
Cue times follow the episode's SOUND NOTES. Usage: python guide_mix.py out.wav"""
import sys, wave
import numpy as np

SR = 48000
DUR = 30.0
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(1)
mix = np.zeros(N)


def env(a, b, fade=0.05):
    """0..1 gate between a and b seconds with short fades."""
    return np.clip((t - a) / fade, 0, 1) * np.clip((b - t) / fade, 0, 1)


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc; y[i] = acc
    return y


noise = rng.standard_normal(N)
brown = lowpass(noise, 120) * 6

# drone bed: low dread that thickens towards midnight
drone = (np.sin(2 * np.pi * 55 * t) + .5 * np.sin(2 * np.pi * 82.4 * t + np.sin(t * .7))) * .06
mix += drone * (0.6 + 0.6 * np.clip((t - 8) / 17, 0, 1)) * env(0, 30, .5)
mix += brown * .05 * env(0, 30, 1)

# clock ticks 0-3 s
for k in range(3):
    s = int(k * SR); L = int(.03 * SR)
    mix[s:s + L] += noise[s:s + L] * np.exp(-np.arange(L) / (SR * .004)) * .25

# purge siren: loud 3.0-8.0, distant to 18.0
def siren(a, b, gain, lp):
    f = 650 + 380 * np.sin(2 * np.pi * .23 * (t - a) - np.pi / 2)
    ph = 2 * np.cumsum(np.pi * f / SR)
    sig = np.sin(ph) + .35 * np.sin(2 * ph) + .15 * np.sin(3 * ph)
    return lowpass(sig * env(a, b, .4), lp) * gain if lp else sig * env(a, b, .4) * gain
mix += siren(3.0, 8.0, .22, None)
mix += siren(8.0, 18.0, .07, 900)

# distant scream bed 5.85-6.9 (filtered noise swell; replace with library scream)
mix += lowpass(noise * env(5.85, 6.9, .2), 1800) * np.sin(np.pi * np.clip((t - 5.85) / 1.05, 0, 1)) * .25

# light switch click 8.6
s = int(8.6 * SR); L = int(.02 * SR); mix[s:s + L] += noise[s:s + L] * .5 * np.exp(-np.arange(L) / (SR * .003))

# dog growl 11.9-14.5 (+ low rumble after)
g = lowpass(noise, 300) * (0.6 + 0.4 * np.sin(2 * np.pi * 27 * t)) * np.sin(2 * np.pi * 95 * t)
mix += g * (env(11.9, 14.5, .15) * 1.6 + env(14.5, 25, .3) * .25)

# phone buzzes 14.75-15.2, 15.95-16.4 ; low battery chirp 4.3
buzz = np.sign(np.sin(2 * np.pi * 170 * t)) * (np.sin(2 * np.pi * 9 * t) > 0)
mix += lowpass(buzz, 1500) * (env(14.75, 15.2, .01) + env(15.95, 16.4, .01)) * .18
mix += np.sin(2 * np.pi * 1200 * t) * (env(4.3, 4.42, .01) + env(4.5, 4.62, .01)) * .12

# heartbeat 18.0-25.0, 72 -> 140 bpm, cuts dead at 25.0
x = 18.0
while x < 25.0:
    for off, amp in ((0, 1.0), (.17, .7)):
        s = int((x + off) * SR); L = int(.18 * SR)
        if s + L < N and x + off < 25.0:
            tt = np.arange(L) / SR
            mix[s:s + L] += np.sin(2 * np.pi * 52 * tt) * np.exp(-tt * 22) * .55 * amp * (0.6 + 0.4 * (x - 18) / 7)
    x += 60 / (72 + (140 - 72) * (x - 18) / 7)

# door handle creak 22.8-24.4
f = 420 + 140 * np.sin(2 * np.pi * 1.3 * (t - 22.8)) + 30 * np.sin(2 * np.pi * 31 * t)
ph = 2 * np.cumsum(np.pi * f / SR)
mix += lowpass(np.sign(np.sin(ph)), 2500) * env(22.8, 24.4, .1) * .05

# three knocks
for k in (25.2, 25.7, 26.2):
    s = int(k * SR); L = int(.35 * SR); tt = np.arange(L) / SR
    mix[s:s + L] += (np.sin(2 * np.pi * 78 * tt) * np.exp(-tt * 14) + lowpass(noise[s:s + L], 900) * np.exp(-tt * 40) * .8) * .95

# sting on A/B 28.6
s = int(28.6 * SR); L = N - s; tt = np.arange(L) / SR
mix[s:] += (np.sin(2 * np.pi * 41 * tt) + .4 * np.sin(2 * np.pi * 61.7 * tt)) * np.exp(-tt * 1.4) * .4

mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= .89 / np.max(np.abs(mix))
pcm = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('wrote', sys.argv[1])
