# Tip Calculator PWA — System Documentation

Document status: Active  
Date created: 2026-06-17  
Prepared by: Claude Code (Opus 4.6)

> A simple PWA tip calculator with bill splitting, multiple tip rates, receipt scanning,
> and share functionality. Replaces the native Tip Calculator app (no 7-day TestFlight expiry).

## Table of Contents

1. Document Control
2. System Overview
3. System Identity
4. Purpose and Intended Use
5. Builder / Build History
6. Hardware Prerequisites
7. Software Prerequisites
8. Capabilities
9. Limitations
10. Architecture Overview
11. Dependencies
12. File and Folder Locations
13. Core Workflows
14. End-User Operating Guide
15. Option 1 — Operate via Claude
16. Option 2 — Operate Manually via CLI
17. Option 3 — Operate via PWA (Primary)
18. Deployment and Hosting (GitHub Pages)
19. Outputs
20. Housekeeping and Maintenance
21. Troubleshooting
22. Off-Peak / Remote / Scheduled Operation
23. Change Log
24. Appendix

## 1. Document Control

| Field | Value |
|---|---|
| Document title | Tip Calculator PWA — System Documentation |
| Version | 1.1 |
| Status | Active |
| Owner | Doug |
| Last updated | 2026-07-06 |
| Storage location | `~/Desktop/Claude Summary/Tip Calculator PWA/docs/SYSTEM_DOCUMENTATION.md` |
| Related files | `docs/README.md`, `deploy.sh` |

## 2. System Overview

### Summary
A lightweight Progressive Web App that calculates tip amounts for restaurant bills. Supports multiple tip percentages (12%, 15%, 18%, 20%), bill splitting across multiple people, receipt photo scanning (OCR), and sharing results.

### Executive snapshot
| Item | Summary |
|---|---|
| System name | Tip Calculator PWA |
| Main purpose | Calculate tips and split bills |
| Primary user(s) | Doug (personal use) |
| Primary interface(s) | PWA on iPhone (Add to Home Screen) |
| Hosting | GitHub Pages — https://summerbb138.github.io/TipCalculatorPWA/ |
| Current status | Active — replaces native Tip Calculator |

## 3. System Identity

| Field | Details |
|---|---|
| System name | Tip Calculator PWA |
| Short name | TipCalc |
| Project folder | `~/Desktop/Claude Summary/Tip Calculator PWA/` |
| Runtime environment | Any modern browser (Safari, Chrome) |
| Main language(s) | HTML, CSS, JavaScript |
| Primary execution mode | PWA hosted on GitHub Pages (also runnable via local HTTP server) |

## 4. Purpose and Intended Use

### Purpose
Quickly calculate tip amounts and per-person shares when dining out.

### Intended use cases
- Calculate tip at multiple rates (12%, 15%, 18%, 20%) for a bill
- Split the total (bill + tip) across multiple people
- Scan a receipt photo to auto-fill the bill amount
- Share the tip breakdown with dining companions

### Out-of-scope / non-goals
- Tax calculation
- Multi-currency support
- Bill itemization or per-person ordering

## 5. Builder / Build History

| Question | Details |
|---|---|
| Who built the system? | Doug + Claude Code |
| When was it built? | March 2026 |
| How was it built? | Claude Code Opus 4.6 |
| What was the build approach? | PWA to replace native iOS app (avoids TestFlight 7-day expiry) |
| Subsequent modifications | Folder restructure to standard layout (2026-06-16) |

## 6. Hardware Prerequisites

| Component | Minimum requirement | Recommended | Notes |
|---|---|---|---|
| Mac | Any Mac | Any Mac | To serve PWA locally |
| iPhone | Any with Safari | iPhone with camera | For receipt scanning |

## 7. Software Prerequisites

| Component | Required version | Purpose | Notes |
|---|---|---|---|
| Python 3 | 3.x | Local HTTP server | Built-in on macOS |
| Browser | Safari / Chrome | Run the PWA | Any modern browser |
| Git | 2.x | Push code, build `gh-pages` branch | Needed only for deploying |
| GitHub CLI (`gh`) | any | Authenticated pushes / Pages admin | Logged in as `summerbb138` |

### Installation notes
No installation needed beyond serving the files. For iPhone home-screen install:
1. Serve the `pwa/` folder via HTTP
2. Open the URL in iPhone Safari
3. Share → Add to Home Screen

## 8. Capabilities

| Capability | Description | User-facing? | Notes |
|---|---|---|---|
| Tip calculation | Compute tip at 12%, 15%, 18%, 20% | Yes | All rates shown simultaneously |
| Bill splitting | Divide total by number of people (1–99) | Yes | +/− buttons |
| Receipt scanning | OCR via camera to extract bill amount | Yes | Camera button |
| Share results | Share tip breakdown via OS share sheet | Yes | Share button |

## 9. Limitations

