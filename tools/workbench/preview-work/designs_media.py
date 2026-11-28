"""Preview-only: 5 Media library designs (computer + phone), same content as media.html.
The library section (search, filters, #mGrid, empty state, YouTube results, 'See all' link) is kept byte for byte,
because media.html's own scripts and tools/sync_media.py rely on its ids and markup. Designs change the hero and
restyle the library with CSS only."""
import re
from designs_women import BASE, ARW

VERSE = '&ldquo;So then faith cometh by hearing, and hearing by the word of God.&rdquo;'


def parts(src):
    m = src[src.index('<main'):src.index('</main>')]
    P = {}
    hero = re.search(r'<section class="page-hero">.*?</section>', m, re.S).group(0)
    P['hero_img'] = re.search(r'<img src="([^"]+)"', hero).group(1)
    P['k'] = re.search(r'<span class="eyebrow light">(.*?)</span>', hero).group(1)
    P['h1'] = re.search(r'<h1>(.*?)</h1>', hero).group(1)
    P['sub'] = re.search(r'</h1><p>(.*?)</p>', hero).group(1)
    i = m.index('<section class="section wrap">')
    j = m.index('</section>', m.index('class="media-more"')) + len('</section>')
    P['lib'] = m[i:j]
    P['n'] = len(re.findall(r'<article class="message-card"', P['lib']))
    pl = re.search(r'<select id="mPlaylist">(.*?)</select>', P['lib'], re.S)
    P['pl'] = pl.group(1).count('<option') - 1 if pl else 0
    return P


def lib(P, cls):
    return P['lib'].replace('<section class="section wrap">', '<section class="section wrap mlib %s" id="library">' % cls, 1)


MBASE = r'''
main.mx [hidden]{display:none!important}
.mx .mlib{width:auto;max-width:none;margin-left:var(--edge);margin-right:var(--edge);padding:56px 0 76px}
.mx .media-filters{display:flex!important;flex-direction:column;align-items:center;gap:16px;margin:0 0 22px}
.mx :is(.media-filters>label,.mf-row>label){display:flex;align-items:center;gap:10px;width:100%;max-width:760px;border:1.5px solid #e1d9c8;border-radius:100px;background:#fff;padding:0 22px;min-height:58px;box-shadow:0 10px 26px rgba(20,34,64,.06)}
.mx :is(.media-filters>label,.mf-row>label) svg{width:20px;height:20px;flex:none;color:#8a6414}
.mx .media-filters input{padding:16px 4px;font:500 16px 'Inter Tight',sans-serif;background:transparent}
.mx .filter-selects{width:100%;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr)) auto;gap:10px!important;max-width:1180px}
.mx .filter-selects label{font:700 10.5px 'Inter Tight',sans-serif!important;letter-spacing:.14em;color:#8a6414!important;text-align:center;justify-items:center}
.mx .filter-selects select{width:100%;border:1.5px solid #e1d9c8!important;border-radius:100px;padding:12px 16px!important;font:500 14px 'Inter Tight',sans-serif!important;background:#fff;color:var(--ink);text-align:center;text-align-last:center;cursor:pointer}
.mx .filter-selects button{align-self:end;min-height:46px;border-radius:100px!important;padding:0 20px!important;font:700 13px 'Inter Tight',sans-serif!important;border:1.5px solid var(--navy)!important;background:transparent!important;color:var(--navy)}
.mx .quick-filter-row{display:flex!important;flex-wrap:wrap;justify-content:center;gap:8px!important;border:0!important;padding:0!important}
.mx .quick-filter-row button{min-height:40px;padding:0 18px!important;border-radius:100px;border:1.5px solid #e1d9c8!important;background:#fff!important;font:600 14px 'Inter Tight',sans-serif!important;color:var(--ink)}
.mx .quick-filter-row button.active{background:var(--navy)!important;color:#fff!important;border-color:var(--navy)!important}
.mx .results-count{display:block!important;text-align:center;border:0!important;padding:0!important;margin:0 0 22px!important;font:600 13px 'Inter Tight',sans-serif!important;color:#8a6414!important;letter-spacing:.06em}
.mx .message-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.mx .message-card{min-width:0;border-radius:16px;overflow:hidden;border:1px solid #ebe4d6!important;background:#fff}
.mx .message-card>a{height:auto!important;aspect-ratio:16/9;position:relative;overflow:hidden;background:#000}
.mx .message-card>a img{position:absolute;left:0;top:-17%;width:100%;height:134%;object-fit:cover}
.mx .message-card>div{text-align:center;display:flex;flex-direction:column;align-items:center;padding:16px 16px 18px!important}
.mx .message-card>div>div{justify-content:center}
.mx .message-card h3{margin:6px 0!important}.mx .message-card h3 a{color:inherit;text-decoration:none}
.mx .message-card small{font-size:10px!important;letter-spacing:.14em}
.mx .message-card p{font-size:12.5px!important;margin:0}
.mx .empty-state{border-radius:18px}.mx .empty-state button{border-radius:100px;min-height:46px;padding:0 22px!important}
.mx .media-yt-head{flex-direction:column;align-items:center!important;text-align:center}
.mx .media-more a{border-radius:100px;border-width:1.5px}
.mx .mh{text-align:center}
.mx .sp84{height:84px}
.mx .mh h1{letter-spacing:-.02em}
@media(max-width:1100px){.mx .filter-selects{grid-template-columns:repeat(3,minmax(0,1fr))}.mx .filter-selects button{grid-column:auto}}
@media(max-width:760px){.mx .mlib{padding:36px 0 56px}
 .mx .filter-selects{grid-template-columns:1fr 1fr!important}.mx .filter-selects label:first-child{grid-column:1/-1}.mx .filter-selects button{grid-column:auto!important;min-height:44px}
 .mx .quick-filter-row{flex-wrap:nowrap;overflow-x:auto;justify-content:flex-start;width:100%;scrollbar-width:none;padding-bottom:2px!important}.mx .quick-filter-row::-webkit-scrollbar{display:none}.mx .quick-filter-row button{flex:none}
 .mx .message-grid{gap:12px}}
'''

