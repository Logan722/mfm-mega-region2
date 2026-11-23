"""Homepage gallery section (option B, approved by Dawn 2026-11-23).

Reads the albums on /gallery (gallery.html, in page order: the first album is the
newest) and writes the homepage section between <!-- home-gallery --> markers:
a large featured card for the newest album (cover, place, title, description,
three small photos, "See the photos" + "All albums") and a row of the other
albums. No photo counts are shown (Dawn's instruction).

Cover photos default to the album's first preview photo; tools/home-gallery.json
can pin a nicer cover per album and the three small photos of the featured
album (key = the album's "See all" link; value = photo file stem).
Called from tools/build_site.py, so the homepage follows the Gallery page by itself.
"""
import html as H
import json
import re

START, END = '<!-- home-gallery -->', '<!-- /home-gallery -->'
ARROW = ('<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" '
         'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
         '<path d="M5 12h14M13 6l6 6-6 6"/></svg>')


def _albums(root):
    t = (root / 'gallery.html').read_text()
    out = []
    for sec in re.findall(r'<section class="gl-album.*?</section>', t, re.S):
        k = re.search(r'class="gl-k">(.*?)</p>', sec, re.S)
        h = re.search(r'<h2>(.*?)</h2>', sec, re.S)
        sub = re.search(r'class="gl-sub">(.*?)</p>', sec, re.S)
        link = re.search(r'href="(/gallery-[^"#?]+)"', sec)
        tiles = re.findall(r'aria-label="View photo: ([^"]*)".*?<img src="(/img/gallery/[^"]+?)-800\.jpg"', sec, re.S)
        if not (h and link and tiles):
            continue
        out.append({'k': (k.group(1).strip() if k else ''), 'title': h.group(1).strip(),
                    'sub': (sub.group(1).strip() if sub else ''), 'href': link.group(1),
                    'photos': [{'alt': a, 'stem': s} for a, s in tiles]})
    return out


def _pic(root, stem, alt, sizes, cls='', eager=False):
    """<picture> with whatever webp widths exist for this photo, jpg 800 fallback."""
    ws = [w for w in (480, 800, 1080, 1600) if (root / (stem.lstrip('/') + f'-{w}.webp')).exists()]
    src = ', '.join(f'{stem}-{w}.webp {w}w' for w in ws)
    srcset = f'<source type="image/webp" srcset="{src}" sizes="{sizes}">' if ws else ''
    c = f' class="{cls}"' if cls else ''
    lz = 'eager' if eager else 'lazy'
    return (f'<picture>{srcset}<img{c} src="{stem}-800.jpg" alt="{alt}" loading="{lz}" '
            f'decoding="async" width="800" height="533"></picture>')


def section(root):
    albums = _albums(root)
    if not albums:
        return None
    try:
        cfg = json.loads((root / 'tools' / 'home-gallery.json').read_text())
    except Exception:
        cfg = {}
    covers = cfg.get('covers', {})
    for a in albums:
        pin = covers.get(a['href'])
        ph = a['photos']
        hit = next((p for p in ph if pin and p['stem'].endswith('/' + pin)), None)
        a['cover'] = hit or ph[0]
        a['rest'] = [p for p in ph if p is not a['cover']]
    f, more = albums[0], albums[1:5]
    want = (cfg.get('thumbs') or {}).get(f['href']) or []
    picked = [p for w in want for p in f['rest'] if p['stem'].endswith('/' + w)]
    picked += [p for p in f['rest'] if p not in picked]
    thumbs = ''.join(_pic(root, p['stem'], H.escape(p['alt'], True), '84px') for p in picked[:3])
    cards = ''.join(
        f'<a href="{a["href"]}">{_pic(root, a["cover"]["stem"], "", "72px")}'
        f'<span><strong>{a["title"]}</strong><small>{a["k"]}</small></span></a>' for a in more)
    return (
        f'{START}<section class="section wrap home-gallery" aria-labelledby="home-gallery-h">'
        '<div class="section-head"><div><p class="eyebrow">Life across the region</p>'
        '<h2 id="home-gallery-h">Worship. Prayer. The Word.</h2></div>'
        '<p>Real moments from across the region — worship, prayer, deliverance and the Word.</p></div>'
        f'<div class="hg-feat"><a class="hg-big" href="{f["href"]}" aria-label="See the photos: {H.escape(f["title"], True)}">'
        f'{_pic(root, f["cover"]["stem"], H.escape(f["cover"]["alt"], True), "(max-width: 900px) 100vw, 680px")}'
        '<span class="hg-tag">Latest album</span></a>'
        f'<div class="hg-txt"><p class="hg-k">{f["k"]}</p><h3><a href="{f["href"]}">{f["title"]}</a></h3>'
        f'<p class="hg-sub">{f["sub"]}</p><div class="hg-th" aria-hidden="true">{thumbs}</div>'
        f'<div class="hg-btns"><a class="hg-btn" href="{f["href"]}">See the photos {ARROW}</a>'
        '<a class="hg-link" href="/gallery">All albums</a></div></div></div>'
        f'<div class="hg-more">{cards}</div></section>{END}')


def build(root, write):
    p = root / 'index.html'
    t = p.read_text()
    new = section(root)
    if not new or START not in t or END not in t:
        return
    i, j = t.index(START), t.index(END) + len(END)
    write('index.html', t[:i] + new + t[j:])
