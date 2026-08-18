# GK Quest — 90-Day GK Champion Challenge
### Full App Plan & Design Document

A daily, gamified General Knowledge game for a Class 5 student in Gurgaon, Haryana. Ten to fifteen fresh questions every day for 90 days, wrapped in a game the child *wants* to open — points, streaks, badges, level-ups, and a celebration at the end of every quest so he always finishes feeling like he learned something.

This document is the **design**. Its companion, *GK Quest — Claude Code Build Guide*, turns this design into step-by-step instructions you paste into Claude Code to build the app.

---

## 1. The Idea in One Line

> A 90-day adventure where your child unlocks one themed "quest" per day, answers 10–15 fun questions, earns coins, badges and levels, and grows from **GK Rookie** to **GK Grandmaster**.

The whole thing is built so a 10-year-old feels progress *every single day* and a parent can see, at a glance, what he has learned and how consistent he has been.

---

## 2. Who It's For & The Design Principles

The player is roughly 10 years old, reads English comfortably, and lives in Gurgaon (Haryana / Delhi-NCR). The content is tuned to what a bright Class 5 child in India is expected to know and a little beyond, so it stretches him without frustrating him.

A few principles guide every decision below:

**Short and daily.** One quest a day, 10–15 questions, done in 5–10 minutes. Long enough to matter, short enough to never feel like homework. A visible "Come back tomorrow!" gate protects the daily rhythm (with a parent-controlled practice mode for extra play).

**Always end on a high.** Every quest closes with a celebration screen — stars, coins, confetti, a new badge — and a short "Today you learned…" recap of 3–4 key facts. He should never close the app feeling he failed.

**Learn from mistakes, gently.** A wrong answer is never a dead end. He sees the correct answer immediately with a one-line "Did you know?" fact, earns partial encouragement, and the question comes back in a later review day.

**Same fact, many games.** The brief asks for facts "reiterated in different ways" — so the app teaches, say, *the capital of Australia* as a multiple-choice question one week, a map/flag match another, and a rapid-fire card in the finale. Repetition through variety is how it sticks.

**India-first, world-aware.** Heavy on India, Haryana and current affairs, but with a strong world-GK strand so he's well-rounded.

---

## 3. Gamification System

This is the engine that keeps him coming back. Everything he does earns something visible.

### Points, coins and stars

Every correct answer earns **XP** (experience points) and **coins**. A quick answer earns a small speed bonus; a run of correct answers in a row inside one quest builds a **combo multiplier** (2×, 3×). At the end of a quest he gets a **star rating** for the day — 1, 2 or 3 stars based on how many he got right — which is the single number he'll chase to "3-star every day."

Coins are the spendable currency (see the shop below); XP is the permanent score that drives levelling.

### Levels — the growth ladder

XP accumulates across all 90 days and moves him up a ladder of ranks. Suggested ladder (thresholds are tunable):

| Level | Rank title | XP needed |
|------|-------------|-----------|
| 1 | GK Rookie | 0 |
| 2 | GK Explorer | 300 |
| 3 | GK Scout | 800 |
| 4 | GK Whiz | 1,600 |
| 5 | GK Star | 2,800 |
| 6 | GK Expert | 4,500 |
| 7 | GK Master | 7,000 |
| 8 | GK Champion | 10,000 |
| 9 | GK Grandmaster | 14,000 |

Every level-up is a full-screen moment with confetti and the new rank badge.

### Streaks — the habit builder

A **daily streak** counter (a flame 🔥) counts consecutive days played. Milestones (3, 7, 14, 30, 60, 90 days) each award a special badge and a coin bonus. A gentle "streak freeze" token (earned occasionally) forgives one missed day so a single slip doesn't crush a month of effort — important for a child.

### Badges & Awards — the trophy shelf

Badges are the "awards so he feels he learned something." They fall into groups:

*Topic mastery badges* — earned by scoring well on a theme: **Capital King** (geography), **Science Star**, **History Hero**, **Sports Champ**, **Nature Ranger**, **Current-Affairs Ace**, **Space Cadet**, and so on.

