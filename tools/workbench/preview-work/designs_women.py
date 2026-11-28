"""Preview-only: 5 Women Foundation page designs (computer + phone), same content as women.html.
Every design keeps the two auto-built blocks the site's sync relies on:
  - 'Upcoming programmes' + <div class="events-grid"> (tools/build_site.py)
  - '<span class="eyebrow">Messages for women</span> ... <div class="message-grid">...</div></div></section>' (tools/sync_media.py)
"""
import re

ARW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>'


def grab(t, a, b, start=0):
    i = t.index(a, start); j = t.index(b, i) + len(b)
    return t[i:j]


def parts(src):
    m = src[src.index('<main'):src.index('</main>')]
    P = {}
    hero = grab(m, '<section class="page-hero">', '</section>')
    P['hero_img'] = re.search(r'<img src="([^"]+)"', hero).group(1)
    P['h_eyebrow'] = 'MFM Women Foundation'
    P['h1a'], P['h1b'] = 'Prevailing women.', 'Transforming generations.'
    P['h_sub'] = re.search(r'</h1><p>(.*?)</p>', hero).group(1)
    leaders = []
    for blk in re.findall(r'(<(?:section|div) class="(?:section wrap )?(?:wrap )?leadership-feature[^"]*">.*?</div></div>)', m, re.S):
        leaders.append(dict(
            img=re.search(r'<img src="([^"]+)"', blk).group(1),
            alt=re.search(r'alt="([^"]*)"', blk).group(1),
            k=re.search(r'<span class="eyebrow">(.*?)</span>', blk).group(1),
            name=re.search(r'<h2>(.*?)</h2>', blk).group(1),
            role=re.search(r'<p class="leader-role">(.*?)</p>', blk).group(1),
            paras=re.findall(r'<p>(.*?)</p>', blk.split('</p>',1)[1]),
            socials=re.search(r'(<div class="leader-socials">.*?</div>)', blk, re.S).group(1)))
    P['leaders'] = leaders[:2]
    pil = grab(m, '<section class="section wrap"><div class="section-head"><div><span class="eyebrow">Three pillars</span>', '</section>')
    P['pillars'] = re.findall(r'<article><b>(\d+)</b><h3>(.*?)</h3><p>(.*?)</p></article>', pil)
    P['p_k'], P['p_h'] = 'Three pillars', 'Prayer. Service. Transformation.'
    P['p_sub'] = re.search(r'</h2></div><p>(.*?)</p>', pil).group(1)
    ev = grab(m, '<section class="section ministry-feed">', '</section>')
    P['events_grid'] = re.search(r'(<div class="events-grid">.*?</div>)</div></section>', ev, re.S).group(1)
    mo = grab(m, '<section class="section women-moments"', '</section>')
    P['mo'] = dict(
        title=re.search(r'<h2 id="wmTitle">(.*?)</h2>', mo).group(1),
        meta=re.search(r'<p class="wm-meta">(.*?)</p>', mo).group(1),
        text=re.search(r'</p><p>(.*?)</p><blockquote>', mo).group(1),
        verse=re.search(r'<blockquote>(.*?)<cite>', mo).group(1),
        cite=re.search(r'<cite>(.*?)</cite>', mo).group(1),
        photos=re.findall(r'(<picture>.*?</picture>)', mo, re.S),
        photos_href='/gallery-women-retreat-2026', watch_href='/messages/rekindling-the-altar-women-foundation-retreat-2026')
    msg = grab(m, '<section class="section cream"><div class="wrap"><div class="section-head"><div><span class="eyebrow">Messages for women</span>', '</section>')
    P['cards'] = re.search(r'<div class="message-grid">(.*)</div></div></section>', msg, re.S).group(1)
    return P


def leader_card(L, cls='ld'):
    return ('<article class="%s"><div class="ph"><img src="%s" alt="%s" loading="lazy" decoding="async"></div><div class="tx"><span class="k">%s</span>'
            '<h3>%s</h3><p class="role">%s</p>%s%s</div></article>') % (cls, L['img'], L['alt'], L['k'], L['name'], L['role'],
                                                                     ''.join('<p>%s</p>' % p for p in L['paras'][:2]), L['socials'])


def pillars(P, cls='values-grid'):
    return '<div class="%s">%s</div>' % (cls, ''.join('<article><b>%s</b><h3>%s</h3><p>%s</p></article>' % x for x in P['pillars']))


def events(P, cls=''):
    return ('<section class="section ministry-feed wf-ev %s"><div class="ed"><div class="hd"><span class="k">Upcoming programmes</span><h2>Women Foundation events.</h2></div>%s</div></section>'
            % (cls, P['events_grid']))


def messages(P, cls='', h='Watch and grow.'):
    return ('<section class="section wf-msg %s"><div class="ed"><div class="hd"><span class="eyebrow">Messages for women</span><h2>%s</h2></div><div class="message-grid">%s</div></div></section>'
            % (cls, h, P['cards']))


def moments_btns(P):
    mo = P['mo']
    return ('<div class="acts"><a class="btn" href="%s">See the photos %s</a><a class="btn ghost" href="%s">Watch the retreat %s</a></div>' % (mo['photos_href'], ARW, mo['watch_href'], ARW))


