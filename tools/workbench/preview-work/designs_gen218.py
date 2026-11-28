"""Preview-only: 5 Gen218 page designs (computer + phone), same content as gen218.html.
The block between <!-- gen218-videos:start/end --> is rebuilt by tools/sync_media.refresh_gen218() every 30 min,
so every design keeps that markup exactly and restyles it with CSS only.
'Upcoming programmes' + <div class="events-grid"> is kept for tools/build_site.py."""
import re
from designs_women import BASE, ARW, events

GS, GE = '<!-- gen218-videos:start -->', '<!-- gen218-videos:end -->'


def parts(src):
    m = src[src.index('<main'):src.index('</main>')]
    P = {}
    hero = re.search(r'<section class="page-hero">.*?</section>', m, re.S).group(0)
    P['hero_img'] = re.search(r'<img src="([^"]+)"', hero).group(1)
    P['h_k'] = re.search(r'<span class="eyebrow light">(.*?)</span>', hero).group(1)
    P['h1a'], P['h1b'] = 'Rooted in purpose.', 'Prepared for God&rsquo;s best.'
    P['h_sub'] = re.search(r'</h1><p>(.*?)</p>', hero).group(1)
    c = re.search(r'<section class="section wrap leadership-feature">(.*?)</section>', m, re.S).group(1)
    P['c_img'] = re.search(r'<img src="([^"]+)"', c).group(1)
    P['c_alt'] = re.search(r'alt="([^"]*)"', c).group(1)
    P['c_k'] = re.search(r'<span class="eyebrow">(.*?)</span>', c).group(1)
    P['c_name'] = re.search(r'<h2>(.*?)</h2>', c).group(1)
    P['c_role'] = re.search(r'<p class="leader-role">(.*?)</p>', c).group(1)
    ps = re.findall(r'<p>(.*?)</p>', c)
    P['verse'] = re.sub(r'\s*<em>.*?</em>', '', ps[0]).strip()
    P['verse_ref'] = 'Genesis 2:18'
    P['c_text'] = ps[1]
    v = re.search(r'<span class="eyebrow">What we cultivate</span>.*?</section>', m, re.S).group(0)
    P['v_k'], P['v_h'] = 'What we cultivate', 'Purpose. Purity. Preparation.'
    P['v_sub'] = re.search(r'</h2></div><p>(.*?)</p>', v).group(1)
    P['vals'] = re.findall(r'<article><b>(\d+)</b><h3>(.*?)</h3><p>(.*?)</p></article>', v)
    P['block'] = m[m.index(GS):m.index(GE) + len(GE)]
    ev = re.search(r'<span class="eyebrow">Upcoming programmes</span>.*?(<div class="events-grid">.*?</div>)</section>', m, re.S)
    P['events_grid'] = ev.group(1)
    return P


def vals(P, cls='values-grid', icons=None):
    return '<div class="%s">%s</div>' % (cls, ''.join(
        '<article>%s<b>%s</b><h3>%s</h3><p>%s</p></article>' % ((icons[i] if icons else ''), x[0], x[1], x[2]) for i, x in enumerate(P['vals'])))


def ev(P):
    return events(dict(events_grid=P['events_grid'])).replace('Women Foundation events.', 'Gen218 events.')


def hero_full(P, extra=''):
    return ('<section class="navy g-hero"><img class="bg" src="%s" alt="Open Bible: rooted in the Word"><div class="sh"></div><div class="ed in">'
            '<span class="k lt">%s</span><h1>%s <em>%s</em></h1><p>%s</p><div class="acts"><a class="btn" href="#gmTitle">Watch the conference %s</a>'
            '<a class="btn ghost" href="https://www.youtube.com/playlist?list=PLW7hBicEbKy_9UNG4SSj27NCBiw1iP-yS" target="_blank" rel="noopener">Full playlist %s</a></div>%s</div></section>') % (
        P['hero_img'], P['h_k'], P['h1a'], P['h1b'], P['h_sub'], ARW, ARW, extra)


