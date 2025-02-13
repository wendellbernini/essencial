<<<<<<< Updated upstream
import { useState, useEffect, useCallback } from 'react'
import { getStorageItem, setStorageItem } from '@/lib/storage'

const HISTORY_KEY = '@essencial/history'
const MAX_HISTORY_ITEMS = 20

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  brand: string
}

interface HistoryItem {
  product: Product
  viewedAt: string
}

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>([])

  // Carrega o histórico do localStorage
  useEffect(() => {
    const storedItems = getStorageItem<HistoryItem[]>(HISTORY_KEY) || []
    setItems(storedItems)
  }, [])

  // Salva o histórico no localStorage sempre que mudar
  useEffect(() => {
    setStorageItem(HISTORY_KEY, items)
  }, [items])

  const addItem = useCallback((product: Product) => {
    setItems(prev => {
      // Remove o item se já existir
      const filtered = prev.filter(item => item.product.id !== product.id)

      // Adiciona o novo item no início
      const newItems = [
        {
          product,
          viewedAt: new Date().toISOString(),
        },
        ...filtered,
      ]

      // Limita o número de itens
      return newItems.slice(0, MAX_HISTORY_ITEMS)
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId))
  }, [])

  const clearHistory = useCallback(() => {
    setItems([])
  }, [])

  return {
    items,
    addItem,
    removeItem,
    clearHistory,
  }
=======
import { useState, useEffect, useCallback } from 'react'
import { getStorageItem, setStorageItem } from '@/lib/storage'

const HISTORY_KEY = '@essencial/history'
const MAX_HISTORY_ITEMS = 20

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  brand: string
}

interface HistoryItem {
  product: Product
  viewedAt: string
}

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>([])

  // Carrega o histórico do localStorage
  useEffect(() => {
    const storedItems = getStorageItem<HistoryItem[]>(HISTORY_KEY) || []
    setItems(storedItems)
  }, [])

  // Salva o histórico no localStorage sempre que mudar
  useEffect(() => {
    setStorageItem(HISTORY_KEY, items)
  }, [items])

  const addItem = useCallback((product: Product) => {
    setItems(prev => {
      // Remove o item se já existir
      const filtered = prev.filter(item => item.product.id !== product.id)

      // Adiciona o novo item no início
      const newItems = [
        {
          product,
          viewedAt: new Date().toISOString(),
        },
        ...filtered,
      ]

      // Limita o número de itens
      return newItems.slice(0, MAX_HISTORY_ITEMS)
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId))
  }, [])

  const clearHistory = useCallback(() => {
    setItems([])
  }, [])

  return {
    items,
    addItem,
    removeItem,
    clearHistory,
  }
>>>>>>> Stashed changes
} 