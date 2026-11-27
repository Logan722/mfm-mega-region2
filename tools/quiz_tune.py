"""Tune Play & Grow difficulty from real play (Nov 27 2026).

Reads /.netlify/functions/leaderboard?stats=<week> for the last WEEKS weeks (how often each question was answered
right), and moves a question's level only when enough people have played it:
  answered right by 85%+ of at least MIN_PLAYS players  -> easy
  answered right by 35% or fewer of at least MIN_PLAYS   -> hard
  otherwise a question rated easy/hard that lands in the middle (40-75%) -> medium
Kids questions are never touched. Writes js/quiz-bank.json and js/quiz/*.json, then refreshes the pack hashes.

Usage: python3 tools/quiz_tune.py [--dry-run]   (prints every change; --dry-run writes nothing)
"""
import datetime, hashlib, json, os, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = os.environ.get('MFM_SITE', 'https://mfmmegaregion2usa.org')
WEEKS, MIN_PLAYS = 4, 20


def weeks():
    d = datetime.date.today()
    mon = d - datetime.timedelta(days=d.weekday())
    return [(mon - datetime.timedelta(weeks=k)).isoformat() for k in range(WEEKS)]


def stats():
    tot = {}
    for w in weeks():
        try:
            with urllib.request.urlopen(f'{SITE}/.netlify/functions/leaderboard?stats={w}', timeout=30) as r:
                d = json.load(r)
        except Exception as e:
            print('stats for', w, 'not read:', e); continue
        for qid, (seen, right) in d.get('q', {}).items():
            t = tot.setdefault(qid, [0, 0]); t[0] += seen; t[1] += right
    return tot


def decide(cur, seen, right):
    if cur == 'kids' or seen < MIN_PLAYS: return cur
    f = right / seen
    if f >= .85: return 'easy'
    if f <= .35: return 'hard'
    if cur in ('easy', 'hard') and .40 <= f <= .75: return 'medium'
    return cur


def main(dry):
    st = stats(); changes = []
    files = [ROOT / 'js' / 'quiz-bank.json'] + sorted((ROOT / 'js' / 'quiz').glob('*.json'))
    data = {}
    for f in files:
        d = json.loads(f.read_text()); qs = d['questions'] if isinstance(d, dict) and 'questions' in d else d if isinstance(d, list) else None
        if qs is None: continue
        hit = False
        for q in qs:
            if not isinstance(q, dict) or q.get('id') not in st: continue
            key = 'lv' if 'lv' in q else 'level'; cur = q.get(key, 'medium'); new = decide(cur, *st[q['id']])
            if new != cur:
                changes.append((q['id'], cur, new, st[q['id']])); q[key] = new; hit = True
        if hit: data[f] = d
    for c in changes: print('%-22s %-6s -> %-6s (%d plays, %d right)' % (c[0], c[1], c[2], c[3][0], c[3][1]))
    print(len(changes), 'change(s) from', len(st), 'questions with stats')
    if dry or not changes: return
    for f, d in data.items(): f.write_text(json.dumps(d, ensure_ascii=False, separators=(',', ':')))
    bank = json.loads((ROOT / 'js' / 'quiz-bank.json').read_text())
    bank['lazy'] = {f.stem: hashlib.sha256(f.read_bytes()).hexdigest()[:8] for f in sorted((ROOT / 'js' / 'quiz').glob('*.json'))}
    (ROOT / 'js' / 'quiz-bank.json').write_text(json.dumps(bank, ensure_ascii=False, separators=(',', ':')))


if __name__ == '__main__':
    main('--dry-run' in sys.argv)
