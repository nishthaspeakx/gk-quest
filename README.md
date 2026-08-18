# GK Quest 🦉

A daily, gamified **General Knowledge** game for a Class 5 child — a 90-day adventure of
10–15 fresh questions per day, wrapped in coins, stars, streaks, badges, level-ups and a
celebration at the end of every quest. Built to run free, with no login and no server.

See [`CLAUDE.md`](CLAUDE.md) for the full design and [`GK-Quest-App-Plan.md`](GK-Quest-App-Plan.md)
for the original brief.

---

## Tech stack

- **React + Vite** (JavaScript)
- **Tailwind CSS** for the kid-friendly visuals
- **Framer Motion** + **canvas-confetti** for delight
- **react-router-dom** for screens
- **vite-plugin-pwa** (Workbox) — installable + offline
- Progress saved in the browser's **localStorage** (no accounts, no backend)

---

## Run it locally

Requires **Node 18+**.

```bash
npm install      # first time only
npm run dev      # start the dev server → http://localhost:5173
```

Open the URL it prints. First launch shows Gyaan the Owl's welcome.

### Build & preview the production app

```bash
npm run build    # outputs to dist/ (includes the PWA service worker)
npm run preview  # serves the built app locally to test PWA/offline
```

> The service worker (offline caching) only runs in the **built** app, not in `npm run dev`.
> To test offline: `npm run build && npm run preview`, load it once online, then go offline.

---

## Deploy / re-deploy

The app is a static site — deploy the **`dist/`** folder to any static host.

Because it's a single-page app with client-side routes (`/quest/1`, `/trophy`, …), the host
must serve `index.html` for unknown paths. A [`public/_redirects`](public/_redirects) file is
included for Netlify; notes for other hosts below.

**Netlify** (easiest)
- Connect the repo (build command `npm run build`, publish dir `dist`), **or** drag-and-drop
  the `dist/` folder onto netlify.com. The included `_redirects` handles SPA routing.

**Vercel**
- Import the repo; it auto-detects Vite (build `npm run build`, output `dist`). Vercel's Vite
  preset serves `index.html` for client routes automatically.

**GitHub Pages**
- Set `base: '/<repo-name>/'` in `vite.config.js`, run `npm run build`, and publish `dist/`
  (e.g. with the `gh-pages` package). Copy `dist/index.html` to `dist/404.html` so deep links
  work.

**To re-deploy after any change:** `npm run build`, then re-upload / push. The PWA is set to
`autoUpdate`, so returning users get the new version automatically.

---

## Add or edit question content

Questions live in [`src/data/`](src/data) as one JSON file per day: `day-01.json … day-90.json`,
following the schema in [`src/data/schema.md`](src/data/schema.md).

- **Currently generated:** Days **1–20** and **68–74** (27 of 90). The remaining days can be
  added by creating `day-NN.json` files that follow the schema — the app loads any day whose
  file exists and shows "coming soon" for the rest.
- **12 questions** per normal day, **15** for boss/review days
  (7, 14, 21, 28, 30, 37, 44, 51, 57, 60, 67, 74, 81, 90).
- After editing content, no rebuild config is needed — just re-run `npm run dev` (or rebuild
  to deploy). There's a validator you can adapt from the test scripts to check new files.

---

## Regenerating the current-affairs days (important!)

Days **68–74** — and the "leaders now" **Day 72** — go stale. Each of those files carries a
top-level **`lastUpdated`** date. **Refresh them every couple of months:**

1. **Re-verify the facts** against up-to-date sources — current office-holders (President,
   Vice President, Prime Minister, Haryana CM, Chief Justice of India) and recent
   sports / space / awards events.
2. **Edit** the affected files in `src/data/` (`day-68.json` … `day-74.json`), updating any
   answers, options and fun facts that have changed.
3. **Bump `lastUpdated`** to today's date (ISO `YYYY-MM-DD`) in each file you touched.
4. **Rebuild & redeploy** (`npm run build`).

Questions that name a living office-holder say "(as of YYYY)" in the text, so a stale answer
is easy to spot. The quickest way to do this refresh is to hand the files to Claude Code with
an instruction to verify current office-holders/events and update them.

---

## Backing up progress

Progress is stored per-device in localStorage. On the Home screen, **⚙ Backup & restore**
lets you **Export** progress to a JSON file and **Import** it on another device — handy before
clearing browser data or moving to a new tablet.

---

## Project structure

```
src/
  components/   reusable UI (question types, mascot, badges, overlays, theme/sound sync)
  screens/      Home (journey map), Quest, Results, TrophyRoom, Shop, ParentDashboard, Settings
  game/         scoring, levels, streak, badges, progress engine, storage, shop, sound, journey
  data/         day-01.json … (question content) + schema.md
public/         icons, manifest assets, _redirects (SPA routing)
```

Parent Dashboard (behind a 4-digit PIN, via the 👪 button) shows progress, strongest/weakest
topics, and a toggle for **Practice Mode** (replay past days / random mixed quiz without
affecting the daily streak).
