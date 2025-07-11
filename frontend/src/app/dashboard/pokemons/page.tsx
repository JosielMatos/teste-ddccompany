'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import { useAuth } from '@/hooks/useAuth'
import { Pagination } from '@/app/components/Pagination'
import { Modal } from '@/app/components/Modal'
import { FiEdit, FiTrash } from 'react-icons/fi'

interface Pokemon {
  id: number
  name: string
  type: string
  ability: string
  image: string
}

const TAKE = 10

export default function PokemonsPage() {
  useAuth()
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', type: '', ability: '', image: '' })
  const [creating, setCreating] = useState(false)
  const [editingPokemon, setEditingPokemon] = useState<Pokemon | null>(null)
  const isEditing = !!editingPokemon

  useEffect(() => {
    reloadPokemons()
  }, [page])

  async function handleSubmitPokemon(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    try {
      if (isEditing && editingPokemon) {
        await api.put(`/pokemon/${editingPokemon.id}`, { ...form })
      } else {
        await api.post('/pokemon', { ...form })
      }
      setShowModal(false)
      setForm({ name: '', type: '', ability: '', image: '' })
      setEditingPokemon(null)
      reloadPokemons()
    } finally {
      setCreating(false)
    }
  }

  function handleOpenEdit(pokemon: Pokemon) {
    setEditingPokemon(pokemon)
    setForm({
      name: pokemon.name,
      type: pokemon.type,
      ability: pokemon.ability,
      image: pokemon.image,
    })
    setShowModal(true)
  }

  async function handleDeletePokemon(pokemonId: number) {
    if (!confirm('Tem certeza que deseja deletar este pokémon?')) return
    try {
      await api.delete(`/pokemon/${pokemonId}`)
      reloadPokemons()
    } catch (error) {
      alert('Erro ao deletar pokémon.' + error)
    }
  }

  function reloadPokemons() {
    setLoading(true)
    api
      .get<{ data: { items: Pokemon[]; count: number } }>('/pokemon', {
        params: {
          skip: (page - 1) * TAKE,
          take: TAKE,
        },
      })
      .then((res) => {
        setPokemons(res.data.data.items)
        setCount(res.data.data.count)
      })
      .finally(() => setLoading(false))
  }

  if (loading) return <div>Carregando...</div>
  if (!pokemons.length) return <div>Nenhum pokémon encontrado.</div>

  const totalPages = Math.ceil(count / TAKE)

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="flex items-center justify-between max-w-4xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-black">Pokémons</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
          onClick={() => {
            setEditingPokemon(null)
            setForm({ name: '', type: '', ability: '', image: '' })
            setShowModal(true)
          }}
        >
          Novo Pokémon
        </button>
      </div>
      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingPokemon(null)
        }}
        title={isEditing ? 'Editar pokémon' : 'Novo pokémon'}
      >
        <form onSubmit={handleSubmitPokemon} className="space-y-4">
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
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Habilidade</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.ability}
              onChange={(e) => setForm((f) => ({ ...f, ability: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">URL da Imagem</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              required
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {pokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            className="rounded-xl shadow-md hover:shadow-lg transition-shadow bg-amber-50 p-6 flex flex-col items-center"
          >
            <div className="flex gap-2 ml-auto mb-2">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition cursor-pointer"
                onClick={() => handleOpenEdit(pokemon)}
                title="Editar"
                type="button"
              >
                <FiEdit className="text-blue-600" size={18} />
              </button>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition cursor-pointer"
                onClick={() => handleDeletePokemon(pokemon.id)}
                title="Deletar"
                type="button"
              >
                <FiTrash className="text-red-600" size={18} />
              </button>
            </div>
            <img src={pokemon.image} alt={pokemon.name} className="w-32 h-32 object-contain mb-4 rounded" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{pokemon.name}</h3>
            <div className="flex flex-col gap-1 w-full">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold w-fit mb-1">
                Tipo: {pokemon.type}
              </span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold w-fit mb-1">
                Habilidade: {pokemon.ability}
              </span>
            </div>
          </div>
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
