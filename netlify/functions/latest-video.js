// netlify/functions/latest-video.js
//
// Latest sermon/message for the "Watch & grow" block (Home, About).
// Replaces the browser-side third-party bridge (api.rss2json.com, audit A-12):
// the YouTube RSS feed is read server-side and returned as ONE atomic object,
// so title, thumbnail and link can never come from different videos.
//
// GET /.netlify/functions/latest-video  ->  { ok, id, title, url, thumb, published }
// Cached at the CDN for 15 minutes; on any failure the page keeps its static fallback.

const CHANNEL_ID = 'UCr3gSJPBQDjN8CEbj86Pyug';
const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

function decode(s) {
  return String(s || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&');
}

exports.handler = async () => {
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'public, max-age=300',
    'netlify-cdn-cache-control': 'public, s-maxage=900, stale-while-revalidate=3600',
  };
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const r = await fetch(FEED, { signal: ctrl.signal, headers: { 'user-agent': 'mfmmegaregion2usa.org latest-video' } });
    clearTimeout(timer);
    if (!r.ok) throw new Error('feed ' + r.status);
    const xml = await r.text();
    // Newest *watchable* message: skip scheduled/unaired streams (0 views) and #shorts clips.
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]);
    const watchable = (e) => {
      const views = +((e.match(/<media:statistics views="(\d+)"/) || [])[1] || 0);
      const title = (e.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
      return views > 0 && !/#shorts/i.test(title);
    };
    const entry = entries.find(watchable) || entries[0];
    if (!entry) throw new Error('no entry');
    const id = (entry.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/) || [])[1];
    const title = decode((entry.match(/<title>([\s\S]*?)<\/title>/) || [])[1]).trim();
    const published = (entry.match(/<published>([^<]+)<\/published>/) || [])[1] || '';
    if (!id || !title) throw new Error('incomplete entry');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true, id, title, published,
        url: `https://www.youtube.com/watch?v=${id}`,
        thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      }),
    };
  } catch (e) {
    return { statusCode: 502, headers: { ...headers, 'cache-control': 'no-store' }, body: JSON.stringify({ ok: false }) };
  }
};
