"""Private preview v2 on main: hidden, noindex, unlinked pages. The real homepage is not touched.
   /preview-home, /preview-play, /preview-testimonies, /preview-reach-out, /preview-message"""
import re, pathlib
R = pathlib.Path('/home/claude/mfm-mega-region2')
SRC = open('/home/claude/preview-work/make_preview.py').read()
def grab(name):
    return eval(re.search(name + r" = (\'\'\'.*?\'\'\')", SRC, re.S).group(1))
TODAY, PLAY, PP, TODAYJS = grab('TODAY'), grab('PLAY'), grab('PP'), grab('TODAYJS')

BANNER = '<div class="pv-banner">Private preview &middot; not the live homepage</div>'
CSS = '<link rel="stylesheet" href="/css/engage.css">'
NAV_DD = '<a href="/preview-play">\n              <div class="nav-dd-label">Play &amp; Grow<span>Daily Bible game &amp; branch leaderboard</span></div>\n            </a>\n'
NAV_MOB = '<a href="/preview-play" data-mfm-menu-link><span><strong>Play &amp; Grow</strong><small>Daily Bible game &amp; branch leaderboard</small></span><span aria-hidden="true">&rarr;</span></a>'
FOOT_REACH = ('<div class="foot-reach"><p>Prayer request, testimony or question?</p><div class="btns">'
              '<a class="prim" href="/preview-reach-out?subject=prayer">Request prayer</a>'
              '<a href="/preview-reach-out?subject=testimony">Share a testimony</a>'
              '<a href="/preview-reach-out?subject=general">Contact us</a></div></div>')
NLJS = ('<script>document.querySelectorAll("form[data-preview], .nl-inline[data-preview] form").forEach(function(f){f.addEventListener("submit",function(e){e.preventDefault();'
        'var o=f.querySelector(".nl-ok")||f.parentNode.querySelector(".nl-inline-ok");if(o){o.hidden=false;o.textContent="Preview only — this form does not send.";}});});</script>')


def private(s):
    s = re.sub(r'<meta name="robots"[^>]*>', '', s)
    s = s.replace('<head>', '<head>\n<meta name="robots" content="noindex, nofollow">', 1)
    s = re.sub(r'<link rel="canonical"[^>]*>', '', s)
    if 'engage.css' not in s:
        s = s.replace('</head>', CSS + '\n</head>', 1)
    # menu: Play & Grow in the Media & Events dropdown + phone drawer (preview links)
    s = re.sub(r'(<a href="/events">\s*<div class="nav-dd-label">Events<span>[^<]*</span></div>\s*</a>\n)', lambda m: m.group(1) + '            ' + NAV_DD, s, count=1)
    s = re.sub(r'(<a href="/gallery" data-mfm-menu-link>.*?</a>)', lambda m: m.group(1) + NAV_MOB, s, count=1, flags=re.S)
    # every "reach out" link goes to the new page
    s = re.sub(r'href="/\?subject=(\w+)#reach-out"', r'href="/preview-reach-out?subject=\1"', s)
    s = s.replace('href="/#reach-out"', 'href="/preview-reach-out"')
    # slim reach-out row at the top of the footer
    s = re.sub(r'(<div class="footer-identity">.*?</blockquote>)', lambda m: m.group(1) + FOOT_REACH.replace('class="foot-reach"', 'class="foot-reach fr3"', 1), s, count=1, flags=re.S)
    # computers: a full-width centred copy below the footer columns (phones keep the one under the verse)
    s = s.replace('<div class="footer-bottom', FOOT_REACH.replace('class="foot-reach"', 'class="foot-reach fr-wide wrap"', 1) + '<div class="footer-bottom', 1)
    s = s.replace('</body>', BANNER + '\n</body>', 1)
    return s


def shell(title, main, scripts=''):
    t = (R / 'index.html').read_text()
    head = re.sub(r'<title>.*?</title>', f'<title>{title} | MFM Mega Region 2 USA</title>', t[:t.index('</head>')])
    body_start = t[t.index('</head>'):t.index('<main id="content"')] if '<main id="content"' in t else None
    return head, body_start


