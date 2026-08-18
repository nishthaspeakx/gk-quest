# GK Quest — End-to-End Stress Test & Kid-UX Findings

**App under test:** https://gkin90days.netlify.app/
**Tester lens:** a 10-year-old layman kid (+ QA edge cases)
**Started:** 2026-08-18
**Method:** real Chrome (browser extension), screen by screen, coins earned → spent, full loop.

> Severity key: 🔴 Blocker · 🟠 Major · 🟡 Minor · 🔵 Polish · 💡 Kid-UX (understandability)

---

## Live findings log (appended as I test)

### Environment / smoke
- [PASS] Loads over HTTPS, no console errors on first load. Viewport 375×812, no horizontal overflow (docWidth = 375).
- [PASS] PWA build served (service worker + manifest present).

### Screen 1 — Welcome / Onboarding
- [PASS] Owl intro, 4 bullets, name field, Start / Skip all render cleanly.
- [PASS] Name field `maxLength=20` caps typed/pasted input.
- 🟡 Button label echoes the raw name with no length clamp; an over-long value (only reachable programmatically/paste-past-max) makes the button text overflow. Real typing is safe.
- [PASS] "Start the Adventure" → saves childName + onboarded, dismisses overlay to Home.

### Screen 2 — Home / Journey Map
- [PASS] HUD (rank, XP bar, streak, coins), 3 nav buttons, 3 worlds, serpentine path.
- [PASS] Day 1 = current (purple pulse + PLAY); future days locked & `disabled` (verified Day 2, Day 7 non-interactive).
- [PASS] Boss days (7,14,21…) show gold ring + ⭐ badge; Day 90 shows 👑 finale marker.
- [PASS] No horizontal overflow across all worlds.
- [PASS] Backup & restore expands → Export / Import / Reset buttons present.

### Screen 3 — Quest (quiz engine)
- [PASS] Header (close, Day, theme, coins), progress "Question 1 of 12" + 0% (separate spans — NOT "of 120").
- [PASS] MCQ: correct answer turns green ✓, others muted, "Correct! +100" banner, coins→100, "Did you know?" fact, mascot "Great job!".
- 🟡 Corner mascot bubble overlaps the "Did you know?" fact text on the feedback screen (part of the fact is obscured). pointer-events-none, so no tap blocking — readability only.
- ⚠️ TO-VERIFY: Next/Finish button sits just below the fold (top≈821 vs vh 812) on feedback; app auto-scrolls it into view — must confirm a real kid can see/tap it (this was the earlier reported "Finish not clickable" area).

<!-- more appended below as testing continues -->

---

## 🟠 MAJOR BUG #1 — "Finish/Next" button lands below the fold (auto-scroll fails)
**Where:** Quest screen, feedback state (most visible on the LAST question → "Finish 🏁").
**Repro:** Answer a question → feedback appears (banner + "Did you know?" card). On shorter viewports the Next/Finish button renders below the visible area.
**Measured (live, Chrome):** viewport height 663px; Finish button at doc-y ~806. The app's auto-scroll (`scrollIntoView` at 80ms) only moved the page **45px** of the **330px** needed → button stayed off-screen (`visibleNow:false`). Manual scroll to bottom reveals it (top 475, clickable).
**Root cause (likely):** the feedback UI (banner + fun-fact card) animates *taller* via Framer Motion AFTER the 80ms auto-scroll runs, so the scroll target is stale and the button ends up below the fold again.
**Kid impact:** taps "Finish", nothing seems to happen (button is off-screen), feels stuck / like the app is broken. **This matches the earlier user-reported "clicked finish, not working" issue — the current fix is insufficient.**
**Recommended fix:** make the Next/Finish action a **sticky bottom bar** (always visible above the fold), OR run the scroll *after* the feedback animation completes (e.g., onAnimationComplete / larger delay / `requestAnimationFrame` loop until stable), OR reduce feedback height. Sticky bar is the robust fix.

## Quest — other observations
- [PASS] Wrong answer: chosen option red ❌, correct option green ✓, gentle "💛 Good try!" banner, fun-fact still shown. Great "never feel like failure" behavior.
- [PASS] Correct answer scores +100 (base), running coins pill updates. Last question shows "Finish 🏁" label correctly.
- 🟡 Corner mascot bubble overlaps the "Did you know?" fact text on feedback (readability).
- 💡 Kid-UX: the top-right pill shows "💰 100" DURING the quiz, but this is the running *points/score*, not spendable coins — a kid may think they already have 100 coins to spend. Consider labeling in-quest score differently (e.g. ⭐/points icon) vs coins.

---

## Screen 4 — Results  [PASS]
- [PASS] Shows stars (1★ for 1/12), +XP, +Coins, confetti, "🔥 1-day streak!", "📚 Today you learned…" recap. Even a 1/12 score ends positively ("Quest Complete!") — matches "always end on a high".

## Coins EARNED — verified end-to-end  [PASS]
- Day 1 (1/12 correct): coins 0 → **15** = 1×5 + 10 (1-star bonus). ✅ exact.
- Day 2 (12/12 perfect, fast): coins 15 → **125** = 12×5 + 50 (3-star bonus). ✅ exact.
- Badges awarded on Day 2: `perfect_score`, `speed_demon`, `comeback_kid` (comeback = 3-star right after a ≤1-star day — logic correct). ✅
- Gate advanced each day (currentDay 1→2→3); replay of a past day would grant no coins (by design).

