#!/usr/bin/env python3
"""Responsive image variants (audit C-01 / C-03). For each source JPEG/PNG writes
   <name>-<w>.webp for every requested width (never upscaling) and <name>-<fallback>.jpg.
   Prints a JSON manifest {source: {"w":..,"h":..,"variants":{...}}}.
   Usage: make_variants.py --widths 480,800,1600 --fallback 800 file1.jpg file2.jpg ...
   Originals are left untouched (they stay the full-quality source)."""
import argparse, json, os, sys
from PIL import Image, ImageOps

ap = argparse.ArgumentParser()
ap.add_argument('--widths', default='480,800,1600')
ap.add_argument('--fallback', type=int, default=800)
ap.add_argument('--quality', type=int, default=74)
ap.add_argument('files', nargs='+')
a = ap.parse_args()
widths = [int(x) for x in a.widths.split(',')]
manifest = {}
for f in a.files:
    im = ImageOps.exif_transpose(Image.open(f)).convert('RGB')
    W, H = im.size
    base, _ = os.path.splitext(f)
    out = {}
    for w in sorted(set([min(x, W) for x in widths])):
        h = round(H * w / W)
        r = im if w == W else im.resize((w, h), Image.LANCZOS)
        p = '%s-%d.webp' % (base, w)
        r.save(p, 'WEBP', quality=a.quality, method=6)
        out['webp%d' % w] = [p, w, h, os.path.getsize(p)]
    fw = min(a.fallback, W); fh = round(H * fw / W)
    r = im if fw == W else im.resize((fw, fh), Image.LANCZOS)
    p = '%s-%d.jpg' % (base, fw)
    r.save(p, 'JPEG', quality=80, optimize=True, progressive=True)
    out['jpg%d' % fw] = [p, fw, fh, os.path.getsize(p)]
    manifest[f] = {'w': W, 'h': H, 'bytes': os.path.getsize(f), 'variants': out}
json.dump(manifest, sys.stdout, indent=1)
