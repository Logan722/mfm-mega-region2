# MFM Mega Region 2 USA
## Remaining Pages — Approved Content Order and Hierarchy Handoff

**Purpose:** This document defines the recommended content order for the remaining pages of the MFM Mega Region 2 USA redesign. It complements the approved homepage order and should be handed to Claude together with the full mockup source and the main redesign integration handoff.

**Design principle:** **Globally refined, unmistakably MFM.**

**Scope rule:** This is a reordering and presentation guide—not authorization to replace the original website architecture, routes, data sources or working features.

**Giving:** Giving is intentionally excluded from this document and from the redesign scope.

---

## 1. Governing implementation rules

Claude must apply the approved visual and content order inside the original project structure:

- Preserve the original static HTML, vanilla JavaScript, Netlify and GitHub pipeline.
- Preserve existing canonical URLs unless a route change has been separately approved.
- Labels may improve without changing the underlying route. For example, a navigation label may say **Find a Church** while the existing production route remains `/branches`.
- Do not rename or remove a working URL without a verified redirect and a complete internal-link audit.
- Preserve the branch map, location search, geolocation, state filters and branch detail behavior.
- Preserve media search and all programme, speaker, topic and year filters.
- Preserve event feeds, department feeds, hash deep links, modals, calendars, sharing and time-zone behavior.
- Preserve the live-service player, automatic YouTube source, fallback content and live-status behavior.
- Preserve the original Netlify prayer/contact forms, AJAX responses, honeypot protection and subject routing.
- Preserve SEO metadata, structured data, sitemap, PWA, analytics, accessibility and keyboard behavior.
- Replace mockup-only wording such as “this preview demonstrates” before production.
- Use approved ministry photographs and store production copies in the original image pipeline. Do not permanently hotlink preview images.
- Every normal page navigation must open at the top. Hash links may open the correct section or modal deliberately.

---

## 2. Approved global navigation order

The recommended desktop navigation is:

1. **Logo** — returns to Home; a separate Home label is optional
2. **About**
3. **Find a Church**
4. **Programs & Events**
5. **Watch**
6. **Ministries**
7. **Connect**
8. **Request Prayer** — persistent highlighted action

### Programs & Events dropdown

1. Weekly Programs
2. Regional Events
3. Calendar or Upcoming Events, if already supported

### Watch dropdown

1. Watch Live
2. Messages & Teachings
3. Prayer Points

### Ministries dropdown

1. All Ministries
2. Women Foundation
3. Gen218 Singles Ministry
4. Youth Church

**Important:** Find a Church must not remain hidden under Ministries. It is a primary regional visitor action.

---

## 3. Approved homepage order — reference

The remaining pages must support this homepage journey:

1. Hero and dynamic live/next-programme panel
2. Quick actions: New Here, Find a Church, Watch and Request Prayer
3. Your First Visit
4. What Is Happening Now event spotlight
5. Where the Fire Burns branch finder
6. Welcome and regional identity
7. Life Across the Region photography
8. Watch & Prepare event videos
9. Latest Message / Watch & Grow
10. Prayer and contact form
11. Footer

---

## 4. Page-order decision summary

| Page | Decision | Main adjustment |
|---|---|---|
| About | Reorder slightly | Place the ministry’s Prayer, Deliverance and Word values before leadership profiles. |
| Find a Church / Branches | Refine | Put search and location actions before explanatory content. |
| Individual Branch | Refine | Put visit-critical information and directions before general welcome content. |
| Programs | Keep with minor refinement | Prioritize current programme status and schedules. |
| Events | Refine | Feature the most relevant event first and enforce chronological/status ordering. |
| Event modal/detail | Keep | Information and action order is already strong. |
| Watch | Keep | Live state, player and recent messages are correctly ordered. |
| Media Library | Keep with minor refinement | Search and filters must remain immediately available. |
| Message Detail | Keep | Playback must remain the primary task. |
| Ministries | Keep | Ministry choices should remain direct and visual. |
| Women Foundation | Keep | Leadership-to-programme order is appropriate. |
| Gen218 | Keep | Leadership, pathways and events are correctly sequenced. |
| Youth Church | Protect | Preserve the external Youth Church pathway and approved photography. |
| New Here | Refine | Put location selection and practical visit information first. |
| Prayer Request | Keep | Reassurance followed by the confidential form is correct. |
| Reach Out | Keep | One trusted form with subject routing is correct. |
| Connect | Keep exactly | Official links only; no office card, form, giving or unrelated pathways. |
| Privacy | Expand carefully | Use a clear summary followed by specific data-handling categories. |
| 404 / Not Found | Keep simple | Recovery actions should be immediate. |

