"""Preview-only: 5 Testimonies page designs + 5 Reach Out page designs (artifact only, never deployed).
make_artifact2.py calls page_variants() to write testimonies-1..5.html and reach-out-1..5.html."""
import re

YC = 'https://mfmmegaregion2yc.org/events'
ITEMS = [
    ('Resurgence 2024', 'From fear toward purpose.', 'Young people encountered Jesus and took steps toward their calling during the Resurgence programme.'),
    ('IYC 2025', 'A generation growing in faith.', 'A gathering that affirmed young believers across the region and their identity in Christ.'),
    ('Launch Pad 1.0', 'Clarity, confidence and purpose.', 'Young people took meaningful steps forward in faith and purpose.'),
]
SRC = 'Programme reflection &middot; Youth &amp; Young Adult Church'
PS = ('The LORD hath done great things for us; whereof we are glad.', 'Psalm 126:3')
SHARE = 'reach-out.html#testimony'
Q = '<svg class="dz-q" viewBox="0 0 64 64" aria-hidden="true"><path d="M14 40c0-10 5-17 15-21l2 4c-5 2.6-7.6 6-8 10h7v14H14Zm22 0c0-10 5-17 15-21l2 4c-5 2.6-7.6 6-8 10h7v14H36Z"/></svg>'
ARW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>'

BASE = '''
.dz *{box-sizing:border-box}
.dz{--navy:#142240;--deep:#0e1a33;--gold:#c9952c;--gold2:#f0c760;--fire:#e85d26;--cream:#f8f6f1;--ink:#1d2940;--muted:#596170;--edge:24px;font-family:'Inter Tight',sans-serif;color:var(--ink)}
@media(min-width:1200px){.dz{--edge:clamp(32px,3.2vw,64px)}}
.dz .ed{margin-left:var(--edge);margin-right:var(--edge)}
.dz .k{display:inline-flex;align-items:center;gap:12px;font:700 12px/1 'Inter Tight',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#a84a20}
.dz .k.lt{color:var(--gold2)}
.dz .k:before,.dz .k:after{content:"";width:26px;height:1px;background:currentColor;opacity:.8}
.dz h1,.dz h2,.dz h3{font-family:Fraunces,Georgia,serif;margin:0}
.dz .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:50px;padding:0 26px;border-radius:100px;background:var(--gold);color:var(--navy)!important;font:700 15px 'Inter Tight',sans-serif;text-decoration:none;border:0;cursor:pointer;transition:transform .2s,box-shadow .2s}
.dz .btn:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(201,149,44,.35)}
.dz .btn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2}
.dz .btn.fire{background:#c2471a;color:#fff!important}
.dz .btn.ghost{background:transparent;color:#fff!important;border:1.5px solid rgba(255,255,255,.45)}
.dz .lnk{font-weight:700;font-size:14px;color:#8a6414;text-decoration:underline;text-underline-offset:5px}
.dz .dz-q{width:42px;height:42px;fill:var(--gold)}
.dz .navy{background:var(--navy);color:#fff;position:relative;overflow:hidden}
.dz .navy:before{content:"";position:absolute;left:50%;top:-30%;width:min(720px,90vw);height:140%;transform:translateX(-50%);background:linear-gradient(180deg,rgba(255,220,150,.13),transparent 70%);clip-path:polygon(40% 0,60% 0,100% 100%,0 100%);pointer-events:none}
.dz .navy:after{content:"";position:absolute;inset:0;background:url(img/grain.png);opacity:.06;pointer-events:none}
.dz .navy>*{position:relative;z-index:1}
.dz .ctr{text-align:center}
.dz h1 em{white-space:nowrap}
.dz .sp{height:84px;background:var(--navy)}
.dz .prayer-form{color:var(--ink);text-align:left}
.dz .prayer-form label{color:var(--ink)}
.dz .prayer-form .check span{color:var(--muted)}
@media(min-width:701px){.dz .prayer-form>label{grid-column:1/-1}.dz .prayer-form>label:nth-of-type(1),.dz .prayer-form>label:nth-of-type(2){grid-column:auto}.dz .prayer-form select{max-width:none}}
.dz .r3 .card h2,.dz .r1 h2,.dz .r4 h2{text-wrap:balance}
'''

# ---------------------------------------------------------------- Testimonies
def verse(cls=''):
    return '<p class="dz-v %s">&ldquo;%s&rdquo;<b>%s</b></p>' % (cls, PS[0], PS[1])