BASE = '''
.wf *{box-sizing:border-box}
.wf{--navy:#142240;--deep:#0e1a33;--gold:#c9952c;--gold2:#f0c760;--fire:#e85d26;--cream:#f8f6f1;--ink:#1d2940;--muted:#596170;--edge:24px;font-family:'Inter Tight',sans-serif;color:var(--ink)}
@media(min-width:1200px){.wf{--edge:clamp(32px,3.2vw,64px)}}
main.wf :is(h1,h2,h3,p,blockquote,li,article){text-align:center}
main.wf .message-card :is(h3,p,span,div){text-align:center}
main.wf .message-card>div>div{display:flex;justify-content:center;flex-wrap:wrap;gap:6px}main.wf .message-card small{display:block;text-align:center}
.wf .ed{margin-left:var(--edge);margin-right:var(--edge)}
.wf h1,.wf h2,.wf h3{font-family:Fraunces,Georgia,serif;margin:0;font-weight:500}
.wf .k{display:inline-flex;align-items:center;justify-content:center;gap:12px;font:700 12px/1 'Inter Tight',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#a84a20}
.wf .k.lt{color:var(--gold2)}
.wf .k:before,.wf .k:after{content:"";width:26px;height:1px;background:currentColor;opacity:.8}
.wf .hd{text-align:center;margin:0 auto 34px;max-width:760px;display:flex;flex-direction:column;align-items:center;gap:12px}
.wf .hd h2{font-size:clamp(32px,4vw,54px);line-height:1.06}
.wf .hd p{color:var(--muted);line-height:1.65;margin:0}
.wf .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:50px;padding:0 26px;border-radius:100px;background:var(--gold);color:var(--navy)!important;font:700 15px 'Inter Tight',sans-serif;text-decoration:none}
.wf .btn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2}
.wf .btn.ghost{background:transparent;color:#fff!important;border:1.5px solid rgba(255,255,255,.5)}
.wf .btn.dark{background:var(--navy);color:#fff!important}
.wf .acts{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
.wf .navy{background:var(--navy);color:#fff;position:relative;overflow:hidden}
.wf .navy:before{content:"";position:absolute;left:50%;top:-30%;width:min(760px,90vw);height:150%;transform:translateX(-50%);background:linear-gradient(180deg,rgba(255,220,150,.13),transparent 70%);clip-path:polygon(40% 0,60% 0,100% 100%,0 100%);pointer-events:none}
.wf .navy:after{content:"";position:absolute;inset:0;background:url(img/grain.png);opacity:.06;pointer-events:none}
.wf .navy>*{position:relative;z-index:1}
.wf .navy .hd h2{color:#fff}.wf .navy .hd p{color:#c9d3e3}
.wf .leader-socials{display:flex;gap:10px;justify-content:center;margin-top:14px}
.wf .leader-socials a{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;border:1px solid currentColor;color:inherit;opacity:.85}
.wf .leader-socials svg{width:18px;height:18px}
.wf .section{padding:76px 0}
.wf-msg{background:var(--cream)}
.wf-msg .message-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.wf-ev .events-grid{max-width:1000px;margin:0 auto}
.wf-ev .dept-empty{text-align:center;color:var(--muted);background:#fff;border:1px dashed #d9d1c2;border-radius:14px;padding:22px}
@media(max-width:900px){.wf-msg .message-grid{grid-template-columns:1fr}}
.w-hero{min-height:min(88vh,820px);display:flex;align-items:center;justify-content:center;text-align:center;padding:120px 0 80px}
.w-hero .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.w-hero .sh{position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,26,51,.55),rgba(14,26,51,.82));z-index:0}
.w-hero h1{font-size:clamp(42px,7vw,104px);line-height:1.02;color:#fff;margin:18px 0 16px;letter-spacing:-.02em}
.w-hero h1 em{display:block;color:var(--gold2)}
.w-hero p{max-width:640px;margin:0 auto 28px;color:#dfe5ee;font-size:18px;line-height:1.6}
@media(max-width:760px){.w-hero{min-height:78vh;padding:110px 0 60px}.w-hero p{font-size:16px}.wf .section{padding:54px 0}.wf .hd{margin-bottom:24px}}
'''


def hero_cinematic(P, mini=False):
    return ('<section class="navy w-hero ctr"><img class="bg" src="%s" alt="MFM Women Foundation Mega Region 2"><div class="sh"></div><div class="ed in">'
            '<span class="k lt">%s</span><h1>%s <em>%s</em></h1><p>%s</p><div class="acts"><a class="btn" href="#messages">Watch the messages %s</a><a class="btn ghost" href="%s">See the photos %s</a></div></div></section>') % (
        P['hero_img'], P['h_eyebrow'], P['h1a'], P['h1b'], P['h_sub'], ARW, P['mo']['photos_href'], ARW)


def w1(P):
    mo = P['mo']
    html = (hero_cinematic(P) +
            '<section class="section navy w1-lead"><div class="ed"><div class="hd"><span class="k lt">Our mothers in the faith</span><h2>Led in prayer and the Word.</h2></div>'
            '<div class="g">%s</div></div></section>' % ''.join(leader_card(L) for L in P['leaders']) +
            '<section class="section w1-pil"><div class="ed"><div class="hd"><span class="k">%s</span><h2>%s</h2><p>%s</p></div>%s</div></section>' % (P['p_k'], P['p_h'], P['p_sub'], pillars(P)) +
            '<section class="w1-mo"><div class="mos">%s</div><div class="card ctr"><span class="k">Ministry moments</span><h2>%s</h2><p class="meta">%s</p><p>%s</p><blockquote>%s<cite>%s</cite></blockquote>%s</div></section>' % (
                ''.join('<a href="%s">%s</a>' % (mo['photos_href'], ph) for ph in mo['photos']), mo['title'], mo['meta'], mo['text'], mo['verse'], mo['cite'], moments_btns(P).replace('btn ghost', 'btn dark')) +
            messages(P).replace('<section class="section wf-msg ', '<section id="messages" class="section wf-msg ') + events(P))
    css = '''
.w1-lead .g{display:grid;grid-template-columns:1fr 1fr;gap:26px;max-width:1180px;margin:0 auto}
.w1-lead .ld{background:rgba(255,255,255,.06);border:1px solid rgba(240,199,96,.3);border-radius:22px;overflow:hidden;text-align:center;display:flex;flex-direction:column}
.w1-lead .ld .ph{aspect-ratio:4/3.4;overflow:hidden}.w1-lead .ld .ph img{width:100%;height:100%;object-fit:cover;object-position:50% 20%}
.w1-lead .ld .tx{padding:28px 30px 30px;display:flex;flex-direction:column;align-items:center;gap:8px}
.w1-lead .ld h3{font-size:clamp(24px,2.4vw,32px);color:#fff;margin-top:6px}
.w1-lead .ld .role{color:var(--gold2);font-weight:600;font-size:14px;margin:0}
.w1-lead .ld p{color:#c9d3e3;line-height:1.6;margin:0;font-size:15px}
.w1-pil{background:var(--cream)}
.w1-pil .values-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.w1-pil .values-grid article{background:#fff;border-top:3px solid var(--gold);padding:34px 28px;text-align:center;border-radius:0 0 16px 16px;box-shadow:0 12px 30px rgba(20,34,64,.06)}
.w1-pil .values-grid b{font:600 30px Fraunces,serif;color:#8a6414}
.w1-pil .values-grid h3{font-size:24px;margin:10px 0 8px}.w1-pil .values-grid p{color:var(--muted);margin:0;line-height:1.6}
.w1-mo{position:relative;padding:0;min-height:620px;display:flex;align-items:center;justify-content:center}
.w1-mo .mos{position:absolute;inset:0;display:grid;grid-template-columns:repeat(4,1fr)}
.w1-mo .mos a,.w1-mo .mos picture,.w1-mo .mos img{display:block;width:100%;height:100%;object-fit:cover}
.w1-mo:after{content:"";position:absolute;inset:0;background:rgba(14,26,51,.45)}
.w1-mo .card{position:relative;z-index:1;background:#fff;max-width:620px;margin:60px var(--edge);padding:40px;border-radius:22px;box-shadow:0 30px 70px rgba(0,0,0,.35);display:flex;flex-direction:column;align-items:center;gap:10px}
.w1-mo .card h2{font-size:clamp(32px,3.6vw,48px)}.w1-mo .meta{color:#8a6414;font-weight:600;font-size:14px;margin:0}.w1-mo .card p{color:var(--muted);margin:0;line-height:1.6}
.w1-mo blockquote{margin:8px 0 14px;font:italic 500 19px/1.5 Fraunces,serif;color:#5a4a28}.w1-mo cite{display:block;font:700 11px 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-top:6px;font-style:normal}
@media(max-width:900px){.w1-lead .g{grid-template-columns:1fr;max-width:560px}.w1-pil .values-grid{grid-template-columns:1fr}}
@media(max-width:760px){.w1-mo{min-height:0;flex-direction:column}.w1-mo .mos{position:relative;grid-template-columns:1fr 1fr;height:340px;width:100%}.w1-mo:after{display:none}.w1-mo .card{margin:-60px 18px 40px;padding:28px 22px}}
'''
    return html, css


