"""Newsletter page auto-update (owner request, Oct 21 2026).

When an issue goes out, /newsletter shows it as the Latest Issue and moves the previous one into The Archive,
and the issue pages get their Previous / Next links - nobody edits the page by hand.

How it knows an issue has gone out: /.netlify/functions/newsletter-issues reads the SENT campaigns from Brevo.
  - tools/build_site.py calls build() on every build, and the YouTube sync action runs the build every 30 min,
    so the page itself is updated within about half an hour of a send.
  - /newsletter also checks in the browser (inline script below), so visitors see the new issue within ~5 min.
Card details come from each issue page (newsletter/issue-N.html): og:title, og:description, og:image and the
"Issue #N · Month Year" line. An issue page can be published ahead of the send (mirror page for the email);
it only appears on /newsletter once Brevo shows it as sent. Issues already on the page are never removed.
"""
import html, json, os, re, urllib.request
from pathlib import Path

STATUS_URL = os.environ.get('MFM_NEWSLETTER_STATUS',
                            'https://www.mfmmegaregion2usa.org/.netlify/functions/newsletter-issues')
TITLE_TAIL = re.compile(r'\s*[—–-]\s*MFM Mega Region 2 Newsletter\s*$')


def _meta(t, prop):
    m = re.search(r'<meta (?:property|name)="%s" content="([^"]*)"' % re.escape(prop), t)
    return m.group(1) if m else ''


def read_issues(root):
    out = {}
    for p in (root / 'newsletter').glob('issue-*.html'):
        m = re.fullmatch(r'issue-(\d+)\.html', p.name)
        if not m:
            continue
        n, t = int(m.group(1)), p.read_text()
        title = TITLE_TAIL.sub('', html.unescape(_meta(t, 'og:title')))
        if not title:
            tm = re.search(r'<title>(.*?)</title>', t, re.S)
            title = html.unescape(tm.group(1)).split(' — ')[1] if tm and ' — ' in html.unescape(tm.group(1)) else 'Issue #%d' % n
        month = ''
        em = re.search(r'class="mag-eyebrow">\s*Issue\s*#\s*0*%d\s*(?:&middot;|·)\s*([^<]+?)\s*<' % n, t)
        if em:
            month = html.unescape(em.group(1)).strip()
        img = _meta(t, 'og:image')
        img = re.sub(r'^https?://[^/]+', '', img) or '/img/newsletter/issue-%d-og.jpg' % n
        out[n] = {'n': n, 'title': title, 'desc': html.unescape(_meta(t, 'og:description')), 'month': month,
                  'img': img, 'date': _meta(t, 'article:published_time')}
    return out


def sent_issues():
    try:
        req = urllib.request.Request(STATUS_URL, headers={'user-agent': 'mfm-site-build'})
        with urllib.request.urlopen(req, timeout=15) as r:
            j = json.loads(r.read().decode())
        if j.get('ok'):
            return {int(s['issue']) for s in j.get('sent', [])}
    except Exception as e:
        print('newsletter: send status unavailable (%s) - page left as it is' % e)
    return None


def e(s):
    return html.escape(s, quote=True)


def latest_html(i):
    return ('<section class="hub-latest">\n    <div class="hub-latest-inner">\n      <div class="latest-badge">Latest Issue</div>\n'
            '      <div class="latest-grid">\n        <a href="/newsletter/issue-%(n)d" class="latest-card">\n'
            '          <img src="%(img)s" alt="Issue #%(n)d cover"/>\n        </a>\n        <div class="latest-meta">\n'
            '          <div class="issue-number">ISSUE #%(n)d%(month)s</div>\n          <h2>%(title)s</h2>\n'
            '          <p>%(desc)s</p>\n          <a class="btn-gold" href="/newsletter/issue-%(n)d">Read full issue &rarr;</a>\n'
            '        </div>\n      </div>\n    </div>\n  </section>' % {
                'n': i['n'], 'img': e(i['img']), 'month': (' &middot; ' + e(i['month'])) if i['month'] else '',
                'title': e(i['title']), 'desc': e(i['desc'])})


def archive_html(items):
    if not items:
        return ''
    cards = ''.join(
        '\n      <a href="/newsletter/issue-%(n)d" class="arc-card">\n        <div class="arc-img" style="background-image:url(\'%(img)s\');"></div>\n'
        '        <div class="arc-body">\n          <div class="arc-num">ISSUE #%(n)d%(month)s</div>\n'
        '          <h3 class="arc-title">%(title)s</h3>\n          <span class="arc-link">Read &rarr;</span>\n        </div>\n      </a>\n' % {
            'n': i['n'], 'img': e(i['img']), 'month': (' &middot; ' + e(i['month'])) if i['month'] else '', 'title': e(i['title'])}
        for i in items)
    return ('\n    <section class="hub-archive">\n      <div class="hub-archive-inner">\n        <div class="arc-eyebrow">Previous Issues</div>\n'
            '        <h2 class="arc-h2">The Archive</h2>\n        <div class="arc-grid">%s</div>\n      </div>\n    </section>' % cards.rstrip('\n'))


