# Newsletter — MFM Mega Region 2

Source of truth for the twice-monthly newsletter (Issue A on the 1st Wednesday, Issue B on the 3rd Wednesday).

## Files

- `template.html` — Master template with `{{PLACEHOLDER}}` fields. Used to compose each issue.
- `sample-issue-A.html` — Rendered example of the "full" monthly issue.
- `sample-issue-B.html` — Rendered example of the "pulse" mid-month issue.
- `ISSUE-01-August-2026.md` — Content plan for the first live issue.
- `welcome-email.md` — Copy for the auto-fire welcome email sent to new subscribers.

## Send infrastructure

- **Provider:** Brevo (free tier — 300 sends/day cap, 100k contacts storage)
- **Sender:** `newsletter@mfmmegaregion2usa.org` (SPF/DKIM/DMARC authenticated)
- **List ID:** 3 ("MFM Newsletter — Main")
- **Subscribe endpoint:** `/.netlify/functions/subscribe`
- **Admin proxy:** `/.netlify/functions/brevo-admin` (gated by ADMIN_TOKEN)
- **Env vars in Netlify:** `BREVO_API_KEY`, `ADMIN_TOKEN`

## Cadence

- **Issue A** — 1st Wednesday of each month, 8 AM CT. Full newsletter (pastor's word, upcoming events, prayer points, spotlight, latest sermon, find a branch, socials).
- **Issue B** — 3rd Wednesday of each month, 8 AM CT. Pulse issue (short pastor's note, countdown to upcoming events, latest sermon, one prayer point).

Both use the same template with different section weighting.

## Content pipeline

Every issue needs from Dawn ~10 minutes of writing:
1. Pastor's word (2 short paragraphs) — Claude drafts in Pastor Oni's voice, Dawn reviews.
2. Testimony — *removed 2026-08-11. Not part of the standard issue anymore.*
3. Latest sermon — auto-pulled from https://www.youtube.com/feeds/videos.xml?channel_id=UCr3gSJPBQDjN8CEbj86Pyug

Events auto-pulled from `js/events-data.js` — the same file that drives the site's events page and home slideshow. Never diverges.

## Publishing to /newsletter (automatic, since Oct 21 2026)

You do not edit `newsletter/index.html` by hand any more. Publish the issue page (`newsletter/issue-N.html`,
with its OG tags and the `Issue #N · Month Year` eyebrow) before the send as usual. Once the Brevo campaign
has been **sent**, the site picks it up by itself:

- `/.netlify/functions/newsletter-issues` reads the sent campaigns from Brevo (campaign name must contain
  `Issue #N`, as every issue so far has) and returns the issue numbers.
- `tools/newsletter_hub.py` (run by `tools/build_site.py`, which the YouTube sync action runs every 30 min)
  makes that issue the Latest Issue, moves the previous one into The Archive, updates the hub's share image,
  and fixes the Previous / Next links on the issue pages.
- `/newsletter` also checks in the browser, so visitors see the new issue within about 5 minutes of the send.

An issue page published ahead of the send stays off `/newsletter` until Brevo shows it as sent.

## WhatsApp share links (standing rule)

Every issue page and email carries a WhatsApp "Pass it on" share whose pre-filled text starts with the issue
URL on its own first line (`https://www.mfmmegaregion2usa.org/newsletter/issue-N`), then a blank line, then the
rich message (title, teaser, "Inside:" list, "👉 Tap the link above to read."). Hardcode it; never use Brevo
`{{ mirror }}` inside an encoded href. **If the issue's title or contents change, update the share text too**
(Issue #4 was retitled after its share text was written; fixed Oct 21 2026). The floating WhatsApp button on
the issue page uses the same text. Newsletter pages get their header (back to All issues / Home) from `js/nav.js`.
