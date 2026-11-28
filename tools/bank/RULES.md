# Play & Grow bank — the rules

These are Dawn's standing rules for everything the bank feeds: questions, games, Bible Stories, the live room.
Every weekly run and every new chat must follow them. When a rule here and an older note disagree, this file wins;
when Dawn says something new in chat, add it here in the same session.

## 1. Accuracy (firm)

- Every Bible chapter, story, event, question and answer is **100% accurate to the Bible (KJV)**.
- Each story chapter passes **three checks** before it can go live:
  1. **Story check:** every scene, line, action and question is traced to its chapter and verse (no invented events, people or words).
  2. **Quote check:** every quotation is compared word for word against three independent public-domain KJV texts
     (`checks/story/verify2.py`; texts from `sources/fetch_kjv.py`, checked by SHA-256). A verse counts only when all three agree.
  3. **Play check:** the chapter is played start to finish on computer (1440×900) and phone (390×844) with
     `checks/story/play.js`. It must score correctly, show no JS errors, and have nothing hidden under captions or off camera.
- A chapter that passes all three checks may go live automatically, with no review by Dawn (approved Nov 27 2026).
- A chapter that fails a check is held and reported. It never goes live half-checked.
- Never pad a story to reach a chapter count. If the Bible gives 2 chapters' worth, make 2.
- Bible questions: a verse is used only when all three KJV texts agree. Authored Bible questions are checked word for word against the verses they cite.
- Family-friendly filter: KJV verses with unsuitable words stay out of every verse-based game.

## 2. Content

- **Topics:** the Bible, MFM, Dr. D.K. Olukoya, Pastor (Mrs.) Shade Olukoya, the G.O.'s books, and Pastor Olumide Oni's books, plus our own messages.
- **Never:** Women Foundation questions; Christian-celebration topics (MFM doesn't keep them); general church history; "finish the prayer point" questions.
  Quotes from the books and messages are fine.
- **Ministry questions** must be sensible and things people want to know (for example, when the leaders married).
  Never anything that could shame the ministry or be controversial. Use official sources only.
- **Current-ministry questions** (this month's PMCH theme, this year's 70 Days theme, service quotes) come from MFM's Instagram image posts.
  Keep them recent, roughly the last 3 months unless still relevant.
- **Difficulty:** easy, medium or hard on every question. Games lean easy by default; the Quiz offers Easy, Normal and Challenge.
- **Repeats:** questions should rarely repeat. A repeat is allowed but must be unlikely, so keep growing the bank.
- All questions are designed by us. A live-room host never writes or edits questions; the server picks from the bank.

## 3. Bible Stories (story game)

- Storybook flow: a wrong answer never stops the story. Show what was right, then carry on.
  The result shows for 7 seconds when right and 10 seconds when wrong; a tap skips ahead.
- Style B: bold outlined cartoon. The drawing must always look sound, with nothing weird and smooth movement.
- **Characters matter most:**
  - Faces have correct proportions, with features placed right.
  - The body faces the same way as the face, and the whole figure looks like a proper body.
  - Looks fit the Bible era (research it; Dawn's Chrome is available for research).
  - Women's hair is always covered.
- **Jesus** may be drawn in gospel stories. **God is never drawn:** show Him as light, fire or a voice.
- Vary the scenery across scenes; never the same background throughout.
- Include popular characters and lesser-known ones, plus Great Events (Christmas, Easter, Noah, the Red Sea, Jericho, the fiery furnace, Pentecost, and so on).
- **Library:** one "Bible Characters" shelf (no Heroes / Hidden Heroes split) and one "Great Events" shelf. On phones, shelves are two-row swipe cards.
- **Weekly volume (Dawn, Nov 27 2026): 4 new characters a week,** with chapters that fit each story (up to 4, never padded).
  Characters can come back later with new chapters that continue their story.
- **Release day: Monday.** The story week runs Monday to Sunday (US Central), the same week as the Weekly Scheduler.
  New chapters go live on Monday in one push.

## 4. Games and the leaderboard

- Game labels are **"Solo"** and **"Team"** only (Team = one shared phone or TV). Never "Group", "Party" or "Together".
- The **Live room** is its own button and section: everyone on their own phone, anywhere. Join by code, QR or link; teams are optional and the captain names the team; the host picks the game.
  Live-room games do not count on the weekly leaderboard.
- Every game, including each Bible Stories chapter, counts toward the main leaderboard, on a common 0–100 board-points scale per day.
  The Game of the Week counts double. Each game also keeps its own ranking in its real points.
- Game screens fill the screen. Solo and Team sit on one line with enough space, on phones too.
- **Game stage layout (queued):** "left boundary" = where the site logo sits; "right boundary" = where the "Request prayer" button ends.
  The X (close) goes at the left boundary, points at the right boundary, and the card is widened between them.
  Desktop screens fit without scrolling; phones use as little space as possible. Applies to almost all games.

## 5. Site and publishing

- **Netlify credits:** push to `main` only when Dawn says so. The current hold lasts until the next credit reset.
  Exception: weekly Bible Stories that pass every check may go live automatically, in one batch push a week.
- Pushes to the `art-preview` branch cost nothing (Netlify doesn't build that branch). Check the commit has no Netlify checks if unsure.
- Previews go to Dawn's private Claude artifact first; the live site changes only after her pass.
- One brand gold (#c9952c); no words on a gold fill; solid buttons (white on navy, navy on white or cream); orange is never a button colour.
- Never default to left alignment: centre and balance first.
- Never deploy the held Instagram files. `netlify.toml`, `package.json` and `netlify/` are git-ignored; force-add only real tracked functions.
- Never commit `node_modules` or `__pycache__`. The GitHub token lives in the project instructions; never write it into a file.
