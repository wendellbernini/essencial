'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  _count: {
    posts: number
  }
  createdAt: string
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
      if (!response.ok) {
        throw new Error('Erro ao carregar categorias')
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
      alert('Erro ao carregar categorias')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir categoria')
      }

      setCategories(prev => prev.filter(category => category.id !== id))
    } catch (error) {
      console.error('Erro ao excluir categoria:', error)
      alert('Erro ao excluir categoria')
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
          <Link href="/admin/blog/categories/nova">
            <Plus className="w-4 h-4 mr-2" />
            Nova Categoria
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posts
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map(category => (
                <tr key={category.id}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {category.name}
                      </div>
                      {category.description && (
                        <div className="text-sm text-gray-500">
                          {category.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {category._count.posts}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/admin/blog/categories/${category.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Nenhuma categoria encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 