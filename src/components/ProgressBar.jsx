import { motion } from 'framer-motion'

// Shows how far through the quest the player is.
export default function ProgressBar({ current, total }) {
  const pct = total ? Math.min(100, Math.round((current / total) * 100)) : 0
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 font-display font-bold text-sm text-slate-500">
        <span>Question {Math.min(current + 1, total)} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-4 w-full rounded-full bg-white/70 shadow-inner overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-purple via-brand-pink to-brand-orange"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  )
}