# ---------- /preview-home ----------
s = (R / 'index.html').read_text()
s = re.sub(r'<title>.*?</title>', '<title>Private preview — Homepage | MFM Mega Region 2 USA</title>', s, count=1)
TODAY2 = '''<section class="today" aria-labelledby="today-h"><div class="ek-wrap"><div class="today-head"><span class="ek-eyebrow">Today in the region</span><h2 id="today-h">A word and a prayer for today.</h2><p>Begin with Scripture, pray the declaration, then play today&rsquo;s Play &amp; Grow.</p><span class="pv-note" style="margin:0">Preview &middot; sample declaration</span></div>
<div class="today-panel"><article class="tp-word"><span class="k">Today&rsquo;s declaration</span><blockquote>&ldquo;Is not my word like as a fire? saith the LORD; and like a hammer that breaketh the rock in pieces?&rdquo;<cite>Jeremiah 23:29</cite></blockquote><ul><li>Every rock standing against my destiny, break in pieces, in Jesus&rsquo; name.</li><li>Fire of God, burn in my heart and in my home today.</li><li>I receive power to finish what I start, in Jesus&rsquo; name.</li></ul><div class="foot"><a class="ek-btn ghost" href="https://wa.me/?text=Today%27s%20declaration%20from%20MFM%20Mega%20Region%202%20https%3A%2F%2Fmfmmegaregion2usa.org">Share on WhatsApp</a><a class="ek-btn" href="#" data-open-nl>Get them by email</a></div></article>
<article class="tp-quiz"><div class="pg-badge" aria-hidden="true"><svg viewBox="0 0 64 64" width="50" height="50"><defs><linearGradient id="pgG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6da8a"/><stop offset="1" stop-color="#c9952c"/></linearGradient><linearGradient id="pgF" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e85d26"/><stop offset="1" stop-color="#ffc061"/></linearGradient></defs><path d="M19 9h26v11c0 8.5-5.8 15-13 15s-13-6.5-13-15Z" fill="url(#pgG)"/><path d="M19 13h-7v4c0 6 4 10 9 11M45 13h7v4c0 6-4 10-9 11" fill="none" stroke="url(#pgG)" stroke-width="3.2" stroke-linecap="round"/><path d="M29 35h6v8h-6z" fill="#c9952c"/><path d="M22 43h20l3 9H19z" fill="url(#pgG)"/><path d="M32 12.5c4.8 4.3 7 7.6 7 11.6a7 7 0 0 1-14 0c0-3.2 1.8-5.6 3.4-7.4.1 2.2 1.1 3.6 2.4 3.9-.9-3.1-.2-5.8 1.2-8.1Z" fill="url(#pgF)"/><path d="M32 21c1.8 1.7 2.8 3.1 2.8 4.8a2.8 2.8 0 0 1-5.6 0c0-1.5.9-2.8 2.8-4.8Z" fill="#fff3d6"/></svg></div><span class="k">Play &amp; Grow &middot; Day <span id="hq-no"></span></span><h3>5 questions. 2 minutes. Can you get them all?</h3><p>Bible, the MFM family story and last week&rsquo;s messages.</p><div class="pg-chips"><span class="pg-chip">&#127942; Top branch this week: <b>MFM USA Prayer City</b></span><span class="pg-chip">&#128293; Play daily, build your streak</span></div><div class="foot"><a class="ek-btn" href="/preview-play">Play now</a></div></article></div></div></section>'''
s = re.sub(r'<section class="quick-paths wrap">.*?</section>', TODAY2, s, count=1, flags=re.S)
# 3) Come prepared: welcome photo + three pillars instead of the three boxes
s = re.sub(r'<div id="visit" class="visitor-facts">.*?</div></div></section>', '<figure id="visit" class="cp-photo"><picture><source type="image/webp" srcset="/img/gallery/nashville-deliverance-crusade-2026/a-holy-greeting-800.webp 800w, /img/gallery/nashville-deliverance-crusade-2026/a-holy-greeting-1080.webp 1080w" sizes="(max-width: 900px) 100vw, 560px"><img src="/img/gallery/nashville-deliverance-crusade-2026/a-holy-greeting-800.jpg" alt="Members greet each other with joy at the Nashville gathering" width="800" height="533" loading="lazy" decoding="async"></picture><figcaption>A welcome rooted in real community</figcaption></figure></div></section>', s, count=1, flags=re.S)
s = s.replace('<h2>Come prepared. Leave transformed.</h2>', '<h2>Come prepared. <span class="nw">Leave transformed.</span></h2>', 1)
s = s.replace('know what to expect before you arrive.</p>', 'know what to expect before you arrive.</p><ul class="cp-pillars"><li><b>Worship</b><span>Join a praying family.</span></li><li><b>The Word</b><span>Grow in Scripture.</span></li><li><b>Prayer</b><span>Come as you are.</span></li></ul>', 1)
# 4) church search box -> /branches?q=
s = re.sub(r'<a class="button" href="/branches">Search all locations<svg.*?</svg></a>', '<form class="cs-form" action="/branches" method="get" role="search"><label class="sr-only" for="cs-q">City, state or ZIP code</label><input id="cs-q" name="q" type="search" placeholder="City, state or ZIP code" autocomplete="postal-code"><button type="submit">Find a Church</button></form><a class="cs-all" href="/branches">or browse all locations &rarr;</a>', s, count=1, flags=re.S)
s = re.sub(r'<section class="welcome-photo section wrap">.*?</section>', '', s, count=1, flags=re.S)
s = s.replace('Search the complete verified directory, review service information and open a dedicated page for every branch.</p>',
              'Across Texas, Florida, Georgia, North Carolina, Oklahoma and Tennessee, under the leadership of Pastor Olumide Oni and Pastor (Mrs.) Oluwatoyin Oni. Search the verified directory and open a page for every branch.</p>', 1)