GBASE = r'''
.gf .g-hero{min-height:min(86vh,800px);display:flex;align-items:center;justify-content:center;text-align:center;padding:120px 0 80px}
.gf .g-hero .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.gf .g-hero .sh{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(14,26,51,.55),rgba(14,26,51,.9));z-index:0}
.gf .g-hero h1{font-size:clamp(40px,6.6vw,96px);line-height:1.03;color:#fff;margin:18px 0 16px;letter-spacing:-.02em}
.gf .g-hero h1 em{display:block;color:var(--gold2)}
.gf .g-hero p{max-width:660px;margin:0 auto 28px;color:#dfe5ee;font-size:18px;line-height:1.6}
/* the auto-built Gen218 block: shared resets */
.gf .gen-moments{padding:76px 0}
.gf .gen-moments .wrap{width:auto;max-width:none;margin-left:var(--edge);margin-right:var(--edge)}
.gf .gen-moments .wm-copy{display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px}
.gf .gen-moments .wm-copy h2{font:500 clamp(28px,3.4vw,46px)/1.12 Fraunces,serif;margin:0}
.gf .gen-moments .wm-meta{color:#8a6414;font-weight:600;font-size:14px;margin:0}
.gf .gen-moments .wm-copy>p{margin:0;line-height:1.65;max-width:600px}
.gf .gen-moments blockquote{border:0!important;padding:0!important;margin:6px 0;font:italic 500 19px/1.5 Fraunces,serif;max-width:600px}
.gf .gen-moments blockquote cite{display:block;font:700 11px 'Inter Tight',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-top:8px;font-style:normal}
.gf .gen-moments .gm-note{font-size:13px;opacity:.8}
.gf .gen-moments .hero-actions{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:8px}
.gf .gen-moments .hero-actions .button{border-radius:100px!important;box-shadow:none!important;display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:0 26px;border-radius:100px;font:700 15px 'Inter Tight',sans-serif;text-decoration:none;background:var(--gold);color:var(--navy);border:0}
.gf .gen-moments .hero-actions .button.light{background:transparent;border:1.5px solid currentColor;color:inherit}
.gf .gen-moments .gm-video{min-width:0}
.gf .gen-moments .yt-lite{display:block;position:relative;aspect-ratio:16/9;overflow:hidden;border-radius:18px;background:#000}
.gf .gen-moments .yt-lite img{position:absolute;left:0;top:-17%;width:100%;height:134%;object-fit:cover}
.gf .gen-moments .gm-cap{text-align:center;font-size:13px;margin:10px 0 0;color:inherit;opacity:.75}
.gf .gen-moments .gm-more{margin-top:56px}
.gf .gen-moments .gm-more-head{display:flex;flex-direction:column;align-items:center;gap:8px;margin-bottom:22px;text-align:center}
.gf .gen-moments .gm-more-head h3{font:500 clamp(24px,2.6vw,34px) Fraunces,serif;margin:0}
.gf .gen-moments .gm-pl{font-weight:700;font-size:14px;color:#a84a20;text-decoration:none}
.gf .gen-moments .message-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px}
.gf .gen-moments .message-card{min-width:0}
.gf .gen-moments .message-card>a{height:auto!important;aspect-ratio:16/9;position:relative;overflow:hidden}
.gf .gen-moments .message-card>a img{position:absolute;left:0;top:-17%;width:100%;height:134%;object-fit:cover}
main.gf .message-card>div{text-align:center;display:flex;flex-direction:column;align-items:center}
main.gf .message-card>div>div{justify-content:center}
/* contrast */
.gf .gen-moments blockquote cite{color:#8a6414}
.gf .gen-moments .gm-note{opacity:1;color:#5f6776}
@media(max-width:1100px){.gf .gen-moments .message-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:760px){.gf .g-hero{min-height:76vh;padding:110px 0 60px}.gf .g-hero p{font-size:16px}.gf .gen-moments{padding:54px 0}
 .gf .gen-moments .message-grid{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:12px;scrollbar-width:none;padding-bottom:4px}
 .gf .gen-moments .message-grid::-webkit-scrollbar{display:none}
 .gf .gen-moments .message-grid{align-items:flex-start}
 .gf .gen-moments .message-grid>*{flex:0 0 78%;scroll-snap-align:center}
 .gf .gen-moments .message-card>div{padding:14px 12px!important}}
'''