def t_share(title='Has God done something for you?', sub='Your testimony could strengthen someone today. Tell us what God has done, and the team will read it before it appears here.'):
    return ('<section class="navy dz-share ctr"><div class="ed"><span class="k lt">Your story</span><h2>%s</h2><p>%s</p>'
            '<a class="btn" href="%s">Share your testimony %s</a>%s</div></section>') % (title, sub, SHARE, ARW, verse('lt'))

T_CSS_COMMON = '''
.dz .dz-share{padding:74px 0}
.dz .dz-share h2{font-size:clamp(30px,3.6vw,48px);font-weight:500;color:#fff;margin:14px 0 12px}
.dz .dz-share p{color:#c9d3e3;max-width:620px;margin:0 auto 26px;line-height:1.65;font-size:16px}
.dz .dz-v{font:italic 500 18px/1.5 Fraunces,Georgia,serif;color:#5a4a28;margin:26px auto 0;max-width:620px}
.dz .dz-v.lt{color:#e9d9b4}
.dz .dz-v b{display:block;font:700 11px/1 'Inter Tight',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-top:10px;font-style:normal}
.dz .dz-v.lt b{color:var(--gold2)}
'''

def t1():
    cards = ''.join('<article class="c">%s<span class="k">%s</span><h3>%s</h3><p>%s</p><a class="lnk" href="%s">Explore the programme &#8599;</a></article>' % (Q, a, b, c, YC) for a, b, c in ITEMS)
    html = ('<section class="navy t1-hero ctr"><div class="sp"></div><div class="ed in"><span class="k lt">Testimonies</span><h1>God is still <em>doing it.</em></h1>'
            '<p>Read what God has done across Mega Region 2, and share your own testimony to encourage someone today.</p><a class="btn" href="%s">Share your testimony %s</a></div></section>'
            '<section class="t1-list"><div class="ed"><div class="g">%s</div><p class="src">%s</p></div></section>' % (SHARE, ARW, cards, SRC)) + t_share()
    css = '''
.t1-hero .in{padding:64px 0 78px}
.t1-hero h1{font-size:clamp(44px,6.4vw,92px);font-weight:500;line-height:1.02;margin:18px 0 16px;color:#fff}
.t1-hero h1 em{color:var(--gold2)}
.t1-hero p{max-width:620px;margin:0 auto 28px;color:#c9d3e3;font-size:17px;line-height:1.65}
.t1-list{background:var(--cream);padding:72px 0}
.t1-list .g{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.t1-list .c{background:#fff;border:1px solid #ebe4d6;border-radius:16px;padding:34px 30px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px;box-shadow:0 14px 34px rgba(20,34,64,.06)}
.t1-list .c h3{font-size:clamp(24px,2.2vw,30px);font-weight:500;line-height:1.15;color:var(--ink)}
.t1-list .c p{color:var(--muted);line-height:1.6;margin:0;flex:1}
.t1-list .src{text-align:center;color:#8a8270;font-size:13px;margin:22px 0 0}
@media(max-width:900px){.t1-list .g{grid-template-columns:1fr;max-width:560px;margin:0 auto}}
'''
    return html, css