*Performance badges* — **Perfect Score** (all correct in a quest), **Speed Demon** (fast + accurate), **Comeback Kid** (bounce back after a low-star day), **No-Hint Hero**.

*Consistency badges* — the streak milestones above, plus **Month 1/2/3 Complete** medals.

*Grand awards* — the **90-Day Champion Trophy** for finishing the journey, and a printable/downloadable **certificate** with his name.

A dedicated **Trophy Room** screen displays everything earned, with locked silhouettes for ones still to come (locked badges are motivating — he can see what's next).

### The Coin Shop — spending the reward

Coins buy purely cosmetic, kid-pleasing things so there's a reason to keep earning: **avatar customisation** (characters, hats, colours), **theme skins** for the app (space, jungle, ocean), **streak-freeze tokens**, and **"fun fact card packs"** he can collect. Nothing that gates learning — the shop is pure delight.

### The mascot

A friendly guide character — suggested: **Gyaan the Owl** 🦉 — cheers him on, gives hints, reacts to right/wrong answers, and delivers the daily "Did you know?" facts. A mascot gives the app personality and makes feedback feel warm rather than like grading. (Name and character are easily changed.)

---

## 4. The Journey Map (Home Screen)

Instead of a boring list of days, the home screen is a **winding adventure path** of 90 stepping-stones grouped into three "worlds," one per month:

- **World 1 — Bharat Basics** (Days 1–30): India, Haryana, national symbols, states & capitals, foundational science, our people & past.
- **World 2 — World Explorer** (Days 31–60): continents, world capitals, space, inventions, world history & personalities, nature.
- **World 3 — Champion's Arena** (Days 61–90): sports, awards, current affairs, tricky/difficult rounds, brain teasers, and grand mixed challenges leading to the finale.

Completed days show their star rating; the current day pulses invitingly; future days are locked. Roughly every 7th day is a **Boss Quiz** (a mixed-review milestone with a bigger reward), and the end of each month is a **Grand Review**. Day 90 is the **Ultimate GK Championship**.

---

## 5. Question Formats (variety keeps it fresh)

The quiz engine supports several formats and mixes 3–4 of them within each day so no two questions feel the same:

**Classic MCQ** — a question with four tappable options, one correct. The workhorse.

**True / False** — quick "Is this true?" cards, great for facts and myths.

**Image MCQ** — "Which one is the Rashtrapati Bhavan?" / identify the flag, animal, monument, or leader from pictures.

**Match the pairs** — tap to connect states↔capitals, countries↔currencies, inventions↔inventors.

**Fill in the blank** — tap the missing word from a word bank ("The national animal of India is the ___").

**Odd one out** — spot the item that doesn't belong ("Which is NOT a river? Ganga, Yamuna, Everest, Godavari").

**Sequence / arrange** — put things in order (planets by distance, events by time).

**Rapid fire** — a timed round of quick cards, used in boss days and the finale for extra excitement.

An optional advanced format is a **tap-the-map** question (tap the correct state on a simple India map); the build guide marks it as a nice-to-have so it doesn't hold up the core app.

Every question carries a short **"Did you know?" fact** shown after answering — this is what makes him feel he learned something specific each time.

---

## 6. The 90-Day Curriculum Calendar

A concrete day-by-day theme plan so the content is coherent, spirals in difficulty, and covers "each and every topic." Claude Code will generate 10–15 questions for each day against these themes. Difficulty rises gently across the three worlds, and topics deliberately **repeat in later days at a harder level** (e.g. capitals appear easy in Week 2 and "difficult" in Week 11).

### World 1 — Bharat Basics (Days 1–30)

| Day | Theme |
|----|-------|
| 1 | Getting to know India — national symbols (flag, anthem, emblem) |
| 2 | Indian States & Capitals — North India (easy) |
| 3 | Indian States & Capitals — South India (easy) |
| 4 | How India is run — President, Prime Minister, Parliament (simple) |
| 5 | **Our home** — Haryana, Gurugram, the Chief Minister, Delhi-NCR |
| 6 | National symbols deep — animal, bird, flower, tree, fruit, sport |
| 7 | ⭐ BOSS: India Basics Mix |
| 8 | Rivers of India |
| 9 | Mountains, deserts & landforms of India |
| 10 | Indian States & Capitals — East & West |
| 11 | States & Capitals — North-East + Union Territories (harder) |
| 12 | Famous Indian monuments |
| 13 | Festivals of India |
| 14 | ⭐ BOSS: Indian Geography & Culture |
| 15 | The human body — basics |
| 16 | Plants around us |
| 17 | Animals — mammals, birds, reptiles |
| 18 | Our solar system |
| 19 | Water, air & weather |
| 20 | Food, nutrition & staying healthy |
| 21 | ⭐ BOSS: Science Starter |
| 22 | Freedom fighters of India |
| 23 | Mahatma Gandhi & the freedom struggle |
| 24 | Ancient India & great empires |
| 25 | Indian scientists & inventors |
| 26 | Indian sports legends |
| 27 | Indian dance, music & art forms |
| 28 | ⭐ BOSS: India — People & Past |
| 29 | Indian currency & money basics |
| 30 | 🏆 MONTH 1 GRAND REVIEW |

### World 2 — World Explorer (Days 31–60)

| Day | Theme |
|----|-------|
| 31 | Continents & oceans |
| 32 | World capitals — easy (USA, UK, France, Japan…) |
| 33 | World capitals — tricky (Australia, Canada, Turkey…) |
| 34 | Famous world landmarks & wonders |
| 35 | Countries & their currencies |
| 36 | Countries & their flags |
| 37 | ⭐ BOSS: World Geography |
| 38 | Space & the universe — planets in depth |
| 39 | Astronauts & missions — ISRO, NASA, Chandrayaan |
| 40 | Great inventions & inventors |
| 41 | Great discoveries & world scientists |
| 42 | Computers & technology basics |
| 43 | Simple physics — force, light, sound |
| 44 | ⭐ BOSS: Science & Space |
| 45 | World history highlights (kid-friendly) |
| 46 | World leaders today (age-appropriate) |
| 47 | Famous personalities of the world |
| 48 | The Nobel Prize & great achievers |
| 49 | Books & their authors |
| 50 | Movies, music & entertainment (age-appropriate) |
| 51 | ⭐ BOSS: World — People & Achievements |
| 52 | Wild animals of the world |
| 53 | Birds & sea creatures |
| 54 | Environment, national parks & conservation |
| 55 | Endangered species & climate basics |
| 56 | Weather & natural wonders |
| 57 | ⭐ BOSS: Nature & Environment |
| 58 | Festivals & cultures of the world |
| 59 | Languages of India & the world |
| 60 | 🏆 MONTH 2 GRAND REVIEW |

### World 3 — Champion's Arena (Days 61–90)

| Day | Theme |
|----|-------|
| 61 | Sports — the Olympics |
| 62 | Sports — cricket (deeper) |
| 63 | Sports — football & other games |
| 64 | Sports awards & records |
| 65 | Awards & honours — India (Bharat Ratna, Padma, gallantry) |
| 66 | Awards & honours — world (Nobel, Oscar, Grammy basics) |
| 67 | ⭐ BOSS: Sports & Awards |
| 68 | Current affairs — India (recent, kid-appropriate) |
| 69 | Current affairs — world |
| 70 | Current affairs — sports & science news |
| 71 | Current affairs — awards & new appointments (who's who now) |
| 72 | Leaders now — PM, President, Haryana CM (refresh) |
| 73 | Important days & dates (national & international) |
| 74 | ⭐ BOSS: Current Affairs |
| 75 | Difficult capitals — India & world mix |
| 76 | Abbreviations & full forms |
| 77 | Logos, symbols & mascots |
| 78 | Brain teasers & logical reasoning |
| 79 | Number & maths fun facts |
| 80 | Riddles & word play |
| 81 | ⭐ BOSS: Brain Power |
| 82 | Mixed master challenge — Geography |
| 83 | Mixed master challenge — Science |
| 84 | Mixed master challenge — India |
| 85 | Mixed master challenge — World |
| 86 | Mixed master challenge — Sports & Culture |
| 87 | Mixed master challenge — Current Affairs |
| 88 | Rapid-fire recap — 100 quick facts (part 1) |
| 89 | Rapid-fire recap — 100 quick facts (part 2) |
| 90 | 🏆 GRAND FINALE — The Ultimate GK Championship |

> **Note on current affairs (Days 68–74):** current affairs go stale. The build guide instructs Claude Code to generate these with a *dated* note and to keep them as easily-refreshable files, and it suggests a simple monthly "regenerate current affairs" step so this stays accurate over time.

---

## 7. Screens (what the app actually looks like)

The app is a handful of clean, colourful, big-button screens:

**Home / Journey Map** — the winding 90-day path, current level and rank, coin balance, streak flame, and a big "Play Day N" button.

**Quest screen** — one question at a time, big tappable answers, the mascot in a corner, a progress bar of questions, live points. Instant feedback animation on answer with the "Did you know?" fact.

**Results / celebration** — stars earned, XP and coins gained, any new badges (with a reveal animation), a "Today you learned…" recap of key facts, and confetti. Buttons to see the Trophy Room or return home.

**Trophy Room** — all badges (earned + locked), current rank progress bar, best streak, days completed, total questions answered.

**Shop** — spend coins on avatars, themes, and fun-fact packs.

**Parent Dashboard** (PIN-lightly protected) — a simple view of days completed, average stars, strongest and weakest topics, current streak, and a button to unlock **Practice Mode** (replay past days or a random mixed quiz for extra play without breaking the one-quest-a-day design). This directly answers "so I know he learned something."

---

## 8. Technology Choices

Chosen so the app is easy for Claude Code to build, free to host, works on any device (tablet, laptop, phone), needs no login, and is simple for you to run and update.

**Framework:** React with **Vite** (fast, standard, well-supported).
**Styling:** **Tailwind CSS** for quick, consistent, kid-friendly visuals.
**Animation & delight:** **Framer Motion** for transitions and **canvas-confetti** for celebrations; optional light sound effects.
**Content:** all questions stored as plain **JSON files** (one per day, `day-01.json` … `day-90.json`) following a fixed schema — easy to read, edit, and regenerate.
**Saving progress:** the browser's **localStorage** on the device — no accounts, no server, nothing to sign up for. (Progress lives on that device; the build guide includes an optional "export/import progress" button so it can be backed up or moved.)
**Installable feel:** a lightweight **PWA** setup so it can be "Added to Home Screen" on a tablet and open full-screen like a real app, even offline.
**Hosting:** deploy free to **Netlify**, **Vercel**, or **GitHub Pages** — the child just opens a link or the home-screen icon.

This stack means: no monthly cost, no backend to maintain, and updates are as simple as re-running Claude Code and re-deploying.

**Optional upgrade path (later, if wanted):** add a tiny cloud backend (e.g. Firebase) for multi-device sync, real notifications ("Your quest is ready!"), and a second child's profile. The build guide keeps the data layer clean so this can be added without a rewrite.

---

## 9. What "Done" Looks Like

A finished GK Quest is: a link/icon your son opens each day; a colourful map showing his 90-day journey; a daily quest of 10–15 varied questions on the day's theme; points, coins, streaks, levels and badges that make him want to return; a celebration and a "you learned this" recap every time; a trophy room and certificate to be proud of; and a parent dashboard that shows you he's actually learning. All 90 days of India-first, age-appropriate content, generated and ready.

The companion **Build Guide** is how you get there — hand it to Claude Code and follow the phases.
