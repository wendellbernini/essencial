import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency } from '@/utils/format'
import { Star } from 'lucide-react'

// Dados mockados para exemplo
const products = [
  {
    id: 1,
    name: 'Batom Matte Vermelho',
    slug: 'batom-matte-vermelho',
    price: 49.90,
    image: '/images/products/lipstick.jpg',
    rating: 4.5,
    brand: 'MAC',
  },
  {
    id: 2,
    name: 'Sérum Facial Vitamina C',
    slug: 'serum-facial-vitamina-c',
    price: 129.90,
    image: '/images/products/serum.jpg',
    rating: 5,
    brand: 'La Roche-Posay',
  },
  {
    id: 3,
    name: 'Máscara de Cílios',
    slug: 'mascara-de-cilios',
    price: 89.90,
    image: '/images/products/mascara.jpg',
    rating: 4.8,
    brand: 'Lancôme',
  },
  {
    id: 4,
    name: 'Perfume Floral',
    slug: 'perfume-floral',
    price: 299.90,
    image: '/images/products/perfume.jpg',
    rating: 4.7,
    brand: 'Carolina Herrera',
  },
]

export function FeaturedProducts() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">Produtos em Destaque</h2>
          <Link
            href="/produtos"
            className="text-primary hover:text-primary/90"
          >
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/produtos/${product.slug}`}
              className="group"
            >
              <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">
                    {product.rating}
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-900 mt-2">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
} 