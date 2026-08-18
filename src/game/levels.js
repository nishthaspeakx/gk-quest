// The growth ladder: XP thresholds and rank titles from the app plan.
// Thresholds are tunable — edit the `xp` values to rebalance progression.

// XP = the lifetime coins the player has earned (coins are the one currency;
// spending them in the shop does NOT lower XP). Thresholds are tuned to that
// coin scale: a good first day (~400–500 coins) reaches Explorer for an early
// win, while Grandmaster takes sustained play across the 90-day journey. Tune
// freely — just keep them rising.
export const RANKS = [
  { level: 1, title: 'GK Rookie', emoji: '🐣', xp: 0 },
  { level: 2, title: 'GK Explorer', emoji: '🧭', xp: 400 },
  { level: 3, title: 'GK Scout', emoji: '🔭', xp: 1200 },
  { level: 4, title: 'GK Whiz', emoji: '💡', xp: 2500 },
  { level: 5, title: 'GK Star', emoji: '🌟', xp: 4500 },
  { level: 6, title: 'GK Expert', emoji: '🎓', xp: 7000 },
  { level: 7, title: 'GK Master', emoji: '🏅', xp: 10500 },
  { level: 8, title: 'GK Champion', emoji: '🏆', xp: 15000 },
  { level: 9, title: 'GK Grandmaster', emoji: '👑', xp: 22000 },
]

// Returns the current rank plus progress toward the next one.
export function levelForXp(xp) {
  let current = RANKS[0]
  for (const r of RANKS) {
    if (xp >= r.xp) current = r
    else break
  }
  const next = RANKS.find((r) => r.level === current.level + 1) || null
  const floor = current.xp
  const ceil = next ? next.xp : current.xp
  const into = xp - floor
  const span = ceil - floor
  const progress = next ? Math.min(1, into / span) : 1
  return { ...current, xp, next, floor, ceil, into, span, progress }
}
