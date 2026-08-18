import { motion, AnimatePresence } from 'framer-motion'

// Gyaan the Owl — the friendly guide who reacts to answers.
// `mood`: 'idle' | 'happy' | 'wrong'
const FACE = {
  idle: '🦉',
  happy: '🦉',
  wrong: '🦉',
}

const CHEERS = {
  happy: ['Woohoo!', 'Great job!', 'You got it!', 'Brilliant!', 'Superb!'],
  wrong: ['Good try!', 'Almost!', "Let's learn this one!", 'No worries!'],
  idle: ['You can do it!', 'Take your time…', 'Think it through!'],
}

// Deterministic pick so the bubble text is stable within a render.
function pick(list, seed) {
  return list[Math.abs(seed) % list.length]
}

export default function Mascot({ mood = 'idle', seed = 0, showBubble = true }) {
  const bubble = pick(CHEERS[mood], seed)
  const animate =
    mood === 'happy'
      ? { rotate: [0, -12, 12, -8, 0], y: [0, -10, 0] }
      : mood === 'wrong'
        ? { rotate: [0, -4, 4, 0], y: [0, 2, 0] }
        : { y: [0, -6, 0] }

  return (
    <div className="flex items-end gap-2 select-none pointer-events-none">
      {showBubble && (
      <AnimatePresence mode="wait">
        <motion.div
          key={mood + bubble}
          initial={{ opacity: 0, scale: 0.6, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          className={`mb-6 max-w-[9rem] rounded-2xl px-3 py-2 text-sm font-body font-semibold shadow-pop
            ${mood === 'happy' ? 'bg-brand-green text-white' : mood === 'wrong' ? 'bg-brand-yellow text-slate-800' : 'bg-white text-slate-700'}`}
        >
          {bubble}
        </motion.div>
      </AnimatePresence>
      )}

      <motion.div
        className="text-5xl sm:text-6xl drop-shadow"
        animate={animate}
        transition={{ duration: mood === 'idle' ? 3 : 0.7, repeat: mood === 'idle' ? Infinity : 0, ease: 'easeInOut' }}
        aria-hidden
      >
        {FACE[mood]}
      </motion.div>
    </div>
  )
}
