"""Preview-only: 5 About page designs (computer + phone), same content as about.html.
Leader pop-ups reuse the Women Foundation dialog (css from designs_women.FINAL_CSS, js/women.js)."""
import re
from designs_women import BASE, ARW, FINAL_CSS

DLG_CSS = FINAL_CSS[FINAL_CSS.index('/* leader profile pop-up */'):FINAL_CSS.index('/* Watch and grow')]
CLOSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'


def parts(src):
    m = src[src.index('<main'):src.index('</main>')]
    P = {}
    hero = re.search(r'<section class="page-hero">.*?</section>', m, re.S).group(0)
    P['hero_img'] = re.search(r'<img src="([^"]+)"', hero).group(1)
    P['k'] = re.search(r'<p class="eyebrow light">(.*?)</p>', hero).group(1)
    P['h1'] = re.search(r'<h1>(.*?)</h1>', hero).group(1)
    P['sub'] = re.search(r'</h1><p>(.*?)</p>', hero).group(1)
    who = re.search(r'<section class="section wrap prose-split">(.*?)</section>', m, re.S).group(1)
    P['who_k'] = re.search(r'<p class="eyebrow">(.*?)</p>', who).group(1)
    P['who_h'] = re.search(r'<h2>(.*?)</h2>', who).group(1)
    P['who_p'] = re.findall(r'<p>(.*?)</p>', who)
    P['verse'] = re.search(r'<section class="scripture-band">.*?<blockquote>(.*?)</blockquote>', m, re.S).group(1)
    P['verse_ref'] = 'Obadiah 1:17'
    P['video'] = re.search(r'<section class="video-band">.*?</section>', m, re.S).group(0)
    P['vals'] = re.findall(r'<article><b>(\d+)</b><h3>(.*?)</h3><p>(.*?)</p></article>', m)
    L = []
    for img, alt, pos, name, role, para, soc in re.findall(r'<article><img src="([^"]+)" alt="([^"]*)"[^>]*style="object-position:([^"]+)"[^>]*><div><h3>(.*?)</h3><p class="leader-role">(.*?)</p><p>(.*?)</p>(<div class="leader-socials".*?</div>)</div></article>', m, re.S):
        L.append(dict(img=img, alt=alt, pos=pos, k='Global leadership', name=name, role=role, paras=[para], socials=soc, badge=''))
    for img, alt, pos, k, name, role, body, soc in re.findall(r'<article class="regional-leader[^"]*"><div class="regional-leader-image"><img src="([^"]+)" alt="([^"]*)"[^>]*style="object-position:([^"]+)"[^>]*></div><div class="regional-leader-copy"><p class="eyebrow light">(.*?)</p><h3>(.*?)</h3><p class="leader-role">(.*?)</p>(.*?)(<div class="leader-socials".*?</div>)</div></article>', m, re.S):
        b = re.search(r'<span class="leader-badge">(.*?)</span>', body)
        L.append(dict(img=img, alt=alt, pos=pos, k=k, name=name, role=role, paras=re.findall(r'<p>(.*?)</p>', body), socials=soc, badge=b.group(1) if b else ''))
    P['leaders'] = L
    P['journey'] = ['Kubwa', 'MFM Lugbe Region, Abuja', 'MFM Wuye/Utako', 'International Headquarters Annex, Abuja', 'MFM North America Headquarters, Prayer City, Houston']
    c = re.search(r'<section class="section wrap about-closing">(.*?)</section>', m, re.S).group(1)
    P['c_k'] = re.search(r'<p class="eyebrow">(.*?)</p>', c).group(1)
    P['c_h'] = re.search(r'<h2>(.*?)</h2>', c).group(1)
    P['c_p'] = re.search(r'</h2></div><p>(.*?)</p>', c).group(1)
    return P


def img(L, cls=''):
    return '<img class="%s" src="%s" alt="%s" loading="lazy" decoding="async" style="object-position:%s">' % (cls, L['img'], L['alt'], L['pos'])


def dialogs(P):
    out = ''
    for i, L in enumerate(P['leaders']):
        badge = '<p class="badge">%s</p>' % L['badge'] if L['badge'] else ''
        out += ('<dialog class="wf-ld" id="ab-ld-%d" aria-labelledby="ab-ld-%d-h"><button type="button" class="x" data-ld-close aria-label="Close">%s</button>'
                '<div class="top"><div class="ph">%s</div><div class="id"><span class="k">%s</span><h2 id="ab-ld-%d-h">%s</h2><p class="role">%s</p></div></div>'
                '<div class="bd">%s%s%s</div></dialog>') % (i, i, CLOSE, img(L), L['k'], i, L['name'], L['role'], ''.join('<p>%s</p>' % p for p in L['paras']), badge, L['socials'])
    return out