# ---------------------------------------------------------------- 1 Cinematic screening room
def m1(P):
    html = ('<section class="navy mh m1h"><img class="bg" src="%s" alt="Open Bible and worship"><div class="sh"></div><div class="ed in"><span class="k lt">%s</span><h1>%s</h1><p>%s</p>'
            '<p class="vs">%s <b>Romans 10:17</b></p></div></section>' % (P['hero_img'], P['k'], P['h1'], P['sub'], VERSE) + lib(P, 'm1'))
    css = '''
.m1h{min-height:min(72vh,680px);display:flex;align-items:center;justify-content:center;padding:120px 0 150px}
.m1h .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.m1h .sh{position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,26,51,.6),rgba(14,26,51,.95));z-index:0}
.m1h h1{font-size:clamp(46px,7.4vw,110px);line-height:1;color:#fff;margin:18px 0 16px}
.m1h p{color:#dfe5ee;font-size:18px;line-height:1.6;max-width:640px;margin:0 auto}
.m1h .vs{margin-top:22px;font:italic 500 19px/1.5 Fraunces,serif;color:#e9d9b4}.m1h .vs b{display:block;font:700 11px 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;color:var(--gold2);margin-top:8px;font-style:normal}
.mx .m1{background:var(--navy);margin:0!important;padding:0 var(--edge) 80px!important;position:relative}
.m1 .media-filters{background:#fff;border-radius:24px;padding:26px 26px 22px;margin:-110px auto 40px!important;max-width:1240px;box-shadow:0 30px 70px rgba(0,0,0,.35);position:relative;z-index:2}
.m1 .results-count{color:var(--gold2)!important}
.m1 .message-grid{max-width:1280px;margin:0 auto}
.m1 #mGrid .message-card:first-child{grid-column:span 2;grid-row:span 2}
.m1 #mGrid .message-card:first-child h3{font-size:clamp(24px,2.4vw,32px)!important}
.m1 .message-card{background:rgba(255,255,255,.05)!important;border:1px solid rgba(255,255,255,.12)!important;display:flex;flex-direction:column}
.m1 .message-card>div{flex:1;justify-content:center}
.m1 .message-card h3,.m1 .message-card h3 a{color:#fff!important}.m1 .message-card small{color:var(--gold2)!important}.m1 .message-card p{color:#aebbd0!important}.m1 .message-card i{background:rgba(255,255,255,.08)!important;color:#d5dce8!important}
.m1 .empty-state{background:rgba(255,255,255,.06);color:#fff}
.m1 .media-yt{border-color:rgba(255,255,255,.15)!important}.m1 .media-yt-head h3{color:#fff!important}.m1 .media-yt-head p,.m1 .media-yt-head a{color:#c9d3e3}
.m1 .media-more a{color:#fff!important;border-color:rgba(255,255,255,.5)!important}
@media(max-width:760px){.m1h{padding:110px 0 120px;min-height:0}.m1h p{font-size:16px}.m1 .media-filters{margin-top:-90px!important;padding:18px 14px}
 .m1 #mGrid .message-card:first-child{grid-column:auto;grid-row:auto}
 .m1 .message-grid{grid-template-columns:1fr}
 .m1 #mGrid .message-card:not(:first-child){display:grid;grid-template-columns:46% 1fr;align-items:center}
 .m1 #mGrid .message-card:not(:first-child)>div{padding:8px 10px!important}.m1 #mGrid .message-card:not(:first-child) h3{font-size:14.5px!important}.m1 #mGrid .message-card:not(:first-child) p,.m1 #mGrid .message-card:not(:first-child)>div>div{display:none!important}}
'''
    return html, css