# 1 ---------------------------------------------------------------- Cinematic
def g1(P):
    html = (hero_full(P) +
            '<section class="section navy g1-c"><div class="ed g"><div class="ph"><img src="%s" alt="%s" loading="lazy"></div><div class="tx"><span class="k lt">%s</span><h2>%s</h2><p class="role">%s</p>'
            '<blockquote>%s<cite>%s</cite></blockquote><p>%s</p></div></div></section>' % (P['c_img'], P['c_alt'], P['c_k'], P['c_name'], P['c_role'], P['verse'], P['verse_ref'], P['c_text']) +
            '<section class="section g1-v"><div class="ed"><div class="hd"><span class="k">%s</span><h2>%s</h2><p>%s</p></div>%s</div></section>' % (P['v_k'], P['v_h'], P['v_sub'], vals(P)) +
            '<div class="g1-b">%s</div>' % P['block'] + ev(P))
    css = '''
.g1-c .g{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:clamp(30px,5vw,80px);align-items:center;margin-left:max(var(--edge),calc((100% - 1180px)/2));margin-right:max(var(--edge),calc((100% - 1180px)/2))}
.g1-c .ph{border-radius:22px;overflow:hidden;aspect-ratio:4/5;border:1px solid rgba(240,199,96,.35)}.g1-c .ph img{width:100%;height:100%;object-fit:cover;object-position:50% 20%}
.g1-c .tx{display:flex;flex-direction:column;align-items:center;gap:12px}
.g1-c h2{font-size:clamp(32px,3.8vw,52px);color:#fff}.g1-c .role{color:var(--gold2);font-weight:600;margin:0}
.g1-c blockquote{margin:10px 0;font:italic 500 clamp(20px,2vw,26px)/1.5 Fraunces,serif;color:#e9d9b4;max-width:620px}
.g1-c cite{display:block;font:700 11px 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;color:var(--gold2);margin-top:10px;font-style:normal}
.g1-c .tx>p:last-child{color:#c9d3e3;line-height:1.65;max-width:560px;margin:0}
.g1-v{background:var(--cream)}
.g1-v .values-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.g1-v article{background:#fff;border-top:3px solid var(--gold);padding:34px 28px;border-radius:0 0 16px 16px;box-shadow:0 12px 30px rgba(20,34,64,.06)}
.g1-v b{font:600 30px Fraunces,serif;color:var(--gold)}.g1-v h3{font-size:26px;margin:10px 0 8px}.g1-v p{color:var(--muted);margin:0;line-height:1.6}
.g1-b .gen-moments{background:var(--navy);color:#fff;position:relative}
.g1-b .wm-grid{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:clamp(30px,4vw,64px);align-items:center;margin-left:max(var(--edge),calc((100% - 1280px)/2))!important;margin-right:max(var(--edge),calc((100% - 1280px)/2))!important}
.g1-b .wm-grid .gm-video{order:-1}
.g1-b .gm-cap{color:#c9d3e3}.g1-b .wm-copy .eyebrow{color:var(--gold2)}.g1-b .wm-copy h2{color:#fff}.g1-b .wm-meta{color:var(--gold2)!important}.g1-b .wm-copy>p{color:#c9d3e3}.g1-b blockquote{color:#e9d9b4}
.g1-b .gm-more{margin-left:max(var(--edge),calc((100% - 1280px)/2))!important;margin-right:max(var(--edge),calc((100% - 1280px)/2))!important;border-top:1px solid rgba(240,199,96,.25);padding-top:46px}
.g1-b .gm-more-head h3{color:#fff}.g1-b .gm-pl{color:var(--gold2)}
.g1-b .message-card{background:rgba(255,255,255,.05)!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:14px;overflow:hidden}
.g1-b .message-card h3,.g1-b .message-card h3 a{color:#fff!important}.g1-b .message-card small{color:var(--gold2)!important}.g1-b .message-card p{color:#aebbd0!important}.g1-b .message-card i{background:rgba(255,255,255,.08)!important;color:#d5dce8!important}
@media(max-width:900px){.g1-c .g,.g1-b .wm-grid{grid-template-columns:1fr}.g1-c .ph{max-width:420px;margin:0 auto;width:100%}.g1-v .values-grid{grid-template-columns:1fr}}
'''
    return html, css


