"""YouTube playlists for the Media page filter (owner request, Oct 27 2026: "add a playlist filter - from the
playlist section of youtube").

Reads the channel's Playlists tab (youtube.com/channel/<id>/playlists) and every playlist's videos, no API key:
the public pages carry their data as ytInitialData, and longer lists continue through YouTube's own
youtubei/v1/browse endpoint. Shorts are left out (same rule as the Media page): a video of 3 minutes or less is
checked once at youtube.com/shorts/<id> (200 = Short) and the answer is remembered in tools/shorts-ids.json /
tools/video-kind.json.

Writes js/media-playlists.json  {"updated": ..., "playlists": [{"id","title","count","videos":[{"id","title","length"}]}]}
in the channel's own order; empty playlists (after Shorts) are dropped. Refreshed at most every REFRESH_HOURS.
Any failure keeps the previous file.
"""
import datetime, json, os, re, ssl, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHANNEL_ID = 'UCr3gSJPBQDjN8CEbj86Pyug'
OUT = ROOT / 'js' / 'media-playlists.json'
SHORTS = ROOT / 'tools' / 'shorts-ids.json'
KIND = ROOT / 'tools' / 'video-kind.json'
REFRESH_HOURS = 6
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

def _ctx():
    ctx = ssl.create_default_context()
    if os.path.exists('/root/.ccr/ca-bundle.crt'):
        ctx.load_verify_locations('/root/.ccr/ca-bundle.crt')
    return ctx

def _get(url, data=None, timeout=25):
    h = {'user-agent': UA, 'accept-language': 'en-US,en;q=0.9', 'cookie': 'CONSENT=YES+1; SOCS=CAI'}
    if data is not None:
        h['content-type'] = 'application/json'
        data = json.dumps(data).encode()
    req = urllib.request.Request(url, data=data, headers=h)
    return urllib.request.urlopen(req, timeout=timeout, context=_ctx()).read().decode('utf-8')

def _initial(html):
    m = re.search(r'var ytInitialData\s*=\s*(\{.*?\});</script>', html, re.S)
    return json.loads(m.group(1)) if m else None

def _cfg(html):
    key = re.search(r'"INNERTUBE_API_KEY":"([^"]+)"', html)
    ver = re.search(r'"INNERTUBE_CLIENT_VERSION":"([^"]+)"', html)
    return (key.group(1) if key else None), (ver.group(1) if ver else '2.20261001.00.00')

def _walk(n, fn):
    if isinstance(n, dict):
        fn(n)
        for v in n.values():
            _walk(v, fn)
    elif isinstance(n, list):
        for v in n:
            _walk(v, fn)

def _continuations(data):
    toks = []
    _walk(data, lambda n: toks.append(n['continuationCommand']['token']) if 'continuationCommand' in n and 'token' in n['continuationCommand'] else None)
    return toks

def _browse(key, ver, token):
    return json.loads(_get('https://www.youtube.com/youtubei/v1/browse?key=' + key + '&prettyPrint=false',
                           {'context': {'client': {'clientName': 'WEB', 'clientVersion': ver, 'hl': 'en', 'gl': 'US'}}, 'continuation': token}))

def channel_playlists():
    html = _get('https://www.youtube.com/channel/%s/playlists' % CHANNEL_ID)
    key, ver = _cfg(html)
    data = _initial(html)
    out, seen = [], set()
    def grab(n):
        if 'lockupViewModel' in n:
            l = n['lockupViewModel']
            if l.get('contentType') == 'LOCKUP_CONTENT_TYPE_PLAYLIST' and l.get('contentId') and l['contentId'] not in seen:
                t = (((l.get('metadata') or {}).get('lockupMetadataViewModel') or {}).get('title') or {}).get('content') or ''
                seen.add(l['contentId']); out.append({'id': l['contentId'], 'title': t.strip()})
        elif 'gridPlaylistRenderer' in n:
            g = n['gridPlaylistRenderer']
            if g.get('playlistId') and g['playlistId'] not in seen:
                seen.add(g['playlistId']); out.append({'id': g['playlistId'], 'title': ''.join(r.get('text', '') for r in g.get('title', {}).get('runs', [])).strip()})
    _walk(data, grab)
    toks, n = _continuations(data), 0
    while toks and key and n < 10:
        n += 1
        more = _browse(key, ver, toks[-1])
        _walk(more, grab)
        toks = _continuations(more)
    return out

