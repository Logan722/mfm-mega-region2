"""Link previews (WhatsApp, Facebook, email, X) for the engagement pages + the three Reach Out addresses.
set_share(html, path, title, desc, image, alt) rewrites the page's og:/twitter: block.
build_reach_pages(root, write) makes /reach-out/prayer, /reach-out/testimony, /reach-out/contact from reach-out.html
(each with its own preview and the subject already chosen)."""
import html as H, re
ORIGIN = 'https://mfmmegaregion2usa.org'

SHARE = {
    'play.html': ('/play', 'Play & Grow: can you get all 10?',
                  'Ten free games from the Bible and the ministry: Connections, Word Connect, Daily Verse, Who Am I? and more. Play solo or as teams, and lift your branch on the weekly board.',
                  '/img/og/play.jpg', 'Play & Grow: daily Bible games. 10 questions a day. Can you get them all?'),
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

def set_share(t, path, title, desc, image, alt):
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
    t = re.sub(r'<title>[^<]*</title>', '<title>%s | MFM Mega Region 2 USA</title>' % e(title), t, count=1)
    t = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="%s">' % e(desc), t, count=1)
    return t.replace('<meta name="theme-color"', block.lstrip('\n') + '\n<meta name="theme-color"', 1)

def build_share(root, write):
    for f, (path, title, desc, img, alt) in SHARE.items():
        p = root / f
        if p.exists():
            write(f, set_share(p.read_text(), path, title, desc, img, alt))

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