# 2 ---------------------------------------------------------------- Scripture-led (Genesis 2:18)
def g2(P):
    html = ('<section class="navy g2-h"><div class="sp84"></div><div class="ed in"><span class="k lt">%s</span><div class="num" aria-hidden="true">2:18</div>'
            '<h1>%s <em>%s</em></h1><p class="vs">%s<b>%s</b></p><p class="sub">%s</p></div></section>' % (P['h_k'], P['h1a'], P['h1b'], P['verse'], P['verse_ref'], P['h_sub']) +
            '<section class="section g2-v"><div class="ed"><div class="hd"><span class="k">%s</span><h2>%s</h2><p>%s</p></div><div class="words values-grid">%s</div></div></section>' % (
                P['v_k'], P['v_h'], P['v_sub'], ''.join('<article><span class="w">%s</span><p>%s</p></article>' % (x[1], x[2]) for x in P['vals'])) +
            '<section class="section g2-c"><div class="ed"><div class="ring"><img src="%s" alt="%s" loading="lazy"></div><span class="k">%s</span><h2>%s</h2><p class="role">%s</p><p class="tx">%s</p></div></section>' % (
                P['c_img'], P['c_alt'], P['c_k'], P['c_name'], P['c_role'], P['c_text']) +
            '<div class="g2-b">%s</div>' % P['block'] + ev(P))
    css = '''
.g2-h{text-align:center}.g2-h .sp84{height:84px}
.g2-h .in{padding:50px 0 90px;display:flex;flex-direction:column;align-items:center}
.g2-h .num{font:600 clamp(120px,22vw,300px)/.9 Fraunces,serif;color:transparent;-webkit-text-stroke:1.5px rgba(240,199,96,.55);letter-spacing:-.04em;margin:10px 0 -10px}
.g2-h h1{font-size:clamp(36px,5vw,72px);line-height:1.05;color:#fff}.g2-h h1 em{display:block;color:var(--gold2)}
.g2-h .vs{margin:26px auto 0;font:italic 500 clamp(19px,2vw,25px)/1.5 Fraunces,serif;color:#e9d9b4;max-width:760px}
.g2-h .vs b{display:block;font:700 11px 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;color:var(--gold2);margin-top:10px;font-style:normal}
.g2-h .sub{color:#c9d3e3;max-width:620px;margin:20px auto 0;line-height:1.6}
.g2-v{background:#fff}
.g2-v .words{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.g2-v article{padding:20px 30px;border-left:1px solid #e8e0cf;display:flex;flex-direction:column;align-items:center;gap:12px}.g2-v article:first-child{border-left:0}
.g2-v .w{font:500 clamp(40px,5vw,72px)/1 Fraunces,serif;background:linear-gradient(135deg,#c9952c,#e85d26);-webkit-background-clip:text;background-clip:text;color:transparent}
.g2-v article p{color:var(--muted);margin:0;line-height:1.6;max-width:300px}
.g2-c{background:var(--cream);text-align:center}.g2-c .ed{display:flex;flex-direction:column;align-items:center;gap:10px}
.g2-c .ring{width:230px;height:230px;border-radius:50%;padding:6px;background:conic-gradient(from 200deg,#c9952c,#f0c760,#e85d26,#c9952c);margin-bottom:12px}
.g2-c .ring img{width:100%;height:100%;border-radius:50%;object-fit:cover;object-position:50% 15%;border:5px solid var(--cream)}
.g2-c h2{font-size:clamp(30px,3.4vw,46px)}.g2-c .role{color:#8a6414;font-weight:600;margin:0}.g2-c .tx{color:var(--muted);max-width:620px;line-height:1.65;margin:6px 0 0}
.g2-b .gen-moments{background:#fff}
.g2-b .wm-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:clamp(30px,4vw,64px);align-items:center;margin-left:max(var(--edge),calc((100% - 1240px)/2))!important;margin-right:max(var(--edge),calc((100% - 1240px)/2))!important}
.g2-b blockquote{color:#5a4a28}.g2-b .wm-copy>p{color:var(--muted)}
.g2-b .hero-actions .button.light{color:var(--navy)!important}
.g2-b .gm-more{background:var(--cream);border-radius:24px;padding:36px 28px;margin-left:var(--edge)!important;margin-right:var(--edge)!important}
@media(max-width:900px){.g2-v .words{grid-template-columns:1fr;gap:18px}.g2-v article{border-left:0;border-top:1px solid #e8e0cf;padding-top:22px}.g2-v article:first-child{border-top:0}.g2-b .wm-grid{grid-template-columns:1fr}}
@media(max-width:760px){.g2-h .in{padding:30px 0 60px}.g2-c .ring{width:180px;height:180px}.g2-b .gm-more{padding:26px 0 26px 16px;border-radius:18px}.g2-b .gm-more-head{padding-right:16px}}
'''
    return html, css