def t2():
    a, b, c = ITEMS
    html = ('<section class="navy t2-hero ctr"><div class="sp"></div><div class="ed in"><span class="k lt">Testimonies</span><h1>God is still <em>doing it.</em></h1>'
            '<p>Stories and reflections from across our ministry family.</p></div></section>'
            '<section class="t2"><div class="ed g">'
            '<article class="feat"><span class="k lt">Featured reflection &middot; %s</span><h2>%s</h2><p>%s</p><div class="meta"><span>Youth &amp; Young Adult Church</span><a href="%s">Explore the programme &#8599;</a></div></article>'
            '<div class="side">%s</div></div>'
            '<div class="ed act"><a class="btn fire" href="%s">Share your testimony %s</a></div></section>') % (
        a[0], a[1], a[2], YC,
        ''.join('<article class="sm"><span class="k">%s</span><h3>%s</h3><p>%s</p><a class="lnk" href="%s">Explore the programme &#8599;</a></article>' % (x[0], x[1], x[2], YC) for x in (b, c)),
        SHARE, ARW)
    css = '''
.t2-hero .in{padding:58px 0 64px}
.t2-hero h1{font-size:clamp(42px,6vw,84px);font-weight:500;line-height:1.04;margin:16px 0 12px;color:#fff}
.t2-hero h1 em{color:var(--gold2)}
.t2-hero p{color:#c9d3e3;font-size:17px;margin:0}
.t2{background:#f4eee3;padding:60px 0 66px}
.t2 .g{display:grid;grid-template-columns:1.2fr .8fr;gap:24px}
.t2 .feat{background:#172541;color:#fff;padding:clamp(30px,4vw,58px);min-height:460px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;position:relative;overflow:hidden;border-radius:18px}
.t2 .feat:before{content:"";position:absolute;width:420px;height:420px;right:-110px;top:-160px;border:1px solid #d9b56b66;border-radius:50%;box-shadow:0 0 0 46px #dfb85b10,0 0 0 92px #dfb85b0a}
.t2 .feat>*{position:relative}
.t2 .feat h2{font-size:clamp(36px,4vw,60px);font-weight:500;line-height:1.08;margin:18px 0 14px;color:#fff}
.t2 .feat p{color:#dfe5ee;max-width:520px;line-height:1.65;margin:0}
.t2 .meta{display:flex;gap:18px;flex-wrap:wrap;justify-content:center;margin-top:26px;padding-top:18px;border-top:1px solid #ffffff3d;font-size:14px}
.t2 .meta a{color:var(--gold2);font-weight:700}
.t2 .side{display:grid;gap:18px}
.t2 .sm{background:#fffdf9;border:1px solid #ded8ce;border-radius:18px;padding:32px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:12px}
.t2 .sm h3{font-size:clamp(24px,2.3vw,32px);font-weight:500;line-height:1.15}
.t2 .sm p{color:var(--muted);margin:0;line-height:1.6}
.t2 .act{display:flex;justify-content:center;margin-top:30px}
@media(max-width:900px){.t2 .g{grid-template-columns:1fr}.t2 .feat{min-height:380px}}
'''
    return html, css

def t3():
    rows = ''.join(
        '<section class="t3-row %s"><div class="ed in">%s<blockquote><h2>%s</h2><p>%s</p></blockquote><span class="k">%s</span><a class="lnk" href="%s">Explore the programme &#8599;</a></div></section>' % (
            'alt' if i % 2 else '', Q, b, c, a, YC) for i, (a, b, c) in enumerate(ITEMS))
    html = ('<section class="navy t3-hero ctr"><div class="sp"></div><div class="ed in"><span class="k lt">Testimonies</span><h1>God is still <em>doing it.</em></h1>%s</div></section>'
            '%s' % (verse('lt'), rows)) + t_share('Your testimony could be next.')
    css = '''
.t3-hero .in{padding:60px 0 70px}
.t3-hero h1{font-size:clamp(44px,6.6vw,96px);font-weight:500;line-height:1.02;margin:18px 0 6px;color:#fff}
.t3-hero h1 em{color:var(--gold2)}
.t3-row{background:#fff;padding:70px 0;text-align:center}
.t3-row.alt{background:var(--cream)}
.t3-row .in{display:flex;flex-direction:column;align-items:center;gap:16px;max-width:980px;margin:0 auto}
.t3-row .dz-q{width:54px;height:54px}
.t3-row blockquote{margin:0}
.t3-row h2{font-size:clamp(34px,4.6vw,64px);font-weight:500;line-height:1.08;letter-spacing:-.01em}
.t3-row p{font-size:18px;color:var(--muted);line-height:1.65;max-width:680px;margin:16px auto 0}
@media(max-width:600px){.t3-row{padding:52px 0}.t3-row .in{padding:0 4px}}
'''
    return html, css

