export default function ProfileCard({ profile, onOpen }) {
  // Ajuste de onOpen sem o status do ambiente
  const handleOpen = (e) => {
    e.stopPropagation();
    onOpen(profile);
  };
    
  return (
    <article
      onClick={() => onOpen(profile)}
      className="profile-card cursor-pointer hover:-translate-y-1"
    >
      <div className="flex items-center gap-4">
        <img src={profile.foto} alt={profile.nome} className="profile-img" />
        <div>
          <h3 className="profile-name text-lg font-semibold">{profile.nome}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{profile.cargo}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{profile.localizacao}</p>
        </div>
      </div>

      <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 line-clamp-3">{profile.resumo}</p>

      <div className="flex flex-wrap gap-2 mt-4">
        {(profile.habilidadesTecnicas || []).slice(0, 5).map((s, i) => (
          <span key={i} className="skill">{s}</span>
        ))}
      </div>
      
      {/* NENHUM STATUS DO AMBIENTE É EXIBIDO AQUI */}

      <div className="mt-4">
        <button
          onClick={handleOpen}
          className="btn-secondary"
        >
          Ver perfil
        </button>
      </div>
    </article>
  )
}