def w2(P):
    mo = P['mo']
    L = P['leaders']
    spreads = ''.join(
        '<article class="sp %s"><div class="ph"><img src="%s" alt="%s" loading="lazy"></div><div class="tx"><span class="k">%s</span><h3>%s</h3><p class="role">%s</p><p class="q">&ldquo;%s&rdquo;</p><p>%s</p>%s</div></article>' % (
            'rev' if i else '', x['img'], x['alt'], x['k'], x['name'], x['role'], x['paras'][1] if len(x['paras']) > 1 else x['paras'][0], x['paras'][0], x['socials'])
        for i, x in enumerate(L))
    html = ('<section class="w2-hero ctr"><div class="sp84"></div><div class="ed in"><span class="k">%s</span><h1>%s<br><em>%s</em></h1><p>%s</p></div>'
            '<div class="strip">%s</div></section>' % (P['h_eyebrow'], P['h1a'], P['h1b'], P['h_sub'], ''.join('<a href="%s">%s</a>' % (mo['photos_href'], ph) for ph in mo['photos'])) +
            '<section class="section w2-lead"><div class="ed">%s</div></section>' % spreads +
            '<section class="section navy w2-pil"><div class="ed"><div class="hd"><span class="k lt">%s</span><h2>%s</h2><p>%s</p></div><ol class="lst values-grid">%s</ol></div></section>' % (
                P['p_k'], P['p_h'], P['p_sub'], ''.join('<li><b>%s</b><div><h3>%s</h3><p>%s</p></div></li>' % x for x in P['pillars'])) +
            '<section class="section w2-mo"><div class="ed g"><div class="tx ctr"><span class="k">Ministry moments</span><h2>%s</h2><p class="meta">%s</p><p>%s</p><blockquote>%s<cite>%s</cite></blockquote>%s</div>'
            '<a class="big" href="%s">%s</a></div></section>' % (mo['title'], mo['meta'], mo['text'], mo['verse'], mo['cite'], moments_btns(P).replace('btn ghost', 'btn dark'), mo['photos_href'], mo['photos'][0]) +
            messages(P, 'w2m') + events(P))
    css = '''
.w2-hero{background:var(--cream);text-align:center;padding-bottom:0}
.w2-hero .sp84{height:84px;background:var(--navy)}
.w2-hero .in{padding:64px 0 44px}
.w2-hero h1{font-size:clamp(46px,7.4vw,112px);line-height:1;letter-spacing:-.03em;color:var(--ink);margin:18px 0 18px}
.w2-hero h1 em{color:#a84a20;font-style:italic}
.w2-hero p{max-width:640px;margin:0 auto;color:var(--muted);font-size:18px;line-height:1.6}
.w2-hero .strip{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;height:min(38vw,460px)}
.w2-hero .strip a,.w2-hero .strip picture,.w2-hero .strip img{display:block;width:100%;height:100%;object-fit:cover}
.w2-lead{background:#fff}
.w2-lead .sp{display:grid;grid-template-columns:.85fr 1.15fr;gap:clamp(30px,5vw,80px);align-items:center;max-width:1180px;margin:0 auto 70px}
.w2-lead .sp:last-child{margin-bottom:0}
.w2-lead .sp.rev .ph{order:2}
.w2-lead .ph{border-radius:22px;overflow:hidden;aspect-ratio:4/5}.w2-lead .ph img{width:100%;height:100%;object-fit:cover;object-position:50% 20%}
.w2-lead .tx{text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px}
.w2-lead h3{font-size:clamp(30px,3.4vw,46px);line-height:1.08}
.w2-lead .role{color:#8a6414;font-weight:600;margin:0}
.w2-lead .q{font:italic 500 clamp(20px,2vw,26px)/1.45 Fraunces,serif;color:var(--ink);margin:10px 0;max-width:560px}
.w2-lead .tx p{color:var(--muted);line-height:1.65;margin:0;max-width:560px}
.w2-pil .lst{list-style:none;margin:0 auto;padding:0;max-width:1180px;display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.w2-pil .lst li{display:flex;flex-direction:column;align-items:center;gap:12px;padding:10px 34px;border-left:1px solid rgba(240,199,96,.3)}
.w2-pil .lst li:first-child{border-left:0}
.w2-pil .lst b{font:500 88px/1 Fraunces,serif;color:var(--gold2)}
.w2-pil .lst h3{font-size:clamp(26px,2.6vw,34px);color:#fff}.w2-pil .lst p{color:#c9d3e3;margin:6px 0 0;line-height:1.6}
.w2-mo .g{display:grid;grid-template-columns:1fr 1fr;gap:clamp(30px,5vw,70px);align-items:center;max-width:1180px;margin:0 auto}
.w2-mo .tx{display:flex;flex-direction:column;align-items:center;gap:10px}
.w2-mo h2{font-size:clamp(34px,4vw,56px)}.w2-mo .meta{color:#8a6414;font-weight:600;margin:0}.w2-mo .tx p{color:var(--muted);line-height:1.65;margin:0;max-width:520px}
.w2-mo blockquote{margin:6px 0 14px;font:italic 500 20px/1.5 Fraunces,serif;color:#5a4a28}.w2-mo cite{display:block;font:700 11px 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-top:6px;font-style:normal}
.w2-mo .big{display:block;border-radius:22px;overflow:hidden;aspect-ratio:4/5}.w2-mo .big picture,.w2-mo .big img{display:block;width:100%;height:100%;object-fit:cover}
.w2m .message-card:first-child{grid-column:span 2;grid-row:span 2}.w2m .message-card:first-child{display:flex;flex-direction:column}.w2m .message-card:first-child>a{flex:none;height:auto!important;aspect-ratio:16/9;position:relative;overflow:hidden}.w2m .message-card:first-child>a img{position:absolute;left:0;top:-17%;width:100%;height:134%;object-fit:cover}.w2m .message-card:first-child>div{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center}.w2m .message-card:first-child h3{font-size:26px}
@media(max-width:900px){.w2-lead .sp,.w2-mo .g,.w2-pil .lst{grid-template-columns:1fr}.w2-pil .lst li{border-left:0;padding:16px 0}.w2-lead .sp.rev .ph{order:0}.w2-lead .ph{max-width:460px;margin:0 auto;aspect-ratio:1}.w2m .message-card:first-child{grid-column:auto;grid-row:auto;display:block}.w2m .message-card:first-child>a{min-height:0;height:205px!important}}
@media(max-width:760px){.w2-hero .strip{grid-template-columns:1fr 1fr;height:auto}.w2-hero .strip a{aspect-ratio:1}.w2-hero .in{padding:44px 0 32px}.w2-pil .lst b{font-size:64px}.w2-mo .big{width:100%;max-width:460px;margin:0 auto;aspect-ratio:1}}
'''
    return html, css


