'use client'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

const resources = [
  { name: 'Usuários', href: '/dashboard/users' },
  { name: 'Pokemons', href: '/dashboard/pokemons' },
  { name: 'Tabela de Empresas', href: '/dashboard/large-table' },
  { name: 'Analytics', href: '/dashboard/analytics' },
]

export default function DashboardPage() {
  useAuth()

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-black">Bem-vindo ao Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {resources.map((resource) => (
          <Link
            key={resource.name}
            href={resource.href}
            className="rounded-xl shadow-md hover:shadow-lg transition-shadow bg-amber-50 p-6 flex items-center justify-center text-xl font-semibold text-gray-800"
          >
            {resource.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