# 3 ---------------------------------------------------------------- Editorial split
def g3(P):
    html = ('<section class="g3-h"><div class="sp84"></div><div class="g"><div class="tx"><span class="k">%s</span><h1>%s <em>%s</em></h1><p>%s</p><div class="acts"><a class="btn dark" href="#gmTitle">Watch the conference %s</a></div></div>'
            '<div class="ph"><img src="%s" alt="Open Bible: rooted in the Word"><span class="tag">Genesis 2:18</span></div></div></section>' % (P['h_k'], P['h1a'], P['h1b'], P['h_sub'], ARW, P['hero_img']) +
            '<section class="section g3-c"><div class="ed g"><div class="tx"><span class="k">%s</span><h2>%s</h2><p class="role">%s</p><p class="q">%s</p><p>%s</p></div><div class="ph"><img src="%s" alt="%s" loading="lazy"></div></div></section>' % (
                P['c_k'], P['c_name'], P['c_role'], P['verse'], P['c_text'], P['c_img'], P['c_alt']) +
            '<section class="section navy g3-v"><div class="ed"><div class="hd"><span class="k lt">%s</span><h2>%s</h2><p>%s</p></div><ol class="lst values-grid">%s</ol></div></section>' % (
                P['v_k'], P['v_h'], P['v_sub'], ''.join('<li><b>%s</b><h3>%s</h3><p>%s</p></li>' % x for x in P['vals'])) +
            '<div class="g3-b">%s</div>' % P['block'] + ev(P))
    css = '''
.g3-h{background:var(--cream)}.g3-h .sp84{height:84px;background:var(--navy)}
.g3-h .g{display:grid;grid-template-columns:1fr 1fr;min-height:min(78vh,720px)}
.g3-h .tx{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:60px var(--edge);text-align:center}
.g3-h h1{font-size:clamp(40px,5.4vw,84px);line-height:1.02}.g3-h h1 em{display:block;color:#a84a20}
.g3-h .tx p{color:var(--muted);font-size:18px;line-height:1.6;max-width:520px;margin:0 0 10px}
.g3-h .ph{position:relative;overflow:hidden}.g3-h .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.g3-h .tag{position:absolute;left:50%;bottom:26px;transform:translateX(-50%);background:rgba(20,34,64,.9);color:var(--gold2);font:700 12px 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;padding:12px 20px;border-radius:100px;white-space:nowrap}
.g3-c{background:#fff}.g3-c .g{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:clamp(30px,5vw,80px);align-items:center;margin-left:max(var(--edge),calc((100% - 1180px)/2));margin-right:max(var(--edge),calc((100% - 1180px)/2))}
.g3-c .tx{display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center}
.g3-c h2{font-size:clamp(32px,3.6vw,50px)}.g3-c .role{color:#8a6414;font-weight:600;margin:0}
.g3-c .q{font:italic 500 clamp(21px,2.1vw,28px)/1.45 Fraunces,serif;color:var(--ink);margin:12px 0;max-width:600px}
.g3-c .tx>p:last-child{color:var(--muted);line-height:1.65;max-width:560px;margin:0}
.g3-c .ph{border-radius:22px;overflow:hidden;aspect-ratio:4/5}.g3-c .ph img{width:100%;height:100%;object-fit:cover;object-position:50% 20%}
.g3-v .lst{list-style:none;margin:0 auto;padding:0;max-width:1180px;display:grid;grid-template-columns:repeat(3,1fr)}
.g3-v li{display:flex;flex-direction:column;align-items:center;gap:12px;padding:10px 34px;border-left:1px solid rgba(240,199,96,.3)}.g3-v li:first-child{border-left:0}
.g3-v b{font:500 88px/1 Fraunces,serif;color:var(--gold2)}.g3-v h3{font-size:30px;color:#fff}.g3-v li p{color:#c9d3e3;margin:0;line-height:1.6}
.g3-b .gen-moments{background:var(--cream)}
.g3-b .wm-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:clamp(30px,4vw,64px);align-items:center;margin-left:max(var(--edge),calc((100% - 1240px)/2))!important;margin-right:max(var(--edge),calc((100% - 1240px)/2))!important}
.g3-b blockquote{color:#5a4a28}.g3-b .wm-copy>p{color:var(--muted)}.g3-b .hero-actions .button.light{color:var(--navy)!important}
.g3-b .message-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important}
.g3-b .message-card:first-child{grid-column:span 2;grid-row:span 2;display:flex;flex-direction:column}
.g3-b .message-card:first-child>a{flex:1;aspect-ratio:auto!important;min-height:240px}.g3-b .message-card:first-child>div{flex:none}.g3-b .message-card:first-child h3{font-size:24px}
@media(max-width:900px){.g3-h .g,.g3-c .g,.g3-b .wm-grid,.g3-v .lst{grid-template-columns:1fr}.g3-h .ph{height:46vh;order:-1}.g3-c .ph{max-width:420px;margin:0 auto;width:100%;aspect-ratio:1;order:-1}.g3-v li{border-left:0;padding:14px 0}}
@media(max-width:760px){.g3-v b{font-size:64px}.g3-b .message-card:first-child h3{font-size:inherit}.g3-b .message-card:first-child>a{flex:none;aspect-ratio:16/9!important;min-height:0}}
'''
    return html, css


