"""Synthesised guide sound bed for EP3 "The Street" (stand-in for library sounds in the edit).
usage: python guide_mix_ep03.py out.wav"""
import sys, wave
import numpy as np

SR, DUR = 48000, 30.0
N = int(SR * DUR); t = np.arange(N) / SR
rng = np.random.default_rng(3)
noise = rng.standard_normal(N)
mix = np.zeros(N)


def env(a, b, fade=0.05):
    return np.clip((t - a) / fade, 0, 1) * np.clip((b - t) / fade, 0, 1)


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR); y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc; y[i] = acc
    return y


def hit(at, f0, decay, gain, noisy=.8, lp=900, length=.4):
    s = int(at * SR); L = min(N - s, int(length * SR)); tt = np.arange(L) / SR
    mix[s:s + L] += (np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * decay) + lowpass(noise[s:s + L], lp) * np.exp(-tt * 40) * noisy) * gain


def tone(at, f0, length, gain, decay=0.0):
    s = int(at * SR); L = min(N - s, int(length * SR)); tt = np.arange(L) / SR
    mix[s:s + L] += np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * decay) * np.clip(tt / .005, 0, 1) * np.clip((length - tt) / .01, 0, 1) * gain


street = np.clip((t - 4.5) / .1, 0, 1)
# bed: drone + city air; outside from 4.5 s
mix += (np.sin(2 * np.pi * 55 * t) + .5 * np.sin(2 * np.pi * 82.4 * t + np.sin(t * .7))) * .07 * (0.7 + 0.5 * np.clip((t - 14) / 11, 0, 1))
mix += lowpass(noise, 120) * 6 * .05
gust = .6 + .4 * np.sin(2 * np.pi * .23 * t) * np.sin(2 * np.pi * .07 * t + 1)
mix += lowpass(noise, 700) * gust * env(1, 4.5, .2) * .5                      # wind while hanging
mix += lowpass(noise, 500) * street * .12                                      # street air
f = 650 + 380 * np.sin(2 * np.pi * .2 * t)
mix += lowpass(np.sin(2 * np.cumsum(np.pi * f / SR)), 900) * .05 * env(1, 30, 1)  # far sirens
# distant shouting: short filtered noise swells
for k in (6.0, 7.1, 9.6, 10.8):
    mix += lowpass(noise * env(k, k + .5, .15), 1400) * .12
# landings
hit(2.62, 60, 10, .7); hit(4.72, 50, 8, 1.0, noisy=1.2)
# HIS car alarm, loud, until the key fob at 8.45
alarm = np.sign(np.sin(2 * np.pi * np.where((t * 2).astype(int) % 2, 620, 830) * t))
mix += lowpass(alarm, 2400) * (env(1, 4.5, .1) * .03 + env(4.5, 8.45, .02) * .16)
tone(8.45, 2200, .09, .25); tone(8.62, 2200, .09, .25)                       # beep beep
for k in (8.9, 9.4, 9.9):                                                      # lamps die
    hit(k, 90, 18, .45, noisy=.4, lp=400)
# barking from the balcony above
for k in (11.8, 12.05, 12.35, 12.75):
    s = int(k * SR); L = int(.16 * SR); tt = np.arange(L) / SR
    mix[s:s + L] += lowpass(noise[s:s + L], 1300) * np.sin(2 * np.pi * 520 * tt) * np.exp(-tt * 18) * .5
# phone buzzes, then the dying tone
buzz = np.sign(np.sin(2 * np.pi * 170 * t)) * (np.sin(2 * np.pi * 9 * t) > 0)
mix += lowpass(buzz, 1500) * (env(14.75, 15.2, .01) + env(15.95, 16.4, .01)) * .18
fdie = 880 * np.exp(-np.clip(t - 16.8, 0, None) * 2.2)
mix += np.sin(2 * np.cumsum(np.pi * fdie / SR)) * env(16.8, 17.4, .02) * .12
# heartbeat 18-25, cut dead at the knock
x = 18.0
while x < 25.0:
    for off, amp in ((0, 1.0), (.16, .7)):
        if x + off < 25.0:
            s = int((x + off) * SR); L = int(.18 * SR); tt = np.arange(L) / SR
            mix[s:s + L] += np.sin(2 * np.pi * 52 * tt) * np.exp(-tt * 22) * .6 * amp * (0.6 + 0.4 * (x - 18) / 7)
    x += 60 / (76 + 69 * (x - 18) / 7)
tone(21.4, 3100, .03, .25)                                                    # dome light click
mix += lowpass(noise, 300) * env(22.8, 24.4, .3) * .25                        # someone shifting in the back seat
# three knocks on the glass, from inside the car
for k in (25.2, 25.7, 26.2):
    hit(k, 140, 22, .9, noisy=1.0, lp=2500)
    tone(k, 1900, .25, .08, decay=18)
# sting
s = int(28.6 * SR); tt = np.arange(N - s) / SR
mix[s:] += (np.sin(2 * np.pi * 41 * tt) + .4 * np.sin(2 * np.pi * 61.7 * tt)) * np.exp(-tt * 1.4) * .4

mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= .89 / np.max(np.abs(mix))
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('wrote', sys.argv[1])
