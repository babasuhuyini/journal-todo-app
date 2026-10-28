import { ENERGY_LABELS } from '../../lib/journal.js'

export default function EnergyPicker({ value, onChange }) {
  return (
    <div className="energy-picker">
      <div className="energy-bars" role="radiogroup">
        {ENERGY_LABELS.map((label, i) => {
          const level = i + 1
          return (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={value === level}
              aria-label={label}
              title={label}
              className={value >= level ? 'energy-bar filled' : 'energy-bar'}
              style={{ height: 10 + i * 5 }}
              onClick={() => onChange(value === level ? null : level)}
            />
          )
        })}
      </div>
      <span className="energy-label">{value ? ENERGY_LABELS[value - 1] : 'Not set'}</span>
    </div>
  )
}
