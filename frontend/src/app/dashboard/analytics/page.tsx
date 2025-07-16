'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import { useAuth } from '@/hooks/useAuth'
import { BackButton } from '@/app/components/BackButton'

interface Analytics {
  user_id: number
  email: string
  user_name: string
  user_created: string
  user_age_days: number
  email_domain_type: string
  profile_status: string
  bio_length: number
  total_posts: number
  published_posts: number
  avg_content_length: number
  last_post_date: string
  unique_categories_used: number
  total_category_assignments: number
  category_diversity_percentage: number
  user_classification: string
  activity_status: string
  engagement_score: number
  analysis_generated_at: string
  system_data_points: number
}

interface AnalyticsResponse {
  data: Analytics[]
}

const fieldLabels: Record<keyof Analytics, string> = {
  user_id: 'ID do Usuário',
  email: 'E-mail',
  user_name: 'Nome do Usuário',
  user_created: 'Data de Criação',
  user_age_days: 'Dias desde Criação',
  email_domain_type: 'Tipo de Domínio do E-mail',
  profile_status: 'Status do Perfil',
  bio_length: 'Tamanho da Bio',
  total_posts: 'Total de Posts',
  published_posts: 'Posts Publicados',
  avg_content_length: 'Média de Caracteres por Post',
  last_post_date: 'Data do Último Post',
  unique_categories_used: 'Categorias Únicas Usadas',
  total_category_assignments: 'Total de Categorias Atribuídas',
  category_diversity_percentage: 'Diversidade de Categorias (%)',
  user_classification: 'Classificação do Usuário',
  activity_status: 'Status de Atividade',
  engagement_score: 'Pontuação de Engajamento',
  analysis_generated_at: 'Data da Análise',
  system_data_points: 'Dados do Sistema',
}

export default function AnalyticsPage() {
  useAuth()
  const [analytics, setAnalytics] = useState<Analytics[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredAnalytics = analytics.filter((item) => item.user_name?.toLowerCase().includes(searchTerm.toLowerCase()))

  useEffect(() => {
    api
      .get<AnalyticsResponse>('/analytics')
      .then((res) => setAnalytics(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Carregando...</div>
  if (!analytics.length) return <div>Nenhum dado de analytics encontrado.</div>

  return (
    <div className="min-h-screen bg-white p-8">
      <BackButton className="mb-6" />
      <div className="max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-bold mb-2 text-center text-black">Analytics</h1>
        <input
          type="text"
          placeholder="Pesquisar por nome do usuário..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-4 text-black"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {filteredAnalytics.map((item) => (
          <div
            key={item.user_id}
            className="rounded-xl shadow-md hover:shadow-lg transition-shadow bg-amber-50 p-6 flex flex-col"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.user_name || 'Nome indisponível'}</h3>
            <div className="text-gray-700 flex-1 text-sm space-y-1">
              {Object.entries(item).map(([key, value]) => {
                if (key === 'user_name' || key === 'system_data_points') return null
                let displayValue = value
                if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
                  displayValue = new Date(value).toLocaleDateString('pt-BR')
                }
                if (key === 'category_diversity_percentage') {
                  displayValue = `${value}%`
                }
                if (key === 'avg_content_length' || key === 'user_age_days') {
                  displayValue = Math.round(value)
                }
                return (
                  <div key={key}>
                    <span className="font-semibold">{fieldLabels[key as keyof Analytics]}:</span>{' '}
                    <span>{displayValue}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
