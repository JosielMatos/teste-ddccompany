'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import { useAuth } from '@/hooks/useAuth'
import { Pagination } from '@/app/components/Pagination'
import { Modal } from '@/app/components/Modal'
import { FiEdit, FiTrash } from 'react-icons/fi'
import { BackButton } from '@/app/components/BackButton'

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

const TAKE = 10

export default function LargeTablePage() {
  useAuth()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', value: 0, details: '' })
  const [creating, setCreating] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const isEditing = !!editingCompany

  async function handleSubmitCompany(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    try {
      if (isEditing && editingCompany) {
        await api.put(`/large-tables/${editingCompany.id}`, {
          ...form,
        })
      } else {
        await api.post('/large-tables', {
          ...form,
        })
      }
      setShowModal(false)
      setForm({ name: '', value: 0, details: '' })
      setEditingCompany(null)
      // Atualiza a lista
      reloadCompanies()
    } finally {
      setCreating(false)
    }
  }

  function handleOpenEdit(company: Company) {
    setEditingCompany(company)
    setForm({
      name: company.name,
      value: company.value,
      details: company.details,
    })
    setShowModal(true)
  }

  async function handleDeleteCompany(companyId: number) {
    if (!confirm('Tem certeza que deseja deletar esta empresa?')) return
    try {
      await api.delete(`/large-tables/${companyId}`)
      reloadCompanies()
    } catch (error) {
      alert('Erro ao deletar empresa.' + error)
    }
  }

  function reloadCompanies() {
    setLoading(true)
    api
      .get<CompanyResponse>('/large-tables', {
        params: {
          skip: (page - 1) * TAKE,
          take: TAKE,
        },
      })
      .then((res) => {
        setCompanies(res.data.data.items)
        setCount(res.data.data.count)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    reloadCompanies()
  }, [page])

  if (loading) return <div>Carregando...</div>
  if (!companies.length) return <div>Nenhuma empresa encontrada.</div>

  const totalPages = Math.ceil(count / TAKE)

  return (
    <div className="min-h-screen bg-white p-8">
      <BackButton className="mb-6" />
      <div className="flex items-center justify-between max-w-4xl mx-auto mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Empresas</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
          onClick={() => {
            setEditingCompany(null)
            setForm({ name: '', value: 0, details: '' })
            setShowModal(true)
          }}
        >
          Nova Empresa
        </button>
      </div>
      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingCompany(null)
        }}
        title={isEditing ? 'Editar empresa' : 'Nova empresa'}
      >
        <form onSubmit={handleSubmitCompany} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Valor</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
              required
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Detalhes</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={form.details}
              onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
            disabled={creating}
          >
            {creating ? (isEditing ? 'Salvando...' : 'Criando...') : isEditing ? 'Salvar' : 'Criar'}
          </button>
        </form>
      </Modal>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {companies.map((company) => {
          const date = new Date(company.timestamp).toLocaleDateString('pt-BR')
          return (
            <div
              key={company.id}
              className="rounded-xl shadow-md hover:shadow-lg transition-shadow bg-amber-50 p-6 flex flex-col"
            >
              <div className="flex gap-2 ml-auto mb-2">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition cursor-pointer"
                  onClick={() => handleOpenEdit(company)}
                  title="Editar"
                  type="button"
                >
                  <FiEdit className="text-blue-600" size={18} />
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition cursor-pointer"
                  onClick={() => handleDeleteCompany(company.id)}
                  title="Deletar"
                  type="button"
                >
                  <FiTrash className="text-red-600" size={18} />
                </button>
              </div>
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
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
