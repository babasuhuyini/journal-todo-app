import { useRef } from 'react'
import { CalendarIcon, XIcon } from '../icons.jsx'
import { addDays, toDateKey } from '../../lib/dates.js'
import { formatDue } from '../../lib/todos.js'

export default function DuePicker({ value, onChange }) {
  const pickerRef = useRef(null)
  const today = toDateKey()
  const presets = [
    ['Today', today],
    ['Tomorrow', addDays(today, 1)],
    ['Next week', addDays(today, 7)],
  ]
  const isCustom = value && !presets.some(([, date]) => date === value)

  function openPicker() {
    try {
      pickerRef.current.showPicker()
    } catch {
      pickerRef.current.focus()
    }
  }

  return (
    <div className="option-group" role="group" aria-label="Due date">
      <CalendarIcon width={15} height={15} />
      {presets.map(([label, date]) => (
        <button
          key={label}
          type="button"
          className={value === date ? 'chip active' : 'chip'}
          onClick={() => onChange(value === date ? null : date)}
        >
          {label}
        </button>
      ))}
      <span className="date-chip">
        <button type="button" className={isCustom ? 'chip active' : 'chip'} onClick={openPicker}>
          {isCustom ? formatDue(value) : 'Pick date…'}
        </button>
        <input
          ref={pickerRef}
          type="date"
          tabIndex={-1}
          aria-hidden="true"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
        />
      </span>
      {value && (
        <button
          type="button"
          className="icon-btn sm"
          aria-label="Clear due date"
          onClick={() => onChange(null)}
        >
          <XIcon width={14} height={14} />
        </button>
      )}
    </div>
  )
}