---

# 5. Page-by-page approved order

## 5.1 About

**Decision: Reorder slightly.**

Approved order:

1. **Page hero**
   - Clear regional identity
   - One strong approved ministry photograph
   - Short description of Mega Region 2’s role
2. **Who We Are**
   - Regional family across six states
   - Relationship to MFM Worldwide
   - Mission and mandate
3. **Scriptural mandate**
   - Obadiah 1:17
   - Use as a dignified editorial transition, not a decorative filler section
4. **Core ministry values**
   - Prayer
   - Deliverance
   - The Word
5. **Global leadership**
   - Dr. D.K. Olukoya
   - Pastor (Dr.) Mrs. Shade Olukoya
   - Approved photographs, titles, biographies and verified profile links
6. **Regional leadership**
   - Pastor Olumide Oni — Principal Regional Overseer
   - Pastor (Mrs.) Oluwatoyin Oni — President, MFM Women Foundation, Mega Region 2 USA
   - Full approved profiles and verified social links
7. **Regional next action**
   - Find a Church
   - Explore Programs

Why: Visitors should understand the ministry’s identity and spiritual foundations before entering long leadership profiles. Global leadership must remain before regional leadership.

---

## 5.2 Find a Church / Branch Directory

**Decision: Refine the top of the page.**

Approved order:

1. **Compact page introduction**
   - “Find an MFM Church Near You”
   - Regional coverage statement
2. **Primary location tools**
   - Search by church, city, state or ZIP
   - Find nearest to me
   - Clear search/reset control
3. **State filters and result count**
4. **Interactive map and branch results**
   - Map and results remain synchronized
   - Mobile may show results before the map if that improves usability
5. **Selected branch preview or modal**
   - Church name
   - Verified address
   - Pastor
   - Service information
   - Phone/contact
   - Directions
6. **Verification notice**
   - Last-verified date when available
   - Instruction to confirm special-programme details before traveling
7. **Visitor support action**
   - New Here / Plan Your Visit
   - Reach Out only if branch information is incomplete

Do not place a long regional introduction before the search controls. The visitor’s primary task is location discovery.

---

## 5.3 Individual Branch Page

**Decision: Refine for practical visitor use.**

Approved order:

1. **Branch identity and location**
   - Official branch name
   - City and state
   - Verified-information indicator
2. **Immediate actions**
   - Get Directions
   - Call or Contact
   - Plan Your Visit
3. **Service times and programmes**
4. **Address, parking and accessibility information**
5. **Pastor or branch leadership**
6. **What to expect**
7. **Current branch or regional events**, only when drawn from the established event source
8. **Related actions**
   - Watch
   - Request Prayer
   - Return to All Locations

Do not lead with a generic welcome paragraph while address, directions and service times are lower on the page.

---

## 5.4 Programs

**Decision: Keep with minor refinement.**

Approved order:

1. **Page hero**
2. **Current programme status**
   - Live now, next programme or next scheduled gathering
   - Visitor’s local time plus original Central Time where applicable
3. **Programme list**
   - Healing & Deliverance Hour
   - Open Heaven Encounter
   - Weekend Deliverance
   - Power Must Change Hands and other approved programmes
4. **Individual programme schedule popup**
   - Programme purpose
   - Current schedule
   - Attendance/watch action
5. **Time-zone guidance**
6. **Watch Live / View Events actions**

Programme cards must open the schedule in context. Do not redirect visitors to another page and make them search for the same programme again.

---

## 5.5 Events

**Decision: Refine event priority and ordering.**

Approved order:

1. **Page hero**
2. **One featured event**
   - The most relevant major event—not simply the first database record
   - Flyer, title, date, venue and primary action
3. **Event controls**, where supported
   - Upcoming
   - Ongoing
   - Ministry or programme filters
4. **Event grid/list**
5. **Fire Across Time Zones**
6. **Footer**

Required event sorting:

1. Happening today or live now
2. Nearest upcoming dated event
3. Ongoing programme
4. Later upcoming events
5. Past events only inside an archive or clearly separated section

### Newsletter popup behavior

The newsletter popup is not part of the normal vertical content order. It must:

- Appear only on the Events page
- Respect the approved delay
- Not appear while an event modal is open
- Respect dismissal and subscription storage rules
- Remain keyboard accessible
- Never block essential event information permanently

---

## 5.6 Event Modal and Event Detail Page

**Decision: Keep the current information hierarchy.**

Approved order:

1. Official flyer or approved event image
2. Status and event category
3. Event title and theme
4. Date, time and venue
5. Short event description
6. Ministering guest or host
7. Programme schedule
8. Primary actions
   - Register or Get Tickets
   - Add to Calendar
   - Get Directions when available
   - Share
