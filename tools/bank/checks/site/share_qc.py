#!/usr/bin/env python3
"""Link-preview check for the whole site (Dawn, Nov 28 2026: every page and every share button shows its own preview).
Usage: python3 tools/bank/checks/site/share_qc.py [repo]   -> exits 1 on problems.
Checks every served .html page: og:title, og:description, og:image present; the picture exists locally, is
1200x630 (our own pictures) and under 300 KB; no page falls back to the generic site card; every game,
testimony and declaration has its own /play/<id>, /testimonies/<slug>, /declaration/<date> page."""
import json, os, re, sys
from pathlib import Path
from PIL import Image
root = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
sys.path.insert(0, str(root / 'tools' / 'og')); import pages as OG
SKIP = ('tools/', 'node_modules/', '.git/', 'admin/', 'netlify/', 'img/', 'newsletter/sample', 'newsletter/template', 'share/')
SKIPF = {'404.html', 'present.html', '_template.html'}
bad = []
# pages the live site redirects away (ended programmes etc.) are never shown, so they are not checked
gone = set()
for ln in (root / '_redirects').read_text().splitlines():
    a = ln.split()
    if len(a) >= 3 and a[-1].startswith('301') and '=' not in ln and not a[0].endswith('.html'):
        gone.add(a[0].lstrip('/') + '.html')
for p in sorted(root.rglob('*.html')):
    rel = p.relative_to(root).as_posix()
    if rel.startswith(SKIP) or rel in SKIPF or rel in gone: continue
    t = p.read_text(encoding='utf-8', errors='ignore')
    if 'http-equiv="refresh" content="0' in t and 'og:title' not in t: continue
    g = lambda k: (re.search(r'<meta (?:property|name)="%s" content="([^"]*)"' % re.escape(k), t) or [None, None])[1]
    if not (g('og:title') and g('og:description') and g('og:image')): bad.append((rel, 'missing og tags')); continue
    img = g('og:image')
    if 'og-image.png' in img: bad.append((rel, 'generic site card')); continue
    m = re.match(r'https://(?:www\.)?mfmmegaregion2usa\.org/([^?#]+)', img)
    if not m: continue  # YouTube thumbnails etc.
    f = root / m.group(1)
    if not f.exists(): bad.append((rel, 'picture missing ' + m.group(1))); continue
    kb = f.stat().st_size // 1024
    if kb > 300: bad.append((rel, 'picture %d KB (WhatsApp may skip it)' % kb))
    if m.group(1).startswith(('img/og/', 'img/share/')):
        sz = Image.open(f).size
        if sz != (1200, 630): bad.append((rel, 'picture %sx%s' % sz))
for gid in list(OG.GAMES) + ['live']:
    if not (root / 'play' / (gid + '.html')).exists(): bad.append(('play/%s' % gid, 'game link page missing'))
for slug, *_ in OG.testimonies():
    if not (root / 'testimonies' / (slug + '.html')).exists(): bad.append(('testimonies/' + slug, 'testimony link page missing'))
for day in OG.declarations():
    if not (root / 'declaration' / (day + '.html')).exists(): bad.append(('declaration/' + day, 'declaration page missing'))
for js, rx in (('js/today.js', r'/declaration/'), ('js/games.js', r"X\.SITE \+ '/'"), ('js/play2.js', r"SITE \+ '/' \+"), ('js/live.js', r'/play/live')):
    if not re.search(rx, (root / js).read_text()): bad.append((js, 'share link no longer uses its own page'))
print('\n'.join('%s: %s' % b for b in bad) or 'share previews: NO ISSUES')
sys.exit(1 if bad else 0)
