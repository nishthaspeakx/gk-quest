import { motion } from 'framer-motion'

// A single badge. Locked badges still show WHAT they are (icon + name), just
// greyed with a little lock, so kids can see the goals they're working toward.
export default function BadgeChip({ badge, locked = false, index = 0 }) {
  return (
    <motion.div
      // Animate from a *visible* scale (not 0) so badges never vanish if the
      // reveal animation is deferred (e.g. a backgrounded tab).
      initial={{ scale: 0.7, rotate: -12 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.05 + index * 0.1, type: 'spring', stiffness: 260, damping: 14 }}
      className={`flex flex-col items-center gap-1 w-24 text-center ${locked ? 'opacity-70' : ''}`}
    >
      <div
        className={`relative h-16 w-16 grid place-items-center rounded-2xl text-3xl shadow-pop
          ${locked ? 'bg-slate-200 grayscale' : 'bg-brand-yellow'}`}
      >
        {badge.emoji}
        {locked && (
          <span className="absolute -bottom-1 -right-1 h-5 w-5 grid place-items-center rounded-full bg-white text-[11px] shadow">
            🔒
          </span>
        )}
      </div>
      <span className="font-display font-bold text-xs text-slate-700 leading-tight">
        {badge.name}
      </span>
    </motion.div>
  )
}
