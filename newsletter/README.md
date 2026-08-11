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
