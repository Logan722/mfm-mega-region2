"""Rate every Play & Grow question easy / medium / hard (field `level`, `lv` on blitz).
Kids questions keep level 'kids'. Run from anywhere; edits the repo in place."""
import json, re, sys, collections
sys.path.insert(0, __import__('os').path.dirname(__import__('os').path.abspath(__file__)))
import common as C

R = __import__('os').environ.get('MFM_REPO',__import__('os').path.abspath(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'../../..')))+'/js/'
FAM = C.FAMOUS_SET
KNOWN_BOOKS = {'Genesis', 'Exodus', 'Psalms', 'Proverbs', 'Isaiah', 'Daniel', 'Jonah', 'Ruth', 'Esther', 'Job',
               'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', 'Revelation'}
BIG_PEOPLE = {'Jesus', 'Moses', 'David', 'Peter', 'Paul', 'Abraham', 'Joseph', 'Ruth', 'Mary', 'Elijah', 'Pharaoh',
              'Samuel', 'Noah', 'Daniel', 'Jonah', 'Solomon', 'Jacob', 'God', 'Isaiah', 'Jeremiah', 'John', 'Esther',
              'Gideon', 'Joshua', 'Job', 'Hannah', 'Sarah', 'Eve', 'Adam', 'Goliath', 'Samson', 'Saul'}
BIG_WRITERS = {'David', 'Paul', 'Moses', 'Solomon', 'John', 'Peter', 'Isaiah', 'Jeremiah'}
BIG_PLACES = {'Jerusalem', 'Egypt', 'Bethlehem', 'Nazareth', 'Galilee', 'Babylon', 'Jordan', 'Israel', 'Jericho',
              'Canaan', 'Eden', 'Sinai', 'Zion', 'Nineveh', 'Rome', 'Damascus', 'Judah', 'Samaria', 'Capernaum'}


def ref_of(q):
    lab = (q.get('source') or {}).get('label', '')
    m = re.match(r'(.+? \d+:\d+)', lab.replace('–', '-'))
    if not m:
        return None, None
    try:
        k = C.parse(m.group(1))
    except Exception:
        return None, None
    return k, C.BOOKS[k[0]]


def ans(q):
    return q['options'][q['answer']] if 'options' in q else ''


# hand-written Bible basics: easy unless listed
BA_MED = {12, 13, 14, 15, 19, 20, 22, 23, 25, 27, 28, 29, 34, 35, 47, 48, 49, 50, 52, 53, 54, 56, 57, 58, 60, 63, 64,
          67, 69, 73, 84, 88, 89, 90, 91, 97, 98, 100, 101, 102, 103, 112, 113, 116, 117, 118, 122, 123, 125, 126, 130,
          131, 132, 133, 134, 136, 137, 138, 140, 144, 146, 147, 153, 154, 156, 157, 163, 170, 173, 174, 177, 180, 181,
          183, 187, 189, 190, 191, 192, 194, 196}
BA_HARD = {65, 124, 139, 141, 142, 143, 145, 148, 149, 150, 151, 152, 158, 164, 171, 172, 175, 176, 184, 186, 188, 197}

CORE_EASY = set('g1 mf37 mf40 mf41 mf47 mf59 mf61 mf63 mf72 mf94 mf95 mf86 cm1 cm7 sh3 mf25 mf27 mf38 mf64 mf68 m2 '
                'gn3 gn4 gn5 gn6 gn7 gn8 gn9 gn13 gn14 gn15 gn17 '
                'pf0 pf4 pf5 pf9 pf11 pf13 pf17 pf18 pf20 '
                'js0 js1 js2 js3 js4 js5 js6 js10 js11 js12 js13 js14 js15 js16 js18 js19'.split())
CORE_HARD = set('mf1 mf2 mf3 mf6 mf29 mf30 mf32 mf33 mf34 mf36 mf43 mf44 mf45 mf48 mf49 mf50 mf52 mf53 mf54 mf55 mf56 '
                'mf57 mf58 mf62 mf65 mf69 mf75 mf96 mf97 mf98 cm5 cm6 cm8 cm9 '
                'm3 m4 m7 mf9 mf10 mf11 mf12 mf14 mf17 mf18 mf23 mf24 sh1 sh2 sh4 sh5 gn16 pf16'.split())
PROM_MED = {'pm9', 'pm16', 'pm18'}