def w3(P):
    mo = P['mo']
    meds = ''.join('<article class="md"><div class="ring"><img src="%s" alt="%s" loading="lazy"></div><span class="k lt">%s</span><h3>%s</h3><p class="role">%s</p><p>%s</p>%s</article>' % (
        x['img'], x['alt'], x['k'], x['name'], x['role'], x['paras'][0], x['socials']) for x in P['leaders'])
    icons = ['<svg viewBox="0 0 64 64"><path d="M32 5c10 9 15 17 15 26a15 15 0 0 1-30 0c0-7 3.8-12.6 7.4-16.4.3 5 2.6 8.2 5.4 8.9C27.9 16.6 29.3 10.7 32 5Z" fill="#e85d26"/><path d="M32 30c3.6 3.4 5.4 6.2 5.4 9.4a5.4 5.4 0 0 1-10.8 0c0-3 1.8-5.6 5.4-9.4Z" fill="#ffd27a"/></svg>',
             '<svg viewBox="0 0 64 64" style="fill:none;stroke:#f0c760;stroke-width:3.4;stroke-linecap:round;stroke-linejoin:round"><path d="M12 34c8-9 18-15 20-15s12 6 20 15M18 46h28M32 19V8"/></svg>',
             '<svg viewBox="0 0 64 64" style="fill:none;stroke:#f0c760;stroke-width:3.4;stroke-linecap:round"><circle cx="32" cy="32" r="20"/><path d="M32 12v40M12 32h40"/></svg>']
    html = ('<section class="navy w3-hero ctr"><div class="sp84"></div><div class="ed in"><span class="k lt">%s</span><h1>%s <em>%s</em></h1><p>%s</p>'
            '<p class="vs">%s<b>%s</b></p></div></section>' % (P['h_eyebrow'], P['h1a'], P['h1b'], P['h_sub'], mo['verse'], mo['cite']) +
            '<section class="section navy w3-lead"><div class="ed"><div class="hd"><span class="k lt">Our mothers in the faith</span><h2>Led in prayer and the Word.</h2></div><div class="g">%s</div></div></section>' % meds +
            '<section class="section w3-pil"><div class="ed"><div class="hd"><span class="k">%s</span><h2>%s</h2><p>%s</p></div><div class="values-grid">%s</div></div></section>' % (
                P['p_k'], P['p_h'], P['p_sub'], ''.join('<article><span class="ic">%s</span><h3>%s</h3><p>%s</p></article>' % (icons[i], x[1], x[2]) for i, x in enumerate(P['pillars']))) +
            '<section class="w3-mo"><div class="band">%s</div><div class="ed tx ctr"><span class="k">Ministry moments</span><h2>%s</h2><p class="meta">%s</p><p>%s</p>%s</div></section>' % (
                ''.join('<a href="%s">%s</a>' % (mo['photos_href'], ph) for ph in mo['photos']), mo['title'], mo['meta'], mo['text'], moments_btns(P).replace('btn ghost', 'btn dark')) +
            messages(P) + events(P))
    css = '''
.w3-hero .in{padding:90px 0 80px}
.w3-hero h1{font-size:clamp(42px,6.6vw,96px);line-height:1.02;color:#fff;margin:18px 0 16px}
.w3-hero h1 em{display:block;color:var(--gold2)}
.w3-hero p{max-width:640px;margin:0 auto;color:#c9d3e3;font-size:18px;line-height:1.6}
.w3-hero .vs{margin-top:30px;font:italic 500 clamp(19px,2vw,24px)/1.5 Fraunces,serif;color:#e9d9b4;max-width:700px}
.w3-hero .vs b{display:block;font:700 11px 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;color:var(--gold2);margin-top:10px;font-style:normal}
.w3-lead{background:#0f1b35}
.w3-lead .g{display:grid;grid-template-columns:1fr 1fr;gap:40px;max-width:1100px;margin:0 auto}
.w3-lead .md{text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 20px}
.w3-lead .ring{width:220px;height:220px;border-radius:50%;padding:6px;background:conic-gradient(from 200deg,#c9952c,#f0c760,#e85d26,#c9952c);box-shadow:0 0 60px rgba(240,180,80,.25);margin-bottom:10px}
.w3-lead .ring img{width:100%;height:100%;border-radius:50%;object-fit:cover;object-position:50% 18%;border:4px solid #0f1b35}
.w3-lead h3{font-size:clamp(24px,2.4vw,32px);color:#fff}.w3-lead .role{color:var(--gold2);font-weight:600;font-size:14px;margin:0}.w3-lead .md p{color:#c9d3e3;line-height:1.6;margin:0;max-width:440px}
.w3-pil{background:#fff}
.w3-pil .values-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.w3-pil article{text-align:center;padding:10px 20px;display:flex;flex-direction:column;align-items:center;gap:10px}
.w3-pil .ic{width:86px;height:86px;border-radius:50%;background:var(--navy);display:grid;place-items:center;box-shadow:0 0 0 8px #f2ead6}
.w3-pil .ic svg{width:44px;height:44px;display:block}.w3-pil .ic svg *{vector-effect:none}
.w3-pil h3{font-size:25px}.w3-pil p{color:var(--muted);margin:0;line-height:1.6;max-width:320px}
.w3-mo{background:var(--cream);padding:0 0 70px}
.w3-mo .band{display:grid;grid-template-columns:repeat(4,1fr);height:min(30vw,380px)}
.w3-mo .band a,.w3-mo .band picture,.w3-mo .band img{display:block;width:100%;height:100%;object-fit:cover}
.w3-mo .tx{max-width:760px;margin:-60px auto 0;background:#fff;border-radius:22px;padding:40px;position:relative;box-shadow:0 24px 60px rgba(20,34,64,.12);display:flex;flex-direction:column;align-items:center;gap:10px}
.w3-mo h2{font-size:clamp(32px,3.8vw,50px)}.w3-mo .meta{color:#8a6414;font-weight:600;margin:0}.w3-mo .tx p{color:var(--muted);margin:0;line-height:1.6}
@media(max-width:900px){.w3-lead .g,.w3-pil .values-grid{grid-template-columns:1fr}}
@media(max-width:760px){.w3-hero .in{padding:60px 0 56px}.w3-lead .ring{width:170px;height:170px}.w3-mo .band{grid-template-columns:1fr 1fr;height:300px}.w3-mo .tx{margin:-40px 18px 0;padding:28px 20px}.w3-mo{padding-bottom:36px}}
'''
    return html, css


