"""Link previews for the whole site (Dawn, Nov 28 2026: "every share button, every page, the proper preview").

One table drives both halves:
  * the picture (1200x630) that tools/og/render.js draws for each entry -> img/og/<img>.jpg
  * the page's og:/twitter: tags (tools/share_meta.py applies them during tools/build_site.py)

Rules: copy comes from the page itself (never invented); one gold #c9952c; no words on a gold fill;
centred layout. Scripture quotes are KJV and were checked against the KJV text.
"""
import html as H, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
G = '#d9a948'  # brand gold, lifted a touch for small icons on navy

IC = {
    'flame': '<svg viewBox="0 0 64 64"><defs><linearGradient id="f" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e85d26"/><stop offset="1" stop-color="#ffc061"/></linearGradient></defs><path d="M32 5c10 9 15 17 15 26a15 15 0 0 1-30 0c0-7 3.8-12.6 7.4-16.4.3 5 2.6 8.2 5.4 8.9C27.9 16.6 29.3 10.7 32 5Z" fill="url(#f)"/><path d="M32 30c3.6 3.4 5.4 6.2 5.4 9.4a5.4 5.4 0 0 1-10.8 0c0-3 1.8-5.6 5.4-9.4Z" fill="#fff3d6"/></svg>',
    'quote': '<svg viewBox="0 0 64 64"><path d="M14 40c0-10 5-17 15-21l2 4c-5 2.6-7.6 6-8 10h7v14H14Zm22 0c0-10 5-17 15-21l2 4c-5 2.6-7.6 6-8 10h7v14H36Z" fill="%s"/></svg>' % G,
    'pin': '<svg viewBox="0 0 64 64" fill="none" stroke="%s" stroke-width="3.4" stroke-linejoin="round"><path d="M32 57s17-17.5 17-31a17 17 0 0 0-34 0c0 13.5 17 31 17 31Z"/><circle cx="32" cy="26" r="6.5"/></svg>' % G,
    'cal': '<svg viewBox="0 0 64 64" fill="none" stroke="%s" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="14" width="44" height="40" rx="6"/><path d="M10 26h44M22 8v12M42 8v12M21 36h6M37 36h6M21 45h6"/></svg>' % G,
    'live': '<svg viewBox="0 0 64 64" fill="none" stroke="%s" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="14" width="48" height="32" rx="6"/><path d="M27 23v14l12-7Z" fill="%s"/><path d="M22 54h20"/></svg>' % (G, G),
    'give': '<svg viewBox="0 0 64 64" fill="none" stroke="%s" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M32 52S10 39 10 24a11 11 0 0 1 22-3 11 11 0 0 1 22 3c0 15-22 28-22 28Z"/></svg>' % G,
    'link': '<svg viewBox="0 0 64 64" fill="none" stroke="%s" stroke-width="3.6" stroke-linecap="round"><path d="M27 37a10 10 0 0 0 14 0l9-9a10 10 0 0 0-14-14l-3 3"/><path d="M37 27a10 10 0 0 0-14 0l-9 9a10 10 0 0 0 14 14l3-3"/></svg>' % G,
    'people': '<svg viewBox="0 0 64 64" fill="none" stroke="%s" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="22" r="8"/><circle cx="15" cy="28" r="6"/><circle cx="49" cy="28" r="6"/><path d="M18 52c0-9 6-15 14-15s14 6 14 15M5 50c0-6 4-10 10-10M59 50c0-6-4-10-10-10"/></svg>' % G,
    'shield': '<svg viewBox="0 0 64 64" fill="none" stroke="%s" stroke-width="3.4" stroke-linejoin="round"><path d="M32 7 12 15v15c0 13 9 22 20 27 11-5 20-14 20-27V15Z"/><path d="m23 32 6 6 12-13" stroke-linecap="round"/></svg>' % G,
    'check': '<svg viewBox="0 0 64 64" fill="none" stroke="%s" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><path d="m21 33 8 8 15-17"/></svg>' % G,
    'mail': '<svg viewBox="0 0 64 64" fill="none" stroke="%s" stroke-width="3.2" stroke-linejoin="round"><rect x="9" y="16" width="46" height="33" rx="5"/><path d="m11 19 21 16 21-16" stroke-linecap="round"/></svg>' % G,
    'trophy': '<svg viewBox="0 0 64 64"><path d="M20 10h24v12a12 12 0 0 1-24 0Z" fill="%s"/><path d="M20 14h-8a8 8 0 0 0 8 10M44 14h8a8 8 0 0 1-8 10" fill="none" stroke="%s" stroke-width="3.4"/><path d="M28 34h8v8h-8z" fill="%s"/><rect x="21" y="42" width="22" height="7" rx="2" fill="%s"/><path d="M32 13c2.6 2.6 4 4.6 4 6.8a4 4 0 0 1-8 0c0-2.2 1.4-4.2 4-6.8Z" fill="#e85d26"/></svg>' % (G, G, G, G),
    'book': '<svg viewBox="0 0 64 64" fill="none" stroke="%s" stroke-width="3.4" stroke-linejoin="round"><path d="M32 16c-6-5-14-6-22-5v38c8-1 16 0 22 5 6-5 14-6 22-5V11c-8-1-16 0-22 5Z"/><path d="M32 16v38"/></svg>' % G,
    'room': '<svg viewBox="0 0 64 64" fill="none" stroke="%s" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><rect x="20" y="8" width="24" height="44" rx="5"/><path d="M29 46h6"/><path d="M12 22a20 20 0 0 0 0 20M52 22a20 20 0 0 1 0 20M6 16a30 30 0 0 0 0 32M58 16a30 30 0 0 1 0 32"/></svg>' % G,
}

