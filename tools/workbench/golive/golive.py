import re, json, sys, subprocess
from pathlib import Path
R = Path('/home/claude/mfm-mega-region2')
def rd(p): return (R / p).read_text()
def wr(p, t): (R / p).write_text(t)

PAGES = {
  'index.html':       ('preview-home.html', '/', None, None, None),
  'play.html':        ('preview-play.html', '/play', 'Play & Grow | MFM Mega Region 2 USA',
                       'Play & Grow: daily Bible quizzes, Word of the Day, team battles and Kids Mode from MFM Mega Region 2 USA. Learn Scripture, our pastors’ books and our messages, and invite your friends.',
                       'Play & Grow | MFM Mega Region 2 USA'),
  'testimonies.html': ('preview-testimonies.html', '/testimonies', 'Testimonies | MFM Mega Region 2 USA',
                       'Testimonies and programme reflections from across MFM Mega Region 2 USA. Read what God has done and share your own testimony.',
                       'Testimonies | MFM Mega Region 2 USA'),
  'reach-out.html':   ('preview-reach-out.html', '/reach-out', 'Reach Out | MFM Mega Region 2 USA',
                       'Send a prayer request, share a testimony or contact the MFM Mega Region 2 USA regional team.',
                       'Reach Out | MFM Mega Region 2 USA'),
}
LINKS = [('/preview-play', '/play'), ('/preview-testimonies', '/testimonies'), ('/preview-reach-out', '/reach-out'), ('/preview-home', '/')]
orig_index_head = rd('index.html')[:rd('index.html').find('</head>')]

def common(t):
    t = t.replace('<meta name="robots" content="noindex, nofollow">\n', '').replace('<meta name="robots" content="noindex, nofollow">', '')
    t = re.sub(r'<div class="pv-banner">.*?</div>\s*', '', t, flags=re.S)
    t = re.sub(r'<span class="pv-note"[^>]*>.*?</span>', '', t, flags=re.S)
    t = t.replace('class="pv-page"', 'class="ek-page"')
    for a, b in LINKS:
        t = t.replace('"' + a + '?', '"' + b + '?').replace('"' + a + '#', '"' + b + '#').replace('"' + a + '"', '"' + b + '"')
    return t

for out, (src, path, title, desc, ogt) in PAGES.items():
    t = common(rd(src))
    if out == 'index.html':
        t = re.sub(r'<title>[^<]*</title>', '<title>Mountain of Fire and Miracles Ministries — Mega Region 2 USA</title>', t)
        if 'rel="canonical"' not in t:
            t = t.replace('<meta name="theme-color"', '<link rel="canonical" href="https://mfmmegaregion2usa.org/">\n<meta name="theme-color"', 1)
    else:
        t = re.sub(r'<title>[^<]*</title>', '<title>%s</title>' % title.replace('&', '&amp;'), t)
        t = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="%s">' % desc.replace('&', '&amp;'), t, count=1)
        t = re.sub(r'<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="%s">' % ogt.replace('&', '&amp;'), t, count=1)
        t = re.sub(r'<meta property="og:description" content="[^"]*">', '<meta property="og:description" content="%s">' % desc.replace('&', '&amp;'), t, count=1)
        t = re.sub(r'<meta property="og:url" content="[^"]*">', '<meta property="og:url" content="https://mfmmegaregion2usa.org%s">\n<link rel="canonical" href="https://mfmmegaregion2usa.org%s">' % (path, path), t, count=1)
    wr(out, t)
print('pages written')
