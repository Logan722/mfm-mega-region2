import re
from pathlib import Path
R = Path('/home/claude/mfm-mega-region2')
def rd(p): return (R / p).read_text()
def wr(p, t): (R / p).write_text(t)
def once(t, a, b, label):
    n = t.count(a)
    assert n == 1, (label, n)
    return t.replace(a, b)

# drop preview-only form stubs everywhere
for f in ['index.html', 'play.html', 'testimonies.html', 'reach-out.html']:
    t = rd(f)
    t = re.sub(r'<script>document\.querySelectorAll\("form\[data-preview\].*?</script>\n?', '', t, flags=re.S)
    t = re.sub(r"<script>\(function\(\)\{var f=document\.getElementById\('reachFormPv'\).*?</script>\n?", '', t, flags=re.S)
    wr(f, t)

# ---------------- reach-out: the real Netlify form (same name/fields as the old homepage form)
t = rd('reach-out.html')
t = once(t, '<form class="prayer-form compact" id="reachFormPv" name="reach-out-preview" data-preview>\n<p style="display:none"><input name="bot-field"></p>',
         '<form class="prayer-form compact" id="reachForm" name="reach-out" method="POST" action="/thanks.html" data-netlify="true" netlify-honeypot="bot-field" data-ajax data-success="#reachSuccess">\n<input type="hidden" name="form-name" value="reach-out"><p style="display:none"><input name="bot-field"></p>', 'form')
t = once(t, "var s=((location.hash||'').slice(1)||new URLSearchParams(location.search).get('subject')||'').toLowerCase();",
         "var s=(new URLSearchParams(location.search).get('subject')||(location.hash||'').slice(1)||'').toLowerCase();", 'subj')
assert 'reachFormPv' not in t and 'Preview only' not in t
wr('reach-out.html', t)

# ---------------- testimonies: real reflections only (the same three as the homepage)
t = rd('testimonies.html')
a = t.index('<section class="play-sec cream">'); b = t.index('</section>', a) + len('</section>')
YC = 'https://mfmmegaregion2yc.org/events'
items = [
  ('Resurgence 2024', 'From fear toward purpose.', 'Young people encountered Jesus and took steps toward their calling during the Resurgence programme.'),
  ('IYC 2025', 'A generation growing in faith.', 'A gathering that affirmed young believers across the region and their identity in Christ.'),
  ('Launch Pad 1.0', 'Clarity, confidence and purpose.', 'Young people took meaningful steps forward in faith and purpose.'),
]
arts = ''.join('<article class="testi"><small>Programme reflection &middot; %s &middot; Youth &amp; Young Adult Church</small><h3>%s</h3><p>%s</p><a class="testi-link" href="%s">Explore the programme &#8599;</a></article>\n' % x[:3] + '' if False else
               '<article class="testi"><small>Programme reflection &middot; %s &middot; Youth &amp; Young Adult Church</small><h3>%s</h3><p>%s</p><a class="testi-link" href="%s">Explore the programme &#8599;</a></article>\n' % (x[0], x[1], x[2], YC) for x in items)
sec = ('<section class="play-sec cream"><div class="ek-wrap"><div class="testi-grid"><div class="testi-list">\n' + arts +
       '</div></div><div class="testi-share"><p>Has God done something for you? Your testimony could strengthen someone today.</p><a class="ek-btn" href="/reach-out?subject=testimony">Share your testimony</a></div></div></section>')
t = t[:a] + sec + t[b:]
wr('testimonies.html', t)

# ---------------- homepage
t = rd('index.html')
t = re.sub(r'<a class="button wg-pp" href="[^"]*"><span class="lg">Prayer points from this message</span><span class="sm">Prayer points</span></a>', '', t)
assert 'wg-pp' not in t and 'preview-message' not in t
# Today box: real declaration (static = latest Declaration of the Week; js/today.js swaps in today's)
a = t.index('<article class="tp-word">'); b = t.index('</article>', a) + len('</article>')
static = ('<article class="tp-word" data-today-word><span class="k">Declaration of the week</span>'
          '<blockquote>&ldquo;Then shall the earth yield her increase; and God, even our own God, shall bless us.&rdquo;<cite>Psalm 67:6</cite></blockquote>'
          '<p class="tp-decl"><b>This week, your harvest comes in.</b> As you give thanks this week, the Lord turns your gratitude into increase. Every field you sowed in tears yields its harvest, every delayed blessing arrives, and God, even your own God, blesses you and your household, in Jesus&rsquo; name. Amen.</p>'
          '<div class="foot"><a class="ek-btn ghost" data-today-share href="https://wa.me/?text=Declaration%20of%20the%20week%20from%20MFM%20Mega%20Region%202%20USA%20https%3A%2F%2Fmfmmegaregion2usa.org" target="_blank" rel="noopener">Share on WhatsApp</a></div></article>')
t = t[:a] + static + t[b:]
t = once(t, '<script src="/js/home-hero.js', '<script src="/js/today.js" defer></script>\n<script src="/js/home-hero.js', 'today js')
wr('index.html', t)
print('ok')
