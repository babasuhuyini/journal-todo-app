import { useEffect, useRef, useState } from 'react'
import DuePicker from './DuePicker.jsx'
import PriorityPicker from './PriorityPicker.jsx'
import { PlusIcon } from '../icons.jsx'
import { extractTags } from '../../lib/todos.js'

const PLACEHOLDER = 'Add a task… use #tags to organise'

export default function TodoComposer({ onAdd, focusKey }) {
  const [text, setText] = useState('')
  const [due, setDue] = useState(null)
  const [priority, setPriority] = useState(0)
  const [nudge, setNudge] = useState(false)
  const [needsText, setNeedsText] = useState(false)
  const inputRef = useRef(null)

  // "New → Task" in the sidebar passes a fresh key to pull focus here.
  useEffect(() => {
    if (focusKey) inputRef.current?.focus()
  }, [focusKey])

  // Options appear once there's something to attach them to.
  const showOptions = Boolean(text.trim() || due || priority)

  // After picking a date or priority, return to the text so Enter adds the task.
  const andRefocus = (setter) => (value) => {
    setter(value)
    inputRef.current?.focus()
  }

  function reset() {
    setText('')
    setDue(null)
    setPriority(0)
  }

  function submit(e) {
    e.preventDefault()
    if (!text.trim()) {
      // Point at the empty field rather than silently ignoring the click.
      setNudge(true)
      setNeedsText(true)
      inputRef.current?.focus()
      return
    }
    onAdd({ ...extractTags(text), notes: '', due, priority })
    reset()
    inputRef.current?.focus()
  }

  return (
    <form
      className={nudge ? 'todo-composer nudge' : 'todo-composer'}
      onSubmit={submit}
      onAnimationEnd={() => setNudge(false)}
      onKeyDown={(e) => e.key === 'Escape' && reset()}
    >
      <div className="composer-row">
        <PlusIcon className="composer-plus" strokeWidth={2.2} />
        <input
          ref={inputRef}
          className="bare"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setNeedsText(false)
          }}
          placeholder={needsText ? 'Type a task first, then press Enter' : PLACEHOLDER}
          aria-label="New task"
        />
        <button type="submit" className="btn primary">
          Add
        </button>
      </div>
      {showOptions && (
        <div className="composer-options">
          <DuePicker value={due} onChange={andRefocus(setDue)} />
          <PriorityPicker value={priority} onChange={andRefocus(setPriority)} />
        </div>
      )}
    </form>
  )
}
