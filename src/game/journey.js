// Journey-map structure: the three worlds and the special days.
// Editable — tweak ranges, colours, or which days are bosses/reviews here.

export const TOTAL_DAYS = 90

export const WORLDS = [
  {
    id: 1,
    name: 'Bharat Basics',
    subtitle: 'Days 1–30',
    emoji: '🇮🇳',
    range: [1, 30],
    gradient: 'from-brand-orange to-brand-pink',
    tint: 'bg-orange-50',
    accent: '#fb923c',
  },
  {
    id: 2,
    name: 'World Explorer',
    subtitle: 'Days 31–60',
    emoji: '🌍',
    range: [31, 60],
    gradient: 'from-brand-blue to-brand-teal',
    tint: 'bg-sky-50',
    accent: '#3b82f6',
  },
  {
    id: 3,
    name: "Champion's Arena",
    subtitle: 'Days 61–90',
    emoji: '🏆',
    range: [61, 90],
    gradient: 'from-brand-purple to-brand-pink',
    tint: 'bg-violet-50',
    accent: '#7c3aed',
  },
]

// Every ~7th day is a Boss Quiz; end-of-month days are Grand Reviews; Day 90 is the Finale.
export const BOSS_DAYS = new Set([7, 14, 21, 28, 37, 44, 51, 57, 67, 74, 81])
export const REVIEW_DAYS = new Set([30, 60])
export const FINALE_DAY = 90

export function specialOf(day) {
  if (day === FINALE_DAY) return 'finale'
  if (REVIEW_DAYS.has(day)) return 'review'
  if (BOSS_DAYS.has(day)) return 'boss'
  return null
}

export const SPECIAL_META = {
  boss: { emoji: '⭐', label: 'Boss Quiz' },
  review: { emoji: '🏅', label: 'Grand Review' },
  finale: { emoji: '👑', label: 'Ultimate Championship' },
}

export function worldOf(day) {
  return WORLDS.find((w) => day >= w.range[0] && day <= w.range[1]) || WORLDS[0]
}
