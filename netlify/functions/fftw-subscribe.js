// netlify/functions/fftw-subscribe.js
// Handles Fire for the Week weekly subscription signups.
// Adds contact to Brevo list for weekly delivery + fires welcome email with current PDF.
exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'method_not_allowed' }) };

  let payload;
  try { payload = JSON.parse(event.body || '{}'); } catch (e) { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'invalid_json' }) }; }

  const email = (payload.email || '').trim().toLowerCase();
  const name = (payload.name || '').trim();
  const source = payload.source || 'fftw';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'invalid_email' }) };
  }

  const BREVO_KEY = process.env.BREVO_API_KEY;
  const FFTW_LIST_ID = parseInt(process.env.FFTW_LIST_ID || '16', 10); // Fire for the Week · Weekly
  const MAIN_LIST_ID = 3;
  if (!BREVO_KEY) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'brevo_key_missing' }) };
  }

  const firstName = name ? (name.split(' ')[0]) : '';

  // 1. Create or update contact in Brevo
  try {
    const r = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'api-key': BREVO_KEY, 'Content-Type': 'application/json', 'accept': 'application/json' },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: firstName, SIGNUP_SOURCE: source },
        listIds: [MAIN_LIST_ID, FFTW_LIST_ID],
        updateEnabled: true,
      }),
    });
    if (!r.ok && r.status !== 204 && r.status !== 201) {
      const txt = await r.text();
      console.error('Brevo contact create failed:', r.status, txt);
    }
  } catch (e) {
    console.error('Brevo contact error:', e);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'contact_create_failed' }) };
  }

  // 2. Send welcome email with link to this week's PDF
  try {
    const welcomeHtml = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f8f6f1;font-family:-apple-system,'Inter Tight',Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f6f1;"><tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e8e4da;">
  <tr><td style="background:#142240;padding:32px;text-align:center;">
    <div style="font-family:Georgia,serif;font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:#c9952c;font-weight:600;margin-bottom:10px;">Welcome to Fire for the Week</div>
    <h1 style="margin:0;font-family:Georgia,serif;font-weight:500;font-size:26px;line-height:1.3;color:#f0e6d0;">Your first set is below.</h1>
  </td></tr>
  <tr><td style="padding:28px 32px;">
    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#3a3f4a;">${firstName ? `Hi ${firstName},` : 'Beloved,'}</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#3a3f4a;">Thank you for signing up. Every Monday from now on, you'll get a new one-page set of MFM prayer points to pray through the week — rotating themes, scripture, and prayers in our signature declarative style.</p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#3a3f4a;">Here is this week's edition to get you started:</p>
    <p style="margin:20px 0;text-align:center;">
      <a href="https://www.mfmmegaregion2usa.org/files/fire-for-the-week.pdf" style="display:inline-block;background:#e85d26;color:#ffffff;font-size:14px;font-weight:700;letter-spacing:.06em;text-decoration:none;padding:14px 28px;border-radius:4px;">📄 DOWNLOAD THIS WEEK'S PDF</a>
    </p>
    <p style="margin:20px 0 0;font-size:14px;line-height:1.7;color:#5a5f6a;font-style:italic;">You can also view it in your browser at <a href="https://www.mfmmegaregion2usa.org/fire-for-the-week" style="color:#c9952c;">mfmmegaregion2usa.org/fire-for-the-week</a>.</p>
    <p style="margin:0 0 6px;margin-top:22px;font-size:15px;line-height:1.7;color:#3a3f4a;">Grace and peace,</p>
    <p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:16px;color:#8b6f33;">MFM Mega Region 2 USA</p>
  </td></tr>
  <tr><td style="background:#142240;padding:24px 32px;text-align:center;font-size:11px;color:#8a95a8;">
    <p style="margin:0;">MFM Mega Region 2 USA · 10000 Kleckley Dr, Houston, TX 77075</p>
  </td></tr>
</table></td></tr></table></body></html>`;
    const sr = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': BREVO_KEY, 'Content-Type': 'application/json', 'accept': 'application/json' },
      body: JSON.stringify({
        subject: 'Welcome to Fire for the Week — here is your first set',
        htmlContent: welcomeHtml,
        sender: { name: 'MFM Mega Region 2', email: 'newsletter@mfmmegaregion2usa.org' },
        to: [{ email, name: firstName || undefined }],
        tags: ['fftw-welcome'],
      }),
    });
    if (!sr.ok) console.error('Brevo send failed:', sr.status, await sr.text());
  } catch (e) { console.error('send error:', e); }

  return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
};
