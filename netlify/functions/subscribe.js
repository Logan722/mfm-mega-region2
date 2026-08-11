// netlify/functions/subscribe.js
//
// Public subscribe endpoint used by every form on the site (footer, popup,
// full card). POSTs the visitor's data to Brevo's contacts API, then fires
// a transactional welcome email if the contact is new.
//
// Called from the browser via fetch("/.netlify/functions/subscribe", {POST})
//
// Env vars required:
//   BREVO_API_KEY   — full-access Brevo key (already set in Netlify)
//
// Config:
//   LIST_ID         — 3 (MFM Newsletter — Main)
//   SENDER          — MFM Mega Region 2 <newsletter@mfmmegaregion2usa.org>

const BREVO_BASE = 'https://api.brevo.com/v3';
const LIST_ID = 3;

const SENDER = {
  name: 'MFM Mega Region 2',
  email: 'newsletter@mfmmegaregion2usa.org',
};

const ALLOWED_ORIGINS = [
  'https://mfmmegaregion2usa.org',
  'https://www.mfmmegaregion2usa.org',
  'https://mfmmegaregion2usa.netlify.app',
];

const CORS = (origin) => ({
  'content-type': 'application/json',
  'cache-control': 'no-store',
  'access-control-allow-origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'Content-Type',
  'vary': 'Origin',
});

function respond(statusCode, obj, origin) {
  return {
    statusCode,
    headers: CORS(origin),
    body: JSON.stringify(obj),
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || '';

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS(origin), body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return respond(405, { error: 'method_not_allowed' }, origin);
  }
  if (!process.env.BREVO_API_KEY) {
    return respond(500, { error: 'server_misconfigured' }, origin);
  }

  // Parse body
  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return respond(400, { ok: false, error: 'invalid_json' }, origin);
  }

  // Honeypot — bots fill hidden fields, humans don't
  if (payload.hp_website && String(payload.hp_website).trim() !== '') {
    // Pretend success so bots don't retry
    return respond(200, { ok: true, silent: true }, origin);
  }

  const email = String(payload.EMAIL || payload.email || '').trim().toLowerCase();
  const firstName = String(payload.FIRSTNAME || payload.firstName || '').trim();
  const country = String(payload.COUNTRY || payload.country || '').trim();
  const source = String(payload.source || 'website').trim().slice(0, 40);

  if (!email || !EMAIL_RE.test(email)) {
    return respond(400, { ok: false, error: 'invalid_email' }, origin);
  }

  // 1. Add contact to Brevo. updateEnabled:false means duplicates are rejected
  //    by the API — which is exactly the behavior Dawn wants: DB record stays
  //    intact, second submit doesn't overwrite anything.
  const contactBody = {
    email,
    listIds: [LIST_ID],
    updateEnabled: false,
    attributes: {},
  };
  if (firstName) contactBody.attributes.FIRSTNAME = firstName;
  if (country) contactBody.attributes.COUNTRY = country;
  if (source) contactBody.attributes.SIGNUP_SOURCE = source;

  let brevoRes, brevoData;
  try {
    brevoRes = await fetch(`${BREVO_BASE}/contacts`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify(contactBody),
    });
    const text = await brevoRes.text();
    try { brevoData = JSON.parse(text); } catch { brevoData = { raw: text }; }
  } catch (e) {
    return respond(502, { ok: false, error: 'upstream_unreachable' }, origin);
  }

  // 201 = created new contact. Send welcome.
  // 400 with duplicate_parameter usually = already exists → treat as success, no welcome.
  const alreadyExists =
    brevoRes.status === 400 &&
    (brevoData?.code === 'duplicate_parameter' ||
      /already (exists|associated)/i.test(brevoData?.message || ''));

  if (brevoRes.status !== 201 && !alreadyExists) {
    return respond(502, {
      ok: false,
      error: 'brevo_error',
      brevoStatus: brevoRes.status,
      brevoMessage: brevoData?.message || 'Unknown Brevo error',
    }, origin);
  }

  // 2. Send welcome email (transactional — separate quota from marketing).
  //    Skip if contact already existed — they already got it.
  if (!alreadyExists) {
    try {
      await fetch(`${BREVO_BASE}/smtp/email`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
        },
        body: JSON.stringify(buildWelcomeEmail(email, firstName)),
      });
      // Ignore failures here — the subscribe itself succeeded, welcome is
      // best-effort. Brevo dashboard shows the delivery log.
    } catch (_) { /* noop */ }
  }

  return respond(200, {
    ok: true,
    status: alreadyExists ? 'already_subscribed' : 'subscribed',
    email,
  }, origin);
};

