'use client'
import { useEffect, useState } from 'react'
import { getToken } from '@/utils/auth'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = getToken()
    if (!storedToken) {
      router.push('/login')
    } else {
      setToken(storedToken)
    }
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Bem-vindo ao Dashboard</h1>
      <p className="mt-4">Seu token JWT: {token}</p>
    </div>
  )
}
