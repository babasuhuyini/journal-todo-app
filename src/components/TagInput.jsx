import { useState } from 'react'
import { XIcon } from './icons.jsx'

export default function TagInput({ value, onChange, suggestions }) {
  const [text, setText] = useState('')

  function add(raw) {
    const tag = raw.trim().toLowerCase().replace(/^#/, '')
    if (tag && !value.includes(tag)) onChange([...value, tag])
    setText('')
  }

  function handleKeyDown(e) {
    if ((e.key === 'Enter' && !e.ctrlKey && !e.metaKey) || e.key === ',') {
      e.preventDefault()
      add(text)
    } else if (e.key === 'Backspace' && !text && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  const unused = suggestions
    .filter((t) => !value.includes(t) && t.includes(text.trim().toLowerCase()))
    .slice(0, 6)

  return (
    <div className="tag-field">
      <div className="tag-input">
        {value.map((tag) => (
          <span className="chip" key={tag}>
            #{tag}
            <button
              type="button"
              className="chip-remove"
              aria-label={`Remove ${tag}`}
              onClick={() => onChange(value.filter((t) => t !== tag))}
            >
              <XIcon width={12} height={12} />
            </button>
          </span>
        ))}
        <input
          className="bare"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => text.trim() && add(text)}
          placeholder={value.length ? 'Add another…' : 'work, family, run…'}
        />
      </div>
      {unused.length > 0 && (
        <div className="tag-suggestions">
          {unused.map((tag) => (
            <button type="button" key={tag} className="chip chip-ghost" onClick={() => add(tag)}>
              + {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
