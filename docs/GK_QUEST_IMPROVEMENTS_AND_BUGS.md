# GK Quest — Full Test Report: Bugs & Improvements (plain-English)

**Live app tested:** https://gkin90days.netlify.app/
**How it was tested:** real Chrome browser, screen by screen, playing as a 10-year-old would — onboarding, playing quizzes, earning coins, spending coins in the shop, trophies, parent area, settings. Every screen was exercised and every issue logged.
**Date:** 2026-08-18
**Detailed raw log:** see `STRESS_TEST_FINDINGS.md`

## The big picture (read this first)
The app is **genuinely good** and very kid-friendly. The map, the big Play button, tapping answers, the owl's encouragement, stars/coins, "Did you know?" facts, and the shop are all intuitive and delightful. The core loop **works**: play a quiz → earn coins & XP → level up → earn badges → spend coins on avatars/themes. Coin math is exact, badges fire correctly, and there were **no crashes and no error messages** anywhere.

But there are a **handful of real issues** — one is urgent (the live site is an old version), one hurts the core experience on phones (the "Finish" button), and one weakens the parent lock. Details below, most important first.

---

## 🔴 URGENT — Fix these first

### 1. The website is running an OLD version of your app
- **What's wrong:** The changes you asked for are **not live**. The website still has the old "🌙 Come back tomorrow!" rule — a kid can only play **one quiz per day**. Your request to allow **unlimited quizzes per day** is missing. (Proven: the live app's code still contains the old "come back tomorrow" logic; your newly-built version does not.)
- **What the kid sees:** After finishing today's quiz, the big button turns grey and says "Come back tomorrow!" — they can't keep playing.
- **The fix (2 minutes, no coding):** Re-upload your freshly-built `dist` folder (the `gkquest-dist.zip` I already sent) to your existing Netlify site → **Deploys** tab → drag the folder. This one step also delivers fix #2 below.
- **Everything else in this report was tested on the live (old) version.**

