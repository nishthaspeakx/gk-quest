# CLAUDE.md — GK Quest

Project context for Claude Code. Full design lives in [GK-Quest-App-Plan.md](GK-Quest-App-Plan.md).

## Concept

A daily, gamified **General Knowledge** web game for **one Class 5 student (~10 y/o) in Gurugram, Haryana, India**. A **90-day adventure**: one themed "quest" per day, **10–15 questions** (5–10 min), earning coins/XP/badges/levels, growing from **GK Rookie → GK Grandmaster**.

**Design principles:**
- **Short & daily** — one quest/day; a "Come back tomorrow!" gate protects the rhythm (parent can unlock Practice Mode).
- **Always end on a high** — every quest closes with a celebration + "Today you learned…" recap. Never feel like failure.
- **Learn from mistakes gently** — wrong answer shows the correct one + a "Did you know?" fact; question returns on a later review day.
- **Same fact, many games** — reiterate a fact via different formats over time (repetition through variety).
- **India-first, world-aware** — heavy on India/Haryana/current affairs, strong world-GK strand.
- **Content:** age-appropriate, Class-5-and-a-bit-beyond. Mascot: **Gyaan the Owl 🦉** guides, hints, reacts, delivers facts.

## Gamification System

- **XP** — permanent score, drives levels (accumulates across all 90 days).
- **Coins** — spendable currency for the shop (cosmetics only, never gates learning).
- **Stars** — per-quest rating (1/2/3) based on correct answers; the number to chase ("3-star every day").
- **Combo multiplier** (2×, 3×) for answer streaks within a quest; small **speed bonus** for quick answers.
- **Levels (9 ranks):** 1 GK Rookie (0 XP) · 2 Explorer (300) · 3 Scout (800) · 4 Whiz (1,600) · 5 Star (2,800) · 6 Expert (4,500) · 7 Master (7,000) · 8 Champion (10,000) · 9 Grandmaster (14,000). *Thresholds tunable.* Level-up = full-screen confetti moment.
- **Streaks 🔥** — consecutive days; milestones at 3/7/14/30/60/90 award badges + coin bonus. **Streak-freeze token** forgives one missed day.
- **Badges/Awards:**
  - *Topic mastery* — Capital King, Science Star, History Hero, Sports Champ, Nature Ranger, Current-Affairs Ace, Space Cadet…
  - *Performance* — Perfect Score, Speed Demon, Comeback Kid, No-Hint Hero.
  - *Consistency* — streak milestones + Month 1/2/3 Complete medals.
  - *Grand* — 90-Day Champion Trophy + printable **certificate** with his name.
  - **Trophy Room** shows earned + locked silhouettes (locked = motivating).
- **Coin Shop** — avatar customisation, theme skins (space/jungle/ocean), streak-freeze tokens, fun-fact card packs. Pure delight, cosmetic only.

## Screens

- **Home / Journey Map** — winding 90-step path across 3 "worlds" (one per month); shows level/rank, coins, streak flame, big "Play Day N" button. Completed days show stars; current pulses; future locked. ~Every 7th day = **Boss Quiz**; end of month = **Grand Review**; Day 90 = **Ultimate GK Championship**.
- **Quest** — one question at a time, big tappable answers, mascot in corner, progress bar, live points, instant feedback + "Did you know?" fact.
- **Results / Celebration** — stars, XP, coins, new-badge reveal, "Today you learned…" recap, confetti.
- **Trophy Room** — all badges (earned + locked), rank progress, best streak, days completed, total questions.
- **Shop** — spend coins on cosmetics.
- **Parent Dashboard** (light PIN) — days completed, avg stars, strongest/weakest topics, streak, and a button to unlock **Practice Mode** (replay past days / random mixed quiz).

## Question Formats

Mix 3–4 per day so no two feel the same: **Classic MCQ** (workhorse), **True/False**, **Image MCQ**, **Match the pairs**, **Fill in the blank** (word bank), **Odd one out**, **Sequence/arrange**, **Rapid fire** (timed, for boss days & finale). *Nice-to-have:* **tap-the-map**. Every question carries a "Did you know?" fact shown after answering.

## 90-Day Curriculum

