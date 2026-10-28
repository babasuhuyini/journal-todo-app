import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Journal from './pages/Journal.jsx'
import Todos from './pages/Todos.jsx'
import { MenuIcon } from './components/icons.jsx'

export default function App() {
  const [navOpen, setNavOpen] = useState(false)
  const { pathname } = useLocation()

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setNavOpen(false), [pathname])

  return (
    <div className={navOpen ? 'shell nav-open' : 'shell'}>
      <Sidebar />
      <div className="scrim" onClick={() => setNavOpen(false)} />

      <div className="main">
        <header className="topbar">
          <button className="icon-btn" onClick={() => setNavOpen(true)} aria-label="Open menu">
            <MenuIcon />
          </button>
          <span className="topbar-title">Daybook</span>
        </header>

        <Routes>
          <Route path="/" element={<Navigate to="/journal" replace />} />
          <Route path="/journal/:entryId?" element={<Journal />} />
          <Route path="/todos/:view?" element={<Todos />} />
          <Route path="*" element={<Navigate to="/journal" replace />} />
        </Routes>
      </div>
    </div>
  )
}
