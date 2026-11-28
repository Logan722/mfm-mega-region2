#!/usr/bin/env python3
"""Media library sync with the MFM Mega Region 2 YouTube channel (Oct 13 2026).

Reads the channel feed (the latest 15 uploads) and, for every watchable video that is not on the
Media page yet, it:
  * writes a message page  messages/<slug>.html  (same template as the existing message pages),
  * adds a card at the top of the Media library grid (newest first),
  * refreshes the Programme / Speaker / Topic / Year filter options from the cards.
Skipped: YouTube Shorts (owner request, Oct 27 2026: the Media page shows the channel's Videos + past livestreams
only), #shorts / hashtag promo clips, and scheduled streams that have not aired yet (0 views).
A Short is recognised by its feed link (youtube.com/shorts/<id>); every Short seen is remembered in
tools/shorts-ids.json. Any Short already on the site is taken off Media (and so off Women / Gen218), its
message page is removed and redirected to /media (tools/retired-pages.json), and links to it are dropped.
Baked videos are remembered in tools/media-baked.json, so they stay on the site after they drop out
of the 15-item feed. The page also adds any newer uploads live in the browser (js in media.html).

Run on its own or from build_site.py. Network failure = no change (prints a note, exits 0).
"""
import datetime, html, json, os, re, ssl, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHANNEL_ID = 'UCr3gSJPBQDjN8CEbj86Pyug'
FEED = 'https://www.youtube.com/feeds/videos.xml?channel_id=' + CHANNEL_ID
ORIGIN = 'https://mfmmegaregion2usa.org'
BAKED = ROOT / 'tools' / 'media-baked.json'
# Ministry playlists pulled in on top of the channel feed (the channel feed only lists the latest 15 uploads).
PLAYLISTS = {'gen218': 'PLW7hBicEbKy_9UNG4SSj27NCBiw1iP-yS'}   # 'Gen 218 Conferences | Mega Region 2'
PLAYLIST_IDS = ROOT / 'tools' / 'playlists.json'
SHORTS = ROOT / 'tools' / 'shorts-ids.json'
RETIRED = ROOT / 'tools' / 'retired-pages.json'
# Hand-written titles for uploads whose YouTube titles don't clean up well
TITLE_OVERRIDES = {'82TOfp_eH-w': 'Glory Revealed! — Quarterly Gen218 Virtual Conference',
                   'Raib3YWzglY': 'It Is My Time to Rejoice — Gen218 Singles\u2019 Conference',
                   '0Ys5YKUQ8EQ': 'The Snare Is Broken — Gen218',
                   '_HGRpiFhBEM': 'PMCH October 2026'}
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
    if re.search(r'gen ?218', l):
        return 'Gen218'
    if re.search(r'crusade|conference|\blive\b|thanksgiving|gen ?218|pmch|dedication', l):
        return 'Special Events'
    return 'Sermons & Messages'

TOPIC_RULES = [('Healing', r'heal'), ('Deliverance', r'deliver'), ('Prayer', r'pray|altar|intercess'),
               ('Breakthrough', r'breakthrough|prosper|poverty|miracle'), ('Women', r'women|retreat'),
               ('Crusade', r'crusade'), ('Worship', r'worship|praise'), ('Thanksgiving', r'thanksgiving'),
               ('Restoration', r'restor'), ('Singles', r'gen ?218|single')]

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

def fetch_feed(url=FEED):
    ctx = ssl.create_default_context()
    ca = '/root/.ccr/ca-bundle.crt'
    if os.path.exists(ca):
        ctx.load_verify_locations(ca)
    req = urllib.request.Request(url, headers={'user-agent': 'mfmmegaregion2usa.org media-sync'})
    return urllib.request.urlopen(req, timeout=20, context=ctx).read().decode('utf-8')

def options_html(values, current_label):
    return ''.join('<option>%s</option>' % html.escape(v) for v in ['All'] + values)

