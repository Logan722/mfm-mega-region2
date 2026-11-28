"""Build the engagement PREVIEW pages on branch preview-engagement (not for main)."""
import re, json, subprocess, pathlib
R = pathlib.Path('/home/claude/mfm-mega-region2')
BANNER = '<div class="pv-banner">Preview · not live · sample content</div>'
CSS = '<link rel="stylesheet" href="/css/engage.css?v=pv1">'
NAV_DD = ('<a href="/play">\n              <div class="nav-dd-label">Play &amp; Grow<span>Daily Bible quiz &amp; leaderboard</span></div>\n            </a>\n')
NAV_MOB = '<a href="/play" data-mfm-menu-link><span><strong>Play &amp; Grow</strong><small>Daily Bible quiz &amp; leaderboard</small></span><span aria-hidden="true">&rarr;</span></a>'


def add_nav(s):
    if '/play"' in s:
        return s
    s = re.sub(r'(<a href="/events">\s*<div class="nav-dd-label">Events<span>[^<]*</span></div>\s*</a>\n)', lambda m: m.group(1) + '            ' + NAV_DD, s, count=1)
    s = re.sub(r'(<a href="/gallery" data-mfm-menu-link>.*?</a>)', lambda m: m.group(1) + NAV_MOB, s, count=1, flags=re.S)
    return s


def common(s):
    s = add_nav(s)
    if 'engage.css' not in s:
        s = s.replace('</head>', CSS + '\n</head>', 1)
    if 'pv-banner' not in s:
        s = s.replace('</body>', BANNER + '\n</body>', 1)
    s = s.replace('<meta name="robots" content="index', '<meta name="robots" content="noindex')
    return s


def page(slug, title, desc, main, scripts=''):
    t = (R / 'gen218.html').read_text()
    head_end = t.index('</head>')
    head = t[:head_end]
    head = re.sub(r'<title>.*?</title>', f'<title>{title} | MFM Mega Region 2 USA</title>', head)
    head = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m.group(1) + desc, head)
    head = head.replace('https://mfmmegaregion2usa.org/gen218', f'https://mfmmegaregion2usa.org/{slug}')
    head = re.sub(r'(og:title" content=")[^"]*', lambda m: m.group(1) + title, head)
    head = re.sub(r'(twitter:title" content=")[^"]*', lambda m: m.group(1) + title, head)
    head = re.sub(r'(og:description" content=")[^"]*', lambda m: m.group(1) + desc, head)
    head = re.sub(r'(twitter:description" content=")[^"]*', lambda m: m.group(1) + desc, head)
    head = re.sub(r'(og:image:alt" content=")[^"]*', lambda m: m.group(1) + title, head)
    body = t[head_end:t.index('<main id="content">')]
    foot = t[t.index('</main>'):t.index('<script src="/js/events-data.js')]
    out = head + '<meta name="robots" content="noindex">\n' + body + '<main id="content">\n' + main + '\n' + foot + scripts + '\n</body>\n</html>\n'
    (R / f'{slug}.html').write_text(common(out))


NLBAND = '''<section class="nlband"><div class="ek-wrap nlband-grid"><div><span class="ek-eyebrow">Free every Monday</span><h2>The week&rsquo;s prayer points &amp; declarations in your inbox.</h2><p>One email a week from MFM Mega Region 2 USA. Unsubscribe anytime.</p><ul><li>Prayer points from Healing &amp; Deliverance Hour and Open Heaven Encounter</li><li>A new quiz pack and last week&rsquo;s leaderboard</li><li>Crusades and programmes near you, before anyone else</li></ul></div><form class="nl-form" data-preview><input type="text" placeholder="First name" aria-label="First name"><input type="email" placeholder="Email address" aria-label="Email address"><button type="submit">Send me the prayer points</button><small class="nl-ok">No spam. Preview only &mdash; this form does not send.</small></form></div></section>'''
NLJS = '<script>document.querySelectorAll("form[data-preview]").forEach(function(f){f.addEventListener("submit",function(e){e.preventDefault();var o=f.querySelector(".nl-ok")||f.parentNode.querySelector(".nl-inline-ok");if(o){o.hidden=false;o.textContent="Preview only — sign-up is not sent from this preview.";}});});</script>'

