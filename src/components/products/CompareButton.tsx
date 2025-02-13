<<<<<<< Updated upstream
'use client'

import { Scale } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useComparison } from '@/hooks/useComparison'
import { toast } from 'sonner'

interface CompareButtonProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: string[]
    brand: string
    description: string
    stock: number
  }
}

export function CompareButton({ product }: CompareButtonProps) {
  const { addItem, removeItem, isInComparison, isFull } = useComparison()

  const isSelected = isInComparison(product.id)

  const handleClick = () => {
    try {
      if (isSelected) {
        removeItem(product.id)
        toast.success('Produto removido da comparação')
      } else {
        addItem(product)
        toast.success('Produto adicionado à comparação')
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  return (
    <Button
      variant={isSelected ? 'default' : 'outline'}
      size="icon"
      onClick={handleClick}
      disabled={!isSelected && isFull}
      title={
        !isSelected && isFull
          ? 'Limite máximo de produtos para comparação atingido'
          : isSelected
          ? 'Remover da comparação'
          : 'Adicionar à comparação'
      }
    >
      <Scale className="h-4 w-4" />
    </Button>
  )
=======
'use client'

import { Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useComparison } from '@/hooks/useComparison'
import { toast } from 'sonner'

interface CompareButtonProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: string[]
    brand: string
    description: string
    stock: number
  }
}

export function CompareButton({ product }: CompareButtonProps) {
  const { addItem, removeItem, isInComparison, isFull } = useComparison()

  const isSelected = isInComparison(product.id)

  const handleClick = () => {
    try {
      if (isSelected) {
        removeItem(product.id)
        toast.success('Produto removido da comparação')
      } else {
        addItem(product)
        toast.success('Produto adicionado à comparação')
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  return (
    <Button
      variant={isSelected ? 'default' : 'outline'}
      size="icon"
      onClick={handleClick}
      disabled={!isSelected && isFull}
      title={
        !isSelected && isFull
          ? 'Limite máximo de produtos para comparação atingido'
          : isSelected
          ? 'Remover da comparação'
          : 'Adicionar à comparação'
      }
    >
      <Scale className="h-4 w-4" />
    </Button>
  )
>>>>>>> Stashed changes
} 