<<<<<<< Updated upstream
'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'
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

interface ComparisonContextData {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearComparison: () => void
  isInComparison: (productId: string) => boolean
  isFull: boolean
}

interface ComparisonProviderProps {
  children: ReactNode
}

const ComparisonContext = createContext<ComparisonContextData>(
  {} as ComparisonContextData
)

export function ComparisonProvider({ children }: ComparisonProviderProps) {
  const [items, setItems] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return []
    return getStorageItem<Product[]>(COMPARISON_KEY) || []
  })

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

  const isInComparison = useCallback(
    (productId: string) => {
      return items.some(item => item.id === productId)
    },
    [items]
  )

  return (
    <ComparisonContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearComparison,
        isInComparison,
        isFull: items.length >= MAX_COMPARISON_ITEMS,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison(): ComparisonContextData {
  const context = useContext(ComparisonContext)

  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider')
  }

  return context
=======
'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'
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

interface ComparisonContextData {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearComparison: () => void
  isInComparison: (productId: string) => boolean
  isFull: boolean
}

interface ComparisonProviderProps {
  children: ReactNode
}

const ComparisonContext = createContext<ComparisonContextData>(
  {} as ComparisonContextData
)

export function ComparisonProvider({ children }: ComparisonProviderProps) {
  const [items, setItems] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return []
    return getStorageItem<Product[]>(COMPARISON_KEY) || []
  })

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

  const isInComparison = useCallback(
    (productId: string) => {
      return items.some(item => item.id === productId)
    },
    [items]
  )

  return (
    <ComparisonContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearComparison,
        isInComparison,
        isFull: items.length >= MAX_COMPARISON_ITEMS,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison(): ComparisonContextData {
  const context = useContext(ComparisonContext)

  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider')
  }

  return context
>>>>>>> Stashed changes
} 