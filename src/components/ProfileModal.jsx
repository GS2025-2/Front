import { useState } from 'react'
import Swal from 'sweetalert2'

export default function ProfileModal({ profile, onClose }) {
  const [message, setMessage] = useState('')
  const [recommended, setRecommended] = useState(false)
  const [showWellness, setShowWellness] = useState(false)
  const bem = profile.bemEstar

  const sendMessage = () => {
    if (!message.trim()) return
    Swal.fire({
      icon: 'success',
      title: 'Mensagem enviada!',
      text: `Sua mensagem foi enviada para ${profile.nome}: "${message}"`,
      confirmButtonColor: '#0A66C2',
    })
    setMessage('')
  }

  const recommend = () => {
    setRecommended(true)
    Swal.fire({
      icon: 'success',
      title: 'Recomendação feita!',
      text: `${profile.nome} foi recomendado com sucesso.`,
      confirmButtonColor: '#0A66C2',
    })
  }

  const toggleWellness = () => {
    if (!bem) {
      Swal.fire({
        icon: 'info',
        title: 'Sem dados de bem-estar',
        text: `${profile.nome} ainda não possui informações registradas.`,
        confirmButtonColor: '#0A66C2',
      })
      return
    }

    if (!showWellness) {
      Swal.fire({
        title: '🧘‍♂️ Dados de Bem-Estar',
        html: `
          <div style="text-align:left; line-height:1.6;">
            <p><strong>🌡️ Temperatura:</strong> ${bem.temperatura}°C</p>
            <p><strong>💡 Luminosidade:</strong> ${bem.luminosidade} lux</p>
            <p><strong>🔊 Som:</strong> ${bem.som}</p>
            <p style="margin-top:8px; color:#555;">${bem.status}</p>
          </div>
        `,
        confirmButtonText: 'Fechar',
        confirmButtonColor: '#0A66C2',
        background: '#f8fafc',
      })
    }
    setShowWellness((prev) => !prev)
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div
        className="modal-content relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ✖
        </button>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center text-center sm:w-1/3">
            <img
              src={profile.foto}
              alt={profile.nome}
              className="w-28 h-28 rounded-full object-cover border-4 border-[color:var(--linkedin-blue)]"
            />
            <h2 className="text-xl font-semibold mt-3 text-gray-800 dark:text-gray-100">
              {profile.nome}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {profile.cargo}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {profile.localizacao}
            </p>
          </div>

          <div className="sm:w-2/3">
            <h3 className="font-semibold text-[color:var(--linkedin-blue)] dark:text-blue-400 mb-2">
              Resumo
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-200 mb-4">
              {profile.resumo}
            </p>

            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
              Habilidades
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {(profile.habilidadesTecnicas || []).map((s, i) => (
                <span
                  key={i}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-2 py-1 rounded"
                >
                  {s}
                </span>
              ))}
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Envie uma mensagem profissional..."
              className="input w-full mb-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              rows={3}
            ></textarea>

            <div className="flex flex-wrap gap-3">
              <button onClick={sendMessage} className="btn-primary">
                Enviar Mensagem
              </button>

              <button
                onClick={recommend}
                disabled={recommended}
                className="btn-secondary"
              >
                {recommended ? 'Recomendado ✅' : 'Recomendar'}
              </button>

              <button onClick={toggleWellness} className="btn-secondary">
                Bem-Estar do Ambiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
