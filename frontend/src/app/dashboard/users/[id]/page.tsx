'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/lib/axios'
import { Pagination } from '@/app/components/Pagination'
import { Modal } from '@/app/components/Modal'
import { FiEdit, FiTrash } from 'react-icons/fi'
import { useAuth } from '@/hooks/useAuth'

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

const TAKE = 10

export default function UserPage() {
  useAuth()
  const { id } = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [postsCount, setPostsCount] = useState(0)
  const [postsPage, setPostsPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', published: false })
  const [creating, setCreating] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [showBioModal, setShowBioModal] = useState(false)
  const [bioValue, setBioValue] = useState('')
  const [bioLoading, setBioLoading] = useState(false)
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [showCategoriesModal, setShowCategoriesModal] = useState(false)
  const [categoryForm, setCategoryForm] = useState({ id: null as number | null, name: '' })
  const [categorySaving, setCategorySaving] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const isEditing = !!editingPost

  // Posts
  function loadPosts() {
    return api
      .get<UserResponse>(`/posts`, {
        params: {
          andWhere: JSON.stringify([{ field: 'authorId', fieldType: 'valueInt', valueInt: parseInt(id as string) }]),
          skip: (postsPage - 1) * TAKE,
          take: TAKE,
        },
      })
      .then((res) => {
        setPosts(res.data.data.items as Post[])
        setPostsCount(res.data.data.count)
      })
  }

  function loadCategories() {
    api.get('/categories/?take=100').then((res) => setCategories(res.data.data.items))
  }

  async function handleSubmitPost(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    try {
      if (isEditing && editingPost) {
        await api.put(`/posts/${editingPost.id}`, {
          ...form,
          postCategories: selectedCategories.map((id) => id),
        })
      } else {
        await api.post('/posts', {
          ...form,
          author: { connect: { id: Number(id) } },
          postCategories: selectedCategories.map((id) => id),
        })
      }
      setShowModal(false)
      setForm({ title: '', content: '', published: false })
      setEditingPost(null)
      // Reload posts
      loadPosts()
    } finally {
      setCreating(false)
    }
  }

  function handleOpenEdit(post: Post) {
    setEditingPost(post)
    setForm({
      title: post.title,
      content: post.content,
      published: post.published,
    })
    setSelectedCategories(post.categories.map((c) => c.category.id))
    setShowModal(true)
  }

  async function handleDeletePost(postId: number) {
    if (!confirm('Tem certeza que deseja deletar este post?')) return
    try {
      await api.delete(`/posts/${postId}`)
      // Atualiza a lista de posts após deletar
      loadPosts()
    } catch (error) {
      alert(`Erro ao deletar post. ${error || 'Erro desconhecido'}`)
    }
  }

  // Bio
  async function handleSaveBio() {
    setBioLoading(true)
    try {
      if (user?.profile) {
        // Atualizar bio existente
        await api.put(`/profiles/${user.profile.id}`, { bio: bioValue })
      } else {
        // Criar nova bio
        await api.post('/profiles', {
          bio: bioValue,
          user: { connect: { id: user?.id } },
        })
      }
      // Atualiza o usuário após salvar
      const res = await api.get<UserResponse>(`/users/${user?.id}`)
      setUser(res.data.data.items[0] as User)
      setShowBioModal(false)
    } finally {
      setBioLoading(false)
    }
  }

  async function handleDeleteBio() {
    if (!user?.profile) return
    if (!confirm('Tem certeza que deseja remover a bio?')) return
    setBioLoading(true)
    try {
      await api.delete(`/profiles/${user.profile.id}`)
      // Atualiza o usuário após deletar
      const res = await api.get<UserResponse>(`/users/${user?.id}`)
      setUser(res.data.data.items[0] as User)
      setShowBioModal(false)
    } finally {
      setBioLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.get<UserResponse>(`/users/${id}`).then((res) => setUser(res.data.data.items[0] as User))

    loadPosts().finally(() => setLoading(false))
    loadCategories()
  }, [id, postsPage])

  if (loading) return <div>Carregando...</div>
  if (!user) return <div>Usuário não encontrado.</div>

  const totalPostsPages = Math.ceil(postsCount / TAKE)

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-bold mb-2 text-center text-black">{user.name || 'Nome não informado'}</h1>
        <div className="flex items-center justify-center mb-4 gap-2">
          <p className="text-gray-700 text-center">
            <span className="font-semibold">Bio:</span> {user.profile?.bio || 'Não informada'}
          </p>
          <button
            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm cursor-pointer"
            onClick={() => {
              setBioValue(user.profile?.bio || '')
              setShowBioModal(true)
            }}
            type="button"
          >
            {user.profile?.bio ? 'Editar Bio' : 'Adicionar Bio'}
          </button>
        </div>
        <p className="text-gray-500 text-center text-sm">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
      </div>
      <div className="flex items-center justify-between max-w-4xl mx-auto mb-6 sm:flex-row flex-col gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Posts</h2>
        <div className="flex items-center gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
            onClick={() => {
              setEditingPost(null)
              setForm({ title: '', content: '', published: false })
              setSelectedCategories([])
              setShowModal(true)
            }}
          >
            Novo Post
          </button>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition cursor-pointer ml-2"
            onClick={() => setShowCategoriesModal(true)}
          >
            Gerenciar Categorias
          </button>
        </div>
      </div>
      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingPost(null)
        }}
        title={isEditing ? 'Editar post' : 'Criar novo post'}
      >
        <form onSubmit={handleSubmitPost} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Conteúdo</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={form.content || ''}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categorias</label>
            <select
              multiple
              className="w-full border rounded px-3 py-2"
              value={selectedCategories.map(String)}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions).map((opt) => Number(opt.value))
                setSelectedCategories(options)
              }}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              id="published"
            />
            <label htmlFor="published" className="text-sm">
              Publicado
            </label>
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
      <Modal
        open={showCategoriesModal}
        onClose={() => {
          setShowCategoriesModal(false)
          setCategoryForm({ id: null, name: '' })
        }}
        title="Gerenciar Categorias"
      >
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setCategorySaving(true)
              if (categoryForm.id) {
                await api.put(`/categories/${categoryForm.id}`, { name: categoryForm.name })
              } else {
                await api.post('/categories', { name: categoryForm.name })
              }
              setCategoryForm({ id: null, name: '' })
              loadCategories()
              setCategorySaving(false)
            }}
            className="flex gap-2"
          >
            <input
              className="border rounded px-3 py-2 flex-1"
              placeholder="Nome da categoria"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              disabled={categorySaving}
            >
              {categoryForm.id ? 'Salvar' : 'Criar'}
            </button>
            {categoryForm.id && (
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                onClick={() => setCategoryForm({ id: null, name: '' })}
              >
                Cancelar
              </button>
            )}
          </form>
          <ul>
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between py-1">
                <span>{cat.name}</span>
                <div className="flex gap-2">
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => setCategoryForm({ id: cat.id, name: cat.name })}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-600 hover:underline text-sm"
                    onClick={async () => {
                      if (confirm('Deletar esta categoria?')) {
                        await api.delete(`/categories/${cat.id}`)
                        loadCategories()
                      }
                    }}
                  >
                    Deletar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
      <Modal
        open={showBioModal}
        onClose={() => setShowBioModal(false)}
        title={user.profile?.bio ? 'Editar Bio' : 'Adicionar Bio'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSaveBio()
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={bioValue}
              onChange={(e) => setBioValue(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
              disabled={bioLoading}
            >
              {bioLoading ? 'Salvando...' : 'Salvar'}
            </button>
            {user.profile?.bio && (
              <button
                type="button"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition w-full"
                onClick={handleDeleteBio}
                disabled={bioLoading}
              >
                {bioLoading ? 'Removendo...' : 'Remover'}
              </button>
            )}
          </div>
        </form>
      </Modal>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {posts.map((post) => {
          const createdDate = new Date(post.createdAt).toLocaleDateString('pt-BR')
          return (
            <div
              key={post.id}
              className="rounded-xl shadow-md hover:shadow-lg transition-shadow bg-amber-50 p-6 flex flex-col"
            >
              <div className="flex gap-2 ml-auto mb-2">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition cursor-pointer"
                  onClick={() => handleOpenEdit(post)}
                  title="Editar"
                  type="button"
                >
                  <FiEdit className="text-blue-600" size={18} />
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition cursor-pointer"
                  onClick={() => handleDeletePost(post.id)}
                  title="Deletar"
                  type="button"
                >
                  <FiTrash className="text-red-600" size={18} />
                </button>
              </div>
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
      <Pagination page={postsPage} totalPages={totalPostsPages} onPageChange={setPostsPage} />
    </div>
  )
}