# ---------------- /play ----------------
PLAY = '''<section class="play-hero"><div class="ek-wrap"><div><span class="ek-eyebrow">Play &amp; Grow</span><h1>Learn the Word.<br><em>Have fun.</em> Beat your branch.</h1><p>A new Bible quiz every day for children and adults &mdash; scripture, the MFM family story, the G.O.&rsquo;s books, Pastor Olumide Oni&rsquo;s books and last week&rsquo;s messages.</p><div class="row" style="display:flex;gap:12px;flex-wrap:wrap"><button class="ek-btn" data-mode="daily">Start today&rsquo;s quiz &rarr;</button><button class="ek-btn ghost" style="color:#fff;border-color:rgba(255,255,255,.5)" data-mode="kids">Kids mode</button></div></div>
<div class="play-today"><span class="k">Today&rsquo;s quiz</span><h2>Daily Quiz <span id="qz-dayno"></span></h2><p>5 questions &middot; the same for everyone today &middot; new at midnight CT. Share your score on WhatsApp and challenge your branch.</p><div class="row"><button class="ek-btn" data-mode="daily">Play now</button><span class="streak" id="qz-mystreak"></span></div></div></div></section>
<section class="play-sec" id="quiz"><div class="ek-wrap"><div id="play-app"><div class="qz-card" style="text-align:center"><p class="qz-pack">Ready when you are</p><h2 class="qz-q" style="margin-bottom:10px">Pick a game to begin.</h2><p style="color:#4a5670;margin:0 0 6px">Every answer shows the scripture or source, so you learn as you play.</p><button class="qz-btn" data-mode="daily">Start today&rsquo;s quiz &rarr;</button></div></div></div></section>
<section class="play-sec cream"><div class="ek-wrap"><span class="ek-eyebrow">Ways to play</span><h2 class="sh">Pick a game.</h2><div class="modes">
<button class="mode" data-mode="daily"><span class="ic">🔥</span><b>Daily Quiz</b><span>Five mixed questions a day. Keep your streak alive.</span></button>
<button class="mode" data-mode="pack" data-pack="verse"><span class="ic">&ldquo;</span><b>Fill the Verse</b><span>Finish the scripture (KJV). The brand verses and more.</span></button>
<button class="mode" data-mode="kids"><span class="ic">⭐</span><b>Kids Mode</b><span>Easier questions, bigger buttons. Great for Sunday school.</span></button>
<div class="mode" style="cursor:default"><span class="ic">✦</span><b>Bible Word Builder</b><span>Build Bible words from letter tiles.</span><span class="wb-tiles"><i>F</i><i>I</i><i>R</i><i>E</i></span><span class="soon">Coming next</span></div>
</div></div></section>
<section class="play-sec"><div class="ek-wrap"><span class="ek-eyebrow">Topic packs</span><h2 class="sh">Choose what you know best.</h2><div class="packs">
<button class="pack" data-mode="pack" data-pack="bible"><small data-count="bible"></small><b>The Bible</b><span>Scripture, stories and the brand verses of MFM.</span></button>
<button class="pack" data-mode="pack" data-pack="mfm"><small data-count="mfm"></small><b>MFM Family</b><span>The founding, the G.O. and Mummy G.O., Prayer City and the ministry&rsquo;s story.</span></button>
<button class="pack" data-mode="pack" data-pack="go-books"><small data-count="go-books"></small><b>Dr. D.K. Olukoya&rsquo;s books</b><span>From Prayer Rain to the works of Battle Cry Ministries.</span></button>
<button class="pack" data-mode="pack" data-pack="oni-books"><small data-count="oni-books"></small><b>Pastor Olumide Oni&rsquo;s books</b><span>Questions from books you can read free on pastorolumideoni.com.</span></button>
<button class="pack" data-mode="pack" data-pack="messages"><small data-count="messages"></small><b>Last week&rsquo;s messages</b><span>HD, OHE, crusades and sermons. Were you watching?</span></button>
<a class="pack" href="https://pastorolumideoni.com/books.html" target="_blank" rel="noopener" style="text-decoration:none;background:#c9952c;color:#142240"><small style="color:#142240">Read first</small><b style="color:#142240">Read the books free</b><span>107+ titles by Pastor Olumide Oni, free to read online.</span></a>
</div></div></section>
<section class="play-sec cream" id="leaderboard"><div class="ek-wrap lb"><div><span class="ek-eyebrow">Leaderboard</span><h2 class="sh">Which branch knows the Word best?</h2><p style="color:#4a5670;line-height:1.6">Every daily quiz adds to your branch&rsquo;s weekly total. The board resets every Monday and the top branch is announced in the newsletter and on Healing &amp; Deliverance Hour.</p><p style="color:#4a5670;line-height:1.6">Players only enter a nickname and a branch &mdash; no email, no account.</p><span class="pv-note">Preview &middot; sample scores</span></div>
<div class="lb-card"><div class="lb-tabs" role="tablist"><button class="lb-tab on" role="tab" aria-selected="true" data-tab="branches">Branches this week</button><button class="lb-tab" role="tab" aria-selected="false" data-tab="players">Top players</button></div><ol id="lb-body" data-tab="branches"></ol></div></div></section>
''' + NLBAND
page('play', 'Play & Grow — Daily Bible Quiz', 'A new Bible quiz every day: scripture, the MFM family story, Dr. D.K. Olukoya and Pastor Olumide Oni books, and last week&rsquo;s messages. Play, share, and help your branch top the leaderboard.', PLAY, '<script src="/js/play.js?v=pv1"></script>' + NLJS)

