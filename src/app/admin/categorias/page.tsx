'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Category {
  id: string
  name: string
  description: string | null
  image: string | null
  _count: {
    products: number
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
      }

      fetchCategories()
    } catch (error) {
      console.error('Erro ao excluir categoria:', error)
      alert(error instanceof Error ? error.message : 'Erro ao excluir categoria')
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Categorias</h1>
        <Button asChild>
          <Link href="/admin/categorias/nova">
            <Plus className="w-4 h-4 mr-2" />
            Nova Categoria
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="aspect-video relative">
              <Image
                src={category.image || '/images/placeholder.jpg'}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">{category.name}</h2>
                <span className="text-sm text-gray-500">
                  {category._count.products} produtos
                </span>
              </div>
              {category.description && (
                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>
              )}
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link href={`/admin/categorias/${category.id}`}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(category.id)}
                  disabled={category._count.products > 0}
                  title={
                    category._count.products > 0
                      ? 'Não é possível excluir uma categoria com produtos'
                      : 'Excluir categoria'
                  }
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">Nenhuma categoria encontrada</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              asChild
            >
              <Link href="/admin/categorias/nova">
                <Plus className="w-4 h-4 mr-2" />
                Criar primeira categoria
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 