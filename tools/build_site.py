#!/usr/bin/env python3
"""MFM Mega Region 2 — static build step (run locally before each release; output is committed).

Writes every no-JavaScript fallback from the single source js/events-data.js so static HTML can
never disagree with the runtime (audit A-04, A-06, A-07, A-08, D-01, D-10, B-13 dock text):
  * Events page grid, Women + Gen218 programme grids, homepage "Next regional gathering" dock
  * Event detail pages: When line, schema.org Event, timed Add-to-Calendar, ticket button,
    expiry guard; creates a page for any upcoming event that has "page" but no file yet
  * Redirects (_redirects) for detail/share pages of programmes that have ended
  * sitemap.xml with real lastmod dates

Usage:  python3 tools/build_site.py [--now ISO8601]
Requires node (for tools/events-snapshot.js) and Pillow (image dimensions).
"""
import html, json, os, re, subprocess, sys, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://mfmmegaregion2usa.org'
NOW = None
if '--now' in sys.argv:
    NOW = sys.argv[sys.argv.index('--now') + 1]

def snapshot():
    cmd = ['node', str(ROOT / 'tools' / 'events-snapshot.js')] + ([NOW] if NOW else [])
    return json.loads(subprocess.run(cmd, check=True, capture_output=True, text=True).stdout)

def esc(s):
    return html.escape(str(s or ''), quote=True)

def img_size(rel):
    try:
        from PIL import Image
        with Image.open(ROOT / rel) as im:
            return im.size
    except Exception:
        return None

def find_block(t, open_idx, tag='div'):
    """Return end index (exclusive) of the element starting at open_idx (balanced matching)."""
    depth, i = 0, open_idx
    rx = re.compile(r'<(/?)%s\b[^>]*>' % tag)
    for m in rx.finditer(t, open_idx):
        depth += -1 if m.group(1) else 1
        if depth == 0:
            return m.end()
    raise ValueError('unbalanced <%s>' % tag)

def replace_inner(t, start_tag_idx, new_inner, tag='div'):
    end = find_block(t, start_tag_idx, tag)
    open_end = t.index('>', start_tag_idx) + 1
    close_start = t.rindex('</%s>' % tag, start_tag_idx, end)
    return t[:open_end] + new_inner + t[close_start:]

ARROW = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'

def href_of(e):
    return e.get('page') or '/events'

def when_of(e):
    t = e.get('time') or ''
    d = e.get('dateDisplay') or e.get('date')
    return d + (' · ' + t if t and t not in d else '')

def card(e, badge):
    w_h = img_size(e['image'])
    dims = ' width="%d" height="%d"' % w_h if w_h else ''
    h = esc(href_of(e))
    return ('<article class="event-card"><a class="event-card-image" href="%s"><img src="%s" alt="%s" loading="lazy" decoding="async"%s><span>%s</span></a>'
            '<div><small>%s</small><h3><a href="%s">%s</a></h3><p>%s</p><div class="event-card-actions"><a class="inline-link" href="%s">Event details %s</a></div></div></article>'
            % (h, esc('/' + e['image'].lstrip('/')), esc(e.get('alt') or e['title']), dims, esc(badge), esc(e.get('dateDisplay') or e['date']),
               h, esc(e['title']), esc(e.get('venue')), h, ARROW))

def dock_loc(e):
    v = e.get('venue') or ''
    if re.search(r'zoom|online', v, re.I):
        return 'Online'
    m = re.search(r"([A-Za-z.\-' ]+,\s*[A-Z]{2})", v)
    return m.group(1).strip() if m else ''

changed = []
def write(path, text):
    p = ROOT / path
    old = p.read_text() if p.exists() else None
    if old != text:
        p.write_text(text)
        changed.append(path)

