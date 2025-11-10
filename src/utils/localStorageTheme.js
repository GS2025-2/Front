export const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('theme')
  if (stored) return stored
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export const setTheme = (theme) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('theme', theme)
}
