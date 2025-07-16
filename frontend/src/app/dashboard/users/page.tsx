'use client'
import Link from 'next/link'
import api from '@/lib/axios'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Pagination } from '@/app/components/Pagination'
import { Modal } from '@/app/components/Modal'
import { FiEdit, FiTrash } from 'react-icons/fi'
import { BackButton } from '@/app/components/BackButton'

type UserResponse = {
  data: {
    count: number
    items: User[]
  }
}

type User = {
  id: string
  name: string
  email: string
}

const TAKE = 10

async function getUsers(skip = 0, take = TAKE): Promise<UserResponse['data']> {
  const res = await api.get<UserResponse>(`/users?skip=${skip}&take=${take}`)
  return res.data.data
}

export default function UsersListPage() {
  useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })
  const [creating, setCreating] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const isEditing = !!editingUser

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      try {
        const { items, count } = await getUsers((page - 1) * TAKE, TAKE)
        setUsers(items)
        setCount(count)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [page])

  async function handleSubmitUser(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    try {
      if (isEditing && editingUser) {
        await api.put(`/users/${editingUser.id}`, { ...form })
      } else {
        await api.post('/users', { ...form })
      }
      setShowModal(false)
      setForm({ name: '', email: '' })
      setEditingUser(null)
      // Atualiza a lista
      const { items, count } = await getUsers((page - 1) * TAKE, TAKE)
      setUsers(items)
      setCount(count)
    } finally {
      setCreating(false)
    }
  }

  function handleOpenEdit(user: User) {
    setEditingUser(user)
    setForm({
      name: user.name,
      email: user.email,
    })
    setShowModal(true)
  }

  async function handleDeleteUser(userId: string) {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return
    try {
      await api.delete(`/users/${userId}`)
      const { items, count } = await getUsers((page - 1) * TAKE, TAKE)
      setUsers(items)
      setCount(count)
    } catch (error) {
      alert('Erro ao deletar usuário.' + error)
    }
  }

  const totalPages = Math.ceil(count / TAKE)

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <span className="text-black">Carregando usuários...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-white border">
      <BackButton className="mb-6" />
      <div className="flex items-center justify-between max-w-4xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-black">Lista de usuários</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
          onClick={() => {
            setEditingUser(null)
            setForm({ name: '', email: '' })
            setShowModal(true)
          }}
        >
          Novo Usuário
        </button>
      </div>
      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingUser(null)
        }}
        title={isEditing ? 'Editar usuário' : 'Novo usuário'}
      >
        <form onSubmit={handleSubmitUser} className="space-y-4">
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
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
              type="email"
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
      <table className="min-w-full border text-black bg-amber-50">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Nome</th>
            <th className="py-2 px-4 border-b text-left">Email</th>
            <th className="py-2 px-4 border-b text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-400">
              <td className="py-2 px-4 border-b">
                <Link href={`/dashboard/users/${user.id}`} className="block w-full h-full">
                  {user.name || 'Nome não informado'}
                </Link>
              </td>
              <td className="py-2 px-4 border-b">
                <Link href={`/dashboard/users/${user.id}`} className="block w-full h-full">
                  {user.email || 'Email não informado'}
                </Link>
              </td>
              <td className="py-2 px-4 border-b">
                <div className="flex gap-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition"
                    onClick={() => handleOpenEdit(user)}
                    title="Editar"
                    type="button"
                  >
                    <FiEdit className="text-blue-600" size={18} />
                  </button>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition"
                    onClick={() => handleDeleteUser(user.id)}
                    title="Deletar"
                    type="button"
                  >
                    <FiTrash className="text-red-600" size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
