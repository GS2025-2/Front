import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import ProfileCard from './components/ProfileCard'
import ProfileModal from './components/ProfileModal'
import SearchFilters from './components/SearchFilters'
import DarkModeToggle from './components/DarkModeToggle'
import { getInitialTheme, setTheme } from './utils/localStorageTheme'

// Constante de tempo para detecção de estagnação (20 segundos)
const STALE_THRESHOLD = 20000; 

// Objeto de dados fictícios/fallback
const DADOS_FICTICIOS_FALLBACK = {
    temperatura: null, 
    luminosidade: null,
    som: null,
    status: 'Dados fictícios, sensores desligados',
    isFallback: true, // Flag de identificação
};

// Função auxiliar para comparação de valores flutuantes com tolerância.
const isCloseTo = (v1, v2, tolerance = 0.1) => {
    if (v1 === null || v2 === null) return v1 === v2;
    // Garante que ambos são números antes de calcular a diferença
    if (typeof v1 !== 'number' || typeof v2 !== 'number') return false; 
    return Math.abs(v1 - v2) < tolerance;
};

// Função auxiliar para comparação de dados relevantes (ignorando pequenas variações de ruído)
const areSameData = (d1, d2) => {
    if (!d1 || !d2) return d1 === d2;
    
    // Compara strings e a flag isFallback
    const stringsMatch = d1.status === d2.status && !!d1.isFallback === !!d2.isFallback;
    
    // Compara números com tolerância (ruído será ignorado)
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
  const [ultimoUpdate, setUltimoUpdate] = useState(Date.now()) // Tempo da última leitura DIFERENTE

  // === Tema claro/escuro ===
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    setTheme(theme)
  }, [theme])

  // === Carregar perfis locais ===
  useEffect(() => {
    fetch('/data/profiles.json')
      .then((r) => r.json())
      .then((data) => setProfiles(data))
      .catch(() => console.error('Erro ao carregar perfis'))
      .finally(() => setLoading(false))
  }, [])

  // === Atualizar campo "bemEstar" com dados do Node-RED (Lógica Robusta de Estagnação) ===
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

        // Sucesso: Mapeia os dados reais e FORÇA CONVERSÃO PARA FLOAT
        novosDadosSensores = {
            // Conversão para parseFloat é CRUCIAL para garantir que a comparação funcione.
            temperatura: parseFloat(sensores.temperatura) ?? null, 
            luminosidade: parseFloat(sensores.luminosidade) ?? null,
            som: parseFloat(sensores.som) ?? null,
            status: sensores.status && sensores.status.trim() !== ''
              ? sensores.status
              : 'Ambiente não identificado',
            isFallback: false, // Flag de dados reais
        };
        success = true;
        
      } catch (error) {
        console.warn('Falha na comunicação ou dados inválidos (Rede/Formato):', error.message)
        // Se a requisição falhou, usamos o Fallback
        novosDadosSensores = DADOS_FICTICIOS_FALLBACK;
      }

      const dataHasChanged = !areSameData(dadosSensores, novosDadosSensores);
      const isCurrentlyReal = dadosSensores && dadosSensores.temperatura !== null;
      const timeElapsed = Date.now() - ultimoUpdate;

      // 1. LÓGICA DE ESTAGNAÇÃO (STALE DATA):
      // Se a requisição foi um sucesso, mas os DADOS são os mesmos que os anteriores (dataHasChanged=false, ignorando ruído),
      // E já passou mais de 20 segundos (STALE_THRESHOLD) desde a última leitura,
      // ENTÃO, assumimos que o Node-RED está enviando dados obsoletos.
      if (success && !dataHasChanged && isCurrentlyReal && timeElapsed > STALE_THRESHOLD) {
        console.warn(`Estagnação de dados detectada (> ${STALE_THRESHOLD / 1000}s sem mudança real). Forçando Fallback.`);
        setDadosSensores(DADOS_FICTICIOS_FALLBACK);
        return; 
      }
      
      // 2. LÓGICA DE ATUALIZAÇÃO (DADOS NOVOS OU FALHA/RECONEXÃO):
      // Só atualizamos o estado se os dados realmente mudaram.
      if (dataHasChanged) {
        setDadosSensores(novosDadosSensores);
        // Se a atualização foi bem-sucedida E diferente da anterior, marcamos o tempo.
        if (success) {
            setUltimoUpdate(Date.now());
        }
      }
    }

    // Tenta atualizar a cada 5 segundos
    const interval = setInterval(atualizarBemEstar, 5000)
    // Chamada inicial
    atualizarBemEstar() 
    return () => clearInterval(interval)
  }, [dadosSensores, ultimoUpdate]) 

  // === Atualiza os perfis com os dados dos sensores ===
  const perfisComBemEstar = profiles.map((p) => ({
    ...p,
    // O estado 'dadosSensores' já contém a leitura mais atual OU o DADOS_FICTICIOS_FALLBACK.
    bemEstar: dadosSensores, 
  }))

  // === Filtros e pesquisa ===
  const filtered = perfisComBemEstar.filter((p) => {
    const matchQuery = [p.nome, p.cargo, (p.habilidadesTecnicas || []).join(' ')].join(' ').toLowerCase().includes(query.toLowerCase())
    const matchArea = filters.area ? p.area === filters.area : true
    const matchLoc = filters.localizacao ? p.localizacao.toLowerCase().includes(filters.localizacao.toLowerCase()) : true
    return matchQuery && matchArea && matchLoc
  })

  // === Modal e renderização ===
  const openProfile = (profile) => setSelected(profile)
  const closeProfile = () => setSelected(null)

  return (
    <div className="min-h-screen bg-[color:var(--linkedin-light)] dark:bg-[color:var(--linkedin-dark)]">
      <Header />
      <div className="container py-6">
        <div className="flex justify-between items-center mb-4">
          <SearchFilters query={query} setQuery={setQuery} filters={filters} setFilters={setFilters} profiles={perfisComBemEstar} />
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