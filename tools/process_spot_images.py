#!/usr/bin/env python3
"""Jahhat Media - spot photo processor.
Black & white + grunge (default 50% strength) + crop to 4:3 (800x600).

Usage:
  pip install pillow numpy scipy
  python tools/process_spot_images.py raw_photos/ assets/spots/ [--strength 0.5] [--grunge my-grunge.png]

Put your downloaded photos in raw_photos/ named after the slug in
tools/spots-image-list.csv (e.g. skatepark-labuan.jpg / .png / .webp).
Output: assets/spots/<slug>.jpg
--grunge lets you use a texture of your own (e.g. the pngegg one, if its licence suits you);
without it, a grunge texture is generated automatically.
"""
import argparse, os, sys
import numpy as np
from PIL import Image, ImageOps, ImageFilter
from scipy import ndimage as nd

W, H = 800, 600

def make_grunge(seed=7):
    """Procedural grunge: 0 = dirt/scratch (dark), 1 = clean. Returns float array HxW."""
    rng = np.random.default_rng(seed)
    g = np.zeros((H, W))
    for sigma, amp in ((60, .5), (20, .35), (6, .25), (1.2, .18)):
        n = nd.gaussian_filter(rng.standard_normal((H, W)), sigma)
        g += amp * (n - n.mean()) / n.std()
    g = (g - g.min()) / (g.max() - g.min())
    blotch = np.clip((g - .5) * 3 + .5, 0, 1)            # high-contrast stains
    speck = (rng.random((H, W)) > .9965).astype(float)
    speck = nd.gaussian_filter(speck, .8) * 6
    scr = np.zeros((H, W))
    for _ in range(40):                                  # scratches
        x, y = rng.integers(0, W), rng.integers(0, H)
        L = rng.integers(40, 260); a = rng.normal(0, .5)
        for t in range(L):
            xx, yy = int(x + t * np.cos(a)), int(y + t * np.sin(a))
            if 0 <= xx < W and 0 <= yy < H: scr[yy, xx] = 1
    scr = nd.gaussian_filter(scr, .6) * 2
    clean = 1 - .75 * (1 - blotch) * .9 - np.clip(speck, 0, 1) * .8 - np.clip(scr, 0, 1) * .4
    return np.clip(clean, 0, 1)

def load_grunge(path):
    if not path: return make_grunge()
    im = ImageOps.fit(Image.open(path).convert('L'), (W, H))
    a = np.asarray(im, float) / 255
    return a

def process(src, dst, grunge, strength):
    im = ImageOps.exif_transpose(Image.open(src)).convert('L')
    im = ImageOps.fit(im, (W, H), Image.LANCZOS)
    im = ImageOps.autocontrast(im, cutoff=1)
    a = np.asarray(im, float) / 255
    a = np.clip((a - .5) * 1.15 + .5, 0, 1)              # punchier contrast
    grunged = a * grunge                                 # multiply texture
    out = a * (1 - strength) + grunged * strength        # strength = blend amount
    out += (np.random.default_rng(1).standard_normal((H, W)) * .02 * strength)  # film grain
    Image.fromarray((np.clip(out, 0, 1) * 255).astype('uint8')).save(dst, quality=85)

def main():
    p = argparse.ArgumentParser()
    p.add_argument('src'); p.add_argument('dst')
    p.add_argument('--strength', type=float, default=.5)
    p.add_argument('--grunge')
    o = p.parse_args()
    os.makedirs(o.dst, exist_ok=True)
    gr = load_grunge(o.grunge); n = 0
    for f in sorted(os.listdir(o.src)):
        base, ext = os.path.splitext(f)
        if ext.lower() not in ('.jpg', '.jpeg', '.png', '.webp'): continue
        process(os.path.join(o.src, f), os.path.join(o.dst, base + '.jpg'), gr, o.strength)
        n += 1; print('done', base)
    print(n, 'image(s) processed')

if __name__ == '__main__': main()
