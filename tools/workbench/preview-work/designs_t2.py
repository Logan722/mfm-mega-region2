"""Preview-only: 5 Testimonies page designs built for MANY testimonies (filters, search, load more).
The 3 real Youth Church reflections come first; the rest are clearly marked layout samples."""
import json

YC = 'https://mfmmegaregion2yc.org/events'
SHARE = 'reach-out.html#testimony'
ARW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>'
Q = '<svg class="dz-q" viewBox="0 0 64 64" aria-hidden="true"><path d="M14 40c0-10 5-17 15-21l2 4c-5 2.6-7.6 6-8 10h7v14H14Zm22 0c0-10 5-17 15-21l2 4c-5 2.6-7.6 6-8 10h7v14H36Z"/></svg>'
SEARCH = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>'
WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"/></svg>'

CATS = ['Healing', 'Deliverance', 'Breakthrough', 'Family', 'Provision', 'Youth']
REAL = [
    dict(cat='Youth', title='From fear toward purpose.', text='Young people encountered Jesus and took steps toward their calling during the Resurgence programme.',
         who='Youth & Young Adult Church', where='Resurgence 2024', link=YC),
    dict(cat='Youth', title='A generation growing in faith.', text='A gathering that affirmed young believers across the region and their identity in Christ.',
         who='Youth & Young Adult Church', where='IYC 2025', link=YC),
    dict(cat='Youth', title='Clarity, confidence and purpose.', text='Young people took meaningful steps forward in faith and purpose.',
         who='Youth & Young Adult Church', where='Launch Pad 1.0', link=YC),
]
SAMPLE_TEXT = {
    'short': 'Layout sample. A short testimony shows here in the person’s own words.',
    'mid': 'Layout sample. A testimony shows here in the person’s own words, with their first name, branch and the programme where it happened. Long testimonies are trimmed on the card and open in full when tapped.',
    'long': 'Layout sample. Longer testimonies keep their full text: what happened, how the church prayed, and what God has done since. On the card only the first lines show; "Read full testimony" opens the whole story so the page stays tidy even with hundreds of testimonies.',
}
SAMPLES = []
_L = ['mid', 'long', 'short']
_ORDER = []
for r in range(6):
    for j, c in enumerate(['Healing', 'Deliverance', 'Breakthrough', 'Family', 'Provision'] + (['Youth'] if r < 3 else [])):
        _ORDER.append((c, _L[(r + j) % 3]))
for i, (c, ln) in enumerate(_ORDER):
    SAMPLES.append(dict(cat=c, title='Sample: %s testimony title' % c.lower(), text=SAMPLE_TEXT[ln], who='First name', where='Branch · Programme', sample=True))
ALL = REAL + SAMPLES


def card(x, cls='tc'):
    s = ' <em class="smp">Sample</em>' if x.get('sample') else ''
    link = ('<a class="ext" href="%s">Explore the programme &#8599;</a>' % x['link']) if x.get('link') else ''
    return ('<article class="%s" data-it data-cat="%s" data-q="%s"><span class="tag">%s%s</span><h3>%s</h3><p>%s</p>'
            '<div class="by"><b>%s</b><span>%s</span></div><div class="acts"><button type="button" class="rd" data-read>Read full testimony</button>'
            '<a class="wa" href="https://wa.me/?text=%s" target="_blank" rel="noopener" aria-label="Share on WhatsApp">%s</a>%s</div></article>') % (
        cls, x['cat'], (x['title'] + ' ' + x['text'] + ' ' + x['who'] + ' ' + x['where']).lower().replace('"', ''), x['cat'], s, x['title'], x['text'],
        x['who'], x['where'], 'A%20testimony%20from%20MFM%20Mega%20Region%202%20https%3A%2F%2Fmfmmegaregion2usa.org%2Ftestimonies', WA, link)


def chips(extra=''):
    return '<div class="chips %s" role="group" aria-label="Filter testimonies"><button type="button" class="on" data-cat-btn="all">All</button>%s</div>' % (
        extra, ''.join('<button type="button" data-cat-btn="%s">%s</button>' % (c, c) for c in CATS))


