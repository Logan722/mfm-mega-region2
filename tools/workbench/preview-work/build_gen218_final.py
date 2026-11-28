"""Writes the chosen Gen218 page (design 5, Bento tiles) into the branch art-preview."""
import re, sys, pathlib
sys.path.insert(0, '/home/claude/preview-work')
import designs_gen218 as G
from designs_women import BASE
R = pathlib.Path('/home/claude/mfm-mega-region2')
src = pathlib.Path('/home/claude/preview-work/gen218.orig.html').read_text()
cur = (R / 'gen218.html').read_text()
P = G.parts(src)
P['block'] = cur[cur.index(G.GS):cur.index(G.GE) + len(G.GE)]   # keep whatever the sync last wrote
html, css = G.g5(P)
(R / 'css/gen218.css').write_text('/* Gen218 page (Dawn 2026-11-26): design 5, Bento tiles. Scoped to main.gf */\n' + (BASE + G.GBASE + css).replace('url(img/grain.png)', 'url(/img/grain.png)').strip() + '\n')
t = re.sub(r'<main id="content"[^>]*>.*?</main>', lambda _: '<main id="content" class="wf gf">%s</main>' % html, src, count=1, flags=re.S)
i = t.index('<link rel="stylesheet" href="/css/rf-site.css'); j = t.index('>', i) + 1
t = t[:j] + '\n<link rel="stylesheet" href="/css/gen218.css">' + t[j:]
(R / 'gen218.html').write_text(t)
print('ok', len(t))
