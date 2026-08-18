// Lazily loads a day's question file from /src/data.
// import.meta.glob lets Vite code-split each day so we only fetch what we play.
import { shuffle } from './shuffle'

const dayFiles = import.meta.glob('../data/day-*.json')

export async function loadDay(dayNumber) {
  const padded = String(dayNumber).padStart(2, '0')
  const key = `../data/day-${padded}.json`
  const importer = dayFiles[key]
  if (!importer) {
    throw new Error(`No question file found for day ${dayNumber} (looked for ${key})`)
  }
  const mod = await importer()
  return mod.default
}

// Build a random mixed practice quiz from a set of days (defaults to Day 1 if
// none given). Pulls questions across those days, shuffles, and picks `count`.
export async function loadMixedQuiz(dayNumbers, count = 12) {
  const days = dayNumbers && dayNumbers.length ? dayNumbers : [1]
  const loaded = await Promise.all(days.map((d) => loadDay(d).catch(() => null)))
  const all = loaded.filter(Boolean).flatMap((d) => d.questions)
  const questions = shuffle(all)
    .slice(0, count)
    .map((q, i) => ({ ...q, id: `mix${i}` }))
  return { day: 'practice', world: 0, theme: 'Random Practice Quiz', isBoss: false, questions }
}

// Which days actually exist right now (useful for the Journey Map later).
export function availableDays() {
  return Object.keys(dayFiles)
    .map((k) => Number(k.match(/day-(\d+)\.json$/)?.[1]))
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b)
}