def t4():
    nodes = ''.join(
        '<li class="%s"><span class="dot"></span><article><span class="yr">%s</span><h3>%s</h3><p>%s</p><a class="lnk" href="%s">Explore the programme &#8599;</a></article></li>' % (
            'r' if i % 2 else 'l', a, b, c, YC) for i, (a, b, c) in enumerate(ITEMS))
    nodes += '<li class="%s next"><span class="dot"></span><article><span class="yr">Next</span><h3>Your story</h3><p>What has God done for you this year? Share it and encourage someone today.</p><a class="btn" href="%s">Share your testimony %s</a></article></li>' % ('r', SHARE, ARW)
    html = ('<section class="navy t4-hero ctr"><div class="sp"></div><div class="ed in"><span class="k lt">Testimonies</span><h1>God is still <em>doing it.</em></h1>'
            '<p>One story after another of what God has done across our ministry family.</p></div></section>'
            '<section class="t4"><div class="ed"><ol class="tl">%s</ol>%s</div></section>' % (nodes, verse()))
    css = '''
.t4-hero .in{padding:56px 0 64px}
.t4-hero h1{font-size:clamp(42px,6vw,86px);font-weight:500;line-height:1.04;margin:16px 0 12px;color:#fff}
.t4-hero h1 em{color:var(--gold2)}
.t4-hero p{color:#c9d3e3;font-size:17px;margin:0}
.t4{background:var(--cream);padding:70px 0;text-align:center}
.t4 .tl{list-style:none;margin:0 auto;padding:0;position:relative;max-width:1100px}
.t4 .tl:before{content:"";position:absolute;left:50%;top:0;bottom:0;width:2px;transform:translateX(-50%);background:linear-gradient(var(--gold),#e85d26 70%,transparent)}
.t4 li{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:70px;margin:0 0 34px}
.t4 li .dot{position:absolute;left:50%;top:38px;width:18px;height:18px;border-radius:50%;background:var(--gold);transform:translateX(-50%);box-shadow:0 0 0 6px #c9952c33}
.t4 li article{background:#fff;border:1px solid #ebe4d6;border-radius:16px;padding:30px;display:flex;flex-direction:column;align-items:center;gap:10px;box-shadow:0 12px 30px rgba(20,34,64,.06)}
.t4 li.l article{grid-column:1}
.t4 li.r article{grid-column:2}
.t4 .yr{font:600 26px/1.1 Fraunces,serif;color:var(--gold)}
.t4 h3{font-size:clamp(24px,2.3vw,30px);font-weight:500;line-height:1.15}
.t4 li p{margin:0;color:var(--muted);line-height:1.6}
.t4 li.next article{background:var(--navy);color:#fff;border-color:var(--navy)}
.t4 li.next h3{color:#fff}.t4 li.next p{color:#c9d3e3}.t4 li.next .yr{color:var(--gold2)}
.t4 .dz-v{margin-top:34px}
@media(max-width:800px){.t4 .tl:before{left:50%}.t4 li{grid-template-columns:1fr;gap:0;padding-top:30px}.t4 li .dot{top:0}.t4 li.l article,.t4 li.r article{grid-column:1}}
'''
    return html, css

def t5():
    cards = ''.join('<article class="c"><span class="glow"></span>%s<span class="k lt">%s</span><h3>%s</h3><p>%s</p><a href="%s">Explore the programme &#8599;</a></article>' % (Q, a, b, c, YC) for a, b, c in ITEMS)
    html = ('<section class="navy t5"><div class="sp" style="background:transparent"></div><div class="ed in ctr"><span class="k lt">Testimonies</span><h1>God is still <em>doing it.</em></h1>'
            '<p>Read what God has done across Mega Region 2.</p><div class="g">%s</div>'
            '<div class="cta"><h2>Has God done something for you?</h2><a class="btn" href="%s">Share your testimony %s</a>%s</div></div></section>') % (cards, SHARE, ARW, verse('lt'))
    css = '''
.t5{background:radial-gradient(ellipse 70% 50% at 50% 0,#22365f 0,#142240 55%,#0c1730 100%)!important}
.t5 .in{padding:54px 0 84px}
.t5 h1{font-size:clamp(44px,6.6vw,96px);font-weight:500;line-height:1.02;margin:18px 0 12px;color:#fff}
.t5 h1 em{color:var(--gold2)}
.t5 .in>p{color:#c9d3e3;font-size:17px;margin:0 0 46px}
.t5 .g{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.t5 .c{position:relative;overflow:hidden;border-radius:18px;padding:36px 30px;background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02));border:1px solid rgba(240,199,96,.35);display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center}
.t5 .c .glow{position:absolute;top:-80px;left:50%;width:220px;height:160px;transform:translateX(-50%);background:radial-gradient(circle,rgba(240,199,96,.28),transparent 70%)}
.t5 .c>*{position:relative}
.t5 .c h3{font-size:clamp(24px,2.3vw,31px);font-weight:500;line-height:1.15;color:#fff}
.t5 .c p{color:#c9d3e3;margin:0;line-height:1.6;flex:1}
.t5 .c a{color:var(--gold2);font-weight:700;font-size:14px}
.t5 .cta{margin-top:56px;padding-top:44px;border-top:1px solid rgba(240,199,96,.25)}
.t5 .cta h2{font-size:clamp(28px,3.4vw,44px);font-weight:500;color:#fff;margin:0 0 22px}
@media(max-width:900px){.t5 .g{grid-template-columns:1fr;max-width:560px;margin:0 auto}}
'''
    return html, css

