"""Link previews (WhatsApp, Facebook, email, X) for the engagement pages + the three Reach Out addresses.
set_share(html, path, title, desc, image, alt) rewrites the page's og:/twitter: block.
build_reach_pages(root, write) makes /reach-out/prayer, /reach-out/testimony, /reach-out/contact from reach-out.html
(each with its own preview and the subject already chosen)."""
import html as H, re, sys
ORIGIN = 'https://mfmmegaregion2usa.org'

SHARE = {
    'testimonies.html': ('/testimonies', 'Testimonies: God is still doing it.',
                         'Read what God has done across our churches, and share your own testimony to encourage someone today.',
                         '/img/og/testimonies.jpg', 'Testimonies: God is still doing it.'),
    'reach-out.html': ('/reach-out', 'Reach out to us',
                       'Request prayer, share a testimony or send our regional team a message.',
                       '/img/og/reach-out.jpg', 'Reach out to us: request prayer, share a testimony or contact us.'),
}
REACH = {  # slug: (subject, title, description, image, alt)
    'prayer': ('prayer', 'Request prayer', 'Tell us what to pray about. Your request is kept confidential and our prayer team will stand with you.',
               '/img/og/reach-out-prayer.jpg', 'Request prayer. Call unto me, and I will answer thee (Jeremiah 33:3).'),
    'testimony': ('testimony', 'Share your testimony', 'Tell us what God has done. Your testimony could strengthen someone today.',
                  '/img/og/reach-out-testimony.jpg', 'Share your testimony.'),
    'contact': ('general', 'Contact us', 'Questions, ministry support or anything else. Our regional team will reply with care.',
                '/img/og/reach-out-contact.jpg', 'Contact us: we would love to hear from you.'),
}

def set_share(t, path, title, desc, image, alt, doc=True):
    e = lambda s: H.escape(s, quote=True)
    url, img = ORIGIN + path, ORIGIN + image
    t = re.sub(r'\s*<meta (?:property="og:[^"]+"|name="twitter:[^"]+") content="[^"]*">', '', t)
    t = re.sub(r'\s*<link rel="canonical" href="[^"]*">', '', t)
    block = ('\n<link rel="canonical" href="%s">\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="MFM Mega Region 2 USA">\n'
             '<meta property="og:title" content="%s">\n<meta property="og:description" content="%s">\n<meta property="og:url" content="%s">\n'
             '<meta property="og:image" content="%s">\n<meta property="og:image:secure_url" content="%s">\n<meta property="og:image:type" content="image/jpeg">\n'
             '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta property="og:image:alt" content="%s">\n'
             '<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="%s">\n<meta name="twitter:description" content="%s">\n'
             '<meta name="twitter:image" content="%s">\n<meta name="twitter:image:alt" content="%s">') % (
        url, e(title), e(desc), url, img, img, e(alt), e(title), e(desc), img, e(alt))
    if doc:  # the page's own <title> and description follow the preview (engagement pages); other pages keep theirs
        t = re.sub(r'<title>[^<]*</title>', '<title>%s | MFM Mega Region 2 USA</title>' % e(title), t, count=1)
        t = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="%s">' % e(desc), t, count=1)
    if '<meta name="theme-color"' in t:
        return t.replace('<meta name="theme-color"', block.lstrip('\n') + '\n<meta name="theme-color"', 1)
    return t.replace('</head>', block.lstrip('\n') + '\n</head>', 1)

def build_share(root, write):
    for f, (path, title, desc, img, alt) in SHARE.items():
        p = root / f
        if p.exists():
            write(f, set_share(p.read_text(), path, title, desc, img, alt))
    # the rest of the site (Dawn, Nov 28 2026): every page its own preview; pictures from tools/og/render.js
    sys.path.insert(0, str(root / 'tools' / 'og'))
    import pages as OG
    for f, (path, title, desc, spec) in OG.all_pages().items():
        p, img = root / f, '/img/og/%s.jpg' % spec['img']
        if p.exists() and (root / img.lstrip('/')).exists():
            write(f, set_share(p.read_text(), path, title, desc, img, H.unescape(re.sub('<[^>]+>', '', spec.get('h') or title)), doc=(f == 'play.html')))
    build_game_pages(root, write, OG)
    build_declaration_pages(root, write, OG)
    build_testimony_pages(root, write, OG)

STUB = '''<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>%(title)s | MFM Mega Region 2 USA</title>
<meta name="description" content="%(desc)s">
<meta name="robots" content="noindex,follow">
<meta name="theme-color" content="#142240">
<link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32.png"><link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<script>%(js)s</script>
<style>body{margin:0;font-family:system-ui,'Segoe UI',sans-serif;background:#142240;color:#f0e6d0;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center;padding:30px}a{color:#fff;font-weight:700}</style>
</head><body><p>Opening <strong>%(name)s</strong>&hellip;<br><a href="%(href)s">Tap here if it does not open.</a></p></body></html>
'''

