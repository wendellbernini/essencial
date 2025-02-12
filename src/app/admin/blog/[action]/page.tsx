'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { useImageUpload } from '@/hooks/useImageUpload'
import { Editor } from '@tinymce/tinymce-react'

interface PostFormData {
  title: string
  content: string
  image: string | null
  published: boolean
  categoryId: string | null
}

interface Category {
  id: string
  name: string
}

const initialFormData: PostFormData = {
  title: '',
  content: '',
  image: null,
  published: false,
  categoryId: null,
}

export default function PostForm({
  params,
}: {
  params: Promise<{ action: string }>
}) {
  const router = useRouter()
  const { action } = use(params)
  const isEditing = action !== 'novo'
  const [formData, setFormData] = useState<PostFormData>(initialFormData)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { isUploading, handleFileChange } = useImageUpload({
    onSuccess: (url) => setFormData(prev => ({ ...prev, image: url })),
    onError: (error) => alert(error.message),
  })

  useEffect(() => {
    fetchCategories()
    if (isEditing) {
      fetchPost()
    }
  }, [isEditing])

  async function fetchCategories() {
    try {
      const response = await fetch('/api/admin/categories')
      if (!response.ok) {
        throw new Error('Erro ao carregar categorias')
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  async function fetchPost() {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/posts/${action}`)
      const data = await response.json()
      setFormData({
        title: data.title,
        content: data.content,
        image: data.image,
        published: data.published,
        categoryId: data.categoryId,
      })
    } catch (error) {
      console.error('Erro ao carregar post:', error)
      router.push('/admin/blog')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(
        `/api/admin/posts${isEditing ? `/${action}` : ''}`,
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

      router.push('/admin/blog')
    } catch (error) {
      console.error('Erro ao salvar post:', error)
      alert(error instanceof Error ? error.message : 'Erro ao salvar post')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditorImageUpload = async (blobInfo: any) => {
    try {
      const formData = new FormData()
      formData.append('file', blobInfo.blob(), blobInfo.filename())

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da imagem')
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      throw error
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
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Editar Post' : 'Novo Post'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem de Capa
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

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          {/* Conteúdo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo
            </label>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              value={formData.content}
              onEditorChange={(content) =>
                setFormData((prev) => ({ ...prev, content }))
              }
              init={{
                height: 500,
                menubar: true,
                language: 'pt_BR',
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                  'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                  'fullscreen', 'insertdatetime', 'media', 'table', 'code',
                  'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Inter,Arial,sans-serif; font-size:16px }',
                images_upload_handler: handleEditorImageUpload,
              }}
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={formData.categoryId || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  categoryId: e.target.value || null,
                }))
              }
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, published: e.target.checked }))
                }
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Publicar post
              </span>
            </label>
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
            {isEditing ? 'Salvar Alterações' : 'Criar Post'}
          </Button>
        </div>
      </form>
    </div>
  )
} 