"""Private preview (Claude artifact) built from the REAL pages in the local branch (art-preview), plus
preview-only design options (designs.py) and a share-preview page. Nothing here is deployed."""
import re, shutil, pathlib, json, sys
sys.path.insert(0, '/home/claude/preview-work')
import designs

R = pathlib.Path('/home/claude/mfm-mega-region2')
OUT = pathlib.Path('/home/claude/artifact-home')
SITE = 'https://mfmmegaregion2usa.org'
YT_LOCAL = 'img/yt/latest.jpg'
if OUT.exists(): shutil.rmtree(OUT)
OUT.mkdir(parents=True)
ASSET = re.compile(r'(?<![\w.:/-])/?((?:css|js|img)/[\w./%-]+?\.(?:css|js|json|png|jpe?g|webp|svg|mp4|ico|gif))(?![\w])')

def rel_assets(t):
    t = re.sub(r'((?:href|src)=")/((?:css|js)/[\w.\-]+\.(?:css|js))\?v=\w+"', r'\1\2"', t)
    t = re.sub(r'(["\'(\s,=])/((?:css|js|img|data)/)', r'\1\2', t)
    return t

SUBJ = {'prayer': 'prayer', 'testimony': 'testimony', 'contact': 'general', 'general': 'general'}
def page_links(t):
    t = re.sub(r'href="/reach-out/(prayer|testimony|contact|general)(?:\?[^"]*)?"', lambda m: 'href="reach-out.html#%s"' % SUBJ[m.group(1)], t)
    t = re.sub(r'href="/reach-out(?:\?subject=(\w+))?"', lambda m: 'href="reach-out.html%s"' % ('#' + m.group(1) if m.group(1) else ''), t)
    t = re.sub(r'href="/play(#[\w-]+)?"', lambda m: 'href="play.html%s"' % (m.group(1) or ''), t)
    t = re.sub(r'href="/testimonies"', 'href="testimonies.html"', t)
    t = re.sub(r'href="/(about|women|gen218|ministries|live|media|gallery|privacy|subscribe)(#[\w-]+)?"', lambda m: 'href="%s.html%s"' % (m.group(1), m.group(2) or ''), t)
    t = t.replace('href="/#', 'href="index.html#').replace('href="/"', 'href="index.html"')
    t = re.sub(r'href="/(?!/)([^"]*)"', lambda m: 'href="%s/%s"' % (SITE, m.group(1)), t)
    t = re.sub(r'action="/([^"]*)"', lambda m: 'action="%s/%s"' % (SITE, m.group(1)), t)
    return t

def clean_head(t):
    t = re.sub(r'<meta http-equiv="Content-Security-Policy"[^>]*>', '', t)
    t = re.sub(r'<script[^>]*plausible[^>]*></script>\s*(<script>window\.plausible[^<]*</script>)?', '', t)
    t = re.sub(r'<script src="/js/sw-register\.js[^"]*"[^>]*></script>', '', t)
    t = re.sub(r'<link rel="manifest"[^>]*>', '', t)
    t = re.sub(r"if\('serviceWorker' in navigator\)[^\n]*\n", '', t)
    return t

MENU = '''<div class="pv-menu"><b>Preview</b><a href="index.html">Home</a><a href="play.html">Play &amp; Grow</a><a href="testimonies.html">Testimonies</a><a href="testimonies-full.html">Testimonies (when full)</a><a href="reach-out.html">Reach Out</a></div>
<style>.pv-menu{position:fixed;left:14px;top:96px;z-index:9998;display:flex;flex-direction:column;gap:2px;background:rgba(20,34,64,.94);border:1px solid rgba(240,199,96,.45);border-radius:12px;padding:10px 12px;font:600 12.5px "Inter Tight",sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.3)}
.pv-menu b{color:#f0c760;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;margin-bottom:4px}.pv-menu a{color:#fff;text-decoration:none;padding:3px 0}.pv-menu a:hover{color:#f0c760}
@media(max-width:900px){.pv-menu{top:auto;bottom:74px;left:10px;flex-direction:row;flex-wrap:wrap;gap:8px;max-width:calc(100vw - 20px);padding:8px 10px}.pv-menu b{display:none}}</style>'''
SHIM = '''<script>(function(){var mv=/mv-([abc])/.exec(location.hash);var s=document.querySelector('.tsa');if(mv&&s)s.setAttribute('data-mv',mv[1]);})();</script><script>(function(){document.addEventListener('submit',function(e){var f=e.target;if(!f||!f.matches||!f.matches('#reachForm'))return;e.preventDefault();e.stopImmediatePropagation();
var n=document.getElementById('pv-sent');if(!n){n=document.createElement('p');n.id='pv-sent';n.style.cssText='margin:14px 0 0;font:600 14px Inter Tight,sans-serif;color:#a84a20';f.appendChild(n);}n.textContent='Preview only: this form does not send. On the website it goes to the ministry team.';},true);})();</script>'''

