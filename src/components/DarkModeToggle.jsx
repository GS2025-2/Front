export default function DarkModeToggle({ theme, setTheme }) {
  const handleClick = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      onClick={handleClick}
      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
    >
      {theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
    </button>
  )
}