# ---------------- /testimonies ----------------
TESTI = '''<section class="play-hero" style="padding-bottom:56px"><div class="ek-wrap" style="grid-template-columns:1fr"><div><span class="ek-eyebrow">Testimonies</span><h1>God is still <em>doing it.</em></h1><p>Read what God has done across Mega Region 2 &mdash; and share your own testimony to encourage someone today. Every testimony is read by a pastor before it appears here.</p></div></div></section>
<section class="play-sec cream"><div class="ek-wrap testi-grid"><div><span class="pv-note">Preview &middot; layout only &mdash; real testimonies appear after approval</span><div class="testi-list">
<article class="testi"><small>Healing &middot; MFM Branch name &middot; Month 2026</small><h3>[Testimony title]</h3><p>[The approved testimony text appears here, in the person&rsquo;s own words, with their permission.]</p><a class="ek-link" href="#">Read more &rarr;</a></article>
<article class="testi"><small>Breakthrough &middot; MFM Branch name &middot; Month 2026</small><h3>[Testimony title]</h3><p>[Each testimony gets its own share link, so people can send it to family on WhatsApp.]</p><a class="ek-link" href="#">Read more &rarr;</a></article>
</div></div>
<form class="testi-form" data-preview><h3>Share your testimony</h3><input placeholder="Your name" aria-label="Your name"><select aria-label="Branch"><option>Your branch</option><option>MFM USA Prayer City</option><option>MFM Dallas</option><option>&hellip;</option></select><select aria-label="Type"><option>Healing</option><option>Deliverance</option><option>Breakthrough</option><option>Salvation</option><option>Other</option></select><textarea rows="6" placeholder="What has God done?" aria-label="Testimony"></textarea><label><input type="checkbox"> You may publish my testimony with my first name and branch.</label><button class="ek-btn" type="submit">Send my testimony</button><small class="nl-ok">Preview only &mdash; this form does not send.</small></form></div></section>'''
page('testimonies', 'Testimonies', 'Testimonies from across MFM Mega Region 2 USA. Read what God is doing and share your own.', TESTI, NLJS)

