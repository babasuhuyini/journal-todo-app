import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/base.css'
import './styles/shell.css'
import './styles/journal.css'
import './styles/todos.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Hash URLs (/#/journal) work on static hosts like GitHub Pages, which can't route deep links. */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
)