def search(ph='Search testimonies'):
    return '<label class="srch">%s<input type="search" data-q-in placeholder="%s" aria-label="%s"></label>' % (SEARCH, ph, ph)


def share_band(title='Has God done something for you?'):
    return ('<section class="navy tshare ctr"><div class="ed"><span class="k lt">Your story</span><h2>%s</h2>'
            '<p>Your testimony could strengthen someone today. The team reads every testimony before it appears here.</p>'
            '<a class="btn" href="%s">Share your testimony %s</a></div></section>') % (title, SHARE, ARW)


def hero(sub, inner=''):
    return ('<section class="navy th ctr"><div class="sp"></div><div class="ed in"><span class="k lt">Testimonies</span><h1>God is still <em>doing it.</em></h1>'
            '<p>%s</p>%s</div></section>') % (sub, inner)


COMMON_CSS = '''
.th .in{padding:52px 0 60px}
.th h1{font-size:clamp(42px,6vw,88px);font-weight:500;line-height:1.03;margin:16px 0 12px;color:#fff}
.th h1 em{color:var(--gold2)}
.th p{color:#c9d3e3;font-size:17px;margin:0 auto;max-width:620px;line-height:1.6}
.dz .srch{display:flex;align-items:center;gap:10px;max-width:560px;margin:26px auto 0;background:#fff;border-radius:100px;padding:0 20px;min-height:54px;box-shadow:0 14px 34px rgba(0,0,0,.25)}
.dz .srch svg{width:20px;height:20px;fill:none;stroke:#596170;stroke-width:2;flex:none}
.dz .srch input{border:0;outline:0;flex:1;font:500 16px 'Inter Tight',sans-serif;color:var(--ink);background:transparent;min-width:0}
.dz .chips{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}
.dz .chips button{min-height:40px;padding:0 18px;border-radius:100px;border:1.5px solid #d9d1c2;background:#fff;color:var(--ink);font:600 14px 'Inter Tight',sans-serif;cursor:pointer}
.dz .chips button.on{background:var(--navy);border-color:var(--navy);color:#fff}
.dz .chips.dk button{background:transparent;border-color:rgba(255,255,255,.3);color:#fff}
.dz .chips.dk button.on{background:var(--gold);border-color:var(--gold);color:var(--navy)}
.dz .tag{display:inline-flex;align-items:center;gap:8px;font:700 11px/1 'Inter Tight',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#a84a20}
.dz .smp{font-style:normal;letter-spacing:.06em;text-transform:none;font-weight:600;color:#7a6a45;background:#f2ead6;border-radius:100px;padding:3px 8px}
.dz [data-it] h3{font-family:Fraunces,serif;font-weight:500;color:var(--ink);line-height:1.18}
.dz [data-it] p{color:var(--muted);line-height:1.6;margin:0}
.dz .by{display:flex;flex-direction:column;gap:2px;font-size:13.5px;color:#7b8394}
.dz .by b{color:var(--ink);font-weight:700}
.dz .acts{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap}
.dz .rd{border:0;background:none;padding:0;font:700 14px 'Inter Tight',sans-serif;color:#8a6414;text-decoration:underline;text-underline-offset:5px;cursor:pointer}
.dz .wa{display:grid;place-items:center;width:36px;height:36px;border-radius:50%;background:#e7f6ec}
.dz .wa svg{width:18px;height:18px;fill:none;stroke:#1f8f4e;stroke-width:2}
.dz .ext{font-size:13px;font-weight:700;color:#8a6414}
.dz .more{display:flex;flex-direction:column;align-items:center;gap:8px;margin-top:30px}
.dz .more .btn.ol{background:transparent;border:1.5px solid var(--navy);color:var(--navy)!important}
.dz .more small{color:#7b8394;font-size:13px}
.dz .empty{display:none;text-align:center;color:#7b8394;padding:30px 0}
.tshare{padding:70px 0}
.tshare h2{font-size:clamp(30px,3.6vw,46px);font-weight:500;color:#fff;margin:14px 0 12px}
.tshare p{color:#c9d3e3;max-width:600px;margin:0 auto 24px;line-height:1.65}
.dz-modal{position:fixed;inset:0;z-index:10000;background:rgba(10,18,36,.6);display:none;align-items:center;justify-content:center;padding:20px}
.dz-modal.open{display:flex}
.dz-modal .box{background:#fff;border-radius:18px;max-width:640px;width:100%;max-height:85vh;overflow:auto;padding:34px;text-align:center;position:relative}
.dz-modal .box h3{font:500 30px/1.15 Fraunces,serif;color:#1d2940;margin:12px 0}
.dz-modal .box p{color:#4a5670;line-height:1.7;font-size:16.5px}
.dz-modal .x{position:absolute;right:12px;top:12px;width:40px;height:40px;border-radius:50%;border:0;background:#f2ede4;font-size:22px;cursor:pointer}
'''

