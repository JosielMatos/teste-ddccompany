'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'

interface Company {
  id: number
  name: string
  value: number
  timestamp: string
  details: string
}

interface CompanyResponse {
  data: {
    count: number
    items: Company[]
  }
}

export default function LargeTablePage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<CompanyResponse>('/large-tables')
      .then((res) => setCompanies(res.data.data.items))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Carregando...</div>
  if (!companies.length) return <div>Nenhuma empresa encontrada.</div>

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-bold mb-2 text-center text-black">Empresas</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {companies.map((company) => {
          const date = new Date(company.timestamp).toLocaleDateString('pt-BR')
          return (
            <div
              key={company.id}
              className="rounded-xl shadow-md hover:shadow-lg transition-shadow bg-amber-50 p-6 flex flex-col"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{company.name}</h3>
              <p className="text-gray-700 mb-2 flex-1">{company.details}</p>
              <div className="flex justify-between mt-4">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                  Valor: R$ {company.value.toLocaleString('pt-BR')}
                </span>
                <span className="text-xs text-gray-500">Data: {date}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
