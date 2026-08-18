import { motion } from 'framer-motion'
import { optionState } from './optionState'

// The question text contains "___". We split on it and drop a highlighted
// slot in the gap, then offer a word bank of chips to tap.
export default function FillBlankQuestion({ question, phase, response, onAnswer }) {
  const [before, after] = question.question.split('___')
  const chosen = response
  const slotWord = phase === 'feedback' ? question.answer : chosen

  return (
    <div className="grid gap-6">
      {/* Sentence with the blank */}
      <p className="font-body text-xl sm:text-2xl leading-relaxed text-slate-800 text-center">
        {before}
        <span
          className={`inline-flex min-w-[6rem] justify-center align-middle mx-1 px-3 py-1 rounded-xl border-b-4 font-bold
            ${
              phase === 'feedback'
                ? 'bg-brand-green text-white border-green-700'
                : chosen
                  ? 'bg-brand-mist text-brand-purple border-brand-purple'
                  : 'bg-slate-100 text-slate-300 border-slate-300'
            }`}
        >
          {slotWord || '?????'}
        </span>
        {after}
      </p>

      {/* Word bank */}
      <div className="flex flex-wrap justify-center gap-3">
        {question.options.map((opt) => {
          const state = optionState(opt, { phase, response, answer: question.answer })
          const cls =
            state === 'correct'
              ? 'bg-brand-green text-white border-green-600'
              : state === 'wrong'
                ? 'bg-brand-coral text-white border-rose-500'
                : state === 'muted'
                  ? 'bg-white/70 text-slate-400 border-slate-100'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-brand-purple/60'
          return (
            <motion.button
              key={opt}
              type="button"
              whileTap={phase === 'feedback' ? undefined : { scale: 0.94 }}
              disabled={phase === 'feedback'}
              onClick={() => onAnswer(opt)}
              className={`min-h-[56px] px-6 py-3 rounded-2xl border-4 font-body font-semibold text-lg shadow-pop transition-colors ${cls}`}
            >
              {opt}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
