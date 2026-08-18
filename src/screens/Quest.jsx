import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'

import { loadDay, loadMixedQuiz } from '../game/loadDay'
import { isCorrect } from '../game/checkAnswer'
import { scoreForAnswer, starsForResult } from '../game/scoring'
import { levelForXp } from '../game/levels'
import { play } from '../game/sound'
import { useProgress } from '../game/ProgressContext'

import ProgressBar from '../components/ProgressBar'
import Mascot from '../components/Mascot'
import FunFactCard from '../components/FunFactCard'

import MCQQuestion from '../components/MCQQuestion'
import TrueFalseQuestion from '../components/TrueFalseQuestion'
import ImageMCQQuestion from '../components/ImageMCQQuestion'
import OddOneOutQuestion from '../components/OddOneOutQuestion'
import FillBlankQuestion from '../components/FillBlankQuestion'
import MatchQuestion from '../components/MatchQuestion'
import SequenceQuestion from '../components/SequenceQuestion'

const REGISTRY = {
  mcq: MCQQuestion,
  truefalse: TrueFalseQuestion,
  image_mcq: ImageMCQQuestion,
  odd_one_out: OddOneOutQuestion,
  fill_blank: FillBlankQuestion,
  match: MatchQuestion,
  sequence: SequenceQuestion,
}

