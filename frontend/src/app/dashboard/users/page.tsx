'use client'
import Link from 'next/link'
import api from '@/lib/axios'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

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

async function getUsers(): Promise<User[]> {
  const res = await api.get<UserResponse>('/users')
  return res.data.data.items
}

export default function UsersListPage() {
  useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersData = await getUsers()
        setUsers(usersData)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <span className="text-black">Carregando usuários...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-white border">
      <h1 className="text-3xl font-bold mb-8 text-center text-black">Lista de usuários</h1>
      <table className="min-w-full border text-black bg-amber-50">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Nome</th>
            <th className="py-2 px-4 border-b text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-400 cursor-pointer">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
