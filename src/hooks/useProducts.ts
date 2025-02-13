import { useState, useCallback } from 'react'
import { Product } from '@prisma/client'

interface CreateProductData {
  name: string
  description: string
  price: number
  stock: number
  brand: string
  categoryId: string
  featured: boolean
  images: string[]
}

interface UpdateProductData extends Partial<CreateProductData> {}

interface ProductsResponse {
  products: Product[]
  metadata: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

interface UseProductsFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  orderBy?: string
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export function useProducts() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ProductsResponse | null>(null)

  const fetchProducts = useCallback(async (filters: UseProductsFilters = {}) => {
    try {
      setIsLoading(true)
      setError(null)

      // Construir query string
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.brand) params.append('brand', filters.brand)
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
      if (filters.search) params.append('search', filters.search)
      if (filters.orderBy) params.append('orderBy', filters.orderBy)
      if (filters.order) params.append('order', filters.order)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())

      const response = await fetch(`/api/products?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos')
      }

      const data = await response.json()
      setData(data)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Lista todos os produtos
  const getProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/admin/products')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos')
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Obtém um produto específico
  const getProduct = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/products/${id}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar produto')
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produto')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Cria um novo produto
  const createProduct = async (data: CreateProductData) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Erro ao criar produto')
      }

      const product = await response.json()
      return product
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar produto')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Atualiza um produto
  const updateProduct = async (id: string, data: UpdateProductData) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar produto')
      }

      const product = await response.json()
      return product
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar produto')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Exclui um produto
  const deleteProduct = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Erro ao excluir produto')
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir produto')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Exclui vários produtos
  const deleteProducts = async (ids: string[]) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const results = await Promise.all(
        ids.map(id => deleteProduct(id))
      )

      return results.every(result => result === true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir produtos')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    products: data?.products || [],
    metadata: data?.metadata,
    isLoading,
    error,
    fetchProducts,
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProducts,
  }
} 