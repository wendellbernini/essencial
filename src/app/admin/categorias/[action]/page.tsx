'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Upload, X } from 'lucide-react'
import { useImageUpload } from '@/hooks/useImageUpload'

interface CategoryFormData {
  name: string
  description: string
  image: string | null
}

const initialFormData: CategoryFormData = {
  name: '',
  description: '',
  image: null,
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

  const { isUploading, handleFileChange } = useImageUpload({
    onSuccess: (url) => setFormData(prev => ({ ...prev, image: url })),
    onError: (error) => alert(error.message),
  })

  useEffect(() => {
    if (isEditing) {
      fetchCategory()
    }
  }, [isEditing])

  async function fetchCategory() {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/categories/${action}`)
      const data = await response.json()
      setFormData({
        name: data.name,
        description: data.description || '',
        image: data.image,
      })
    } catch (error) {
      console.error('Erro ao carregar categoria:', error)
      router.push('/admin/categorias')
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

      router.push('/admin/categorias')
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
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="space-y-6">
            {/* Imagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem
              </label>
              <div className="flex items-center gap-4">
                {formData.image ? (
                  <div className="relative w-40 aspect-video">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                      className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className={`flex flex-col items-center justify-center w-40 aspect-video bg-gray-50 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="hidden"
                    />
                    {isUploading ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Escolher imagem
                        </span>
                      </>
                    )}
                  </label>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Imagem no formato JPG, PNG ou GIF (máximo 5MB)
              </p>
            </div>

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
        </div>

        <div className="flex items-center justify-end gap-4">
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