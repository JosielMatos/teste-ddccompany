import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/utils/auth'

export function useAuth() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = getToken()
    if (!storedToken) {
      router.push('/')
    } else {
      setToken(storedToken)
    }
  }, [router])

  return token
}
