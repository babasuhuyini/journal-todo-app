import { FlagIcon } from '../icons.jsx'
import { PRIORITIES } from '../../lib/todos.js'

export default function PriorityPicker({ value, onChange }) {
  return (
    <div className="option-group" role="radiogroup" aria-label="Priority">
      <FlagIcon width={15} height={15} />
      {PRIORITIES.map((p) => (
        <button
          key={p.value}
          type="button"
          role="radio"
          aria-checked={value === p.value}
          data-priority={p.value}
          className={value === p.value ? 'chip priority-chip active' : 'chip priority-chip'}
          onClick={() => onChange(value === p.value ? 0 : p.value)}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
