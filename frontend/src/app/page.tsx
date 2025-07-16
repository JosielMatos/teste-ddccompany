'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginSchema } from '../schemas/loginSchema'
import { loginUser } from '../lib/api'
import { storeToken } from '@/utils/auth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginSchema) => {
    try {
      const { token } = await loginUser(data)
      storeToken(token)
      router.push('/dashboard')
    } catch (err) {
      console.error('Login failed:', err)
      setError('Usuário ou senha inválidos')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <div className="mb-4">
          <label className="block mb-1">Username</label>
          <input {...register('username')} className="w-full px-3 py-2 border rounded" />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input type="password" {...register('password')} className="w-full px-3 py-2 border rounded" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Entrar
        </button>
      </form>
    </div>
  )
}