def ph(name):  # card.html sits in tools/og/
    return '../../img/photos/' + name

# file -> page address, og:title, og:description, picture spec
PAGES = {
    'index.html': ('/', 'MFM Mega Region 2 USA',
        'One regional family devoted to prayer, deliverance, the Word and the demonstration of the power of God. Find a branch, watch live, request prayer.',
        {'img': 'home', 'photo': ph('fullhouse.jpg'), 'logo': '../../img/logo.png', 'k': 'Mountain of Fire and Miracles Ministries', 'h': 'Mega Region 2 USA', 'h1': 96,
         'verse': ['Is not my word like as a fire? saith the LORD', 'Jeremiah 23:29']}),
    'about.html': ('/about', 'About MFM Mega Region 2 USA',
        'Who we are: our identity, our scriptural mandate, and our core values of prayer, deliverance and the Word.',
        {'img': 'about', 'photo': ph('G.O Couple.jpg'), 'icon': 'flame', 'k': 'About us', 'h': 'Who we are', 'sub': 'Our identity, our mandate, and our core values of prayer, deliverance and the Word.'}),
    'branches.html': ('/branches', 'Find an MFM branch near you',
        'MFM Mega Region 2 branches across Texas, Georgia, Florida, Tennessee, North Carolina and Oklahoma. Visit Prayer City HQ in Houston, TX.',
        {'img': 'branches', 'photo': ph('building.jpg'), 'icon': 'pin', 'k': 'Our branches', 'h': 'Find a branch <em>near you</em>', 'chips': ['Texas', 'Georgia', 'Florida', 'Tennessee', 'North Carolina', 'Oklahoma']}),
    'events.html': ('/events', 'Events & programs',
        'Healing & Deliverance Hour, Open Heaven Encounter, crusades and special programs across MFM Mega Region 2 USA. Join us.',
        {'img': 'events', 'photo': ph('worship.jpg'), 'icon': 'cal', 'k': 'Events & programs', 'h': 'Come and <em>encounter God</em>', 'sub': 'Healing & Deliverance Hour, Open Heaven Encounter, crusades and special programs.'}),
    'fire-for-the-week.html': ('/fire-for-the-week', 'Fire for the Week: prayer points',
        'A fresh set of prayer points to pray through this week. Read them, download the PDF and pray along.',
        {'img': 'fire-for-the-week', 'icon': 'flame', 'k': 'Fire for the Week', 'h': 'Prayer points <em>for this week</em>', 'sub': 'Fresh prayer points every week. Read, download and pray along.',
         'verse': ['his word was in mine heart as a burning fire shut up in my bones', 'Jeremiah 20:9']}),
    'gen218.html': ('/gen218', 'Gen218: Christian singles ministry',
        'A community preparing singles for marriage through spiritual growth, fellowship and the Word of God.',
        {'img': 'gen218', 'logo': '../../img/gen218-logo.jpg', 'badge': 1, 'k': 'Christian singles ministry', 'h': 'Gen218',
         'verse': ['It is not good that the man should be alone', 'Genesis 2:18']}),
    'give.html': ('/give', 'Give: support the work of God',
        'Give your tithes, offerings, special seeds and building fund contributions online to MFM Mega Region 2 USA.',
        {'img': 'give', 'icon': 'give', 'k': 'Give', 'h': 'Support the <em>work of God</em>', 'sub': 'Tithes, offerings, special seeds and the building fund, online.',
         'verse': ['God loveth a cheerful giver.', '2 Corinthians 9:7']}),
    'links.html': ('/links', 'Connect with MFM Mega Region 2 USA',
        'All our links in one place: YouTube, Facebook, Instagram, WhatsApp and more. Follow us for prayers, sermons and breakthrough.',
        {'img': 'links', 'icon': 'link', 'k': 'Connect with us', 'h': 'All our links <em>in one place</em>', 'chips': ['YouTube', 'Facebook', 'Instagram', 'WhatsApp']}),
    'live.html': ('/live', 'Watch live',
        'Healing & Deliverance Hour on Tuesdays at 7:00 PM CT and Open Heaven Encounter on Thursdays at 6:00 PM CT, live from MFM Mega Region 2 USA.',
        {'img': 'live', 'photo': ph('band.jpg'), 'icon': 'live', 'k': 'Watch live', 'h': 'Join us <em>live</em>', 'chips': ['Healing & Deliverance Hour · Tue 7:00 PM CT', 'Open Heaven Encounter · Thu 6:00 PM CT']}),
    'media.html': ('/media', 'Sermons and messages',
        'Watch sermons, prayer sessions and program archives from MFM Mega Region 2 USA: Healing & Deliverance Hour, Open Heaven Encounter and more.',
        {'img': 'media', 'photo': ph('choir.jpg'), 'icon': 'live', 'k': 'Media', 'h': 'Sermons &amp; <em>messages</em>', 'sub': 'Healing & Deliverance Hour, Open Heaven Encounter, crusades and more.'}),
    'ministries.html': ('/ministries', 'Our ministries',
        'The Women Foundation, the Gen218 singles ministry and the Mega Region 2 Youth Church. Find your place and get involved.',
        {'img': 'ministries', 'photo': ph('community.jpg'), 'icon': 'people', 'k': 'Our ministries', 'h': 'Find your place', 'chips': ['Women Foundation', 'Gen218', 'Youth Church']}),
    'women.html': ('/women', 'MFM Women Foundation',
        'Empowerment, prayer and deliverance for women of purpose and destiny, in MFM Mega Region 2 USA.',
        {'img': 'women', 'photo': ph('women.jpg'), 'logo': '../../img/women-foundation-logo.png', 'k': 'MFM Mega Region 2 USA', 'h': 'Women Foundation', 'sub': 'Empowerment, prayer and deliverance for women of purpose and destiny.'}),
    'privacy.html': ('/privacy', 'Privacy policy',
        'How MFM Mega Region 2 USA collects, uses and protects your information.',
        {'img': 'privacy', 'icon': 'shield', 'k': 'Privacy', 'h': 'Your privacy', 'sub': 'How we collect, use and protect your information.'}),
    'thanks.html': ('/thanks', 'Thank you',
        'Your message has been received by MFM Mega Region 2 USA. Our ministry team will be in touch.',
        {'img': 'thanks', 'icon': 'check', 'k': 'Message received', 'h': 'Thank you', 'sub': 'Our ministry team will be in touch.'}),
    'subscribe.html': ('/subscribe', 'Get the MFM Mega Region 2 newsletter',
        'Sermons, prayer points, testimonies and upcoming crusade updates, twice a month in your inbox.',
        {'img': 'subscribe', 'icon': 'mail', 'k': 'Newsletter', 'h': 'Get the <em>newsletter</em>', 'sub': 'Sermons, prayer points, testimonies and crusade updates, twice a month.'}),
    'play.html': ('/play', 'Play & Grow: free Bible games',
        '11 free games from the Bible and the ministry, animated Bible Stories and a live room to play with friends anywhere. Play solo or as a team and lift your branch on the weekly board.',
        {'img': 'play', 'icon': 'trophy', 'k': 'Free Bible games', 'h': 'Play &amp; Grow', 'h1': 104, 'sub': '11 games, animated Bible Stories and a live room for friends anywhere.', 'chips': ['Solo', 'Team', 'Live room', 'Weekly branch board']}),
}

