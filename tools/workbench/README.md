# Workbench archive

A snapshot (Nov 27 2026) of every script and small text file from the working sessions, kept so nothing is lost when a chat ends.
Screenshots, node_modules and large generated files were left out; they can all be regenerated.

Paths inside these files point at the old workspace (`/home/claude/...`). Use them as reference or adapt them before running.
The maintained, runnable tools are in `tools/bank/` (start with `tools/bank/README.md`).

| Folder | What it was for |
|---|---|
| `preview-work/` | Builds Dawn's private preview artifact (`make_artifact2.py`), page design variants (`designs_*.py`, `build_*_final.py`), originals of pages before redesigns (`*.orig.html`) |
| `qc/` | Screenshot, layout, accessibility (axe), CSP, leaderboard and game play-through checks; `qc/story2/` = story checks; `qc/lbsrv/` = local test server; `*.out` = last results |
| `qgen/` | Question builders, as they were before `tools/bank/gen/` |
| `golive/` | Scripts used for the earlier go-live of the redesign |
| `branch-scan/` | Branch link checks and fixes |
| `cards/` | Share-preview card renderer (WhatsApp and Facebook link images) |
| `galopts/`, `mobilepat/`, `style-report/`, `artifact/`, `story-test/` | Gallery options, mobile pattern shots, style report, early artifact and story test pages |

The preview artifact: slug `c9de891c-2dab-4e20-be88-37016e329662` (private to Dawn). Rebuild it with `preview-work/make_artifact2.py`, then publish only the changed files.
