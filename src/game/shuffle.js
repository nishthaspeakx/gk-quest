// Fisher–Yates shuffle that returns a NEW array (does not mutate the input).
export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Shuffle but make sure the result isn't identical to `avoid` (used so a
// "put in order" question never starts already solved). Falls back gracefully.
export function shuffleUnless(arr, avoid) {
  if (arr.length < 2) return [...arr]
  for (let tries = 0; tries < 8; tries++) {
    const s = shuffle(arr)
    if (s.some((v, i) => v !== avoid[i])) return s
  }
  return [...arr].reverse()
}
