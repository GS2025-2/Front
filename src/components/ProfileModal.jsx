import { useState } from 'react'

export default function ProfileModal({ profile, onClose }) {
  const [message, setMessage] = useState('')
  const [recommended, setRecommended] = useState(false)

  const sendMessage = () => {
    if (!message.trim()) return
    alert(`Mensagem enviada para ${profile.nome}: "${message}"`)
    setMessage('')
  }

  const recommend = () => {
    setRecommended(true)
    alert(`${profile.nome} foi recomendado!`)
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-content relative" onClick={(e)=>e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">✖</button>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center text-center sm:w-1/3">
            <img src={profile.foto} alt={profile.nome} className="w-28 h-28 rounded-full object-cover border-4 border-[color:var(--linkedin-blue)]" />
            <h2 className="text-xl font-semibold mt-3">{profile.nome}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{profile.cargo}</p>
            <p className="text-xs text-gray-400">{profile.localizacao}</p>
          </div>

          <div className="sm:w-2/3">
            <h3 className="font-semibold text-[color:var(--linkedin-blue)] mb-2">Resumo</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{profile.resumo}</p>

            <h3 className="font-semibold mb-2">Habilidades</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {(profile.habilidadesTecnicas || []).map((s, i) => (
                <span key={i} className="skill">{s}</span>
              ))}
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Envie uma mensagem profissional..."
              className="input w-full mb-3"
              rows={3}
            ></textarea>

            <div className="flex gap-3">
              <button onClick={sendMessage} className="btn-primary">Enviar Mensagem</button>
              <button onClick={recommend} disabled={recommended} className="btn-secondary">
                {recommended ? 'Recomendado ✅' : 'Recomendar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