# 4 ---------------------------------------------------------------- Journey (Purpose -> Purity -> Preparation) + page menu
def g4(P):
    nav = '<nav class="g4-nav" aria-label="On this page"><a href="#g4-path">The journey</a><a href="#g4-c">Coordinator</a><a href="#gmTitle">Conferences</a><a href="#g4-ev" id="g4-evlink">Events</a></nav>'
    path = ''.join('<li><span class="dot">%s</span><div class="card"><h3>%s</h3><p>%s</p></div></li>' % x for x in P['vals'])
    html = (hero_full(P).replace('class="navy g-hero"', 'class="navy g-hero g4h"') + nav +
            '<section id="g4-path" class="section g4-p"><div class="ed"><div class="hd"><span class="k">%s</span><h2>%s</h2><p>%s</p></div><ol class="path">%s</ol>'
            '<p class="end">&ldquo;&hellip;I will make him an help meet for him.&rdquo; <b>Genesis 2:18</b></p></div></section>' % (P['v_k'], 'The journey: ' + P['v_h'], P['v_sub'], path) +
            '<section id="g4-c" class="section navy g4-c"><div class="ed card"><img src="%s" alt="%s" loading="lazy"><div class="tx"><span class="k lt">%s</span><h2>%s</h2><p class="role">%s</p><p>%s</p></div></div></section>' % (
                P['c_img'], P['c_alt'], P['c_k'], P['c_name'], P['c_role'], P['c_text']) +
            '<div class="g4-b">%s</div>' % P['block'] + ev(P).replace('<section class="section ministry-feed', '<section id="g4-ev" class="section ministry-feed'))
    css = '''
.g4h{min-height:min(70vh,640px)!important}
.g4-nav{position:sticky;top:80px;z-index:20;display:flex;justify-content:center;gap:6px;background:#fff;border-bottom:1px solid #ece6d8;padding:10px var(--edge);overflow-x:auto;scrollbar-width:none}
.g4-nav a{flex:none;min-height:40px;display:inline-flex;align-items:center;padding:0 16px;border-radius:100px;color:var(--ink);font:600 14px 'Inter Tight';text-decoration:none;border:1.5px solid #e3dccd}
.g4-p{background:var(--cream)}
.g4-p .path{list-style:none;margin:10px auto 0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:24px;position:relative;max-width:1180px}
.g4-p .path:before{content:"";position:absolute;left:16%;right:16%;top:36px;height:3px;background:linear-gradient(90deg,var(--gold),var(--fire));border-radius:3px}
.g4-p li{display:flex;flex-direction:column;align-items:center;gap:18px;position:relative}
.g4-p .dot{width:74px;height:74px;border-radius:50%;background:var(--navy);color:var(--gold2);display:grid;place-items:center;font:600 26px Fraunces,serif;box-shadow:0 0 0 8px var(--cream),0 0 0 10px rgba(201,149,44,.5)}
.g4-p .card{background:#fff;border-radius:18px;padding:28px 24px;box-shadow:0 14px 34px rgba(20,34,64,.07);width:100%}
.g4-p .card h3{font-size:28px;margin:0 0 8px}.g4-p .card p{color:var(--muted);margin:0;line-height:1.6}
.g4-p .end{margin:36px auto 0;font:italic 500 20px/1.5 Fraunces,serif;color:#5a4a28}.g4-p .end b{display:block;font:700 11px 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-top:8px;font-style:normal}
.g4-c .card{display:grid;grid-template-columns:260px 1fr;gap:34px;align-items:center;margin-left:max(var(--edge),calc((100% - 1000px)/2));margin-right:max(var(--edge),calc((100% - 1000px)/2));background:rgba(255,255,255,.06);border:1px solid rgba(240,199,96,.3);border-radius:24px;padding:26px}
.g4-c img{width:260px;height:320px;object-fit:cover;object-position:50% 18%;border-radius:16px}
.g4-c .tx{display:flex;flex-direction:column;align-items:center;gap:10px}.g4-c h2{font-size:clamp(28px,3vw,40px);color:#fff}.g4-c .role{color:var(--gold2);font-weight:600;margin:0}.g4-c .tx>p:last-child{color:#c9d3e3;line-height:1.65;margin:0}
.g4-b .gen-moments{background:#fff}
.g4-b .wm-grid{display:flex;flex-direction:column-reverse;gap:30px;margin-left:max(var(--edge),calc((100% - 1000px)/2))!important;margin-right:max(var(--edge),calc((100% - 1000px)/2))!important}
.g4-b blockquote{color:#5a4a28}.g4-b .wm-copy>p{color:var(--muted)}.g4-b .hero-actions .button.light{color:var(--navy)!important}
@media(max-width:900px){.g4-p .path{grid-template-columns:1fr;gap:0;max-width:520px}.g4-p .path:before{left:50%;right:auto;top:30px;bottom:30px;width:3px;height:auto;transform:translateX(-50%)}.g4-p li{padding-bottom:28px}.g4-c .card{grid-template-columns:1fr;text-align:center}.g4-c img{width:100%;height:340px}}
@media(max-width:760px){.g4-nav{justify-content:flex-start;top:70px}}
'''
    js = '<script>addEventListener("load",function(){setTimeout(function(){var s=document.getElementById("g4-ev"),a=document.getElementById("g4-evlink");if(s&&a&&getComputedStyle(s).display==="none")a.remove();},400);});</script>'
    return html, css, js


