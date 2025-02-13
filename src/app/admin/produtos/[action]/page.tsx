'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Upload, X, GripVertical } from 'lucide-react'
import { useImageUpload } from '@/hooks/useImageUpload'

interface Category {
  id: string
  name: string
}

interface ProductFormData {
  name: string
  description: string
  price: string
  stock: string
  brand: string
  categoryId: string
  featured: boolean
  images: string[]
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  price: '',
  stock: '',
  brand: '',
  categoryId: '',
  featured: false,
  images: [],
}

export default function ProductForm({
  params,
}: {
  params: Promise<{ action: string }>
}) {
  const router = useRouter()
  const { action } = use(params)
  const isEditing = action !== 'novo'
  const [formData, setFormData] = useState<ProductFormData>(initialFormData)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { isUploading, handleFileChange } = useImageUpload({
    onSuccess: (url) => setFormData(prev => ({ ...prev, images: [...prev.images, url] })),
    onError: (error) => alert(error.message),
  })

  useEffect(() => {
    fetchCategories()
    if (isEditing) {
      fetchProduct()
    }
  }, [isEditing])

  async function fetchCategories() {
    try {
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  async function fetchProduct() {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/products/${action}`)
      const data = await response.json()
      setFormData({
        name: data.name,
        description: data.description || '',
        price: String(data.price),
        stock: String(data.stock),
        brand: data.brand,
        categoryId: data.categoryId,
        featured: data.featured || false,
        images: data.images || [],
      })
    } catch (error) {
      console.error('Erro ao carregar produto:', error)
      router.push('/admin/produtos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(
        `/api/admin/products${isEditing ? `/${action}` : ''}`,
        {
          method: isEditing ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
          }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
      }

      router.push('/admin/produtos')
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      alert(error instanceof Error ? error.message : 'Erro ao salvar produto')
    } finally {
      setIsLoading(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    setFormData(prev => {
      const newImages = [...prev.images]
      const [movedImage] = newImages.splice(fromIndex, 1)
      newImages.splice(toIndex, 0, movedImage)
      return { ...prev, images: newImages }
    })
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
        {isEditing ? 'Editar Produto' : 'Novo Produto'}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="space-y-6">
            {/* Imagens */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagens
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative aspect-square group">
                    <Image
                      src={image}
                      alt={`Imagem ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <div className="absolute top-2 right-2 flex gap-2">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => moveImage(index, index - 1)}
                            className="p-1 bg-white text-gray-700 rounded-full hover:bg-gray-100"
                            title="Mover para esquerda"
                          >
                            <GripVertical className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                          title="Remover imagem"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {formData.images.length < 4 && (
                  <label className={`flex flex-col items-center justify-center aspect-square bg-gray-50 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 ${
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
                        <span className="text-sm text-gray-500 text-center mt-2">
                          Adicionar imagem
                        </span>
                      </>
                    )}
                  </label>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Adicione até 4 imagens no formato JPG, PNG ou GIF (máximo 5MB cada)
              </p>
            </div>

            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Produto
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, brand: e.target.value }))
                  }
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, price: e.target.value }))
                    }
                    className="w-full pl-10 pr-4 py-2 border rounded-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estoque
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, stock: e.target.value }))
                  }
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
                  }
                  className="w-full px-4 py-2 border rounded-md"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Produto em destaque
                  </span>
                </label>
              </div>
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
                required
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
            {isEditing ? 'Salvar Alterações' : 'Criar Produto'}
          </Button>
        </div>
      </form>
    </div>
  )
} 