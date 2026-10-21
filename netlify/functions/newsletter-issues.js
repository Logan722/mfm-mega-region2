// netlify/functions/newsletter-issues.js
//
// Newsletter page auto-update (owner request, Oct 21 2026): when an issue goes out, /newsletter should show it
// as the latest issue without anyone editing the page.
//
// GET /.netlify/functions/newsletter-issues  ->  { ok, sent:[{ issue, sent }] }   (newest first)
//
// Reads the SENT email campaigns from Brevo server-side (BREVO_API_KEY, Netlify env var - never sent to the
// browser) and works out which newsletter issue each one was. Only the issue numbers and send dates are
// returned: no subscriber data, no campaign content.
//   Issue number: "Issue #4" / "Issue 4" / "#04" in the campaign name or subject; otherwise the
//   /newsletter/issue-N mirror link used most in the email itself.
// Used by tools/build_site.py (every 30 min via the YouTube sync action) and by /newsletter in the browser.
// CDN-cached 5 minutes. Any failure -> { ok:false, sent:[] } and the page keeps what it already shows.

const BREVO = 'https://api.brevo.com/v3';

function issueFromText(t) {
  const s = String(t || '');
  const m = s.match(/issue\s*(?:no\.?|number)?\s*#?\s*0*(\d{1,3})\b/i) || s.match(/#\s*0*(\d{1,3})\b/);
  return m ? +m[1] : 0;
}

function issueFromHtml(html) {
  const counts = {};
  for (const m of String(html || '').matchAll(/newsletter(?:\/|%2F)issue-(\d{1,3})/gi)) counts[m[1]] = (counts[m[1]] || 0) + 1;
  let best = 0, n = 0;
  for (const k in counts) if (counts[k] > n) { n = counts[k]; best = +k; }
  return best;
}

async function brevo(path) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(BREVO + path, { signal: ctrl.signal, headers: { 'api-key': process.env.BREVO_API_KEY, accept: 'application/json' } });
    if (!r.ok) throw new Error('brevo ' + r.status);
    return await r.json();
  } finally {
    clearTimeout(timer);
  }
}

exports.issueFromText = issueFromText;
exports.issueFromHtml = issueFromHtml;
exports.handler = async () => {
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'public, max-age=120',
    'netlify-cdn-cache-control': 'public, s-maxage=300, stale-while-revalidate=120',
  };
  try {
    if (!process.env.BREVO_API_KEY) throw new Error('no key');
    const list = await brevo('/emailCampaigns?status=sent&limit=50&offset=0&sort=desc&excludeHtmlContent=true');
    const found = {};
    for (const c of list.campaigns || []) {
      const label = (c.name || '') + ' ' + (c.subject || '');
      const isNewsletter = /newsletter|issue/i.test(label);
      let n = /issue/i.test(label) ? (issueFromText(c.name) || issueFromText(c.subject)) : 0;
      if (!n && isNewsletter) n = issueFromText(label.replace(/issue/gi, ''));
      if (!n && isNewsletter) {
        try { n = issueFromHtml((await brevo('/emailCampaigns/' + c.id)).htmlContent); } catch (e) { n = 0; }
      }
      if (!n) continue;
      const when = c.sentDate || c.scheduledAt || '';
      if (!found[n] || when < found[n]) found[n] = when;      // first send of that issue
    }
    const sent = Object.keys(found).map((k) => ({ issue: +k, sent: found[k] })).sort((a, b) => b.issue - a.issue);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, sent }) };
  } catch (e) {
    return { statusCode: 200, headers: { ...headers, 'cache-control': 'no-store', 'netlify-cdn-cache-control': 'no-store' }, body: JSON.stringify({ ok: false, sent: [] }) };
  }
};