# 5 ---------------------------------------------------------------- Bento tiles
def g5(P):
    v = '<div class="valt"><div class="values-grid">%s</div></div>' % ''.join('<article class="t val" style="grid-area:v%s"><b>%s</b><h3>%s</h3><p>%s</p></article>' % (x[0][-1], x[0], x[1], x[2]) for x in P['vals'])
    html = (hero_full(P).replace('class="navy g-hero"', 'class="navy g-hero g5h"') +
            '<section class="section g5"><div class="ed"><div class="hd"><span class="k">At a glance</span><h2>Gen218 in one view.</h2></div><div class="bento">'
            '<div class="t co" style="grid-area:co"><img src="%s" alt="%s"><div class="o"><span class="k lt">%s</span><h3>%s</h3><p>%s</p></div></div>'
            '<div class="t verse" style="grid-area:vs"><span class="n" aria-hidden="true">2:18</span><p>%s</p><b>%s</b></div>%s'
            '<div class="t about" style="grid-area:ab"><p>%s</p></div>'
            '<a class="t pl" style="grid-area:pl" href="https://www.youtube.com/playlist?list=PLW7hBicEbKy_9UNG4SSj27NCBiw1iP-yS" target="_blank" rel="noopener"><h3>Every Gen218 conference</h3><p>The full playlist on YouTube.</p><span class="btn">Open the playlist %s</span></a>'
            '</div></div></section>' % (P['c_img'], P['c_alt'], P['c_k'], P['c_name'], P['c_role'], P['verse'], P['verse_ref'], v, P['c_text'], ARW) +
            '<div class="g5-b">%s</div>' % P['block'] + ev(P))
    css = '''
.g5h{min-height:min(66vh,620px)!important}
.g5{background:var(--cream)}
.g5 .bento{display:grid;grid-template-columns:repeat(4,1fr);grid-template-areas:'co vs vs pl' 'co v1 v2 v3' 'co ab ab ab';grid-auto-rows:minmax(190px,auto);gap:14px}
.g5 .t{border-radius:20px;overflow:hidden;position:relative;background:#fff;border:1px solid #ebe4d6;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;gap:8px;min-width:0}
.g5 .co{padding:0;border:0;min-height:520px}
.g5 .co img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 15%}
.g5 .co .o{position:absolute;left:0;right:0;bottom:0;padding:80px 18px 22px;background:linear-gradient(180deg,transparent,rgba(14,26,51,.94) 50%);display:flex;flex-direction:column;align-items:center;gap:6px}
.g5 .co h3{font-size:24px;color:#fff}.g5 .co p{margin:0;font-size:13px;color:#dfe5ee}
.g5 .verse{background:var(--navy);border:0}
.g5 .verse .n{position:absolute;right:-10px;bottom:-34px;font:600 150px/1 Fraunces,serif;color:rgba(240,199,96,.1)}
.g5 .verse p{font:italic 500 clamp(18px,1.7vw,23px)/1.45 Fraunces,serif;color:#e9d9b4;margin:0;max-width:560px;position:relative}
.g5 .verse b{font:700 11px 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;color:var(--gold2);position:relative}
.g5 .val b{font:600 28px Fraunces,serif;color:#8a6414}.g5 .val h3{font-size:24px}.g5 .val p{margin:0;color:var(--muted);font-size:14px;line-height:1.55}
.g5 .about p{font:500 clamp(18px,1.6vw,22px)/1.5 Fraunces,serif;color:var(--ink);margin:0;max-width:760px}
.g5 .pl{background:linear-gradient(135deg,#c2471a,#e85d26);border:0;color:#fff;text-decoration:none}
.g5 .pl h3{font-size:24px;color:#fff}.g5 .pl p{margin:0;color:#ffe6d8}.g5 .pl .btn{margin-top:6px;min-height:44px;font-size:14px}
.g5-b .gen-moments{background:#fff}
.g5-b .wm-grid{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:clamp(30px,4vw,60px);align-items:center;margin-left:max(var(--edge),calc((100% - 1280px)/2))!important;margin-right:max(var(--edge),calc((100% - 1280px)/2))!important}
.g5-b .wm-grid .gm-video{order:-1}
.g5-b blockquote{color:#5a4a28}.g5-b .wm-copy>p{color:var(--muted)}.g5-b .hero-actions .button.light{color:var(--navy)!important}
@media(max-width:1000px) and (min-width:761px){.g5 .bento{grid-template-columns:1fr 1fr;grid-template-areas:'co vs' 'co pl' 'v1 v2' 'v3 ab'}}@media(max-width:1000px){.g5-b .wm-grid{grid-template-columns:1fr}}
@media(min-width:761px){.g5 .valt,.g5 .valt .values-grid{display:contents!important}.g5 .valt .sw-dots{display:none!important}}
.g5 .val{border-top:1px solid #ebe4d6}
@media(max-width:760px){.g5 .bento{grid-template-columns:1fr 1fr;grid-template-areas:'co co' 'vs vs' 'vv vv' 'ab ab' 'pl pl';grid-auto-rows:auto;gap:10px}.g5 .co{min-height:420px}.g5 .t{padding:20px 16px}
 .g5 .valt{grid-area:vv;min-width:0}
 .g5 .valt .values-grid{padding:2px 0 6px!important}
 .g5 .valt .values-grid>*{flex:0 0 82%!important;max-width:82%!important;grid-area:auto!important}
 .g5 .valt .val{background:#fff!important;border:1px solid #ebe4d6!important;border-top:3px solid var(--gold)!important;border-radius:0 0 18px 18px;padding:24px 16px!important;min-height:170px}}
'''
    return html, css


DESIGNS = [('Cinematic', g1), ('Scripture-led', g2), ('Editorial split', g3), ('Journey path + page menu', g4), ('Bento tiles', g5)]


def variants(src, picker):
    P = parts(src)
    out = {}
    files = ['gen218-%d.html' % (i + 1) for i in range(len(DESIGNS))]
    for i, (name, fn) in enumerate(DESIGNS):
        r = fn(P); html, css = r[0], r[1]; js = r[2] if len(r) > 2 else ''
        t = re.sub(r'<main id="content"[^>]*>.*?</main>', lambda _: '<main id="content" class="wf gf">%s</main>' % html, src, count=1, flags=re.S)
        t = t.replace('</head>', '<style>%s%s%s</style>\n</head>' % (BASE, GBASE, css), 1)
        t = t.replace('</body>', js + picker('Gen218', i + 1, [d[0] for d in DESIGNS], files) + '\n</body>', 1)
        out[files[i]] = t
    return out