| Limitation | Impact | Workaround | Notes |
|---|---|---|---|
| Fixed tip rates | Only 12/15/18/20% | N/A | Covers common rates |
| Generic "$" symbol | Amounts shown with a plain "$"; no currency conversion or exchange rates | N/A | Not tied to any specific currency |
| Requires server | Must serve files via HTTP for PWA features | Run `python3 -m http.server` | Service worker needs HTTP |
| OCR accuracy | Receipt scanning may misread amounts | Manual entry | Depends on photo quality |

## 10. Architecture Overview

### High-level architecture
Single-page PWA with no backend. All logic runs client-side in the browser.

### Architecture table
| Layer / component | Function | Inputs | Outputs | Notes |
|---|---|---|---|---|
| index.html | Page structure | N/A | DOM | Entry point |
| style.css | Visual styling | N/A | Styled UI | iOS-native look and feel |
| app.js | Business logic | Bill amount, split count | Tip grid | All calculation logic |
| sw.js | Service worker | Fetch events | Cached responses | Offline support |
| manifest.json | PWA manifest | N/A | App metadata | Home screen install |

### Data flow
1. User enters bill amount (manual or OCR scan)
2. `app.js` computes tip for all 4 rates, divided by split count
3. Results displayed in grid (per-person or total)
4. User can share results via OS share sheet

## 11. Dependencies

| Dependency | Version | Why needed | Where used |
|---|---|---|---|
| Python 3 | 3.x | Local HTTP server | Serving PWA files |

No external libraries — pure HTML/CSS/JS.

## 12. File and Folder Locations

| Path | Purpose | Editable by user? | Notes |
|---|---|---|---|
| `pwa/index.html` | Main app page | No | HTML structure |
| `pwa/style.css` | Styles | No | iOS-native appearance |
| `pwa/app.js` | App logic | No | Tip calculation, OCR, sharing |
| `pwa/sw.js` | Service worker | No | Offline caching |
| `pwa/manifest.json` | PWA manifest | No | App name, icons, theme |
| `pwa/icon.png` | App icon | No | Home screen icon |
| `pwa/serve.py` | Local dev server | No | Serves `pwa/` on port 8093 |
| `start.sh` | Launch local server | Yes | Convenience wrapper around `serve.py` |
| `deploy.sh` | One-command deploy to GitHub Pages | Yes | See section 18 |
| `docs/` | Documentation | No | This file, README, PDF |

## 13. Core Workflows

| Workflow | Objective | Main steps | Output |
|---|---|---|---|
| Calculate tip | Get tip amounts | Enter bill → view grid | Tip at 4 rates |
| Split bill | Per-person amount | Enter bill → adjust people count | Per-person totals |
| Scan receipt | Auto-fill bill amount | Tap camera → take photo | Bill amount populated |
| Share results | Send to others | Tap share button | Shared via OS share sheet |

## 14. End-User Operating Guide

### Overview
Open the Tip Calculator from your iPhone home screen (or browser). Enter the bill amount, adjust the number of people if splitting, and read the tip amounts from the grid.

### Quick start
1. Enter the bill amount in the $ field
2. The grid instantly shows tip and total at 12%, 15%, 18%, and 20%
3. Use +/− to adjust the number of people splitting the bill
4. Tap the camera icon to scan a receipt instead of typing
5. Tap share to send the breakdown

## 15. Option 1 — Operate via Claude

N/A — this is a simple calculator app. Claude can help modify the code but doesn't operate the app.

### Useful prompts
```text
Add a custom tip percentage option to the Tip Calculator PWA. The project is at ~/Desktop/Claude Summary/Tip Calculator PWA/
```

## 16. Option 2 — Operate Manually via CLI

### Start the server
**Primary method (recommended):**
```bash
bash ~/Desktop/Claude\ Summary/Tip\ Calculator\ PWA/start.sh
```

**Manual alternative:**
```bash
cd ~/Desktop/Claude\ Summary/Tip\ Calculator\ PWA
python3 pwa/serve.py
```

### Access on iPhone
Open `http://<mac-ip>:8093` in Safari → Share → Add to Home Screen.

## 17. Option 3 — Operate via PWA (Primary)

### User steps
1. Tap the Tip Calculator icon on your iPhone home screen
2. Enter the bill amount
3. Adjust split count if needed
4. Read tip amounts from the grid
5. Share if desired

This is the primary and recommended way to use the app.

## 18. Deployment and Hosting (GitHub Pages)

The app is hosted publicly on GitHub Pages, so it works on the iPhone from a permanent URL with **no Mac and no local server running**. This section is the source of truth for deploying — follow it rather than re-deriving the setup.

### Live URL
```
https://summerbb138.github.io/TipCalculatorPWA/
```
Open in iPhone Safari → Share → **Add to Home Screen**.

