# MFM Mega Region 2 USA

Official website for the Mountain of Fire and Miracles Ministries, Mega Region 2 USA.

## Structure

```
repo/
├── index.html              Home
├── about.html              About & Mission
├── sermons.html            Sermons (YouTube RSS)
├── events.html             Events & Programs
├── branches.html           Branches & Locations
├── css/site.css            Global design system
├── img/                    Images & flyers
└── admin/                  Decap CMS
```

## Deployment

1. Go to **https://app.netlify.com/drop**
2. Drag and drop the repo folder onto the page
3. Site goes live at `random-name.netlify.app`
4. Rename in Netlify dashboard → Site configuration → Change site name

## CMS Setup

1. Netlify dashboard → Integrations → Identity → Enable
2. Enable Git Gateway in Identity settings
3. Invite editors via Identity
4. Access CMS at `yoursite.netlify.app/admin/`

## Contact Form

1. Netlify dashboard → Site configuration → Forms
2. Click `contact` form → Settings & usage → Form notifications
3. Add email notification with destination address

## YouTube Integration

Sermons auto-pull from channel `UCr3gSJPBQDjN8CEbj86Pyug` via RSS.
No API key needed. Updates within 15 min–2 hours of new video.

---

See `WEBSITE-REFERENCE.md` for full technical documentation.

Built April 2026.
