import { motion } from 'framer-motion'

// The "Did you know?" card shown after every answer so the child always
// walks away having learned a specific fact.
export default function FunFactCard({ fact }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.1 }}
      className="rounded-3xl border-4 border-brand-yellow bg-amber-50 p-5 shadow-card"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">💡</span>
        <h3 className="font-display font-extrabold text-brand-orange text-lg">Did you know?</h3>
      </div>
      <p className="font-body text-slate-700 text-lg leading-snug">{fact}</p>
    </motion.div>
  )
}