def build_grids(ev):
    # Women + Gen218 programme grids (section is hidden at runtime when empty)
    for page, ministry, badge in (('women.html', 'women', 'Women'), ('gen218.html', 'gen218', 'Gen218')):
        t = (ROOT / page).read_text()
        i = t.index('Upcoming programmes')
        g = t.index('<div class="events-grid"', i)
        items = [e for e in ev if e.get('ministry') == ministry]
        inner = ''.join(card(e, badge) for e in items) or \
            '<p class="dept-empty">No upcoming programmes are scheduled right now — please check back soon. <a href="/events">See all events</a>.</p>'
        write(page, replace_inner(t, g, inner))
    # Events page grid: truthful no-JS list (the runtime re-renders it with modal buttons)
    t = (ROOT / 'events.html').read_text()
    g = t.index('<div class="events-grid"')
    inner = ''.join(card(e, 'Happening now' if e['_live'] else 'Upcoming') for e in ev)
    t = replace_inner(t, g, inner)
    t = re.sub(r'(<div class="filter-summary"><b>Upcoming &amp; ongoing</b><span>)[^<]*(</span>)',
               lambda m: m.group(1) + '%d event%s' % (len(ev), '' if len(ev) == 1 else 's') + m.group(2), t)
    write('events.html', t)
    # Homepage dock static text (runtime refreshes it)
    t = (ROOT / 'index.html').read_text()
    e = ev[0]
    loc = dock_loc(e)
    dock = '<span><i></i> Next regional gathering</span><b>%s</b><small>%s</small><a href="%s">See details %s</a>' % (
        esc(e['title']), esc((e.get('dateDisplay') or e['date']) + (' · ' + loc if loc else '')), esc(href_of(e)),
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path></svg>')
    i = t.index('<div class="service-dock"')
    write('index.html', replace_inner(t, i, dock))

DETAIL_GUARD = ('<script>(function(){var c=document.querySelector(".ev-cta[data-ends]");if(!c)return;'
                'if(Date.now()>Date.parse(c.getAttribute("data-ends"))){[].forEach.call(c.querySelectorAll("[data-live-only]"),function(a){a.remove();});'
                'var n=document.createElement("p");n.className="ev-ended";n.textContent="This programme has ended. See what\\u2019s coming up next.";c.parentNode.insertBefore(n,c);}})();</script>')

def detail_cta(e):
    btns = ''
    if e.get('_ticket'):
        btns += '<a class="btn btn--fire" data-live-only href="%s" target="_blank" rel="noopener">Register / Get Tickets</a>' % esc(e['_ticket'])
    btns += '<a class="btn btn--primary" data-live-only href="%s" target="_blank" rel="noopener">Add to Calendar</a>' % esc(e['_gcal'])
    btns += '<a class="btn btn--secondary" href="/events">All events</a>'
    return '<div class="ev-cta" data-ends="%s">%s</div>' % (esc(e['_end']), btns)

def schema_tag(e):
    return '<script type="application/ld+json">%s</script>' % json.dumps(e['_schema'], ensure_ascii=False)

def build_detail(e, template):
    path = e['page'].lstrip('/') + '.html'
    p = ROOT / path
    t = p.read_text() if p.exists() else template
    title = e.get('pageTitle') or e['title']
    when = when_of(e)
    desc_meta = (e['title'] + ' — ' + when + '. ' + (e.get('description') or ''))[:300]
    url = ORIGIN + e['page']
    img = ORIGIN + '/' + e['image'].lstrip('/')
    if not p.exists():
        # new page from the template: rewrite every content field
        t = re.sub(r'<title>.*?</title>', '<title>%s — MFM Mega Region 2 USA</title>' % esc(title), t, flags=re.S)
        for prop in ('og:title', 'twitter:title'):
            t = re.sub(r'(<meta (?:property|name)="%s" content=")[^"]*(")' % prop, lambda m: m.group(1) + esc(title) + m.group(2), t)
        for prop in ('og:url',):
            t = re.sub(r'(<meta property="%s" content=")[^"]*(")' % prop, lambda m: m.group(1) + url + m.group(2), t)
        for prop in ('og:image', 'twitter:image'):
            t = re.sub(r'(<meta (?:property|name)="%s" content=")[^"]*(")' % prop, lambda m: m.group(1) + img + m.group(2), t)
        t = re.sub(r'(<link rel="canonical" href=")[^"]*(")', lambda m: m.group(1) + url + m.group(2), t)
        t = re.sub(r'(<script type="application/ld\+json">\{"@context": "https://schema.org", "@type": "BreadcrumbList".*?"position": 3, "name": ")[^"]*(", "item": ")[^"]*(")',
                   lambda m: m.group(1) + e['title'].replace('"', '\\"') + m.group(2) + url + m.group(3), t, flags=re.S)
        t = re.sub(r'<span class="ev-badge \w+">[^<]*</span>', '<span class="ev-badge %s">Event</span>' % esc(e.get('badgeStyle') or 'gold'), t)
        t = re.sub(r'<h1 class="ev-title">.*?</h1>', '<h1 class="ev-title">%s</h1>' % esc(e['title']), t, flags=re.S)
        theme = '<p class="ev-theme">%s</p>' % esc(e['theme']) if e.get('theme') else ''
        t = re.sub(r'(<p class="ev-date">.*?</p>)<p class="ev-theme">.*?</p>', lambda m: m.group(1) + theme, t, flags=re.S)
        w_h = img_size(e['image']) or (1080, 1350)
        flyer = '<div class="ev-flyer"><img width="%d" height="%d" src="/%s" alt="%s" loading="eager"></div>' % (w_h[0], w_h[1], esc(e['image'].lstrip('/')), esc(e.get('alt') or e['title']))
        t = re.sub(r'<div class="ev-flyer">.*?</div>\s*(?=<div class="ev-card">)', flyer + '\n        ', t, flags=re.S)
        rows = '<div class="ev-row"><span class="ev-k">When</span><span class="ev-v">%s</span></div>' % esc(when)
        rows += '<div class="ev-row"><span class="ev-k">Where</span><span class="ev-v">%s</span></div>' % esc(e.get('venue'))
        if e.get('ministering'):
            rows += '<div class="ev-row"><span class="ev-k">Ministering</span><span class="ev-v">%s</span></div>' % esc(e['ministering'])
        if e.get('host'):
            rows += '<div class="ev-row"><span class="ev-k">Host</span><span class="ev-v">%s</span></div>' % esc(e['host'])
        body = rows + '\n          <p class="ev-desc">%s</p>\n          ' % esc(e.get('description'))
        if e.get('scripture'):
            q, _, ref = e['scripture'].partition('|')
            body += '<div class="ev-scripture">“%s”<cite>— %s</cite></div>\n          ' % (esc(q), esc(ref))
        t = re.sub(r'(<div class="ev-card">\s*).*?(?=<div class="ev-cta")', lambda m: m.group(1) + body, t, flags=re.S)
    # always refreshed (existing + new pages)
    for name in ('description', 'og:description', 'twitter:description'):
        attr = 'property' if name.startswith('og:') else 'name'
        t = re.sub(r'(<meta %s="%s" content=")[^"]*(")' % (attr, re.escape(name)), lambda m: m.group(1) + esc(desc_meta) + m.group(2), t)
    t = re.sub(r'<p class="ev-date">.*?</p>', '<p class="ev-date">%s</p>' % esc(when), t, count=1, flags=re.S)
    t = re.sub(r'(<span class="ev-k">When</span><span class="ev-v">)[^<]*(</span>)', lambda m: m.group(1) + esc(when) + m.group(2), t, count=1)
    t = re.sub(r'<script type="application/ld\+json">\{"@context": "https://schema.org", "@type": "Event".*?</script>', lambda m: schema_tag(e), t, count=1, flags=re.S)
    t = re.sub(r'<div class="ev-cta"[^>]*>.*?</div>', lambda m: detail_cta(e), t, count=1, flags=re.S)
    t = t.replace('<a class="ev-back" href="/events.html">', '<a class="ev-back" href="/events">')
    t = t.replace('"item": "%s/events.html"' % ORIGIN, '"item": "%s/events"' % ORIGIN)
    if DETAIL_GUARD not in t:
        t = t.replace('</main>', '</main>\n' + DETAIL_GUARD, 1)
    if '.ev-ended{' not in t:
        t = t.replace('</style>', '    .ev-ended{ margin:22px 0 0; padding:12px 16px; border-left:3px solid var(--gold); background:#faf8f2; color:#5a6270; font-size:0.92rem; }\n  </style>', 1)
    write(path, t)
    return path

def build_details(ev):
    template = (ROOT / 'events' / 'womens-retreat.html').read_text()
    live_pages = set()
    for e in ev:
        if e.get('page'):
            live_pages.add(build_detail(e, template))
    return live_pages

REDIR_START = '# --- build_site.py: ended programmes (do not edit by hand) ---'
REDIR_END = '# --- end build_site.py ---'

def build_redirects(live_pages, ev):
    """Detail + share pages of programmes that have ended -> /events (standing rule: never show past programmes)."""
    live_anchors = {e['anchor'] for e in ev}
    lines = []
    for p in sorted((ROOT / 'events').glob('*.html')):
        rel = 'events/' + p.name
        if rel not in live_pages:
            slug = p.stem
            lines += ['/events/%s  /events  301!' % slug, '/events/%s.html  /events  301!' % slug]
    for p in sorted((ROOT / 'share').glob('*.html')):
        if p.stem not in live_anchors:
            lines += ['/share/%s  /events  301!' % p.stem, '/share/%s.html  /events  301!' % p.stem]
    t = (ROOT / '_redirects').read_text()
    t = re.sub(re.escape(REDIR_START) + '.*?' + re.escape(REDIR_END) + '\n?', '', t, flags=re.S)
    block = REDIR_START + '\n' + '\n'.join(lines) + '\n' + REDIR_END + '\n'
    # ended-programme rules go FIRST so they win over any later generic rule
    write('_redirects', block + t)
    return [l.split()[0] for l in lines]

def build_latest_video():
    """Static fallback for 'Watch & grow' = the same atomic object the runtime function returns."""
    js = "require('./netlify/functions/latest-video.js').handler().then(r=>process.stdout.write(r.body))"
    try:
        v = json.loads(subprocess.run(['node', '-e', js], cwd=ROOT, capture_output=True, text=True, timeout=30).stdout)
    except Exception:
        v = {}
    if not v.get('ok'):
        print('latest video: feed unavailable, static fallback left unchanged')
        return
    t = (ROOT / 'index.html').read_text()
    t = re.sub(r'(<img width="1280" height="720" id="rf-latest-thumb" src=")[^"]*(" alt=")[^"]*(")',
               lambda m: m.group(1) + 'https://i.ytimg.com/vi/%s/hqdefault.jpg' % v['id'] + m.group(2) + esc(v['title']) + m.group(3), t)
    t = re.sub(r'(<h2 id="rf-latest-title">)[^<]*(</h2>)', lambda m: m.group(1) + esc(v['title']) + m.group(2), t)
    write('index.html', t)


# ---------------------------------------------------------------- release systems (audit E-01..E-07, C-12)
SKIP_DIRS = ('admin/', 'newsletter/', 'tools/', 'node_modules/', 'img/')

def html_files():
    for f in sorted(ROOT.rglob('*.html')):
        rel = f.relative_to(ROOT).as_posix()
        if rel.startswith(SKIP_DIRS):
            continue
        yield rel

def stamp_assets():
    """Fingerprint every local CSS/JS reference: /css/x.css?v=<hash> (safe long-term caching, C-12)."""
    import hashlib
    cache = {}
    def h(path):
        if path not in cache:
            fp = ROOT / path
            cache[path] = hashlib.sha256(fp.read_bytes()).hexdigest()[:10] if fp.exists() else None
        return cache[path]
    rx = re.compile(r'((?:href|src)=")(/?)((?:css|js)/[\w.\-]+\.(?:css|js))(?:\?v=[\w]+)?(")')
    for rel in html_files():
        t = (ROOT / rel).read_text()
        def sub(m):
            v = h(m.group(3))
            return m.group(1) + '/' + m.group(3) + ('?v=' + v if v else '') + m.group(4) if v else m.group(0)
        write(rel, rx.sub(sub, t))

CSP_META = ("default-src 'self'; script-src 'self' 'unsafe-inline' https://plausible.io https://unpkg.com https://cdnjs.cloudflare.com; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com https://cdnjs.cloudflare.com; "
            "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; "
            "img-src 'self' data: blob: https://mfmmegaregion2usa.org https://www.mfmmegaregion2usa.org https://mfmmegaregion2yc.org https://www.mfmmegaregion2yc.org https://i.ytimg.com https://img.youtube.com https://*.tile.openstreetmap.org https://unpkg.com; "
            "media-src 'self' blob:; frame-src https://www.youtube-nocookie.com https://www.youtube.com; "
            "connect-src 'self' https://ingesteer.services-prod.nsvcs.net https://plausible.io https://nominatim.openstreetmap.org; "
            "worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'")

def ensure_csp_meta():
    """Enforced CSP on public pages (E-11). Delivered as a meta tag so the CMS at /admin keeps only the
    report-only header. frame-ancestors is covered by the X-Frame-Options header."""
    tag = '<meta http-equiv="Content-Security-Policy" content="%s">' % CSP_META
    for rel in html_files():
        t = (ROOT / rel).read_text()
        t2 = re.sub(r'<meta http-equiv="Content-Security-Policy" content="[^"]*">', tag, t)
        if t2 == t and 'http-equiv="Content-Security-Policy"' not in t:
            m = re.search(r'<meta charset="[^"]*"\s*/?>', t, re.I)
            if not m:
                continue
            t2 = t[:m.end()] + tag + t[m.end():]
        write(rel, t2)

def ensure_touch_icon():
    """Same home-screen icon tag on every page (E-05)."""
    tag = '<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">'
    for rel in html_files():
        t = (ROOT / rel).read_text()
        if 'rel="apple-touch-icon"' in t or '</head>' not in t:
            continue
        write(rel, t.replace('</head>', tag + '\n</head>', 1))

def ensure_sw_registration():
    tag = '<script src="/js/sw-register.js" defer></script>'
    for rel in html_files():
        t = (ROOT / rel).read_text()
        if 'sw-register.js' in t or 'mobile-nav.js' not in t:
            continue
        i = t.find('<script src="/js/mobile-nav.js')
        write(rel, t[:i] + tag + '\n' + t[i:])

LEGACY_START = '# --- build_site.py: legacy .html -> clean URLs (do not edit by hand) ---'
LEGACY_END = '# --- end legacy ---'
NO_LEGACY = {'thanks.html', '404.html', 'give.html', '_template.html', 'present.html', 'subscribe.html'}

def build_legacy_redirects(ended):
    """One permanent redirect from every legacy .html route to its clean URL (E-04)."""
    lines = ['/index.html  /  301!']
    for rel in html_files():
        if rel in NO_LEGACY or rel == 'index.html' or rel.startswith('share/'):
            continue
        clean = '/' + rel[:-5]
        if clean in ended:
            continue
        lines.append('/%s  %s  301!' % (rel, clean))
    t = (ROOT / '_redirects').read_text()
    t = re.sub(re.escape(LEGACY_START) + '.*?' + re.escape(LEGACY_END) + '\n?', '', t, flags=re.S)
    write('_redirects', t.rstrip('\n') + '\n' + LEGACY_START + '\n' + '\n'.join(lines) + '\n' + LEGACY_END + '\n')

SITEMAP_TOP = [('/', 'index.html', 'weekly', '1.0'), ('/about', 'about.html', 'monthly', '0.8'), ('/events', 'events.html', 'weekly', '0.9'),
               ('/branches', 'branches.html', 'monthly', '0.8'), ('/gallery', 'gallery.html', 'monthly', '0.7'), ('/media', 'media.html', 'weekly', '0.8'),
               ('/watch', 'watch.html', 'weekly', '0.8'), ('/ministries', 'ministries.html', 'monthly', '0.7'), ('/women', 'women.html', 'monthly', '0.7'),
               ('/gen218', 'gen218.html', 'monthly', '0.7'), ('/links', 'links.html', 'monthly', '0.5')]

def build_sitemap(live_pages):
    """Sitemap with truthful lastmod: today for pages changed since the published baseline, otherwise the previous date (E-01, E-02)."""
    import hashlib
    old = (ROOT / 'sitemap.xml').read_text()
    prev = dict(re.findall(r'<loc>https://mfmmegaregion2usa\.org([^<]*)</loc>\s*<lastmod>([^<]+)</lastmod>', old))
    base_file = ROOT / 'tools' / 'published-shas.json'
    base = json.loads(base_file.read_text()) if base_file.exists() else {}
    today = (NOW or datetime.date.today().isoformat())[:10]
    def gitsha(b):
        return hashlib.sha1(b'blob %d\0' % len(b) + b).hexdigest()
    def lastmod(loc, rel):
        data = (ROOT / rel).read_bytes()
        if base.get(rel) == gitsha(data) and loc in prev:
            return prev[loc]
        return today
    urls = list(SITEMAP_TOP)
    urls += [('/branches/' + Path(f).stem, 'branches/' + Path(f).name, 'monthly', '0.6') for f in sorted((ROOT / 'branches').glob('*.html'))]
    urls += [('/messages/' + Path(f).stem, 'messages/' + Path(f).name, 'yearly', '0.5') for f in sorted((ROOT / 'messages').glob('*.html'))]
    urls += [('/' + p[:-5], p, 'weekly', '0.7') for p in sorted(live_pages)]
    out = ['<?xml version="1.0" encoding="UTF-8"?>', '<!-- build: %s — generated by tools/build_site.py (current/upcoming events only) -->' % today,
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, rel, freq, pri in urls:
        out.append('  <url>\n    <loc>%s%s</loc>\n    <lastmod>%s</lastmod>\n    <changefreq>%s</changefreq>\n    <priority>%s</priority>\n  </url>' % (ORIGIN, loc, lastmod(loc, rel), freq, pri))
    out.append('</urlset>')
    write('sitemap.xml', '\n'.join(out) + '\n')
    return len(urls)

def main():
    ev = snapshot()
    build_latest_video()
    build_grids(ev)
    live = build_details(ev)
    gone = build_redirects(live, ev)
    ended = {g.replace('.html', '') for g in gone}
    build_legacy_redirects(ended)
    n = build_sitemap(live)
    ensure_sw_registration()
    ensure_touch_icon()
    ensure_csp_meta()
    stamp_assets()           # last: hashes reflect the final file contents
    print('sitemap urls:', n)
    print('upcoming events:', len(ev))
    print('detail pages live:', sorted(live))
    print('redirected (ended):', len(gone))
    print('files changed:', changed)

if __name__ == '__main__':
    main()
