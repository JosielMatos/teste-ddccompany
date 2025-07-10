'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/lib/axios'

interface UserResponse {
  data: {
    count: number
    items: User[] | Post[]
  }
}

interface Profile {
  id: number
  bio: string
}

interface Post {
  id: number
  title: string
  content: string
  published: boolean
  createdAt: string
  categories: { category: { id: number; name: string } }[]
}

interface User {
  id: number
  name: string
  email: string
  profile: Profile
}

export default function UserPage() {
  const { id } = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  console.log(posts)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    api.get<UserResponse>(`/users/${id}`).then((res) => setUser(res.data.data.items[0] as User))

    api
      .get<UserResponse>(`/posts`, {
        params: {
          andWhere: JSON.stringify([{ field: 'authorId', fieldType: 'valueInt', valueInt: parseInt(id as string) }]),
        },
      })
      .then((res) => setPosts(res.data.data.items as Post[]))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div>Carregando...</div>
  if (!user) return <div>Usuário não encontrado.</div>

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-bold mb-2 text-center text-black">{user.name || 'Nome não informado'}</h1>
        <p className="text-gray-700 text-center mb-4">
          <span className="font-semibold">Bio:</span> {user.profile?.bio || 'Não informada'}
        </p>
        <p className="text-gray-500 text-center text-sm">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {posts.map((post) => {
          const createdDate = new Date(post.createdAt).toLocaleDateString('pt-BR')
          return (
            <div
              key={post.id}
              className="rounded-xl shadow-md hover:shadow-lg transition-shadow bg-amber-50 p-6 flex flex-col"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
              <p className="text-gray-700 flex-1">{post.content}</p>
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {post.categories.map(({ category }) => (
                  <span key={category.id} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                    {category.name}
                  </span>
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold w-fit ${
                    post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {post.published ? 'Publicado' : 'Não publicado'}
                </span>
                <span className="text-xs text-gray-500">Criado em: {createdDate}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