def purge_shorts(shorts, cards, baked):
    """Take every YouTube Short off the Media page, the baked list and its message page (-> redirect to /media)."""
    gone = [c for c in cards if c['id'] in shorts]
    gone_b = [b for b in baked if b['id'] in shorts]
    if not gone and not gone_b:
        return 0
    media_p = ROOT / 'media.html'
    media = media_p.read_text()
    grid, _ = parse_cards(media)
    inner = grid.group(2)
    for c in gone:
        inner = inner.replace(c['html'], '')
    media = media[:grid.start(2)] + inner + media[grid.end(2):]
    left = len(cards) - len(gone)
    media = re.sub(r'(<p class="results-count" id="mCount"[^>]*>)Showing \d+ messages', lambda m: m.group(1) + 'Showing %d messages' % left, media)
    media_p.write_text(media)
    if gone_b:
        BAKED.write_text(json.dumps([b for b in baked if b['id'] not in shorts], ensure_ascii=False, indent=1) + '\n')
    # message pages of the Shorts: remove, and send old links to /media
    retired = json.loads(RETIRED.read_text()) if RETIRED.exists() else []
    hrefs = set()
    for c in gone + gone_b:
        h = c.get('href') or ''
        if h.startswith('/messages/'):
            hrefs.add(h)
    for h in sorted(hrefs):
        f = ROOT / (h.lstrip('/') + '.html')
        if f.exists():
            f.unlink()
        if h not in {r['from'] for r in retired}:
            retired.append({'from': h, 'to': '/media', 'why': 'YouTube Short (not on Media)'})
    RETIRED.write_text(json.dumps(retired, indent=1) + '\n')
    # drop "related message" links that pointed at them
    for f in (ROOT / 'messages').glob('*.html'):
        t = f.read_text()
        u = t
        for h in hrefs:
            u = re.sub(r'<a class="msg-rc" href="%s">.*?</a>' % re.escape(h), '', u, flags=re.S)
        if u != t:
            f.write_text(u)
    print('media sync: took %d YouTube Short(s) off Media: %s' % (len(gone) + len([b for b in gone_b if b['id'] not in {c['id'] for c in gone}]),
          '; '.join(html.unescape(c.get('title', c['id'])) for c in gone)))
    return 1