# ---------------- homepage ----------------
s = (R / 'index.html').read_text()
TODAY = '''<section class="today" aria-labelledby="today-h"><div class="ek-wrap"><div class="today-head"><div><span class="ek-eyebrow">Today in the region</span><h2 id="today-h">Something new every day.</h2><span class="pv-note" style="margin:10px 0 0">Preview &middot; sample declaration and scores</span></div><p>Today&rsquo;s declaration, today&rsquo;s quiz and the next live service &mdash; come back tomorrow for more.</p></div><div class="today-grid">
<article class="tcard"><span class="k">Today&rsquo;s declaration</span><blockquote>&ldquo;Is not my word like as a fire? saith the LORD; and like a hammer that breaketh the rock in pieces?&rdquo;<cite>Jeremiah 23:29</cite></blockquote><ol><li>Every rock standing against my destiny, break in pieces, in Jesus&rsquo; name.</li><li>Fire of God, burn in my heart and in my home today.</li><li>I receive power to finish what I start, in Jesus&rsquo; name.</li></ol><div class="foot"><a class="ek-btn ghost" href="https://wa.me/?text=Today%27s%20declaration%20from%20MFM%20Mega%20Region%202%20https%3A%2F%2Fmfmmegaregion2usa.org">Share on WhatsApp</a><a class="ek-link" href="#nl">Get them by email &rarr;</a></div></article>
<article class="tcard navy"><span class="k">Daily quiz <span id="hq-no"></span></span><h3>5 questions. 2 minutes. Can you get them all?</h3><p style="margin:0;color:#c5cfdf">Bible, the MFM family story and last week&rsquo;s messages.</p><div class="foot"><a class="ek-btn" href="/play">Play today&rsquo;s quiz</a><small id="hq-top">Top branch this week: MFM USA Prayer City</small></div></article>
<article class="tcard"><span class="k">Next live</span><h3 id="nl-title">Healing &amp; Deliverance Hour</h3><div class="big" id="nl-when">Tue</div><small id="nl-time">7:00 PM CT &middot; 8:00 PM ET &middot; YouTube</small><div class="foot"><a class="ek-btn" href="/live">Watch live</a><a class="ek-link" href="https://www.youtube.com/@mfmmegaregion2usa/streams" target="_blank" rel="noopener">Notify me &rarr;</a></div></article>
</div></div></section>'''
TODAYJS = '''<script>(function(){var d=new Date(new Date().toLocaleString('en-US',{timeZone:'America/Chicago'}));var t=d.toISOString().slice(0,10);var no=Math.max(1,Math.floor((Date.parse(d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2))-Date.parse('2026-12-01'))/864e5)+1);var e=document.getElementById('hq-no');if(e)e.textContent='#'+no;
var lives=[{dow:2,h:19,name:'Healing & Deliverance Hour',time:'7:00 PM CT · 8:00 PM ET · YouTube'},{dow:4,h:18,name:'Open Heaven Encounter',time:'6:00 PM CT · 7:00 PM ET · YouTube'}];var best=null;lives.forEach(function(l){var x=new Date(d);var add=(l.dow-d.getDay()+7)%7;if(add===0&&d.getHours()>=l.h+2)add=7;x.setDate(d.getDate()+add);if(!best||x<best.at)best={at:x,l:l,add:add};});
var days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];document.getElementById('nl-title').textContent=best.l.name;document.getElementById('nl-when').textContent=best.add===0?'Today':best.add===1?'Tomorrow':days[best.at.getDay()];document.getElementById('nl-time').textContent=best.l.time;})();</script>'''
s = re.sub(r'(<section class="quick-paths wrap">.*?</section>)', lambda m: m.group(1) + TODAY, s, count=1, flags=re.S)
# take out the welcome-photo section; keep its leadership line inside "Find a church"
s = re.sub(r'<section class="welcome-photo section wrap">.*?</section>', '', s, count=1, flags=re.S)
s = s.replace('Search the complete verified directory, review service information and open a dedicated page for every branch.</p>',
              'Across Texas, Florida, Georgia, North Carolina, Oklahoma and Tennessee, under the leadership of Pastor Olumide Oni and Pastor (Mrs.) Oluwatoyin Oni. Search the verified directory and open a page for every branch.</p>', 1)
s = s.replace('<a class="button light" href="/media">Watch latest video', '<a class="button light" href="/messages/healing-and-deliverance-hour-11-24-2026#prayer-points" style="margin-right:10px;background:#fff;color:#142240">Prayer points from this message</a><a class="button light" href="/media">Watch latest video', 1)
s = s.replace('<section class="media-band">', NLBAND.replace('<section class="nlband">', '<section class="nlband" id="nl">') + '<section class="media-band">', 1)
s = s.replace('</body>', TODAYJS + NLJS + '\n</body>', 1)
(R / 'index.html').write_text(common(s))

# ---------------- events page: subscribe to all events ----------------
s = (R / 'events.html').read_text()
CAL = '''<div class="ek-wrap" style="margin-top:34px"><div class="calsub"><div><b>Never miss a programme</b><p>Add every Mega Region 2 event to your phone&rsquo;s calendar. New events appear on their own.</p></div><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="ek-btn" href="webcal://mfmmegaregion2usa.org/events.ics">Add all events to my calendar</a><a class="ek-btn ghost" href="/events.ics">Download .ics</a></div></div></div>'''
s = re.sub(r'(<section class="page-hero">.*?</section>)', lambda m: m.group(1) + CAL, s, count=1, flags=re.S)
(R / 'events.html').write_text(common(s))