s = s.replace('<a class="button light" href="/media">Watch latest video', '<a class="button" href="/preview-message#prayer-points" style="margin-right:10px;background:#fff;color:#142240">Prayer points from this message</a><a class="button light" href="/media">Watch latest video', 1)
TESTI_HOME = '''<section class="htesti" aria-labelledby="htesti-h"><div class="ek-wrap"><span class="ek-eyebrow">Testimonies</span><h2 id="htesti-h">God is still doing it.</h2><p class="lead">Stories shared across our ministry family. These first reflections come from the MFM Mega Region 2 Youth &amp; Young Adult Church.</p>
<div class="ht-grid"><article class="ht-feat"><span class="q">&rdquo;</span><span class="k">Featured reflection &middot; Resurgence 2024</span><h3>From fear toward purpose.</h3><p>&ldquo;The 2024 Resurgence Program was a powerful move of God. We watched young people step out of fear, step into purpose, and encounter Jesus in a real and personal way.&rdquo;</p><div class="ht-foot"><span>Youth &amp; Young Adult Church</span><a href="https://mfmmegaregion2yc.org/events">Explore the programme &#8599;</a></div></article>
<div class="ht-side"><article class="ht-card"><span class="k">IYC 2025</span><h3>A generation growing in faith.</h3><p>&ldquo;IYC 2025 was a beautiful reminder that God is raising a global generation of young believers who understand their authority in Christ.&rdquo;</p><a href="https://mfmmegaregion2yc.org/events">Explore the programme &#8599;</a></article>
<article class="ht-card"><span class="k">Launch Pad 1.0</span><h3>Clarity, confidence and purpose.</h3><p>&ldquo;Launch Pad 1.0 was nothing short of a divine success. We saw young people step into clarity, confidence and purpose in a way that only God could orchestrate.&rdquo;</p><a href="https://mfmmegaregion2yc.org/events">Explore the programme &#8599;</a></article></div></div>
<div class="btns"><a class="ek-btn" href="/preview-testimonies">Read more testimonies</a><a class="ek-btn ghost" href="/preview-reach-out?subject=testimony">Share your testimony</a></div></div></section>'''

