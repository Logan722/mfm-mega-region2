"""Writes the chosen Media library page into the branch art-preview: design 4 (Search first + featured grid),
no 'Start searching' button, and on phones the filters fold under a filter button beside the search strip."""
import re, sys, pathlib
sys.path.insert(0, '/home/claude/preview-work')
import designs_media as M
from designs_women import BASE
R = pathlib.Path('/home/claude/mfm-mega-region2')
cur = (R / 'media.html').read_text()           # keep the latest synced cards/options
src = pathlib.Path('/home/claude/preview-work/media.orig.html').read_text()
P = M.parts(src)
if 'class="wf mx"' in cur:   # take the current library block (cards/options the sync wrote since)
    i = cur.index('<section class="section wrap mlib'); j = cur.index('</section>', cur.index('class="media-more"')) + len('</section>')
    P['lib'] = re.sub(r'^<section class="section wrap mlib[^"]*" id="library">', '<section class="section wrap">', cur[i:j])
html, css = M.m4(P)
(R / 'css/media.css').write_text('/* Media library (Dawn 2026-11-26): design 4, Search first + featured grid; phone filter drop-down. Scoped to main.mx */\n' + (BASE + M.MBASE + css + M.FILTER_CSS).replace('url(img/grain.png)', 'url(/img/grain.png)').strip() + '\n')
(R / 'js/media-filters.js').write_text(M.FILTER_JS)
base = cur if 'class="wf mx"' in cur else src
t = re.sub(r'<main id="content"[^>]*>.*?</main>', lambda _: '<main id="content" class="wf mx">%s</main>' % html, base, count=1, flags=re.S)
if '/css/media.css' not in t:
    i = t.index('<link rel="stylesheet" href="/css/rf-site.css'); j = t.index('>', i) + 1
    t = t[:j] + '\n<link rel="stylesheet" href="/css/media.css">' + t[j:]
if '/js/media-filters.js' not in t:
    k = t.index('<script src="/js/mobile-nav.js')
    t = t[:k] + '<script src="/js/media-filters.js" defer></script>\n' + t[k:]
(R / 'media.html').write_text(t)
print('ok', len(t))
