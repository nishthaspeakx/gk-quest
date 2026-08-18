import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { shuffle } from '../game/shuffle'

// Tap a word on the left, then tap its partner on the right to connect them.
// Tap an already-paired left again to undo it. Auto-checks once all are paired.
export default function MatchQuestion({ question, phase, onAnswer }) {
  const lefts = useMemo(() => question.pairs.map((p) => p.left), [question])
  const correct = useMemo(
    () => Object.fromEntries(question.pairs.map((p) => [p.left, p.right])),
    [question],
  )
  const rights = useMemo(() => shuffle(question.pairs.map((p) => p.right)), [question])

  const [assign, setAssign] = useState({}) // { left: right }
  const [activeLeft, setActiveLeft] = useState(null)

  const usedRights = new Set(Object.values(assign))

  // Commit automatically once every left has a partner.
  useEffect(() => {
    if (phase === 'answering' && Object.keys(assign).length === lefts.length) {
      onAnswer(assign)
    }
  }, [assign, phase, lefts.length, onAnswer])

  function tapLeft(left) {
    if (phase === 'feedback') return
    if (assign[left]) {
      // Undo this pairing.
      setAssign((a) => {
        const next = { ...a }
        delete next[left]
        return next
      })
      setActiveLeft(left)
      return
    }
    setActiveLeft((cur) => (cur === left ? null : left))
  }

  function tapRight(right) {
    if (phase === 'feedback' || usedRights.has(right) || !activeLeft) return
    setAssign((a) => ({ ...a, [activeLeft]: right }))
    setActiveLeft(null)
  }

  return (
    <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
      {/* Left column: items + their chosen partner */}
      <div className="grid gap-3">
        {lefts.map((left) => {
          const chosen = assign[left]
          const isRight = phase === 'feedback' && chosen === correct[left]
          const isWrong = phase === 'feedback' && chosen && chosen !== correct[left]
          const active = activeLeft === left
          return (
            <button
              key={left}
              type="button"
              onClick={() => tapLeft(left)}
              disabled={phase === 'feedback'}
              className={`min-h-[64px] rounded-2xl border-4 px-3 py-2 text-left font-body font-semibold shadow-pop transition-colors
                ${active ? 'border-brand-purple bg-brand-mist' : 'border-slate-200 bg-white'}
                ${isRight ? '!border-green-600 !bg-brand-green text-white' : ''}
                ${isWrong ? '!border-rose-500 !bg-brand-coral text-white' : ''}`}
            >
              <span className="block">{left}</span>
              <span className="block text-sm opacity-80 mt-0.5">
                {chosen ? `→ ${chosen}` : phase === 'feedback' ? '→ —' : '→ tap a match'}
              </span>
              {isWrong && (
                <span className="block text-xs mt-0.5 font-bold">✔ {correct[left]}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Right column: the words to connect */}
      <div className="grid gap-3">
        {rights.map((right) => {
          const used = usedRights.has(right)
          return (
            <motion.button
              key={right}
              type="button"
              whileTap={phase === 'feedback' || used ? undefined : { scale: 0.95 }}
              onClick={() => tapRight(right)}
              disabled={phase === 'feedback' || used}
              className={`min-h-[64px] rounded-2xl border-4 px-3 py-2 font-body font-semibold shadow-pop transition-colors
                ${used ? 'border-slate-100 bg-slate-100 text-slate-300' : 'border-slate-200 bg-white text-slate-800 hover:border-brand-purple/60'}`}
            >
              {right}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
