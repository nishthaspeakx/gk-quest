import { useState } from 'react'
import { useProgress } from '../game/ProgressContext'
import PinInput from './PinInput'

// Session-scoped "unlocked" flag: once the parent enters the PIN, both the
// Parent Dashboard and Settings stay open until the page is reloaded (a kid
// still can't get past the first gate). Reloading re-locks.
const FLAG = 'gkquest.parentUnlocked'
function readUnlocked() {
  try {
    return sessionStorage.getItem(FLAG) === '1'
  } catch {
    return false
  }
}
function writeUnlocked() {
  try {
    sessionStorage.setItem(FLAG, '1')
  } catch {
    // ignore — falls back to per-mount unlocking
  }
}

// Gates its children behind the 4-digit Parent PIN. First visit (no PIN yet)
// lets the parent create one; afterwards the PIN must be entered to continue.
// Because entry requires the current PIN, changing the PIN inside (Settings) is
// safe — only someone who knows it can get in.
export default function ParentGate({ title = 'Parent Area', onBack, children }) {
  const { progress, updateProgress } = useProgress()
  const [unlocked, setUnlocked] = useState(readUnlocked)

  if (unlocked) return children

  const hasPin = Boolean(progress.parentPin)
  const unlock = () => {
    writeUnlocked()
    setUnlocked(true)
  }
  return (
    <PinGate
      title={title}
      hasPin={hasPin}
      pin={progress.parentPin}
      onSetPin={(p) => updateProgress({ parentPin: p })}
      onUnlock={unlock}
      onBack={onBack}
    />
  )
}

// Create a PIN on first visit, otherwise ask for it.
function PinGate({ title, hasPin, pin, onSetPin, onUnlock, onBack }) {
  const [entry, setEntry] = useState('')
  const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState('')

  const entryOk = /^\d{4}$/.test(entry)
  const confirmOk = /^\d{4}$/.test(confirm)
  const match = entry === confirm
  const mismatch = !hasPin && confirmOk && entryOk && !match
  const canCreate = entryOk && confirmOk && match
  const canUnlock = entryOk
  const enabled = hasPin ? canUnlock : canCreate

  function submit() {
    if (!enabled) return
    if (hasPin) {
      if (entry === pin) onUnlock()
      else {
        setErr('Wrong PIN. Try again.')
        setEntry('')
      }
    } else {
      onSetPin(entry)
      onUnlock()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-4 safe-t safe-b">
      <div className="fluid-mascot">👪</div>
      <h1 className="font-display font-extrabold text-2xl text-brand-purple">{title}</h1>
      <p className="text-slate-500 max-w-xs">
        {hasPin ? 'Enter your 4-digit PIN to continue.' : 'Create a 4-digit PIN to protect this area.'}
      </p>

      <div className="w-full max-w-xs flex flex-col gap-3">
        <div>
          {!hasPin && <label className="block text-sm font-display font-bold text-slate-500 mb-1">Create PIN</label>}
          <PinInput value={entry} onChange={(v) => { setEntry(v); setErr('') }} aria-label="PIN" autoFocus />
        </div>
        {!hasPin && (
          <div>
            <label className="block text-sm font-display font-bold text-slate-500 mb-1">Confirm PIN</label>
            <PinInput value={confirm} onChange={(v) => { setConfirm(v); setErr('') }} aria-label="Confirm PIN" />
          </div>
        )}
      </div>

      {(mismatch || err) && (
        <p className="text-rose-500 text-sm font-body font-semibold">
          {mismatch ? "The two PINs don't match." : err}
        </p>
      )}

      <div className="flex gap-3">
        <button className="btn-fun bg-slate-300 text-slate-600" onClick={onBack}>Back</button>
        <button
          className={`btn-fun ${enabled ? 'bg-brand-purple text-white hover:bg-brand-indigo' : 'bg-slate-300 text-slate-500'}`}
          disabled={!enabled}
          onClick={submit}
        >
          {hasPin ? 'Unlock' : 'Create PIN'}
        </button>
      </div>
    </div>
  )
}
