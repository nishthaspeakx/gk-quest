// Reward engine for GK Quest — ONE currency: COINS.
//
// Every correct answer earns coins: a base amount, plus a small speed bonus for
// answering quickly, multiplied by a combo that grows with consecutive correct
// answers. The coins you watch climb during a quest are EXACTLY what you can
// spend in the Shop — and the same total also fills your level bar (XP = the
// lifetime coins you have earned). No confusing second number.

export const BASE_COINS = 10
export const MAX_SPEED_BONUS = 5
// Answer within this many ms for the full speed bonus; it fades linearly to 0.
export const SPEED_WINDOW_MS = 8000

// Extra coins awarded at the end of a quest for its star rating (0–3 stars).
export const STAR_COIN_BONUS = { 0: 0, 1: 25, 2: 60, 3: 120 }

// `streak` = number of consecutive correct answers INCLUDING the current one.
// 1–2 in a row -> 1x, 3–4 -> 2x, 5+ -> 3x.
export function comboMultiplier(streak) {
  if (streak >= 5) return 3
  if (streak >= 3) return 2
  return 1
}

// Faster answers earn a small bonus (0 once the window has passed).
export function speedBonus(elapsedMs) {
  if (elapsedMs >= SPEED_WINDOW_MS) return 0
  const fraction = 1 - elapsedMs / SPEED_WINDOW_MS
  return Math.round(MAX_SPEED_BONUS * fraction)
}

// Coins for a single answer, with a full breakdown for the feedback banner
// (e.g. "+30 💰  ⚡5  ×2").
export function scoreForAnswer({ correct, streak, elapsedMs }) {
  if (!correct) {
    return { coins: 0, base: 0, bonus: 0, multiplier: 1 }
  }
  const multiplier = comboMultiplier(streak)
  const base = BASE_COINS
  const bonus = speedBonus(elapsedMs)
  const coins = (base + bonus) * multiplier
  return { coins, base, bonus, multiplier }
}

// Star rating for a whole quest, based on the share of correct answers.
// Finishing a quest always earns at least 1 star — the app should never let a
// child close a completed quest feeling like they failed.
export function starsForResult(correctCount, total) {
  if (total === 0) return 0
  const pct = correctCount / total
  if (pct >= 0.9) return 3
  if (pct >= 0.6) return 2
  return 1
}