TESTI_HOME = ('<section class="tsa" aria-labelledby="tsa-h"><div class="wrap"><div class="tsa-stage">'
  '<div class="tsa-head"><div><span class="tsa-k">Testimonies</span><h2 id="tsa-h">God is still doing it.</h2></div>'
  '<p>Stories shared across our ministry family. These programme reflections come from the MFM Mega Region 2 Youth &amp; Young Adult Church.</p></div>'
  '<div class="tsa-grid"><article class="tsa-feat"><span class="tsa-k">Featured reflection &middot; Resurgence 2024</span><h3>From fear toward purpose.</h3>'
  '<p>Young people encountered Jesus and took steps toward their calling during the Resurgence programme.</p>'
  '<div class="tsa-meta"><span>Youth &amp; Young Adult Church</span><a href="https://mfmmegaregion2yc.org/events">Explore the programme &#8599;</a></div></article>'
  '<div class="tsa-list"><article class="tsa-small"><div><span class="tsa-k">IYC 2025</span><h3>A generation growing in faith.</h3>'
  '<p>A gathering that affirmed young believers across the region and their identity in Christ.</p></div><a href="https://mfmmegaregion2yc.org/events">Explore the programme &#8599;</a></article>'
  '<article class="tsa-small"><div><span class="tsa-k">Launch Pad 1.0</span><h3>Clarity, confidence and purpose.</h3>'
  '<p>Young people took meaningful steps forward in faith and purpose.</p></div><a href="https://mfmmegaregion2yc.org/events">Explore the programme &#8599;</a></article></div></div>'
  '<div class="tsa-actions"><a class="tsa-btn" href="/preview-reach-out?subject=testimony">Share Your Testimony</a><a class="tsa-more" href="/preview-testimonies">Read more testimonies &rarr;</a></div>'
  '</div></div></section>')

# ---- v4: events section in the reference "Upcoming gatherings" design (own class names, countdown centred)
i = s.index('<section class="dark-section section">'); j = s.index('</section>', i) + len('</section>')
ev = s[i:j]
ev = ev.replace('<section class="dark-section section">', '<section class="ev2" aria-labelledby="ev2-h">', 1)
ev = ev.replace('<div class="wrap section-head"><div><p class="eyebrow light">What is happening now</p><h2>Gather with expectation.</h2></div>',
                '<div class="wrap ev2-head"><div><span class="ev2-k">Upcoming gatherings</span><h2 id="ev2-h">Gather with expectation.</h2></div>', 1)
ev = ev.replace('spotlight-shell', 'evx-shell').replace('class="event-spotlight"', 'class="evx"').replace('spotlight-controls', 'evx-controls')
ev = ev.replace('aria-label="Previous slide">\u2190<', 'aria-label="Previous event">\u2039<').replace('aria-label="Next slide">\u2192<', 'aria-label="Next event">\u203a<')
ev = re.sub(r'<div class="center-action">.*?</div>', '<div class="ev2-all"><a href="/events">Explore All Events</a></div>', ev, count=1, flags=re.S)
assert 'ev2-all' in ev and 'evx-shell' in ev, 'events markup changed'
s = s[:i] + ev + s[j:]
# the homepage spotlight script, renamed for the preview so the live styles don't apply
k0 = s.index('// spotlight from MFM_EVENTS'); k1 = s.index('</script>', k0)
js = s[k0:k1]
js = js.replace("'.spotlight-shell .event-spotlight'", "'.evx-shell .evx'").replace("'.spotlight-shell'", "'.evx-shell'")
js = js.replace('event-spotlight-flyer', 'evx-flyer').replace('event-spotlight-copy', 'evx-copy').replace('event-spotlight-theme', 'evx-theme')
js = js.replace('event-spotlight-meta', 'evx-meta').replace('event-spotlight-actions', 'evx-actions').replace('event-countdown', 'evx-cd')
js = js.replace('<p class="eyebrow light">\'+pad(i0+1)', '<p class="evx-k">\'+pad(i0+1)')
js = js.replace("'<div class=\"evx-flyer\">'+(e.image?", "'<div class=\"evx-flyer\">'+(e.image?'<i class=\"ev-bd\" style=\"background-image:url(\\''+esc(e.image)+'\\')\"></i>':'')+(e.image?", 1)
js = js.replace("shell.addEventListener('mouseenter',st);shell.addEventListener('mouseleave',maybePlay);shell.addEventListener('touchstart',st,{passive:true});",
                "var tt=null;shell.addEventListener('touchstart',function(){st();clearTimeout(tt);tt=setTimeout(maybePlay,8000);},{passive:true});")
