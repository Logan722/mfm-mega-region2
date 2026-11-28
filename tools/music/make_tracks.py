"""Background music for Play & Grow (Dawn, Nov 28 2026: "soft music playing in the backdrop while they play").
Original music, synthesised here, so there is no licence question. Three styles for Dawn to choose from:
  soft-piano  : slow arpeggiated piano over a warm worship progression
  worship-pad : sustained warm pads that slowly breathe (most "in the background")
  music-box   : a light bell melody (children's games: Noah's Pairs, Bible Stories)
Each is a seamless loop (~64 s), written to audio/play/<name>.mp3 (96 kbps, mono)."""
import numpy as np, subprocess, sys, wave
from pathlib import Path
from scipy.signal import butter, sosfilt, fftconvolve
SR = 44100
ROOT = Path(__file__).resolve().parents[2]
rng = np.random.default_rng(7)

def hz(n):  # MIDI -> Hz
    return 440.0 * 2 ** ((n - 69) / 12)

def lp(x, f, o=2):
    return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)

def reverb(x, secs=2.8, wet=.32, damp=4200):
    n = int(SR * secs); t = np.arange(n) / SR
    ir = rng.standard_normal(n) * np.exp(-t * 6.9 / secs)
    ir = lp(ir, damp); ir /= np.abs(ir).sum() ** .5 * 6
    y = fftconvolve(x, ir)[:len(x) + n]
    out = np.zeros(len(x) + n); out[:len(x)] += x * (1 - wet); out[:len(y)] += y * wet
    return out

def piano(f, dur, vel=.6):
    n = int(SR * dur); t = np.arange(n) / SR; s = np.zeros(n)
    for k in range(1, 9):
        fk = f * k * (1 + .0004 * k * k)
        if fk > 9000: break
        s += (1 / k ** 1.4) * np.exp(-t * (1.1 + .65 * k)) * np.sin(2 * np.pi * fk * t + rng.uniform(0, 6.28))
    att = np.minimum(1, t / .006)
    return lp(s * att * vel, 3800)

def bell(f, dur, vel=.5):
    n = int(SR * dur); t = np.arange(n) / SR; s = np.zeros(n)
    for r, a, d in ((1, 1, 1.8), (2.0, .25, 3), (3.01, .12, 4.5), (4.16, .06, 6)):
        s += a * np.exp(-t * d) * np.sin(2 * np.pi * f * r * t)
    return s * np.minimum(1, t / .003) * vel

def pad(fs, dur, vel=.22):
    n = int(SR * dur); t = np.arange(n) / SR; s = np.zeros(n)
    for f in fs:
        for det in (-.004, 0, .0045):
            ph = np.cumsum(np.full(n, f * (1 + det)) / SR)
            s += 2 * (ph % 1) - 1  # saw
    s = lp(s / (len(fs) * 3), 700, 4)
    env = np.minimum(1, t / 2.2) * np.minimum(1, (dur - t) / 2.6).clip(0)
    lfo = 1 + .08 * np.sin(2 * np.pi * .11 * t)
    return s * env * lfo * vel

def place(buf, x, at):
    i = int(at * SR); j = min(len(buf), i + len(x)); buf[i:j] += x[:j - i]

# D major worship progression: D - Bm - G - A (twice), then G - D/F# - Em - A
CH = [[50, 57, 62, 66], [47, 54, 59, 62], [43, 50, 55, 59], [45, 52, 57, 61],
      [50, 57, 62, 66], [47, 54, 59, 62], [43, 50, 55, 59], [45, 52, 57, 61],
      [43, 50, 55, 59], [42, 50, 54, 57], [40, 47, 52, 55], [45, 52, 57, 61],
      [43, 50, 55, 59], [42, 50, 54, 57], [40, 47, 52, 55], [45, 49, 52, 57]]
BAR = 4.0  # seconds per chord -> 64 s loop

def soft_piano():
    L = len(CH) * BAR; buf = np.zeros(int(SR * (L + 4)))
    for i, c in enumerate(CH):
        t0 = i * BAR
        place(buf, piano(hz(c[0] - 12), 3.9, .55), t0)
        arp = [c[1], c[2], c[3], c[2] + 12, c[3], c[2]]
        for k, nt in enumerate(arp):
            place(buf, piano(hz(nt + 12), 2.6, .32 if k else .38), t0 + k * (BAR / 6) + rng.uniform(-.01, .01))
    return buf, L

def worship_pad():
    L = len(CH) * BAR; buf = np.zeros(int(SR * (L + 6)))
    for i, c in enumerate(CH):
        place(buf, pad([hz(n) for n in c], BAR + 2.6), i * BAR - 1.3 if i else 0)
        if i % 2 == 0:
            place(buf, piano(hz(c[3] + 12), 3.5, .12), i * BAR + 1.0)
    return buf, L

MEL = [74, 76, 78, 76, 74, 71, 74, None, 71, 74, 76, 74, 71, 69, 71, None,
       67, 69, 71, 74, 76, 74, 71, None, 69, 71, 73, 76, 74, None, 69, None]
def music_box():
    L = 64.0; buf = np.zeros(int(SR * (L + 4))); step = L / (len(MEL) * 2)
    for rep in range(2):
        for k, nt in enumerate(MEL):
            if nt: place(buf, bell(hz(nt + 12), 2.2, .42), (rep * len(MEL) + k) * step)
    for i, c in enumerate(CH):
        place(buf, bell(hz(c[0]), 3.8, .2), i * BAR)
    return buf, L

def loopify(buf, L):
    """fold the reverb tail back to the start so the loop has no gap or click"""
    n = int(SR * L); out = buf[:n].copy(); tail = buf[n:]
    out[:len(tail)] += tail
    return out

def write(name, y):
    y = y / (np.abs(y).max() + 1e-9) * .5   # quiet master: it sits under the game
    pcm = (y * 32767).astype('<i2')
    wav = Path('/tmp/%s.wav' % name)
    with wave.open(str(wav), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    out = ROOT / 'audio' / 'play' / ('%s.mp3' % name); out.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(wav), '-ac', '1', '-b:a', '96k', str(out)], check=True)
    print(name, out.stat().st_size // 1024, 'KB')

if __name__ == '__main__':
    for name, fn, rv in (('soft-piano', soft_piano, (2.6, .30)), ('worship-pad', worship_pad, (3.4, .38)), ('music-box', music_box, (2.2, .28))):
        b, L = fn(); b = reverb(b, *rv)
        write(name, loopify(b, L))