# filter + search + load more + reader (preview behaviour; the live page would load testimonies from a data file)
JS = '''<div class="dz-modal" id="dzModal" role="dialog" aria-modal="true" aria-label="Testimony"><div class="box"><button class="x" type="button" aria-label="Close">&times;</button><div class="c"></div></div></div>
<script>(function(){var root=document.querySelector('[data-tl]');if(!root)return;var items=[].slice.call(root.querySelectorAll('[data-it]')),size=+(root.getAttribute('data-size')||9),shown=size,cat='all',q='';
var moreB=document.querySelector('[data-more]'),cnt=document.querySelector('[data-count]'),empty=document.querySelector('.empty');
function match(it){return (cat==='all'||it.getAttribute('data-cat')===cat)&&(!q||it.getAttribute('data-q').indexOf(q)>=0);}
function draw(){var m=items.filter(match);items.forEach(function(it){it.hidden=true;});m.slice(0,shown).forEach(function(it){it.hidden=false;});
 if(moreB){moreB.hidden=m.length<=shown;}if(cnt)cnt.textContent='Showing '+Math.min(shown,m.length)+' of '+m.length+' testimonies';if(empty)empty.style.display=m.length?'none':'block';
 document.querySelectorAll('[data-shelf]').forEach(function(s){var v=[].some.call(s.querySelectorAll('[data-it]'),function(x){return !x.hidden;});s.hidden=!v;});
 document.querySelectorAll('[data-cnt]').forEach(function(b){var c=b.getAttribute('data-cnt');b.textContent=items.filter(function(it){return c==='all'||it.getAttribute('data-cat')===c;}).length;});}
document.querySelectorAll('[data-cat-btn]').forEach(function(b){b.addEventListener('click',function(){cat=b.getAttribute('data-cat-btn');shown=size;document.querySelectorAll('[data-cat-btn]').forEach(function(x){x.classList.toggle('on',x===b||x.getAttribute('data-cat-btn')===cat);});draw();});});
document.querySelectorAll('[data-q-in]').forEach(function(i){i.addEventListener('input',function(){q=i.value.trim().toLowerCase();shown=size;draw();});});
if(moreB)moreB.addEventListener('click',function(){shown+=size;draw();});
var md=document.getElementById('dzModal');document.addEventListener('click',function(e){var r=e.target.closest&&e.target.closest('[data-read]');if(r){var a=r.closest('[data-it]');md.querySelector('.c').innerHTML=a.querySelector('.tag').outerHTML+'<h3>'+a.querySelector('h3').innerHTML+'</h3><p>'+a.querySelector('p').innerHTML+'</p>'+a.querySelector('.by').outerHTML;md.classList.add('open');md.querySelector('.x').focus();}
 if(e.target===md||(e.target.closest&&e.target.closest('.dz-modal .x')))md.classList.remove('open');});
document.addEventListener('keydown',function(e){if(e.key==='Escape')md.classList.remove('open');});
document.querySelectorAll('[data-shelf-nav]').forEach(function(b){b.addEventListener('click',function(){var s=b.closest('[data-shelf]').querySelector('.row');s.scrollBy({left:(b.getAttribute('data-shelf-nav')==='r'?1:-1)*s.clientWidth*.8,behavior:'smooth'});});});
draw();})();</script>'''