def playlist_videos(pid):
    html = _get('https://www.youtube.com/playlist?list=' + pid)
    key, ver = _cfg(html)
    data = _initial(html)
    vids, seen = [], set()
    def secs(txt):
        m = re.search(r'"text":\s*"((?:\d+:)?\d{1,2}:\d{2})"', txt)
        if not m:
            return 0
        p = [int(x) for x in m.group(1).split(':')]
        return sum(v * 60 ** i for i, v in enumerate(reversed(p)))
    def grab(n):
        l = n.get('lockupViewModel')
        if l and l.get('contentType') == 'LOCKUP_CONTENT_TYPE_VIDEO' and l.get('contentId') and l['contentId'] not in seen:
            title = ((((l.get('metadata') or {}).get('lockupMetadataViewModel') or {}).get('title') or {}).get('content') or '').strip()
            if not title or title in ('[Private video]', '[Deleted video]'):
                return
            js = json.dumps(l)
            seen.add(l['contentId'])
            vids.append({'id': l['contentId'], 'title': title, 'length': secs(js), 'short': '"/shorts/' in js})
            return
        r = n.get('playlistVideoRenderer')
        if r and r.get('videoId') and r['videoId'] not in seen and r.get('isPlayable', True):
            t = r.get('title', {})
            title = t.get('simpleText') or ''.join(x.get('text', '') for x in t.get('runs', []))
            if title in ('[Private video]', '[Deleted video]'):
                return
            seen.add(r['videoId'])
            vids.append({'id': r['videoId'], 'title': title.strip(), 'length': int(r.get('lengthSeconds') or 0)})
    _walk(data, grab)
    toks, n = _continuations(data), 0
    while toks and key and n < 20:
        n += 1
        more = _browse(key, ver, toks[-1])
        _walk(more, grab)
        toks = _continuations(more)
    return vids

def is_short(vid, kind):
    if vid in kind:
        return kind[vid] == 'short'
    try:
        req = urllib.request.Request('https://www.youtube.com/shorts/' + vid, headers={'user-agent': UA, 'cookie': 'CONSENT=YES+1; SOCS=CAI'}, method='HEAD')
        class NoRedirect(urllib.request.HTTPRedirectHandler):
            def redirect_request(self, *a, **k):
                return None
        op = urllib.request.build_opener(NoRedirect, urllib.request.HTTPSHandler(context=_ctx()))
        try:
            code = op.open(req, timeout=15).status
        except urllib.error.HTTPError as e:
            code = e.code
    except Exception:
        return False                    # unknown: keep it, ask again next time
    kind[vid] = 'short' if code == 200 else 'video'
    return kind[vid] == 'short'

def refresh(force=False):
    old = json.loads(OUT.read_text()) if OUT.exists() else None
    if old and not force:
        try:
            age = datetime.datetime.now(datetime.timezone.utc) - datetime.datetime.fromisoformat(old['updated'])
            if age < datetime.timedelta(hours=REFRESH_HOURS):
                return False
        except Exception:
            pass
    try:
        lists = channel_playlists()
    except Exception as ex:
        print('playlists: channel page unavailable (%s) — kept the previous list' % ex)
        return False
    if not lists:
        print('playlists: none found — kept the previous list')
        return False
    shorts = set(json.loads(SHORTS.read_text())) if SHORTS.exists() else set()
    kind = json.loads(KIND.read_text()) if KIND.exists() else {}
    for s in shorts:
        kind[s] = 'short'
    prev = {p['id']: p for p in (old or {}).get('playlists', [])}
    out = []
    for pl in lists:
        try:
            vids = playlist_videos(pl['id'])
        except Exception as ex:
            print('playlists: %s unavailable (%s) — kept its previous videos' % (pl['title'], ex))
            if pl['id'] in prev:
                out.append(prev[pl['id']])
            continue
        for v in vids:
            if v.pop('short', False):
                kind[v['id']] = 'short'
        keep = [v for v in vids if not (v['id'] in shorts or kind.get(v['id']) == 'short' or (v['length'] <= 180 and is_short(v['id'], kind)))]
        if keep:
            out.append({'id': pl['id'], 'title': pl['title'], 'count': len(keep), 'videos': keep})
    new_shorts = {k for k, v in kind.items() if v == 'short'} - shorts
    if new_shorts:
        SHORTS.write_text(json.dumps(sorted(shorts | new_shorts), indent=1) + '\n')
    KIND.write_text(json.dumps(dict(sorted(kind.items())), indent=0) + '\n')
    data = {'updated': datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat(), 'playlists': out}
    if old and old.get('playlists') == out:
        return False                    # nothing changed: leave the file (and its date) alone, no needless commits
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n')
    print('playlists: %d playlists, %d videos' % (len(out), sum(p['count'] for p in out)))
    return True

if __name__ == '__main__':
    import sys
    refresh(force='--force' in sys.argv)
