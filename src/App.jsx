import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import ProfileCard from './components/ProfileCard'
import ProfileModal from './components/ProfileModal'
import SearchFilters from './components/SearchFilters'
import DarkModeToggle from './components/DarkModeToggle'
import { getInitialTheme, setTheme } from './utils/localStorageTheme'

// Tempo máximo antes de considerar que os dados estão "parados" (20 segundos)
const STALE_THRESHOLD = 20000; 

// Dados fictícios exibidos quando os sensores estão desligados
const DADOS_FICTICIOS_FALLBACK = {
    temperatura: null, 
    luminosidade: null,
    som: null,
    status: 'Dados fictícios, sensores desligados',
    isFallback: true,
};

// Função para comparar valores numéricos com uma pequena margem de erro
const isCloseTo = (v1, v2, tolerance = 0.1) => {
    if (v1 === null || v2 === null) return v1 === v2;
    if (typeof v1 !== 'number' || typeof v2 !== 'number') return false; 
    return Math.abs(v1 - v2) < tolerance;
};

// Compara dois conjuntos de dados dos sensores, ignorando pequenas variações
const areSameData = (d1, d2) => {
    if (!d1 || !d2) return d1 === d2;
    
    const stringsMatch = d1.status === d2.status && !!d1.isFallback === !!d2.isFallback;
    const numbersMatch = isCloseTo(d1.temperatura, d2.temperatura) &&
                         isCloseTo(d1.luminosidade, d2.luminosidade) &&
                         isCloseTo(d1.som, d2.som);
                         
    return stringsMatch && numbersMatch;
};

