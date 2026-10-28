import { MOODS } from '../../lib/journal.js'

export default function MoodPicker({ value, onChange }) {
  return (
    <div className={value ? 'mood-picker has-value' : 'mood-picker'} role="radiogroup">
      {MOODS.map((mood) => (
        <button
          key={mood.value}
          type="button"
          role="radio"
          aria-checked={value === mood.value}
          data-mood={mood.value}
          className="mood-option"
          onClick={() => onChange(value === mood.value ? null : mood.value)}
        >
          <span className="mood-emoji">{mood.emoji}</span>
          <span className="mood-label">{mood.label}</span>
        </button>
      ))}
    </div>
  )
}
