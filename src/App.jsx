import { Routes, Route } from 'react-router-dom'
import Home from './screens/Home.jsx'
import Quest from './screens/Quest.jsx'
import Results from './screens/Results.jsx'
import TrophyRoom from './screens/TrophyRoom.jsx'
import Shop from './screens/Shop.jsx'
import ParentDashboard from './screens/ParentDashboard.jsx'
import Settings from './screens/Settings.jsx'
import ThemeApplier from './components/ThemeApplier.jsx'
import SoundSync from './components/SoundSync.jsx'

export default function App() {
  return (
    <>
      <ThemeApplier />
      <SoundSync />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quest/:day" element={<Quest />} />
        <Route path="/results" element={<Results />} />
        <Route path="/trophy" element={<TrophyRoom />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  )
}