def _main():
    media_p = ROOT / 'media.html'
    media = media_p.read_text()
    try:
        xml = fetch_feed()
    except Exception as ex:
        print('media sync: feed unavailable (%s) — no change' % ex)
        return 0
    pl_ids = json.loads(PLAYLIST_IDS.read_text()) if PLAYLIST_IDS.exists() else {}
    for key, pid in PLAYLISTS.items():
        try:
            px = fetch_feed('https://www.youtube.com/feeds/videos.xml?playlist_id=' + pid)
        except Exception as ex:
            print('media sync: playlist %s unavailable (%s)' % (key, ex))
            continue
        pl_ids[key] = re.findall(r'<yt:videoId>([\w-]{11})</yt:videoId>', px)
        xml += px
    PLAYLIST_IDS.write_text(json.dumps(pl_ids, indent=1) + '\n')
    shorts = set(json.loads(SHORTS.read_text())) if SHORTS.exists() else set()
    seen_shorts = set(re.findall(r'<link rel="alternate" href="https://www\.youtube\.com/shorts/([\w-]{11})"', xml))
    if not seen_shorts <= shorts:
        shorts |= seen_shorts
        SHORTS.write_text(json.dumps(sorted(shorts), indent=1) + '\n')
    grid, cards = parse_cards(media)
    have = {c['id'] for c in cards}
    baked = json.loads(BAKED.read_text()) if BAKED.exists() else []
    purged = purge_shorts(shorts, cards, baked)
    if purged:
        media = media_p.read_text()
        grid, cards = parse_cards(media)
        baked = json.loads(BAKED.read_text()) if BAKED.exists() else []
        have = {c['id'] for c in cards}
    new = []
    for entry in re.findall(r'<entry>(.*?)</entry>', xml, re.S):
        vid = re.search(r'<yt:videoId>([\w-]{11})</yt:videoId>', entry).group(1)
        raw = html.unescape(re.search(r'<title>(.*?)</title>', entry, re.S).group(1)).strip()
        views = int((re.search(r'<media:statistics views="(\d+)"', entry) or [0, 0])[1])
        published = re.search(r'<published>([^<]+)</published>', entry).group(1)
        if vid in have or vid in shorts or vid in {n['id'] for n in new} or not watchable(raw, views):
            continue
        title = TITLE_OVERRIDES.get(vid) or clean_title(raw)
        it = {'id': vid, 'raw': raw, 'title': title, 'published': published, 'year': published[:4],
              'program': programme_of(raw), 'speaker': speaker_of(raw), 'source': source_of(raw), 'topics': topics_of(raw)}
        slug = slugify(title)
        if (ROOT / 'messages' / (slug + '.html')).exists():
            slug = slugify(title + ' ' + published[:10])
        it['slug'] = slug
        it['href'] = '/messages/' + slug
        new.append(it)
    # YouTube moves a stream's date from when it was scheduled to when it aired: keep baked dates current
    feed_dates = {re.search(r'<yt:videoId>([\w-]{11})</yt:videoId>', e).group(1): re.search(r'<published>([^<]+)</published>', e).group(1)
                  for e in re.findall(r'<entry>(.*?)</entry>', xml, re.S)}
    redated = [b for b in baked if feed_dates.get(b['id']) and feed_dates[b['id']] != b['published']]
    for b in redated:
        b['published'] = feed_dates[b['id']]; b['year'] = b['published'][:4]
    if not new and not redated and not purged:
        print('media sync: up to date (%d cards)' % len(cards))
        return 0
    if redated:
        print('media sync: re-dated %d video(s): %s' % (len(redated), '; '.join(b['title'] for b in redated)))
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
    old_html = [c['html'] if 'data-yt=' in c['html'] else c['html'].replace('<article class="message-card" ', '<article class="message-card" data-yt="%s" ' % c['id'], 1)
                for c in old_cards]
    # baked videos newest first; an older upload (e.g. from a playlist) slots in before the first curated card of its year or older
    top, slotted = [], [[] for _ in old_cards] + [[]]
    newest_old = max([c['year'] for c in old_cards if c['year']] or ['0'])
    for b in baked:
        if b['year'] > newest_old:
            top.append(card_html(b, b['href']))
            continue
        k = next((i for i, c in enumerate(old_cards) if c['year'] and c['year'] <= b['year']), len(old_cards))
        slotted[k].append(card_html(b, b['href']))
    new_grid = ''.join(top) + ''.join(''.join(slotted[i]) + h for i, h in enumerate(old_html)) + ''.join(slotted[-1])
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
    if new:
        print('media sync: added %d video(s): %s' % (len(new), '; '.join('%s [%s]' % (n['title'], n['program']) for n in new)))
    return 0

WOMEN_MAX = 6

def refresh_women():
    """Women page 'Messages for women' = every Women Foundation card in the Media library, newest first."""
    media = (ROOT / 'media.html').read_text()
    _, cards = parse_cards(media)
    picks = [c for c in cards if c['program'] == 'Women Foundation'][:WOMEN_MAX]
    if not picks:
        return
    wp = ROOT / 'women.html'
    w = wp.read_text()
    m = re.search(r'(<span class="eyebrow">Messages for women</span>.*?<div class="message-grid">)(.*?)(</div></div></section>)', w, re.S)
    if not m:
        print('women sync: messages block not found — skipped')
        return
    inner = ''.join(c['html'] for c in picks)
    if m.group(2) != inner:
        wp.write_text(w[:m.start(2)] + inner + w[m.end(2):])
        print('women sync: %d Women Foundation messages' % len(picks))

GEN_MAX = 7
GEN_START, GEN_END = '<!-- gen218-videos:start -->', '<!-- gen218-videos:end -->'

