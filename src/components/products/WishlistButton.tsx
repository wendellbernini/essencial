'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useWishlist } from '@/hooks/useWishlist'
import { toast } from 'sonner'

interface WishlistButtonProps {
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
  variant?: 'icon' | 'full'
}

export function WishlistButton({ product, variant = 'icon' }: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const isActive = isInWishlist(product.id)

  const handleClick = () => {
    try {
      if (isActive) {
        removeItem(product.id)
        toast.success('Produto removido dos favoritos')
      } else {
        addItem(product)
        toast.success('Produto adicionado aos favoritos')
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`p-2 rounded-full transition-colors ${
          isActive
            ? 'text-red-600 hover:text-red-700'
            : 'text-gray-400 hover:text-gray-500'
        }`}
        title={isActive ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <Heart className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
      </button>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className={`w-full ${
        isActive
          ? 'text-red-600 hover:text-red-700'
          : 'text-gray-700 hover:text-gray-800'
      }`}
    >
      <Heart
        className={`w-4 h-4 mr-2 ${isActive ? 'fill-current' : ''}`}
      />
      {isActive ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    </Button>
  )
} 