def stub(path, title, desc, image, alt, name, href, js):
    e = lambda x: H.escape(x, quote=True)
    t = STUB % {'title': e(title), 'desc': e(desc), 'name': e(name), 'href': e(href), 'js': js}
    return set_share(t, path, title, desc, image, alt, doc=False).replace('<link rel="canonical" href="%s%s">' % (ORIGIN, path), '<link rel="canonical" href="%s/play">' % ORIGIN)

def build_game_pages(root, write, OG):
    """/play/<game> and /play/live: a link with that game's own preview that opens the game (and keeps any
    challenge or room in the address). Share buttons use these addresses."""
    (root / 'play').mkdir(exist_ok=True)
    for gid, (name, line) in OG.GAMES.items():
        js = ("var q=location.search;if(!/[?&](c|room)=/.test(q))q=(q?q+'&':'?')+'play=%s';location.replace('/play'+q+location.hash);" % gid)
        write('play/%s.html' % gid, stub('/play/' + gid, 'Play & Grow: %s' % name, line + ' Free on mfmmegaregion2usa.org.', '/img/og/game-%s.jpg' % gid,
                                         '%s, a Play & Grow game' % name, name, '/play?play=' + gid, js))
    js = "location.replace('/play'+location.search+location.hash);"
    write('play/live.html', stub('/play/live', OG.LIVE[0], OG.LIVE[1], '/img/og/game-live.jpg', 'Join my Play & Grow live room', 'the live room', '/play', js))

DECL = '''<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>%(label)s | MFM Mega Region 2 USA</title>
<meta name="description" content="%(desc)s">
<meta name="theme-color" content="#142240">
<link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32.png"><link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,500&family=Inter+Tight:wght@500;600;700;800&display=swap">
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(ellipse 70%% 60%% at 50%% -10%%,rgba(201,149,44,.28),transparent 60%%),linear-gradient(180deg,#172848,#0e1a33);color:#fff;font-family:'Inter Tight',system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:48px 22px}
.logo{width:96px;height:auto;margin-bottom:18px}.k{font-weight:800;font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#d9a948;margin:0 0 16px}
blockquote{margin:0 auto;max-width:760px;font:italic 500 clamp(24px,4.4vw,38px)/1.3 Fraunces,Georgia,serif}cite{display:block;margin-top:12px;font:800 13px 'Inter Tight';letter-spacing:.18em;text-transform:uppercase;color:#d9a948;font-style:normal}
.body{max-width:680px;margin:26px auto 0;font-size:18px;line-height:1.6;color:#e2e8f2}.body b{display:block;color:#fff;font:600 24px/1.3 Fraunces,Georgia,serif;margin-bottom:8px}
ol{text-align:left;max-width:620px;margin:26px auto 0;padding-left:1.3em;font-size:18px;line-height:1.6;color:#e2e8f2}li{margin:0 0 8px}
.acts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:34px}.acts a{display:inline-flex;align-items:center;min-height:48px;padding:0 22px;border-radius:999px;font-weight:700;text-decoration:none}
.p{background:#fff;color:#142240}.g{color:#fff;border:1.5px solid rgba(255,255,255,.45)}.acts a:focus-visible{outline:3px solid #c9952c;outline-offset:3px}
.f{margin-top:40px;font-size:14px;color:#aebbd0}.f a{color:#fff}
</style>
</head><body>
<img class="logo" src="/img/logo.png" alt="MFM Mega Region 2 USA">
<p class="k">%(label)s &middot; %(date)s</p>
<blockquote>&ldquo;%(verse)s&rdquo;<cite>%(ref)s</cite></blockquote>
%(body)s
<div class="acts"><a class="p" href="https://wa.me/?text=%(wa)s" target="_blank" rel="noopener">Share on WhatsApp</a><a class="g" href="/">Visit our homepage</a><a class="g" href="/play">Play &amp; Grow</a></div>
<p class="f">MFM Mega Region 2 USA &middot; <a href="/reach-out/prayer">Request prayer</a></p>
</body></html>
'''

def decl_share_text(day, d, OG):
    lab = OG.decl_label(d)
    body = (d['title'] + '\n' + d['text']) if d.get('kind') == 'weekly' else '\n'.join('%d. %s' % (i + 1, l) for i, l in enumerate(d.get('lines') or []))
    return '*%s*\n\n"%s" (%s)\n\n%s\n\nMFM Mega Region 2 USA | %s/declaration/%s' % (lab, d['verse'], d['ref'], body, ORIGIN, day)