def vals(P, cls='values-grid', icons=None):
    return '<div class="%s">%s</div>' % (cls, ''.join('<article>%s<b>%s</b><h3>%s</h3><p>%s</p></article>' % (icons[i] if icons else '', a, b, c) for i, (a, b, c) in enumerate(P['vals'])))


def closing(P, cls=''):
    return ('<section class="section ab-close %s"><div class="ed in"><span class="k">%s</span><h2>%s</h2><p>%s</p><div class="acts"><a class="btn" href="/branches">Find a Church %s</a>'
            '<a class="btn dark" href="/events">Explore Programs %s</a></div></div></section>') % (cls, P['c_k'], P['c_h'], P['c_p'], ARW, ARW)


def verse(P, cls=''):
    return '<section class="ab-verse %s"><div class="ed in"><span class="k lt">%s</span><blockquote>%s</blockquote></div></section>' % (cls, P['verse_ref'], P['verse'])


def badge(L):
    return '<span class="lbadge">%s</span>' % L['badge'] if L['badge'] else ''


ABASE = r'''
.a1h{position:relative;overflow:hidden;min-height:min(88vh,820px);display:flex;align-items:center;justify-content:center;padding:120px 0 80px;text-align:center}
.a1h .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.a1h .sh{position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,26,51,.55),rgba(14,26,51,.85));z-index:0}
.a1h h1{font-size:clamp(46px,7.6vw,112px);line-height:1;color:#fff;margin:18px 0 16px;letter-spacing:-.02em}
.a1h p{max-width:680px;margin:0 auto 28px;color:#dfe5ee;font-size:18px;line-height:1.6}
.a1h .in{position:relative;z-index:1}
@media(max-width:760px){.a1h{min-height:78vh;padding:110px 0 60px}.a1h p{font-size:16px}}
.ab .ab-verse{background:#b3471b;color:#fff;text-align:center;padding:70px 0;position:relative;overflow:hidden}
.ab .ab-verse blockquote{font:500 clamp(26px,3.6vw,46px)/1.32 Fraunces,serif;margin:14px auto 0;max-width:1000px;text-wrap:balance}
.ab .ab-verse .k.lt{color:#fff3d6}
.ab .ab-close{background:var(--cream);text-align:center}
.ab .ab-close .in{display:flex;flex-direction:column;align-items:center;gap:12px}
.ab .ab-close h2{font-size:clamp(32px,4vw,54px)}
.ab .ab-close p{color:var(--muted);max-width:620px;margin:0 0 8px;line-height:1.6}
.ab .lbadge{display:inline-flex;align-items:center;min-height:34px;padding:0 16px;border-radius:100px;background:rgba(201,149,44,.16);color:#8a6414;font:700 13px 'Inter Tight',sans-serif;margin-top:4px}
.ab .navy .lbadge{background:rgba(240,199,96,.18);color:var(--gold2)}
.ab .more{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 20px;border-radius:100px;border:1.5px solid currentColor;background:transparent;color:inherit;font:700 14px 'Inter Tight',sans-serif;cursor:pointer;margin-top:6px}
.ab .more svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2}
.ab .video-band .video-band-inner{text-align:center;align-items:center;margin-left:auto;margin-right:auto}
.wf-ld .badge{display:inline-block;margin:4px 0 14px;padding:6px 14px;border-radius:100px;background:rgba(201,149,44,.16);color:#8a6414;font:700 13px 'Inter Tight',sans-serif}
@media(max-width:760px){.ab .ab-verse{padding:50px 0}}
''' + DLG_CSS
MORE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>'


def more(i, name):
    return '<button type="button" class="more" data-ld-open="ab-ld-%d" aria-haspopup="dialog" aria-label="Read more about %s">Read more %s</button>' % (i, name, MORE)


