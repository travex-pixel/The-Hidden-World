"""Synthesised guide sound bed for EP2 "The Ledge" (stand-in for library sounds in the edit).
usage: python guide_mix_ep02.py out.wav"""
import sys, wave
import numpy as np

SR, DUR = 48000, 30.0
N = int(SR * DUR); t = np.arange(N) / SR
rng = np.random.default_rng(2)
noise = rng.standard_normal(N)
mix = np.zeros(N)


def env(a, b, fade=0.05):
    return np.clip((t - a) / fade, 0, 1) * np.clip((b - t) / fade, 0, 1)


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR); y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc; y[i] = acc
    return y


def hit(at, f0, decay, gain, noisy=.8, lp=900):
    s = int(at * SR); L = min(N - s, int(.4 * SR)); tt = np.arange(L) / SR
    mix[s:s + L] += (np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * decay) + lowpass(noise[s:s + L], lp) * np.exp(-tt * 40) * noisy) * gain


outside = env(4.5, 8.0, .25) + env(11.3, 23.2, .25)
inside = 1 - np.clip(outside, 0, 1)
# drone bed, heavier towards the knocks
mix += (np.sin(2 * np.pi * 55 * t) + .5 * np.sin(2 * np.pi * 82.4 * t + np.sin(t * .7))) * .07 * (0.7 + 0.5 * np.clip((t - 14) / 11, 0, 1))
brown = lowpass(noise, 120) * 6
mix += brown * .05 * (1 - .8 * env(2.2, 3.0, .1))          # the room goes quiet when the knocking stops
# wind outside (slow gusts)
gust = .6 + .4 * np.sin(2 * np.pi * .23 * t) * np.sin(2 * np.pi * .07 * t + 1)
mix += lowpass(noise, 700) * gust * outside * .55
# whoosh as the balcony door opens
mix += lowpass(noise, 1600) * env(4.5, 5.1, .2) * np.sin(np.pi * np.clip((t - 4.5) / .6, 0, 1)) * .5
# car alarm three floors down: louder when he looks down
alarm = np.sign(np.sin(2 * np.pi * np.where((t * 2).astype(int) % 2, 620, 830) * t))
alarm_gain = (outside * .06 + env(6.2, 8.0, .4) * .1) * (t > 4.8) + inside * .015 * (t > 4.8)
mix += lowpass(alarm, 1800) * alarm_gain
# distant sirens
f = 650 + 380 * np.sin(2 * np.pi * .2 * t)
mix += lowpass(np.sin(2 * np.cumsum(np.pi * f / SR)), 900) * .05 * env(4.5, 24, 1)
# soft knocks (EP1's echo) then they stop
for k in (0.6, 1.2):
    hit(k, 78, 14, .45)
# chain scrape + clink, alone in the flat
mix += lowpass(noise * (0.6 + 0.4 * np.sin(2 * np.pi * 37 * t)), 2600) * env(8.6, 9.6, .05) * .35
for f0, g in ((2600, .25), (3700, .18), (5100, .1)):
    s = int(9.65 * SR); L = int(.6 * SR); tt = np.arange(L) / SR
    mix[s:s + L] += np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * 9) * g
# light switch-ish click when he grabs the keys + jingle
for k in (2.55, 2.6, 2.68):
    s = int(k * SR); L = int(.12 * SR); tt = np.arange(L) / SR
    mix[s:s + L] += np.sin(2 * np.pi * (4200 + 900 * (k * 10 % 3)) * tt) * np.exp(-tt * 40) * .12
# phone buzzes
buzz = np.sign(np.sin(2 * np.pi * 170 * t)) * (np.sin(2 * np.pi * 9 * t) > 0)
mix += lowpass(buzz, 1500) * (env(14.75, 15.2, .01) + env(15.95, 16.4, .01)) * .18
# heartbeat during the step, 80 -> 150 bpm, cut dead when he's across
x = 18.0
while x < 23.2:
    for off, amp in ((0, 1.0), (.16, .7)):
        if x + off < 23.2:
            s = int((x + off) * SR); L = int(.18 * SR); tt = np.arange(L) / SR
            mix[s:s + L] += np.sin(2 * np.pi * 52 * tt) * np.exp(-tt * 22) * .6 * amp
    x += 60 / (80 + 70 * (x - 18) / 5.2)
# the neighbour's microwave hum
mix += np.sin(2 * np.pi * 110 * t) * (0.6 + 0.4 * np.sin(2 * np.pi * 6 * t)) * env(21.8, 23.2, .2) * .1
# three knocks next door
for k in (25.2, 25.7, 26.2):
    hit(k, 78, 14, .95)
# sting on A/B
s = int(28.6 * SR); tt = np.arange(N - s) / SR
mix[s:] += (np.sin(2 * np.pi * 41 * tt) + .4 * np.sin(2 * np.pi * 61.7 * tt)) * np.exp(-tt * 1.4) * .4

mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= .89 / np.max(np.abs(mix))
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('wrote', sys.argv[1])