# Play & Grow: every game gets its own address /play/<id> (a small page with that game's preview that opens the game)
GAMES = {
    'bquiz': ('Quiz', 'Daily 10, a fresh quiz, a 60-second speed round, kids questions or a team battle. Questions from the Bible, MFM and our pastors’ books.'),
    'word': ('Word of the Day', 'Guess the Bible word in six tries, then read the verse it comes from.'),
    'connect': ('Connections', '16 words, 4 hidden groups from the Bible and the ministry. Find them with 4 mistakes or fewer.'),
    'wheel': ('Word Connect', 'Swipe the letters to make words and unlock a verse.'),
    'dverse': ('Daily Verse', 'Read today’s verse and find where it is: the book, then the chapter, in 5 tries.'),
    'whoami': ('Who Am I?', 'Clues about a Bible person, one at a time. The fewer you need, the more you score.'),
    'build': ('Verse Builder', 'A verse in pieces. Put it back in order against the clock.'),
    'imposter': ('Imposter', 'Everyone sees the same secret word except one. Give clues, then find the imposter.'),
    'charades': ('Charades', 'Phone on your forehead. Your team acts it out. Guess as many as you can in 60 seconds.'),
    'pairs': ('Noah’s Pairs', 'Find the animals two by two. Made for children, fun for everyone.'),
    'story': ('Bible Stories', 'Play a Bible story as an animated storybook. Answer as it unfolds, and the story keeps going.'),
}
LIVE = ('Join my live room', 'Play Play & Grow live with me: open the link, type your name and we play the same questions at the same time, wherever you are.')