def rate_core(q):
    i, p, s = q['id'], q['pack'], q['q']
    if i in CORE_EASY: return 'easy'
    if i in CORE_HARD: return 'hard'
    if p == 'promises': return 'medium' if i in PROM_MED else 'easy'
    if p == 'go-books':
        if 'series' in s or 'Prayer and Fasting' in s: return 'hard'
        return 'medium'
    if p == 'messages':
        if re.search(r'on (Healing|Open)[^?]* on [A-Z][a-z]+ \d', s): return 'hard'
        return 'medium'
    return 'medium'


def rate_bible(q):
    t = q['id'].split('-')[1]
    if t.startswith('ba_'):
        n = int(t[3:])
        return 'hard' if n in BA_HARD else 'medium' if n in BA_MED else 'easy'
    if t.startswith('ob'): return 'easy'
    if t.startswith('bo'):
        a = ans(q); m = re.search(r'before (\d) (.+)\?', q['q'])
        return 'easy' if m and a == f'{int(m.group(1)) - 1} {m.group(2)}' else 'medium'
    k, book = ref_of(q)
    fam = k in FAM
    if t.startswith('bw'): return 'easy' if fam else 'medium' if book in KNOWN_BOOKS else 'hard'
    if t.startswith('bn'): return 'easy' if fam else 'hard'
    if t.startswith('bp'): return 'easy' if fam else 'medium' if any(x in ans(q) for x in BIG_PLACES) else 'hard'
    return 'medium'


def rate_verse(q):
    k, book = ref_of(q)
    if q['id'].startswith('V-ov') or k in FAM: return 'easy'
    return 'medium' if book in KNOWN_BOOKS else 'hard'


def rate_who(q):
    k, book = ref_of(q); a = ans(q)
    if k in FAM: return 'easy'
    if q['id'].startswith('W-wa'):
        return 'medium' if a in BIG_WRITERS else 'hard'
    return 'medium' if a in BIG_PEOPLE and book in KNOWN_BOOKS else 'hard'


def rate_oni(q):
    t = q['id'].split('-')[1]
    if t.startswith('oo'): return 'easy'
    if t.startswith('of'): return 'medium'
    return 'hard'


def rate_blitz(q, core_lv):
    t = q['id'][2:]
    if t.startswith(('toow', 'tooh')): return 'hard'
    if t.startswith('toof'): return 'medium'
    if t.startswith('tc'):
        s = q['s']
        if 'series' in s or 'Prayer and Fasting' in s: return 'hard'
        return core_lv.get(s, 'medium')
    k, book = ref_of(q)
    if k in FAM: return 'easy'
    return 'medium' if book in KNOWN_BOOKS else 'hard'


def main():
    stats = collections.defaultdict(collections.Counter)
    bank = json.load(open(R + 'quiz-bank.json'))
    for q in bank['questions']:
        q['level'] = rate_core(q); stats['core:' + q['pack']][q['level']] += 1
    core_lv = {q['q']: q['level'] for q in bank['questions']}
    for f, fn in [('bible', rate_bible), ('verse', rate_verse), ('who', rate_who), ('oni-books', rate_oni)]:
        qs = json.load(open(R + f'quiz/{f}.json'))
        for q in qs:
            q['level'] = fn(q); stats[f][q['level']] += 1
        json.dump(qs, open(R + f'quiz/{f}.json', 'w'), ensure_ascii=False, separators=(',', ':'))
    bl = json.load(open(R + 'quiz/blitz.json'))
    for q in bl:
        q['lv'] = rate_blitz(q, core_lv); stats['blitz'][q['lv']] += 1
    json.dump(bl, open(R + 'quiz/blitz.json', 'w'), ensure_ascii=False, separators=(',', ':'))
    import hashlib, os
    bank['lazy'] = {f[:-5]: hashlib.sha256(open(R + 'quiz/' + f, 'rb').read()).hexdigest()[:8] for f in os.listdir(R + 'quiz') if f.endswith('.json')}
    bank['version'] = 'preview-2026-11-27b'
    json.dump(bank, open(R + 'quiz-bank.json', 'w'), ensure_ascii=False, separators=(',', ':'))
    for k, c in sorted(stats.items()):
        n = sum(c.values()); print(f'{k:16} {n:5}  ' + '  '.join(f'{l} {c[l]} ({c[l] * 100 // n}%)' for l in ('easy', 'medium', 'hard')))


if __name__ == '__main__':
    main()
