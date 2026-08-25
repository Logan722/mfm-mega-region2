# _reference — Redesign source & handoffs (reference only; not linked/deployed)

Source material for the MFM Mega Region 2 "Royal Flame" redesign, kept here so future work can reference it directly via the GitHub API.

## Files
- **MFM_Mega_Region_2_Full_Mockup_Source.zip** — approved ChatGPT full-site mockup (Next.js + React; custom CSS, no Tailwind utilities). `app/site.tsx` = all page markup; `app/globals.css` = the exact stylesheet; `app/data.ts` = content. The redesign home is server-rendered from this for pixel-exact visuals.
- **MFM_REMAINING_PAGES_CONTENT_ORDER_HANDOFF.md** — approved content order/hierarchy for every remaining page + updated global nav order.

## Homepage status (branch: redesign-integration)
Mockup visuals (exact globals.css) with these approved changes: original site header; per-slide live countdown in the What's-Happening spotlight; "Choir & the Band" diagonal-split mosaic tile; "Fellowship" tile (replaced Gen218); Youth Church tile removed; section order per handoff §3; every photo unique; spotlight flyer framed at exactly 4:5 (1080×1350) with a gold outline.

## MUST-DO reminders when pushing to production
- **Newsletter popup — do not forget.** Restore on events.html ONLY: js/newsletter-popup.js, POST /.netlify/functions/subscribe, honeypot, localStorage subscribed flag + 14-day dismissal; must never cover an open event-detail modal.
- Flyers are 1080×1350 (portrait 4:5). The spotlight frame is exactly 4:5 with a gold outline.
- Replace mockup-only wording ("this preview demonstrates…") before production.
- Promo + latest-message videos use the real YouTube thumbnails on the live site (artifact uses local stand-ins because its sandbox blocks remote images).
