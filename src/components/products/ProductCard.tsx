'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency } from '@/utils/format'
import { WishlistButton } from './WishlistButton'
import { CompareButton } from './CompareButton'

interface ProductCardProps {
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

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative">
      <div className="aspect-square relative rounded-lg overflow-hidden mb-4">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <WishlistButton product={product} />
          <CompareButton product={product} />
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
        <Link href={`/produtos/${product.slug}`}>
          <h3 className="font-medium text-gray-900 group-hover:text-primary line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-lg font-semibold text-primary mt-2">
          {formatCurrency(product.price)}
        </p>
      </div>
    </div>
  )
} 