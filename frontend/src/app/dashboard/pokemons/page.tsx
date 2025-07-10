'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'

interface Pokemon {
  id: number
  name: string
  type: string
  ability: string
  image: string
}

export default function PokemonsPage() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<{ data: { items: Pokemon[] } }>('/pokemon')
      .then((res) => setPokemons(res.data.data.items))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Carregando...</div>
  if (!pokemons.length) return <div>Nenhum pokémon encontrado.</div>

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-black">Pokémons</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {pokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            className="rounded-xl shadow-md hover:shadow-lg transition-shadow bg-amber-50 p-6 flex flex-col items-center"
          >
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
    </div>
  )
}
