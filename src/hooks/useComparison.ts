import { useState, useCallback } from 'react'
import { getStorageItem, setStorageItem } from '@/lib/storage'

const COMPARISON_KEY = '@essencial/comparison'
const MAX_COMPARISON_ITEMS = 4

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

export function useComparison() {
  const [items, setItems] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return []
    return getStorageItem<Product[]>(COMPARISON_KEY) || []
  })

  // Salva os itens no localStorage sempre que mudar
  const saveItems = useCallback((newItems: Product[]) => {
    setItems(newItems)
    setStorageItem(COMPARISON_KEY, newItems)
  }, [])

  const addItem = useCallback((product: Product) => {
    setItems(prev => {
      // Verifica se já atingiu o limite
      if (prev.length >= MAX_COMPARISON_ITEMS) {
        throw new Error('Limite máximo de produtos para comparação atingido')
      }

      // Verifica se o produto já está na lista
      if (prev.some(item => item.id === product.id)) {
        throw new Error('Produto já está na lista de comparação')
      }

      const newItems = [...prev, product]
      setStorageItem(COMPARISON_KEY, newItems)
      return newItems
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.id !== productId)
      setStorageItem(COMPARISON_KEY, newItems)
      return newItems
    })
  }, [])

  const clearComparison = useCallback(() => {
    setItems([])
    setStorageItem(COMPARISON_KEY, [])
  }, [])

  const isInComparison = useCallback((productId: string) => {
    return items.some(item => item.id === productId)
  }, [items])

  return {
    items,
    addItem,
    removeItem,
    clearComparison,
    isInComparison,
    isFull: items.length >= MAX_COMPARISON_ITEMS,
  }
} 