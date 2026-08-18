import { motion } from 'framer-motion'

// A single badge. `locked` shows a grey silhouette (for the Trophy Room later).
export default function BadgeChip({ badge, locked = false, index = 0 }) {
  return (
    <motion.div
      // Animate from a *visible* scale (not 0) so badges never vanish if the
      // reveal animation is deferred (e.g. a backgrounded tab).
      initial={{ scale: 0.7, rotate: -12 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.05 + index * 0.1, type: 'spring', stiffness: 260, damping: 14 }}
      className={`flex flex-col items-center gap-1 w-24 text-center ${locked ? 'opacity-50' : ''}`}
    >
      <div
        className={`h-16 w-16 grid place-items-center rounded-2xl text-3xl shadow-pop
          ${locked ? 'bg-slate-200 grayscale' : 'bg-brand-yellow'}`}
      >
        {locked ? '🔒' : badge.emoji}
      </div>
      <span className="font-display font-bold text-xs text-slate-700 leading-tight">
        {locked ? '???' : badge.name}
      </span>
    </motion.div>
  )
}