def w4(P):
    mo = P['mo']
    nav = '<nav class="w4-nav" aria-label="On this page"><a href="#w4-lead">Leaders</a><a href="#w4-pil">Pillars</a><a href="#w4-mo">Moments</a><a href="#messages">Messages</a><a href="#w4-ev" id="w4-evlink">Events</a></nav><script>addEventListener("load",function(){setTimeout(function(){var s=document.getElementById("w4-ev"),a=document.getElementById("w4-evlink");if(s&&a&&getComputedStyle(s).display==="none")a.remove();},400);});</script>'
    lead = ''.join('<article class="ld"><img src="%s" alt="%s" loading="lazy"><div class="tx"><span class="k">%s</span><h3>%s</h3><p class="role">%s</p><p>%s</p>%s</div></article>' % (
        x['img'], x['alt'], x['k'], x['name'], x['role'], x['paras'][0], x['socials']) for x in P['leaders'])
    html = ('<section class="w4-hero"><div class="sp84"></div><div class="g"><div class="tx ctr"><span class="k">%s</span><h1>%s <em>%s</em></h1><p>%s</p>'
            '<div class="acts"><a class="btn dark" href="#messages">Watch the messages %s</a></div></div><div class="ph"><img src="%s" alt="MFM Women Foundation Mega Region 2"></div></div></section>' % (
                P['h_eyebrow'], P['h1a'], P['h1b'], P['h_sub'], ARW, P['hero_img']) + nav +
            '<section id="w4-lead" class="section w4-lead"><div class="ed"><div class="hd"><span class="k">Leadership</span><h2>Our mothers in the faith.</h2></div><div class="g">%s</div></div></section>' % lead +
            '<section id="w4-pil" class="section navy w4-pil"><div class="ed"><div class="hd"><span class="k lt">%s</span><h2>%s</h2><p>%s</p></div><div class="steps values-grid">%s</div></div></section>' % (
                P['p_k'], P['p_h'], P['p_sub'], ''.join('<article><b>%s</b><h3>%s</h3><p>%s</p></article>' % x for x in P['pillars'])) +
            '<section id="w4-mo" class="section w4-mo"><div class="ed"><div class="hd"><span class="k">Ministry moments</span><h2>%s</h2><p>%s &middot; %s</p></div><div class="grid">%s</div>'
            '<blockquote class="ctr">%s<cite>%s</cite></blockquote>%s</div></section>' % (
                mo['title'], mo['meta'], mo['text'], ''.join('<a href="%s">%s</a>' % (mo['photos_href'], ph) for ph in mo['photos']), mo['verse'], mo['cite'], moments_btns(P).replace('btn ghost', 'btn dark')) +
            messages(P).replace('<section class="section wf-msg ', '<section id="messages" class="section wf-msg ') + events(P).replace('<section class="section ministry-feed', '<section id="w4-ev" class="section ministry-feed'))
    css = '''
.w4-hero{background:var(--cream)}
.w4-hero .sp84{height:84px;background:var(--navy)}
.w4-hero .g{display:grid;grid-template-columns:1fr 1fr;min-height:min(78vh,720px)}
.w4-hero .tx{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:60px var(--edge)}
.w4-hero h1{font-size:clamp(40px,5.4vw,84px);line-height:1.02;color:var(--ink)}
.w4-hero h1 em{display:block;color:#a84a20}
.w4-hero p{color:var(--muted);font-size:18px;line-height:1.6;max-width:520px;margin:0 0 10px}
.w4-hero .ph{position:relative;overflow:hidden}.w4-hero .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.w4-nav{position:sticky;top:80px;z-index:20;display:flex;justify-content:center;gap:6px;background:#fff;border-bottom:1px solid #ece6d8;padding:10px var(--edge);overflow-x:auto;scrollbar-width:none}
.w4-nav a{flex:none;min-height:40px;display:inline-flex;align-items:center;padding:0 16px;border-radius:100px;color:var(--ink);font:600 14px 'Inter Tight';text-decoration:none;border:1.5px solid #e3dccd}
.w4-nav a:hover{background:var(--navy);color:#fff;border-color:var(--navy)}
.w4-lead .g{display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:1180px;margin:0 auto}
.w4-lead .ld{display:grid;grid-template-columns:200px 1fr;gap:22px;align-items:center;background:#fff;border:1px solid #ebe4d6;border-radius:20px;padding:20px}
.w4-lead .ld img{width:200px;height:240px;object-fit:cover;object-position:50% 18%;border-radius:14px}
.w4-lead .tx{text-align:center;display:flex;flex-direction:column;align-items:center;gap:6px}
.w4-lead h3{font-size:24px}.w4-lead .role{color:#8a6414;font-weight:600;font-size:13.5px;margin:0}.w4-lead .tx p{color:var(--muted);margin:0;line-height:1.55;font-size:14.5px}
.w4-lead .leader-socials a{width:38px;height:38px;color:var(--ink)}
.w4-pil .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:0;position:relative}
.w4-pil .steps:before{content:"";position:absolute;left:16%;right:16%;top:34px;height:2px;background:linear-gradient(90deg,var(--gold),var(--fire))}
.w4-pil .values-grid article{background:transparent!important;border:0!important;box-shadow:none}.w4-pil article{text-align:center;padding:0 20px;position:relative;display:flex;flex-direction:column;align-items:center;gap:10px}
.w4-pil b{width:68px;height:68px;border-radius:50%;background:var(--gold);color:var(--navy);display:grid;place-items:center;font:600 26px Fraunces,serif;box-shadow:0 0 0 8px rgba(201,149,44,.18)}
.w4-pil h3{font-size:24px;color:#fff;margin:6px 0 0!important}.w4-pil b{font-size:26px!important}.w4-pil p{color:#c9d3e3;margin:0;line-height:1.6;max-width:300px}
.w4-mo{background:#fff}
.w4-mo .grid{display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:220px 220px;gap:10px;max-width:1180px;margin:0 auto}
.w4-mo .grid a:first-child{grid-row:1/3}
.w4-mo .grid a,.w4-mo .grid picture,.w4-mo .grid img{display:block;width:100%;height:100%;object-fit:cover;border-radius:14px}
.w4-mo .grid a:last-child{grid-column:2/4}
.w4-mo blockquote{margin:26px auto 18px;font:italic 500 22px/1.5 Fraunces,serif;color:#5a4a28;max-width:700px}
.w4-mo cite{display:block;font:700 11px 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-top:8px;font-style:normal}
@media(max-width:900px){.w4-hero .g{grid-template-columns:1fr}.w4-hero .ph{height:46vh;order:-1}.w4-lead .g{grid-template-columns:1fr}.w4-pil .steps{grid-template-columns:1fr;gap:28px}.w4-pil .steps:before{display:none}}
@media(max-width:760px){.w4-nav{justify-content:flex-start;top:70px}.w4-lead .ld{grid-template-columns:1fr;text-align:center}.w4-lead .ld img{width:100%;height:280px}.w4-mo .grid{grid-template-columns:1fr 1fr 1fr;grid-template-rows:220px 110px;gap:8px}.w4-mo .grid a:first-child{grid-row:auto;grid-column:1/4}.w4-mo .grid a:last-child{grid-column:auto}}
'''
    return html, css