# 1 ------------------------------------------------------------------ Cinematic
def a1(P):
    L = P['leaders']
    lead = lambda i, x: ('<article class="ld"><div class="ph">%s</div><div class="tx"><span class="k lt">%s</span><h3>%s</h3><p class="role">%s</p><p>%s</p>%s%s%s</div></article>' % (
        img(x), x['k'], x['name'], x['role'], x['paras'][0], badge(x), x['socials'], more(i, x['name']) if len(x['paras']) > 1 else ''))
    html = ('<section class="navy a1h ctr"><img class="bg" src="%s" alt=""><div class="sh"></div><div class="ed in"><span class="k lt">%s</span><h1>%s</h1><p>%s</p>'
            '<div class="acts"><a class="btn" href="/branches">Find a Church %s</a><a class="btn ghost" href="#leaders">Meet our leaders %s</a></div></div></section>' % (P['hero_img'], P['k'], P['h1'], P['sub'], ARW, ARW) +
            '<section class="section a1w"><div class="ed g"><div class="hd"><span class="k">%s</span><h2>%s</h2></div><div class="tx">%s</div></div></section>' % (P['who_k'], P['who_h'], ''.join('<p>%s</p>' % p for p in P['who_p'])) +
            verse(P) + P['video'] +
            '<section class="section a1v"><div class="ed"><div class="hd"><span class="k">What we stand on</span><h2>Prayer. Deliverance. The Word.</h2></div>%s</div></section>' % vals(P) +
            '<section id="leaders" class="section navy a1l"><div class="ed"><div class="hd"><span class="k lt">Servants of the Most High</span><h2>Our leaders.</h2><p>Global leadership of MFM Worldwide and the regional leaders serving Mega Region 2 USA.</p></div>'
            '<h3 class="grp">Global leadership</h3><div class="g">%s</div><h3 class="grp">Regional leadership</h3><div class="g">%s</div></div></section>' % (
                lead(0, L[0]) + lead(1, L[1]), lead(2, L[2]) + lead(3, L[3])) +
            closing(P) + dialogs(P))
    css = '''
.a1w{background:#fff}.a1w .g{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;max-width:1180px;margin-left:max(var(--edge),calc((100% - 1180px)/2));margin-right:max(var(--edge),calc((100% - 1180px)/2))}
.a1w .hd{margin:0}.a1w .tx p{font:400 19px/1.75 Fraunces,serif;color:#4f5a6a;margin:0 0 14px}
.a1v{background:var(--cream)}.a1v .values-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.a1v article{background:#fff;border-top:3px solid var(--gold);padding:34px 28px;border-radius:0 0 16px 16px;box-shadow:0 12px 30px rgba(20,34,64,.06)}
.a1v b{font:600 30px Fraunces,serif;color:#8a6414}.a1v h3{font-size:26px;margin:10px 0 8px}.a1v p{color:var(--muted);margin:0;line-height:1.6}
.a1l .grp{font:700 12px 'Inter Tight',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:var(--gold2);margin:40px 0 18px;text-align:center}
.a1l .g{display:grid;grid-template-columns:1fr 1fr;gap:26px;max-width:1180px;margin:0 auto}
.a1l .ld{background:rgba(255,255,255,.06);border:1px solid rgba(240,199,96,.3);border-radius:22px;overflow:hidden;display:flex;flex-direction:column}
.a1l .ph{aspect-ratio:4/3.3;overflow:hidden}.a1l .ph img{width:100%;height:100%;object-fit:cover;display:block}
.a1l .tx{padding:26px 28px 30px;display:flex;flex-direction:column;align-items:center;gap:8px;flex:1}
.a1l h3{font-size:clamp(24px,2.4vw,32px);color:#fff;margin-top:4px}.a1l .role{color:var(--gold2);font-weight:600;font-size:14px;margin:0}
.a1l .tx>p:not(.role){color:#c9d3e3;line-height:1.6;margin:0;font-size:15px}
.a1l .more{color:#fff}
@media(max-width:900px){.a1w .g,.a1l .g{grid-template-columns:1fr}.a1v .values-grid{grid-template-columns:1fr}.a1l .g{max-width:560px}.a1w .g{gap:20px}}
@media(max-width:760px){.a1h{min-height:78vh;padding:110px 0 60px}.a1h p{font-size:16px}.a1w .tx p{font-size:17px}}
'''
    return html, css


