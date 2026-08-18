import { useEffect } from 'react'
import { useProgress } from '../game/ProgressContext'
import { setSoundEnabled } from '../game/sound'

// Keeps the sound engine's mute state in sync with the saved setting.
export default function SoundSync() {
  const { progress } = useProgress()
  useEffect(() => {
    setSoundEnabled(progress.soundOn !== false)
  }, [progress.soundOn])
  return null
}
