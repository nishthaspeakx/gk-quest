// The growth ladder: XP thresholds and rank titles from the app plan.
// Thresholds are tunable — edit the `xp` values to rebalance progression.

// Thresholds re-tuned so a single strong day no longer skips several ranks and
// the Rookie→Grandmaster climb lasts across the full 90-day journey. Early ranks
// still come quickly (a good first day or two → Explorer/Scout) for motivation;
// later ranks take sustained play. Tune freely.
export const RANKS = [
  { level: 1, title: 'GK Rookie', emoji: '🐣', xp: 0 },
  { level: 2, title: 'GK Explorer', emoji: '🧭', xp: 700 },
  { level: 3, title: 'GK Scout', emoji: '🔭', xp: 1800 },
  { level: 4, title: 'GK Whiz', emoji: '💡', xp: 3500 },
  { level: 5, title: 'GK Star', emoji: '🌟', xp: 6000 },
  { level: 6, title: 'GK Expert', emoji: '🎓', xp: 9500 },
  { level: 7, title: 'GK Master', emoji: '🏅', xp: 14000 },
  { level: 8, title: 'GK Champion', emoji: '🏆', xp: 20000 },
  { level: 9, title: 'GK Grandmaster', emoji: '👑', xp: 28000 },
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
