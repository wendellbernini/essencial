<<<<<<< Updated upstream
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { WishlistButton } from './WishlistButton'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/utils/format'
import { ProductReviews, ProductQuestions } from './dynamic'

interface ProductDetailsProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    images: string[]
    brand: string
    stock: number
    rating?: number
    details?: Array<{
      title: string
      content: string[]
    }>
  }
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'reviews' | 'questions'>('reviews')
  const { addItem } = useCart()

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1)
    }
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
    })
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Galeria de Imagens */}
        <div>
          <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden ${
                  selectedImage === index
                    ? 'ring-2 ring-primary'
                    : 'hover:ring-2 hover:ring-gray-300'
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Informações do Produto */}
        <div>
          <div className="mb-6">
            <p className="text-lg text-gray-500 mb-2">{product.brand}</p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              {product.rating && (
                <>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">|</span>
                </>
              )}
              <span className="text-sm text-gray-600">
                {product.stock} em estoque
              </span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(product.price)}
            </p>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Quantidade e Botões */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={decreaseQuantity}
                  className="p-2 hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="p-2 hover:bg-gray-50"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button onClick={handleAddToCart} className="flex-1">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Adicionar ao Carrinho
              </Button>
            </div>

            <WishlistButton product={product} variant="full" />
          </div>

          {/* Detalhes do Produto */}
          {product.details && (
            <div className="border-t pt-6 space-y-6 mt-8">
              {product.details.map((section, index) => (
                <div key={index}>
                  <h3 className="font-semibold mb-2">{section.title}</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-600">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Avaliações e Perguntas */}
      <div className="mt-12 border-t pt-8">
        {/* Tabs */}
        <div className="flex gap-8 mb-8">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 font-medium border-b-2 ${
              activeTab === 'reviews'
                ? 'text-primary border-primary'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Avaliações
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`pb-4 font-medium border-b-2 ${
              activeTab === 'questions'
                ? 'text-primary border-primary'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Perguntas e Respostas
          </button>
        </div>

        {/* Conteúdo */}
        {activeTab === 'reviews' ? (
          <ProductReviews productId={product.id} />
        ) : (
          <ProductQuestions productId={product.id} />
        )}
      </div>
    </div>
  )
=======
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WishlistButton } from './WishlistButton'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/utils/format'
import { ProductReviews, ProductQuestions } from './dynamic'

interface ProductDetailsProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    images: string[]
    brand: string
    stock: number
    rating?: number
    details?: Array<{
      title: string
      content: string[]
    }>
  }
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'reviews' | 'questions'>('reviews')
  const { addItem } = useCart()

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1)
    }
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
    })
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Galeria de Imagens */}
        <div>
          <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden ${
                  selectedImage === index
                    ? 'ring-2 ring-primary'
                    : 'hover:ring-2 hover:ring-gray-300'
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Informações do Produto */}
        <div>
          <div className="mb-6">
            <p className="text-lg text-gray-500 mb-2">{product.brand}</p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              {product.rating && (
                <>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">|</span>
                </>
              )}
              <span className="text-sm text-gray-600">
                {product.stock} em estoque
              </span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(product.price)}
            </p>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Quantidade e Botões */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={decreaseQuantity}
                  className="p-2 hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="p-2 hover:bg-gray-50"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button onClick={handleAddToCart} className="flex-1">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Adicionar ao Carrinho
              </Button>
            </div>

            <WishlistButton product={product} variant="full" />
          </div>

          {/* Detalhes do Produto */}
          {product.details && (
            <div className="border-t pt-6 space-y-6 mt-8">
              {product.details.map((section, index) => (
                <div key={index}>
                  <h3 className="font-semibold mb-2">{section.title}</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-600">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Avaliações e Perguntas */}
      <div className="mt-12 border-t pt-8">
        {/* Tabs */}
        <div className="flex gap-8 mb-8">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 font-medium border-b-2 ${
              activeTab === 'reviews'
                ? 'text-primary border-primary'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Avaliações
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`pb-4 font-medium border-b-2 ${
              activeTab === 'questions'
                ? 'text-primary border-primary'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Perguntas e Respostas
          </button>
        </div>

        {/* Conteúdo */}
        {activeTab === 'reviews' ? (
          <ProductReviews productId={product.id} />
        ) : (
          <ProductQuestions productId={product.id} />
        )}
      </div>
    </div>
  )
>>>>>>> Stashed changes
} 