T_DESIGNS_OLD = [('Three cards', t1), ('Featured + pair', t2), ('Scripture quotes', t3), ('Timeline', t4), ('Dark spotlight', t5)]
from designs_t2 import T_DESIGNS

# ---------------------------------------------------------------- Reach Out
SUBJ = {
    'prayer': ('Request prayer', 'Tell us what to pray about. Your request is kept confidential and our prayer team will stand with you.', 'Prayer Request', 'What would you like us to pray about?'),
    'testimony': ('Share your testimony', 'Tell us what God has done. The team reads every testimony before it appears on the Testimonies page.', 'Testimony', 'What has God done for you?'),
    'general': ('Contact us', 'Questions, ministry support or anything else. Our regional team will reply with care.', 'General Message', 'How can we help?'),
}
ICONS = {
    'prayer': '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 5c10 9 15 17 15 26a15 15 0 0 1-30 0c0-7 3.8-12.6 7.4-16.4.3 5 2.6 8.2 5.4 8.9C27.9 16.6 29.3 10.7 32 5Z" fill="#e85d26"/><path d="M32 30c3.6 3.4 5.4 6.2 5.4 9.4a5.4 5.4 0 0 1-10.8 0c0-3 1.8-5.6 5.4-9.4Z" fill="#ffd27a"/></svg>',
    'testimony': '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 40c0-10 5-17 15-21l2 4c-5 2.6-7.6 6-8 10h7v14H14Zm22 0c0-10 5-17 15-21l2 4c-5 2.6-7.6 6-8 10h7v14H36Z" fill="#c9952c"/></svg>',
    'general': '<svg viewBox="0 0 64 64" fill="none" stroke="#c9952c" stroke-width="3.4" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="16" width="46" height="33" rx="5"/><path d="m11 19 21 16 21-16" stroke-linecap="round"/></svg>',
}
JER = ('Call unto me, and I will answer thee, and shew thee great and mighty things, which thou knowest not.', 'Jeremiah 33:3')

# switching subject inside the page (tabs / choice cards); the page's own scripts handle the first load
R_JS = '''<script>(function(){var T=%s;function set(s){var t=T[s];if(!t)return;var h=document.querySelector('#reach-out h2'),p=h&&h.nextElementSibling;if(h)h.textContent=t[0];if(p)p.textContent=t[1];
var sel=document.querySelector('#reach-out select[name=type]');if(sel){for(var i=0;i<sel.options.length;i++)if(sel.options[i].text===t[2])sel.selectedIndex=i;sel.dispatchEvent(new Event('change'));}
var ta=document.querySelector('#reach-out textarea');if(ta)ta.placeholder=t[3];document.querySelectorAll('[data-subj]').forEach(function(b){var on=b.getAttribute('data-subj')===s;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');});
try{history.replaceState(null,'','#'+s);}catch(e){}}
document.querySelectorAll('[data-subj]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();set(b.getAttribute('data-subj'));var f=document.getElementById('reachForm');if(f&&b.hasAttribute('data-jump'))setTimeout(function(){f.scrollIntoView({behavior:'smooth',block:'center'});},60);});});
var s=(location.hash||'').slice(1);set(T[s]?s:'%s');})();</script>'''

def r_js(default='general'):
    import json
    return R_JS % (json.dumps(SUBJ), default)

def form_html(src):
    a = src.index('<form class="prayer-form compact" id="reachForm"')
    b = src.index('</div></div></section>', a)  # success box ends the old section
    return src[a:b + len('</div>')]

