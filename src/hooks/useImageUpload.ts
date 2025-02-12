import { useState } from 'react'

interface UseImageUploadOptions {
  onSuccess?: (url: string) => void
  onError?: (error: Error) => void
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false)

  const upload = async (file: File): Promise<string | null> => {
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
      }

      const { url } = await response.json()
      options.onSuccess?.(url)
      return url
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer upload da imagem'
      options.onError?.(new Error(errorMessage))
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return null

    const file = files[0]

    // Validações básicas
    if (!file.type.startsWith('image/')) {
      options.onError?.(new Error('Apenas imagens são permitidas'))
      return null
    }

    if (file.size > 5 * 1024 * 1024) {
      options.onError?.(new Error('O arquivo deve ter no máximo 5MB'))
      return null
    }

    return upload(file)
  }

  return {
    isUploading,
    upload,
    handleFileChange,
  }
} 