#!/usr/bin/env python3
"""Media library sync with the MFM Mega Region 2 YouTube channel (Oct 13 2026).

Reads the channel feed (the latest 15 uploads) and, for every watchable video that is not on the
Media page yet, it:
  * writes a message page  messages/<slug>.html  (same template as the existing message pages),
  * adds a card at the top of the Media library grid (newest first),
  * refreshes the Programme / Speaker / Topic / Year filter options from the cards.
Skipped: #shorts and hashtag promo clips, and scheduled streams that have not aired yet (0 views).
Baked videos are remembered in tools/media-baked.json, so they stay on the site after they drop out
of the 15-item feed. The page also adds any newer uploads live in the browser (js in media.html).

Run on its own or from build_site.py. Network failure = no change (prints a note, exits 0).
"""
import html, json, os, re, ssl, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHANNEL_ID = 'UCr3gSJPBQDjN8CEbj86Pyug'
FEED = 'https://www.youtube.com/feeds/videos.xml?channel_id=' + CHANNEL_ID
ORIGIN = 'https://mfmmegaregion2usa.org'
BAKED = ROOT / 'tools' / 'media-baked.json'
TEMPLATE = ROOT / 'messages' / 'prayer-against-stubborn-condition.html'

# ---------- classification (mirrored in media.html's live-sync script) ----------
EMOJI = re.compile('[\U0001F000-\U0001FAFF☀-➿️‍]+')
PROGRAMME_NAMES = {'open heaven encounter': 'Open Heaven Encounter', 'healing & deliverance hour': 'Healing & Deliverance Hour'}
SMALL = {'a', 'an', 'the', 'and', 'of', 'in', 'on', 'to', 'for', 'by', 'at', 'or'}

def titlecase(s):
    if s != s.upper():
        return s
    words = s.lower().split()
    out = []
    for i, w in enumerate(words):
        if w in ('mfm', 'gen218', 'usa', 'nc', 'pmch'):
            out.append(w.upper())
        elif i and w in SMALL:
            out.append(w)
        else:
            out.append(w[:1].upper() + w[1:])
    return ' '.join(out)

def watchable(raw, views):
    return views > 0 and '#' not in raw

def clean_title(raw):
    live = bool(re.match(r'^\s*(?:\U0001F534\s*)?LIVE\s*\|', raw, flags=re.I))
    t = re.sub(r'^\s*(?:\U0001F534\s*)?LIVE\s*\|\s*', '', raw, flags=re.I)
    segs = [s.strip() for s in t.split('|') if s.strip()]
    first = segs[0] if segs else t
    key = first.lower()
    if key in PROGRAMME_NAMES and len(segs) > 1:
        title = PROGRAMME_NAMES[key] + ' — ' + titlecase(segs[1])
    elif live and len(segs) > 1 and '\u2022' not in segs[1]:
        title = titlecase(first) + ' — ' + titlecase(segs[1])
    else:
        title = titlecase(first)
    title = EMOJI.sub('', title)
    return re.sub(r'\s{2,}', ' ', title).strip(' —-')

def speaker_of(raw):
    if re.search(r'Olukoya', raw):
        return 'Dr. D.K. Olukoya'
    m = re.search(r'Pastor\s*\(Mrs\.?\)\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)', raw)
    if m:
        return 'Pastor (Mrs.) ' + m.group(1)
    m = re.search(r'Pastor\s+([A-Z][a-z]+\s+[A-Z][a-z]+)', raw)
    if m:
        return 'Pastor ' + m.group(1)
    return ''

def source_of(raw):
    m = re.search(r'(MFM [A-Z][A-Za-z ]*(?:Crusade|Conference|Retreat))', raw)
    return m.group(1).strip() if m else ''

def programme_of(raw):
    l = raw.lower()
    if 'healing & deliverance hour' in l or 'healing and deliverance hour' in l:
        return 'Healing & Deliverance Hour'
    if 'open heaven encounter' in l:
        return 'Open Heaven Encounter'
    if re.search(r'women|retreat', l):
        return 'Women Foundation'
    if re.search(r'crusade|conference|\blive\b|thanksgiving|gen ?218|pmch', l):
        return 'Special Events'
    return 'Sermons & Messages'