## 💡 Balance observation (not a bug) — XP per perfect day is very high
- One perfect, fast Day 2 gave **+3275 XP**, vaulting the player from Level 1 (Rookie) straight to **Level 5 (GK Star)** in a single day.
- Cause: base 100 × combo (up to ×3) × 12 questions + speed bonus on every question. (Automated answers were instant → max speed bonus; a real kid earns less, but combo alone still stacks fast.)
- Effect: the 9-rank ladder can be skipped several levels at once, making early ranks feel trivial. Consider re-tuning XP thresholds upward, or capping per-quest XP, if the rank journey should feel earned across 90 days.

## Screen 5 — Shop / Coins SPENT — verified end-to-end  [PASS]
> (Earning proven with real play above; coins topped up via localStorage to 1000 only to exercise the pricier buy/equip flows.)
- [PASS] Buy Streak Freeze token: coins 125 → 25, freezeTokens 0 → 1 (exact).
- [PASS] Buy avatar "Clever Fox" (150): coins −150, `ownedItems:['fox']`. Equip → `avatar:'fox'`.
- [PASS] Buy theme "Outer Space" (250): coins −250, owned. Equip → `theme:'space'` AND page background switched to the dark space gradient (ThemeApplier live-applies).
- [PASS] Buy fun-fact pack "Animal Facts" (120): coins −120, owned → shows "Collected".
- [PASS] Coin math across the whole session is exact (1000 → 480 after 150+250+120).
- [PASS] Affordability gating: items you can't afford have their Buy button **disabled/greyed** (verified Clever Fox at 125 coins).
- 🔵 Minor/dead-code: the "Not enough coins" flash in `buy()` is effectively unreachable because the Buy button is `disabled` whenever you can't afford it — so a kid never sees that message (they just can't tap). Consider keeping the button tappable and showing the friendly "Not enough coins" hint (better feedback than a dead button).
- 🐛 Harness note (NOT an app bug): the post-purchase "Unlocked! 🎉" flash replaces the Equip control for ~1.4s; and multiple owned-unequipped items yield multiple "Equip" buttons — automation must target the specific card. Both behave correctly for a human.

---

## 🔴 BLOCKER #0 (deployment) — LIVE SITE IS RUNNING AN OLD BUILD
**Evidence:** The live bundle `https://gkin90days.netlify.app/assets/index-DsbHFmEW.js` still contains the strings **"Come back tomorrow"** and **"already_today"** (1 each). The freshly-built local `dist/assets/index-BXixqLsA.js` contains **0** of each.
**Impact:** The changes you asked for are **NOT on the live site**:
  1. ❌ "Remove one-quiz-per-day gate (unlimited quizzes/day)" — live site STILL shows "🌙 Come back tomorrow!" and blocks a second quiz the same day. (Reproduced: after finishing Day 2 today, the Play button became "🌙 Come back tomorrow!" and Day 3 is gated.)
  2. ❌ The latest Finish/Next button handling.
**Fix:** Re-deploy the fresh `dist/` (the `gkquest-dist.zip` already provided) to the SAME Netlify site (Deploys tab → drag `dist`). Everything below was tested against the live (old) build unless noted.
**Note:** Because the live build enforces the daily gate, "coins earned per day" on the live site is effectively capped at one quiz/day — the new build removes that.

## Equip persistence
- [PASS] Equip avatar (fox) and equip theme (space) both persist to localStorage and across navigation; buying a new theme does NOT reset the avatar (tested).
- 🟡 Observed ONCE (not reproducible): after a burst of rapid buy/equip clicks, the avatar appeared to revert to `gyaan` while the theme change stuck. Could not reproduce deliberately. Low confidence — worth a quick code check that `updateProgress`/`purchase` always merge from the freshest ref (no stale overwrite) when several equips happen in quick succession.

## Screen 6 — Parent Dashboard  [mostly PASS]
- [PASS] PIN gate: first-time create asks PIN + confirm; mismatch shows "The two PINs don't match." and disables Create; matching PIN creates + unlocks. PIN saved.
- [PASS] Dashboard stats accurate (2 days, 2.0★ avg, 1🔥, 24 questions). Practice Mode toggle works (practiceMode true→ shows Practice on Home).
- 💡 "Strongest" and "Needs practice" both list the SAME topic ("States & Capitals 100%") when only one topic has ≥3 attempts — a 100% topic under "Needs practice" is misleading.
- 💡 Contrast: on the dark "space" theme, text sitting on the background (e.g. "Progress for Aarav", footer line) is low-contrast/hard to read.

## Screen 7 — Settings  [1 major issue]
- [PASS] Child name shows current value; Sound effects toggle works (on→off persisted); Save works.
- 🟠 MAJOR: `/settings` loads directly by URL with **NO PIN prompt**. A child can open it and change the name, sound, and **reset the Parent PIN** (it only asks for a NEW pin, never the current) — bypassing the whole parent lock. Gate `/settings` behind the PIN (or only reach it from the already-unlocked dashboard, and require current PIN to change PIN).

## Cross-cutting / kid-UX
- 💡 Desktop/wide screens: the app is a narrow phone-width column centered on a plain (or dark, when themed) background — fine for phones (the target), a bit bare on laptops.
- [PASS] No console errors observed across any screen. No horizontal scrolling. Animations smooth.
- 💡 A 10-year-old will understand: the map, big Play button, tapping answers, stars/coins, the owl's encouragement, "Did you know?" facts, the shop. Very intuitive.
- 💡 A 10-year-old may NOT understand / may trip on: the in-quiz "💰 100" being points (not spendable coins yet); scrolling down to find "Finish"; the Parent PIN screen (that's for adults); "Practice Mode" wording.