def w5(P):
    mo = P['mo']
    L1, L2 = P['leaders']
    pil = ''.join('<div class="t pil" style="grid-area:p%d"><b>%s</b><h3>%s</h3><p>%s</p></div>' % ((i + 1,) + x) for i, x in enumerate(P['pillars']))
    html = (hero_cinematic(P).replace('class="navy w-hero ctr"', 'class="navy w-hero w5h ctr"') +
            '<section class="section w5"><div class="ed"><div class="hd"><span class="k">At a glance</span><h2>The Women Foundation.</h2></div><div class="bento">'
            '<div class="t lead a" style="grid-area:a"><img src="%s" alt="%s"><div class="o"><span class="k lt">%s</span><h3>%s</h3><p>%s</p></div></div>'
            '<div class="t lead b" style="grid-area:b"><img src="%s" alt="%s"><div class="o"><span class="k lt">%s</span><h3>%s</h3><p>%s</p></div></div>'
            '<div class="t verse" style="grid-area:v"><p>%s</p><b>%s</b></div>%s'
            '<a class="t photo" style="grid-area:ph" href="%s">%s<span>Ministry moments &middot; %s</span></a>'
            '<div class="t cta" style="grid-area:c"><h3>Rekindle the altar with us.</h3><p>%s</p>%s</div>'
            '</div></div></section>' % (
                L1['img'], L1['alt'], L1['k'], L1['name'], L1['role'], L2['img'], L2['alt'], L2['k'], L2['name'], L2['role'],
                mo['verse'], mo['cite'], pil, mo['photos_href'], mo['photos'][0], mo['title'], mo['text'], moments_btns(P)) +
            messages(P) + events(P))
    css = '''
.w5h{min-height:min(70vh,640px)!important}
.w5{background:var(--cream)}
.w5 .bento{display:grid;grid-template-columns:repeat(4,1fr);grid-template-areas:'a b v v' 'a b ph ph' 'p1 p2 ph ph' 'p3 c c c';grid-auto-rows:minmax(200px,auto);gap:14px}
.w5 .t{border-radius:20px;overflow:hidden;position:relative;background:#fff;border:1px solid #ebe4d6;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;gap:8px}
.w5 .lead{padding:0;border:0;min-height:430px}
.w5 .lead img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 18%}
.w5 .lead .o{position:absolute;left:0;right:0;bottom:0;padding:70px 20px 22px;background:linear-gradient(180deg,transparent,rgba(14,26,51,.92));color:#fff;display:flex;flex-direction:column;align-items:center;gap:6px}
.w5 .lead .k{font-size:10px;letter-spacing:.16em}.w5 .lead .k:before,.w5 .lead .k:after{width:14px}.w5 .lead h3{font-size:22px;color:#fff;margin-top:4px}.w5 .lead p{margin:0;font-size:13px;color:#dfe5ee}
.w5 .verse{background:var(--navy);border:0;color:#fff}
.w5 .verse p{font:italic 500 clamp(20px,2vw,26px)/1.45 Fraunces,serif;color:#e9d9b4;margin:0;max-width:520px}
.w5 .verse b{font:700 11px 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;color:var(--gold2)}
.w5 .pil b{font:600 30px Fraunces,serif;color:var(--gold)}.w5 .pil h3{font-size:21px}.w5 .pil p{margin:0;color:var(--muted);font-size:14px;line-height:1.55}
.w5 .photo{padding:0;border:0}
.w5 .photo picture,.w5 .photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.w5 .photo span{position:absolute;left:16px;right:16px;bottom:16px;background:rgba(255,255,255,.92);border-radius:100px;padding:10px 16px;font:700 13px 'Inter Tight';color:var(--ink)}
.w5 .cta{background:linear-gradient(135deg,#c2471a,#e85d26);border:0;color:#fff}
.w5 .cta h3{font-size:28px;color:#fff}.w5 .cta p{margin:0 0 6px;color:#ffe6d8;max-width:460px;line-height:1.55}
@media(max-width:1000px){.w5 .bento{grid-template-columns:1fr 1fr;grid-template-areas:'a b' 'v v' 'p1 p1' 'p2 p2' 'p3 p3' 'ph ph' 'c c'}}
@media(max-width:760px){.w5 .bento{grid-auto-rows:auto;gap:10px}.w5 .lead{min-height:300px}.w5 .lead h3{font-size:18px}.w5 .lead .k{display:none}.w5 .lead .o{padding:60px 10px 14px}.w5 .photo{min-height:280px}.w5 .t{padding:20px 16px}.w5 .bento{grid-template-areas:'a b' 'v v' 'p1 p1' 'p2 p2' 'p3 p3' 'ph ph' 'c c'}}
'''
    return html, css


DESIGNS = [('Cinematic', w1), ('Editorial magazine', w2), ('Navy & scripture', w3), ('Split hero + page menu', w4), ('Bento tiles', w5)]


def variants(src, picker):
    P = parts(src)
    out = {}
    files = ['women-%d.html' % (i + 1) for i in range(len(DESIGNS))]
    for i, (name, fn) in enumerate(DESIGNS):
        html, css = fn(P)
        t = re.sub(r'<main id="content"[^>]*>.*?</main>', '<main id="content" class="wf">%s</main>' % html, src, count=1, flags=re.S)
        t = t.replace('</head>', '<style>%s%s</style>\n</head>' % (BASE, css), 1)
        t = t.replace('</body>', picker('Women Foundation', i + 1, [d[0] for d in DESIGNS], files) + '\n</body>', 1)
        out[files[i]] = t
    return out


# ---------------- FINAL (Dawn 2026-11-26 22:58): computer = Cinematic (1), phone = Bento tiles (5) ----------------
CLOSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'


def leader_dialogs(P):
    out = ''
    for i, L in enumerate(P['leaders']):
        out += ('<dialog class="wf-ld" id="wf-ld-%d" aria-labelledby="wf-ld-%d-h"><button type="button" class="x" data-ld-close aria-label="Close">%s</button>'
                '<div class="top"><div class="ph"><img src="%s" alt="%s" loading="lazy" decoding="async"></div><div class="id"><span class="k">%s</span><h2 id="wf-ld-%d-h">%s</h2><p class="role">%s</p></div></div>'
                '<div class="bd">%s%s</div></dialog>') % (i, i, CLOSE, L['img'], L['alt'], L['k'], i, L['name'], L['role'], ''.join('<p>%s</p>' % p for p in L['paras']), L['socials'])
    return out


def messages_cine(P):
    return ('<section id="messages" class="section wf-msg cine navy"><div class="ed"><div class="hd"><span class="eyebrow">Messages for women</span><h2>Watch and grow.</h2></div><div class="message-grid">%s</div></div></section>' % P['cards'])


