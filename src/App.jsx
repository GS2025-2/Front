import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import ProfileCard from './components/ProfileCard'
import ProfileModal from './components/ProfileModal'
import SearchFilters from './components/SearchFilters'
import DarkModeToggle from './components/DarkModeToggle'
import { getInitialTheme, setTheme } from './utils/localStorageTheme'

export default function App() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ area: '', localizacao: '' })
  const [theme, setThemeState] = useState(getInitialTheme())

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    setTheme(theme)
  }, [theme])

  useEffect(() => {
    fetch('/data/profiles.json')
      .then((r) => r.json())
      .then((data) => setProfiles(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const openProfile = (profile) => setSelected(profile)
  const closeProfile = () => setSelected(null)

  const filtered = profiles.filter((p) => {
    const matchQuery = [p.nome, p.cargo, (p.habilidadesTecnicas || []).join(' ')].join(' ').toLowerCase().includes(query.toLowerCase())
    const matchArea = filters.area ? p.area === filters.area : true
    const matchLoc = filters.localizacao ? p.localizacao.toLowerCase().includes(filters.localizacao.toLowerCase()) : true
    return matchQuery && matchArea && matchLoc
  })

  return (
    <div className="min-h-screen bg-[color:var(--linkedin-light)] dark:bg-[color:var(--linkedin-dark)]">
      <Header />
      <div className="container py-6">
        <div className="flex justify-between items-center mb-4">
          <SearchFilters query={query} setQuery={setQuery} filters={filters} setFilters={setFilters} profiles={profiles} />
          <DarkModeToggle theme={theme} setTheme={setThemeState} />
        </div>

        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-300 py-10">Carregando perfis...</div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProfileCard key={p.id} profile={p} onOpen={() => openProfile(p)} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">Nenhum perfil encontrado.</div>
        )}

        {selected && <ProfileModal profile={selected} onClose={closeProfile} />}
      </div>
    </div>
  )
}
