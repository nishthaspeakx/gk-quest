import { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react'
import {
  loadProgress,
  saveProgress,
  defaultProgress,
  serializeProgress,
  parseImported,
} from './storage'
import { applyCompletion } from './progress'

const ProgressCtx = createContext(null)

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => loadProgress())

  // Mirror in a ref so completeQuest can read the freshest value synchronously
  // and return the summary immediately (rather than waiting for a re-render).
  const ref = useRef(progress)
  useEffect(() => {
    ref.current = progress
    saveProgress(progress)
  }, [progress])

  // Apply a finished quest, persist, and return the summary for the Results screen.
  const completeQuest = useCallback((payload) => {
    const { next, summary } = applyCompletion(ref.current, payload)
    ref.current = next
    setProgress(next)
    return summary
  }, [])

  // Merge a partial update (object) or apply a function; persists automatically.
  const updateProgress = useCallback((patch) => {
    const cur = ref.current
    const next = typeof patch === 'function' ? patch(cur) : { ...cur, ...patch }
    ref.current = next
    setProgress(next)
  }, [])

  // Buy a shop item. Returns { ok, reason }. Tokens stack; other items are one-time.
  const purchase = useCallback((item) => {
    const p = ref.current
    if (item.type !== 'token' && p.ownedItems.includes(item.id)) return { ok: false, reason: 'owned' }
    if (p.coins < item.price) return { ok: false, reason: 'coins' }
    const next = structuredClone(p)
    next.coins -= item.price
    if (item.type === 'token') next.freezeTokens += item.amount || 1
    else next.ownedItems = [...next.ownedItems, item.id]
    ref.current = next
    setProgress(next)
    return { ok: true }
  }, [])

  const exportProgress = useCallback(() => serializeProgress(ref.current), [])

  const importProgress = useCallback((str) => {
    const parsed = parseImported(str) // throws on invalid input
    ref.current = parsed
    setProgress(parsed)
    return true
  }, [])

  const resetProgress = useCallback(() => {
    const fresh = defaultProgress()
    ref.current = fresh
    setProgress(fresh)
  }, [])

  const value = {
    progress,
    completeQuest,
    updateProgress,
    purchase,
    exportProgress,
    importProgress,
    resetProgress,
  }
  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressCtx)
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>')
  return ctx
}
