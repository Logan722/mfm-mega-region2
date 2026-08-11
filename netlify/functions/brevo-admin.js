// netlify/functions/brevo-admin.js
//
// Admin-gated proxy to the Brevo REST API.
// Used by Claude sessions to run setup + ongoing newsletter operations
// (senders, domain auth, lists, campaigns, automations, stats).
//
// Auth: requires header `X-Admin-Token: <ADMIN_TOKEN env var>`.
// Secrets: BREVO_API_KEY and ADMIN_TOKEN must be set as Netlify env vars.
// Neither is ever sent to the client — this function is server-side only.
//
// Usage (POST):
//   headers: { "X-Admin-Token": "<token>", "Content-Type": "application/json" }
//   body:    { "method": "GET|POST|PUT|DELETE", "path": "/senders", "body": {...} }
//
// Returns: { brevoStatus, brevoOk, data }

const BREVO_BASE = 'https://api.brevo.com/v3';

const JSON_HEADERS = {
  'content-type': 'application/json',
  'cache-control': 'no-store',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'Content-Type, X-Admin-Token',
};

function respond(statusCode, obj) {
  return {
    statusCode,
    headers: JSON_HEADERS,
    body: JSON.stringify(obj),
  };
}

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: JSON_HEADERS, body: '' };
  }

  // Method guard — only POST is allowed
  if (event.httpMethod !== 'POST') {
    return respond(405, { error: 'method_not_allowed', hint: 'POST only' });
  }

  // Auth guard — constant-time compare on the shared admin token
  const provided =
    event.headers['x-admin-token'] ||
    event.headers['X-Admin-Token'] ||
    '';
  const expected = process.env.ADMIN_TOKEN || '';
  if (
    !expected ||
    provided.length !== expected.length ||
    !safeCompare(provided, expected)
  ) {
    return respond(401, { error: 'unauthorized' });
  }

  // Env sanity
  if (!process.env.BREVO_API_KEY) {
    return respond(500, {
      error: 'brevo_api_key_missing',
      hint: 'Set BREVO_API_KEY in Netlify environment variables.',
    });
  }

  // Parse body
  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return respond(400, { error: 'invalid_json', detail: String(e.message || e) });
  }

  const method = (payload.method || 'GET').toUpperCase();
  const path = payload.path;
  const brevoBody = payload.body;

  // Convenience: ping — verifies auth + connection to Brevo without making changes.
  if (payload.action === 'ping' || path === '/ping') {
    try {
      const r = await fetch(`${BREVO_BASE}/account`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'api-key': process.env.BREVO_API_KEY,
        },
      });
      const data = await r.json().catch(() => ({}));
      return respond(200, {
        pong: true,
        brevoStatus: r.status,
        brevoOk: r.ok,
        account: {
          email: data.email,
          companyName: data.companyName,
          plan: data.plan,
        },
      });
    } catch (e) {
      return respond(502, { error: 'brevo_unreachable', detail: String(e.message || e) });
    }
  }

  // Convenience: youtube-latest — fetch latest video from a YouTube channel RSS.
  if (payload.action === 'youtube-latest' || path === '/youtube-latest') {
    const channelId = payload.channelId || 'UCr3gSJPBQDjN8CEbj86Pyug';
    try {
      const rss = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
      const xml = await rss.text();
      const entryMatch = xml.match(/<entry>([\s\S]*?)<\/entry>/);
      if (!entryMatch) {
        return respond(200, { ok: false, error: 'no_entries' });
      }
      const entry = entryMatch[1];
      const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
      const authorMatch = entry.match(/<author>[\s\S]*?<name>([^<]+)<\/name>/);
      const videoId = videoIdMatch ? videoIdMatch[1] : '';
      const rawTitle = titleMatch ? titleMatch[1].trim() : '';
      const title = rawTitle.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      return respond(200, {
        ok: true,
        latest: {
          videoId,
          title,
          publishedAt: publishedMatch ? publishedMatch[1] : '',
          author: authorMatch ? authorMatch[1] : '',
          videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
          shortUrl: `https://youtu.be/${videoId}`,
          thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        },
      });
    } catch (e) {
      return respond(502, { ok: false, error: 'youtube_unreachable', detail: String(e.message || e) });
    }
  }

  // Path validation
  if (typeof path !== 'string' || !path.startsWith('/')) {
    return respond(400, {
      error: 'invalid_path',
      hint: 'body.path must start with "/", e.g. "/senders"',
    });
  }

  const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  if (!allowedMethods.includes(method)) {
    return respond(400, {
      error: 'invalid_method',
      hint: `body.method must be one of ${allowedMethods.join(', ')}`,
    });
  }

  // Forward to Brevo
  const url = `${BREVO_BASE}${path}`;
  const init = {
    method,
    headers: {
      accept: 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
  };
  if (['POST', 'PUT', 'PATCH'].includes(method) && brevoBody !== undefined) {
    init.headers['content-type'] = 'application/json';
    init.body = JSON.stringify(brevoBody);
  }

  let brevoRes;
  try {
    brevoRes = await fetch(url, init);
  } catch (e) {
    return respond(502, {
      error: 'brevo_unreachable',
      detail: String(e.message || e),
    });
  }

  const text = await brevoRes.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  return respond(200, {
    brevoStatus: brevoRes.status,
    brevoOk: brevoRes.ok,
    data,
  });
};

function safeCompare(a, b) {
  // Constant-time string comparison. Both strings must be equal length.
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}