# 2 ------------------------------------------------------------------ Editorial story with Pastor Oni's journey timeline
def a2(P):
    L = P['leaders']
    j = ''.join('<li><span class="dot"></span><b>%s</b></li>' % s for s in P['journey'])
    spread = lambda i, x, rev: ('<article class="sp %s"><div class="ph">%s</div><div class="tx"><span class="k">%s</span><h3>%s</h3><p class="role">%s</p><p class="q">%s</p>%s%s%s</div></article>' % (
        'rev' if rev else '', img(x), x['k'], x['name'], x['role'], x['paras'][0], ''.join('<p>%s</p>' % p for p in x['paras'][1:2]), badge(x), x['socials']))
    html = ('<section class="a2h"><div class="sp84"></div><div class="ed in"><span class="k">%s</span><h1>%s</h1><p>%s</p></div><div class="strip"><img src="%s" alt="Worship at an MFM Mega Region 2 service"><img src="/img/vid/worship-band-poster.webp" alt="A full sanctuary in worship"><img src="/img/photos/community.webp" alt="The Mega Region 2 family"></div></section>' % (
        P['k'], P['h1'], P['sub'], P['hero_img']) +
            '<section class="section a2w"><div class="ed in"><span class="k">%s</span><p class="big">%s</p><p>%s</p></div></section>' % (P['who_k'], P['who_p'][0], P['who_p'][1]) +
            '<section class="section navy a2v"><div class="ed"><div class="hd"><span class="k lt">What we stand on</span><h2>Prayer. Deliverance. The Word.</h2></div><ol class="lst values-grid">%s</ol></div></section>' % ''.join('<li><b>%s</b><h3>%s</h3><p>%s</p></li>' % v for v in P['vals']) +
            '<section class="section a2l"><div class="ed"><div class="hd"><span class="k">Servants of the Most High</span><h2>Our leaders.</h2></div>%s%s</div></section>' % (spread(0, L[0], False), spread(1, L[1], True)) +
            verse(P) +
            '<section class="section a2r"><div class="ed"><div class="hd"><span class="k">Regional leadership</span><h2>Serving the region with prayer and fire.</h2></div>%s'
            '<div class="jr"><h3>Pastor Oni&rsquo;s journey in MFM</h3><ol>%s</ol></div>%s</div></section>' % (spread(2, L[2], False), j, spread(3, L[3], True)) +
            P['video'] + closing(P) + dialogs(P))
    css = '''
.a2h{background:var(--cream);text-align:center}.a2h .sp84{height:84px;background:var(--navy)}
.a2h .in{padding:60px 0 40px}.a2h h1{font-size:clamp(46px,7.4vw,108px);line-height:1;letter-spacing:-.03em;margin:16px 0}
.a2h .in p{color:var(--muted);font-size:18px;max-width:680px;margin:0 auto;line-height:1.6}
.a2h .strip{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:6px;height:min(36vw,440px)}.a2h .strip img{width:100%;height:100%;object-fit:cover}
.a2w{background:#fff;text-align:center}.a2w .in{display:flex;flex-direction:column;align-items:center;gap:16px;max-width:920px;margin-left:auto;margin-right:auto}
.a2w .big{font:500 clamp(24px,2.8vw,36px)/1.4 Fraunces,serif;color:var(--ink);margin:0}.a2w .in>p:last-child{color:var(--muted);font-size:17px;line-height:1.7;margin:0;max-width:720px}
.a2v .lst{list-style:none;margin:0 auto;padding:0;max-width:1180px;display:grid;grid-template-columns:repeat(3,1fr)}
.a2v li{display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 30px;border-left:1px solid rgba(240,199,96,.3)}.a2v li:first-child{border-left:0}
.a2v b{font:500 80px/1 Fraunces,serif;color:var(--gold2)}.a2v h3{font-size:28px;color:#fff}.a2v li p{color:#c9d3e3;margin:0;line-height:1.6}
.a2l,.a2r{background:#fff}.a2r{background:var(--cream)}
.ab .sp{display:grid;grid-template-columns:.8fr 1.2fr;gap:clamp(30px,5vw,76px);align-items:center;max-width:1180px;margin:0 auto 64px}
.ab .sp.rev .ph{order:2}.ab .sp .ph{border-radius:22px;overflow:hidden;aspect-ratio:4/5}.ab .sp .ph img{width:100%;height:100%;object-fit:cover;display:block}
.ab .sp .tx{display:flex;flex-direction:column;align-items:center;gap:10px}
.ab .sp h3{font-size:clamp(28px,3.2vw,44px);line-height:1.1}.ab .sp .role{color:#8a6414;font-weight:600;margin:0}
.ab .sp .q{font:italic 500 clamp(19px,1.9vw,24px)/1.5 Fraunces,serif;color:var(--ink);margin:8px 0;max-width:580px}
.ab .sp .tx>p:not(.role):not(.q){color:var(--muted);line-height:1.65;margin:0;max-width:580px}
.ab .sp .leader-socials a{color:var(--ink)}
.a2r .jr{max-width:1180px;margin:0 auto 64px;background:var(--navy);border-radius:24px;padding:36px 30px;color:#fff;text-align:center}
.a2r .jr h3{font-size:26px;color:#fff;margin-bottom:26px}
.a2r .jr ol{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,1fr);position:relative}
.a2r .jr ol:before{content:"";position:absolute;left:10%;right:10%;top:11px;height:2px;background:linear-gradient(90deg,var(--gold),var(--fire))}
.a2r .jr li{display:flex;flex-direction:column;align-items:center;gap:12px;position:relative;padding:0 8px}
.a2r .jr .dot{width:24px;height:24px;border-radius:50%;background:var(--gold);box-shadow:0 0 0 6px var(--navy),0 0 0 8px rgba(240,199,96,.4)}
.a2r .jr li:last-child .dot{background:var(--fire)}
.a2r .jr b{font:600 15px/1.35 'Inter Tight',sans-serif;color:#e9edf5}
@media(max-width:900px){.ab .sp{grid-template-columns:1fr}.ab .sp.rev .ph{order:0}.ab .sp .ph{max-width:420px;width:100%;margin:0 auto;aspect-ratio:1}.a2v .lst{grid-template-columns:1fr}.a2v li{border-left:0;padding:14px 0}
 .a2r .jr ol{grid-template-columns:1fr;gap:18px;max-width:420px;margin:0 auto}.a2r .jr ol:before{left:50%;right:auto;top:12px;bottom:12px;width:2px;height:auto;transform:translateX(-50%)}.a2r .jr li{background:var(--navy);padding:4px 0}}
@media(max-width:760px){.a2h .strip{grid-template-columns:1fr 1fr;height:auto}.a2h .strip img{aspect-ratio:1}.a2h .strip img:first-child{grid-column:1/-1;aspect-ratio:16/9}.a2h .in{padding:56px 0 30px}.a2h .in p{font-size:16px}.a2v b{font-size:60px}}
'''
    return html, css


