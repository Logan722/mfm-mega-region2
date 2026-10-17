// netlify/functions/video-search.js
//
// Media page search (owner request, Oct 16 2026): when a visitor searches, also look through the whole
// MFM Mega Region 2 YouTube channel, not only the videos baked into the page.
//
// GET /.netlify/functions/video-search?q=deliverance
//   -> { ok, q, items:[{ id, title, when, length, live }] }   (newest-first as YouTube ranks them, max 24)
//
// No API key: the channel's public search page (youtube.com/channel/<id>/search?query=) is read server-side
// and its video list extracted. #shorts and hashtag clips are left out (same rule as the Media page).
// Each query is CDN-cached for an hour. Any failure -> { ok:false, items:[] } and the page shows its own results.

const CHANNEL_ID = 'UCr3gSJPBQDjN8CEbj86Pyug';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

function text(t) {
  if (!t) return '';
  if (t.simpleText) return t.simpleText;
  return (t.runs || []).map((r) => r.text || '').join('');
}

function collect(node, out) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach((n) => collect(n, out)); return; }
  if (node.videoRenderer && node.videoRenderer.videoId) {
    const v = node.videoRenderer;
    out.push({
      id: v.videoId,
      title: text(v.title).trim(),
      when: text(v.publishedTimeText),
      length: text(v.lengthText),
      live: (v.badges || []).some((b) => /LIVE/i.test(JSON.stringify(b))),
    });
    return;
  }
  for (const k in node) collect(node[k], out);
}

// Exported for tests: pull the channel's videos out of a search results page.
function parseSearch(html) {
  const m = html && html.match(/var ytInitialData\s*=\s*(\{[\s\S]*?\});<\/script>/);
  if (!m) return null;
  let data;
  try { data = JSON.parse(m[1]); } catch (e) { return null; }
  const out = [];
  collect(data, out);
  const seen = {};
  return out.filter((v) => {
    if (seen[v.id] || !v.title || v.title.indexOf('#') >= 0) return false;
    seen[v.id] = 1;
    return true;
  }).slice(0, 24);
}

exports.parseSearch = parseSearch;
exports.handler = async (event) => {
  const q = String(((event && event.queryStringParameters) || {}).q || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'public, max-age=600',
    'netlify-cdn-cache-control': 'public, s-maxage=3600, stale-while-revalidate=600',
  };
  if (q.length < 2) return { statusCode: 200, headers, body: JSON.stringify({ ok: true, q, items: [] }) };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(`https://www.youtube.com/channel/${CHANNEL_ID}/search?query=${encodeURIComponent(q)}`, {
      signal: ctrl.signal,
      headers: { 'user-agent': UA, 'accept-language': 'en-US,en;q=0.9', cookie: 'CONSENT=YES+1; SOCS=CAI' },
    });
    if (!r.ok) throw new Error('search ' + r.status);
    const items = parseSearch(await r.text());
    if (!items) throw new Error('unreadable');
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, q, items }) };
  } catch (e) {
    return { statusCode: 200, headers: { ...headers, 'cache-control': 'no-store', 'netlify-cdn-cache-control': 'no-store' }, body: JSON.stringify({ ok: false, q, items: [] }) };
  } finally {
    clearTimeout(timer);
  }
};