TOPIC_RULES = [('Healing', r'heal'), ('Deliverance', r'deliver'), ('Prayer', r'pray|altar|intercess'),
               ('Breakthrough', r'breakthrough|prosper|poverty|miracle'), ('Women', r'women|retreat'),
               ('Crusade', r'crusade'), ('Worship', r'worship|praise'), ('Thanksgiving', r'thanksgiving'),
               ('Restoration', r'restor')]

def topics_of(raw):
    l = raw.lower()
    return [t for t, rx in TOPIC_RULES if re.search(rx, l)][:3]

def slugify(s):
    s = re.sub(r'[^a-z0-9]+', '-', s.lower().replace('&', 'and')).strip('-')
    return s[:70].rstrip('-')

# ---------- page parts ----------
def card_html(it, href, newtab=True):
    tgt = ' target="_blank" rel="noopener"' if newtab else ''
    e = html.escape
    searchable = ' '.join([it['title'], it.get('speaker', ''), ' '.join(it.get('topics', [])), it.get('raw', '')]).lower()
    tags = ''.join('<i>%s</i>' % e(t) for t in it.get('topics', []))
    return ('<article class="message-card" data-yt="%s" data-title="%s" data-program="%s" data-speaker="%s" data-topics="%s" data-year="%s">'
            '<a href="%s"%s><img width="480" height="360" src="https://img.youtube.com/vi/%s/hqdefault.jpg" alt="%s thumbnail" loading="lazy" decoding="async"><span><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span></a>'
            '<div><small>%s</small><h3><a href="%s"%s>%s</a></h3><p>%s</p><div>%s</div></div></article>') % (
        it['id'], e(searchable), e(it['program']), e(it.get('speaker', '')), e('|'.join(it.get('topics', []))), it.get('year', ''),
        href, tgt, it['id'], e(it['title']), e(it['program']), href, tgt, e(it['title']), e(it.get('speaker') or it.get('source', '')), tags)

def parse_cards(media):
    grid = re.search(r'(<div class="message-grid" id="mGrid">)(.*?)(</div>\s*<div class="empty-state")', media, re.S)
    cards = re.findall(r'<article class="message-card".*?</article>', grid.group(2), re.S)
    out = []
    for c in cards:
        vid = re.search(r'/vi/([\w-]{11})/', c).group(1)
        href = re.search(r'<a href="([^"]+)"', c).group(1)
        get = lambda a: html.unescape((re.search(r'data-%s="([^"]*)"' % a, c) or [None, ''])[1])
        title = html.unescape(re.sub(r'<[^>]+>', '', re.search(r'<h3>(.*?)</h3>', c, re.S).group(1)))
        out.append({'id': vid, 'href': href, 'html': c, 'title': title, 'program': get('program'), 'speaker': get('speaker'),
                    'topics': [t for t in get('topics').split('|') if t], 'year': get('year')})
    return grid, out

def related_html(items, me):
    pool = [i for i in items if i['id'] != me['id']]
    pool.sort(key=lambda i: (i['program'] != me['program'], -int(i.get('year') or 0)))
    e = html.escape
    out = ''
    for r in pool[:3]:
        out += ('<a class="msg-rc" href="%s"><img width="480" height="360" loading="lazy" src="https://img.youtube.com/vi/%s/hqdefault.jpg" alt="%s">'
                '<div class="rc-b"><h3>%s</h3><div class="rc-sp">%s</div></div></a>') % (r['href'], r['id'], e(r['title']), e(r['title']), e(r.get('speaker') or r['program']))
    return out