# ---------------------------------------------------------------- 2 Library with sidebar filters
def m2(P):
    html = ('<section class="mh m2h"><div class="sp84"></div><div class="ed in"><span class="k">%s</span><h1>%s</h1><p>%s</p><div class="stat"><b>%d</b><span>messages here</span><i></i><b>%d</b><span>playlists</span><i></i><b>YouTube</b><span>new uploads every week</span></div></div></section>' % (
        P['k'], P['h1'], P['sub'], P['n'], P['pl']) + lib(P, 'm2'))
    css = '''
.m2h{background:var(--cream)}.m2h .sp84{height:84px;background:var(--navy)}
.m2h .in{padding:60px 0 40px}
.m2h h1{font-size:clamp(42px,6vw,88px);line-height:1.02;margin:16px 0 14px}
.m2h p{color:var(--muted);font-size:18px;line-height:1.6;max-width:640px;margin:0 auto}
.m2h .stat{display:inline-flex;align-items:center;gap:10px;margin-top:26px;background:#fff;border:1px solid #ebe4d6;border-radius:100px;padding:12px 24px;flex-wrap:wrap;justify-content:center}
.m2h .stat b{font:600 20px Fraunces,serif;color:#8a6414}.m2h .stat span{font-size:13px;color:var(--muted)}.m2h .stat i{width:5px;height:5px;border-radius:50%;background:#d9cfb9;margin:0 6px}
.mx .m2{display:grid;grid-template-columns:290px minmax(0,1fr);gap:0 34px;align-items:start;background:#fff;padding-top:44px!important}
.m2 .media-filters{grid-row:1/span 6;position:sticky;top:100px;background:var(--cream);border-radius:22px;padding:22px 18px;margin:0!important}
.m2 .media-filters>label{min-height:50px;padding:0 16px;box-shadow:none}
.m2 .filter-selects{grid-template-columns:1fr!important}
.m2 .filter-selects button{grid-column:auto!important}
.m2 .quick-filter-row{justify-content:center}
.m2 .quick-filter-row button{min-height:36px;font-size:13px!important;padding:0 14px!important}
.m2>*:not(.media-filters){grid-column:2}
.m2 .message-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
@media(max-width:1000px){.m2 .message-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:760px){.mx .m2{display:block}.m2 .media-filters{position:static;margin-bottom:22px!important}.m2 .filter-selects{grid-template-columns:1fr 1fr!important}.m2 .filter-selects label:first-child{grid-column:1/-1}
 .m2 .quick-filter-row{justify-content:flex-start}
 .m2 .message-grid{grid-template-columns:1fr 1fr!important;gap:10px}
 .m2 .message-card>div{padding:10px 8px 12px!important}.m2 .message-card h3{font-size:14px!important;line-height:1.25!important}.m2 .message-card p,.m2 .message-card>div>div{display:none!important}
 .m2h .in{padding:40px 0 30px}.m2h p{font-size:16px}.m2h .stat{border-radius:18px;padding:12px 16px}}
'''
    return html, css


