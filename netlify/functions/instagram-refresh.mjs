import { getStore } from '@netlify/blobs';

// Runs on a schedule; keeps the long-lived Instagram token alive.
export const config = { schedule: '@weekly' };

export default async () => {
  const store = getStore('instagram');
  let token = await store.get('token');
  if (!token) token = process.env.IG_ACCESS_TOKEN || '';
  if (!token) return new Response('no token to refresh', { status: 200 });

  const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`;
  try {
    const res  = await fetch(url);
    const data = await res.json();
    if (res.ok && data.access_token) {
      await store.set('token', data.access_token);
      await store.set('refreshed_at', new Date().toISOString());
      return new Response('token refreshed', { status: 200 });
    }
    return new Response('refresh failed: ' + JSON.stringify(data), { status: 200 });
  } catch (e) {
    return new Response('refresh error: ' + e.message, { status: 200 });
  }
};