### 2. The "Finish"/"Next" button hides below the screen (the bug you reported before)
- **What's wrong:** After answering a question (especially the LAST one), the "Finish 🏁" button sits **below the visible area**. The app tries to auto-scroll to it but does so **too early** — before the "Did you know?" card finishes growing — so the button ends up off-screen again.
- **What the kid sees:** They tap where they think "Finish" is, nothing happens (it's off-screen), and they feel stuck / think the app is broken. Only scrolling down by hand reveals it.
- **Why your earlier fix wasn't enough:** the current auto-scroll runs at 80 milliseconds, but the answer feedback keeps expanding after that.
- **The best fix:** make the "Next/Finish" button a **sticky bar pinned to the bottom of the screen** so it's ALWAYS visible (no scrolling needed). Alternatively, scroll to it only *after* the feedback animation finishes.
- Note: your newest build may already behave differently — re-deploy (fix #1) and we should re-test this specifically.

---

## 🟠 IMPORTANT — Should fix soon

### 3. The Parent area can be bypassed via the Settings page
- **What's wrong:** Typing the address `…/settings` opens the Settings page **without asking for the Parent PIN**. From there anyone can change the child's name, turn sound off, and even **set a new Parent PIN** (it never asks for the old one).
- **What this means:** the parent lock isn't really a lock — a curious kid could reach settings directly, or even change the PIN and lock the parent out.
- **The fix:** require the Parent PIN to open Settings (same lock as the Parent Dashboard), and require the **current** PIN before allowing a PIN change.

### 4. "Not enough coins" is a dead button (kids get no feedback)
- **What's wrong:** In the shop, when a kid can't afford something, the buy button is simply **greyed out and does nothing**. There's a friendly "Not enough coins" message in the code, but it never shows because the button is disabled.
- **What the kid sees:** they tap an item they want, and… nothing. No explanation.
- **The fix:** let them tap it and show the friendly "Not enough coins — keep playing to earn more!" message. Much kinder feedback.

---

## 🟡 MINOR — Polish

### 5. The owl mascot covers part of the "Did you know?" fact
- On the feedback screen, the owl's speech bubble (bottom-right) overlaps the fact text, hiding a few words. Move the mascot or add spacing so the fact is always fully readable.

### 6. Parent Dashboard shows the same topic as BOTH "Strongest" and "Needs practice"
- Early on (with little data) it lists e.g. "States & Capitals — 100%" under *both* Strongest and Needs practice. A topic at 100% shouldn't be labeled "needs practice." Only show "Needs practice" for topics actually below a threshold, or hide it until there's enough data.

### 7. Low-contrast text on the dark "Space" theme
- When the Space theme is on, text that sits directly on the dark background (like "Progress for Aarav" and small footers) is hard to read. Ensure those texts stay light/high-contrast on dark themes.

### 8. Long name can overflow the welcome button (edge case)
- The name box correctly limits typing to 20 characters, but the "Let's go, [name]!" button doesn't clamp length, so an unusually long name (only possible by pasting past the limit) could overflow. Harmless for normal use; trivial to cap.

---

## 💡 KID-UX — as a 10-year-old using it

**What a kid instantly understands (great!):**
- The winding map and the glowing "Play" spot.
- Big, colourful answer buttons; tap to answer.
- Green ✓ / red ✗ and the gentle "Good try!" — never feels like failure. 👍
- Stars, coins, the owl cheering, and the "Did you know?" facts.
- The shop: pick an avatar, change the theme.

**What a kid might get confused by:**
- **In-quiz "💰 100"**: during a quiz the top shows "💰 100", but that's your *points so far*, not coins you can spend yet. A kid may think they already have 100 coins for the shop. Use a different icon/label for in-quiz score (e.g. ⭐ points) vs coins.
- **Finding "Finish"**: see bug #2 — they shouldn't have to scroll.
- **"Practice Mode" / Parent PIN**: these are adult concepts; fine to keep them in the parent area, just not kid-facing.

---

## ✅ What was verified working (so you know what's solid)
- Onboarding (name saved, welcome dismissed correctly).
- Journey map: worlds, locked/current/boss/finale markers, no sideways scrolling, completed days show stars.
- Quiz engine: all Day-1/Day-2 question types (multiple-choice, true/false, fill-in-the-blank, odd-one-out, **match pairs**), correct scoring, gentle wrong-answer handling, "Did you know?" on every question.
- **Coins EARNED:** Day 1 (1/12) → 15 coins; Day 2 (12/12 perfect) → +110 coins. Exact math. ✓
- **Coins SPENT:** bought a streak-freeze token, an avatar (equipped → character changed), a theme (equipped → background changed), and a fun-fact pack. Coins deducted exactly each time. ✓
- Badges: Perfect Score, Speed Demon, and Comeback Kid all awarded correctly.
- Levels: XP accumulates and rank goes up (reached "GK Star", Level 5).
- Trophy Room: rank, stats, earned vs locked badges all correct.
- Parent Dashboard: PIN create + mismatch validation + unlock, stats, Practice Mode toggle.
- Settings: name, sound toggle, save.
- No crashes, no console errors, fully responsive, works offline (PWA).

---

## ⚖️ One thing to consider (not a bug): XP is very generous
A single perfect, fast day gave **+3,275 XP**, jumping the player from Level 1 to **Level 5** in one day. Over 90 days the 9 ranks would be maxed almost immediately, so the "journey" from Rookie to Grandmaster loses its sense of progression. Consider raising the XP needed per rank (or capping XP per quiz) so levelling up stays exciting for the full 90 days.

---

## Suggested order of work
1. **Re-deploy the new build** (fixes the daily-limit; re-enables the Finish-button fix). — 2 min
2. Make **Finish/Next a sticky bottom bar**. — small
3. **Lock the Settings page** behind the PIN; require current PIN to change it. — small
4. Show a friendly **"Not enough coins"** message instead of a dead button. — small
5. Fix the **mascot/fact overlap** and the **"strongest = needs practice"** wording. — small
6. **Dark-theme text contrast** pass. — small
7. Re-tune **XP thresholds** so ranks feel earned. — tuning

---

# ✅ FIXES APPLIED (this session)
All issues below were fixed in the code and verified on a local build. Re-deploy the fresh `dist` to make them live.

| # | Issue | Status | What changed (files) |
|---|-------|--------|----------------------|
| 0 | Live site was an OLD build (daily-limit still on) | ✅ New build ready | Rebuilt `dist` — includes unlimited-quizzes/day + all fixes below. **You must re-deploy.** |
| 2 | "Finish/Next" hidden below the screen | ✅ Fixed & verified | `Quest.jsx`: Next/Finish is now a **sticky bottom bar** (always visible/tappable); feedback auto-scrolls to reveal the fact. |
| 3 | `/settings` bypassed the Parent PIN | ✅ Fixed & verified | New `ParentGate.jsx`; `Settings.jsx` + `ParentDashboard.jsx` now share one PIN lock (unlock once per session). Changing the PIN requires getting in first. |
| 4 | "Not enough coins" was a dead button | ✅ Fixed & verified | `Shop.jsx`: unaffordable items are tappable and show "Not enough coins". |
| 5 | Owl overlapped the "Did you know?" fact | ✅ Fixed & verified | `Quest.jsx` + `Mascot.jsx`: mascot speech bubble hidden during feedback, owl lifted above the action bar. |
| 6 | Dashboard: same topic as Strongest AND Needs practice | ✅ Fixed | `ParentDashboard.jsx`: "Needs practice" now only shows topics below 80% and not already a strength; friendly note when none. |
| 7 | Low-contrast text on dark "Space" theme | ✅ Fixed & verified | `ThemeApplier.jsx` adds `theme-dark`; `index.css` adds readable on-background text classes; applied on Home/Quest/Parent/Shop. Also fixed `bg-brand-mist` (was transparent — a latent bug) so stat tiles are light/readable everywhere (`tailwind.config.js`). |
| 8 | Long name could overflow the welcome button | ✅ Fixed | `Welcome.jsx`: displayed name clamped to 12 chars + "…". |
| ⚖️ | XP too generous (skipped levels) | ✅ Re-tuned | `levels.js`: rank thresholds raised so the Rookie→Grandmaster climb spans the 90 days. |
| 💡 | In-quiz "💰 100" looked like coins | ✅ Fixed | `Quest.jsx`: in-quiz score now shows ⭐ (points), distinct from 💰 coins. |

**Verified on local build:** sticky Finish button in viewport + tappable; fact revealed above the bar; ⭐ points pill; mascot bubble hidden on feedback; `/settings` blocked without PIN and unlocked with it (session-shared); "Not enough coins" message; dark-theme text readable; Parent Dashboard renders after refactor.