def n1():
    html = (hero('Read what God has done across Mega Region 2. Search by word, or filter by what God did.', search()) +
            '<section class="n1"><div class="ed">%s<p class="cnt" data-count></p><div class="g" data-tl data-size="9">%s</div><p class="empty">No testimonies match yet.</p>'
            '<div class="more"><button class="btn ol" type="button" data-more>Load more testimonies</button></div></div></section>' % (chips(), ''.join(card(x) for x in ALL)) +
            share_band())
    css = COMMON_CSS + '''
.n1{background:var(--cream);padding:46px 0 70px}
.n1 .cnt{text-align:center;color:#7b8394;font-size:13.5px;margin:16px 0 22px}
.n1 .g{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.n1 .tc{background:#fff;border:1px solid #ebe4d6;border-radius:16px;padding:28px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:12px;box-shadow:0 10px 26px rgba(20,34,64,.05)}
.n1 .tc h3{font-size:24px}
.n1 .tc p{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;flex:1}
.n1 .tc[hidden]{display:none}
@media(max-width:1000px){.n1 .g{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:640px){.n1 .g{grid-template-columns:1fr}}
'''
    return html, css, JS


def n2():
    html = (hero('Every testimony on one wall. Newest first.') +
            '<section class="n2"><div class="ed"><div class="bar">%s%s</div><div class="wall" data-tl data-size="12">%s</div><p class="empty">No testimonies match yet.</p>'
            '<div class="more"><button class="btn ol" type="button" data-more>Show more</button><small data-count></small></div></div></section>' % (
                search('Search the wall'), chips(), ''.join(card(x, 'tc w') for x in ALL)) + share_band('Add your testimony to the wall'))
    css = COMMON_CSS + '''
.n2{background:#f4eee3;padding:40px 0 70px}
.n2 .bar{display:flex;flex-direction:column;align-items:center;gap:16px;margin-bottom:30px}
.n2 .bar .srch{margin:0;box-shadow:0 8px 20px rgba(20,34,64,.08)}
.n2 .wall{column-count:4;column-gap:18px}
.n2 .tc{break-inside:avoid;margin:0 0 18px;background:#fff;border-radius:16px;padding:24px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;border-top:4px solid var(--gold)}
.n2 .tc:nth-child(3n+2){border-top-color:#e85d26}.n2 .tc:nth-child(3n){border-top-color:#142240}
.n2 .tc h3{font-size:22px}
.n2 .tc[hidden]{display:none}
@media(max-width:1200px){.n2 .wall{column-count:3}}@media(max-width:860px){.n2 .wall{column-count:2}}@media(max-width:560px){.n2 .wall{column-count:1}}
'''
    return html, css, JS