# ---------------- message page: prayer points + newsletter ----------------
p = R / 'messages/healing-and-deliverance-hour-11-24-2026.html'
s = p.read_text()
PP = '''<div class="pp" id="prayer-points"><span class="pv-note">Preview &middot; sample prayer points &mdash; the real ones come from the message</span><span class="ek-eyebrow" style="display:block">Prayer points from this message</span><h2>I Shall See the End of My Pharaoh</h2><p class="scr">&ldquo;For the Egyptians whom ye have seen to day, ye shall see them again no more for ever.&rdquo; &mdash; Exodus 14:13</p><ol><li>[Prayer point 1 from the message]</li><li>[Prayer point 2 from the message]</li><li>[Prayer point 3 from the message]</li><li>[Prayer point 4 from the message]</li><li>[Prayer point 5 from the message]</li></ol><div class="pp-actions"><a class="ek-btn" href="https://wa.me/?text=Prayer%20points%3A%20I%20Shall%20See%20the%20End%20of%20My%20Pharaoh%20https%3A%2F%2Fmfmmegaregion2usa.org%2Fmessages%2Fhealing-and-deliverance-hour-11-24-2026%23prayer-points">Share on WhatsApp</a><a class="ek-btn ghost" href="/play">Take this week&rsquo;s quiz</a></div></div>
<div class="nl-inline" data-preview><p class="nl-inline-h">Get next week&rsquo;s prayer points in your inbox</p><p class="nl-inline-p">Every Monday: prayer points from HD and OHE, a new quiz pack and upcoming programmes.</p><form><input type="text" placeholder="First name" aria-label="First name"><input type="email" placeholder="Email address" aria-label="Email address"><button type="submit">Subscribe</button></form><p class="nl-inline-ok" hidden></p></div>'''
s = re.sub(r'(<div class="msg-actions">.*?</div>)', lambda m: m.group(1) + PP, s, count=1, flags=re.S)
s = s.replace('</body>', NLJS + '\n</body>', 1)
p.write_text(common(s))

# ---------------- events.ics (real feed from events-data.js) ----------------
ics = subprocess.run(['node', '-e', r'''
global.window={};require('/home/claude/mfm-mega-region2/js/events-data.js');
const E=window.MFM_EVENTS||[];const L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//MFM Mega Region 2 USA//Events//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:MFM Mega Region 2 USA','X-WR-TIMEZONE:America/Chicago','REFRESH-INTERVAL;VALUE=DURATION:PT12H'];
const esc=s=>String(s||'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n');
const today=new Date().toISOString().slice(0,10);
E.filter(e=>(e.endDate||e.date)>=today).forEach(e=>{const id=(e.anchor||e.title).replace(/[^a-z0-9]+/gi,'-')+'-'+e.date;L.push('BEGIN:VEVENT','UID:'+id+'@mfmmegaregion2usa.org','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z');
 if(e.start){const f=t=>t.replace(/[-:]/g,'')+'00';L.push('DTSTART;TZID='+e.tz+':'+f(e.start));L.push('DTEND;TZID='+e.tz+':'+f(e.end||e.start.replace(/T(\d\d)/,(m,h)=>'T'+String(Math.min(23,+h+2)).padStart(2,'0'))));}
 else{L.push('DTSTART;VALUE=DATE:'+e.date.replace(/-/g,''));const d=new Date((e.endDate||e.date)+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+1);L.push('DTEND;VALUE=DATE:'+d.toISOString().slice(0,10).replace(/-/g,''));}
 L.push('SUMMARY:'+esc(e.title),'LOCATION:'+esc(e.venue),'DESCRIPTION:'+esc((e.theme?e.theme+' — ':'')+'https://mfmmegaregion2usa.org'+(e.page||'/events')),'URL:https://mfmmegaregion2usa.org'+(e.page||'/events'),'END:VEVENT');});
L.push('END:VCALENDAR');process.stdout.write(L.join('\r\n')+'\r\n');'''], capture_output=True, text=True, check=True).stdout
(R / 'events.ics').write_text(ics)
print('ok', ics.count('BEGIN:VEVENT'), 'events in ics')