# ---------------------------------------------------------------- 3 Editorial list (rows)
def m3(P):
    html = ('<section class="navy mh m3h"><div class="sp84"></div><div class="ed in"><span class="k lt">%s</span><h1>%s</h1><p>%s</p></div></section>' % (P['k'], P['h1'], P['sub']) +
            lib(P, 'm3'))
    css = '''
.m3h .in{padding:70px 0 70px}.m3h h1{font-size:clamp(42px,6vw,86px);color:#fff;margin:16px 0 14px;line-height:1.02}
.m3h p{color:#c9d3e3;font-size:18px;max-width:640px;margin:0 auto;line-height:1.6}
.mx .m3{background:var(--cream);margin:0!important;padding:46px var(--edge) 76px!important}
.m3 .media-filters,.m3 .results-count,.m3 .message-grid,.m3 .empty-state,.m3 .media-yt,.m3 .media-more{max-width:1180px;margin-left:auto!important;margin-right:auto!important}
.m3 .message-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.m3 #mGrid .message-card:first-child{grid-column:1/-1;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);align-items:center}
.m3 #mGrid .message-card:first-child>div{padding:30px!important}.m3 #mGrid .message-card:first-child h3{font-size:clamp(24px,2.6vw,34px)!important;line-height:1.15!important}
.m3 .message-card:not(:first-child),.m3 .media-yt .message-card{display:grid;grid-template-columns:minmax(0,42%) minmax(0,1fr);align-items:center}
.m3 .message-card:not(:first-child)>div{padding:12px 16px!important}
.m3 .message-card:not(:first-child) h3{font-size:17px!important}
.m3 .message-card:not(:first-child)>div>div{display:none!important}
.m3 .media-yt .message-card:first-child{grid-column:auto;display:grid;grid-template-columns:minmax(0,42%) minmax(0,1fr)}
@media(max-width:900px){.m3 .message-grid{grid-template-columns:1fr}.m3 #mGrid .message-card:first-child{grid-template-columns:1fr}}
@media(max-width:760px){.m3h .in{padding:44px 0 46px}.m3h p{font-size:16px}.mx .m3{padding:30px var(--edge) 56px!important}
 .m3 #mGrid .message-card:first-child>div{padding:18px 16px!important}.m3 #mGrid .message-card:first-child h3{font-size:22px!important}
 .m3 .message-card:not(:first-child){grid-template-columns:46% 1fr}.m3 .message-card:not(:first-child)>div{padding:8px 10px!important}.m3 .message-card:not(:first-child) h3{font-size:14.5px!important}.m3 .message-card:not(:first-child) p{display:none}}
'''
    return html, css


# ---------------------------------------------------------------- 4 Search-first + poster tiles
def m4(P):
    html = ('<section class="navy mh m4h"><div class="sp84"></div><div class="ed in"><span class="k lt">%s</span><h1>%s</h1><p>%s</p></div></section>' % (P['k'], P['h1'], P['sub']) +
            lib(P, 'm4'))
    css = '''
.m4h .in{padding:60px 0 120px}.m4h h1{font-size:clamp(42px,6vw,86px);color:#fff;margin:16px 0 14px;line-height:1.02}
.m4h p{color:#c9d3e3;font-size:18px;max-width:640px;margin:0 auto;line-height:1.6}
.mx .m4{margin:0!important;padding:0 var(--edge) 76px!important;background:#fff}
.m4 .media-filters{background:linear-gradient(180deg,#1b2c52,#142240);border-radius:26px;padding:28px 26px;margin:-80px auto 36px!important;max-width:1240px;position:relative;z-index:2;box-shadow:0 26px 60px rgba(20,34,64,.3)}
.m4 .mf-row>label,.m4 .media-filters>label{border-color:transparent;min-height:62px}
.m4 .filter-selects label{color:var(--gold2)!important}
.m4 .filter-selects select{border-color:rgba(255,255,255,.2)!important;background:rgba(255,255,255,.08)!important;color:#fff!important}
.m4 .filter-selects select option{color:#142240}
.m4 .filter-selects button{border-color:var(--gold2)!important;color:var(--gold2)!important}
.m4 .quick-filter-row button{background:transparent!important;border-color:rgba(255,255,255,.3)!important;color:#fff!important}
.m4 .quick-filter-row button.active{background:var(--gold)!important;border-color:var(--gold)!important;color:var(--navy)!important}
.m4 .message-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;max-width:1440px;margin:0 auto}
.m4 #mGrid .message-card:first-child{grid-column:span 2;grid-row:span 2;display:flex;flex-direction:column;background:var(--navy)!important;border:0!important}
.m4 #mGrid .message-card:first-child>a{flex:1;aspect-ratio:auto;min-height:280px}
.m4 #mGrid .message-card:first-child>div{padding:22px!important}
.m4 #mGrid .message-card:first-child h3,.m4 #mGrid .message-card:first-child h3 a{color:#fff!important;font-size:clamp(22px,2.2vw,30px)!important}
.m4 #mGrid .message-card:first-child small{color:var(--gold2)!important}.m4 #mGrid .message-card:first-child p{color:#c9d3e3!important}
.m4 #mGrid .message-card:first-child i{background:rgba(255,255,255,.1)!important;color:#dfe5ee!important}
.m4 .message-card{box-shadow:0 10px 26px rgba(20,34,64,.07)}
@media(max-width:1100px){.m4 .message-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:760px){.m4h .in{padding:40px 0 100px}.m4h p{font-size:16px}.m4 .media-filters{margin-top:-70px!important;padding:18px 14px}
 .m4 .message-grid{grid-template-columns:1fr 1fr!important;gap:10px}.m4 #mGrid .message-card:first-child>a{flex:none;aspect-ratio:16/9;min-height:0}.m4 #mGrid .message-card:first-child>div{padding:14px!important}.m4 #mGrid .message-card:first-child h3,.m4 #mGrid .message-card:first-child h3 a{font-size:20px!important}
 .m4 .message-card:not(:first-child)>div{padding:10px 8px 12px!important}.m4 .message-card:not(:first-child) h3{font-size:14px!important;line-height:1.25!important}.m4 .message-card:not(:first-child) p,.m4 .message-card:not(:first-child)>div>div{display:none!important}.m4 .message-card>a span{width:40px!important;height:40px!important}}
'''
    return html, css


