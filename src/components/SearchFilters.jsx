export default function SearchFilters({ query, setQuery, filters, setFilters, profiles }) {
  const areas = Array.from(new Set((profiles || []).map((p) => p.area).filter(Boolean)))

  return (
    <div className="flex flex-wrap gap-3 items-center mb-6">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nome, cargo ou habilidade..."
        className="input flex-1"
      />

      <select
        value={filters.area}
        onChange={(e) => setFilters({ ...filters, area: e.target.value })}
        className="input"
      >
        <option value="">Todas as áreas</option>
        {areas.map((a) => (
          <option key={a}>{a}</option>
        ))}
      </select>

      <input
        value={filters.localizacao}
        onChange={(e) => setFilters({ ...filters, localizacao: e.target.value })}
        placeholder="Localização"
        className="input"
      />
    </div>
  )
}
