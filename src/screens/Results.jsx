import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

import { useProgress } from '../game/ProgressContext'
import { levelForXp } from '../game/levels'
import { play } from '../game/sound'
import Mascot from '../components/Mascot'
import BadgeChip from '../components/BadgeChip'
import LevelUpOverlay from '../components/LevelUpOverlay'

// Pick up to `n` facts spread across the list for the "Today you learned…" recap.
function pickLearned(facts, n = 4) {
  const clean = (facts || []).filter(Boolean)
  if (clean.length <= n) return clean
  const step = clean.length / n
  return Array.from({ length: n }, (_, i) => clean[Math.floor(i * step)])
}

export default function Results() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { progress } = useProgress()
  const summary = state?.summary

  const [showLevelUp, setShowLevelUp] = useState(Boolean(summary?.leveledUp))

  useEffect(() => {
    if (!summary) return
    window.scrollTo(0, 0) // start the celebration at the top (scroll carries over from the quiz)
    if (summary.leveledUp) {
      play('levelup')
    } else {
      confetti({ particleCount: 130, spread: 90, origin: { y: 0.6 }, disableForReducedMotion: true })
      if (!summary.isReplay && summary.coinsEarned > 0) play('coin')
    }
  }, [summary])

  const learned = useMemo(() => pickLearned(state?.learned), [state])

  // Direct visit / refresh with no result — go home.
  if (!summary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-4 safe-t safe-b">
        <div className="fluid-mascot">🦉</div>
        <p className="font-display font-bold text-slate-600">No quest results to show.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Back to Start</button>
      </div>
    )
  }

  const rank = levelForXp(progress.xp)

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{
        paddingTop: 'calc(1.5rem + env(safe-area-inset-top))',
        paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
        paddingLeft: 'calc(1rem + env(safe-area-inset-left))',
        paddingRight: 'calc(1rem + env(safe-area-inset-right))',
      }}
    >
      {showLevelUp && (
        <LevelUpOverlay rank={summary.newLevel} onDismiss={() => setShowLevelUp(false)} />
      )}

      <div className="w-full max-w-md flex flex-col gap-4">
        {/* Celebration header */}
        <motion.div
          className="card-fun text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <div className="fluid-mascot mb-1">🦉</div>
          <h1 className="font-display font-extrabold text-3xl text-brand-purple">
            {summary.isReplay ? 'Practice Done!' : 'Quest Complete!'}
          </h1>
          <p className="text-slate-500 mb-3">{state?.theme}</p>

          {/* Stars */}
          <div className="flex justify-center gap-2 text-5xl mb-4">
            {[1, 2, 3].map((s) => (
              <motion.span
                key={s}
                initial={{ scale: 0.4, rotate: -40 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.25 + s * 0.18, type: 'spring', stiffness: 260 }}
              >
                {s <= summary.stars ? '⭐' : '☆'}
              </motion.span>
            ))}
          </div>

          {/* Rewards */}
          <div className="grid grid-cols-2 gap-3">
            <Reward label="XP earned" value={`+${summary.xpEarned}`} tone="bg-brand-mist text-brand-purple" />
            <Reward label="Coins" value={`+${summary.coinsEarned} 💰`} tone="bg-amber-50 text-brand-orange" />
          </div>

          {summary.isReplay && (
            <p className="mt-3 text-xs text-slate-400">
              Practice round — your best stars are saved, but daily rewards come from new quests.
            </p>
          )}
        </motion.div>

        {/* Streak note */}
        {!summary.isReplay && (
          <motion.div
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-brand-orange text-white font-display font-bold px-5 py-3 shadow-pop flex items-center justify-between"
          >
            <span>🔥 {summary.streak}-day streak!</span>
            {summary.usedFreeze && <span className="text-sm">❄️ freeze used</span>}
            {summary.streakMilestone && (
              <span className="text-sm">🎁 +{summary.streakMilestone.coinBonus} bonus</span>
            )}
          </motion.div>
        )}

        {/* New badges */}
        {summary.newBadges.length > 0 && (
          <motion.div
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-fun"
          >
            <h3 className="font-display font-extrabold text-brand-purple text-center mb-3">
              🎉 New {summary.newBadges.length === 1 ? 'Badge' : 'Badges'} Unlocked!
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {summary.newBadges.map((b, i) => (
                <BadgeChip key={b.id} badge={b} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Today you learned… */}
        {learned.length > 0 && (
          <motion.div
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-fun"
          >
            <h3 className="font-display font-extrabold text-slate-700 mb-2">📚 Today you learned…</h3>
            <ul className="space-y-2">
              {learned.map((fact, i) => (
                <li key={i} className="flex gap-2 text-slate-600 font-body">
                  <span className="text-brand-green">✔</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Rank progress */}
        <div className="card-fun">
          <div className="flex items-center justify-between mb-1">
            <span className="font-display font-bold text-slate-700">
              {rank.emoji} {rank.title}
            </span>
            {rank.next && (
              <span className="text-xs text-slate-400">
                {rank.into}/{rank.span} XP to {rank.next.title}
              </span>
            )}
          </div>
          <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-pink"
              style={{ width: `${Math.round(rank.progress * 100)}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 pb-6">
          <div className="flex gap-3 justify-center">
            <button className="btn-fun bg-brand-yellow text-slate-800 hover:bg-amber-300" onClick={() => navigate('/trophy')}>
              🏆 Trophy Room
            </button>
            <button className="btn-primary" onClick={() => navigate('/')}>Home</button>
          </div>
          <button
            className="text-sm text-slate-400 font-display font-bold underline"
            onClick={() => navigate(`/quest/${summary.day}`)}
          >
            Play this day again
          </button>
        </div>
      </div>

      <div
        className="fixed pointer-events-none"
        style={{
          bottom: 'calc(0.75rem + env(safe-area-inset-bottom))',
          right: 'calc(0.75rem + env(safe-area-inset-right))',
        }}
      >
        <Mascot mood="happy" seed={summary.day} />
      </div>
    </div>
  )
}

function Reward({ label, value, tone }) {
  return (
    <div className={`rounded-2xl py-3 ${tone}`}>
      <div className="font-display font-extrabold text-2xl leading-none">{value}</div>
      <div className="text-xs mt-1 opacity-80">{label}</div>
    </div>
  )
}
