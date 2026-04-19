# MFM Mega Region 2 USA — Website Reference & Template

## Quick Start (New Chat Workflow)

Each chat reads files from and pushes files to GitHub directly via the API — **no cloning.**

```bash
# Read existing files
curl -s -H "Authorization: token <PAT>" \
  https://api.github.com/repos/Logan722/mfm-mega-region2/contents/

# Create a new file
curl -s -X PUT -H "Authorization: token <PAT>" \
  https://api.github.com/repos/Logan722/mfm-mega-region2/contents/<path> \
  -d '{"message":"commit message","content":"<base64_content>"}'

# Update an existing file (requires sha from GET response)
curl -s -X PUT -H "Authorization: token <PAT>" \
  https://api.github.com/repos/Logan722/mfm-mega-region2/contents/<path> \
  -d '{"message":"commit message","content":"<base64_content>","sha":"<sha>"}'
```

> **Important:** Always rotate the GitHub PAT after each session. Generate a new one at GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens (Contents read/write on this repo).

---

## Project Identity

| Item | Detail |
|------|--------|
| **Ministry** | Mountain of Fire and Miracles Ministries (MFM) |
| **Region** | Mega Region 2, USA |
| **General Overseer** | Dr. Daniel Kolawole Olukoya (DKO) |
| **Principal Regional Overseer** | Pastor Olumide Oni |
| **Pastor (Mrs.)** | Oluwatoyin Oni |
| **HQ Address** | MFM USA Prayer City, 10000 Kleckley Dr, Houston, TX 77075 |
| **HQ Phone** | (832) 788-8504 |
| **Youth Church Address** | 6910 North Eldridge Pkwy, Back Suite, Houston TX 77041 |
| **Youth Church Phone** | (346) 414-5880 |
| **Youth Church Email** | mfmmegaregion2youthchurch@gmail.com |

### Core Identity Statements

**Mission (MFM Worldwide):**
> A full gospel ministry devoted to the Revival of Apostolic Signs, Holy Ghost fireworks, and the unlimited demonstration of the power of God to deliver to the uttermost.

**Identity:**
> A do-it-yourself Gospel ministry where your hands are trained to wage war and your fingers to do battle.

**Logo Scripture References:**
- Fire in the Word — Jeremiah 23:29
- Fire on the Mountain — Deuteronomy 4:11
- Fire in the Bone — Jeremiah 20:9

**Key Scriptures:**
- Obadiah 1:17 — "But upon mount Zion shall be deliverance, and there shall be holiness; and the house of Jacob shall possess their possessions."
- Psalm 144:1 — "Blessed be the Lord my strength, which teacheth my hands to war, and my fingers to fight."

### MFM Mission Objectives
1. To propagate the gospel of our Lord Jesus Christ all over the world
2. To promote the revival of Apostolic signs, wonders and miracles
3. To bring together children of God who are lost in dead churches
4. To train believers in the art and science of spiritual warfare
5. To train believers to receive Holy Ghost baptism and fire
6. To turn the joy of our enemies to sorrow (Deliverance ministry)
7. To build an aggressive end-time army for the Lord
8. To deliver those who have become slaves to pastors, prophets and apostles
9. To build up heavenly-bound and aggressive Christians
10. To build up prayer eagles
11. To purify the Pentecostal dirtiness of this age

---

## Social Media & Online Presence

