// localStorage persistence for all player progress. No login, no server.

const KEY = 'gkquest.progress.v1'

export function defaultProgress() {
  return {
    version: 1,
    xp: 0,
    coins: 0,
    currentDay: 1, // next day to attempt
    lastCompletedDate: null, // 'YYYY-MM-DD' of the last daily quest
    streak: 0,
    bestStreak: 0,
    freezeTokens: 0,
    lastQuestStars: null, // stars of the previously completed quest (for Comeback Kid)
    completedDays: {}, // { [day]: { stars, score, correctCount, total, bestCombo, playedOn } }
    topicStats: {}, // { [topicTag]: correctCount }
    topicAttempts: {}, // { [topicTag]: attemptedCount } — for strongest/weakest topics
    badges: [], // [{ id, earnedOn }]
    stats: { totalCorrect: 0, totalQuestions: 0, questsPlayed: 0, perfectDays: 0 },

    // Settings & cosmetics
    childName: '',
    parentPin: '', // 4-digit; empty means not set up yet
    avatar: 'gyaan', // chosen avatar id (see shop.js)
    theme: 'default', // chosen theme id
    ownedItems: [], // ids of purchased cosmetic items
    practiceMode: false, // parent-unlocked extra play
    soundOn: true, // sound effects toggle
    onboarded: false, // has the first-time welcome been completed
  }
}

// Fill in any missing keys so older/partial saves still work.
function migrate(saved) {
  const base = defaultProgress()
  return {
    ...base,
    ...saved,
    completedDays: { ...base.completedDays, ...(saved.completedDays || {}) },
    topicStats: { ...base.topicStats, ...(saved.topicStats || {}) },
    topicAttempts: { ...base.topicAttempts, ...(saved.topicAttempts || {}) },
    stats: { ...base.stats, ...(saved.stats || {}) },
    badges: Array.isArray(saved.badges) ? saved.badges : [],
    ownedItems: Array.isArray(saved.ownedItems) ? saved.ownedItems : [],
  }
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultProgress()
    return migrate(JSON.parse(raw))
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress))
  } catch {
    // Storage full or unavailable — fail quietly; the game still works in-memory.
  }
}

// Pretty JSON for the "export progress" backup file.
export function serializeProgress(progress) {
  return JSON.stringify(progress, null, 2)
}

// Parse an imported backup string into a valid progress object (throws on junk).
export function parseImported(str) {
  const parsed = JSON.parse(str)
  if (!parsed || typeof parsed !== 'object' || typeof parsed.xp !== 'number') {
    throw new Error('That does not look like a GK Quest progress file.')
  }
  return migrate(parsed)
}
