"""Writes the chosen About page (design 5, Bento tiles; Dawn 2026-11-27) into the branch art-preview."""
import re, sys, pathlib
sys.path.insert(0, '/home/claude/preview-work')
import designs_about as A
from designs_women import BASE
R = pathlib.Path('/home/claude/mfm-mega-region2')
src = pathlib.Path('/home/claude/preview-work/about.orig.html').read_text()
P = A.parts(src)
html, css = A.a5(P)
html = re.sub(r'src="img/', 'src="/img/', html)
(R / 'css/about.css').write_text('/* About page (Dawn 2026-11-27): design 5, Bento tiles + leader pop-ups. Scoped to main.wf.ab */\n' + (BASE + A.ABASE + css).replace('url(img/grain.png)', 'url(/img/grain.png)').strip() + '\n')
t = re.sub(r'<main id="content"[^>]*>.*?</main>', lambda _: '<main id="content" class="wf ab">%s</main>' % html, src, count=1, flags=re.S)
i = t.index('<link rel="stylesheet" href="/css/rf-site.css'); j = t.index('>', i) + 1
t = t[:j] + '\n<link rel="stylesheet" href="/css/about.css">' + t[j:]
k = t.index('<script src="/js/mobile-nav.js')
t = t[:k] + '<script src="/js/women.js" defer></script>\n' + t[k:]
(R / 'about.html').write_text(t)
print('ok', len(t))