def final(P):
    mo = P['mo']
    L1, L2 = P['leaders']
    desk = ('<div class="only-d">'
            '<section class="section navy w1-lead"><div class="ed"><div class="hd"><span class="k lt">Our mothers in the faith</span><h2>Led in prayer and the Word.</h2></div>'
            '<div class="g">%s</div></div></section>' % ''.join(leader_card(L) for L in P['leaders']) +
            '<section class="section w1-pil"><div class="ed"><div class="hd"><span class="k">%s</span><h2>%s</h2><p>%s</p></div>%s</div></section>' % (P['p_k'], P['p_h'], P['p_sub'], pillars(P)) +
            '<section class="w1-mo"><div class="mos">%s</div><div class="card"><span class="k">Ministry moments</span><h2>%s</h2><p class="meta">%s</p><p>%s</p><blockquote>%s<cite>%s</cite></blockquote>%s</div></section>' % (
                ''.join('<a href="%s" tabindex="-1" aria-hidden="true">%s</a>' % (mo['photos_href'], ph) for ph in mo['photos']), mo['title'], mo['meta'], mo['text'], mo['verse'], mo['cite'], moments_btns(P).replace('btn ghost', 'btn dark')) +
            '</div>')
    lead_tile = lambda i, L: ('<button type="button" class="t lead" style="grid-area:%s" data-ld-open="wf-ld-%d" aria-haspopup="dialog"><img src="%s" alt="" loading="lazy" decoding="async">'
                              '<span class="o"><span class="nm">%s</span><span class="rl">%s</span><span class="more">View profile</span></span></button>') % ('ab'[i], i, L['img'], L['name'], L['role'])
    phone = ('<div class="only-m"><section class="section w5"><div class="ed"><div class="hd"><span class="k">At a glance</span><h2>The Women Foundation.</h2></div><div class="bento">'
             + lead_tile(0, L1) + lead_tile(1, L2) +
             '<div class="t verse" style="grid-area:v"><p>%s</p><b>%s</b></div>' % (mo['verse'], mo['cite']) +
             '<div class="t pils" style="grid-area:p"><span class="k">%s</span><h3>%s</h3>%s</div>' % (P['p_k'], P['p_h'], pillars(P)) +
             '<a class="t photo" style="grid-area:ph" href="%s">%s<span>Ministry moments &middot; %s</span></a>' % (mo['photos_href'], mo['photos'][0], mo['title']) +
             '<div class="t cta" style="grid-area:c"><h3>Rekindle the altar with us.</h3><p class="meta">%s</p><p>%s</p>%s</div>' % (mo['meta'], mo['text'], moments_btns(P)) +
             '</div></div></section></div>')
    html = hero_cinematic(P) + desk + phone + messages_cine(P) + events(P) + leader_dialogs(P)
    css = BASE + FINAL_CSS
    return html, css.replace('url(img/grain.png)', 'url(/img/grain.png)')


def _w1_css():
    import re as _re
    src = open(__file__).read()
    return ''


