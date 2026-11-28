"""Writes the chosen Women Foundation page into the branch (art-preview): computer = Cinematic, phone = Bento tiles."""
import re, sys, pathlib
sys.path.insert(0, '/home/claude/preview-work')
import importlib, designs_women as D
R = pathlib.Path('/home/claude/mfm-mega-region2')
src = pathlib.Path('/home/claude/preview-work/women.orig.html').read_text()
P = D.parts(src)
# keep the CURRENT message cards from the branch page (sync may have updated them)
cur = (R / 'women.html').read_text()
m = re.search(r'<span class="eyebrow">Messages for women</span>.*?<div class="message-grid">(.*?)</div></div></section>', cur, re.S)
if m: P['cards'] = m.group(1)
html, css = D.final(P)
(R / 'css/women.css').write_text('/* Women Foundation page (Dawn 2026-11-26): computer = Cinematic, phone = Bento tiles. Scoped to main.wf */\n' + css.strip() + '\n')
t = re.sub(r'<main id="content"[^>]*>.*?</main>', lambda _: '<main id="content" class="wf">%s</main>' % html, src, count=1, flags=re.S)
t = re.sub(r'\s*<link rel="stylesheet" href="/css/women\.css[^"]*">', '', t)
t = t.replace('<link rel="stylesheet" href="/css/rf-site.css', '<link rel="stylesheet" href="/css/women.css">\n<link rel="stylesheet" href="/css/rf-site.css', 1) if False else t
i = t.index('<link rel="stylesheet" href="/css/rf-site.css'); j = t.index('>', i) + 1
t = t[:j] + '\n<link rel="stylesheet" href="/css/women.css">' + t[j:]
if '/js/women.js' not in t:
    k = t.index('<script src="/js/mobile-nav.js')
    t = t[:k] + '<script src="/js/women.js" defer></script>\n' + t[k:]
(R / 'women.html').write_text(t)
print('women.html', len(t), 'css', len(css))