| Platform | Handle / URL |
|----------|-------------|
| **YouTube** | [@mfmmegaregion2usa](https://youtube.com/@mfmmegaregion2usa) — Channel ID: `UCr3gSJPBQDjN8CEbj86Pyug` |
| **Facebook** | [MFM Mega Region 2 USA](https://facebook.com/mfmmegaregion2usa) |
| **Instagram** | [@mfmmegaregion2usa](https://instagram.com/mfmmegaregion2usa) |
| **WhatsApp** | mfmmegregion2 |
| **YouTube (Youth)** | [@MFMMEGAREGION2YOUTHCHURCH](https://youtube.com/@MFMMEGAREGION2YOUTHCHURCH) |
| **Instagram (Youth)** | [@mfmmegaregion2yc](https://instagram.com/mfmmegaregion2yc) |
| **Youth Church Website** | [mfmmegaregion2yc.org](https://www.mfmmegaregion2yc.org) |

---

## Weekly Online Programs

### Healing & Deliverance Hour
- **Schedule:** Every Tuesday, 7:00 PM CT / 8:00 PM ET
- **Type:** Online Prayerline
- **Theme:** Weekly Prayer · Healing · Breakthrough
- **Flyer:** `img/healing-deliverance-hour.jpg`

### Open Heaven Encounter
- **Schedule:** Every Thursday
- **Timezones:** 6:00 PM CST (USA) · 12:00 AM GMT (Ghana) · 12:00 AM GMT (UK) · 1:00 AM WAT (Nigeria) · 7:00 PM EST (Canada)
- **Type:** International prayer service
- **Flyer:** `img/open-heaven-encounter.jpg`

### Other Recurring Programs (MFM Standard)
- **Power Must Change Hands (PMCH):** 1st Saturday of every month, 8:00 AM – 11:30 AM at Prayer City
- **Sunday Worship Service:** Weekly at all branches
- **Manna Water Service:** Wednesdays
- **Prayer Rain:** Fridays
- **Women Foundation Events:** Monthly meetings
- **Deliverance Crusades:** Special combined services (periodic)

---

## Leadership & Key Personnel

| Name | Role |
|------|------|
| **Dr. D.K. Olukoya** | General Overseer, MFM Worldwide |
| **Pastor Olumide Oni** | Principal Regional Overseer, Mega Region 2 USA & MFM North America HQ |
| **Pastor (Mrs.) Oluwatoyin Oni** | Co-laborer, Mega Region 2 |
| **Pastor David Popoola** | ASRO, MFM Dallas Texas |
| **Pastor Israel Emmanuel** | National Youth Coordinator |

### Pastor Olumide Oni — Bio Summary
Pastor Olumide Oni is a prophet, evangelist, pastor, teacher, husband and father. He has served across multiple MFM assignments: transferred from Kubwa → MFM Lugbe Region (Abuja) → MFM Wuye/Utako (International HQ Annex, Abuja) → MFM North America HQ (Prayer City, Houston). Currently serves as Principal Regional Overseer of Mega Region 2 in North America. Prolific author of 107+ anointed books, thousands distributed monthly within Nigeria and overseas. Known for dynamic teaching, administrative excellence, and personal testimony of God's deliverance.

---

## Repository Structure

```
repo/
├── index.html              Home — hero, latest sermon, weekly programs, event spotlight
├── about.html              About — MFM mission, Mega Region 2 identity, leadership
├── sermons.html            Sermons — YouTube RSS auto-pull
├── events.html             Events — weekly programs, PMCH, crusades, women's events
├── branches.html           Branches — Prayer City HQ + regional branches
│
├── css/
│   └── site.css            Global design system
│
├── img/
│   ├── logo.jpg                      MFM Mega Region 2 USA emblem
│   ├── healing-deliverance-hour.jpg  Healing & Deliverance Hour flyer
│   └── open-heaven-encounter.jpg    Open Heaven Encounter flyer
│
├── admin/                  Decap CMS (for events/announcements)
│   ├── index.html
│   └── config.yml
│
├── WEBSITE-REFERENCE.md    This file
└── README.md               Deployment & setup instructions
```

---

## Design System — "Royal Flame"

### Philosophy
Adapted from the "Cinematic Cathedral" design language of the Pastor Olumide Oni personal site. Premium, movie-poster quality aesthetic re-themed as "Royal Flame" — a dual-tone design using **twilight navy** for dramatic sections (hero, nav, footer) and **white/cream** for readable content sections. Gold is the primary accent (warmth, royalty), fire orange is the secondary (energy, urgency).

### Layout Pattern — Layout 1
- **Nav, Hero, Footer:** Twilight navy (#142240) — cinematic, dramatic
- **Content sections:** Alternate between white (#ffffff) and warm cream (#f8f6f1)
- **Cards on white:** Warm sand (#f5f3ee) with subtle border (#e8e4da)
- **Cards on navy:** Semi-transparent gold tint with gold border

### Color Tokens (CSS Variables)
```css
/* Royal Flame Palette */

/* --- Backgrounds --- */
--bg-navy:       #142240;                           /* Hero, nav, footer, dramatic sections */
--bg-navy-deep:  #0f1a30;                           /* Deeper navy for layering */
--bg-navy-panel: #1a2d4d;                           /* Panels/cards on navy */
--bg-white:      #ffffff;                           /* Primary content background */
--bg-cream:      #f8f6f1;                           /* Alternate content sections */
--bg-sand:       #f5f3ee;                           /* Cards on white */
--bg-sand-border:#e8e4da;                           /* Card borders on white */

/* --- Accents --- */
--gold:          #c9952c;                           /* Primary accent — warmth, royalty */
--gold-light:    #d4a853;
--gold-dim:      #8b6f33;
--gold-glow:     rgba(201, 149, 44, 0.18);
--fire:          #e85d26;                           /* Secondary accent — energy, urgency */
--fire-light:    #ff7a3d;
--fire-dim:      rgba(232, 93, 38, 0.25);

/* --- Text on navy backgrounds --- */
--cream:         #f0e6d0;                           /* Headings on navy */
--text-on-navy:  #8899b8;                           /* Body text on navy */
--text-dim-navy: #6a7a96;                           /* Muted text on navy */

/* --- Text on white/cream backgrounds --- */
--navy:          #142240;                           /* Headings on white */
--text-on-white: #5a6270;                           /* Body text on white */
--text-dim-white:#8a8f98;                           /* Muted text on white */

/* --- Borders --- */
--line-navy:     rgba(201, 149, 44, 0.15);          /* Subtle borders on navy */
--line-navy-strong: rgba(201, 149, 44, 0.35);
--line-white:    #e8e4da;                           /* Subtle borders on white */
--line-white-strong: #d4cfc4;
```

### Typography
| Role | Font | Weight |
|------|------|--------|
| Serif / Headings | Fraunces | 300–900 |
| Sans / Body | Inter Tight | 300–700 |

### Spacing
```css
--gutter: 24px;
--section-y: 120px;
--container-max: 1200px;
```

### Atmosphere Effects
- **Light shaft:** Radial gradient on navy sections only (gold/warm tint)
- **Film grain:** SVG noise overlay on navy sections, mix-blend-mode: overlay
- **Scroll-triggered reveals:** `.reveal` class with IntersectionObserver
- **No atmosphere effects on white sections** — keep them clean and sharp

### Section Rhythm (Layout 1 Pattern)
```
[NAV]           → navy
[HERO]          → navy (with atmosphere effects)
[SERMON]        → white
[PROGRAMS]      → cream
[EVENT]         → navy (dramatic spotlight)
[ABOUT TEASER]  → cream
[FOOTER]        → navy
```

### Design Differences from Pastor Oni Site
| Feature | Pastor Oni Site | MFM Mega Region 2 Site |
|---------|----------------|----------------------|
| Primary accent | Gold (#d4a853) | Gold (#c9952c) |
| Secondary accent | — | Fire orange (#e85d26) |
| Background | Warm brown-black throughout | Dual-tone: navy + white/cream |
| Logo treatment | Monogram circle | MFM emblem (logo.png) |
| Content focus | Individual pastor | Regional ministry |
| Brand scripture | 1 Kings 18:38 | Jer 23:29, Deut 4:11, Jer 20:9 |
| Layout rhythm | All-dark, uniform | Alternating navy/white sections |

## Page-by-Page Reference

### Home (`index.html`)
- **Hero:** Welcome message with MFM scripture, emblem/logo display
- **Latest Sermon:** YouTube RSS auto-pull from channel ID `UCr3gSJPBQDjN8CEbj86Pyug`
- **Weekly Programs:** Two cards featuring Healing & Deliverance Hour (Tues) and Open Heaven Encounter (Thurs) with flyer images
- **Upcoming Event Spotlight:** Configurable banner for next major event (crusade, PMCH, etc.)
- **About Teaser:** Brief intro to Mega Region 2 with link to About page

### About (`about.html`)
- **MFM Identity:** Mission, vision, objectives (the 11-point list)
- **Mega Region 2:** Regional identity and scope
- **Leadership:** Pastor Olumide Oni bio, Dr. Olukoya as G.O.
- **Pastor (Mrs.) Oluwatoyin Oni:** Co-laborer narrative

### Sermons (`sermons.html`)
- **YouTube RSS integration** — auto-pulls latest videos from `UCr3gSJPBQDjN8CEbj86Pyug`
- Searchable/filterable sermon grid
- Updates automatically within 15 min – 2 hours of new video publication

### Events (`events.html`)
- **Weekly Programs Section:** Healing & Deliverance Hour + Open Heaven Encounter with flyer images and schedule details
- **Power Must Change Hands:** Monthly schedule, description
- **Upcoming Events:** Crusades, conferences, Women Foundation events
- **Past Events Gallery:** (optional, via CMS)

### Branches (`branches.html`)
- **Prayer City HQ:** Featured prominently with address, map, service times
- **Regional Branches:** List/cards of MFM churches under Mega Region 2
- **Contact Information:** Per-branch details where available

---

## YouTube RSS Integration

```
Channel ID: UCr3gSJPBQDjN8CEbj86Pyug
RSS Feed:   https://www.youtube.com/feeds/videos.xml?channel_id=UCr3gSJPBQDjN8CEbj86Pyug
```

- Used on `index.html` (latest sermon) and `sermons.html` (full grid)
- Auto-updates within 15 min – 2 hours of new video
- Fetched client-side via CORS proxy or directly (YouTube RSS is publicly accessible over HTTPS)
- Fallback: Preview Mode banner when accessed from `file://` protocol

---

## Decap CMS Integration

### Purpose
Allow authorized users to create/edit events, announcements, and program updates without touching code.

### Configuration (`admin/config.yml`)
```yaml
backend:
  name: git-gateway
  branch: main

media_folder: "img/uploads"
public_folder: "/img/uploads"

collections:
  - name: "events"
    label: "Events"
    folder: "events"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Date", name: "date", widget: "datetime" }
      - { label: "End Date", name: "end_date", widget: "datetime", required: false }
      - { label: "Location", name: "location", widget: "string" }
      - { label: "Description", name: "description", widget: "markdown" }
      - { label: "Image", name: "image", widget: "image", required: false }
      - { label: "Featured", name: "featured", widget: "boolean", default: false }
```

### Setup Steps (Netlify)
1. Enable **Netlify Identity** on the site
2. Enable **Git Gateway** in Netlify Identity settings
3. Invite authorized users via Netlify Identity
4. CMS accessible at `yoursite.netlify.app/admin/`

---

## Hosting & Deployment

| Item | Detail |
|------|--------|
| **Host** | Netlify (free tier) |
| **Repo** | github.com/Logan722/mfm-mega-region2 |
| **Branch** | `main` |
| **Deploy** | Auto-deploy on push to main |
| **Forms** | Netlify Forms (contact / prayer requests) |
| **CMS** | Decap CMS (events & announcements) |
| **Domain** | TBD — recommended: `mfmmegaregion2usa.com` or similar |
| **SSL** | Auto-provisioned by Netlify |
| **Cost** | $0 hosting + optional domain (~$12/yr) |

---

## Photo / Asset Inventory

### Brand Assets
| Filename | Description | Used On |
|----------|-------------|---------|
| `img/logo.jpg` | MFM Mega Region 2 USA emblem (purple circle, mountain/fire, gold ribbon) | Nav, hero, footer |
| `img/healing-deliverance-hour.jpg` | Healing & Deliverance Hour flyer — Tuesdays 7pm CT / 8pm ET | Home, Events |
| `img/open-heaven-encounter.jpg` | Open Heaven Encounter flyer — Thursdays, multi-timezone | Home, Events |

### Leadership Photos
| Filename | Subject | Source |
|----------|---------|--------|
| `img/photos/dr-dk-olukoya.jpg` | Dr. D.K. Olukoya — General Overseer, MFM Worldwide | Official MFM website |
| `img/photos/pastor-shade-olukoya.jpg` | Pastor (Dr.) Mrs. Shade Olukoya — Mummy G.O. | Official MFM website |
| `img/photos/pastor-oni-gold.jpg` | Pastor Olumide Oni — gold suit, blossoms | Reused from pastor site |
| `img/photos/pastor-oni-gold2.jpg` | Pastor Olumide Oni — gold suit, angle 2 | Reused from pastor site |
| `img/photos/pastor-portrait.jpg` | Pastor Olumide Oni — original headshot | Reused from pastor site |
| `img/photos/couple-gold.jpg` | Pastor & Pastor (Mrs.) Oni — matching gold | Reused from pastor site |
| `img/photos/couple-blue.jpg` | Pastor & Pastor (Mrs.) Oni — matching blue, staircase | Reused from pastor site |

### Pending Assets
- [ ] Photos of Prayer City / church building
- [ ] Photos from events/services
- [ ] Branch-specific photos

---

## Related Projects

| Project | Repo | Relationship |
|---------|------|-------------|
| **Pastor Olumide Oni personal site** | `Logan722/-pastor-olumide-oni-site` | Pastor Oni is PRO of Mega Region 2; sites can cross-link |

---

## Key Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Separate repo from pastor site | Yes | Distinct ministry entity vs. individual pastor |
| Design system | Cathedral Fire (purple/fire) | Adapted from pastor site's "Cinematic Cathedral" with MFM brand colors |
| CMS | Decap CMS | Free, Git-based, no server maintenance — same as pastor site |
| YouTube integration | RSS auto-pull | No API key needed, auto-updates, proven approach from pastor site |
| Hosting | Netlify free tier | $0, auto-deploy, built-in forms, Identity for CMS |

---

## Multi-Chat Workflow

Work is split across separate chats for efficiency. Each chat handles a focused scope and commits/pushes to the repo independently.

| Chat | Scope | Status |
|------|-------|--------|
| **Chat 1: Planning** | Research, repo setup, reference doc, asset gathering | ✅ Complete |
| **Chat 2: Design System** | `css/site.css` — global styles, nav, footer, mobile drawer, shared components | ⬜ TODO |
| **Chat 3: Home Page** | `index.html` — hero, latest sermon, weekly programs, event spotlight, about teaser | ⬜ TODO |
| **Chat 4: About Page** | `about.html` — MFM mission, Mega Region 2 identity, leadership bios (Oni, Olukoya) | ⬜ TODO |
| **Chat 5: Sermons Page** | `sermons.html` — YouTube RSS integration, sermon grid | ⬜ TODO |
| **Chat 6: Events Page** | `events.html` — weekly programs, PMCH, crusades, Women Foundation | ⬜ TODO |
| **Chat 7: Branches Page** | `branches.html` — Prayer City HQ, regional branches (data TBD) | ⬜ TODO |
| **Chat 8: Theme Overhaul** | Apply Royal Flame theme to CSS + all pages, swap logo.png, delete logo.jpg | ⬜ TODO |
| **Chat 9: CMS & Polish** | Decap CMS setup, SEO, cross-links, final deployment | ⬜ TODO |

### How Each Chat Should Start
Every new chat in this project should begin by reading the `WEBSITE-REFERENCE.md` file (it's in the project files) and then using the GitHub API with a fresh PAT:

```
1. Read WEBSITE-REFERENCE.md for full context
2. Use GitHub API to check existing files in the repo
3. Do the work for that chat's scope
4. Push files to GitHub via the API
5. Rotate the PAT after the session
```

---

## Outstanding / TODO

- [ ] **Build all 5 pages** — index, about, sermons, events, branches
- [ ] **Global CSS** — Design system in `css/site.css`
- [ ] **Decap CMS setup** — admin pages + config
- [ ] **Branch list** — Need confirmed list of branches under Mega Region 2
- [ ] **Leadership photos** — Need photos for About page
- [ ] **Service schedule** — Confirm Sunday/midweek times for Prayer City
- [ ] **Netlify deployment** — Initial deploy + Identity + Git Gateway
- [ ] **Custom domain** — Purchase and configure
- [ ] **SEO pass** — sitemap.xml, robots.txt, meta tags, Open Graph
- [ ] **Cross-link** — Link pastor site ↔ region site where appropriate
- [ ] **README.md** — Deployment instructions for non-technical users

---

Built April 2026.