def r1(F):
    html = ('<section id="reach-out" class="navy r1"><div class="sp"></div><div class="ed g"><div class="intro ctr"><span class="k lt">Reach out to us</span><h2>How can the ministry assist you?</h2>'
            '<p>Prayer requests, testimonies, pastoral support and general messages all reach our regional team here.</p>'
            '<div class="ph"><img src="img/photos/community.webp" alt="Reaching out to the community in prayer" width="1300" height="920"></div>'
            '<p class="dz-v lt">&ldquo;%s&rdquo;<b>%s</b></p></div><div class="fw">%s</div></div></section>') % (JER[0], JER[1], F)
    css = '''
.r1{padding-bottom:80px}
.r1 .g{display:grid;grid-template-columns:.95fr 1.05fr;gap:clamp(36px,5vw,80px);align-items:center;padding-top:40px}
.r1 h2{font-size:clamp(38px,4.6vw,64px);font-weight:500;line-height:1.05;margin:16px 0 14px;color:#fff}
.r1 .intro>p{color:#c9d3e3;line-height:1.65;max-width:520px;margin:0 auto}
.r1 .ph{margin:26px auto 0;border-radius:16px;overflow:hidden;max-width:560px;box-shadow:0 24px 60px rgba(0,0,0,.35)}
.r1 .ph img{display:block;width:100%;height:auto}
.r1 .fw .prayer-form{background:#fff;border-radius:18px;box-shadow:0 30px 70px rgba(0,0,0,.35)}
@media(max-width:900px){.r1 .g{grid-template-columns:1fr}.r1 .ph{display:none}}
'''
    return html, css

def r2(F):
    cards = ''.join('<a href="#%s" class="ch" data-subj="%s" data-jump aria-pressed="false"><span class="ic">%s</span><b>%s</b><span>%s</span></a>' % (
        k, k, ICONS[k], v[0], {'prayer': 'Our prayer team will stand with you.', 'testimony': 'Tell us what God has done.', 'general': 'Questions or ministry support.'}[k]) for k, v in SUBJ.items())
    html = ('<section id="reach-out" class="r2"><div class="navy top ctr"><div class="sp"></div><div class="ed in"><span class="k lt">Reach out to us</span>'
            '<h2>How can we help you?</h2><p>Choose what you would like to do. Our regional team reads every message.</p><div class="chs">%s</div></div></div>'
            '<div class="bot"><div class="fw">%s</div></div></section>') % (cards, F)
    css = '''
.r2 .top .in{padding:46px 0 120px}
.r2 h2{font-size:clamp(40px,5vw,70px);font-weight:500;line-height:1.05;margin:16px 0 12px;color:#fff}
.r2 .top p{color:#c9d3e3;margin:0 auto 34px;max-width:560px;line-height:1.6}
.r2 .chs{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;max-width:1080px;margin:0 auto}
.r2 .ch{display:flex;flex-direction:column;align-items:center;gap:10px;padding:28px 20px;border-radius:18px;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.18);color:#fff;text-decoration:none;transition:transform .2s,border-color .2s,background .2s}
.r2 .ch:hover{transform:translateY(-3px)}
.r2 .ch.on{background:#fff;border-color:var(--gold);color:var(--navy);box-shadow:0 18px 40px rgba(0,0,0,.3)}
.r2 .ch .ic{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:rgba(240,199,96,.14)}
.r2 .ch .ic svg{width:36px;height:36px}
.r2 .ch b{font:500 24px/1.15 Fraunces,serif}
.r2 .ch span:last-child{font-size:14px;opacity:.8}
.r2 .bot{background:var(--cream);padding:0 var(--edge) 80px}
.r2 .fw{max-width:860px;margin:-80px auto 0;position:relative;z-index:2}
.r2 .fw .prayer-form{border-radius:18px;box-shadow:0 26px 60px rgba(20,34,64,.18);background:#fff}
@media(max-width:800px){.r2 .chs{grid-template-columns:1fr;max-width:420px}.r2 .ch{flex-direction:row;text-align:left;padding:16px 18px}.r2 .ch b{font-size:20px}.r2 .ch span:last-child{display:none}.r2 .ch .ic{width:48px;height:48px;flex:none}.r2 .top .in{padding-bottom:110px}}
'''
    return html, css + '', r_js()