def build_declaration_pages(root, write, OG):
    """/declaration/<YYYY-MM-DD>: each day's declaration (data/declarations.json) on its own page with its own
    preview, so sharing it from the homepage shows the declaration itself. Pages are kept after the feed drops a day."""
    import datetime, urllib.parse
    (root / 'declaration').mkdir(exist_ok=True)
    e = lambda x: H.escape(x, quote=True)
    for day, d in sorted(OG.declarations().items()):
        lab = OG.decl_label(d)
        dt = datetime.date.fromisoformat(day)
        nice = dt.strftime('%A, %B ') + str(dt.day)
        if d.get('kind') == 'weekly':
            body, first = '<div class="body"><b>%s</b>%s</div>' % (e(d['title']), e(d['text'])), d['title']
        else:
            lines = d.get('lines') or []
            body, first = '<ol>%s</ol>' % ''.join('<li>%s</li>' % e(l) for l in lines), (lines[0] if lines else '')
        img = '/img/og/decl/%s.jpg' % day
        if not (root / img.lstrip('/')).exists():
            img = '/img/og/declaration.jpg'
        desc = '"%s" (%s). %s' % (d['verse'].rstrip(' .;,'), d['ref'], first)
        t = DECL % {'label': e(lab), 'date': e(nice), 'verse': e(d['verse']), 'ref': e(d['ref']), 'body': body, 'desc': e(desc),
                    'wa': urllib.parse.quote(decl_share_text(day, d, OG))}
        write('declaration/%s.html' % day, set_share(t, '/declaration/' + day, '%s: %s' % (lab, first) if first else lab, desc, img, '%s, %s' % (lab, d['ref']), doc=False))

def build_reach_pages(root, write):
    src = (root / 'reach-out.html').read_text()
    # sub-folder pages need site-absolute asset and link paths
    src = re.sub(r'((?:src|href|srcset)=")(?=(?:img|css|js)/)', r'\1/', src)
    for slug, (subj, title, desc, img, alt) in REACH.items():
        t = set_share(src, '/reach-out/' + slug, title, desc, img, alt)
        # start with the picture for this page's message type (the page's script swaps it when the type changes)
        ph = {'prayer': ('/img/photos/hero.webp', 'A worshipper praying with his arms raised to God'),
              'testimony': ('/img/photos/worship.webp', 'A congregation lifting their hands in praise')}.get(slug)
        if ph:
            t = t.replace('<img src="/img/photos/community.webp" alt="Reaching out to the community in prayer"', '<img src="%s" alt="%s"' % ph, 1)
        t = t.replace("sub=p.get('subject')", "sub=(p.get('subject')||'%s')" % subj)
        t = t.replace("new URLSearchParams(location.search).get('subject')", "(new URLSearchParams(location.search).get('subject')||'%s')" % subj)
        write('reach-out/%s.html' % slug, t)
        if slug == 'contact':  # old ?subject=general links redirect to /reach-out/general: same page, canonical = /reach-out/contact
            write('reach-out/general.html', t)


def build_testimony_pages(root, write, OG):
    """/testimonies/<slug>: each testimony's own preview (headline, who, where); opens it on /testimonies.
    The page's WhatsApp buttons share these addresses, and each card gets id="<slug>" for the link to land on."""
    import urllib.parse
    tl = OG.testimonies()
    if not tl:
        return
    (root / 'testimonies').mkdir(exist_ok=True)
    page = (root / 'testimonies.html').read_text(encoding='utf-8')
    arts = re.findall(r'<article class="tc"[^>]*>.*?</article>', page, re.S)
    clean = lambda x: H.unescape(re.sub('<[^>]+>', '', x)).strip()
    for (slug, cat, head, text, name, src), a in zip(tl, arts):
        h, who = clean(head), ' · '.join(clean(x) for x in (name, src) if x)
        body = clean(text); body = body if len(body) <= 190 else body[:187].rsplit(' ', 1)[0] + '…'
        img = '/img/og/t/%s.jpg' % slug
        if not (root / img.lstrip('/')).exists():
            img = '/img/og/testimonies.jpg'
        js = "location.replace('/testimonies#%s');" % slug
        write('testimonies/%s.html' % slug, stub('/testimonies/' + slug, h, (who + ': ' if who else '') + body, img, 'Testimony: ' + h, h, '/testimonies#' + slug, js)
              .replace('<link rel="canonical" href="%s/play">' % ORIGIN, '<link rel="canonical" href="%s/testimonies">' % ORIGIN))
        wa = 'https://wa.me/?text=' + urllib.parse.quote('"%s" A testimony from MFM Mega Region 2 USA %s/testimonies/%s' % (h, ORIGIN, slug), safe='')
        b = re.sub(r'(<a class="wa" href=")[^"]*(")', lambda m: m.group(1) + wa + m.group(2), a, count=1)
        b = re.sub(r'^<article class="tc"(?: id="[^"]*")?', '<article class="tc" id="%s"' % slug, b, count=1)
        page = page.replace(a, b, 1)
    write('testimonies.html', page)