js = js.replace('t=setInterval(function(){go(i0+1);},7500);', 't=setInterval(function(){go(i0+1);},6000);')
assert 'tt=setTimeout(maybePlay,8000)' in js and '6000' in js, 'autoplay patch failed'
assert "'.evx-shell .evx'" in js and 'ev-bd' in js and 'evx-k' in js and 'evx-cd' in js, 'spotlight script changed'
s = s[:k0] + js + s[k1:]
i = s.index('<section id="reach-out"'); j = s.index('</section>', s.index('id="reachSuccess"', i)) + len('</section>')
REACH = s[i:j]
s = s[:i] + TESTI_HOME + s[j:]
# preview newsletter pop-up (option B wording), not the live one
s = re.sub(r'<script src="/js/newsletter-popup\.js[^"]*" defer></script>', '<script src="/js/newsletter-popup-preview.js" defer></script>', s)
s = s.replace('</body>', TODAYJS.split('var lives=')[0] + '})();</script>' + NLJS + '<script>document.querySelectorAll("[data-open-nl]").forEach(function(a){a.addEventListener("click",function(e){e.preventDefault();if(window.MFMPopPreview)window.MFMPopPreview();});});</script>\n</body>', 1)
exec(open('/home/claude/preview-work/v6_home.py').read())
(R / 'preview-home.html').write_text(private(s))

# ---------- page builder from the homepage shell ----------
base = (R / 'index.html').read_text()
HEAD = base[:base.index('</head>')]
NAVBLOCK = base[base.index('</head>'):base.index('<section class="home-hero"')]
FOOT = base[base.index('<footer class="site-footer">'):]
FOOT = re.sub(r'<script src="/js/newsletter-popup\.js[^"]*" defer></script>', '', FOOT)
FOOT = re.sub(r'<script src="/js/home-hero\.js[^"]*"[^>]*></script>', '', FOOT)

def page(slug, title, main, scripts=''):
    h = re.sub(r'<title>.*?</title>', f'<title>{title} | MFM Mega Region 2 USA</title>', HEAD, count=1)
    h = h.replace('<script>document.documentElement.classList.add("home-top")</script>', '')  # inner pages: solid menu bar when scrolled
    nav = NAVBLOCK.replace('class="home', 'class="').replace('home-top', '')
    out = h + nav + '<main id="content" class="pv-page">' + main + '</main>\n' + FOOT.replace('</body>', scripts + '\n</body>', 1)
    (R / f'{slug}.html').write_text(private(out))

PAGE_TOP = '<div style="height:84px;background:#142240"></div>'
PLAY2 = PLAY
for a, b in [('A new Bible quiz every day', 'A new Bible game every day'), ('Every daily quiz adds', 'Every daily game adds'), ('Start today&rsquo;s quiz', 'Start today&rsquo;s game'), ('Today&rsquo;s quiz', 'Today&rsquo;s game'), ('Daily Quiz', 'Today&rsquo;s Play &amp; Grow')]:
    PLAY2 = PLAY2.replace(a, b)
page('preview-play', 'Play & Grow (private preview)', PAGE_TOP + open('/home/claude/preview-work/play2_main.html').read(), '<script src="/js/play2.js"></script>')
_pp = (R / 'preview-play.html').read_text(); (R / 'preview-play.html').write_text(_pp.replace('</head>', '<link rel="stylesheet" href="/css/play.css">\n</head>', 1))

