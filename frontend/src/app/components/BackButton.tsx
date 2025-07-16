'use client'

import { FiArrowLeft } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

export function BackButton({ className = '' }: { className?: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      aria-label="Voltar"
      onClick={() => router.back()}
      className={`flex items-center gap-2 text-blue-600 hover:text-blue-800 cursor-pointer ${className}`}
    >
      <FiArrowLeft size={24} />
      <span className="sr-only">Voltar</span>
    </button>
  )
}
