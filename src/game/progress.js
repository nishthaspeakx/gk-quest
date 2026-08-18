import { starsForResult, COINS_PER_CORRECT, STAR_COIN_BONUS } from './scoring'
import { levelForXp } from './levels'
import { updateStreak, streakMilestone } from './streak'
import { evaluateBadges } from './badges'
import { todayStr } from './dates'

// Keep the better of two day records (higher stars wins).
function betterRecord(prev, next) {
  if (!prev) return next
  return next.stars >= prev.stars ? next : prev
}

// The heart of the gamification system. Pure function: given the current
// progress and a finished quest, returns the new progress plus a summary the
// Results screen displays. `payload` comes from the Quest screen.
//
// payload = { day, correctCount, total, xp, bestCombo, fastCount, topicBreakdown }
export function applyCompletion(prev, payload, today = todayStr()) {
  const { day, correctCount, total, xp, bestCombo, fastCount, topicBreakdown, topicAttempts } = payload
  const stars = starsForResult(correctCount, total)
  const record = { stars, score: xp, correctCount, total, bestCombo, playedOn: today }

  // A day counts as the "real" daily quest only the first time it is played
  // (day === currentDay). Replaying an earlier day is practice: it can improve
  // your star record and earn performance badges, but grants no XP/coins/streak.
  const isDailyQuest = day === prev.currentDay

  const next = structuredClone(prev)
  next.completedDays[day] = betterRecord(prev.completedDays[day], record)

  let summary

  if (isDailyQuest) {
    // --- XP & level ---
    next.xp = prev.xp + xp
    const prevLevel = levelForXp(prev.xp)
    const newLevel = levelForXp(next.xp)
    const leveledUp = newLevel.level > prevLevel.level

    // --- Streak ---
    const s = updateStreak(
      { streak: prev.streak, lastDate: prev.lastCompletedDate, freezeTokens: prev.freezeTokens },
      today,
    )
    next.streak = s.streak
    next.freezeTokens = s.freezeTokens
    next.bestStreak = Math.max(prev.bestStreak, s.streak)

    const milestone = streakMilestone(next.streak)
    if (milestone?.freezeAwarded) next.freezeTokens += 1

    // --- Coins ---
    const coinsEarned =
      correctCount * COINS_PER_CORRECT + (STAR_COIN_BONUS[stars] || 0) + (milestone?.coinBonus || 0)
    next.coins = prev.coins + coinsEarned

    // --- Gate advance ---
    next.lastCompletedDate = today
    next.currentDay = prev.currentDay + 1

    // --- Topic stats (correct + attempted, for strongest/weakest topics) ---
    for (const [topic, count] of Object.entries(topicBreakdown || {})) {
      next.topicStats[topic] = (next.topicStats[topic] || 0) + count
    }
    for (const [topic, count] of Object.entries(topicAttempts || {})) {
      next.topicAttempts[topic] = (next.topicAttempts[topic] || 0) + count
    }

    // --- Aggregate stats ---
    next.stats.totalCorrect += correctCount
    next.stats.totalQuestions += total
    next.stats.questsPlayed += 1
    if (correctCount === total) next.stats.perfectDays += 1

    // --- Badges (evaluate against the updated state; Comeback Kid reads the
    // previous quest's stars, still present on `next` until we overwrite it) ---
    const quest = { day, stars, correctCount, total, fastCount, bestCombo, perfect: correctCount === total }
    const newBadges = evaluateBadges({ progress: next, quest })
    next.badges = [...next.badges, ...newBadges.map((b) => ({ id: b.id, earnedOn: today }))]
    next.lastQuestStars = stars

    summary = {
      day,
      stars,
      isReplay: false,
      xpEarned: xp,
      coinsEarned,
      totalXp: next.xp,
      totalCoins: next.coins,
      leveledUp,
      prevLevel,
      newLevel,
      streak: next.streak,
      streakMilestone: milestone,
      usedFreeze: s.usedFreeze,
      newBadges,
    }
  } else {
    // --- Replay / practice: star record + performance badges only ---
    const quest = { day, stars, correctCount, total, fastCount, bestCombo, perfect: correctCount === total }
    const newBadges = evaluateBadges({ progress: next, quest })
    next.badges = [...next.badges, ...newBadges.map((b) => ({ id: b.id, earnedOn: today }))]
    next.lastQuestStars = stars

    summary = {
      day,
      stars,
      isReplay: true,
      xpEarned: 0,
      coinsEarned: 0,
      totalXp: next.xp,
      totalCoins: next.coins,
      leveledUp: false,
      prevLevel: levelForXp(next.xp),
      newLevel: levelForXp(next.xp),
      streak: next.streak,
      streakMilestone: null,
      usedFreeze: false,
      newBadges,
    }
  }

  return { next, summary }
}

// ---- Journey / daily-gate helpers (used by the Home screen) ----

export function dayStatus(progress, day) {
  if (day < progress.currentDay) return 'completed'
  if (day === progress.currentDay) return 'current'
  return 'locked'
}

// Can the player start this day right now?
// reasons: 'current' (yes, today's quest) | 'replay' (yes, practice a past day)
//          | 'locked' (future day still to unlock)
// NOTE: no once-per-day gate — the child may play as many quizzes as they like
// in a single day. Each new day still unlocks the next, and the streak still
// counts one per calendar day.
export function canStartDay(progress, day, today = todayStr()) {
  if (day < progress.currentDay) return { ok: true, reason: 'replay' }
  if (day > progress.currentDay) return { ok: false, reason: 'locked' }
  return { ok: true, reason: 'current' }
}
