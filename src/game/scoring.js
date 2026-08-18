// Scoring engine for GK Quest.
// Correct answers earn base points, a small speed bonus for answering quickly,
// and a combo multiplier that grows with consecutive correct answers.

export const BASE_POINTS = 100
export const MAX_SPEED_BONUS = 50
// Answer within this many ms for the full speed bonus; it fades linearly to 0.
export const SPEED_WINDOW_MS = 8000

// Coins are the spendable currency (XP is the permanent score that drives levels).
export const COINS_PER_CORRECT = 5
// Extra coins for the quest's star rating (index by star count 0–3).
export const STAR_COIN_BONUS = { 0: 0, 1: 10, 2: 25, 3: 50 }

// `streak` = number of consecutive correct answers INCLUDING the current one.
// 1–2 in a row -> 1x, 3–4 -> 2x, 5+ -> 3x.
export function comboMultiplier(streak) {
  if (streak >= 5) return 3
  if (streak >= 3) return 2
  return 1
}

// Faster answers earn a bigger bonus (0 once the window has passed).
export function speedBonus(elapsedMs) {
  if (elapsedMs >= SPEED_WINDOW_MS) return 0
  const fraction = 1 - elapsedMs / SPEED_WINDOW_MS
  return Math.round((MAX_SPEED_BONUS * fraction) / 5) * 5 // round to nearest 5, looks tidy
}

// Returns a full breakdown so the feedback screen can show "+150  🔥 2×".
export function scoreForAnswer({ correct, streak, elapsedMs }) {
  if (!correct) {
    return { points: 0, base: 0, bonus: 0, multiplier: 1 }
  }
  const multiplier = comboMultiplier(streak)
  const base = BASE_POINTS
  const bonus = speedBonus(elapsedMs)
  const points = (base + bonus) * multiplier
  return { points, base, bonus, multiplier }
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