def n3():
    f = REAL[0]
    feat = ('<article class="feat"><span class="k lt">Featured testimony</span><h2>%s</h2><p>%s</p><div class="by"><b>%s</b><span>%s</span></div>'
            '<a class="btn" href="%s">Explore the programme &#8599;</a></article>') % (f['title'], f['text'], f['who'], f['where'], f['link'])
    rows = ''.join(card(x, 'tc row') for x in ALL[1:])
    html = ('<section class="navy n3h ctr"><div class="sp"></div><div class="ed in"><span class="k lt">Testimonies</span><h1>God is still <em>doing it.</em></h1>%s</div></section>'
            '<section class="n3"><div class="ed"><div class="tools">%s%s</div><div class="list" data-tl data-size="8">%s</div><p class="empty">No testimonies match yet.</p>'
            '<div class="more"><button class="btn ol" type="button" data-more>Show more testimonies</button><small data-count></small></div></div></section>' % (
                feat, search(), chips(), rows)) + share_band()
    css = COMMON_CSS + '''
.n3h .in{padding:46px 0 60px}
.n3h h1{font-size:clamp(40px,5.4vw,76px);font-weight:500;line-height:1.04;margin:14px 0 26px;color:#fff}
.n3h h1 em{color:var(--gold2)}
.n3h .feat{max-width:900px;margin:0 auto;border:1px solid rgba(240,199,96,.35);border-radius:20px;padding:clamp(26px,4vw,46px);background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02));display:flex;flex-direction:column;align-items:center;gap:14px}
.n3h .feat h2{font-size:clamp(30px,3.8vw,50px);font-weight:500;color:#fff;line-height:1.1}
.n3h .feat p{color:#dfe5ee;max-width:600px;line-height:1.65;margin:0}
.n3h .feat .by{color:#c9d3e3}.n3h .feat .by b{color:#fff}
.n3{background:#fff;padding:44px 0 70px}
.n3 .tools{display:flex;flex-direction:column;align-items:center;gap:14px;margin-bottom:26px}
.n3 .tools .srch{margin:0;border:1.5px solid #e3dccd;box-shadow:none}
.n3 .list{max-width:1100px;margin:0 auto;border-top:1px solid #ece6d8}
.n3 .row{display:grid;grid-template-columns:150px minmax(0,1fr) 200px auto;grid-template-rows:auto auto;column-gap:24px;row-gap:4px;align-items:center;padding:22px 6px;border-bottom:1px solid #ece6d8;text-align:left}
.n3 .row .tag{grid-column:1;grid-row:1/3;flex-direction:column;align-items:flex-start;gap:6px}
.n3 .row h3{grid-column:2;grid-row:1;font-size:21px;align-self:end}
.n3 .row p{grid-column:2;grid-row:2;align-self:start;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:15px}
.n3 .row .by{grid-column:3;grid-row:1/3}
.n3 .row .acts{grid-column:4;grid-row:1/3;justify-content:flex-end}
.n3 .row .ext{display:none}
.n3 .row[hidden]{display:none}
@media(max-width:860px){.n3 .row{grid-template-columns:1fr;grid-template-rows:none;text-align:center;row-gap:8px}.n3 .row>*{grid-column:1!important;grid-row:auto!important}.n3 .row .acts{justify-content:center}.n3 .row .tag{justify-content:center}}
'''
    return html, css, JS


def n4():
    shelves = ''
    for c in CATS[::-1] if False else ['Youth'] + [c for c in CATS if c != 'Youth']:
        its = [x for x in ALL if x['cat'] == c]
        shelves += ('<div class="shelf" data-shelf><div class="sh"><h2>%s</h2><div class="nav"><button type="button" data-shelf-nav="l" aria-label="Scroll back">&lsaquo;</button>'
                    '<button type="button" data-shelf-nav="r" aria-label="Scroll on">&rsaquo;</button></div></div><div class="row">%s</div></div>') % (
            c, ''.join(card(x, 'tc s') for x in its))
    html = (hero('Testimonies grouped by what God did. Scroll each row, or search them all.', search()) +
            '<section class="n4"><div class="ed" data-tl data-size="999">%s%s<p class="empty">No testimonies match yet.</p></div></section>' % (chips(), shelves) + share_band())
    css = COMMON_CSS + '''
.n4{background:var(--cream);padding:40px 0 64px}
.n4 .chips{margin-bottom:28px}
.n4 .shelf{margin:0 0 34px}
.n4 .shelf[hidden]{display:none}
.n4 .sh{display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:14px;position:relative}
.n4 .sh h2{font-size:clamp(26px,2.6vw,34px);font-weight:500}
.n4 .sh .nav{position:absolute;right:0;display:flex;gap:8px}
.n4 .sh .nav button{width:40px;height:40px;border-radius:50%;border:1.5px solid #d9d1c2;background:#fff;font-size:22px;cursor:pointer;color:var(--ink)}
.n4 .row{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(280px,calc((100% - 54px)/4));gap:18px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px 2px 12px;scrollbar-width:thin}
.n4 .tc{scroll-snap-align:start;background:#fff;border:1px solid #ebe4d6;border-radius:16px;padding:24px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px}
.n4 .tc h3{font-size:21px}
.n4 .tc p{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;flex:1}
.n4 .tc[hidden]{display:none}
@media(max-width:700px){.n4 .row{grid-auto-columns:82%}.n4 .sh .nav{display:none}}
'''
    return html, css, JS


