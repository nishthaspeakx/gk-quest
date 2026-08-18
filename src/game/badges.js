// ============================================================================
// BADGE DEFINITIONS — this is the one file to edit to add or tweak badges.
// ============================================================================
// Each badge has:
//   id          unique string (stored in saved progress)
//   name        display name
//   emoji       icon
//   group       'topic' | 'performance' | 'consistency' | 'grand'
//   description shown in the Trophy Room
//   check(ctx)  returns true when the badge is earned.
//               ctx = { progress, quest }
//                 progress = the player's progress AFTER this quest was applied
//                 quest    = { day, stars, correctCount, total, fastCount,
//                              bestCombo, perfect }
//
// To add a badge: append an object to BADGES. To add a topic-mastery badge,
// list the `topic` tags (from the question data) it should count and a threshold.
// ============================================================================

// Sum of correct answers across a set of topic tags.
function sumTopics(topicStats, topics) {
  return topics.reduce((n, t) => n + (topicStats[t] || 0), 0)
}

// How many days in [from..to] have been completed.
function countCompletedInRange(progress, from, to) {
  return Object.keys(progress.completedDays)
    .map(Number)
    .filter((d) => d >= from && d <= to).length
}

export const BADGES = [
  // ----- TOPIC MASTERY -----------------------------------------------------
  {
    id: 'capital_king',
    name: 'Capital King',
    emoji: '👑',
    group: 'topic',
    description: 'Answer 20 geography questions correctly.',
    check: ({ progress }) =>
      sumTopics(progress.topicStats, ['States & Capitals', 'Rivers', 'Landforms']) >= 20,
  },
  {
    id: 'science_star',
    name: 'Science Star',
    emoji: '🔬',
    group: 'topic',
    description: 'Answer 15 science questions correctly.',
    check: ({ progress }) =>
      sumTopics(progress.topicStats, [
        'Human Body',
        'Plants',
        'Weather & Water',
        'Nutrition & Health',
      ]) >= 15,
  },
  {
    id: 'space_cadet',
    name: 'Space Cadet',
    emoji: '🚀',
    group: 'topic',
    description: 'Answer 8 space questions correctly.',
    check: ({ progress }) => sumTopics(progress.topicStats, ['Solar System']) >= 8,
  },
  {
    id: 'nature_ranger',
    name: 'Nature Ranger',
    emoji: '🌿',
    group: 'topic',
    description: 'Answer 12 nature questions correctly.',
    check: ({ progress }) => sumTopics(progress.topicStats, ['Animals', 'Plants']) >= 12,
  },
  {
    id: 'history_hero',
    name: 'History Hero',
    emoji: '📜',
    group: 'topic',
    description: 'Answer 10 history & heritage questions correctly.',
    check: ({ progress }) => sumTopics(progress.topicStats, ['History', 'Monuments']) >= 10,
  },
  {
    id: 'sports_champ',
    name: 'Sports Champ',
    emoji: '🏅',
    group: 'topic',
    description: 'Answer 8 sports questions correctly.',
    check: ({ progress }) =>
      sumTopics(progress.topicStats, ['Sports', 'Current Affairs — Sports & Science']) >= 8,
  },
  {
    id: 'current_affairs_ace',
    name: 'Current-Affairs Ace',
    emoji: '📰',
    group: 'topic',
    description: 'Answer 15 current-affairs questions correctly.',
    check: ({ progress }) =>
      sumTopics(progress.topicStats, [
        'Current Affairs',
        'Current Affairs — India',
        'Current Affairs — World',
        'Current Affairs — Sports & Science',
        'Current Affairs — Awards',
        'Leaders Now',
        'Important Days',
      ]) >= 15,
  },

  // ----- PERFORMANCE -------------------------------------------------------
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    emoji: '💯',
    group: 'performance',
    description: 'Get every question right in a quest.',
    check: ({ quest }) => quest.total > 0 && quest.correctCount === quest.total,
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    emoji: '⚡',
    group: 'performance',
    description: 'Be fast AND accurate — 90%+ correct with lightning answers.',
    check: ({ quest }) =>
      quest.total > 0 &&
      quest.correctCount / quest.total >= 0.9 &&
      quest.fastCount >= Math.ceil(quest.total * 0.7),
  },
  {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    emoji: '💪',
    group: 'performance',
    description: 'Bounce back with a 3-star day right after a tough one.',
    check: ({ quest, progress }) =>
      quest.stars === 3 && progress.lastQuestStars != null && progress.lastQuestStars <= 1,
  },

  // ----- CONSISTENCY (streak milestones + month medals) --------------------
  {
    id: 'streak_3',
    name: '3-Day Spark',
    emoji: '🔥',
    group: 'consistency',
    description: 'Play 3 days in a row.',
    check: ({ progress }) => progress.bestStreak >= 3,
  },
  {
    id: 'streak_7',
    name: '7-Day Blaze',
    emoji: '🔥',
    group: 'consistency',
    description: 'Play 7 days in a row.',
    check: ({ progress }) => progress.bestStreak >= 7,
  },
  {
    id: 'streak_14',
    name: '14-Day Flame',
    emoji: '🔥',
    group: 'consistency',
    description: 'Play 14 days in a row.',
    check: ({ progress }) => progress.bestStreak >= 14,
  },
  {
    id: 'streak_30',
    name: '30-Day Inferno',
    emoji: '🔥',
    group: 'consistency',
    description: 'Play 30 days in a row.',
    check: ({ progress }) => progress.bestStreak >= 30,
  },
  {
    id: 'streak_60',
    name: '60-Day Furnace',
    emoji: '🔥',
    group: 'consistency',
    description: 'Play 60 days in a row.',
    check: ({ progress }) => progress.bestStreak >= 60,
  },
  {
    id: 'streak_90',
    name: '90-Day Legend',
    emoji: '🔥',
    group: 'consistency',
    description: 'Play 90 days in a row.',
    check: ({ progress }) => progress.bestStreak >= 90,
  },
  {
    id: 'month_1',
    name: 'Month 1 Complete',
    emoji: '🥉',
    group: 'consistency',
    description: 'Finish all of Days 1–30 (Bharat Basics).',
    check: ({ progress }) => countCompletedInRange(progress, 1, 30) >= 30,
  },
  {
    id: 'month_2',
    name: 'Month 2 Complete',
    emoji: '🥈',
    group: 'consistency',
    description: 'Finish all of Days 31–60 (World Explorer).',
    check: ({ progress }) => countCompletedInRange(progress, 31, 60) >= 30,
  },
  {
    id: 'month_3',
    name: 'Month 3 Complete',
    emoji: '🥇',
    group: 'consistency',
    description: 'Finish all of Days 61–90 (Champion\'s Arena).',
    check: ({ progress }) => countCompletedInRange(progress, 61, 90) >= 30,
  },

  // ----- GRAND -------------------------------------------------------------
  {
    id: 'champion_trophy',
    name: '90-Day Champion Trophy',
    emoji: '🏆',
    group: 'grand',
    description: 'Complete all 90 days of GK Quest.',
    check: ({ progress }) => Object.keys(progress.completedDays).length >= 90,
  },
]

export const BADGE_GROUPS = {
  topic: 'Topic Mastery',
  performance: 'Performance',
  consistency: 'Consistency',
  grand: 'Grand Awards',
}

export function getBadge(id) {
  return BADGES.find((b) => b.id === id) || null
}

// Returns the badge objects newly earned by this quest (not already owned).
export function evaluateBadges(ctx) {
  const owned = new Set(ctx.progress.badges.map((b) => b.id))
  const newly = []
  for (const badge of BADGES) {
    if (!owned.has(badge.id) && badge.check(ctx)) newly.push(badge)
  }
  return newly
}
