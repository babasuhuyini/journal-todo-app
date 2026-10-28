import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import useJournal from '../hooks/useJournal.js'
import useLocalStorage from '../hooks/useLocalStorage.js'
import useTheme from '../hooks/useTheme.js'
import {
  BookIcon,
  ChecklistIcon,
  ChevronDownIcon,
  MoonIcon,
  PlusIcon,
  SunIcon,
} from './icons.jsx'
import { VIEWS, normalizeTodo } from '../lib/todos.js'

const TASK_VIEWS = ['today', 'upcoming', 'overdue', 'someday']

const linkClass = (base) => ({ isActive }) => (isActive ? `${base} active` : base)

export default function Sidebar() {
  const navigate = useNavigate()
  const [theme, setTheme] = useTheme()
  const { entries, create } = useJournal()
  const [todos] = useLocalStorage('todos.items', [])
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const openTodos = (Array.isArray(todos) ? todos : []).map(normalizeTodo).filter((t) => !t.done)

  useEffect(() => {
    if (!menuOpen) return
    const close = (e) => !menuRef.current?.contains(e.target) && setMenuOpen(false)
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  function newEntry() {
    setMenuOpen(false)
    navigate(`/journal/${create().id}`)
  }

  function newTask() {
    setMenuOpen(false)
    navigate('/todos', { state: { focusComposer: Date.now() } })
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">
          <BookIcon width={17} height={17} strokeWidth={2.2} />
        </span>
        <span className="brand-name">Daybook</span>
      </div>

      <div className="new-menu" ref={menuRef}>
        <button
          className="new-btn"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
        >
          <PlusIcon width={18} height={18} strokeWidth={2.4} />
          New
          <ChevronDownIcon className="chev" width={16} height={16} />
        </button>
        {menuOpen && (
          <div className="new-popover" role="menu">
            <button className="menu-item" role="menuitem" onClick={newEntry}>
              <BookIcon width={16} height={16} />
              Journal entry
            </button>
            <button className="menu-item" role="menuitem" onClick={newTask}>
              <ChecklistIcon width={16} height={16} />
              Task
            </button>
          </div>
        )}
      </div>

      <nav className="side-nav" aria-label="Main">
        <NavLink to="/journal" className={linkClass('side-link')}>
          <BookIcon width={17} height={17} />
          <span>Journal</span>
          <span className="side-count">{entries.length || ''}</span>
        </NavLink>
        <NavLink to="/todos" end className={linkClass('side-link')}>
          <ChecklistIcon width={17} height={17} />
          <span>Tasks</span>
          <span className="side-count">{openTodos.length || ''}</span>
        </NavLink>
        {TASK_VIEWS.map((key) => {
          const count = openTodos.filter(VIEWS[key].test).length
          return (
            <NavLink key={key} to={`/todos/${key}`} className={linkClass('side-sublink')}>
              <span>{VIEWS[key].label}</span>
              <span className={key === 'overdue' && count ? 'side-count alert' : 'side-count'}>
                {count || ''}
              </span>
            </NavLink>
          )
        })}
      </nav>

      <div className="sidebar-foot">
        <div className="theme-toggle" role="radiogroup" aria-label="Theme">
          <button
            role="radio"
            aria-checked={theme === 'light'}
            className={theme === 'light' ? 'theme-option active' : 'theme-option'}
            onClick={() => setTheme('light')}
          >
            <SunIcon width={15} height={15} />
            Light
          </button>
          <button
            role="radio"
            aria-checked={theme === 'dark'}
            className={theme === 'dark' ? 'theme-option active' : 'theme-option'}
            onClick={() => setTheme('dark')}
          >
            <MoonIcon width={15} height={15} />
            Dark
          </button>
        </div>
      </div>
    </aside>
  )
}