import hashlib, subprocess
EXT = OUT / 'img' / 'ext'
def localize(t):
    def rep(mm):
        url = mm.group(2)
        name = hashlib.sha1(url.encode()).hexdigest()[:12] + '.jpg'
        cache = pathlib.Path('/home/claude/preview-work/extcache') / name
        cache.parent.mkdir(exist_ok=True)
        if not cache.exists():
            subprocess.run(['curl', '-s', '-L', '--max-time', '15', '-o', str(cache), url])
        if cache.exists() and cache.stat().st_size > 1000:
            EXT.mkdir(parents=True, exist_ok=True); shutil.copy2(cache, EXT / name)
            return mm.group(1) + 'img/ext/' + name + '"'
        return mm.group(0)
    return re.sub(r'((?:src|data-src)=")(https://(?:img\.youtube\.com|i\.ytimg\.com|mfmmegaregion2yc\.org)/[^"]+)"', rep, t)
def process(t, fname):
    t = localize(t)
    t = clean_head(t); t = rel_assets(t); t = page_links(t)
    t = re.sub(r'src="https://i\.ytimg\.com/vi/[\w-]+/maxresdefault\.jpg"', f'src="{YT_LOCAL}"', t)
    t = t.replace("var s=(new URLSearchParams(location.search).get('subject')||(location.hash||'').slice(1)||'').toLowerCase();",
                  "var s=((location.hash||'').slice(1)||new URLSearchParams(location.search).get('subject')||'').toLowerCase();")
    t = t.replace("sub=p.get('subject')", "sub=((location.hash||'').slice(1)||p.get('subject'))")
    t = t.replace('</body>', SHIM + '\n</body>', 1)
    return t

pages = {'index.html': (R / 'index.html').read_text(), 'play.html': (R / 'play.html').read_text()}
import designs_t2 as D
_t = (R / 'testimonies.html').read_text()
pages['testimonies.html'] = _t
pages['reach-out.html'] = (R / 'reach-out.html').read_text()
for _p in ['about.html', 'women.html', 'gen218.html', 'ministries.html', 'live.html', 'media.html', 'privacy.html', 'subscribe.html']:
    pages[_p] = (R / _p).read_text()


# share previews page: the cards + titles exactly as WhatsApp / Facebook will show them
from html.parser import HTMLParser
def meta(path):
    t = (R / path).read_text(); g = lambda k: (re.search(r'<meta property="og:%s" content="([^"]*)"' % k, t) or [None, ''])[1]
    return g('title'), g('description'), g('image').replace(SITE + '/', '')
rows = []
for label, path, url in [('Play &amp; Grow', 'play.html', '/play'), ('Testimonies', 'testimonies.html', '/testimonies'), ('Reach Out', 'reach-out.html', '/reach-out'),
                         ('Request prayer button', 'reach-out/prayer.html', '/reach-out/prayer'), ('Share a testimony button', 'reach-out/testimony.html', '/reach-out/testimony'), ('Contact us button', 'reach-out/contact.html', '/reach-out/contact')]:
    ti, de, im = meta(path)
    rows.append('<div class="row"><span class="lab">%s</span><div class="bub"><div class="pv"><img src="%s" alt=""><div class="tx"><b>%s</b><span>%s</span><small>mfmmegaregion2usa.org</small></div></div><a>https://mfmmegaregion2usa.org%s</a><i>9:41 PM ✓✓</i></div></div>' % (label, im, ti, de, url))
share = '''<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Share previews</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&family=Inter+Tight:wght@400;600;700&display=swap" rel="stylesheet">
<style>body{margin:0;background:#0b141a;font-family:"Inter Tight",sans-serif;color:#e9edef}.hd{background:#142240;padding:34px 20px;text-align:center}.hd h1{font:500 clamp(28px,4vw,44px) Fraunces,serif;margin:0 0 8px;color:#fff}.hd p{margin:0 auto;max-width:640px;color:#c9d3e3;line-height:1.6}
.chat{max-width:620px;margin:0 auto;padding:26px 14px 120px;background:#0b141a}.row{margin:0 0 26px}.lab{display:block;text-align:center;font:700 11px "Inter Tight";letter-spacing:.16em;text-transform:uppercase;color:#f0c760;margin-bottom:8px}
.bub{margin-left:auto;max-width:430px;background:#005c4b;border-radius:10px 2px 10px 10px;padding:4px 4px 6px;box-shadow:0 1px 1px rgba(0,0,0,.3)}.pv{background:#025144;border-radius:8px;overflow:hidden}.pv img{display:block;width:100%;aspect-ratio:1200/630;object-fit:cover}
.tx{padding:8px 10px 10px;display:flex;flex-direction:column;gap:3px}.tx b{font-size:14.5px;color:#e9edef}.tx span{font-size:13px;color:#c7d2cf;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.tx small{font-size:12px;color:#9fb4ae}
.bub a{display:block;padding:6px 8px 0;color:#53bdeb;font-size:14px;word-break:break-all}.bub i{display:block;text-align:right;font-style:normal;font-size:11px;color:#9fc7bd;padding:2px 8px 0}</style></head><body>
<div class="hd"><h1>How the links look when shared</h1><p>WhatsApp shown here. Facebook, Messenger, iMessage and most email apps use the same picture, title and description. Each Reach Out button now has its own address and its own preview.</p></div>
<div class="chat">@@ROWS@@</div></body></html>'''.replace('@@ROWS@@', ''.join(rows))

