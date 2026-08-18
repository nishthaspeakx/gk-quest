import { dayDiff } from './dates'

// Daily-streak configuration (all tunable).
export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 90]
export const STREAK_COIN_BONUS = { 3: 20, 7: 50, 14: 75, 30: 150, 60: 300, 90: 500 }
// Reaching these milestones also grants a "streak freeze" token.
export const FREEZE_TOKEN_AT = new Set([7, 30, 60])

// Given the previous streak state and today's date, work out the new streak.
// A single missed day is forgiven if a freeze token is available.
export function updateStreak({ streak, lastDate, freezeTokens }, today) {
  if (!lastDate) {
    return { streak: 1, freezeTokens, usedFreeze: false }
  }
  const diff = dayDiff(lastDate, today)
  if (diff <= 0) {
    // Same calendar day (shouldn't happen behind the gate) — leave it be.
    return { streak, freezeTokens, usedFreeze: false }
  }
  if (diff === 1) {
    return { streak: streak + 1, freezeTokens, usedFreeze: false }
  }
  if (diff === 2 && freezeTokens > 0) {
    // Missed exactly one day, but a freeze token saves the streak.
    return { streak: streak + 1, freezeTokens: freezeTokens - 1, usedFreeze: true }
  }
  // Missed too many days — start over.
  return { streak: 1, freezeTokens, usedFreeze: false }
}

// Did we just land on a milestone? Returns { milestone, coinBonus, freezeAwarded } or null.
export function streakMilestone(newStreak) {
  if (!STREAK_MILESTONES.includes(newStreak)) return null
  return {
    milestone: newStreak,
    coinBonus: STREAK_COIN_BONUS[newStreak] || 0,
    freezeAwarded: FREEZE_TOKEN_AT.has(newStreak),
  }
}