def n5():
    side = ('<aside class="side"><div class="pn">%s</div><div class="pn"><b>What God did</b><div class="cats"><button type="button" class="on" data-cat-btn="all">All <span data-cnt="all"></span></button>%s</div></div>'
            '<div class="pn cta"><b>Has God done something for you?</b><p>Your testimony could strengthen someone today.</p><a class="btn" href="%s">Share your testimony</a></div></aside>') % (
        search('Search'), ''.join('<button type="button" data-cat-btn="%s">%s <span data-cnt="%s"></span></button>' % (c, c, c) for c in CATS), SHARE)
    html = (hero('Read what God has done across Mega Region 2, newest first.') +
            '<section class="n5"><div class="ed g">%s<div class="main"><p class="cnt" data-count></p><div class="feed" data-tl data-size="9">%s</div><p class="empty">No testimonies match yet.</p>'
            '<div class="more"><button class="btn ol" type="button" data-more>Load more testimonies</button></div></div></div></section>' % (side, ''.join(card(x) for x in ALL)))
    css = COMMON_CSS + '''
.n5{background:var(--cream);padding:40px 0 70px}
.n5 .g{display:grid;grid-template-columns:300px minmax(0,1fr);gap:28px;align-items:start}
.n5 .side{position:sticky;top:100px;display:flex;flex-direction:column;gap:14px}
.n5 .pn{background:#fff;border:1px solid #ebe4d6;border-radius:16px;padding:18px;text-align:center}
.n5 .pn b{display:block;font:500 19px Fraunces,serif;color:var(--ink);margin-bottom:10px}
.n5 .pn .srch{margin:0;box-shadow:none;border:1.5px solid #e3dccd;min-height:46px;padding:0 14px}
.n5 .cats{display:flex;flex-direction:column;gap:6px}
.n5 .cats button{display:flex;justify-content:space-between;align-items:center;min-height:40px;padding:0 14px;border-radius:10px;border:0;background:#f7f3ea;font:600 14px 'Inter Tight',sans-serif;color:var(--ink);cursor:pointer}
.n5 .cats button span{font-size:12px;color:#7b8394;margin-left:8px}
.n5 .cats button.on{background:var(--navy);color:#fff}.n5 .cats button.on span{color:var(--gold2)}
.n5 .cta{background:var(--navy);border-color:var(--navy)}.n5 .cta b{color:#fff}.n5 .cta p{color:#c9d3e3;font-size:14px;margin:0 0 14px;line-height:1.5}
.n5 .cnt{text-align:center;color:#7b8394;font-size:13.5px;margin:0 0 14px}
.n5 .feed{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.n5 .tc{background:#fff;border:1px solid #ebe4d6;border-radius:16px;padding:26px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px}
.n5 .tc:first-child{grid-column:1/-1;background:var(--navy);border-color:var(--navy)}
.n5 .tc:first-child h3{color:#fff;font-size:32px}.n5 .tc:first-child p{color:#dfe5ee}.n5 .tc:first-child .by b{color:#fff}.n5 .tc:first-child .tag{color:var(--gold2)}.n5 .tc:first-child .rd,.n5 .tc:first-child .ext{color:var(--gold2)}
.n5 .tc h3{font-size:23px}
.n5 .tc p{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;flex:1}
.n5 .tc[hidden]{display:none}
@media(max-width:960px){.n5 .g{grid-template-columns:1fr}.n5 .side{position:static}.n5 .cats{flex-direction:row;flex-wrap:wrap;justify-content:center}.n5 .cats button{min-height:38px}.n5 .cta{display:none}}
@media(max-width:640px){.n5 .feed{grid-template-columns:1fr}}
'''
    return html, css, JS


T_DESIGNS = [('Search + filter grid', n1), ('Testimony wall', n2), ('Featured + list', n3), ('Rows by category', n4), ('Sidebar filters', n5)]