# 3 ------------------------------------------------------------------ Navy & scripture (Obadiah hero, medallion leaders)
def a3(P):
    L = P['leaders']
    med = lambda i, x: ('<article class="md"><div class="ring">%s</div><span class="k lt">%s</span><h3>%s</h3><p class="role">%s</p>%s%s</article>' % (
        img(x), x['k'], x['name'], x['role'], badge(x), more(i, x['name'])))
    icons = ['<svg viewBox="0 0 64 64" style="fill:none;stroke:#f0c760;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round"><path d="M32 8v10M20 26c0-7 5-12 12-12s12 5 12 12v6c0 9-5 18-12 24-7-6-12-15-12-24z"/><path d="M26 34h12"/></svg>',
             '<svg viewBox="0 0 64 64" style="fill:none;stroke:#f0c760;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round"><path d="M14 30h12v-8a6 6 0 0 1 12 0v8h12v20H14z"/><path d="M38 22a6 6 0 0 0-12 0" transform="rotate(-25 32 22)"/></svg>',
             '<svg viewBox="0 0 64 64" style="fill:none;stroke:#f0c760;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round"><path d="M32 18c-6-4-14-5-20-4v32c6-1 14 0 20 4 6-4 14-5 20-4V14c-6-1-14 0-20 4z"/><path d="M32 18v32"/></svg>']
    html = ('<section class="navy a3h ctr"><div class="sp84"></div><div class="ed in"><span class="k lt">%s</span><h1>%s</h1><p class="sub">%s</p><p class="vs">%s<b>%s</b></p></div></section>' % (
        P['k'], P['h1'], P['sub'], P['verse'], P['verse_ref']) +
            '<section class="section a3w"><div class="ed in"><span class="k">%s</span><h2>%s</h2>%s</div></section>' % (P['who_k'], P['who_h'], ''.join('<p>%s</p>' % p for p in P['who_p'])) +
            '<section class="section a3v"><div class="ed"><div class="hd"><span class="k">What we stand on</span><h2>Prayer. Deliverance. The Word.</h2></div>%s</div></section>' % vals(P, icons=['<span class="ic">%s</span>' % s for s in icons]) +
            '<section class="section navy a3l"><div class="ed"><div class="hd"><span class="k lt">Servants of the Most High</span><h2>Our leaders.</h2><p>Tap a leader to read their story.</p></div><div class="g">%s</div></div></section>' % ''.join(med(i, x) for i, x in enumerate(L)) +
            P['video'] + closing(P) + dialogs(P))
    css = '''
.a3h .in{padding:110px 0 80px}.a3h h1{font-size:clamp(46px,7vw,100px);line-height:1;color:#fff;margin:16px 0}
.a3h .sub{color:#c9d3e3;font-size:18px;max-width:660px;margin:0 auto;line-height:1.6}
.a3h .vs{margin:34px auto 0;font:italic 500 clamp(20px,2.2vw,28px)/1.45 Fraunces,serif;color:#e9d9b4;max-width:820px}
.a3h .vs b{display:block;font:700 11px 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;color:var(--gold2);margin-top:12px;font-style:normal}
.a3w{background:#fff}.a3w .in{display:flex;flex-direction:column;align-items:center;gap:12px;max-width:820px;margin-left:auto;margin-right:auto}
.a3w h2{font-size:clamp(30px,3.6vw,48px)}.a3w p{color:var(--muted);font-size:17px;line-height:1.7;margin:0}
.a3v{background:var(--cream)}.a3v .values-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.a3v article{display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 18px}
.a3v .ic{width:86px;height:86px;border-radius:50%;background:var(--navy);display:grid;place-items:center;box-shadow:0 0 0 8px #efe6d2}.a3v .ic svg{width:44px;height:44px;display:block}
.a3v b{display:none}.a3v h3{font-size:25px}.a3v p{color:var(--muted);margin:0;line-height:1.6;max-width:320px}
.a3l{background:#0f1b35}.a3l .g{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;max-width:1280px;margin:0 auto}
.a3l .md{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;padding:6px}
.a3l .ring{width:190px;height:190px;border-radius:50%;padding:6px;background:conic-gradient(from 200deg,#c9952c,#f0c760,#e85d26,#c9952c);margin-bottom:10px;box-shadow:0 0 50px rgba(240,180,80,.22)}
.a3l .ring img{width:100%;height:100%;border-radius:50%;object-fit:cover;border:4px solid #0f1b35;display:block}
.a3l h3{font-size:22px;color:#fff}.a3l .role{color:var(--gold2);font-weight:600;font-size:13.5px;margin:0;line-height:1.45}.a3l .more{color:#fff}
@media(max-width:1000px){.a3l .g{grid-template-columns:1fr 1fr}}
@media(max-width:900px){.a3v .values-grid{grid-template-columns:1fr}}
@media(max-width:760px){.a3h .in{padding:90px 0 56px}.a3l .ring{width:140px;height:140px}.a3l .g{gap:26px 12px}.a3l h3{font-size:18px}.a3l .role{font-size:12.5px}}
'''
    return html, css