9. Promotional video
10. Verification/safeguarding notice where applicable

Event cards on the listing page should open the in-page modal while preserving the event hash deep link. Dedicated detail routes may remain for SEO, sharing and no-JavaScript access.

---

## 5.7 Watch

**Decision: Keep.**

Approved order:

1. **Watch hero with direct live-channel action**
2. **Live/next-service status bar**
3. **Live or latest available player**
4. **Programme schedule beside or immediately below the player**
5. **Latest-message information**
6. **Recent messages**
7. **Open Media Library action**

Live actions must lead to the dedicated Watch experience. The Media Library is for browsing recordings and teachings, not as a substitute for the live page.

---

## 5.8 Media Library

**Decision: Keep with minor refinement.**

Approved order:

1. **Compact page hero**
2. **Search field**
3. **Programme, speaker, topic and year filters**
4. **Quick topic filters**
5. **Result count**
6. **Message grid**
7. **Empty state with Clear Filters action**

The archive is a working search surface. Do not insert a large editorial section between the hero and the search controls.

Each message card should show:

- Strong 16:9 thumbnail
- Title
- Speaker
- Programme
- Date or year
- Relevant topic labels
- Clear Watch action

---

## 5.9 Message Detail

**Decision: Keep.**

Approved order:

1. Message title, programme and speaker
2. Video player
3. Message details and topics
4. Share action where supported
5. Related messages
6. Return to Media Library

Playback is the main task and should never be pushed below unrelated content.

---

## 5.10 Ministries Overview

**Decision: Keep.**

Approved order:

1. **Page hero**
2. **Short ministry-life introduction**
3. **Ministry cards**
   - Women Foundation
   - Gen218 Singles Ministry
   - Youth Church
   - Other approved regional ministry arms
4. **Explore action on every card**
5. **Shared regional next action**
   - View Events or Find a Church

Do not place long generic descriptions before the ministry choices. Visitors should see the available pathways quickly.

---

## 5.11 Women Foundation

**Decision: Keep the current order.**

Approved order:

1. Page hero
2. International leadership — Pastor (Dr.) Mrs. Shade Olukoya
3. Regional leadership — Pastor (Mrs.) Oluwatoyin Oni
4. Verified leadership social links
5. Three pillars
   - Empowered to Pray
   - Equipped to Serve
   - Engaged to Transform
6. Upcoming Women Foundation events from the existing feed
7. Women Foundation messages from the existing media source
8. Prayer or Connect action

Do not replace the established department feeds with manually duplicated event or media cards.

---

## 5.12 Gen218 Singles Ministry

**Decision: Keep the current order.**

Approved order:

1. Page hero
2. Regional coordinator profile
3. Ministry purpose
4. Community pathways
   - Young Singles
   - Mature Singles
   - Single Parents
5. Upcoming Gen218 events from the established feed
6. Relevant contact or event action

Do not allow the coordinator biography to become longer than the ministry purpose and visitor pathways combined.

---

## 5.13 Youth Church Pathway

**Decision: Protect the established external pathway.**

Approved behavior:

1. Use approved real Youth Church photography in the Ministries page and homepage mosaic.
2. Clearly identify Youth Church as part of Mega Region 2.
3. Send the visitor to the existing Youth Church website when that is the authoritative destination.
4. Open external destinations deliberately and label them accessibly.
5. Do not duplicate or manually maintain Youth Church content that already has an authoritative source.

---

## 5.14 New Here / Plan Your Visit

**Decision: Refine practical information order.**

Approved order:

1. **Welcoming page hero**
2. **Choose a Location action**
3. **What to expect**
4. **Service length and programme differences**
5. **Children and family information**
6. **Dress expectations**
7. **Parking and directions**
8. **Accessibility information**
9. **Frequently asked questions**
10. **Prayer and contact support**

The page must answer practical visitor questions. It must not simply redirect to About or repeat a general church welcome.

---

## 5.15 Prayer Request

**Decision: Keep.**

Approved order:

1. Reassuring page hero
2. Confidentiality and care statement
3. Prayer request form
4. Clear success state
5. Emergency/safeguarding boundary where approved by ministry leadership
6. Return to Watch, Programs or Home

The form must remain the original secure production form. Do not replace it with a preview-only form or a nonfunctional visual placeholder.

---

## 5.16 Reach Out

**Decision: Keep.**

Approved order:

1. Page hero
2. Short explanation of available message types
3. Shared contact form
4. Subject choices
   - General Message
   - Prayer Request
   - Testimony
   - Pastoral Support, when approved
