<<<<<<< Updated upstream
import { useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  brand: string
  description: string
  stock: number
}

interface WishlistItem {
  id: string
  productId: string
  createdAt: string
  product: Product
}

export function useWishlist() {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/wishlist')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar lista de desejos')
      }

      const data = await response.json()
      setItems(data)
    } catch (err) {
      console.error('Erro ao carregar lista de desejos:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar lista de desejos')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const addItem = useCallback(async (product: Product) => {
    if (!isAuthenticated) return null

    try {
      setError(null)
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao adicionar produto')
      }

      setItems(prev => [...prev, data])
      return data
    } catch (err) {
      console.error('Erro ao adicionar produto:', err)
      setError(err instanceof Error ? err.message : 'Erro ao adicionar produto')
      return null
    }
  }, [isAuthenticated])

  const removeItem = useCallback(async (productId: string) => {
    if (!isAuthenticated) return false

    try {
      setError(null)
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao remover produto')
      }

      setItems(prev => prev.filter(item => item.productId !== productId))
      return true
    } catch (err) {
      console.error('Erro ao remover produto:', err)
      setError(err instanceof Error ? err.message : 'Erro ao remover produto')
      return false
    }
  }, [isAuthenticated])

  const isInWishlist = useCallback((productId: string) => {
    return items.some(item => item.productId === productId)
  }, [items])

  return {
    items,
    isLoading,
    error,
    fetchItems,
    addItem,
    removeItem,
    isInWishlist,
  }
=======
import { useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  brand: string
  description: string
  stock: number
}

interface WishlistItem {
  id: string
  productId: string
  createdAt: string
  product: Product
}

export function useWishlist() {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/wishlist')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar lista de desejos')
      }

      const data = await response.json()
      setItems(data)
    } catch (err) {
      console.error('Erro ao carregar lista de desejos:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar lista de desejos')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const addItem = useCallback(async (product: Product) => {
    if (!isAuthenticated) return null

    try {
      setError(null)
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao adicionar produto')
      }

      setItems(prev => [...prev, data])
      return data
    } catch (err) {
      console.error('Erro ao adicionar produto:', err)
      setError(err instanceof Error ? err.message : 'Erro ao adicionar produto')
      return null
    }
  }, [isAuthenticated])

  const removeItem = useCallback(async (productId: string) => {
    if (!isAuthenticated) return false

    try {
      setError(null)
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao remover produto')
      }

      setItems(prev => prev.filter(item => item.productId !== productId))
      return true
    } catch (err) {
      console.error('Erro ao remover produto:', err)
      setError(err instanceof Error ? err.message : 'Erro ao remover produto')
      return false
    }
  }, [isAuthenticated])

  const isInWishlist = useCallback((productId: string) => {
    return items.some(item => item.productId === productId)
  }, [items])

  return {
    items,
    isLoading,
    error,
    fetchItems,
    addItem,
    removeItem,
    isInWishlist,
  }
>>>>>>> Stashed changes
} 