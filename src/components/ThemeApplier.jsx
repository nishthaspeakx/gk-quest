import { useEffect } from 'react'
import { useProgress } from '../game/ProgressContext'
import { themeById } from '../game/shop'

// Applies the chosen theme skin's background to the page body.
export default function ThemeApplier() {
  const { progress } = useProgress()
  useEffect(() => {
    const theme = themeById(progress.theme)
    if (theme.bg) {
      document.body.style.background = theme.bg
      document.body.style.backgroundAttachment = 'fixed'
    } else {
      // Default theme: fall back to the gradient defined in index.css.
      document.body.style.background = ''
      document.body.style.backgroundAttachment = ''
    }
    // Flag dark themes so text that sits directly on the background (not inside a
    // white card) can switch to a light, readable colour (see index.css).
    document.body.classList.toggle('theme-dark', Boolean(theme.dark))
  }, [progress.theme])
  return null
}
