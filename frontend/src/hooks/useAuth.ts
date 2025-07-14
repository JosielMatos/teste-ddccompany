import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/utils/auth'
import { jwtDecode } from 'jwt-decode'

type JwtPayload = {
  exp: number
}

export function useAuth() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = getToken()
    if (!storedToken) {
      router.push('/')
    } else {
      try {
        const decoded = jwtDecode<JwtPayload>(storedToken)
        const isExpired = decoded.exp * 1000 < Date.now()
        if (isExpired) {
          router.push('/')
        } else {
          setToken(storedToken)
        }
      } catch (e) {
        alert('Erro inesperado: ' + e)
        router.push('/')
      }
    }
  }, [router])

  return token
}
