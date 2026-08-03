import { getStore } from '@netlify/blobs';

const GRAPH  = 'https://graph.instagram.com';
const FIELDS = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp';
const LIMIT  = 12;

// Prefer the auto-refreshed token in Blobs; seed it from the env var on first run.
async function getToken() {
  try {
    const store = getStore('instagram');
    let t = await store.get('token');
    if (!t && process.env.IG_ACCESS_TOKEN) {
      t = process.env.IG_ACCESS_TOKEN;
      await store.set('token', t);
    }
    if (t) return t;
  } catch (e) { /* Blobs unavailable — fall back to env var */ }
  return process.env.IG_ACCESS_TOKEN || '';
}

const json = (body, maxAge) => new Response(JSON.stringify(body), {
  status: 200,
  headers: Object.assign(
    { 'content-type': 'application/json' },
    maxAge ? { 'cache-control': `public, max-age=600, s-maxage=${maxAge}` } : {}
  )
});

export default async () => {
  const token = await getToken();
  if (!token) return json({ error: 'not_configured', items: [] });
  try {
    const url = `${GRAPH}/me/media?fields=${FIELDS}&limit=${LIMIT}&access_token=${encodeURIComponent(token)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok || data.error) return json({ error: (data.error && data.error.message) || 'api_error', items: [] });
    const items = (data.data || []).map((m) => ({
      id: m.id,
      caption: m.caption || '',
      type: m.media_type,
      image: m.media_type === 'VIDEO' ? (m.thumbnail_url || m.media_url) : m.media_url,
      permalink: m.permalink,
      timestamp: m.timestamp
    }));
    return json({ items }, 1800);
  } catch (e) {
    return json({ error: 'fetch_failed', items: [] });
  }
};