Difficulty rises gently; topics deliberately **repeat harder** in later days. Claude generates 10–15 questions per day against these themes.

**World 1 — Bharat Basics (Days 1–30):** national symbols; States & Capitals (N/S/E/W/NE+UTs); how India is run; **Haryana/Gurugram/Delhi-NCR (Day 5)**; rivers, mountains & landforms; monuments; festivals; human body, plants, animals, solar system, water/air/weather, nutrition; freedom fighters, Gandhi, ancient empires, Indian scientists, sports legends, dance/music/art; currency. Bosses: Days **7, 14, 21, 28**; **Day 30 = Month 1 Grand Review**.

**World 2 — World Explorer (Days 31–60):** continents & oceans; world capitals (easy → tricky); landmarks; currencies & flags; space/planets, astronauts (ISRO/NASA/Chandrayaan); inventions, discoveries, computers, simple physics; world history, world leaders, famous personalities, Nobel, books & authors, entertainment; wild animals, birds & sea creatures, environment/parks, endangered species/climate, weather wonders; world festivals & languages. Bosses: **37, 44, 51, 57**; **Day 60 = Month 2 Grand Review**.

**World 3 — Champion's Arena (Days 61–90):** sports (Olympics, cricket, football, records); awards (India Bharat Ratna/Padma; world Nobel/Oscar/Grammy); current affairs (India/world/sports-science/appointments) + leaders-now refresh + important days; difficult capitals, abbreviations, logos/mascots, brain teasers, maths fun facts, riddles; mixed master challenges (Geography/Science/India/World/Sports/Current Affairs); rapid-fire 100-fact recaps. Bosses: **67, 74, 81**; **Day 90 = 🏆 Grand Finale — Ultimate GK Championship**.

> **Current affairs (Days 68–74) + "leaders now" (Day 72):** these go stale. Each of these files carries a top-level **`lastUpdated`** date (ISO `YYYY-MM-DD`). **⚠️ Regenerate them every couple of months** to stay current: re-verify current office-holders (President, Vice President, PM, Haryana CM, Chief Justice of India) and recent sports/space/awards events against up-to-date web sources *before* rewriting, then bump `lastUpdated`. Questions naming a living office-holder include "(as of YYYY)" so stale answers are obvious. Last verified & written: **2026-07-26**.

## Tech Stack

- **Framework:** React + **Vite** (JavaScript, not TypeScript).
- **Styling:** **Tailwind CSS** — kid-friendly theme (rounded corners, big buttons, playful fonts Baloo 2 / Fredoka, bright-but-soft palette). See [tailwind.config.js](tailwind.config.js), [src/index.css](src/index.css).
- **Delight:** **Framer Motion** (transitions) + **canvas-confetti** (celebrations); optional light sound effects.
- **Routing:** **react-router-dom**.
- **Content:** questions as plain **JSON**, one file per day (`day-01.json`…`day-90.json`), fixed schema — easy to edit/regenerate.
- **Progress:** browser **localStorage** — no accounts, no server. Include optional export/import-progress for backup/move.
- **Installable:** lightweight **PWA** (Add to Home Screen, full-screen, offline).
- **Hosting:** free — Netlify / Vercel / GitHub Pages.
- **Optional later:** tiny cloud backend (e.g. Firebase) for multi-device sync, notifications, second child — keep data layer clean so it can be added without a rewrite.

## Project Structure

```
src/
  components/   reusable UI (buttons, cards, mascot, badges, progress bars)
  screens/      full screens (Home = Journey Map, Quest, Results, TrophyRoom, Shop, ParentDashboard)
  data/         day-01.json … day-90.json question files
  game/         scoring, XP/levels, badges, streaks, coin shop, localStorage
  assets/       images, icons, sounds
```

Run dev server: `npm run dev` (http://localhost:5173).

## Working Conventions

- Keep it **simple** (JS, no TS). Match existing kid-friendly Tailwind classes: `.btn-primary`, `.btn-answer`, `.card-fun`, `.pill`.
- Content must stay **age-appropriate** and **India-first**.
- Never let the child end a quest feeling he failed; always show a fact + encouragement on wrong answers.
