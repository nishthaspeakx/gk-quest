import { useState } from 'react'
import { motion } from 'framer-motion'
import { useProgress } from '../game/ProgressContext'

// Friendly first-time welcome: Gyaan the Owl introduces the game and asks for
// the child's name. Shown once (until `onboarded` is set).
export default function Welcome() {
  const { updateProgress } = useProgress()
  const [name, setName] = useState('')

  function start() {
    updateProgress({ childName: name.trim(), onboarded: true })
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gradient-to-b from-brand-purple to-brand-indigo"
      style={{
        paddingTop: 'calc(2.5rem + env(safe-area-inset-top))',
        paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom))',
        paddingLeft: 'calc(1.5rem + env(safe-area-inset-left))',
        paddingRight: 'calc(1.5rem + env(safe-area-inset-right))',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-md mx-auto flex flex-col items-center text-center text-white gap-5">
        <motion.div
          className="fluid-mascot-xl"
          animate={{ y: [0, -14, 0], rotate: [0, -6, 6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          aria-hidden
        >
          🦉
        </motion.div>

        <div>
          <h1 className="font-display font-extrabold fluid-h1 mb-1">Hi! I'm Gyaan 🦉</h1>
          <p className="font-body text-white/90 text-lg">
            Welcome to <span className="font-bold text-brand-yellow">GK Quest</span> — your 90-day
            knowledge adventure!
          </p>
        </div>

        <div className="w-full bg-white/15 rounded-3xl p-5 flex flex-col gap-3 text-left">
          <HowTo emoji="🗓️" text="Play one fun quest every day — just 10–15 questions." />
          <HowTo emoji="⭐" text="Earn stars, coins and cool badges as you go." />
          <HowTo emoji="👑" text="Grow from GK Rookie all the way to Grandmaster!" />
          <HowTo emoji="💡" text="Every answer teaches you a new 'Did you know?' fact." />
        </div>

        <div className="w-full">
          <label className="font-display font-bold text-white/90 block mb-2">What should I call you?</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={20}
            className="w-full text-center text-xl font-body rounded-2xl px-4 py-3 text-slate-800 outline-none"
          />
        </div>

        <motion.button
          className="btn-fun bg-brand-yellow text-slate-800 hover:bg-amber-300 w-full text-xl"
          whileTap={{ scale: 0.97 }}
          onClick={start}
        >
          {(() => {
            const n = name.trim()
            if (!n) return 'Start the Adventure ▶'
            // Clamp the displayed name so the button can never overflow.
            const short = n.length > 12 ? `${n.slice(0, 12)}…` : n
            return `Let's go, ${short}! ▶`
          })()}
        </motion.button>
        <button className="text-white/70 text-sm font-display font-bold underline" onClick={start}>
          Skip for now
        </button>
      </div>
    </motion.div>
  )
}

function HowTo({ emoji, text }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-2xl shrink-0">{emoji}</span>
      <span className="font-body text-white/95">{text}</span>
    </div>
  )
}