def r3(F):
    html = ('<section id="reach-out" class="navy r3"><div class="sp" style="background:transparent"></div><div class="ed in ctr">'
            '<p class="dz-v lt top">&ldquo;%s&rdquo;<b>%s</b></p><div class="card"><span class="k">Reach out to us</span><h2>How can the ministry assist you?</h2>'
            '<p>Prayer requests, testimonies, pastoral support and general messages all reach our regional team here.</p>%s</div>'
            '<p class="trust">Your message goes only to the MFM Mega Region 2 regional team. Prayer requests are kept confidential.</p></div></section>') % (JER[0], JER[1], F)
    css = '''
.r3{background:radial-gradient(ellipse 70% 55% at 50% 0,#22365f 0,#142240 55%,#0c1730 100%)!important;padding-bottom:70px}
.r3 .in{padding-top:30px}
.r3 .top{max-width:720px;margin:0 auto 30px}
.r3 .card{max-width:720px;margin:0 auto;background:#fff;color:var(--ink);border-radius:22px;padding:clamp(26px,4vw,46px);box-shadow:0 34px 80px rgba(0,0,0,.4)}
.r3 .card h2{font-size:clamp(32px,3.8vw,50px);font-weight:500;line-height:1.08;margin:14px 0 10px;color:var(--ink)}
.r3 .card>p{color:var(--muted);line-height:1.6;max-width:520px;margin:0 auto 18px}
.r3 .card .prayer-form{background:transparent;box-shadow:none;padding:0;text-align:left}
.r3 .trust{color:#9fb0c8;font-size:13.5px;margin:22px auto 0;max-width:560px}
'''
    return html, css

def r4(F):
    html = ('<section id="reach-out" class="r4"><div class="ph"><img src="img/photos/community.webp" alt="Reaching out to the community in prayer" width="1300" height="920">'
            '<div class="ov ctr"><span class="k lt">Reach out to us</span><h2>How can the ministry assist you?</h2>'
            '<p>Prayer requests, testimonies, pastoral support and general messages all reach our regional team here.</p><p class="dz-v lt">&ldquo;%s&rdquo;<b>%s</b></p></div></div>'
            '<div class="side"><div class="fw">%s</div></div></section>') % (JER[0], JER[1], F)
    css = '''
.r4{display:grid;grid-template-columns:1fr 1fr;min-height:calc(100vh - 0px);padding-top:84px;background:var(--cream)}
.r4 .ph{position:relative;overflow:hidden;min-height:560px}
.r4 .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.r4 .ph:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,26,51,.55),rgba(14,26,51,.88))}
.r4 .ov{position:relative;z-index:1;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px var(--edge)}
.r4 h2{font-size:clamp(36px,4.2vw,60px);font-weight:500;line-height:1.06;margin:16px 0 14px;color:#fff}
.r4 .ov>p{color:#dfe5ee;line-height:1.65;max-width:500px;margin:0}
.r4 .side{display:flex;align-items:center;justify-content:center;padding:48px var(--edge)}
.r4 .fw{width:100%;max-width:620px}
.r4 .fw .prayer-form{background:#fff;border-radius:18px;box-shadow:0 22px 50px rgba(20,34,64,.12)}
@media(max-width:900px){.r4{grid-template-columns:1fr}.r4 .ph{min-height:420px}}
'''
    return html, css

def r5(F):
    tabs = ''.join('<button type="button" class="tab" data-subj="%s" aria-pressed="false">%s<span>%s</span></button>' % (k, ICONS[k], v[0]) for k, v in SUBJ.items())
    info = ('<div class="info"><div><b>Call us</b><a href="tel:+18327888504">+1 (832) 788-8504</a></div>'
            '<div><b>Visit Prayer City</b><span>10000 Kleckley Dr, Houston, TX 77075</span></div>'
            '<div><b>Follow us</b><span><a href="https://youtube.com/@mfmmegaregion2usa">YouTube</a> &middot; <a href="https://facebook.com/mfmmegaregion2usa">Facebook</a> &middot; <a href="https://instagram.com/mfmmegaregion2usa">Instagram</a></span></div></div>')
    html = ('<section id="reach-out" class="r5"><div class="navy hd ctr"><div class="sp"></div><div class="ed in"><span class="k lt">Reach out to us</span>'
            '<h2>How can the ministry assist you?</h2><p>Prayer requests, testimonies, pastoral support and general messages all reach our regional team here.</p></div></div>'
            '<div class="body ed"><div class="panel"><div class="tabs" role="group" aria-label="What would you like to do?">%s</div>%s</div>%s</div></section>') % (tabs, F, info)
    css = '''
.r5 .hd .in{padding:44px 0 110px}
.r5 h2{font-size:clamp(38px,4.8vw,66px);font-weight:500;line-height:1.05;margin:16px 0 12px;color:#fff}
.r5 .hd p{color:#c9d3e3;max-width:600px;margin:0 auto;line-height:1.6}
.r5 .body{margin-top:-74px;position:relative;z-index:2;padding-bottom:70px}
.r5 .panel{background:#fff;border-radius:20px;box-shadow:0 26px 60px rgba(20,34,64,.16);overflow:hidden;max-width:1040px;margin:0 auto}
.r5 .tabs{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid #ece6d8}
.r5 .tab{display:flex;align-items:center;justify-content:center;gap:10px;padding:18px 10px;background:#faf7f0;border:0;border-right:1px solid #ece6d8;font:600 15.5px 'Inter Tight',sans-serif;color:var(--ink);cursor:pointer}
.r5 .tab:last-child{border-right:0}
.r5 .tab svg{width:24px;height:24px}
.r5 .tab.on{background:#fff;box-shadow:inset 0 -3px 0 var(--gold)}
.r5 .panel .prayer-form{background:#fff;box-shadow:none}
.r5 .info{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;max-width:1040px;margin:22px auto 0;text-align:center}
.r5 .info>div{background:var(--cream);border:1px solid #ece6d8;border-radius:16px;padding:22px;display:flex;flex-direction:column;gap:6px;color:var(--muted);font-size:15px}
.r5 .info b{font:500 20px Fraunces,serif;color:var(--ink)}
.r5 .info a{color:#8a6414;font-weight:600}
@media(max-width:800px){.r5 .tab span{font-size:13px}.r5 .tab{flex-direction:column;gap:6px;padding:14px 6px}.r5 .info{grid-template-columns:1fr}}
'''
    return html, css, r_js()

