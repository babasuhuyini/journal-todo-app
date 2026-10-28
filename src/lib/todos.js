import { addDays, parseDateKey, toDateKey } from './dates.js'

export const PRIORITIES = [
  { value: 3, label: 'High' },
  { value: 2, label: 'Medium' },
  { value: 1, label: 'Low' },
]

export function getPriority(value) {
  return PRIORITIES.find((p) => p.value === value) ?? null
}

// Early todos were { id, text, done }; fill in the fields added since.
export function normalizeTodo(todo) {
  return {
    notes: '',
    priority: 0,
    due: null,
    tags: [],
    createdAt: 0,
    completedAt: null,
    ...todo,
  }
}

// Pulls "#tag" words out of quick-add text: "Call mum #family" → text "Call mum", tags ["family"].
export function extractTags(input) {
  const pattern = /(^|\s)#([\w-]+)/g
  const tags = [...input.matchAll(pattern)].map((m) => m[2].toLowerCase())
  const text = input.replace(pattern, ' ').replace(/\s+/g, ' ').trim()
  return { text: text || input.trim(), tags: [...new Set(tags)] }
}

export function dueStatus(due) {
  if (!due) return null
  const today = toDateKey()
  if (due < today) return 'overdue'
  if (due === today) return 'today'
  if (due === addDays(today, 1)) return 'tomorrow'
  if (due <= addDays(today, 7)) return 'week'
  return 'later'
}

export function formatDue(due) {
  const today = toDateKey()
  if (due === today) return 'Today'
  if (due === addDays(today, 1)) return 'Tomorrow'
  if (due === addDays(today, -1)) return 'Yesterday'
  const date = parseDateKey(due)
  if (dueStatus(due) === 'week') return date.toLocaleDateString(undefined, { weekday: 'long' })
  const opts = { month: 'short', day: 'numeric' }
  if (date.getFullYear() !== new Date().getFullYear()) opts.year = 'numeric'
  return date.toLocaleDateString(undefined, opts)
}

export const VIEWS = {
  all: { label: 'All', test: () => true, empty: 'All caught up.' },
  today: { label: 'Today', test: (t) => dueStatus(t.due) === 'today', empty: 'Nothing due today.' },
  upcoming: {
    label: 'Upcoming',
    test: (t) => ['tomorrow', 'week', 'later'].includes(dueStatus(t.due)),
    empty: 'Nothing scheduled ahead.',
  },
  overdue: { label: 'Overdue', test: (t) => dueStatus(t.due) === 'overdue', empty: 'Nothing overdue. Nice.' },
  someday: { label: 'No date', test: (t) => !t.due, empty: 'Every task has a date.' },
}

const byDue = (a, b) => (a.due ?? '9999-12-31').localeCompare(b.due ?? '9999-12-31')
const byPriority = (a, b) => b.priority - a.priority
const byCreated = (a, b) => a.createdAt - b.createdAt

export const SORTS = {
  due: { label: 'Due date', compare: (a, b) => byDue(a, b) || byPriority(a, b) || byCreated(a, b) },
  priority: { label: 'Priority', compare: (a, b) => byPriority(a, b) || byDue(a, b) || byCreated(a, b) },
  newest: { label: 'Recently added', compare: (a, b) => byCreated(b, a) },
}

export function matchesQuery(todo, query) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [todo.text, todo.notes, ...todo.tags].some((field) => field.toLowerCase().includes(q))
}
