import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { useProgress } from '../game/ProgressContext'
import ParentGate from '../components/ParentGate'

export default function ParentDashboard() {
  const navigate = useNavigate()
  const { progress, updateProgress } = useProgress()
  return (
    <ParentGate title="Parent Area" onBack={() => navigate('/')}>
      <Dashboard progress={progress} updateProgress={updateProgress} navigate={navigate} />
    </ParentGate>
  )
}

// ---- The dashboard itself ----
function Dashboard({ progress, updateProgress, navigate }) {
  const completed = Object.values(progress.completedDays)
  const daysDone = completed.length
  const avgStars = daysDone ? (completed.reduce((n, d) => n + d.stars, 0) / daysDone).toFixed(1) : '0'

  // Strongest / weakest topics by accuracy (needs a few attempts to be meaningful).
  const topics = useMemo(() => {
    const rows = Object.keys(progress.topicAttempts)
      .map((t) => {
        const attempted = progress.topicAttempts[t]
        const correct = progress.topicStats[t] || 0
        return { topic: t, attempted, correct, acc: attempted ? correct / attempted : 0 }
      })
      .filter((r) => r.attempted >= 3)
    const sorted = [...rows].sort((a, b) => b.acc - a.acc)
    const strongest = sorted.slice(0, 3)
    const strongestSet = new Set(strongest.map((r) => r.topic))
    // "Needs practice" = genuinely weak topics only: below 80% accuracy AND not
    // already shown as a strength. This stops a single 100% topic from appearing
    // in both columns (which looked wrong).
    const weakest = [...sorted]
      .reverse()
      .filter((r) => r.acc < 0.8 && !strongestSet.has(r.topic))
      .slice(0, 3)
    return { hasData: rows.length > 0, strongest, weakest }
  }, [progress])

  return (
    <div className="min-h-screen safe-t safe-b safe-x">
      <div className="max-w-[30rem] mx-auto flex flex-col gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="h-12 w-12 shrink-0 grid place-items-center rounded-full bg-white shadow-pop font-bold text-slate-500 active:scale-90 transition-transform" aria-label="Back home">✕</button>
          <h1 className="font-display font-extrabold text-2xl text-brand-purple flex-1">👪 Parent Dashboard</h1>
          <button className="inline-flex items-center justify-center min-h-[48px] px-3 text-sm font-display font-bold text-slate-500 underline active:scale-95 transition-transform" onClick={() => navigate('/settings')}>⚙ Settings</button>
        </div>

        {progress.childName && (
          <p className="on-bg-muted -mt-2">Progress for <span className="font-bold on-bg-strong">{progress.childName}</span></p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <Stat label="Days done" value={daysDone} />
          <Stat label="Avg stars" value={`${avgStars}⭐`} />
          <Stat label="Streak" value={`${progress.streak}🔥`} />
          <Stat label="Questions" value={progress.stats.totalQuestions} />
        </div>

        {/* Topics */}
        <div className="card-fun">
          <h2 className="font-display font-extrabold text-slate-700 mb-3">Topic strengths</h2>
          {!topics.hasData ? (
            <p className="text-sm text-slate-400">Play a few more quests to see strongest and weakest topics.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <TopicList title="💪 Strongest" rows={topics.strongest} tone="text-brand-green" />
              {topics.weakest.length > 0 ? (
                <TopicList title="📚 Needs practice" rows={topics.weakest} tone="text-brand-orange" />
              ) : (
                <div>
                  <h3 className="font-display font-bold text-sm mb-1 text-brand-orange">📚 Needs practice</h3>
                  <p className="text-sm text-slate-400">Nothing to worry about yet — great work so far!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Practice mode */}
        <div className="card-fun">
          <div className="flex items-center justify-between">
            <div className="pr-3">
              <h2 className="font-display font-extrabold text-slate-700">Practice Mode</h2>
              <p className="text-xs text-slate-400 mt-1">
                Lets your child replay past days and take a random mixed quiz for extra practice — without affecting the daily streak or unlocking new days.
              </p>
            </div>
            <Toggle on={progress.practiceMode} onClick={() => updateProgress({ practiceMode: !progress.practiceMode })} />
          </div>
        </div>

        <p className="text-center text-xs on-bg-muted pb-6">Keep the daily habit strong. 🌟</p>
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

function TopicList({ title, rows, tone }) {
  return (
    <div>
      <h3 className={`font-display font-bold text-sm mb-1 ${tone}`}>{title}</h3>
      <ul className="space-y-1">
        {rows.map((r) => (
          <li key={r.topic} className="flex justify-between text-sm text-slate-600">
            <span className="truncate pr-2">{r.topic}</span>
            <span className="font-bold shrink-0">{Math.round(r.acc * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Toggle({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 min-h-[48px] w-16 flex items-center justify-center active:scale-95 transition-transform"
      aria-pressed={on}
      aria-label="Toggle"
    >
      <span className={`w-16 h-9 rounded-full p-1 flex transition-colors ${on ? 'bg-brand-green' : 'bg-slate-300'}`}>
        <motion.span layout className="h-7 w-7 rounded-full bg-white shadow" style={{ marginLeft: on ? 'auto' : 0 }} />
      </span>
    </button>
  )
}