# ---------------------------------------------------------------- 5 Magazine bento
def m5(P):
    html = ('<section class="mh m5h"><div class="sp84"></div><div class="g"><div class="tx"><span class="k">%s</span><h1>%s</h1><p>%s</p><a class="btn dark" href="#library">Browse the library %s</a></div>'
            '<div class="vs navy"><p>%s</p><b>Romans 10:17</b></div></div></section>' % (P['k'], P['h1'], P['sub'], ARW, VERSE) + lib(P, 'm5'))
    css = '''
.m5h{background:var(--cream)}.m5h .sp84{height:84px;background:var(--navy)}
.m5h .g{display:grid;grid-template-columns:1.3fr 1fr;gap:18px;padding:30px var(--edge) 0;align-items:stretch}
.m5h .tx{background:#fff;border:1px solid #ebe4d6;border-radius:24px;padding:56px 40px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px}
.m5h h1{font-size:clamp(40px,5vw,76px);line-height:1.02}.m5h .tx p{color:var(--muted);font-size:17px;line-height:1.6;max-width:540px;margin:0 0 6px}
.m5h .vs{border-radius:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;gap:12px}
.m5h .vs p{font:italic 500 clamp(22px,2.4vw,32px)/1.4 Fraunces,serif;color:#e9d9b4;margin:0;max-width:440px}
.m5h .vs b{font:700 11px 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;color:var(--gold2)}
.mx .m5{background:var(--cream);margin:0!important;padding:30px var(--edge) 76px!important}
.m5 .media-filters{background:#fff;border:1px solid #ebe4d6;border-radius:24px;padding:24px;margin:0 0 26px!important}
.m5 .media-filters>label{box-shadow:none;background:var(--cream)}
.m5 #mGrid{grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-flow:dense}
.m5 #mGrid .message-card:first-child{grid-column:span 2;grid-row:span 2;display:flex;flex-direction:column}
.m5 #mGrid .message-card:first-child>a{flex:1;aspect-ratio:auto;min-height:260px}
.m5 #mGrid .message-card:first-child h3{font-size:clamp(22px,2.2vw,30px)!important}
.m5 .message-card{border-radius:20px}
.m5 .media-yt .message-grid{grid-template-columns:repeat(4,minmax(0,1fr))}
@media(max-width:1000px){.m5 #mGrid,.m5 .media-yt .message-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.m5h .g{grid-template-columns:1fr}}
@media(max-width:760px){.m5h .tx{padding:34px 18px}.m5h .vs{padding:28px 18px}.mx .m5{padding:18px var(--edge) 56px!important}.m5 .media-filters{padding:16px 12px}
 .m5 #mGrid .message-card:first-child>a{aspect-ratio:16/9;min-height:0;flex:none}
 .m5 #mGrid .message-card:not(:first-child)>div{padding:10px 8px 12px!important}.m5 #mGrid .message-card:not(:first-child) h3{font-size:14px!important;line-height:1.25!important}.m5 #mGrid .message-card:not(:first-child) p,.m5 #mGrid .message-card:not(:first-child)>div>div{display:none!important}}
'''
    return html, css


