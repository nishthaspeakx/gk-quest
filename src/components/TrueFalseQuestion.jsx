import { motion } from 'framer-motion'
import { optionState } from './optionState'

// Two big thumbs — quick "Is this true?" cards.
const LOOK = {
  True: { emoji: '👍', base: 'bg-brand-green/10 border-brand-green text-green-700' },
  False: { emoji: '👎', base: 'bg-brand-coral/10 border-brand-coral text-rose-600' },
}
const FEEDBACK = {
  correct: 'bg-brand-green border-green-600 text-white',
  wrong: 'bg-brand-coral border-rose-500 text-white',
  muted: 'opacity-40',
}

export default function TrueFalseQuestion({ question, phase, response, onAnswer }) {
  return (
    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
      {['True', 'False'].map((opt) => {
        const state = optionState(opt, { phase, response, answer: question.answer })
        const feedbackClass = FEEDBACK[state] || ''
        return (
          <motion.button
            key={opt}
            type="button"
            whileTap={phase === 'feedback' ? undefined : { scale: 0.95 }}
            disabled={phase === 'feedback'}
            onClick={() => onAnswer(opt)}
            className={`min-h-[120px] rounded-3xl border-4 font-display font-extrabold text-2xl
                        shadow-pop flex flex-col items-center justify-center gap-2
                        transition-colors duration-150
                        ${LOOK[opt].base} ${feedbackClass}`}
          >
            <span className="text-4xl">{LOOK[opt].emoji}</span>
            {opt}
          </motion.button>
        )
      })}
    </div>
  )
}