function buildWelcomeEmail(to, firstName) {
  const name = firstName || 'friend';
  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0f1a30;font-family:-apple-system,'Inter Tight',Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f1a30;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
  <tr><td style="background:#c9952c;height:4px;line-height:4px;font-size:0;">&nbsp;</td></tr>
  <tr><td style="background:#142240;padding:40px 40px 32px;text-align:center;">
    <div style="font-family:Georgia,serif;font-size:12px;letter-spacing:.32em;text-transform:uppercase;color:#c9952c;">MFM Mega Region 2 &middot; USA</div>
  </td></tr>
  <tr><td style="background:#142240;padding:0 40px 44px;text-align:center;">
    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:400;font-size:30px;line-height:1.15;color:#f0e6d0;">Welcome to the family.</h1>
    <p style="margin:0;font-family:'Inter Tight',sans-serif;font-size:15px;line-height:1.6;color:#8899b8;">Grace and peace to you, ${escapeHtml(name)}.</p>
  </td></tr>
  <tr><td style="background:#ffffff;padding:44px 40px 32px;">
    <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#5a6270;">You've just joined Mountain of Fire and Miracles Ministries, Mega Region 2, in the USA. We're glad you did.</p>
    <p style="margin:0 0 8px;font-size:14px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#c9952c;">Here's what to expect</p>
    <ul style="margin:0 0 24px;padding-left:20px;font-size:15px;line-height:1.7;color:#5a6270;">
      <li>One newsletter each month — sermons, prayer points, testimonies, the next crusade near you.</li>
      <li>One-off notes only when something big is coming.</li>
      <li>No spam. No shared lists. Ever.</li>
    </ul>
    <div style="background:#f8f6f1;border-left:3px solid #c9952c;padding:16px 20px;margin:0 0 24px;">
      <p style="margin:0 0 8px;font-family:Georgia,serif;font-style:italic;font-size:15px;line-height:1.55;color:#8b6f33;">"But upon mount Zion shall be deliverance, and there shall be holiness; and the house of Jacob shall possess their possessions."</p>
      <p style="margin:0;font-size:13px;color:#8a8f98;">&mdash; Obadiah 1:17</p>
    </div>
    <p style="margin:0 0 12px;font-size:14px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#c9952c;">Three things you can do next</p>
    <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:#5a6270;"><strong style="color:#142240;">1.</strong> <a href="https://www.mfmmegaregion2usa.org/branches.html" style="color:#c9952c;text-decoration:underline;">Find the branch nearest you</a>.</p>
    <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:#5a6270;"><strong style="color:#142240;">2.</strong> Watch this week's live prayer &mdash; <a href="https://youtube.com/@mfmmegaregion2usa" style="color:#c9952c;text-decoration:underline;">Healing &amp; Deliverance Hour, Tuesdays 7 PM CT / 8 PM ET</a>.</p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#5a6270;"><strong style="color:#142240;">3.</strong> Save <strong>newsletter@mfmmegaregion2usa.org</strong> to your contacts so future issues land in your inbox, not Promotions.</p>
    <p style="margin:0;font-size:15px;line-height:1.7;color:#5a6270;">We're praying with you and for you.</p>
    <p style="margin:20px 0 0;font-family:Georgia,serif;font-size:15px;color:#142240;"><strong>Pastor Olumide Oni</strong><br/>
    <span style="font-family:'Inter Tight',sans-serif;font-size:13px;color:#8a8f98;">Principal Regional Overseer &middot; Mega Region 2 USA</span></p>
  </td></tr>
  <tr><td style="background:#0f1a30;padding:24px 40px;text-align:center;">
    <p style="margin:0;font-size:12px;line-height:1.6;color:#6a7a96;">MFM USA Prayer City &middot; 10000 Kleckley Dr &middot; Houston, TX 77075<br/>
    <a href="https://www.mfmmegaregion2usa.org" style="color:#c9952c;text-decoration:none;">mfmmegaregion2usa.org</a> &middot;
    <a href="https://www.mfmmegaregion2usa.org/privacy.html" style="color:#8899b8;text-decoration:underline;">Privacy Policy</a></p>
    <p style="margin:14px 0 0;font-family:Georgia,serif;font-style:italic;font-size:12px;color:#3a4a68;">"Is not my word like as a fire?" &mdash; Jeremiah 23:29</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

  const text = `Welcome to the MFM Mega Region 2 family.

Grace and peace to you, ${name}.

You've just joined Mountain of Fire and Miracles Ministries,
Mega Region 2, in the USA. We're glad you did.

Here's what to expect:
- One newsletter each month.
- One-off notes when something big is coming.
- No spam. No shared lists. Ever.

"But upon mount Zion shall be deliverance, and there shall be
holiness; and the house of Jacob shall possess their possessions."
— Obadiah 1:17

Three things you can do next:
1. Find the branch nearest you: https://www.mfmmegaregion2usa.org/branches.html
2. Watch Healing & Deliverance Hour, Tuesdays 7 PM CT / 8 PM ET:
   https://youtube.com/@mfmmegaregion2usa
3. Save newsletter@mfmmegaregion2usa.org to your contacts.

We're praying with you and for you.

Pastor Olumide Oni
Principal Regional Overseer, Mega Region 2 USA

—
MFM USA Prayer City · 10000 Kleckley Dr · Houston, TX 77075
mfmmegaregion2usa.org
Privacy: https://www.mfmmegaregion2usa.org/privacy.html

"Is not my word like as a fire?" — Jeremiah 23:29
`;

  return {
    sender: SENDER,
    to: [{ email: to, name: name === 'friend' ? undefined : name }],
    subject: 'Welcome to the MFM Mega Region 2 family',
    htmlContent: html,
    textContent: text,
    replyTo: SENDER,
    tags: ['welcome'],
  };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}