def refresh_gen218():
    """Gen218 page 'Ministry moments' = newest Gen218 video (click-to-play) + any other Gen218 messages, from the Media library."""
    media = (ROOT / 'media.html').read_text()
    _, cards = parse_cards(media)
    pl = set((json.loads(PLAYLIST_IDS.read_text()) if PLAYLIST_IDS.exists() else {}).get('gen218', []))
    picks = [c for c in cards if c['id'] in pl or c['program'] == 'Gen218' or re.search(r'gen ?218', c['title'], re.I)][:GEN_MAX]
    if not picks:
        return
    gp = ROOT / 'gen218.html'
    g = gp.read_text()
    if GEN_START not in g or GEN_END not in g:
        print('gen218 sync: markers not found — skipped')
        return
    top, rest = picks[0], picks[1:]
    t = html.escape(html.unescape(top['title']))
    sec = (GEN_START + '<section class="section gen-moments" aria-labelledby="gmTitle"><div class="wrap wm-grid">'
           '<div class="wm-copy"><span class="eyebrow">Ministry moments</span><h2 id="gmTitle">' + t + '.</h2>'
           '<p class="wm-meta">Prayer &middot; Purpose &middot; Power &mdash; watch the livestream</p>'
           '<p>Singles from across the region gathered for powerful prayer, deliverance and sound teaching on purpose, '
           'preparation and God&rsquo;s best for marriage. Missed it, or want to pray through it again? The full service is here.</p>'
           '<blockquote>&ldquo;For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, '
           'to give you an expected end.&rdquo;<cite>Jeremiah 29:11</cite></blockquote>'
           '<p class="gm-note">Photos from the conference are coming soon.</p>'
           '<div class="hero-actions"><a class="button" href="' + top['href'] + '">Watch the conference</a>'
           '<a class="button light" href="/media">More messages</a></div></div>'
           '<div class="gm-video"><a class="yt-lite" href="https://www.youtube.com/watch?v=' + top['id'] + '" data-yt="' + top['id'] + '" data-title="' + t + '">'
           '<img src="https://i.ytimg.com/vi/' + top['id'] + '/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async">'
           '<span class="yt-play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>'
           '<span class="yt-sr">Play video: ' + t + '</span></a>'
           '<p class="gm-cap">' + t + ' &middot; full livestream</p></div></div>')
    if rest:
        sec += ('<div class="wrap gm-more"><div class="gm-more-head"><h3>More Gen218 conferences</h3>'
                '<a class="gm-pl" href="https://www.youtube.com/playlist?list=' + PLAYLISTS['gen218'] + '" target="_blank" rel="noopener">Full playlist on YouTube &rarr;</a></div>'
                '<div class="message-grid">' + ''.join(c['html'] for c in rest) + '</div></div>')
    sec += '</section>' + GEN_END
    a, b = g.index(GEN_START), g.index(GEN_END) + len(GEN_END)
    if g[a:b] != sec:
        gp.write_text(g[:a] + sec + g[b:])
        print('gen218 sync: %d Gen218 video(s)' % len(picks))

LIVE_RECENT = 6
# The channel's "Live" tab (past live streams), as a feed: YouTube's built-in UULV playlist for the channel
LIVE_FEED = 'https://www.youtube.com/feeds/videos.xml?playlist_id=UULV' + CHANNEL_ID[2:]

def live_title(raw, vid=''):
    """Title for a past live stream: 'Name — subtitle' (subtitle dropped when it is a tagline or a speaker)."""
    if vid in TITLE_OVERRIDES:
        return TITLE_OVERRIDES[vid]
    segs = [x.strip() for x in re.sub(r'^\s*(?:\U0001F534\s*)?LIVE\s*\|\s*', '', raw, flags=re.I).split('|') if x.strip()]
    if len(segs) > 1 and re.match(r'(?:Dr\.?|Pastor|Rev\.?|Bishop)\b', segs[1]):
        segs = segs[:1] + segs[2:]
    return clean_title('LIVE | ' + ' | '.join(segs))

MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
WEEKLY_TIME = {'Healing & Deliverance Hour': '7:00 PM CT', 'Open Heaven Encounter': '6:00 PM CT'}
LIVE_PREV = 10          # previous livestreams shown: 1 featured + 9 cards

def title_date(raw):
    """The service date written in a stream title ('10-13-2026', 'October 8, 2026'), or None."""
    m = re.search(r'\b(\d{1,2})-(\d{1,2})-(20\d\d)\b', raw)
    if m:
        try:
            return datetime.date(int(m.group(3)), int(m.group(1)), int(m.group(2)))
        except ValueError:
            pass
    m = re.search(r'\b(' + '|'.join(MONTHS) + r')\s+(\d{1,2}),?\s+(20\d\d)\b', raw, re.I)
    if m:
        try:
            return datetime.date(int(m.group(3)), MONTHS.index(m.group(1).lower()) + 1, int(m.group(2)))
        except ValueError:
            pass
    return None

def nice_date(d, year=True):
    return d.strftime('%A, %B ') + str(d.day) + (d.strftime(', %Y') if year else '')

def live_items(xml, pages):
    """Split the Live-tab feed into (scheduled soonest-first, previous most-recent-first)."""
    today = (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=6)).date()     # Central Time (close enough for a date)
    sched, prev = [], []
    for entry in re.findall(r'<entry>(.*?)</entry>', xml, re.S):
        vid = re.search(r'<yt:videoId>([\w-]{11})</yt:videoId>', entry).group(1)
        raw = html.unescape(re.search(r'<title>(.*?)</title>', entry, re.S).group(1)).strip()
        views = int((re.search(r'<media:statistics views="(\d+)"', entry) or [0, 0])[1])
        published = re.search(r'<published>([^<]+)</published>', entry).group(1)
        if '#' in raw:
            continue
        td = title_date(raw)
        it = {'id': vid, 'raw': raw, 'title': live_title(raw, vid), 'published': published, 'year': published[:4],
              'program': programme_of(raw), 'speaker': speaker_of(raw), 'source': source_of(raw), 'topics': topics_of(raw),
              'date': td or datetime.date.fromisoformat(published[:10]), 'dated': bool(td),
              'href': pages.get(vid) or 'https://www.youtube.com/watch?v=' + vid}
        if views == 0:
            if td is None or td >= today:
                sched.append(it)      # not aired yet: scheduled
            continue                  # (a past date with no views never aired: skip)
        prev.append(it)
    sched.sort(key=lambda i: (i['date'], i['published']))
    prev.sort(key=lambda i: (i['date'], i['published']), reverse=True)
    return sched, prev

def sched_card(it):
    e = html.escape
    yt = 'https://www.youtube.com/watch?v=' + it['id']
    when = (nice_date(it['date'], False) if it['dated'] else 'Date to be announced')
    if it['dated'] and WEEKLY_TIME.get(it['program']):
        when += ' &middot; ' + WEEKLY_TIME[it['program']]
    return ('<article class="message-card lv-sched" data-yt="%s"><a href="%s" target="_blank" rel="noopener"><img width="480" height="360" '
            'src="https://img.youtube.com/vi/%s/hqdefault.jpg" alt="%s thumbnail" loading="lazy" decoding="async"><b class="lv-badge">Scheduled</b></a>'
            '<div><small>%s</small><h3><a href="%s" target="_blank" rel="noopener">%s</a></h3><p class="lv-when">%s</p>'
            '<a class="lv-remind" href="%s" target="_blank" rel="noopener">Set a reminder on YouTube &rarr;</a></div></article>') % (
        it['id'], yt, it['id'], e(it['title']), e(it['program']), yt, e(it['title']), when, yt)

SCHED_EMPTY = ('<p class="dept-empty lv-empty">No livestreams are scheduled on YouTube right now. Join us for Healing &amp; Deliverance Hour '
               'every Tuesday at 7:00 PM CT and Open Heaven Encounter every Thursday at 6:00 PM CT.</p>')