# 4 ------------------------------------------------------------------ Split hero + page menu
def a4(P):
    L = P['leaders']
    nav = '<nav class="a4-nav" aria-label="On this page"><a href="#a4-who">Who we are</a><a href="#a4-val">What we stand on</a><a href="#a4-lead">Leaders</a><a href="#a4-visit">Visit</a></nav>'
    card = lambda i, x: ('<article class="ld">%s<div class="tx"><span class="k">%s</span><h3>%s</h3><p class="role">%s</p><p>%s</p>%s%s</div></article>' % (
        img(x), x['k'], x['name'], x['role'], x['paras'][0], badge(x), more(i, x['name'])))
    html = ('<section class="a4h"><div class="sp84"></div><div class="g"><div class="tx"><span class="k">%s</span><h1>%s</h1><p>%s</p><div class="acts"><a class="btn dark" href="/branches">Find a Church %s</a></div></div>'
            '<div class="ph"><img src="%s" alt="Worship at an MFM Mega Region 2 service"></div></div></section>' % (P['k'], P['h1'], P['sub'], ARW, P['hero_img']) + nav +
            '<section id="a4-who" class="section a4w"><div class="ed g"><div class="hd"><span class="k">%s</span><h2>%s</h2></div><div class="tx">%s</div></div></section>' % (P['who_k'], P['who_h'], ''.join('<p>%s</p>' % p for p in P['who_p'])) +
            '<section id="a4-val" class="section navy a4v"><div class="ed"><div class="hd"><span class="k lt">What we stand on</span><h2>Prayer. Deliverance. The Word.</h2></div><div class="steps values-grid">%s</div></div></section>' % ''.join('<article><b>%s</b><h3>%s</h3><p>%s</p></article>' % v for v in P['vals']) +
            verse(P) +
            '<section id="a4-lead" class="section a4l"><div class="ed"><div class="hd"><span class="k">Servants of the Most High</span><h2>Our leaders.</h2></div><div class="g">%s</div></div></section>' % ''.join(card(i, x) for i, x in enumerate(L)) +
            P['video'] + closing(P).replace('<section class="section ab-close', '<section id="a4-visit" class="section ab-close') + dialogs(P))
    css = '''
.a4h{background:var(--cream)}.a4h .sp84{height:84px;background:var(--navy)}
.a4h .g{display:grid;grid-template-columns:1fr 1fr;min-height:min(76vh,700px)}
.a4h .tx{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:60px var(--edge);text-align:center}
.a4h h1{font-size:clamp(42px,5.6vw,86px);line-height:1.02}.a4h .tx p{color:var(--muted);font-size:18px;line-height:1.6;max-width:520px;margin:0 0 8px}
.a4h .ph{position:relative;overflow:hidden}.a4h .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.a4-nav{position:sticky;top:80px;z-index:20;display:flex;justify-content:center;gap:6px;background:#fff;border-bottom:1px solid #ece6d8;padding:10px var(--edge);overflow-x:auto;scrollbar-width:none}
.a4-nav a{flex:none;min-height:40px;display:inline-flex;align-items:center;padding:0 16px;border-radius:100px;color:var(--ink);font:600 14px 'Inter Tight';text-decoration:none;border:1.5px solid #e3dccd}
.a4w{background:#fff}.a4w .g{display:grid;grid-template-columns:1fr 1.2fr;gap:56px;align-items:center;margin-left:max(var(--edge),calc((100% - 1180px)/2));margin-right:max(var(--edge),calc((100% - 1180px)/2))}
.a4w .hd{margin:0}.a4w .tx p{color:var(--muted);font-size:17px;line-height:1.75;margin:0 0 14px}
.a4v .steps{display:grid;grid-template-columns:repeat(3,1fr);position:relative}
.a4v .steps:before{content:"";position:absolute;left:16%;right:16%;top:34px;height:2px;background:linear-gradient(90deg,var(--gold),var(--fire))}
.a4v article{display:flex;flex-direction:column;align-items:center;gap:10px;padding:0 18px;position:relative;background:transparent!important;border:0!important}
.a4v b{width:68px;height:68px;border-radius:50%;background:var(--gold);color:var(--navy);display:grid;place-items:center;font:600 26px Fraunces,serif;box-shadow:0 0 0 8px rgba(201,149,44,.18)}
.a4v h3{font-size:25px;color:#fff;margin:6px 0 0}.a4v p{color:#c9d3e3;margin:0;line-height:1.6;max-width:300px}
.a4l{background:var(--cream)}.a4l .g{display:grid;grid-template-columns:1fr 1fr;gap:22px;max-width:1240px;margin:0 auto}
.a4l .ld{display:grid;grid-template-columns:210px 1fr;gap:22px;align-items:center;background:#fff;border:1px solid #ebe4d6;border-radius:20px;padding:18px}
.a4l .ld img{width:210px;height:250px;object-fit:cover;border-radius:14px;display:block}
.a4l .tx{display:flex;flex-direction:column;align-items:center;gap:6px}.a4l h3{font-size:23px}.a4l .role{color:#8a6414;font-weight:600;font-size:13.5px;margin:0}
.a4l .tx>p:not(.role){color:var(--muted);margin:0;line-height:1.55;font-size:14.5px;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
.a4l .more{color:var(--navy)}
@media(max-width:1000px){.a4l .g{grid-template-columns:1fr;max-width:640px}}
@media(max-width:900px){.a4h .g,.a4w .g{grid-template-columns:1fr}.a4h .ph{height:46vh;order:-1}.a4w .g{gap:16px}.a4v .steps{grid-template-columns:1fr;gap:28px}.a4v .steps:before{display:none}}
@media(max-width:760px){.a4-nav{justify-content:flex-start;top:70px}.a4l .ld{grid-template-columns:1fr}.a4l .ld img{width:100%;height:300px}}
'''
    return html, css


