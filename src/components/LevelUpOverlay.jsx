import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

// Full-screen "LEVEL UP!" moment shown when the player crosses a rank threshold.
export default function LevelUpOverlay({ rank, onDismiss }) {
  useEffect(() => {
    const fire = () =>
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 }, disableForReducedMotion: true })
    fire()
    const t = setTimeout(fire, 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-purple/90 backdrop-blur"
      style={{
        paddingTop: 'calc(1.5rem + env(safe-area-inset-top))',
        paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
        paddingLeft: 'calc(1.5rem + env(safe-area-inset-left))',
        paddingRight: 'calc(1.5rem + env(safe-area-inset-right))',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="text-center"
        initial={{ scale: 0.5, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
      >
        <motion.p
          className="font-display font-extrabold text-3xl sm:text-4xl text-brand-yellow tracking-wide mb-2"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        >
          ⭐ LEVEL UP! ⭐
        </motion.p>

        <motion.div
          className="fluid-mascot-xl my-4 drop-shadow-lg"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          aria-hidden
        >
          {rank.emoji}
        </motion.div>

        <p className="font-body text-white/80 text-lg">You are now a</p>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-8">
          {rank.title}
        </h1>

        <button
          className="btn-fun bg-brand-yellow text-slate-800 hover:bg-amber-300"
          onClick={onDismiss}
        >
          Awesome! 🎉
        </button>
      </motion.div>
    </motion.div>
  )
}
