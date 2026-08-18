import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ProgressProvider } from './game/ProgressContext.jsx'
import './index.css'

// NOTE: React.StrictMode is intentionally omitted. Its dev-only double-mount
// interacts badly with Framer Motion (which drives every screen here), leaving
// entrance animations frozen mid-transition. The app uses animations heavily,
// so we opt out rather than ship a janky dev/verify experience.
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ProgressProvider>
      <App />
    </ProgressProvider>
  </BrowserRouter>,
)
