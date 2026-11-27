#!/usr/bin/env python3
"""Website 'Today in the region' feed from the Weekly Scheduler's WhatsApp Channel package.

Usage:  python tools/declarations_feed.py <MFM-WEEKLY-SCHEDULER-YYYY-Www-MANUAL.zip | WHAT-TO-POST.html> [data/declarations.json]

Reads the week's WhatsApp declarations exactly as the scheduler wrote them:
  - Monday 7:00 AM  "Declaration of the Week"      (item id WS-Www-DECLARATION-WA)
  - Tue-Sun 6:10 AM "<DAY> MORNING DECLARATION"    (item id WS-Www-DAILY-DECLARATION-<DAY>-WA)
and merges them into data/declarations.json keyed by date (YYYY-MM-DD, Central Time).
Entries older than 21 days are dropped. Nothing is invented: a day the package doesn't
carry stays absent, and the homepage then shows the latest Declaration of the Week.
"""
import datetime, html, json, re, sys, zipfile
from pathlib import Path

MONTHS = {m: i for i, m in enumerate(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                                       'September', 'October', 'November', 'December'], 1)}

def load(src):
    p = Path(src)
    if p.suffix.lower() == '.zip':
        with zipfile.ZipFile(p) as z:
            return z.read('WHAT-TO-POST.html').decode('utf-8')
    return p.read_text(encoding='utf-8')

def clean(s):
    return re.sub(r'\s+', ' ', html.unescape(s)).strip()

def strip_marks(s):
    s = s.strip()
    s = re.sub(r'^[_*]+|[_*]+$', '', s).strip()
    return s.strip('"“”').strip()

def parse(page):
    year = int(re.search(r'<header>.*?(\d{4})', page, re.S).group(1))
    out = {}
    # walk day headings and the items under each
    parts = re.split(r'<h2>([A-Za-z]+), ([A-Za-z]+) (\d{1,2})</h2>', page)
    for k in range(1, len(parts), 4):
        dow, mon, day, body = parts[k], parts[k + 1], int(parts[k + 2]), parts[k + 3]
        date = datetime.date(year, MONTHS[mon], day).isoformat()
        for m in re.finditer(r'<div class="item" id="WS-W\d+-(DECLARATION|DAILY-DECLARATION-[A-Z]{3})-WA">(.*?)<pre class="cap">(.*?)</pre>', body, re.S):
            cap = html.unescape(m.group(3)).replace('\r', '')
            lines = [l.strip() for l in cap.split('\n')]
            if m.group(1) == 'DECLARATION':
                body_lines = [l for l in lines if l and 'Declaration of the Week' not in l and not l.startswith('React with') and 'mfmmegaregion2usa.org' not in l]
                title = strip_marks(body_lines[0])
                vi = next(j for j, l in enumerate(body_lines) if re.search(r'\(KJV\)\s*$', l))
                vm = body_lines[vi]
                vt, vr = re.match(r'^(.*?)\s*[-–—]\s*([1-3]? ?[A-Z][a-z]+ \d+:\d+(?:-\d+)?)\s*\(KJV\)\s*$', vm).groups()
                text = ' '.join(l for j, l in enumerate(body_lines) if 0 < j != vi)
                out[date] = {'kind': 'weekly', 'title': title, 'text': clean(text), 'verse': strip_marks(vt), 'ref': vr}
            else:
                body_lines = [l for l in lines if l]
                i = next(j for j, l in enumerate(body_lines) if l.startswith('_'))
                verse, ref = strip_marks(body_lines[i]).rstrip(':;,'), body_lines[i + 1]
                decl = [re.sub(r'^\d+\.\s*', '', l) for l in body_lines if re.match(r'^\d+\.\s', l)]
                out[date] = {'kind': 'daily', 'day': dow, 'verse': verse, 'ref': ref, 'lines': decl}
    return out

def main():
    src = sys.argv[1]
    dst = Path(sys.argv[2] if len(sys.argv) > 2 else Path(__file__).resolve().parent.parent / 'data' / 'declarations.json')
    feed = json.loads(dst.read_text(encoding='utf-8')) if dst.exists() else {'days': {}}
    new = parse(load(src))
    if not new:
        sys.exit('no declarations found in ' + src)
    feed['days'].update(new)
    cut = (datetime.date.fromisoformat(max(feed['days'])) - datetime.timedelta(days=21)).isoformat()
    feed['days'] = {d: v for d, v in sorted(feed['days'].items()) if d >= cut}
    feed['source'] = 'MFM Mega Region 2 Weekly Scheduler: WhatsApp Channel declarations'
    feed['updated'] = datetime.date.today().isoformat()
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(json.dumps({'source': feed['source'], 'updated': feed['updated'], 'days': feed['days']}, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print('%d dates added/updated: %s' % (len(new), ', '.join(sorted(new))))

if __name__ == '__main__':
    main()
