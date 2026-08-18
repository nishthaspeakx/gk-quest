import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { shuffleUnless } from '../game/shuffle'

// Tap items in order to build the answer row. Tap an item in the row to send
// it back. Auto-checks once every item is placed.
export default function SequenceQuestion({ question, phase, onAnswer }) {
  const scrambled = useMemo(
    () => shuffleUnless(question.options, question.sequence),
    [question],
  )
  const [order, setOrder] = useState([]) // items placed, in order
  const pool = scrambled.filter((item) => !order.includes(item))

  useEffect(() => {
    if (phase === 'answering' && order.length === question.options.length) {
      onAnswer(order)
    }
  }, [order, phase, question.options.length, onAnswer])

  function place(item) {
    if (phase === 'feedback') return
    setOrder((o) => [...o, item])
  }
  function removeAt(idx) {
    if (phase === 'feedback') return
    setOrder((o) => o.filter((_, i) => i !== idx))
  }

  return (
    <div className="grid gap-5 max-w-xl mx-auto">
      {/* The answer row being built */}
      <div className="min-h-[72px] rounded-3xl border-4 border-dashed border-brand-purple/40 bg-white/60 p-3">
        {order.length === 0 ? (
          <p className="text-slate-400 font-body text-center py-3">Tap the items below in order…</p>
        ) : (
          <ol className="flex flex-col gap-2">
            {order.map((item, idx) => {
              const isRight = phase === 'feedback' && item === question.sequence[idx]
              const isWrong = phase === 'feedback' && item !== question.sequence[idx]
              return (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => removeAt(idx)}
                    disabled={phase === 'feedback'}
                    className={`w-full flex items-center gap-3 rounded-2xl border-4 px-4 py-3 font-body font-semibold shadow-pop text-left
                      ${isRight ? 'border-green-600 bg-brand-green text-white' : ''}
                      ${isWrong ? 'border-rose-500 bg-brand-coral text-white' : ''}
                      ${phase !== 'feedback' ? 'border-brand-purple bg-brand-mist text-slate-800' : ''}`}
                  >
                    <span className="grid place-items-center h-8 w-8 rounded-full bg-white/70 text-brand-purple font-display font-extrabold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="flex-1">{item}</span>
                    {isWrong && (
                      <span className="text-sm font-bold opacity-90">✔ {question.sequence[idx]}</span>
                    )}
                  </button>
                </li>
              )
            })}
          </ol>
        )}
      </div>

      {/* The pool of remaining items */}
      {phase !== 'feedback' && pool.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3">
          {pool.map((item) => (
            <motion.button
              key={item}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => place(item)}
              className="min-h-[56px] px-5 py-3 rounded-2xl border-4 border-slate-200 bg-white text-slate-800 font-body font-semibold text-lg shadow-pop hover:border-brand-purple/60"
            >
              {item}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  )
}