page('preview-testimonies', 'Testimonies (private preview)', PAGE_TOP + '''<section class="play-hero" style="padding:70px 0 56px"><div class="ek-wrap"><div><span class="ek-eyebrow">Testimonies</span><h1>God is still <em>doing it.</em></h1><p>Read what God has done across Mega Region 2, and share your own testimony to encourage someone today. Every testimony is read before it appears here.</p><div class="row" style="display:flex;justify-content:center"><a class="ek-btn" href="/preview-reach-out?subject=testimony">Share your testimony</a></div></div></div></section>
<section class="play-sec cream"><div class="ek-wrap"><span class="pv-note">Sample layout &middot; the social media team adds the real testimonies</span><div class="testi-grid"><div class="testi-list">
<article class="testi"><small>Healing &middot; Branch &middot; Programme &middot; Month 2026</small><h3>Testimony title</h3><p>The full testimony appears here in the person&rsquo;s own words, with their first name and branch, and a button to share it on WhatsApp.</p></article>
<article class="testi"><small>Deliverance &middot; Branch &middot; Programme &middot; Month 2026</small><h3>Testimony title</h3><p>Newest first. Testimonies can be filtered by programme, for example the Nashville or Dallas crusades.</p></article>
</div></div></div></section>''', NLJS)

REACH_PAGE = REACH.replace('id="reach-out" class="section home-prayer"', 'id="reach-out" class="section home-prayer" style="padding-top:120px"')
REACH_PAGE = REACH_PAGE.replace('<p class="eyebrow light">Reach out to us</p>', '<p class="eyebrow light">Reach out to us</p>', 1)
REACH_PAGE = re.sub(r' data-netlify="true"| netlify-honeypot="bot-field"| data-ajax| data-success="#reachSuccess"| method="POST"| action="/thanks.html"', '', REACH_PAGE)
REACH_PAGE = REACH_PAGE.replace('name="reach-out"', 'name="reach-out-preview" data-preview', 1).replace('id="reachForm"', 'id="reachFormPv"', 1)
REACH_PAGE = REACH_PAGE.replace('<input type="hidden" name="form-name" value="reach-out">', '')
SUBJ = '''<script>(function(){var f=document.getElementById('reachFormPv');if(!f)return;var m={prayer:'Prayer Request',testimony:'Testimony',support:'Ministry Support',general:'General Message',newsletter:'Newsletter'};var s=(new URLSearchParams(location.search).get('subject')||'').toLowerCase();var sel=f.querySelector('select');if(sel&&m[s]){[].forEach.call(sel.options,function(o){o.selected=o.textContent.trim()===m[s];});}
f.addEventListener('submit',function(e){e.preventDefault();e.stopPropagation();var n=document.getElementById('pv-sent');if(!n){n=document.createElement('p');n.id='pv-sent';n.className='pv-note';n.style.marginTop='14px';f.appendChild(n);}n.textContent='Preview only — this form does not send. On the live site it goes to the ministry team exactly as today.';},true);})();</script>'''
page('preview-reach-out', 'Reach out (private preview)', REACH_PAGE, SUBJ)

# ---------- /preview-message (latest message page + prayer points + sign-up) ----------
m = (R / 'messages/the-problem-that-keeps-coming-back-ends-here.html').read_text()
m = re.sub(r'<title>.*?</title>', '<title>Private preview — Message page | MFM Mega Region 2 USA</title>', m, count=1)
pp = PP.replace('I Shall See the End of My Pharaoh', 'The Problem That Keeps Coming Back Ends Here').replace('healing-and-deliverance-hour-11-24-2026', 'the-problem-that-keeps-coming-back-ends-here')
pp = pp.replace('&ldquo;For the Egyptians whom ye have seen to day, ye shall see them again no more for ever.&rdquo; &mdash; Exodus 14:13', '&ldquo;What do ye imagine against the LORD? he will make an utter end: affliction shall not rise up the second time.&rdquo; &mdash; Nahum 1:9')
pp = pp.replace('href="/play"', 'href="/preview-play"')
m = re.sub(r'(<div class="msg-actions">.*?</div>)', lambda x: x.group(1) + pp, m, count=1, flags=re.S)
m = m.replace('</body>', NLJS + '\n</body>', 1)
(R / 'preview-message.html').write_text(private(m))
print('ok')

