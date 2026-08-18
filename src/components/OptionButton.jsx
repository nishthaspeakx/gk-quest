import { motion } from 'framer-motion'

// A big, touch-friendly answer button used by the choice-style question types.
// `state`: 'idle' | 'selected' | 'correct' | 'wrong' | 'muted'
const STATE_CLASSES = {
  idle: 'bg-white border-slate-200 text-slate-800 hover:border-brand-purple/60',
  selected: 'bg-brand-mist border-brand-purple text-slate-800',
  correct: 'bg-brand-green border-green-600 text-white',
  wrong: 'bg-brand-coral border-rose-500 text-white',
  muted: 'bg-white/70 border-slate-100 text-slate-400',
}

const STATE_ICON = {
  correct: '✅',
  wrong: '❌',
}

export default function OptionButton({ label, image, state = 'idle', disabled, onClick }) {
  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.96 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`relative w-full min-h-[64px] flex items-center gap-3 px-5 py-4
                  rounded-2xl border-4 font-body font-semibold text-lg text-left
                  shadow-pop transition-colors duration-150
                  disabled:cursor-default ${STATE_CLASSES[state]}`}
    >
      {image && (
        <img
          src={image}
          alt=""
          className="h-14 w-14 rounded-xl object-cover bg-slate-100 shrink-0"
        />
      )}
      <span className="flex-1">{label}</span>
      {STATE_ICON[state] && <span className="text-2xl shrink-0">{STATE_ICON[state]}</span>}
    </motion.button>
  )
}
