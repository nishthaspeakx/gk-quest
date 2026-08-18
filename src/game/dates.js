// Local-calendar date helpers used by the streak and daily-gate logic.
// (Runtime browser code — `new Date()` is fine here.)

export function todayStr(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Whole days from date-string a to date-string b (b - a). Both 'YYYY-MM-DD'.
export function dayDiff(aStr, bStr) {
  const a = new Date(`${aStr}T00:00:00`)
  const b = new Date(`${bStr}T00:00:00`)
  return Math.round((b - a) / 86400000)
}
