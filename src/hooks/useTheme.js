import { useEffect } from 'react'
import useLocalStorage from './useLocalStorage.js'

const systemTheme = () => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

// Follows the OS until the user picks a theme; index.html applies it before first paint.
export default function useTheme() {
  const [saved, setSaved] = useLocalStorage('ui.theme', null)
  const theme = saved === 'light' || saved === 'dark' ? saved : systemTheme()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return [theme, setSaved]
}
