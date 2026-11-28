"""Build the Claude-artifact copy of the private preview (no Netlify push needed).
Input : the generated preview-*.html in the repo working copy (made by make_hidden.py)
Output: /home/claude/artifact-home/  (index.html, play.html, testimonies.html, reach-out.html, message.html + assets)
Rules : the artifact may load only its own files (relative paths), Google Fonts and a few CDNs.
        Remote images, fetch to other hosts, form posts, service workers and query strings don't work.
"""
import re, shutil, pathlib, json

R = pathlib.Path('/home/claude/mfm-mega-region2')
OUT = pathlib.Path('/home/claude/artifact-home')
SITE = 'https://mfmmegaregion2usa.org'
PAGES = {'preview-home': 'index.html', 'preview-play': 'play.html', 'preview-testimonies': 'testimonies.html',
         'preview-reach-out': 'reach-out.html', 'preview-message': 'message.html'}
YT_LOCAL = 'img/yt/latest.jpg'

if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir(parents=True)

ASSET = re.compile(r'(?<![\w.:/-])/?((?:css|js|img)/[\w./%-]+?\.(?:css|js|json|png|jpe?g|webp|svg|mp4|ico|gif))(?![\w])')


def rel_assets(t):
    # "/css/x.css?v=.." -> "css/x.css" ; "/img/.." -> "img/.."
    t = re.sub(r'((?:href|src)=")/((?:css|js)/[\w.\-]+\.(?:css|js))\?v=\w+"', r'\1\2"', t)
    t = re.sub(r'(["\'(\s,=])/((?:css|js|img)/)', r'\1\2', t)
    return t


def page_links(t):
    for slug, f in PAGES.items():
        t = re.sub(r'href="/%s\?subject=(\w+)"' % slug, r'href="%s#\1"' % f, t)
        t = re.sub(r'href="/%s(#[\w-]+)?"' % slug, lambda m: 'href="%s%s"' % (f, m.group(1) or ''), t)
    t = t.replace('href="/#', 'href="index.html#').replace('href="/"', 'href="index.html"')
    # every other site link opens the real website
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


# small runtime shims for the artifact frame
SHIM = '''<script>/* artifact shims: open external forms in a new tab; reach-out subject from #hash */
(function(){
 document.addEventListener('submit',function(e){var f=e.target;if(!f||!f.action||f.action.indexOf('%s')!==0)return;e.preventDefault();
  var q=new URLSearchParams(new FormData(f)).toString();var a=document.createElement('a');a.href=f.action+(q?'?'+q:'');a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();},true);
})();</script>''' % SITE

for slug, fname in PAGES.items():
    t = (R / f'{slug}.html').read_text()
    t = clean_head(t)
    t = rel_assets(t)
    t = page_links(t)
    # the live YouTube thumbnail can't load inside an artifact: use a bundled copy
    t = re.sub(r'src="https://i\.ytimg\.com/vi/[\w-]+/maxresdefault\.jpg"', f'src="{YT_LOCAL}"', t)
    # reach-out subject comes from #prayer etc. (query strings don't reach the artifact)
    t = t.replace("var s=(new URLSearchParams(location.search).get('subject')||'').toLowerCase();",
                  "var s=((location.hash||'').slice(1)||new URLSearchParams(location.search).get('subject')||'').toLowerCase();")
    t = t.replace('</body>', SHIM + '\n</body>', 1)
    t = t.replace('<title>Private preview — Homepage', '<title>Homepage preview')
    (OUT / fname).write_text(t)

# copy every asset the pages, scripts and styles reference (follow css/js once)
need, seen = set(), set()
def scan(text):
    for m in ASSET.finditer(text):
        need.add(m.group(1).split('?')[0])
for f in PAGES.values():
    scan((OUT / f).read_text())
changed = True
while changed:
    changed = False
    for a in sorted(need - seen):
        seen.add(a)
        src = R / a
        if a.endswith(('.css', '.js', '.json')) and src.exists():
            before = len(need); scan(src.read_text(errors='ignore')); changed |= len(need) > before
for a in sorted(need):
    src = R / a
    if src.exists():
        (OUT / a).parent.mkdir(parents=True, exist_ok=True)
        if a.endswith(('.css', '.js')):
            txt = rel_assets(src.read_text())
            if a == 'js/newsletter-popup-preview.js':
                txt = txt.replace('routes: /^\\/preview-home(\\.html)?$/,', 'routes: /(^|\\/)(index\\.html)?$|^\\/[^.]*$/,')
                txt = txt.replace('"/privacy"', '"%s/privacy"' % SITE)
            if a == 'js/newsletter-popup.js':
                # artifact: show on its homepage, privacy link to the real site, never send a sign-up from the preview
                txt = txt.replace("routes: /^\\/(index(\\.html)?|events(\\.html)?|gallery(\\.html)?)?$/,", "routes: /(^|\\/)(index\\.html)?$|^\\/[^.]*$/,")
                txt = txt.replace('"/privacy"', '"%s/privacy"' % SITE)
                txt = txt.replace("endpoint: '/.netlify/functions/subscribe',", "endpoint: 'data:application/json,%7B%22ok%22%3Afalse%2C%22error%22%3A%22preview%22%7D',")
                txt = txt.replace("'Something went wrong. Please try again in a moment.'", "'Preview only: sign-ups are not sent from this preview.'")
            if a == 'js/play.js':
                txt = txt.replace("fetch('js/quiz-bank.json', { cache: 'no-cache' })", "fetch('js/quiz-bank.json')")
            (OUT / a).write_text(txt)
        else:
            shutil.copy2(src, OUT / a)
# Play & Grow lazy question packs (loaded by name at run time, so the scanner can't see them)
qd = OUT / 'js/quiz'; qd.mkdir(parents=True, exist_ok=True)
for f in (R / 'js/quiz').glob('*.json'): shutil.copy2(f, qd / f.name)
pj = OUT / 'js/play2.js'
if pj.exists(): pj.write_text(pj.read_text().replace("fetch('/js/quiz/'", "fetch('js/quiz/'").replace("var LB_URL = '/.netlify/functions/leaderboard'", "var LB_URL = 'about:blank'"))
# the artifact has no server: the leaderboard falls back to this device's own scores
for _f in PAGES.values():
    _p = OUT / _f; _p.write_text(_p.read_text().replace('fetch("/.netlify/functions/leaderboard")', 'fetch("about:blank")'))
# bundled YouTube thumbnail
(OUT / 'img/yt').mkdir(parents=True, exist_ok=True)
shutil.copy2('/tmp/yt.jpg', OUT / YT_LOCAL)
missing = sorted(a for a in need if not (R / a).exists())
files = [p for p in OUT.rglob('*') if p.is_file()]
print('files', len(files), 'MB', round(sum(p.stat().st_size for p in files) / 1e6, 2))
print('missing', missing[:20])
json.dump(sorted(str(p.relative_to(OUT)) for p in files), open('/home/claude/preview-work/artifact-files.json', 'w'))
