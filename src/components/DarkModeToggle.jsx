export default function DarkModeToggle({ theme, setTheme }) {
  const handleClick = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center gap-2 rounded-lg border text-sm font-medium transition-all duration-300 px-4 py-2
        ${theme === 'dark'
          ? 'bg-white text-gray-900 border-gray-300 hover:bg-gray-100 hover:text-[color:var(--linkedin-blue)]'
          : 'bg-[color:var(--linkedin-blue)] text-white border-transparent hover:bg-[#005bb5]'
        }
      `}
      style={{ height: '40px' }} // impede mudança de tamanho ao clicar
    >
      {theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
    </button>
  )
}
