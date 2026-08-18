// Shop catalog — purely cosmetic items (plus the useful streak-freeze token).
// Editable: add items to these arrays. `free: true` items are owned by default.

export const AVATARS = [
  { id: 'gyaan', type: 'avatar', name: 'Gyaan the Owl', emoji: '🦉', price: 0, free: true },
  { id: 'fox', type: 'avatar', name: 'Clever Fox', emoji: '🦊', price: 250 },
  { id: 'tiger', type: 'avatar', name: 'Brave Tiger', emoji: '🐯', price: 400 },
  { id: 'panda', type: 'avatar', name: 'Cool Panda', emoji: '🐼', price: 400 },
  { id: 'robot', type: 'avatar', name: 'Quiz Bot', emoji: '🤖', price: 600 },
  { id: 'astro', type: 'avatar', name: 'Space Explorer', emoji: '🧑‍🚀', price: 800 },
  { id: 'dragon', type: 'avatar', name: 'Wise Dragon', emoji: '🐲', price: 1200 },
]

export const THEMES = [
  { id: 'default', type: 'theme', name: 'Sunrise', emoji: '🌅', price: 0, free: true, bg: '' },
  {
    id: 'space',
    type: 'theme',
    name: 'Outer Space',
    emoji: '🚀',
    price: 400,
    dark: true, // dark background → app switches loose text to a light, readable colour
    bg: 'linear-gradient(160deg,#312e81 0%,#1e293b 60%,#0f172a 100%)',
  },
  {
    id: 'jungle',
    type: 'theme',
    name: 'Jungle',
    emoji: '🌴',
    price: 400,
    bg: 'linear-gradient(160deg,#dcfce7 0%,#bbf7d0 50%,#fef9c3 100%)',
  },
  {
    id: 'ocean',
    type: 'theme',
    name: 'Ocean',
    emoji: '🌊',
    price: 400,
    bg: 'linear-gradient(160deg,#cffafe 0%,#a5f3fc 50%,#dbeafe 100%)',
  },
]

// The streak-freeze token is buyable and stackable (adds to freezeTokens).
export const TOKENS = [
  { id: 'freeze', type: 'token', name: 'Streak Freeze', emoji: '❄️', price: 150, amount: 1 },
]

// Collectible fun-fact card packs.
export const PACKS = [
  { id: 'pack_animals', type: 'pack', name: 'Animal Facts', emoji: '🐾', price: 200 },
  { id: 'pack_space', type: 'pack', name: 'Space Facts', emoji: '🪐', price: 200 },
  { id: 'pack_india', type: 'pack', name: 'Incredible India', emoji: '🇮🇳', price: 200 },
  { id: 'pack_sports', type: 'pack', name: 'Sports Facts', emoji: '⚽', price: 200 },
]

export function avatarById(id) {
  return AVATARS.find((a) => a.id === id) || AVATARS[0]
}
export function themeById(id) {
  return THEMES.find((t) => t.id === id) || THEMES[0]
}

// Is this one-time item already owned? (Tokens are never "owned" — always buyable.)
export function isOwned(progress, item) {
  if (item.free) return true
  if (item.type === 'token') return false
  return progress.ownedItems.includes(item.id)
}
