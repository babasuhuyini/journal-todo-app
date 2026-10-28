import { useCallback, useMemo } from 'react'
import useLocalStorage from './useLocalStorage.js'
import { createEntry, isEmptyEntry, normalizeEntry } from '../lib/journal.js'

const asArray = (value) => (Array.isArray(value) ? value : [])
const byNewest = (a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt

export default function useJournal() {
  const [stored, setStored] = useLocalStorage('journal.entries', [])

  const entries = useMemo(() => asArray(stored).map(normalizeEntry).sort(byNewest), [stored])

  const create = useCallback(() => {
    const entry = createEntry()
    setStored((cur) => [entry, ...asArray(cur)])
    return entry
  }, [setStored])

  const update = useCallback(
    (id, patch) =>
      setStored((cur) =>
        asArray(cur).map((e) => (e.id === id ? { ...e, ...patch, updatedAt: Date.now() } : e))
      ),
    [setStored]
  )

  const remove = useCallback(
    (id) => setStored((cur) => asArray(cur).filter((e) => e.id !== id)),
    [setStored]
  )

  // Entries are created blank on "New"; drop any left untouched, except the one open now.
  const pruneEmpty = useCallback(
    (keepId) =>
      setStored((cur) => {
        const list = asArray(cur)
        const next = list.filter((e) => e.id === keepId || !isEmptyEntry(normalizeEntry(e)))
        return next.length === list.length ? cur : next
      }),
    [setStored]
  )

  return { entries, create, update, remove, pruneEmpty }
}