def branch_entries():
    out = {}
    for p in sorted((ROOT / 'branches').glob('*.html')):
        t = p.read_text(encoding='utf-8')
        d = H.unescape(re.search(r'<meta name="description" content="([^"]*)"', t).group(1))
        m = re.match(r'(.+?) in ([^.]+)\. (Pastor [^.]+?)(?:\. Services: ([^.]+?))?\. ', d)
        if not m:
            continue
        name, city, pastor, svc = m.groups()
        pastor = pastor.split(' · ')[0]
        spec = {'img': 'branch-' + p.stem, 'photo': ph('building.jpg'), 'icon': 'pin', 'k': city, 'h': H.escape(name), 'h1': 84, 'maxH': 190,
                'sub': H.escape(pastor), 'chips': [H.escape(s) for s in svc.split(' · ')][:3] if svc else ['Visit in person or watch online']}
        out['branches/' + p.name] = ('/branches/' + p.stem, '%s · %s' % (name, city), d, spec)
    return out

def declarations():
    f = ROOT / 'data' / 'declarations.json'
    return json.loads(f.read_text(encoding='utf-8')).get('days', {}) if f.exists() else {}

def decl_label(d):
    return 'Declaration of the week' if d.get('kind') == 'weekly' else '%s declaration' % (d.get('day') or 'Today’s')

