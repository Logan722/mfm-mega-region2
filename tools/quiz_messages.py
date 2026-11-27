"""Play & Grow "Our messages" questions, kept up to date from our YouTube uploads (Nov 27 2026).

Run by build_site.py, so the 30-minute YouTube sync turns new sermons into questions with no manual push.
Reads only local files (js/media-playlists.json, tools/media-baked.json, tools/media-archive.json), so it is
deterministic and writes js/quiz-bank.json only when a question is added.

Rules (Dawn): questions people want to learn from, nothing that could embarrass the ministry;
no Women Foundation; no Christian-celebration topics; no generic titles (Welcome Address, Day 2 ...).
Existing approved questions are never changed. Questions removed by review are listed in
tools/quiz-messages-skip.json and never come back. Only "Who preached ...?", "... was part of which event?"
and "Which message was preached on Healing & Deliverance Hour on <date>?" are made.
"""
import json, random, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BANK = ROOT / 'js' / 'quiz-bank.json'
SKIP = ROOT / 'tools' / 'quiz-messages-skip.json'

SPK = re.compile(r"^(Dr\.? ?Pastor|Pastor|Dr\.|Dr|Rev\.?|Evang\.?|Prophet|Apostle|Bishop)\b", re.I)
GENERIC = re.compile(r"^(citation|award|presentation|ordination|installation|induction|vote of thanks|offering|welcome|word of exhortation|appreciation|opening|closing|recap|day \d|part \d|sermon\b|keynote|special call|testimon|announcement|praise|choir|communion|question)|dedication \d{4}$|\(keynote\)", re.I)
BLOCK = re.compile(r"women|gen ?2:?18|single|marital|relationship|christmas|easter|carol|valentine|mother'?s day|father'?s day|halloween", re.I)
EVENT = re.compile(r"(Crusade|Conference|Retreat|Service|Convention|Dedication)\s*(\d{4})?")


def canon(n):
    if re.search(r'olukoya', n, re.I) and not re.search(r'shade|mrs', n, re.I): return 'Dr. D.K. Olukoya'
    return {'Pastor Substance': 'Pastor Substance Ibegbulem', 'Pastor Kolo Oloko': 'Pastor Kola Oloko', 'Pastor Segun Obatunsin': 'Pastor Segun Obatusin',
            'Pastor Popoola': 'Pastor David Popoola', 'Pastor Oluwatoyin Oni': 'Pastor (Mrs.) Oluwatoyin Oni'}.get(n, n)


def toks(n): return set(w.lower() for w in re.findall(r"[A-Za-z-]+", n) if w.lower() not in ('pastor', 'dr', 'mrs', 'rev'))
def clean(t): return re.sub(r'\s+', ' ', re.sub(r'[\U0001F300-\U0001FAFF☀-➿]|#\w+', '', t)).strip(' |—-')


def tc(s):
    if s.isupper() or sum(c.isupper() for c in s) > len(s) * .6:
        small = {'a', 'an', 'the', 'of', 'to', 'in', 'and', 'for', 'on', 'at', 'is', 'by', 'my', 'your'}
        w = s.lower().split(); return ' '.join(x if (i and x in small) else x[:1].upper() + x[1:] for i, x in enumerate(w))
    return s


def parse(title):
    t = clean(title.replace('LIVE |', '').replace('LIVE NOW:', ''))
    parts = [x.strip() for x in re.split(r'\s[|—]\s', t) if x.strip()]
    spk = ev = date = None
    for x in parts:
        if SPK.match(x) and len(x.split()) <= 6: spk = canon(re.sub(r'^Dr\.? Pastor', 'Pastor', x).strip())
    msg = parts[0] if parts else None
    if msg and (SPK.match(msg) or re.match(r'^(Healing & Deliverance Hour|OPEN HEAVEN ENCOUNTER|MFM|PART|Question|Educative|Opening|Recap|GEN 218$|PRAISE|CHOIR|IYC|Communion)', msg, re.I)): msg = None
    if msg and msg.lower() in ('the message', 'genesis 2:18'): msg = None
    for x in parts[1:]:
        if EVENT.search(x) and not SPK.match(x): ev = x.replace('(Rekindling the Altar)', '').strip()
    m = re.search(r'Healing & Deliverance Hour LIVE \| (\w{3} \d{1,2}, \d{4})', title)
    if m: date = m.group(1)
    return msg, spk, ev, date


