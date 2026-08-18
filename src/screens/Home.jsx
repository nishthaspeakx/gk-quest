import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { useProgress } from '../game/ProgressContext'
import { levelForXp } from '../game/levels'
import { canStartDay, dayStatus } from '../game/progress'
import { availableDays } from '../game/loadDay'
import { WORLDS, TOTAL_DAYS, specialOf, SPECIAL_META } from '../game/journey'
import { avatarById } from '../game/shop'
import Welcome from '../components/Welcome'

const chunk = (arr, n) =>
  arr.reduce((acc, _, i) => (i % n ? acc : [...acc, arr.slice(i, i + n)]), [])

const PER_ROW = 5

export default function Home() {
  const navigate = useNavigate()
  const { progress, exportProgress, importProgress, resetProgress } = useProgress()
  const fileRef = useRef(null)
  const currentRef = useRef(null)
  const [notice, setNotice] = useState(null)
  const [showBackup, setShowBackup] = useState(false)

  const rank = levelForXp(progress.xp)
  const contentSet = useMemo(() => new Set(availableDays()), [])

  const nextDay = progress.currentDay
  const gate = canStartDay(progress, nextDay)
  const nextHasContent = contentSet.has(nextDay)

  // Land the child on their current stone.
  useEffect(() => {
    const t = setTimeout(() => {
      currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 250)
    return () => clearTimeout(t)
  }, [])

  function play(day) {
    if (contentSet.has(day)) navigate(`/quest/${day}`)
  }

  function handleExport() {
    try {
      const blob = new Blob([exportProgress()], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'gk-quest-progress.json'
      a.click()
      URL.revokeObjectURL(url)
      setNotice('Progress downloaded ✅')
    } catch {
      setNotice('Could not export progress.')
    }
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        importProgress(String(reader.result))
        setNotice('Progress restored ✅')
      } catch (err) {
        setNotice(err.message || 'That file could not be read.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const playCta = (() => {
    if (nextDay > TOTAL_DAYS) return { text: '🏆 You finished the journey!', disabled: true }
    if (!nextHasContent) return { text: `🚀 Day ${nextDay} coming soon`, disabled: true }
    if (gate.ok) return { text: `▶ Play Day ${nextDay}`, disabled: false, onClick: () => play(nextDay) }
    return { text: '🔒 Locked', disabled: true }
  })()

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {!progress.onboarded && <Welcome />}

      {/* ---- Sticky HUD (safe-area insets keep it clear of the status bar/notch) ---- */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-white/60 safe-t safe-x">
        <div className="max-w-[30rem] mx-auto flex items-center gap-3 px-4 py-3">
          <div className="relative shrink-0">
            <div className="h-11 w-11 grid place-items-center rounded-full bg-brand-mist text-2xl shadow-pop" aria-hidden>
              {avatarById(progress.avatar).emoji}
            </div>
            <span className="absolute -bottom-1 -right-1 text-xs" aria-hidden>{rank.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline">
              <span className="font-display font-extrabold text-slate-800 truncate">{rank.title}</span>
              <span className="text-[11px] text-slate-400 shrink-0 ml-2">
                {rank.next ? `${rank.into}/${rank.span} XP` : 'Max rank!'}
              </span>
            </div>
            <div className="h-3 rounded-full bg-slate-100 overflow-hidden mt-0.5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-pink"
                initial={false}
                animate={{ width: `${Math.round(rank.progress * 100)}%` }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 shrink-0 text-sm font-display font-bold">
            <span className="inline-flex items-center gap-1 text-brand-orange">🔥{progress.streak}</span>
            <span className="inline-flex items-center gap-1 text-amber-500">💰{progress.coins}</span>
          </div>
        </div>
      </div>

      {/* ---- The winding journey ---- */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-40">
        <div className="w-full max-w-[30rem] mx-auto px-3 pt-4">
          <div className="text-center mb-2">
            <h1 className="font-display font-extrabold text-3xl bg-gradient-to-r from-brand-purple via-brand-pink to-brand-orange bg-clip-text text-transparent">
              GK Quest
            </h1>
            <p className="text-sm on-bg-muted">Your 90-day adventure map</p>
          </div>

          {/* Nav */}
          <div className="flex justify-center flex-wrap gap-2 mb-4">
            <NavBtn emoji="🏆" label="Trophies" onClick={() => navigate('/trophy')} />
            <NavBtn emoji="🛒" label="Shop" onClick={() => navigate('/shop')} />
            <NavBtn emoji="👪" label="Parent" onClick={() => navigate('/parent')} />
            {progress.practiceMode && (
              <NavBtn emoji="🎲" label="Practice" highlight onClick={() => navigate('/quest/practice')} />
            )}
          </div>

          {WORLDS.map((world) => {
            const [from, to] = world.range
            const days = Array.from({ length: to - from + 1 }, (_, i) => from + i)
            const doneInWorld = days.filter((d) => progress.completedDays[d]).length
            // Serpentine order: reverse every other row so the path snakes left↔right.
            const ordered = chunk(days, PER_ROW).flatMap((row, i) => (i % 2 ? [...row].reverse() : row))
            return (
              <section key={world.id} className={`rounded-3xl ${world.tint} p-2 sm:p-3 mb-6 shadow-card`}>
                {/* World banner */}
                <div
                  className={`rounded-2xl bg-gradient-to-r ${world.gradient} text-white px-3 py-3 mb-4 shadow-pop flex items-center gap-3`}
                >
                  <span className="text-3xl shrink-0">{world.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display font-extrabold text-lg sm:text-xl leading-tight truncate">{world.name}</h2>
                    <p className="text-white/85 text-xs">{world.subtitle}</p>
                  </div>
                  <span className="font-display font-bold text-sm bg-white/25 rounded-full px-3 py-1 shrink-0">
                    {doneInWorld}/{days.length}
                  </span>
                </div>

                {/* Serpentine grid of day nodes — widths computed from the container,
                    so it can never spill past the screen edge on any phone. */}
                <div
                  className="grid gap-x-1.5 gap-y-3"
                  style={{ gridTemplateColumns: `repeat(${PER_ROW}, minmax(0, 1fr))` }}
                >
                  {ordered.map((day) => (
                    <Stone
                      key={day}
                      day={day}
                      status={dayStatus(progress, day)}
                      record={progress.completedDays[day]}
                      special={specialOf(day)}
                      accent={world.accent}
                      hasContent={contentSet.has(day)}
                      gateOk={gate.ok}
                      innerRef={day === nextDay ? currentRef : null}
                      onPlay={() => play(day)}
                    />
                  ))}
                </div>
              </section>
            )
          })}

          {/* Backup / restore (tucked away) */}
          <div className="text-center">
            <button
              className="inline-flex items-center justify-center min-h-[48px] px-4 text-sm text-slate-400 font-display font-bold underline active:scale-95 transition-transform"
              onClick={() => setShowBackup((s) => !s)}
            >
              {showBackup ? 'Hide backup options' : '⚙ Backup & restore'}
            </button>
            {showBackup && (
              <div className="card-fun mt-3 text-left">
                <p className="text-xs text-slate-400 mb-3">
                  Progress is saved on this device. Export a file to back it up or move it.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="btn-fun bg-brand-teal text-base px-5 py-2 min-h-[48px]" onClick={handleExport}>⬇ Export</button>
                  <button className="btn-fun bg-brand-blue text-base px-5 py-2 min-h-[48px]" onClick={() => fileRef.current?.click()}>⬆ Import</button>
                  <button
                    className="btn-fun bg-slate-400 text-base px-5 py-2 min-h-[48px]"
                    onClick={() => {
                      if (window.confirm('Reset all progress? This cannot be undone.')) {
                        resetProgress()
                        setNotice('Progress reset.')
                      }
                    }}
                  >↺ Reset</button>
                  <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImportFile} />
                </div>
                {notice && <p className="mt-3 text-sm font-body text-brand-purple">{notice}</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---- Sticky Play button (clears the home indicator via safe-area inset) ---- */}
      <div
        className="fixed bottom-0 inset-x-0 z-20 pt-4 bg-gradient-to-t from-white via-white/90 to-transparent"
        style={{
          paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))',
          paddingLeft: 'calc(1rem + env(safe-area-inset-left))',
          paddingRight: 'calc(1rem + env(safe-area-inset-right))',
        }}
      >
        <div className="max-w-[30rem] mx-auto">
          <motion.button
            className={`btn-fun w-full text-xl ${playCta.disabled ? 'bg-slate-300 text-slate-500' : 'bg-brand-purple text-white hover:bg-brand-indigo'}`}
            whileTap={playCta.disabled ? undefined : { scale: 0.97 }}
            disabled={playCta.disabled}
            onClick={playCta.onClick}
          >
            {playCta.text}
          </motion.button>
        </div>
      </div>
    </div>
  )
}

// ---- A single day node on the path ----
// Every node is the SAME round size/shape. Boss/review/finale days are marked
// only with a gold ring + a small crown/star badge — never a different size.
function Stone({ day, status, record, special, accent, hasContent, gateOk, innerRef, onPlay }) {
  const playable = status === 'completed' || (status === 'current' && gateOk && hasContent)
  const meta = special ? SPECIAL_META[special] : null

  let colour
  let style
  if (status === 'completed') {
    colour = 'text-white border-white/70'
    style = { backgroundColor: accent }
  } else if (status === 'current') {
    colour = 'bg-white border-brand-purple text-brand-purple'
  } else {
    colour = 'bg-slate-200 border-slate-100 text-slate-400'
  }

  return (
    <div className="flex flex-col items-center min-w-0">
      {/* Reserved slot for the PLAY badge so every row stays vertically aligned */}
      <div className="h-4 mb-0.5 w-full flex items-end justify-center">
        {status === 'current' && (
          <motion.span
            className="max-w-full truncate text-[9px] font-display font-extrabold text-brand-purple bg-white rounded-full px-1.5 py-0.5 shadow-pop"
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            PLAY ▶
          </motion.span>
        )}
      </div>

      <motion.button
        ref={innerRef}
        disabled={!playable}
        onClick={playable ? onPlay : undefined}
        whileTap={playable ? { scale: 0.9 } : undefined}
        animate={status === 'current' ? { scale: [1, 1.08, 1] } : undefined}
        transition={status === 'current' ? { repeat: Infinity, duration: 1.5, ease: 'easeInOut' } : undefined}
        // Tile scales with the grid cell but never exceeds 4rem — so it always
        // fits, and stays ≥48px on the narrowest phones. aspect-square keeps it round.
        style={{ width: 'min(100%, 4rem)', ...style }}
        className={`relative aspect-square rounded-full border-4 grid place-items-center shadow-pop ${colour}
          ${status === 'current' ? 'ring-4 ring-brand-purple/40' : special ? 'ring-4 ring-amber-400' : ''}`}
        aria-label={`Day ${day}${meta ? ' — ' + meta.label : ''}`}
      >
        {status === 'locked' ? (
          <span className="text-lg opacity-70">🔒</span>
        ) : (
          <span className="font-display font-extrabold text-sm sm:text-base leading-none">{day}</span>
        )}

        {/* Special badge sits on the top-centre — only extends upward, so it can
            never overlap a neighbouring node or the screen edge. */}
        {special && (
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 h-5 w-5 grid place-items-center rounded-full bg-white shadow text-[12px] leading-none">
            {meta.emoji}
          </span>
        )}
      </motion.button>

      {/* Stars (reserved height so all tiles line up) */}
      <span className="mt-1 h-3 leading-none text-[10px]">{record ? '⭐'.repeat(record.stars) : ''}</span>
    </div>
  )
}

// Small pill navigation button (Trophies / Shop / Parent / Practice).
function NavBtn({ emoji, label, onClick, highlight }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 min-h-[48px] rounded-full px-5 py-2 shadow-pop font-display font-bold text-sm
        ${highlight ? 'bg-brand-green text-white' : 'bg-white text-slate-700'}`}
    >
      <span>{emoji}</span>
      {label}
    </motion.button>
  )
}