FINAL_CSS = r'''
.wf .only-m{display:none}
@media(max-width:760px){.wf .only-d{display:none}.wf .only-m{display:block}}
/* computer: cinematic */
.w1-lead .g{display:grid;grid-template-columns:1fr 1fr;gap:26px;max-width:1180px;margin:0 auto}
.w1-lead .ld{background:rgba(255,255,255,.06);border:1px solid rgba(240,199,96,.3);border-radius:22px;overflow:hidden;display:flex;flex-direction:column}
.w1-lead .ld .ph{aspect-ratio:4/3.4;overflow:hidden}.w1-lead .ld .ph img{width:100%;height:100%;object-fit:cover;object-position:50% 20%;display:block}
.w1-lead .ld .tx{padding:28px 30px 30px;display:flex;flex-direction:column;align-items:center;gap:8px;flex:1;justify-content:center}
.w1-lead .ld h3{font-size:clamp(24px,2.4vw,32px);color:#fff;margin-top:6px}
.w1-lead .ld .role{color:var(--gold2);font-weight:600;font-size:14px;margin:0}
.w1-lead .ld p{color:#c9d3e3;line-height:1.6;margin:0;font-size:15px}
.w1-pil{background:var(--cream)}
.w1-pil .values-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.w1-pil .values-grid article{background:#fff;border-top:3px solid var(--gold);padding:34px 28px;border-radius:0 0 16px 16px;box-shadow:0 12px 30px rgba(20,34,64,.06)}
.w1-pil .values-grid b{font:600 30px Fraunces,serif;color:#8a6414}
.w1-pil .values-grid h3{font-size:24px;margin:10px 0 8px}.w1-pil .values-grid p{color:var(--muted);margin:0;line-height:1.6;font-size:15px}
.w1-mo{position:relative;min-height:620px;display:flex;align-items:center;justify-content:center;overflow:hidden}
.w1-mo .mos{position:absolute;inset:0;display:grid;grid-template-columns:repeat(4,1fr)}
.w1-mo .mos a,.w1-mo .mos picture,.w1-mo .mos img{display:block;width:100%;height:100%;object-fit:cover}
.w1-mo:after{content:"";position:absolute;inset:0;background:rgba(14,26,51,.45)}
.w1-mo .card{position:relative;z-index:1;background:#fff;max-width:620px;margin:60px var(--edge);padding:40px;border-radius:22px;box-shadow:0 30px 70px rgba(0,0,0,.35);display:flex;flex-direction:column;align-items:center;gap:10px}
.w1-mo .card h2{font-size:clamp(32px,3.6vw,48px)}.w1-mo .meta{color:#8a6414;font-weight:600;font-size:14px;margin:0}.w1-mo .card p{color:var(--muted);margin:0;line-height:1.6}
.w1-mo blockquote{margin:8px 0 14px;font:italic 500 19px/1.5 Fraunces,serif;color:#5a4a28}.w1-mo cite{display:block;font:700 11px 'Inter Tight',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-top:6px;font-style:normal}
@media(max-width:900px){.w1-lead .g{grid-template-columns:1fr;max-width:560px}.w1-pil .values-grid{grid-template-columns:1fr}}
/* phone: bento */
.w5{background:var(--cream)}
.w5 .bento{display:grid;grid-template-columns:1fr 1fr;grid-template-areas:'a b' 'v v' 'p p' 'ph ph' 'c c';gap:10px}
.w5 .t{border-radius:20px;overflow:hidden;position:relative;background:#fff;border:1px solid #ebe4d6;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:22px 16px;gap:8px;min-width:0}
.w5 button.lead{padding:0;border:0;min-height:300px;cursor:pointer;font:inherit;color:#fff;background:var(--navy);justify-content:flex-end}
.w5 .lead img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 18%;transition:transform .5s}
.w5 .lead:active img{transform:scale(1.03)}
.w5 .lead .o{position:relative;width:100%;padding:70px 10px 14px;background:linear-gradient(180deg,transparent,rgba(14,26,51,.94) 55%);display:flex;flex-direction:column;align-items:center;gap:4px}
.w5 .lead .nm{font:500 17px/1.2 Fraunces,serif;color:#fff}
.w5 .lead .rl{font-size:11.5px;line-height:1.35;color:#dfe5ee}
.w5 .lead .more{margin-top:6px;display:inline-flex;align-items:center;min-height:32px;padding:0 14px;border-radius:100px;background:var(--gold);color:var(--navy);font:700 12px 'Inter Tight',sans-serif}
.w5 .lead:focus-visible{outline:3px solid var(--gold2);outline-offset:3px}
.w5 .verse{background:var(--navy);border:0}
.w5 .verse p{font:italic 500 19px/1.45 Fraunces,serif;color:#e9d9b4;margin:0}
.w5 .verse b{font:700 11px 'Inter Tight',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:var(--gold2)}
.w5 .pils{padding:24px 0 18px}
.w5 .pils h3{font-size:22px;line-height:1.15;padding:0 16px;margin:0 0 6px}
.w5 .pils .values-grid{width:100%;padding:2px 16px 6px!important;scroll-padding:0 16px}
.w5 .pils .values-grid>*{flex:0 0 82%!important;max-width:82%!important}
.w5 .pils article{background:var(--cream)!important;border:0!important;border-top:3px solid var(--gold)!important;border-radius:0 0 14px 14px;padding:22px 16px!important;display:flex;flex-direction:column;align-items:center;gap:6px}
.w5 .pils article b{font:600 28px Fraunces,serif;color:#8a6414}
.w5 .pils article h3{font-size:20px;margin:0;padding:0}
.w5 .pils article p{margin:0;color:var(--muted);font-size:14px;line-height:1.55}
.w5 .photo{padding:0;border:0;min-height:280px}
.w5 .photo picture,.w5 .photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.w5 .photo span{position:absolute;left:14px;right:14px;bottom:14px;background:rgba(255,255,255,.93);border-radius:100px;padding:10px 14px;font:700 13px 'Inter Tight',sans-serif;color:var(--ink)}
.w5 .cta{background:linear-gradient(135deg,#c2471a,#e85d26);border:0;color:#fff}
.w5 .cta h3{font-size:25px;color:#fff;margin:0}.w5 .cta .meta{color:#fff;font-weight:600;font-size:13.5px;margin:0}.w5 .cta p{margin:0 0 6px;color:#ffe6d8;line-height:1.55;font-size:14.5px}
.w5 .cta .acts{flex-direction:column;align-items:stretch;width:100%}
/* leader profile pop-up */
.wf-ld{border:0;padding:0;border-radius:22px;width:min(860px,calc(100vw - 28px));max-height:calc(100dvh - 28px);background:#fff;color:var(--ink);box-shadow:0 40px 90px rgba(0,0,0,.45);overflow:auto;opacity:0;transform:translateY(18px);transition:opacity .35s,transform .35s}
.wf-ld.on{opacity:1;transform:none}
.wf-ld::backdrop{background:rgba(8,14,30,.72);backdrop-filter:blur(4px)}
.wf-ld .x{position:absolute;top:12px;right:12px;width:44px;height:44px;border-radius:50%;border:0;background:rgba(20,34,64,.08);display:grid;place-items:center;cursor:pointer;z-index:2}
.wf-ld .x svg{width:20px;height:20px;stroke:var(--navy);stroke-width:2.2;fill:none}
.wf-ld .top{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:28px;align-items:center;padding:30px 30px 0}
.wf-ld .ph{border-radius:16px;overflow:hidden;aspect-ratio:4/5}.wf-ld .ph img{width:100%;height:100%;object-fit:cover;object-position:50% 18%;display:block}
.wf-ld .id{display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px}
.wf-ld .id h2{font:500 clamp(24px,3vw,36px)/1.12 Fraunces,serif;margin:0}
.wf-ld .role{color:#8a6414;font-weight:600;font-size:14.5px;line-height:1.45;margin:0}
.wf-ld .bd{padding:24px 34px 34px;text-align:center}
.wf-ld .bd p{color:#4c5566;line-height:1.7;font-size:16px;margin:0 auto 14px;max-width:640px}
.wf-ld .leader-socials{display:flex;gap:10px;justify-content:center;margin-top:10px}
.wf-ld .leader-socials a{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;border:1px solid #d9cfb9;color:var(--ink)}
.wf-ld .leader-socials svg{width:18px;height:18px}
@media(max-width:760px){.wf-ld .top{grid-template-columns:42% 1fr;gap:14px;padding:22px 18px 0}.wf-ld .id{gap:6px}.wf-ld .id h2{font-size:21px}.wf-ld .role{font-size:12.5px}.wf-ld .k{font-size:10px;letter-spacing:.12em}.wf-ld .k:before,.wf-ld .k:after{display:none}.wf-ld .bd{padding:18px 20px 26px}.wf-ld .bd p{font-size:15px}.wf-ld .x{top:8px;right:8px;background:rgba(255,255,255,.9)}}
@media(prefers-reduced-motion:reduce){.wf-ld{transition:opacity .2s;transform:none}}
/* Watch and grow: screening room */
.cine .hd .eyebrow{color:var(--gold2)}
.cine .message-grid{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);grid-auto-rows:auto;gap:12px;max-width:1280px;margin:0 auto}
.cine .message-card{background:rgba(255,255,255,.05)!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:16px;overflow:hidden;min-width:0}
.cine .message-card h3,.cine .message-card h3 a{color:#fff!important;text-decoration:none}
.cine .message-card small{color:var(--gold2)!important}
.cine .message-card p{color:#aebbd0!important}
.cine .message-card i{background:rgba(255,255,255,.08)!important;color:#d5dce8!important}
.cine .message-card>a{position:relative;overflow:hidden;background:#000}
.cine .message-card>a img{position:absolute;left:0;top:-17%;width:100%;height:134%;object-fit:cover}
.cine .message-card:first-child{grid-row:1/span 5;display:flex;flex-direction:column;border-color:rgba(240,199,96,.45)!important}
.cine .message-card:first-child>a{height:auto!important;aspect-ratio:16/9;flex:none}
.cine .message-card:first-child>a span{width:76px;height:76px}
.cine .message-card:first-child>div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:26px!important}
.cine .message-card:first-child h3{font-size:clamp(24px,2.4vw,32px)!important;line-height:1.2!important}
.cine .message-card:first-child p{font-size:14px!important}
.cine .message-card:not(:first-child){display:grid;grid-template-columns:minmax(0,44%) minmax(0,1fr);align-items:center}
.cine .message-card:not(:first-child)>a{height:auto!important;aspect-ratio:16/9}
.cine .message-card:not(:first-child)>a span{width:38px;height:38px}
.cine .message-card:not(:first-child)>a span svg{width:16px;height:16px}
.cine .message-card:not(:first-child)>div{padding:10px 14px!important;display:flex;flex-direction:column;align-items:center;justify-content:center}
.cine .message-card:not(:first-child) h3{font-size:16.5px!important;margin:5px 0!important;line-height:1.25!important}
.cine .message-card:not(:first-child) p{font-size:12px!important;margin:0}
.cine .message-card:not(:first-child)>div>div{display:none!important}
@media(max-width:900px){.cine .message-grid{grid-template-columns:1fr}.cine .message-card:first-child{grid-row:auto}}
@media(max-width:760px){.cine .message-grid{gap:10px}.cine .message-card:first-child>div{padding:18px 16px!important}.cine .message-card:first-child h3{font-size:22px!important}.cine .message-card:not(:first-child){grid-template-columns:minmax(0,46%) minmax(0,1fr)}.cine .message-card:not(:first-child) h3{font-size:14.5px!important}.cine .message-card:not(:first-child)>div{padding:8px 10px!important}.cine .message-card:not(:first-child) p{display:none}}
'''