def videos():
    """every known video: playlists (with their own titles) plus the Media library and its archive"""
    out, seen = [], set()
    pl = json.loads((ROOT / 'js' / 'media-playlists.json').read_text()) if (ROOT / 'js' / 'media-playlists.json').exists() else {'playlists': []}
    for f in ('media-baked.json', 'media-archive.json'):
        p = ROOT / 'tools' / f
        for b in (json.loads(p.read_text()) if p.exists() else []):
            if b.get('id') and b['id'] not in seen: seen.add(b['id']); out.append((b['id'], b.get('raw') or b.get('title', ''), b.get('published', '')[:10], b.get('program', '')))
    for p in pl.get('playlists', []):
        for v in p.get('videos', []):
            if v['id'] not in seen: seen.add(v['id']); out.append((v['id'], v['title'], '', p.get('title', '')))
    return out


def build():
    bank = json.loads(BANK.read_text())
    skip = set(json.loads(SKIP.read_text())) if SKIP.exists() else set()
    qs = bank['questions']; have = {q['q'] for q in qs}; ids = {q['id'] for q in qs}
    items = {}
    for vid, title, pub, src in videos():
        msg, spk, ev, date = parse(title)
        if not msg: continue
        it = items.setdefault(msg.lower(), dict(msg=tc(msg), vid=vid, spk=None, ev=None, date=None, pub='', src=src))
        it['spk'] = it['spk'] or spk; it['ev'] = it['ev'] or ev; it['date'] = it['date'] or date; it['pub'] = max(it['pub'], pub)
    L = list(items.values())
    spks = sorted(set(x['spk'] for x in L if x['spk']))
    added = []

    def add(kind, q, c, ds, ex, x, level):
        if q in have or q in skip or len(ds) < 3: return
        if BLOCK.search(q + ' ' + c + ' ' + (x['ev'] or '') + ' ' + (x['src'] or '')) or GENERIC.search(x['msg']): return
        qid = 'ms-%s-%s' % (x['vid'], kind)
        if qid in ids: return
        o = [c] + ds[:3]; random.Random('ms' + q).shuffle(o)
        added.append(dict(id=qid, pack='messages', level=level, q=q, options=o, answer=o.index(c), explain=ex, date=x['pub'] or '2000-01-01',
                          source={'label': 'Watch on YouTube — MFM Mega Region 2 USA', 'url': 'https://www.youtube.com/watch?v=' + x['vid']}))
        have.add(q); ids.add(qid)

    for x in sorted(L, key=lambda y: y['pub'], reverse=True):
        if x['spk']:
            ds = [s for s in spks if not (toks(s) & toks(x['spk']))]; random.Random(x['msg']).shuffle(ds)
            add('p', f"Who preached “{x['msg']}”?", x['spk'], ds, f"“{x['msg']}” — {x['spk']}" + (f", {x['ev']}." if x['ev'] else '.'), x, 'medium')
        if x['ev'] and x['spk'] and EVENT.search(x['ev']):   # sermons only
            evs = sorted(set(y['ev'] for y in L if y['ev'] and y['ev'] != x['ev'] and not BLOCK.search(y['ev']))); random.Random('e' + x['msg']).shuffle(evs)
            add('e', f"“{x['msg']}” was part of which event?", x['ev'], evs, f"{x['ev']}: “{x['msg']}”.", x, 'medium')
        if x['date']:
            others = [y['msg'] for y in L if y['date'] and y['msg'] != x['msg'] and not GENERIC.search(y['msg'])]; random.Random('d' + x['msg']).shuffle(others)
            add('d', f"Which message was preached on Healing & Deliverance Hour on {x['date']}?", x['msg'], others, f"{x['date']}: “{x['msg']}”.", x, 'hard')
    if added:
        bank['questions'] = qs + added
        BANK.write_text(json.dumps(bank, ensure_ascii=False, separators=(',', ':')))
        print('quiz messages: added %d question(s): %s' % (len(added), '; '.join(a['q'] for a in added)))
    return len(added)


if __name__ == '__main__':
    build()