### How to deploy a change (the only command you need)
After editing anything in `pwa/`, from the project root:
```bash
cd ~/Desktop/Claude\ Summary/Tip\ Calculator\ PWA
./deploy.sh "describe what changed"   # commits your changes, then deploys
# or, if you already committed:
./deploy.sh
```
`deploy.sh` pushes `main`, rebuilds the `gh-pages` branch from `pwa/`, and force-pushes it. GitHub Pages redeploys automatically ~1 minute later. Run `deploy.sh` with **no** argument and a dirty tree and it stops safely instead of deploying half-finished work.

### How the hosting is wired (read before changing it)
| Item | Value / Rationale |
|---|---|
| Repository | `github.com/summerbb138/TipCalculatorPWA` — **must stay public** (free-plan Pages does not work on private repos) |
| Pages source | Branch `gh-pages`, path `/` (root) |
| Why a `gh-pages` branch? | The app lives in the `pwa/` subfolder. Pages' branch source can only serve the repo **root** or `/docs`, not an arbitrary subfolder — so `gh-pages` holds the `pwa/` contents at its root, built with `git subtree split`. |
| Why not GitHub Actions? | The local `gh` OAuth token lacks the `workflow` scope, so pushing a `.github/workflows/*.yml` file is rejected. The `gh-pages` subtree method needs no special scope. If you later add the `workflow` scope (`gh auth refresh -s workflow`), an Actions workflow becomes a valid alternative. |
| Relative paths | `manifest.json` uses `start_url`/`scope` = `"."` and `index.html`/`sw.js` use `./…`, so the app runs correctly under the `/TipCalculatorPWA/` subpath. Keep paths relative. |

### Manual equivalent of deploy.sh (if the script is missing)
```bash
git push origin main
git branch -D gh-pages 2>/dev/null
git subtree split --prefix pwa -b gh-pages
git push -f origin gh-pages
```

### One-time Pages setup (already done — for reference/rebuild only)
```bash
gh repo edit summerbb138/TipCalculatorPWA --visibility public --accept-visibility-change-consequences
gh api --method POST repos/summerbb138/TipCalculatorPWA/pages \
  -f 'source[branch]=gh-pages' -f 'source[path]=/'
```

### Caveat — service worker cache after deploy
Because `sw.js` caches assets for offline use, the installed PWA may keep showing the **old** version after a deploy until you close and reopen it (or hard-refresh in Safari). To force all clients to update, bump `CACHE_NAME` in `pwa/sw.js` (e.g. `tipcalc-v1` → `tipcalc-v2`) before deploying.

## 19. Outputs

N/A — the app displays results on-screen. No files or reports are generated.

## 20. Housekeeping and Maintenance

| Task | Frequency | How to do it | Why it matters |
|---|---|---|---|
| Clear browser cache | Rarely | Safari Settings → Clear cache | If PWA behaves oddly |
| Re-add to home screen | After server IP change | Share → Add to Home Screen | URL may change |
| Deploy an update | After any `pwa/` edit | Run `./deploy.sh "message"` (section 18) | Publishes to the live GitHub Pages URL |

Minimal maintenance required — this is a simple, self-contained PWA.

## 21. Troubleshooting

| Problem | Likely cause | How to diagnose | How to fix |
|---|---|---|---|
| App won't load | Server not running | Check terminal | `bash start.sh` |
| Camera not working | No HTTPS (required for camera API) | Check URL | Use localhost or set up HTTPS |
| Stale version after update | Service worker cache | Check sw.js version | Increment cache version in sw.js |
| Can't add to home screen | Not served via HTTP | Check URL bar | Must use http:// not file:// |
| Deploy didn't appear | Pages not rebuilt yet, or SW cache | Wait ~1 min; check Actions/Pages build | Reopen the PWA or bump `CACHE_NAME` in sw.js (section 18) |
| `deploy.sh` rejected push | `gh` token missing scope / not logged in | `gh auth status` | Re-auth: `gh auth login`; never needs `workflow` scope for the gh-pages method |

## 22. Off-Peak / Remote / Scheduled Operation

N/A — this is an on-demand calculator app. No scheduled or background operation.

## 23. Change Log

| Date | Author | Change summary |
|---|---|---|
| 2026-03-28 | Doug + Claude | v1.0 — Initial PWA release |
| 2026-06-16 | Claude | Folder restructure to standard layout |
| 2026-06-17 | Claude | Created SYSTEM_DOCUMENTATION.md |
| 2026-07-06 | Claude | Currency-neutral "$" display (no more "US$"); published to GitHub Pages via `gh-pages` branch; added `deploy.sh`; documented deployment (section 18) |

## 24. Appendix

### Appendix A — Tip rates
Default rates: 12%, 15%, 18%, 20%. These are defined in `app.js` as the `tipRates` array.

### Appendix B — PWA install
For the best experience, add to iPhone home screen via Safari's Share → Add to Home Screen. This gives the app a native app-like appearance with no browser chrome.
