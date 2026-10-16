// netlify/functions/latest-video.js
//
// Latest sermon/message for the "Watch & grow" block (Home, About).
// Replaces the browser-side third-party bridge (api.rss2json.com, audit A-12):
// the YouTube RSS feed is read server-side and returned as ONE atomic object,
// so title, thumbnail and link can never come from different videos.
//
// GET /.netlify/functions/latest-video         ->  { ok, id, title, url, thumb, published }
// GET /.netlify/functions/latest-video?list=1  ->  { ok, items:[{id,title,published,views}] }  (Media page live sync)
// GET /.netlify/functions/latest-video?live=1  ->  same shape, from the channel's Live tab (past live streams; /live page)
// Cached at the CDN for 5 minutes; on any failure the page keeps its static fallback.

const CHANNEL_ID = 'UCr3gSJPBQDjN8CEbj86Pyug';
const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const LIVE_FEED = `https://www.youtube.com/feeds/videos.xml?playlist_id=UULV${CHANNEL_ID.slice(2)}`;

function decode(s) {
  return String(s || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&');
}

exports.handler = async (event) => {
  const q = (event && event.queryStringParameters) || {};
  const wantLive = !!q.live;
  const wantList = !!q.list || wantLive;
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    // Fresh within ~5 minutes of a new upload (Oct 16 2026): short browser cache, short CDN cache, and only a
    // brief stale window (a quiet site would otherwise keep serving an hour-old copy to the first visitor).
    'cache-control': 'public, max-age=60',
    'netlify-cdn-cache-control': 'public, s-maxage=300, stale-while-revalidate=60',
  };
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const r = await fetch(wantLive ? LIVE_FEED : FEED, { signal: ctrl.signal, headers: { 'user-agent': 'mfmmegaregion2usa.org latest-video' } });
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
    if (wantList) {
      // Media page live sync: every recent upload, newest first (the page applies its own filters).
      const items = entries.map((e) => ({
        id: (e.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/) || [])[1],
        title: decode((e.match(/<title>([\s\S]*?)<\/title>/) || [])[1]).trim(),
        published: (e.match(/<published>([^<]+)<\/published>/) || [])[1] || '',
        views: +((e.match(/<media:statistics views="(\d+)"/) || [])[1] || 0),
      })).filter((i) => i.id && i.title);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, items }) };
    }
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