5. Success confirmation
6. Official Connect-page link

Use one trusted form and route messages correctly. Do not create multiple unrelated contact forms across the website.

---

## 5.17 Connect

**Decision: Keep exactly as the approved links-only experience.**

Approved order:

1. Official MFM Mega Region 2 identity
2. Short scriptural or ministry statement
3. Main website link
4. Official channel links
   - YouTube
   - WhatsApp
   - Facebook
   - Instagram
   - Branches / Find a Church

Do not add:

- A Regional Office information card
- A contact form
- Giving
- New Here cards
- Prayer pathway cards
- Unapproved phone numbers or addresses
- Additional decorative sections that weaken the simple links-hub purpose

---

## 5.18 Privacy

**Decision: Expand carefully without making the page difficult to read.**

Approved order:

1. Plain-language privacy summary
2. Prayer and contact submissions
3. Newsletter subscriptions
4. Analytics
5. Cookies or local-storage behavior
6. Event registration links to external providers
7. Children, youth and safeguarding
8. Data-retention and authorized-access statement
9. Privacy question/contact pathway

Use real production practices. Do not publish assurances that the ministry has not approved or cannot operationally maintain.

---

## 5.19 Not Found / Error State

**Decision: Keep simple.**

Approved order:

1. Clear explanation that the page was not found
2. Return Home
3. Find a Church
4. View Events
5. Search or Media Library, if supported

Do not present a large decorative page before the recovery actions.

---

## 6. Footer order

Approved footer structure:

1. **Official identity**
   - Official emblem/wordmark
   - Ministry name
   - Short MFM statement or Scripture
2. **Explore**
   - About
   - Find a Church
   - Programs
   - Events
3. **Watch and Ministries**
   - Watch Live
   - Media Library
   - Women Foundation
   - Gen218
   - Youth Church
4. **Connect**
   - New Here
   - Prayer Request
   - Reach Out
   - Official Links
5. **Trust information**
   - Privacy
   - Accessibility statement when available
   - Safeguarding information when approved
6. **Copyright and regional identity**

The footer should support navigation without becoming a second overcrowded homepage.

---

## 7. Mobile ordering rules

The desktop order remains the content order unless a mobile usability reason requires a controlled adjustment.

- Primary actions must remain visible before long text.
- Search results may appear before the map on small screens.
- Event flyer should appear before event details, followed immediately by date and action buttons.
- Leadership image should appear before that leader’s name and biography.
- The Watch player must appear before recent-message cards.
- Filters must remain reachable and may collapse into an accessible filter drawer.
- No mobile section may depend on hover.
- Carousels require swipe, arrow controls, position indicators and pause behavior.
- Sticky navigation must not cover headings, filters, modal titles or hash-linked content.
- Opening another page must reset to the top unless a deliberate hash link is present.

---

## 8. Repetition and density controls

- Do not repeat the same event information in three full-size homepage sections.
- “Watch & Prepare” is for major-event promotional videos; “Watch & Grow” is for sermons and services. Keep their purposes distinct.
- Do not repeat full leadership biographies on the homepage. Use a concise regional introduction and link to About.
- Do not repeat branch listings on the homepage. Use a compact branch-finder preview linked to the complete directory.
- Department pages must use their existing feeds rather than manually duplicated content.
- Avoid repeating phrases such as “Come with expectation,” “Welcome home,” “On the mountain” and “Find your place” across adjacent sections.
- Every section must have one primary purpose and one obvious next action.

---

## 9. Final acceptance check for page hierarchy

The page order is approved only when:

- A first-time visitor can find a location, understand what to expect and request help without searching through About.
- A returning visitor can reach current events, programmes and Watch quickly.
- A regional visitor can discover branches before reaching the bottom of the homepage.
- Time-sensitive content appears before evergreen promotional content.
- The Events page sorts by real status and date rather than database insertion order.
- Search and filter tools appear before long archive content.
- Practical branch information appears before general welcome copy.
- Leadership follows mission and core values on About.
- Women Foundation and Gen218 preserve their established feed sources.
- Connect remains a focused official-links hub.
- Prayer and Reach Out forms retain the original production handling.
- No giving content or giving navigation is introduced.
- No original working feature, route or data source is lost because of the reordering.

---

## 10. Instruction to Claude

Apply the page hierarchy in this document as the approved content-order standard. Use the full mockup as the visual and interaction reference, but implement the order inside the original production project and preserve the original pipeline and working systems. Where this document says **Keep**, do not redesign the page structure unnecessarily. Where it says **Refine** or **Reorder**, change only the relevant hierarchy while retaining the page’s established data source, route and functionality.