def decl_card(day, d):
    return {'img': 'decl/' + day, 'big': 1, 'icon': IC['flame'], 'k': decl_label(d), 'verse': [H.escape(d['verse'].rstrip(' .;,')), H.escape(d['ref'])],
            'sub': H.escape(d['title']) if d.get('kind') == 'weekly' else H.escape((d.get('lines') or [''])[0])}

def slugify(x):
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', H.unescape(x).lower().replace('$', '').replace('’', '').replace("'", ''))).strip('-')[:60].rstrip('-')

def testimonies():
    """The testimonies on /testimonies, in page order: (slug, category, headline, text, name, source)."""
    f = ROOT / 'testimonies.html'
    if not f.exists():
        return []
    out, seen = [], set()
    for a in re.findall(r'<article class="tc"[^>]*>.*?</article>', f.read_text(encoding='utf-8'), re.S):
        g = lambda rx: (re.search(rx, a, re.S) or [None, ''])[1]
        head = g(r'<h3>(.*?)</h3>'); slug = slugify(re.sub('<[^>]+>', '', head)) or 'testimony'
        while slug in seen: slug += '-2'
        seen.add(slug)
        out.append((slug, g(r'<span class="tag">(.*?)</span>'), head, g(r'<p>(.*?)</p>'), g(r'<div class="by"><b>(.*?)</b>'), g(r'<div class="by"><b>.*?</b><span>(.*?)</span>')))
    return out

def all_pages():
    pages = dict(PAGES)
    pages.update(branch_entries())
    return pages

def cards():
    """Picture specs for render.js (icons expanded)."""
    out = []
    for f, (path, title, desc, spec) in all_pages().items():
        c = dict(spec)
        if c.get('icon'): c['icon'] = IC[c['icon']]
        out.append(c)
    for gid, (name, line) in GAMES.items():
        out.append({'img': 'game-' + gid, 'icon': 'trophy', 'k': 'Play & Grow', 'h': H.escape(name), 'h1': 96, 'sub': H.escape(line), 'chips': ['Can you beat me?']})
    out.append({'img': 'game-live', 'icon': IC['room'], 'k': 'Play & Grow live room', 'h': 'Join my <em>live room</em>', 'sub': 'Same questions, same time, on your own phone, wherever you are.'})
    for slug, cat, head, text, name, src in testimonies():
        out.append({'img': 't/' + slug, 'icon': IC['quote'], 'k': cat or 'Testimony', 'h': head, 'h1': 80, 'maxH': 250,
                    'sub': ' · '.join(x for x in (name, src) if x), 'verse': ['The LORD hath done great things for us; whereof we are glad.', 'Psalm 126:3']})
    for day, d in declarations().items():
        out.append(decl_card(day, d))
    out.append({'img': 'declaration', 'icon': IC['flame'], 'k': 'Declaration of the week', 'h': 'Speak it <em>over your week</em>', 'sub': 'A declaration from MFM Mega Region 2 USA.'})
    for c in out:
        if isinstance(c.get('icon'), str) and c['icon'] in IC: c['icon'] = IC[c['icon']]
    return out

if __name__ == '__main__':
    import sys
    out = Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / 'tools' / 'og' / 'cards.json')
    out.write_text(json.dumps(cards(), ensure_ascii=False, indent=1))
    print(len(cards()), 'cards ->', out)
