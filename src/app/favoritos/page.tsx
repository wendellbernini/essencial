'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { useWishlist } from '@/hooks/useWishlist'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/utils/format'

export default function WishlistPage() {
  const { items, isLoading, error, fetchItems, removeItem } = useWishlist()
  const { addItem: addToCart } = useCart()

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.productId,
      name: item.product.name,
      price: Number(item.product.price),
      image: item.product.images[0],
      quantity: 1,
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse max-w-4xl mx-auto">
          <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Lista de Desejos</h1>

        {items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">
              Sua lista de desejos está vazia
            </p>
            <Button asChild>
              <Link href="/produtos">Ver produtos</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-white rounded-lg shadow"
              >
                {/* Imagem */}
                <Link
                  href={`/produtos/${item.product.slug}`}
                  className="relative w-32 aspect-square shrink-0"
                >
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </Link>

                {/* Informações */}
                <div className="flex-1">
                  <Link
                    href={`/produtos/${item.product.slug}`}
                    className="font-medium hover:text-primary"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-lg font-semibold text-primary mt-1">
                    {formatCurrency(Number(item.product.price))}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.product.stock > 0
                      ? `${item.product.stock} em estoque`
                      : 'Fora de estoque'}
                  </p>

                  {/* Ações */}
                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.product.stock === 0}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => removeItem(item.productId)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 