def message_page(tpl, it, related):
    e = html.escape
    old_id = re.search(r'data-yt="([\w-]{11})"', tpl).group(1)
    old_title = html.unescape(re.search(r'<h1 class="msg-title">(.*?)</h1>', tpl).group(1))
    old_slug = re.search(r'<link rel="canonical" href="https://mfmmegaregion2usa\.org/messages/([^"]+)"', tpl).group(1)
    who = it.get('speaker') or 'MFM Mega Region 2 USA'
    head_title = '%s — %s | MFM Mega Region 2 USA' % (it['title'], who) if it.get('speaker') else '%s | MFM Mega Region 2 USA' % it['title']
    desc = '%s.%s Part of %s. A message from MFM Mega Region 2 USA. Watch on demand.' % (
        it['title'].rstrip('.'), (' Ministered by %s.' % it['speaker']) if it.get('speaker') else '', it['program'])
    t = tpl
    t = re.sub(r'<title>.*?</title>', '<title>%s</title>' % e(head_title), t)
    for attr, name in (('name', 'description'), ('property', 'og:description'), ('name', 'twitter:description')):
        t = re.sub(r'(<meta %s="%s" content=")[^"]*(")' % (attr, re.escape(name)), lambda m: m.group(1) + e(desc) + m.group(2), t)
    for attr, name in (('property', 'og:title'), ('name', 'twitter:title')):
        t = re.sub(r'(<meta %s="%s" content=")[^"]*(")' % (attr, re.escape(name)), lambda m: m.group(1) + e(head_title) + m.group(2), t)
    # JSON-LD video + breadcrumb
    vo = {"@context": "https://schema.org", "@type": "VideoObject", "name": it['title'], "description": desc,
          "thumbnailUrl": ["https://img.youtube.com/vi/%s/hqdefault.jpg" % it['id']], "uploadDate": it['published'],
          "embedUrl": "https://www.youtube.com/embed/" + it['id'], "contentUrl": "https://www.youtube.com/watch?v=" + it['id'],
          "url": ORIGIN + '/messages/' + it['slug'], "publisher": {"@type": "Organization", "name": "MFM Mega Region 2 USA", "url": ORIGIN + '/'}}
    t = re.sub(r'<script type="application/ld\+json">\{"@context": "https://schema.org", "@type": "VideoObject".*?</script>',
               lambda m: '<script type="application/ld+json">%s</script>' % json.dumps(vo, ensure_ascii=False), t, count=1, flags=re.S)
    t = t.replace('"name": %s, "item": "%s/messages/%s"' % (json.dumps(old_title, ensure_ascii=False), ORIGIN, old_slug),
                  '"name": %s, "item": "%s/messages/%s"' % (json.dumps(it['title'], ensure_ascii=False), ORIGIN, it['slug']))
    chips = ''.join('<span class="msg-chip">%s</span>' % e(x) for x in ([it['speaker']] if it.get('speaker') else []) + [it['program']] + it.get('topics', []))
    t = re.sub(r'<div class="msg-meta">.*?</div>', '<div class="msg-meta">%s</div>' % chips, t, count=1, flags=re.S)
    t = re.sub(r'<h1 class="msg-title">.*?</h1>', '<h1 class="msg-title">%s</h1>' % e(it['title']), t, count=1)
    t = re.sub(r'data-title="%s"' % re.escape(html.escape(old_title, quote=True)), 'data-title="%s"' % e(it['title']), t)
    t = t.replace('Play video: ' + html.escape(old_title, quote=False), 'Play video: ' + e(it['title']))
    t = re.sub(r'(<div class="msg-related">).*?(</div>\s*</div>\s*</section>)', lambda m: m.group(1) + related + m.group(2), t, count=1, flags=re.S)
    t = t.replace(old_id, it['id']).replace('/messages/' + old_slug, '/messages/' + it['slug'])
    assert old_id not in t and it['id'] in t
    return t

def fetch_feed():
    ctx = ssl.create_default_context()
    ca = '/root/.ccr/ca-bundle.crt'
    if os.path.exists(ca):
        ctx.load_verify_locations(ca)
    req = urllib.request.Request(FEED, headers={'user-agent': 'mfmmegaregion2usa.org media-sync'})
    return urllib.request.urlopen(req, timeout=20, context=ctx).read().decode('utf-8')

