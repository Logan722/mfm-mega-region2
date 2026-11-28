#!/usr/bin/env python3
"""Decide whether a YouTube-sync build is worth publishing (Dawn, 2026-11-27: save Netlify credits).

Every production deploy costs Netlify credits, and the 30-minute sync used to publish on ANY change (a date in the
sitemap, a "last checked" time, playlists swapping order). This looks at what the build changed and prints one word:

  now    something people would notice: a new page (a new message), a new newsletter issue, videos added or removed
         on the home, media, women or Gen218 pages, or a livestream added/moved on the live page  -> publish now
  small  real but minor changes (event pages that ended, playlist order, text refreshes) -> publish at most every
         SMALL_HOURS hours (the pages also top themselves up in the browser)
  none   only timestamps/dates changed -> do not publish

Usage: python tools/sync_gate.py            (compares the working tree with HEAD)
       python tools/sync_gate.py A B        (compares commit A with commit B, for testing)
"""
import json, re, subprocess, sys

ID_PAGES = {'index.html', 'media.html', 'live.html', 'women.html', 'gen218.html'}
NOW_PREFIX = ('newsletter/',)
VOLATILE = [
    (re.compile(r'<lastmod>[^<]*</lastmod>'), '<lastmod/>'),
    (re.compile(r'<!-- build: [^>]*-->'), '<!-- build -->'),
    (re.compile(r'"checked"\s*:\s*"[^"]*"'), '"checked":""'),
    (re.compile(r'([?&]v=)[0-9a-f]{6,12}'), r'\1x'),
    (re.compile(r'\b20\d\d-\d\d-\d\dT\d\d:\d\d(:\d\d)?(\.\d+)?(Z|[+-]\d\d:\d\d)?'), 'T'),
]
VID = re.compile(r'(?:youtube\.com/(?:watch\?v=|embed/|shorts/|live/)|youtu\.be/|i\.ytimg\.com/vi(?:_webp)?/|data-(?:yt|vid|id)=")([A-Za-z0-9_-]{11})')


def git(*a):
    return subprocess.run(['git', *a], capture_output=True, text=True).stdout


def read(ref, path):
    if ref is None:
        try:
            return open(path, encoding='utf-8', errors='replace').read()
        except OSError:
            return None
    r = subprocess.run(['git', 'show', f'{ref}:{path}'], capture_output=True)
    return r.stdout.decode('utf-8', 'replace') if r.returncode == 0 else None


def norm(t):
    for rx, rep in VOLATILE:
        t = rx.sub(rep, t)
    return t


def ids_of(t):
    return set(VID.findall(t or ''))


def live_sections(t):
    """which videos are in which section of the live page (order ignored: the API returns it in changing order),
    so a stream moving from Scheduled to Previous counts but a reshuffle does not"""
    return {m.group(1): frozenset(VID.findall(m.group(2))) for m in re.finditer(r'<section[^>]*id="([^"]+)"(.*?)</section>', t or '', re.S)}


def json_ids(t):
    try:
        d = json.loads(t or 'null')
    except ValueError:
        return None
    if isinstance(d, list):
        return set(map(str, d))
    if isinstance(d, dict):
        return set(map(str, d.keys()))
    return None


def decide(a=None, b=None):
    if b is None:  # working tree vs HEAD
        changed = [l[3:] for l in git('status', '--porcelain').splitlines()]
        new = [l[3:] for l in git('status', '--porcelain').splitlines() if l.startswith('??') or l.startswith('A ')]
        base, head = 'HEAD', None
    else:
        st = git('diff', '--name-status', a, b).splitlines()
        changed = [l.split('\t')[-1] for l in st]
        new = [l.split('\t')[-1] for l in st if l.startswith('A')]
        base, head = a, b
    changed = [c.strip('"') for c in changed if c and '__pycache__' not in c]
    new = [c.strip('"') for c in new if '__pycache__' not in c]
    if not changed:
        return 'none', []
    why, small = [], []
    for f in new:
        if f.endswith('.html') or f.startswith(NOW_PREFIX):
            why.append('new page ' + f)
    for f in changed:
        old, cur = read(base, f), read(head, f)
        if f.startswith(NOW_PREFIX) and norm(old or '') != norm(cur or ''):
            why.append('newsletter ' + f)
            continue
        if f == 'live.html':
            if live_sections(old) != live_sections(cur):
                why.append('livestreams changed')
            elif norm(old or '') != norm(cur or ''):
                small.append(f)
            continue
        if f in ID_PAGES and ids_of(old) != ids_of(cur):
            why.append(f'videos changed on {f}')
            continue
        if norm(old or '') != norm(cur or ''):
            small.append(f)
    if why:
        return 'now', why
    if small:
        return 'small', small
    return 'none', changed


if __name__ == '__main__':
    d, info = decide(*sys.argv[1:3]) if len(sys.argv) >= 3 else decide()
    print(d)
    for i in info[:30]:
        print('  ' + i, file=sys.stderr)
