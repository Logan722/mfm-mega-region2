# Play & Grow bank — start here

The bank is the one source of checked data that every Play & Grow game and every Bible Story is built from.
Games never hold their own questions; they read what the bank produces.
A new chat, or the weekly cloud task, should read this file and then `RULES.md` before doing anything.

The bank lives in this repo (GitHub, always online) so that work can continue with no laptop or device on.
`/tools/*` returns 404 on the live site, so nothing here is public.

## What's where

| Part | Path | What it holds |
|---|---|---|
| Rules | `tools/bank/RULES.md` | Every standing rule from Dawn: accuracy, content, characters, games, publishing |
| Storylines | `tools/bank/storylines/storylines.json` | Which characters and chapters are done, what comes next, the weekly plan |
| Raw data | `tools/bank/gen/data/` | Authored questions (`authored.txt`), researched facts, intermediate outputs (`out_*.json`), pack sources (`packs_*.json`), the original banks |
| Builders | `tools/bank/gen/*.py` | Turn raw data and the KJV texts into the game files (see "Builders" below) |
| Checks | `tools/bank/checks/` | `story/verify2.py` (quote check), `story/play.js` (story play-through), `site/bank_qc.py` (bank check), `site/games_qc.js`, `site/lb_unit.mjs`, and more |
| Bible texts | `tools/bank/sources/fetch_kjv.py` | Downloads the 3 public-domain KJV texts and verifies their SHA-256 |
| Test server | `tools/bank/server/server.mjs` | Serves the site locally with the leaderboard and live-room functions in memory |
| Built output (what the site reads) | `js/quiz-bank.json`, `js/quiz/*.json`, `js/games/*.json` | Questions and game data |
| Stories | `tools/stories/<id>.js` → `python3 tools/build_stories.py <id>` → `stories/<id>.html` | Chapter sources and the shared engine (`tools/stories/template.html`) |
| Archive | `tools/workbench/` | Snapshot of every one-off script from the working sessions (preview builder, designs, screenshot QC). Paths inside are hard-coded to the old workspace, so treat it as reference |

### Bank size (Nov 27 2026)

- **Questions:** Bible 1,058 · Fill the Verse 996 · Who Said It 995 · Kids 1,004 · Pastor Oni's books 773 · G.O.'s books 135 · MFM 84 · Dr. D.K. Olukoya 14 · Pastor (Mrs.) Shade Olukoya 15 · Messages 59 · Names of God 20 · Parables & miracles 21 · Prayer & fasting 21 · Promises 21.
- **Other game data:** Blitz 1,571 statements · Word of the Day 1,000 words · Connections 400 puzzles · Word Connect 92 wheels · Daily Verse 302 · Who Am I? 42 · Verse Builder 226 · Noah's Pairs 5 sets · Imposter/Charades word lists.
- **Stories:** Joseph 1–3 and The First Christmas.

## Setup (any machine or cloud session)

```bash
cd mfm-mega-region2
python3 tools/bank/sources/fetch_kjv.py            # Bible texts -> ~/.cache/mfm-kjv (or $MFM_KJV)
npm i -g playwright && npx playwright install chromium   # only for the play-through checks
```

Optional environment variables:
- `MFM_REPO`: repo path (default: worked out from the script's location).
- `MFM_KJV`: Bible text cache.
- `MFM_ONI_BOOKS`: the `books/` folder of the repo `Logan722/-pastor-olumide-oni-site`, needed only to rebuild Pastor Oni's book questions.

## The checks (run all of them before anything goes live)

```bash
python3 tools/bank/checks/site/bank_qc.py                       # bank: prints NO ISSUES, exits 1 on any issue
python3 tools/bank/checks/story/verify2.py tools/stories/<id>.js  # quote check, one chapter (0 mismatches)
CH=<id> MAX=600000 node tools/bank/checks/story/play.js          # play-through; W=390 H=844 T=m for phone
node tools/bank/checks/site/lb2_test.mjs                         # leaderboard rules (27)
node tools/bank/checks/site/gotw_test.mjs                        # Game of the Week rotation (23)
node tools/bank/checks/site/lb2_g.mjs                            # leaderboard with another featured game (27)
node tools/bank/checks/site/live_server_test.mjs                 # live-room server (39)
node tools/bank/server/server.mjs . 8095 &                       # local site + functions, then:
node tools/bank/checks/site/games_qc.js                          #   every game, computer + phone
node tools/bank/checks/site/live_room_e2e.js                     #   live room: host + phones
node tools/bank/checks/site/axe_play.js                          #   accessibility on /play
```

Results on Nov 27 2026: bank NO ISSUES; 4 stories 0 quote mismatches; 4 story play-throughs 500/600
(question 2 is answered wrong on purpose) with no errors; leaderboard 27 + 23 + 27; live server 39.
Other scripts in `checks/site/` (`lb_e2e.js`, `lb_gotw_e2e.js`, `art_lb.js`, `site_qc.js`, `axe_qc.js`, `axe_home.js`, `csp_game.js`)
are from earlier rounds and may expect older screens. Update them before relying on them.
Story checks save screenshots to a temp folder (or `$OUT`), never into the repo.

For node checks, if `playwright` isn't found, set `NODE_PATH` to the global node_modules folder.

## Builders

`gen/kjvload.py` loads and normalises the 3 KJV texts, and `gen/common.py` and `gen/pools.py` hold shared helpers.
The pipeline:
- `gen_bible.py`, `gen_verse.py`, `gen_who.py` and `check_authored.py` write `data/out_*.json`.
- `assemble.py` and `build_bank.py` produce `js/quiz/*.json` and the core bank.
- `gen_blitz_word.py` builds Blitz and Word of the Day.
- `gen_games.py` builds `js/games/*.json`.
- `gen_oni.py`, `go_books.py`, `mfm_facts.py`, `gen_msgs.py`, `gen_topics.py` and `add_current.py` build the ministry packs.
- `levels.py` sets easy, medium or hard.

Read a builder before re-running it: some rebuild a whole pack, and the bank's ids must stay stable so the "seen" history and challenge links keep working.

## Weekly Bible Stories run (4 characters a week, live every Monday CT; not switched on yet)

1. Read `RULES.md` and `storylines.json`, and pick this week's characters and chapters.
2. Research each character's era and appearance, and write `tools/stories/<id>.js` straight from the KJV.
3. Build, then run all three checks. A chapter that fails is held, not shipped.
4. Add the chapters to `js/stories.js` (mark them ready) and to `STORIES` in `netlify/functions/leaderboard.mjs`, then update `storylines.json`.
5. Make one commit and one push to `main` a week (about 15 Netlify credits). Auto go-live is approved for checked stories.
6. Write a short report: what shipped, what was held and why.

## Branches

- `main` = live site; each push is a Netlify deploy (credits).
- `art-preview` = the waiting batch (redrawn characters, Joseph 2–3, Christmas, Great Events, the live room, wider game screens). Netlify doesn't build it.
- Bot-owned files when merging main in (take theirs): `media.html`, `js/media-playlists.json`, `tools/*.json`, `_redirects`, `sitemap.xml`.