for f, t in pages.items():
    (OUT / f).write_text(process(t, f))

need, seen = set(), set()
def scan(text):
    for m in ASSET.finditer(text): need.add(m.group(1).split('?')[0])
for f in pages: scan((OUT / f).read_text())
need |= {'img/grain.png'}
for f in pages:
    for m in re.finditer(r'src="(img/[^"]+\.(?:webp|jpe?g|png))"', (OUT / f).read_text()): need.add(m.group(1))
changed = True
while changed:
    changed = False
    for a in sorted(need - seen):
        seen.add(a); src = R / a
        if a.endswith(('.css', '.js', '.json')) and src.exists():
            before = len(need); scan(src.read_text(errors='ignore')); changed |= len(need) > before
for a in sorted(need):
    src = R / a
    if not src.exists(): continue
    (OUT / a).parent.mkdir(parents=True, exist_ok=True)
    if a.endswith(('.css', '.js')):
        txt = src.read_text()
        if a.endswith('.css'): txt = txt.replace('url(/img/', 'url(../img/')
        txt = rel_assets(txt)
        if a == 'js/newsletter-popup.js':
            txt = txt.replace("routes: /^\\/(index(\\.html)?|events(\\.html)?|gallery(\\.html)?)?$/,", "routes: /(^|\\/)(index\\.html)?$|^\\/[^.]*$/,")
            txt = txt.replace('"/privacy"', '"%s/privacy"' % SITE)
            txt = txt.replace("endpoint: '/.netlify/functions/subscribe',", "endpoint: 'data:application/json,%7B%22ok%22%3Afalse%2C%22error%22%3A%22preview%22%7D',")
            txt = txt.replace("'Something went wrong. Please try again in a moment.'", "'Preview only: sign-ups are not sent from this preview.'")
        if a == 'js/today.js':
            txt = txt.replace("fetch('/data/declarations.json'", "fetch('data/declarations.json'")
        (OUT / a).write_text(txt)
    else:
        shutil.copy2(src, OUT / a)
(OUT / 'data').mkdir(exist_ok=True); shutil.copy2(R / 'data/declarations.json', OUT / 'data/declarations.json')
qd = OUT / 'js/quiz'; qd.mkdir(parents=True, exist_ok=True)
for f in (R / 'js/quiz').glob('*.json'): shutil.copy2(f, qd / f.name)
gd = OUT / 'js/games'; gd.mkdir(parents=True, exist_ok=True)
for f in (R / 'js/games').glob('*.json'): shutil.copy2(f, gd / f.name)
pj = OUT / 'js/play2.js'
if pj.exists(): pj.write_text(pj.read_text().replace("fetch('/js/quiz/'", "fetch('js/quiz/'").replace("var LB_URL = '/.netlify/functions/leaderboard'", "var LB_URL = 'about:blank'"))
for f in pages:
    p = OUT / f; p.write_text(p.read_text().replace('fetch("/.netlify/functions/leaderboard")', 'fetch("about:blank")'))
(OUT / 'img/yt').mkdir(parents=True, exist_ok=True); shutil.copy2('/tmp/yt2.jpg', OUT / YT_LOCAL)
files = [p for p in OUT.rglob('*') if p.is_file()]
print('files', len(files), 'MB', round(sum(p.stat().st_size for p in files) / 1e6, 2))
print('missing', sorted(a for a in need if not (R / a).exists())[:20])
json.dump(sorted(str(p.relative_to(OUT)) for p in files), open('/home/claude/preview-work/artifact-files.json', 'w'))
# Bible Stories chapter pages (self-contained; the back link switches to ../play.html in the preview)
(OUT / 'stories').mkdir(exist_ok=True)
for f in (R / 'stories').glob('*.html'): shutil.copy2(f, OUT / 'stories' / f.name)