# 5 ------------------------------------------------------------------ Bento tiles (with pop-ups)
def a5(P):
    L = P['leaders']
    tile = lambda i, x, area: ('<button type="button" class="t lead" style="grid-area:%s" data-ld-open="ab-ld-%d" aria-haspopup="dialog">%s<span class="o"><span class="kk">%s</span><span class="nm">%s</span><span class="rl">%s</span><span class="mo">View profile</span></span></button>' % (
        area, i, img(x), x['k'], x['name'], x['role']))
    v = ''.join('<article class="t val" style="grid-area:v%s"><b>%s</b><h3>%s</h3><p>%s</p></article>' % (a[-1], a, b, c) for a, b, c in P['vals'])
    html = ('<section class="navy a1h a5h ctr"><img class="bg" src="%s" alt=""><div class="sh"></div><div class="ed in"><span class="k lt">%s</span><h1>%s</h1><p>%s</p></div></section>' % (P['hero_img'], P['k'], P['h1'], P['sub']) +
            '<section class="section a5"><div class="ed"><div class="hd"><span class="k">At a glance</span><h2>Mega Region 2 USA.</h2></div><div class="bento">'
            '<div class="t who" style="grid-area:wh"><span class="k">%s</span><h3>%s</h3>%s</div>'
            '<div class="t verse" style="grid-area:vs"><p>%s</p><b>%s</b></div>'
            '<div class="valt"><div class="values-grid">%s</div></div>%s%s%s%s'
            '<a class="t cta" style="grid-area:ct" href="/branches"><h3>Find a church near you</h3><p>%s</p><span class="btn">Find a Church %s</span></a>'
            '<a class="t pr" style="grid-area:pr" href="/events"><h3>Weekly programmes and special events</h3><span class="btn dark">Explore Programs %s</span></a>'
            '</div></div></section>' % (P['who_k'], P['who_h'], ''.join('<p>%s</p>' % p for p in P['who_p']), P['verse'], P['verse_ref'], v,
                                        tile(0, L[0], 'l0'), tile(1, L[1], 'l1'), tile(2, L[2], 'l2'), tile(3, L[3], 'l3'), P['c_p'], ARW, ARW) +
            P['video'] + dialogs(P))
    css = '''
.a5h{min-height:min(66vh,600px)!important}
.a5{background:var(--cream)}
.a5 .bento{display:grid;grid-template-columns:repeat(4,1fr);grid-template-areas:'wh wh vs vs' 'l0 l1 l2 l3' 'v1 v2 v3 pr' 'ct ct ct pr';gap:14px}
.a5 .t{border-radius:20px;overflow:hidden;position:relative;background:#fff;border:1px solid #ebe4d6;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:26px;gap:8px;min-width:0}
.a5 .who h3{font-size:clamp(24px,2.2vw,32px)}.a5 .who p{color:var(--muted);margin:0;line-height:1.6;max-width:560px}
.a5 .verse{background:#b3471b;border:0}.a5 .verse p{font:500 clamp(20px,1.9vw,26px)/1.42 Fraunces,serif;color:#fff;margin:0;max-width:520px}.a5 .verse b{font:700 11px 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;color:#fff3d6}
.a5 button.lead{padding:0;border:0;min-height:400px;cursor:pointer;font:inherit;color:#fff;background:var(--navy);justify-content:flex-end}
.a5 .lead img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .5s}.a5 .lead:hover img{transform:scale(1.03)}
.a5 .lead .o{position:relative;width:100%;padding:80px 14px 18px;background:linear-gradient(180deg,transparent,rgba(14,26,51,.95) 55%);display:flex;flex-direction:column;align-items:center;gap:4px}
.a5 .lead .kk{font:700 10px 'Inter Tight',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--gold2)}
.a5 .lead .nm{font:500 19px/1.2 Fraunces,serif}.a5 .lead .rl{font-size:12px;line-height:1.35;color:#dfe5ee}
.a5 .lead .mo{margin-top:8px;display:inline-flex;align-items:center;min-height:32px;padding:0 14px;border-radius:100px;background:var(--gold);color:var(--navy);font:700 12px 'Inter Tight',sans-serif}
.a5 .lead:focus-visible{outline:3px solid var(--gold2);outline-offset:3px}
.a5 .val b{font:600 28px Fraunces,serif;color:#8a6414}.a5 .val h3{font-size:23px}.a5 .val p{margin:0;color:var(--muted);font-size:14px;line-height:1.55}
.a5 .cta{background:var(--navy);border:0;color:#fff;text-decoration:none}.a5 .cta h3{color:#fff;font-size:28px}.a5 .cta p{color:#c9d3e3;margin:0 0 8px;max-width:560px}
.a5 .pr{background:linear-gradient(160deg,#c2471a,#e85d26);border:0;color:#fff;text-decoration:none}.a5 .pr h3{color:#fff;font-size:24px}
@media(min-width:761px){.a5 .valt,.a5 .valt .values-grid{display:contents!important}.a5 .valt .sw-dots{display:none!important}}
@media(max-width:1000px) and (min-width:761px){.a5 .bento{grid-template-columns:1fr 1fr;grid-template-areas:'wh wh' 'vs vs' 'l0 l1' 'l2 l3' 'v1 v2' 'v3 pr' 'ct ct'}}
@media(max-width:760px){.a5 .bento{grid-template-columns:1fr 1fr;grid-template-areas:'wh wh' 'vs vs' 'l0 l1' 'l2 l3' 'vv vv' 'ct ct' 'pr pr';gap:10px}
 .a5 .t{padding:20px 16px}.a5 button.lead{min-height:290px}.a5 .lead .kk{display:none}.a5 .lead .nm{font-size:16px}.a5 .lead .o{padding:60px 8px 12px}
 .a5 .valt{grid-area:vv;min-width:0}.a5 .valt .values-grid{padding:2px 0 6px!important}.a5 .valt .values-grid>*{flex:0 0 82%!important;max-width:82%!important;grid-area:auto!important}
 .a5 .valt .val{background:#fff!important;border:1px solid #ebe4d6!important;border-top:3px solid var(--gold)!important;border-radius:0 0 18px 18px;padding:22px 16px!important;min-height:160px}}
'''
    return html, css


DESIGNS = [('Cinematic', a1), ('Editorial story + journey', a2), ('Navy & scripture', a3), ('Split hero + page menu', a4), ('Bento tiles', a5)]


def variants(src, picker):
    P = parts(src)
    out = {}
    files = ['about-%d.html' % (i + 1) for i in range(len(DESIGNS))]
    for i, (name, fn) in enumerate(DESIGNS):
        html, css = fn(P)
        t = re.sub(r'<main id="content"[^>]*>.*?</main>', lambda _: '<main id="content" class="wf ab">%s</main>' % html, src, count=1, flags=re.S)
        t = t.replace('</head>', '<style>%s%s%s</style>\n</head>' % (BASE, ABASE, css), 1)
        t = t.replace('</body>', '<script src="/js/women.js" defer></script>' + picker('About', i + 1, [d[0] for d in DESIGNS], files) + '\n</body>', 1)
        out[files[i]] = t
    return out