# Browser top-up: shows a newly sent issue before the next build lands. Rebuilds the same markup as above.
RUNTIME = r'''<script id="nl-hub-sync">(function(){try{
var D=JSON.parse(document.getElementById('nl-issues').textContent),shown=D.published;
function e(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function mo(i){return i.month?' &middot; '+e(i.month):'';}
fetch('/.netlify/functions/newsletter-issues',{credentials:'omit'}).then(function(r){return r.ok?r.json():null;}).then(function(j){
  if(!j||!j.ok)return;
  var pub=shown.slice();(j.sent||[]).forEach(function(s){if(D.issues[s.issue]&&pub.indexOf(s.issue)<0)pub.push(s.issue);});
  if(pub.length===shown.length)return;
  pub.sort(function(a,b){return b-a;});
  var L=D.issues[pub[0]],lat=document.querySelector('.hub-latest');if(!lat)return;
  lat.innerHTML='<div class="hub-latest-inner"><div class="latest-badge">Latest Issue</div><div class="latest-grid"><a href="/newsletter/issue-'+L.n+'" class="latest-card"><img src="'+e(L.img)+'" alt="Issue #'+L.n+' cover"/></a><div class="latest-meta"><div class="issue-number">ISSUE #'+L.n+mo(L)+'</div><h2>'+e(L.title)+'</h2><p>'+e(L.desc)+'</p><a class="btn-gold" href="/newsletter/issue-'+L.n+'">Read full issue &rarr;</a></div></div></div>';
  var cards=pub.slice(1).map(function(n){var i=D.issues[n];return '<a href="/newsletter/issue-'+n+'" class="arc-card"><div class="arc-img" style="background-image:url(\''+e(i.img)+'\');"></div><div class="arc-body"><div class="arc-num">ISSUE #'+n+mo(i)+'</div><h3 class="arc-title">'+e(i.title)+'</h3><span class="arc-link">Read &rarr;</span></div></a>';}).join('');
  var arc=document.querySelector('.hub-archive');
  if(!arc&&cards){arc=document.createElement('section');arc.className='hub-archive';lat.parentNode.insertBefore(arc,lat.nextSibling);}
  if(arc)arc.innerHTML='<div class="hub-archive-inner"><div class="arc-eyebrow">Previous Issues</div><h2 class="arc-h2">The Archive</h2><div class="arc-grid">'+cards+'</div></div>';
}).catch(function(){});
}catch(x){}})();</script>'''


def _nav(issues, n, pub):
    prev_n = max([k for k in pub if k < n], default=0)
    next_n = min([k for k in pub if k > n], default=0)
    parts = []
    if prev_n:
        parts.append('<a href="/newsletter/issue-%d" class="nav-prev"><span class="nav-dir">← Previous</span><span class="nav-title">Issue #%d: %s</span></a>'
                     % (prev_n, prev_n, e(issues[prev_n]['title'])))
    if next_n:
        parts.append('<a href="/newsletter/issue-%d" class="nav-next"><span class="nav-dir">Next →</span><span class="nav-title">Issue #%d: %s</span></a>'
                     % (next_n, next_n, e(issues[next_n]['title'])))
    return '<nav class="mag-nav">\n    ' + '\n    '.join(parts) + '\n  </nav>'


def build(root, write):
    root = Path(root)
    hub_path = root / 'newsletter' / 'index.html'
    if not hub_path.exists():
        return
    t = hub_path.read_text()
    issues = read_issues(root)
    on_page = {int(x) for x in re.findall(r'href="/newsletter/issue-(\d+)"', t)}
    sent = sent_issues()
    pub = sorted((on_page | (sent or set())) & set(issues), reverse=True)
    if not pub:
        return
    i0 = issues[pub[0]]
    start, end = t.find('<section class="hub-latest">'), t.find('<section class="hub-sub">')
    if start < 0 or end < 0:
        print('newsletter: hub markers missing - skipped')
        return
    t = t[:start] + latest_html(i0) + '\n\n  ' + archive_html([issues[n] for n in pub[1:]]).lstrip('\n') + '\n\n  ' + t[end:]
    og = 'https://www.mfmmegaregion2usa.org' + i0['img']
    t = re.sub(r'(<meta property="og:image" content=")[^"]*(")', lambda m: m.group(1) + og + m.group(2), t)
    t = re.sub(r'(<meta name="twitter:image" content=")[^"]*(")', lambda m: m.group(1) + og + m.group(2), t)
    data = json.dumps({'published': pub, 'issues': {str(k): issues[k] for k in sorted(issues)}}, ensure_ascii=False).replace('</', '<\\/')
    t = re.sub(r'\n?<script id="nl-issues"[^>]*>.*?</script>\n?<script id="nl-hub-sync">.*?</script>', '', t, flags=re.S)
    t = t.replace('</body>', '<script id="nl-issues" type="application/json">%s</script>\n%s\n</body>' % (data, RUNTIME), 1)
    write('newsletter/index.html', t)
    # Previous / Next on each published issue page
    for n in pub:
        rel = 'newsletter/issue-%d.html' % n
        p = (root / rel).read_text()
        q = re.sub(r'<nav class="mag-nav">.*?</nav>', lambda m: _nav(issues, n, pub), p, count=1, flags=re.S)
        if q != p:
            write(rel, q)
    print('newsletter: published issues %s (latest #%d)%s' % (pub, pub[0], '' if sent is not None else ' [send status unavailable]'))