# ---- Dawn, Nov 26 (18:51): pop-up back to its original design (no Monday prayer points & declarations email) ----
_h = (R / 'preview-home.html').read_text()
_h = _h.replace('<script src="/js/newsletter-popup-preview.js" defer></script>', '<script src="/js/newsletter-popup.js" defer></script>')
_h = _h.replace('<a class="ek-btn" href="#" data-open-nl>Get them by email</a>', '')
_h = _h.replace('<h3>5 questions. 2 minutes. Can you get them all?</h3><p>Bible, the MFM family story and last week&rsquo;s messages.</p>', '<h3>10 questions. Can you get them all?</h3><p>The Bible, our pastors&rsquo; books, MFM Family and our messages.</p>')
_h = _h.replace('<span class="pg-chip">&#127942; Top branch this week: <b>MFM USA Prayer City</b></span>', '<span class="pg-chip">&#127942; <span data-home-top>Be the first to play this week</span></span>')
_h = _h.replace('</body>', '<script>/* Today card: real top branch from the leaderboard */(function(){var el=document.querySelector("[data-home-top]");if(!el)return;fetch("/.netlify/functions/leaderboard").then(function(r){return r.json()}).then(function(d){if(d&&d.branches&&d.branches[0]){el.innerHTML="Top branch this week: <b></b>";el.querySelector("b").textContent=d.branches[0].name;}}).catch(function(){});})();</script>\n</body>', 1)
(R / 'preview-home.html').write_text(_h)
_m = (R / 'preview-message.html').read_text()
_m = re.sub(r'<div class="nl-inline" data-preview>.*?<p class="nl-inline-ok" hidden></p></div>', '', _m, count=1, flags=re.S)
(R / 'preview-message.html').write_text(_m)
# ---- Reach Out: one page, the button you pressed sets the heading + message type ----
_r = (R / 'preview-reach-out.html').read_text()
_r = _r.replace('</body>', """<script>(function(){var s=((location.hash||'').slice(1)||new URLSearchParams(location.search).get('subject')||'').toLowerCase();var T={prayer:['Request prayer','Tell us what to pray about. Your request is kept confidential and our prayer team will stand with you.'],testimony:['Share your testimony','Tell us what God has done. The team reads every testimony before it appears on the Testimonies page.'],general:['Contact us','Questions, ministry support or anything else. Our regional team will reply with care.'],support:['Ministry support','Tell us how we can help. Our regional team will reply with care.']};var t=T[s];if(!t)return;var h=document.querySelector('#reach-out h2');var p=h&&h.nextElementSibling;if(h)h.textContent=t[0];if(p)p.textContent=t[1];var ta=document.querySelector('#reach-out textarea');if(ta)ta.placeholder={prayer:'What would you like us to pray about?',testimony:'What has God done for you?',general:'How can we help?',support:'How can we support you?'}[s]||ta.placeholder;document.title=t[0]+' | MFM Mega Region 2 USA';})();</script>
</body>""", 1)
(R / 'preview-reach-out.html').write_text(_r)
for _f in ['preview-home', 'preview-play', 'preview-testimonies', 'preview-reach-out', 'preview-message']:
    _fp = R / f'{_f}.html'; _t = _fp.read_text()
    if _t.count('<main') > 1:   # page() wrapped a second <main id="content"> inside the first
        _t = re.sub(r'<main id="content">\s*(<main id="content"[^>]*>)', r'\1', _t, count=1)
        _t = _t.replace('</main>\n</main>', '</main>', 1).replace('</main></main>', '</main>', 1)
        _fp.write_text(_t)
print('nov26 post-process ok')

import hashlib
def _v(path):
    return hashlib.sha256((R / path).read_bytes()).hexdigest()[:10]
rx = re.compile(r'((?:href|src)=")(/?)((?:css|js)/[\w.\-]+\.(?:css|js))(?:\?v=[\w]+)?(")')
for f in ['preview-home', 'preview-play', 'preview-testimonies', 'preview-reach-out', 'preview-message']:
    fp = R / f'{f}.html'; t = fp.read_text()
    t = rx.sub(lambda m: m.group(1) + '/' + m.group(3) + ('?v=' + _v(m.group(3)) if (R / m.group(3)).exists() else '') + m.group(4), t)
    fp.write_text(t)
print('stamped')
