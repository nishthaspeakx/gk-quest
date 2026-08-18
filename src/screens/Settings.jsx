import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useProgress } from '../game/ProgressContext'
import PinInput from '../components/PinInput'
import ParentGate from '../components/ParentGate'

export default function Settings() {
  const navigate = useNavigate()
  const { progress, updateProgress } = useProgress()

  const [name, setName] = useState(progress.childName || '')
  const [pin, setPin] = useState('')
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState('')

  function save() {
    setErr('')
    if (pin && !/^\d{4}$/.test(pin)) {
      setErr('PIN must be exactly 4 digits (or leave blank to keep the current one).')
      return
    }
    updateProgress((p) => ({
      ...p,
      childName: name.trim(),
      parentPin: pin ? pin : p.parentPin,
    }))
    setPin('')
    setSaved(true)
    setTimeout(() => setSaved(false), 1600)
  }

  return (
    <ParentGate title="Settings" onBack={() => navigate(-1)}>
    <div className="min-h-screen safe-t safe-b safe-x">
      <div className="max-w-md mx-auto flex flex-col gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-12 w-12 shrink-0 grid place-items-center rounded-full bg-white shadow-pop font-bold text-slate-500 active:scale-90 transition-transform" aria-label="Back">✕</button>
          <h1 className="font-display font-extrabold text-2xl text-brand-purple">⚙ Settings</h1>
        </div>

        <div className="card-fun flex flex-col gap-2">
          <label className="font-display font-bold text-slate-700">Child's name</label>
          <p className="text-xs text-slate-400 -mt-1">Used on the certificate after Day 90.</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Aarav"
            maxLength={30}
            className="rounded-2xl border-4 border-slate-200 px-4 py-3 text-lg font-body focus:border-brand-purple outline-none"
          />
        </div>

        <div className="card-fun flex items-center justify-between">
          <div className="pr-3">
            <h2 className="font-display font-bold text-slate-700">Sound effects</h2>
            <p className="text-xs text-slate-400 mt-1">Little sounds for correct answers, coins and level-ups.</p>
          </div>
          <button
            onClick={() => updateProgress({ soundOn: !(progress.soundOn !== false) })}
            className="shrink-0 min-h-[48px] w-16 flex items-center justify-center active:scale-95 transition-transform"
            aria-pressed={progress.soundOn !== false}
            aria-label="Toggle sound"
          >
            <span className={`w-16 h-9 rounded-full p-1 flex transition-colors ${progress.soundOn !== false ? 'bg-brand-green' : 'bg-slate-300'}`}>
              <span className="h-7 w-7 rounded-full bg-white shadow" style={{ marginLeft: progress.soundOn !== false ? 'auto' : 0 }} />
            </span>
          </button>
        </div>

        <div className="card-fun flex flex-col gap-2">
          <label className="font-display font-bold text-slate-700">Parent PIN</label>
          <p className="text-xs text-slate-400 -mt-1">
            {progress.parentPin ? 'Enter a new 4-digit PIN to change it, or leave blank to keep it.' : 'Set a 4-digit PIN to protect the Parent Dashboard.'}
          </p>
          <div className="self-start">
            <PinInput value={pin} onChange={setPin} aria-label="Parent PIN" />
          </div>
        </div>

        {err && <p className="text-rose-500 text-sm font-body">{err}</p>}
        <div className="flex items-center gap-3">
          <button className="btn-primary" onClick={save}>Save</button>
          {saved && <span className="font-display font-bold text-brand-green">Saved ✓</span>}
        </div>
      </div>
    </div>
    </ParentGate>
  )
}
