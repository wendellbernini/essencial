import { useState, useCallback } from 'react'
import { useHistory } from '@/hooks/useHistory'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  brand: string
  categoryId: string
}

interface RecommendedProduct extends Product {
  score: number
  reason: string
}

export function useRecommendations() {
  const { items: historyItems } = useHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getRecommendations = useCallback(async (
    currentProductId?: string,
    limit: number = 6
  ) => {
    try {
      setIsLoading(true)
      setError(null)

      // Constrói os parâmetros da busca
      const params = new URLSearchParams({
        limit: limit.toString(),
        ...(currentProductId && { exclude: currentProductId }),
      })

      // Adiciona os últimos 5 produtos visualizados
      const recentProducts = historyItems
        .slice(0, 5)
        .map(item => item.product.id)
        .join(',')

      if (recentProducts) {
        params.append('history', recentProducts)
      }

      // Busca as recomendações
      const response = await fetch(`/api/recommendations?${params}`)
      if (!response.ok) {
        throw new Error('Erro ao carregar recomendações')
      }

      const data = await response.json()
      return data.recommendations as RecommendedProduct[]
    } catch (err) {
      console.error('Erro ao carregar recomendações:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar recomendações')
      return []
    } finally {
      setIsLoading(false)
    }
  }, [historyItems])

  const getSimilarProducts = useCallback(async (
    productId: string,
    limit: number = 6
  ) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(
        `/api/recommendations/similar?productId=${productId}&limit=${limit}`
      )
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos similares')
      }

      const data = await response.json()
      return data.recommendations as RecommendedProduct[]
    } catch (err) {
      console.error('Erro ao carregar produtos similares:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos similares')
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getFrequentlyBoughtTogether = useCallback(async (
    productId: string,
    limit: number = 3
  ) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(
        `/api/recommendations/frequently-bought?productId=${productId}&limit=${limit}`
      )
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos frequentemente comprados juntos')
      }

      const data = await response.json()
      return data.recommendations as RecommendedProduct[]
    } catch (err) {
      console.error('Erro ao carregar produtos frequentemente comprados juntos:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao carregar produtos frequentemente comprados juntos'
      )
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    getRecommendations,
    getSimilarProducts,
    getFrequentlyBoughtTogether,
  }
} 