DESIGNS = [('Cinematic screening room', m1), ('Library with sidebar filters', m2), ('Editorial list', m3), ('Search first + featured grid', m4), ('Magazine bento', m5)]


def variants(src, picker):
    P = parts(src)
    out = {}
    files = ['media-%d.html' % (i + 1) for i in range(len(DESIGNS))]
    for i, (name, fn) in enumerate(DESIGNS):
        html, css = fn(P)
        t = re.sub(r'<main id="content"[^>]*>.*?</main>', lambda _: '<main id="content" class="wf mx">%s</main>' % html, src, count=1, flags=re.S)
        t = t.replace('</head>', '<style>%s%s%s</style>\n</head>' % (BASE, MBASE, css), 1)
        t = t.replace('</body>', picker('Media library', i + 1, [d[0] for d in DESIGNS], files) + '\n</body>', 1)
        out[files[i]] = t
    return out


# phone filter drop-down (Dawn 2026-11-26 23:32) — used by the final media page
FILTER_CSS = r"""
.mf-row{display:flex;align-items:center;gap:10px;width:100%;max-width:760px}
.mf-row>label{flex:1;min-width:0;max-width:none!important}
.mf-toggle{display:none}
@media(max-width:760px){
 .m4 .media-filters{padding:12px!important;gap:12px!important;margin-top:-64px!important;border-radius:22px}
 .m4 .media-filters:not(.open){background:transparent!important;box-shadow:none!important;padding:0!important}
 .m4 .media-filters:not(.open) .filter-selects,.m4 .media-filters:not(.open) .quick-filter-row{display:none!important}
 .m4 .media-filters.open .filter-selects,.m4 .media-filters.open .quick-filter-row{animation:mfDrop .28s ease-out}
 .m4 .media-filters>.mf-row>label,.m4 .mf-row>label,.m4 .media-filters>label{min-height:56px;box-shadow:0 14px 30px rgba(10,18,36,.28)!important}
 .mf-toggle{display:inline-flex;align-items:center;justify-content:center;gap:6px;position:relative;flex:none;height:56px;min-width:56px;padding:0 16px;border-radius:100px;border:0;background:#fff;color:var(--navy);font:700 14px 'Inter Tight',sans-serif;box-shadow:0 14px 30px rgba(10,18,36,.28);cursor:pointer}
 .mf-toggle svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
 .mf-toggle[aria-expanded="true"]{background:var(--gold);color:var(--navy)}
 .mf-toggle b{position:absolute;top:-4px;right:-4px;min-width:22px;height:22px;border-radius:11px;background:var(--fire);color:#fff;font:700 12px/22px 'Inter Tight',sans-serif;text-align:center;padding:0 6px}
 .mf-toggle b[hidden]{display:none}
 .mf-toggle span{display:none}
 @media(min-width:360px){.mf-toggle span{display:inline}}
}
@keyframes mfDrop{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.m4 .media-filters.open .filter-selects,.m4 .media-filters.open .quick-filter-row{animation:none}}
"""

FILTER_JS = r"""/* Media library: on phones the filters fold under a filter button beside the search strip. */
(function(){
  var f=document.querySelector('.media-filters');if(!f)return;
  var lab=f.querySelector(':scope>label');if(!lab)return;
  var row=document.createElement('div');row.className='mf-row';f.insertBefore(row,lab);row.appendChild(lab);
  var b=document.createElement('button');b.type='button';b.className='mf-toggle';b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Show filters');
  b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18l-7 8.5V20l-4-2v-4.5z"/></svg><span>Filters</span><b hidden></b>';
  row.appendChild(b);
  var ids=['mPlaylist','mProgram','mSpeaker','mTopic','mYear'],badge=b.querySelector('b');
  function count(){var n=0;ids.forEach(function(i){var s=document.getElementById(i);if(s&&s.value&&s.value!=='All')n++;});badge.textContent=n;badge.hidden=!n;b.setAttribute('aria-label',(f.classList.contains('open')?'Hide filters':'Show filters')+(n?' ('+n+' on)':''));}
  b.addEventListener('click',function(){var o=!f.classList.contains('open');f.classList.toggle('open',o);b.setAttribute('aria-expanded',o?'true':'false');count();});
  f.addEventListener('change',count);f.addEventListener('click',function(e){if(e.target.closest('.quick-filter-row button,#mClear'))setTimeout(count,0);});
  count();
})();
"""
