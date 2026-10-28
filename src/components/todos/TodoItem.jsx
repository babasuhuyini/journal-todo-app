import { CalendarIcon, CheckIcon, FlagIcon, NoteIcon, TrashIcon } from '../icons.jsx'
import { formatRelative } from '../../lib/dates.js'
import { dueStatus, formatDue, getPriority } from '../../lib/todos.js'

export default function TodoItem({ todo, onToggle, onEdit, onDelete, onTagClick }) {
  const status = dueStatus(todo.due)
  const priority = getPriority(todo.priority)
  // Only animate the check for a task completed a moment ago, not on every render of the list.
  const justDone = todo.done && todo.completedAt && Date.now() - todo.completedAt < 1500
  const className = ['todo', todo.done && 'done', justDone && 'just-done'].filter(Boolean).join(' ')

  const showDue = !todo.done && todo.due
  const showPriority = !todo.done && priority
  const showCompleted = todo.done && todo.completedAt
  const hasMeta = showDue || showPriority || showCompleted || todo.notes || todo.tags.length > 0

  return (
    <li className={className} data-priority={todo.done ? 0 : todo.priority}>
      <label className="check" title={todo.done ? 'Mark as not done' : 'Mark as done'}>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={onToggle}
          aria-label={`${todo.done ? 'Reopen' : 'Complete'} "${todo.text}"`}
        />
        <span className="checkmark">
          <CheckIcon width={12} height={12} strokeWidth={3} />
        </span>
      </label>

      <div
        className="todo-body"
        role="button"
        tabIndex={0}
        onClick={onEdit}
        onKeyDown={(e) => e.key === 'Enter' && onEdit()}
        title="Edit task"
      >
        <span className="todo-text">{todo.text}</span>
        {hasMeta && (
          <div className="todo-meta">
            {showPriority && (
              <span className="priority-badge" title={`${priority.label} priority`}>
                <FlagIcon width={13} height={13} />
                <span className="sr-only">{priority.label} priority</span>
              </span>
            )}
            {showDue && (
              <span className={`due-badge ${status}`}>
                <CalendarIcon width={13} height={13} />
                {status === 'overdue' ? `Overdue · ${formatDue(todo.due)}` : formatDue(todo.due)}
              </span>
            )}
            {showCompleted && <span>Completed {formatRelative(todo.completedAt)}</span>}
            {todo.notes && (
              <span className="notes-hint" title={todo.notes}>
                <NoteIcon width={13} height={13} />
                Notes
              </span>
            )}
            {todo.tags.map((tag) => (
              <button
                key={tag}
                className="tag-link"
                onClick={(e) => {
                  e.stopPropagation()
                  onTagClick(tag)
                }}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <button className="icon-btn" onClick={onDelete} aria-label="Delete task" title="Delete">
        <TrashIcon width={16} height={16} />
      </button>
    </li>
  )
}
