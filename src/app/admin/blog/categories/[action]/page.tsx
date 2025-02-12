'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'

interface CategoryFormData {
  name: string
  description: string
}

const initialFormData: CategoryFormData = {
  name: '',
  description: '',
}

export default function CategoryForm({
  params,
}: {
  params: Promise<{ action: string }>
}) {
  const router = useRouter()
  const { action } = use(params)
  const isEditing = action !== 'nova'
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isEditing) {
      fetchCategory()
    }
  }, [isEditing])

  async function fetchCategory() {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/categories/${action}`)
      if (!response.ok) {
        throw new Error('Erro ao carregar categoria')
      }
      const data = await response.json()
      setFormData({
        name: data.name,
        description: data.description || '',
      })
    } catch (error) {
      console.error('Erro ao carregar categoria:', error)
      router.push('/admin/blog/categories')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(
        `/api/admin/categories${isEditing ? `/${action}` : ''}`,
        {
          method: isEditing ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
      }

      router.push('/admin/blog/categories')
    } catch (error) {
      console.error('Erro ao salvar categoria:', error)
      alert(error instanceof Error ? error.message : 'Erro ao salvar categoria')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && isEditing) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={4}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            {isEditing ? 'Salvar Alterações' : 'Criar Categoria'}
          </Button>
        </div>
      </form>
    </div>
  )
} 