export default function Quest() {
  const { day } = useParams()
  const navigate = useNavigate()
  const { completeQuest, progress } = useProgress()
  const isPractice = day === 'practice'

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('answering') // 'answering' | 'feedback'
  const [response, setResponse] = useState(null)
  const [correct, setCorrect] = useState(false)
  const [breakdown, setBreakdown] = useState(null)

  // Running totals
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [streak, setStreak] = useState(0)

  const startRef = useRef(0)
  const bestComboRef = useRef(0)
  const fastCountRef = useRef(0) // correct answers that earned a speed bonus
  const topicRef = useRef({}) // { topic: correctCount }
  const topicAttemptRef = useRef({}) // { topic: attemptedCount }
  const lockRef = useRef(false) // guards against double-answering one question
  const finishedRef = useRef(false) // guards against finishing twice (double-tap)

  // The Next/Finish button now lives in a sticky bottom bar (always visible), so
  // it never depends on scrolling. On a new question, jump to the top; on
  // feedback, gently reveal the banner + "Did you know?" fact (the extra bottom
  // padding keeps them clear of the pinned button). If this scroll ever stalls,
  // nothing breaks — the button stays pinned regardless.
  useEffect(() => {
    if (phase === 'feedback') {
      const t = setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 120)
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [phase, index])

  // Load the day's questions.
  useEffect(() => {
    let alive = true
    setData(null)
    setError(null)
    setIndex(0)
    setPhase('answering')
    setResponse(null)
    setScore(0)
    setCorrectCount(0)
    setStreak(0)
    bestComboRef.current = 0
    fastCountRef.current = 0
    topicRef.current = {}
    topicAttemptRef.current = {}
    lockRef.current = false
    finishedRef.current = false
    const loader = isPractice
      ? loadMixedQuiz(Object.keys(progress.completedDays).map(Number))
      : loadDay(Number(day))
    loader
      .then((d) => {
        if (alive) {
          setData(d)
          startRef.current = performance.now()
        }
      })
      .catch((e) => alive && setError(e.message))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day])

  const questions = data?.questions ?? []
  const question = questions[index]

  const handleAnswer = useCallback(
    (resp) => {
      if (lockRef.current || phase !== 'answering' || !question) return
      lockRef.current = true // one answer per question, even on rapid taps
      const elapsedMs = performance.now() - startRef.current
      const ok = isCorrect(question, resp)
      const newStreak = ok ? streak + 1 : 0
      const result = scoreForAnswer({ correct: ok, streak: newStreak, elapsedMs })

      play(ok ? 'correct' : 'wrong')
      setResponse(resp)
      setCorrect(ok)
      setBreakdown(result)
      setPhase('feedback')
      setScore((s) => s + result.coins)
      setStreak(newStreak)
      bestComboRef.current = Math.max(bestComboRef.current, newStreak)
      const topic = question.topic || 'General'
      topicAttemptRef.current[topic] = (topicAttemptRef.current[topic] || 0) + 1
      if (ok) {
        setCorrectCount((c) => c + 1)
        if (result.bonus > 0) fastCountRef.current += 1
        topicRef.current[topic] = (topicRef.current[topic] || 0) + 1
      }

      if (ok && result.multiplier >= 3) {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 }, disableForReducedMotion: true })
      }
    },
    [phase, question, streak],
  )

  function next() {
    if (phase !== 'feedback') return
    if (index + 1 >= questions.length) {
      if (finishedRef.current) return // ignore a double-tap on Finish
      finishedRef.current = true

      let summary
      if (isPractice) {
        // Practice: celebrate but change nothing (no XP/coins/streak/gate).
        const stars = starsForResult(correctCount, questions.length)
        const lvl = levelForXp(progress.xp)
        summary = {
          day: 'practice',
          stars,
          isReplay: true,
          xpEarned: 0,
          coinsEarned: 0,
          totalXp: progress.xp,
          totalCoins: progress.coins,
          leveledUp: false,
          prevLevel: lvl,
          newLevel: lvl,
          streak: progress.streak,
          streakMilestone: null,
          usedFreeze: false,
          newBadges: [],
        }
      } else {
        // Commit the finished quest to persistent progress, then celebrate.
        summary = completeQuest({
          day: Number(day),
          correctCount,
          total: questions.length,
          questCoins: score,
          bestCombo: bestComboRef.current,
          fastCount: fastCountRef.current,
          topicBreakdown: topicRef.current,
          topicAttempts: topicAttemptRef.current,
        })
      }
      navigate('/results', {
        state: {
          summary,
          theme: data.theme,
          learned: questions.map((q) => q.funFact),
        },
      })
      return
    }
    lockRef.current = false
    // Math.min guards against index overrun if Next is tapped multiple times fast.
    setIndex((i) => Math.min(i + 1, questions.length - 1))
    setPhase('answering')
    setResponse(null)
    setCorrect(false)
    setBreakdown(null)
    startRef.current = performance.now()
  }

  // --- Loading / error states ---
  if (error) {
    return (
      <Centered>
        <div className="card-fun text-center max-w-sm">
          <div className="fluid-mascot mb-3">🦉</div>
          <p className="font-display font-bold text-lg text-slate-700 mb-4">
            Hmm, I couldn't find that quest.
          </p>
          <p className="text-slate-500 mb-5 text-sm">{error}</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Back to Start</button>
        </div>
      </Centered>
    )
  }
  if (!data) {
    return (
      <Centered>
        <motion.div className="fluid-mascot" animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
          🦉
        </motion.div>
        <p className="mt-4 font-display font-bold text-slate-500">Loading your quest…</p>
      </Centered>
    )
  }

  // Safety net: never try to render a question that isn't there.
  if (!question) {
    return (
      <Centered>
        <motion.div className="fluid-mascot" animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
          🦉
        </motion.div>
        <p className="mt-4 font-display font-bold text-slate-500">Loading your quest…</p>
      </Centered>
    )
  }

  const QuestionComponent = REGISTRY[question.type]
  const showPrompt = question.type !== 'fill_blank'
  const mood = phase === 'feedback' ? (correct ? 'happy' : 'wrong') : 'idle'

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{
        paddingTop: 'calc(1rem + env(safe-area-inset-top))',
        paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))',
        paddingLeft: 'calc(1rem + env(safe-area-inset-left))',
        paddingRight: 'calc(1rem + env(safe-area-inset-right))',
      }}
    >
      <div className="w-full max-w-[30rem] flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="h-12 w-12 shrink-0 grid place-items-center rounded-full bg-white shadow-pop font-bold text-slate-500 active:scale-90 transition-transform"
            aria-label="Back home"
          >
            ✕
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-display font-extrabold on-bg-strong truncate">
              {isPractice ? '🎲 Practice Quiz' : `Day ${data.day}${data.isBoss ? ' · ⭐ Boss' : ''}`}
            </p>
            <p className="text-xs on-bg-muted truncate">{data.theme}</p>
          </div>
          {/* The number climbing here IS your coins — exactly what you can spend
              in the Shop. It also fills your level bar. One clear currency. */}
          <span className="pill bg-brand-purple">💰 {score}</span>
          {streak >= 2 && <span className="pill bg-brand-orange">🔥 {streak}</span>}
        </div>

        <ProgressBar current={index} total={questions.length} />

        {/* Question card — vertical slide only, so a mid-animation state can never
            push the card off the side of the screen. */}
        <motion.div
          key={question.id}
          initial={{ y: 14 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          className="card-fun"
        >
          {showPrompt && (
            <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800 mb-5 leading-snug">
              {question.question}
            </h2>
          )}
          <QuestionComponent
            key={question.id}
            question={question}
            phase={phase}
            response={response}
            onAnswer={handleAnswer}
          />
        </motion.div>

        {/* Feedback — the Next/Finish action now lives in a sticky bottom bar
            (below), so it's ALWAYS visible without scrolling. The extra bottom
            padding keeps the fun fact clear of that bar. */}
        <AnimatePresence>
          {phase === 'feedback' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3 pb-40"
            >
              <div
                className={`rounded-2xl px-5 py-3 font-display font-extrabold text-lg text-white shadow-pop flex items-center justify-between
                  ${correct ? 'bg-brand-green' : 'bg-brand-coral'}`}
              >
                <span>{correct ? '🎉 Correct!' : '💛 Good try!'}</span>
                {correct && breakdown?.coins > 0 && (
                  <span className="text-base">
                    +{breakdown.coins} 💰
                    {breakdown.bonus > 0 && <span className="opacity-90"> · ⚡{breakdown.bonus}</span>}
                    {breakdown.multiplier > 1 && <span className="opacity-90"> · ×{breakdown.multiplier}</span>}
                  </span>
                )}
              </div>

              <FunFactCard fact={question.funFact} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky action bar — the Next/Finish button is pinned to the bottom of the
          screen during feedback, so a child never has to scroll to find it. */}
      {phase === 'feedback' && (
        <div
          className="fixed bottom-0 inset-x-0 z-20 pt-6 bg-gradient-to-t from-white via-white/95 to-transparent"
          style={{
            paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))',
            paddingLeft: 'calc(1rem + env(safe-area-inset-left))',
            paddingRight: 'calc(1rem + env(safe-area-inset-right))',
          }}
        >
          <div className="max-w-[30rem] mx-auto">
            <motion.button
              className="btn-primary w-full text-xl"
              whileTap={{ scale: 0.97 }}
              onClick={next}
            >
              {index + 1 >= questions.length ? 'Finish 🏁' : 'Next →'}
            </motion.button>
          </div>
        </div>
      )}

      {/* Mascot in the corner (never blocks taps). During feedback we hide its
          speech bubble (the banner already reacts) so it can't cover the fun
          fact, and lift it above the sticky action bar. */}
      <div
        className="fixed z-10 pointer-events-none"
        style={{
          bottom:
            phase === 'feedback'
              ? 'calc(5.5rem + env(safe-area-inset-bottom))'
              : 'calc(0.75rem + env(safe-area-inset-bottom))',
          right: 'calc(0.75rem + env(safe-area-inset-right))',
        }}
      >
        <Mascot mood={mood} seed={index + (correct ? 1 : 0)} showBubble={phase !== 'feedback'} />
      </div>
    </div>
  )
}

function Centered({ children }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center safe-t safe-b">
      {children}
    </div>
  )
}
