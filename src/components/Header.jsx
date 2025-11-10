export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-[color:var(--linkedin-blue)]">GS</div>
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            Global Solution | Rede Profissional
          </span>
        </div>

        <nav className="flex items-center gap-6 text-sm">
          <button className="nav-link">Início</button>
          <button className="nav-link">Conexões</button>
          <button className="nav-link">Mensagens</button>
          <button className="nav-link">Vagas</button>
        </nav>
      </div>
    </header>
  )
}