R_DESIGNS = [('Split with photo', r1), ('Choose your path', r2), ('Centred card', r3), ('Full-bleed photo', r4), ('Tabs + contact info', r5)]


def picker(kind, n, names, files):
    links = ''.join('<a href="%s" class="%s" title="%s">%d</a>' % (files[i], 'on' if i + 1 == n else '', names[i], i + 1) for i in range(len(names)))
    return ('<div class="dz-pick" role="navigation" aria-label="Design picker"><span>%s design</span>%s<em>%s</em></div>'
            '<style>.dz-pick{position:fixed;left:50%%;bottom:18px;transform:translateX(-50%%);z-index:9999;display:flex;align-items:center;gap:6px;background:#142240;color:#fff;border:1px solid rgba(240,199,96,.5);border-radius:100px;padding:7px 10px 7px 16px;box-shadow:0 12px 34px rgba(0,0,0,.35);font:600 13px "Inter Tight",sans-serif;white-space:nowrap}'
            '.dz-pick a{display:grid;place-items:center;width:32px;height:32px;border-radius:50%%;color:#fff;text-decoration:none;border:1px solid rgba(255,255,255,.25)}.dz-pick a.on{background:#c9952c;color:#142240;border-color:#c9952c}'
            '.dz-pick em{font-style:normal;color:#f0c760;margin-left:6px;padding-right:6px}@media(max-width:600px){.dz-pick em{display:none}.dz-pick{bottom:12px}}</style>') % (kind, links, names[n - 1])


def page_variants(src_testi, src_reach):
    """returns {filename: html}"""
    out = {}
    tf = ['testimonies-%d.html' % (i + 1) for i in range(5)]
    rf = ['reach-out-%d.html' % (i + 1) for i in range(5)]
    for i, (name, fn) in enumerate(T_DESIGNS):
        r = fn(); html, css = r[0], r[1]; js = r[2] if len(r) > 2 else ''
        t = re.sub(r'<main id="content"[^>]*>.*?</main>', '<main id="content" class="dz">%s</main>' % html, src_testi, count=1, flags=re.S)
        t = t.replace('</head>', '<style>%s%s%s</style>\n</head>' % (BASE, T_CSS_COMMON, css), 1)
        t = t.replace('</body>', js + picker('Testimonies', i + 1, [d[0] for d in T_DESIGNS], tf) + '\n</body>', 1)
        out[tf[i]] = t
    if src_reach is None:
        return out
    F = form_html(src_reach)
    for i, (name, fn) in enumerate(R_DESIGNS):
        r = fn(F)
        html, css = r[0], r[1]
        js = r[2] if len(r) > 2 else ''
        t = re.sub(r'<main id="content"[^>]*>.*?</main>', '<main id="content" class="dz ek-page">%s</main>' % html, src_reach, count=1, flags=re.S)
        t = t.replace('</head>', '<style>%s%s%s</style>\n</head>' % (BASE, T_CSS_COMMON, css), 1)
        t = t.replace('</body>', js + picker('Reach Out', i + 1, [d[0] for d in R_DESIGNS], rf) + '\n</body>', 1)
        out[rf[i]] = t
    return out