export default function App() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ area: '', localizacao: '' })
  const [theme, setThemeState] = useState(getInitialTheme())
  const [dadosSensores, setDadosSensores] = useState(DADOS_FICTICIOS_FALLBACK) 
  const [ultimoUpdate, setUltimoUpdate] = useState(Date.now()) // Guarda o momento da última atualização real
  const [aboutRef] = useState(React.createRef()) // 👈 referência para rolar até o fim

  // Alterna entre modo claro e escuro
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    setTheme(theme)
  }, [theme])

  // Carrega os perfis locais do arquivo JSON
  useEffect(() => {
    fetch('/data/profiles.json')
      .then((r) => r.json())
      .then((data) => setProfiles(data))
      .catch(() => console.error('Erro ao carregar perfis'))
      .finally(() => setLoading(false))
  }, [])

  // Atualiza os dados dos sensores (vindo do Node-RED) com verificação de estagnação
  useEffect(() => {
    async function atualizarBemEstar() {
      let novosDadosSensores = DADOS_FICTICIOS_FALLBACK;
      let success = false;

      try {
        const response = await fetch('http://localhost:1880/sensores', { cache: 'no-store' })
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}.`)
        }

        const sensores = await response.json()
        
        if (!sensores || typeof sensores !== 'object' || Object.keys(sensores).length === 0) {
          throw new Error('JSON inválido ou vazio recebido.')
        }

        // Converte todos os valores para número e trata o texto de status
        novosDadosSensores = {
            temperatura: parseFloat(sensores.temperatura) ?? null, 
            luminosidade: parseFloat(sensores.luminosidade) ?? null,
            som: parseFloat(sensores.som) ?? null,
            status: sensores.status && sensores.status.trim() !== ''
              ? sensores.status
              : 'Ambiente não identificado',
            isFallback: false,
        };
        success = true;
        
      } catch (error) {
        console.warn('Erro na comunicação ou dados inválidos:', error.message)
        novosDadosSensores = DADOS_FICTICIOS_FALLBACK;
      }

      const dataHasChanged = !areSameData(dadosSensores, novosDadosSensores);
      const isCurrentlyReal = dadosSensores && dadosSensores.temperatura !== null;
      const timeElapsed = Date.now() - ultimoUpdate;

      // Se os dados não mudam por muito tempo, assume que estão estagnados e volta pro modo fictício
      if (success && !dataHasChanged && isCurrentlyReal && timeElapsed > STALE_THRESHOLD) {
        console.warn(`Dados estagnados por mais de ${STALE_THRESHOLD / 1000}s. Voltando para dados fictícios.`);
        setDadosSensores(DADOS_FICTICIOS_FALLBACK);
        return; 
      }
      
      // Atualiza apenas se houve mudança real ou reconexão
      if (dataHasChanged) {
        setDadosSensores(novosDadosSensores);
        if (success) {
            setUltimoUpdate(Date.now());
        }
      }
    }

    // Atualiza a cada 5 segundos
    const interval = setInterval(atualizarBemEstar, 5000)
    atualizarBemEstar() 
    return () => clearInterval(interval)
  }, [dadosSensores, ultimoUpdate]) 

  // Associa os dados dos sensores a cada perfil
  const perfisComBemEstar = profiles.map((p) => ({
    ...p,
    bemEstar: dadosSensores, 
  }))

  // Aplica filtros e pesquisa
  const filtered = perfisComBemEstar.filter((p) => {
    const matchQuery = [p.nome, p.cargo, (p.habilidadesTecnicas || []).join(' ')].join(' ').toLowerCase().includes(query.toLowerCase())
    const matchArea = filters.area ? p.area === filters.area : true
    const matchLoc = filters.localizacao ? p.localizacao.toLowerCase().includes(filters.localizacao.toLowerCase()) : true
    return matchQuery && matchArea && matchLoc
  })

  // Controle do modal
  const openProfile = (profile) => setSelected(profile)
  const closeProfile = () => setSelected(null)

  return (
    <div className="min-h-screen bg-[color:var(--linkedin-light)] dark:bg-[color:var(--linkedin-dark)] transition-colors">
      <Header onAboutClick={() => aboutRef.current.scrollIntoView({ behavior: 'smooth' })} />
      <div className="container py-6">
        {/* 🔍 Filtros + botões */}
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div className="flex flex-1 flex-wrap items-end gap-3">
            <SearchFilters
              query={query}
              setQuery={setQuery}
              filters={filters}
              setFilters={setFilters}
              profiles={perfisComBemEstar}
            />
            <DarkModeToggle theme={theme} setTheme={setThemeState} />
          </div>
        </div>

        {/* 👥 Perfis */}
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

        {/* 📘 SOBRE O PROJETO - no final da página */}
        <section
          ref={aboutRef}
          id="sobre-projeto"
          className="animate-fade-in bg-white dark:bg-[color:var(--linkedin-card-dark)] rounded-xl shadow-md p-6 mt-12 mb-10 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
        >
          <h2 className="text-2xl font-bold mb-3 text-[color:var(--linkedin-blue)] dark:text-[color:var(--linkedin-accent)] text-center">
            Sobre o Projeto
          </h2>
          <p className="leading-relaxed mb-4">
            <strong>Tema:</strong> O Futuro do Trabalho – Conectando pessoas, competências e propósito por meio da tecnologia.
          </p>
          <p className="leading-relaxed mb-4">
            <strong>Contexto:</strong> Inspirada no desafio proposto para a Global Solution, esta atividade convida os alunos a refletirem
            sobre como a tecnologia pode transformar as relações profissionais e promover um futuro do trabalho mais justo,
            inclusivo e sustentável.
          </p>
          <p className="leading-relaxed mb-4">
            A partir dessa perspectiva, o projeto propõe a criação de uma plataforma web colaborativa, semelhante ao LinkedIn,
            voltada à conexão entre profissionais de diferentes áreas, incentivando o desenvolvimento de competências, a troca
            de experiências e a colaboração entre talentos.
          </p>
          <p className="leading-relaxed mb-4">
            <strong>Objetivo:</strong> Desenvolver uma aplicação web interativa utilizando <strong>HTML</strong>, <strong>Tailwind CSS</strong> e <strong>React</strong>, que
            simule uma rede profissional voltada ao futuro do trabalho. A aplicação permite explorar perfis fictícios de profissionais
            com dados pessoais, acadêmicos, técnicos e comportamentais — promovendo uma experiência moderna, funcional e intuitiva.
          </p>
          <p className="leading-relaxed mb-4">
            O <strong>NextWork</strong> conta com listagem dinâmica de perfis, sistema de busca e filtros, modal com informações completas,
            design responsivo, dark mode e integração com um JSON local contendo mais de 60 perfis simulados. O projeto reflete
            o compromisso com inovação e o uso consciente da tecnologia como ferramenta de inclusão e evolução profissional.
          </p>

          <p className="leading-relaxed mb-2 text-sm italic text-gray-600 dark:text-gray-400">
            Requisitos: SPA com HTML + React + Tailwind | 10 commits mínimos | JSON local | Cards interativos | Modal funcional | Filtros e Dark Mode
          </p>

          {/* 👩‍💻 Equipe de Desenvolvimento */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-6 text-center text-[color:var(--linkedin-blue)] dark:text-[color:var(--linkedin-accent)]">
              Equipe de Desenvolvimento
            </h3>
            <div className="flex flex-wrap justify-center gap-10">
              <div className="flex flex-col items-center text-center">
                <img src="/Anna.jpg" alt="Anna Ruggeri" className="w-28 h-28 rounded-full object-cover shadow-md border-2 border-[color:var(--linkedin-blue)] dark:border-[color:var(--linkedin-accent)] mb-3" />
                <p className="font-medium text-lg">Anna Ruggeri</p>
                <p className="text-sm text-gray-500 dark:text-gray-400"></p>
              </div>
              <div className="flex flex-col items-center text-center">
                <img src="/Giovana.jpg" alt="Giovana Bernardino" className="w-28 h-28 rounded-full object-cover shadow-md border-2 border-[color:var(--linkedin-blue)] dark:border-[color:var(--linkedin-accent)] mb-3" />
                <p className="font-medium text-lg">Giovana Bernardino</p>
                <p className="text-sm text-gray-500 dark:text-gray-400"></p>
              </div>
              <div className="flex flex-col items-center text-center">
                <img src="/Henrique.jpg" alt="Henrique Vicente" className="w-28 h-28 rounded-full object-cover shadow-md border-2 border-[color:var(--linkedin-blue)] dark:border-[color:var(--linkedin-accent)] mb-3" />
                <p className="font-medium text-lg">Henrique Vicente</p>
                <p className="text-sm text-gray-500 dark:text-gray-400"></p>
              </div>
            </div>
          </div>
        </section>

        {/* ⬇️ FOOTER no final da página */}
        <footer className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800 py-4 mt-10">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-center">
            <p className="text-sm text-center">
              © 2025 Projeto Acadêmico FIAP — Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
