// Tiny, self-contained sound effects using the Web Audio API — no audio files,
// so it stays lightweight and works fully offline. Respects the mute setting.

let ctx = null
let enabled = true

export function setSoundEnabled(v) {
  enabled = v
}

function audio() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)()
    } catch {
      ctx = null
    }
  }
  return ctx
}

// Play a single note. `start` is an offset (seconds) from now.
function note(freq, start, dur, { type = 'sine', gain = 0.14 } = {}) {
  const c = audio()
  if (!c) return
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  osc.connect(g)
  g.connect(c.destination)
  const t = c.currentTime + start
  g.gain.setValueAtTime(0.0001, t)
  g.gain.linearRampToValueAtTime(gain, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.start(t)
  osc.stop(t + dur + 0.03)
}

const SFX = {
  correct() {
    note(660, 0, 0.12, { type: 'triangle' })
    note(880, 0.1, 0.16, { type: 'triangle' })
  },
  wrong() {
    // Gentle, not harsh — a soft downward "aww".
    note(320, 0, 0.18, { type: 'sine', gain: 0.12 })
    note(240, 0.12, 0.22, { type: 'sine', gain: 0.12 })
  },
  coin() {
    note(1200, 0, 0.06, { type: 'square', gain: 0.07 })
    note(1650, 0.05, 0.09, { type: 'square', gain: 0.07 })
  },
  levelup() {
    ;[523, 659, 784, 1047].forEach((f, i) => note(f, i * 0.11, 0.2, { type: 'triangle', gain: 0.13 }))
  },
}

export function play(name) {
  if (!enabled) return
  try {
    const c = audio()
    if (c && c.state === 'suspended') c.resume()
    SFX[name]?.()
  } catch {
    // Ignore — audio is a nice-to-have, never break the app over it.
  }
}