def options_html(values, current_label):
    return ''.join('<option>%s</option>' % html.escape(v) for v in ['All'] + values)

def main():
    media_p = ROOT / 'media.html'
    media = media_p.read_text()
    try:
        xml = fetch_feed()
    except Exception as ex:
        print('media sync: feed unavailable (%s) — no change' % ex)
        return 0
    grid, cards = parse_cards(media)
    have = {c['id'] for c in cards}
    baked = json.loads(BAKED.read_text()) if BAKED.exists() else []
    new = []
    for entry in re.findall(r'<entry>(.*?)</entry>', xml, re.S):
        vid = re.search(r'<yt:videoId>([\w-]{11})</yt:videoId>', entry).group(1)
        raw = html.unescape(re.search(r'<title>(.*?)</title>', entry, re.S).group(1)).strip()
        views = int((re.search(r'<media:statistics views="(\d+)"', entry) or [0, 0])[1])
        published = re.search(r'<published>([^<]+)</published>', entry).group(1)
        if vid in have or not watchable(raw, views):
            continue
        title = clean_title(raw)
        it = {'id': vid, 'raw': raw, 'title': title, 'published': published, 'year': published[:4],
              'program': programme_of(raw), 'speaker': speaker_of(raw), 'source': source_of(raw), 'topics': topics_of(raw)}
        slug = slugify(title)
        if (ROOT / 'messages' / (slug + '.html')).exists():
            slug = slugify(title + ' ' + published[:10])
        it['slug'] = slug
        it['href'] = '/messages/' + slug
        new.append(it)
    if not new:
        print('media sync: up to date (%d cards)' % len(cards))
        return 0
    baked = [b for b in baked if b['id'] not in {n['id'] for n in new}] + new
    baked.sort(key=lambda b: b['published'], reverse=True)
    BAKED.write_text(json.dumps([{k: v for k, v in b.items() if k != 'html'} for b in baked], ensure_ascii=False, indent=1) + '\n')
    # message pages
    tpl = TEMPLATE.read_text()
    library = [dict(c) for c in cards] + new
    for it in new:
        (ROOT / 'messages' / (it['slug'] + '.html')).write_text(message_page(tpl, it, related_html(library, it)))
    # grid: baked videos newest first, then the original curated cards (unchanged order)
    baked_ids = {b['id'] for b in baked}
    old_cards = [c for c in cards if c['id'] not in baked_ids]
    new_grid = ''.join(card_html(b, b['href']) for b in baked) + ''.join(
        c['html'] if 'data-yt=' in c['html'] else c['html'].replace('<article class="message-card" ', '<article class="message-card" data-yt="%s" ' % c['id'], 1)
        for c in old_cards)
    media = media[:grid.start(2)] + new_grid + media[grid.end(2):]
    allc = baked + old_cards
    progs = sorted({c['program'] for c in allc if c['program']})
    spk = sorted({c['speaker'] for c in allc if c.get('speaker')})
    tops = sorted({t for c in allc for t in c.get('topics', [])})
    years = sorted({c['year'] for c in allc if c.get('year')})
    for sel, vals in (('mProgram', progs), ('mSpeaker', spk), ('mTopic', tops), ('mYear', years)):
        media = re.sub(r'(<select id="%s">).*?(</select>)' % sel, lambda m: m.group(1) + options_html(vals, '') + m.group(2), media, count=1, flags=re.S)
    media = re.sub(r'(<p class="results-count" id="mCount"[^>]*>)Showing \d+ messages', lambda m: m.group(1) + 'Showing %d messages' % len(allc), media)
    media_p.write_text(media)
    print('media sync: added %d video(s): %s' % (len(new), '; '.join('%s [%s]' % (n['title'], n['program']) for n in new)))
    return 0

if __name__ == '__main__':
    sys.exit(main())
