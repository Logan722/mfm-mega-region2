// netlify/functions/live-status.js
//
// "Live now" for the website (owner request, Oct 14 2026): is Mega Region 2 or Pastor Olumide Oni
// streaming on YouTube right now?
//
// GET /.netlify/functions/live-status  ->  { ok, live:[{ key, name, channel, id, title, url, watching }] }
//
// No API key: each channel's public /live page is read server-side. A stream counts as live only when
// YouTube shows it as "watching now" (a scheduled/upcoming stream shows "waiting" and is ignored).
// Cached at the CDN for 60 seconds so YouTube is asked at most about once a minute, whatever the traffic.
// Any failure -> { ok:false } and the site simply shows nothing.
// Same-name streams on both channels -> only the Mega Region 2 one is returned (see dedupe below).

const CHANNELS = [
  { key: 'mfm', name: 'MFM Mega Region 2 USA', channel: 'UCr3gSJPBQDjN8CEbj86Pyug', handle: '@mfmmegaregion2usa' },
  { key: 'pastor', name: 'Pastor Olumide Oni', channel: 'UCoVS2R6n3ewcIvSb_OzLLQg', handle: '@pastorolumideoni' },
];

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

function decode(s) {
  return String(s || '')
    .replace(/\\u0026/g, '&').replace(/\\u003c/g, '<').replace(/\\u003e/g, '>').replace(/\\"/g, '"').replace(/\\\//g, '/')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&');
}

// Exported for tests: decide from a /live page's HTML whether the channel is streaming now.
function parseLivePage(html, channelId) {
  if (!html) return null;
  // the view-count block of the main video: {"viewCount":{"runs":[{"text":"4"},{"text":" watching now"}]},"isLive":true ...
  const vc = html.match(/"videoViewCountRenderer":\{"viewCount":\{"runs":\[(.*?)\]\}[^{}]*?"isLive":true/);
  const pr = html.match(/"videoDetails":\{"videoId":"([\w-]{11})"[^]*?"isLive":true/);
  const liveByCount = !!(vc && /watching/i.test(vc[1]));
  const upcoming = /"isUpcoming":true/.test(html) && !liveByCount;
  if (!(liveByCount || (pr && !upcoming))) return null;
  const id = (html.match(/"currentVideoEndpoint":\{[^]*?"watchEndpoint":\{"videoId":"([\w-]{11})"/) || [])[1]
    || (html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})"/) || [])[1]
    || (pr && pr[1]);
  if (!id) return null;
  // make sure the page is really this channel's stream (not a recommendation)
  if (channelId && html.indexOf(channelId) === -1) return null;
  const title = decode((html.match(/"videoPrimaryInfoRenderer":\{"title":\{"runs":\[\{"text":"((?:[^"\\]|\\.)*)"/) || [])[1]
    || (html.match(/<meta name="title" content="([^"]*)"/) || [])[1] || '').trim();
  const watching = vc ? +((vc[1].match(/"text":"([\d,]+)"/) || [])[1] || '0').replace(/,/g, '') : 0;
  return { id, title, watching };
}

async function check(ch) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 7000);
  try {
    const r = await fetch(`https://www.youtube.com/channel/${ch.channel}/live`, {
      signal: ctrl.signal,
      headers: { 'user-agent': UA, 'accept-language': 'en-US,en;q=0.9', cookie: 'CONSENT=YES+1; SOCS=CAI' },
    });
    if (!r.ok) return null;
    const hit = parseLivePage(await r.text(), ch.channel);
    if (!hit) return null;
    return { key: ch.key, name: ch.name, channel: ch.channel, id: hit.id, title: hit.title, watching: hit.watching,
             url: `https://www.youtube.com/watch?v=${hit.id}` };
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}


// Owner rule (Oct 20 2026): when Pastor Olumide Oni's channel carries a stream with the same name as one on the
// MFM Mega Region 2 channel (the same service simulcast on both), show only the Mega Region 2 stream.
function sameName(a, b) {
  const n = (t) => String(t || '').toLowerCase().replace(/^\W*live\W+/, '').replace(/[^a-z0-9]+/g, '');
  return !!n(a) && n(a) === n(b);
}
function dedupe(live) {
  const mfm = live.filter((s) => s.key === 'mfm');
  return live.filter((s) => s.key === 'mfm' || !mfm.some((m) => sameName(m.title, s.title)));
}
exports.dedupe = dedupe;
exports.parseLivePage = parseLivePage;
exports.CHANNELS = CHANNELS;
exports.handler = async () => {
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'public, max-age=30',
    'netlify-cdn-cache-control': 'public, s-maxage=60, stale-while-revalidate=60',
  };
  try {
    const results = await Promise.all(CHANNELS.map(check));
    const live = dedupe(results.filter(Boolean));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, live }) };
  } catch (e) {
    return { statusCode: 200, headers: { ...headers, 'cache-control': 'no-store' }, body: JSON.stringify({ ok: false, live: [] }) };
  }
};
