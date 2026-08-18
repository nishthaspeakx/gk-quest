import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { useProgress } from '../game/ProgressContext'
import { levelForXp } from '../game/levels'
import { BADGES, BADGE_GROUPS } from '../game/badges'
import { downloadCertificate } from '../game/certificate'
import BadgeChip from '../components/BadgeChip'

export default function TrophyRoom() {
  const navigate = useNavigate()
  const { progress } = useProgress()
  const rank = levelForXp(progress.xp)

  const earned = useMemo(() => new Set(progress.badges.map((b) => b.id)), [progress.badges])
  const completed = Object.values(progress.completedDays)
  const daysDone = completed.length
  const avgStars = daysDone
    ? (completed.reduce((n, d) => n + d.stars, 0) / daysDone).toFixed(1)
    : '0'

  const grouped = useMemo(() => {
    const g = {}
    for (const b of BADGES) (g[b.group] ||= []).push(b)
    return g
  }, [])

  const dayNinetyDone = Boolean(progress.completedDays['90']) || earned.has('champion_trophy')

  return (
    <div className="min-h-screen safe-t safe-b safe-x">
      <div className="max-w-[30rem] mx-auto flex flex-col gap-4 px-4 py-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="h-12 w-12 shrink-0 grid place-items-center rounded-full bg-white shadow-pop font-bold text-slate-500 active:scale-90 transition-transform"
            aria-label="Back home"
          >
            ✕
          </button>
          <h1 className="font-display font-extrabold text-2xl text-brand-purple">🏆 Trophy Room</h1>
        </div>

        {/* Rank card */}
        <motion.div
          className="card-fun text-center"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          <div className="fluid-mascot mb-1">{rank.emoji}</div>
          <h2 className="font-display font-extrabold text-2xl text-slate-800">{rank.title}</h2>
          <p className="text-slate-400 text-sm mb-3">Level {rank.level}</p>
          <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-pink"
              style={{ width: `${Math.round(rank.progress * 100)}%` }}
            />
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Days done" value={daysDone} />
          <Stat label="Questions" value={progress.stats.totalQuestions} />
          <Stat label="Correct" value={progress.stats.totalCorrect} />
          <Stat label="Best streak" value={`${progress.bestStreak}🔥`} />
          <Stat label="Avg stars" value={`${avgStars}⭐`} />
          <Stat label="Coins" value={`${progress.coins}💰`} />
        </div>

        {/* Certificate — unlocked once Day 90 is complete */}
        {dayNinetyDone && (
          <div className="rounded-2xl bg-gradient-to-r from-brand-yellow to-brand-orange text-slate-800 p-4 text-center shadow-pop">
            <p className="font-display font-extrabold mb-2">🎓 90-Day GK Champion!</p>
            <button
              className="btn-fun bg-white text-brand-purple hover:bg-slate-50"
              onClick={() => downloadCertificate({ name: progress.childName, rank: rank.title })}
            >
              ⬇ Download Certificate
            </button>
            {!progress.childName && (
              <p className="text-xs mt-2 opacity-80">Tip: set the child's name in Settings for a personalised certificate.</p>
            )}
          </div>
        )}

        {/* Badges by group */}
        {Object.entries(BADGE_GROUPS).map(([group, title]) => (
          <div key={group} className="card-fun">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-extrabold text-slate-700">{title}</h3>
              <span className="text-xs text-slate-400">
                {grouped[group].filter((b) => earned.has(b.id)).length}/{grouped[group].length}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {grouped[group].map((b, i) => (
                <BadgeChip key={b.id} badge={b} locked={!earned.has(b.id)} index={i} />
              ))}
            </div>
          </div>
        ))}

        <button className="btn-primary self-center" onClick={() => navigate('/')}>
          Back to Map
        </button>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-brand-mist py-3 px-1 text-center">
      <div className="font-display font-extrabold text-lg text-brand-purple leading-none">{value}</div>
      <div className="text-[10px] text-slate-500 mt-1">{label}</div>
    </div>
  )
}