def prev_block(prev):
    e = html.escape
    top, rest = prev[0], prev[1:LIVE_PREV]
    t = e(top['title'])
    yt = 'https://www.youtube.com/watch?v=' + top['id']
    meta = nice_date(top['date']) + (' &middot; ' + e(top['program']) if top['program'] not in ('Sermons & Messages',) else '')
    link = ('<a class="channel-link" href="%s">Open the message page &rarr;</a>' % e(top['href'])) if top['href'].startswith('/') else \
           ('<a class="channel-link" href="%s" target="_blank" rel="noopener">Watch on YouTube &rarr;</a>' % yt)
    feature = ('<div class="watch-layout lv-feature"><div class="video-frame"><a class="yt-lite" href="%s" data-yt="%s" data-title="%s">'
               '<img src="https://i.ytimg.com/vi/%s/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async">'
               '<span class="yt-play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>'
               '<span class="yt-sr">Play video: %s</span></a><span id="lvLabel"><i></i> Most recent livestream</span></div>'
               '<aside><span class="eyebrow">Most recent</span><h3 class="lv-ft">%s</h3><p class="lv-when">%s</p>%s</aside></div>') % (
        yt, top['id'], t, top['id'], t, t, meta, link)
    cards = ''.join(card_html(dict(c, speaker=nice_date(c['date'])), c['href']) for c in rest)
    return feature + '<div class="message-grid" id="lvGrid">' + cards + '</div>'

def refresh_live():
    """Live page (/live) = the channel's YouTube Live tab, in two sections: 'Scheduled livestreams' (soonest first)
    and 'Previous livestreams' (most recent first, by the service date in the title). The browser re-renders both
    from the same feed (latest-video?live=1), so the page stays current between builds."""
    lp = ROOT / 'live.html'
    if not lp.exists():
        return
    try:
        xml = fetch_feed(LIVE_FEED)
    except Exception as ex:
        print('live sync: live-tab feed unavailable (%s) — no change' % ex)
        return
    _, cards = parse_cards((ROOT / 'media.html').read_text())
    sched, prev = live_items(xml, {c['id']: c['href'] for c in cards})
    if not prev:
        return
    s = lp.read_text()
    n = re.sub(r'(<!-- live:sched -->).*?(<!-- /live:sched -->)', lambda m: m.group(1) + ('<div class="message-grid lv-sched-grid" id="lvSched">' + ''.join(sched_card(i) for i in sched[:6]) + '</div>' if sched else SCHED_EMPTY) + m.group(2), s, count=1, flags=re.S)
    n = re.sub(r'(<!-- live:prev -->).*?(<!-- /live:prev -->)', lambda m: m.group(1) + prev_block(prev) + m.group(2), n, count=1, flags=re.S)
    if n != s:
        lp.write_text(n)
        print('live sync: %d scheduled; most recent = %s; %d previous' % (len(sched), prev[0]['title'], min(len(prev), LIVE_PREV)))

def refresh_playlist_filter():
    """Media page 'Playlist' filter options = the channel's playlists (js/media-playlists.json, tools/yt_playlists.py)."""
    try:
        import yt_playlists
        yt_playlists.refresh()
    except Exception as ex:
        print('playlists: refresh failed (%s)' % ex)
    f = ROOT / 'js' / 'media-playlists.json'
    if not f.exists():
        return
    pls = json.loads(f.read_text()).get('playlists', [])
    mp = ROOT / 'media.html'
    m = mp.read_text()
    opts = '<option value="All">All</option>' + ''.join('<option value="%s">%s</option>' % (html.escape(p['id']), html.escape(p['title'])) for p in pls)
    n = re.sub(r'(<select id="mPlaylist">).*?(</select>)', lambda x: x.group(1) + opts + x.group(2), m, count=1, flags=re.S)
    if n != m:
        mp.write_text(n)
        print('playlists: filter has %d playlists' % len(pls))

def main():
    r = _main()
    refresh_playlist_filter()
    refresh_women()
    refresh_gen218()
    refresh_live()
    return r

if __name__ == '__main__':
    sys.exit(main())
