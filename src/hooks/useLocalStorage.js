import { useCallback, useSyncExternalStore } from 'react'

// One shared cache per key, so every component reading the same key (e.g. the
// sidebar counts and the page itself) stays in sync.
const cache = new Map()
const listeners = new Map()

function read(key, initialValue) {
  if (!cache.has(key)) {
    try {
      const stored = localStorage.getItem(key)
      cache.set(key, stored !== null ? JSON.parse(stored) : initialValue)
    } catch {
      cache.set(key, initialValue)
    }
  }
  return cache.get(key)
}

function write(key, value) {
  cache.set(key, value)
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable (private mode, quota) — keep in-memory state.
  }
  listeners.get(key)?.forEach((notify) => notify())
}

export default function useLocalStorage(key, initialValue) {
  const subscribe = useCallback(
    (notify) => {
      if (!listeners.has(key)) listeners.set(key, new Set())
      listeners.get(key).add(notify)
      return () => listeners.get(key).delete(notify)
    },
    [key]
  )

  const value = useSyncExternalStore(subscribe, () => read(key, initialValue))

  const setValue = useCallback(
    (next) => write(key, typeof next === 'function' ? next(read(key, initialValue)) : next),
    // initialValue only matters before the first read; keep the setter stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  )

  return [value, setValue]
}
