'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, Minus, Plus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/utils/format'
import { useCart } from '@/hooks/useCart'

// Dados mockados para exemplo
const product = {
  id: '1',
  name: 'Batom Matte Vermelho',
  description: 'Um batom de longa duração com acabamento matte perfeito. Sua fórmula rica em pigmentos proporciona cor intensa e uniforme, enquanto hidrata os lábios.',
  price: 49.90,
  rating: 4.5,
  brand: 'MAC',
  stock: 100,
  images: [
    '/images/products/lipstick.jpg',
    '/images/products/lipstick-2.jpg',
    '/images/products/lipstick-3.jpg',
  ],
  details: [
    {
      title: 'Características',
      content: [
        'Acabamento matte',
        'Longa duração',
        'Alta pigmentação',
        'Fórmula hidratante',
      ],
    },
    {
      title: 'Como Usar',
      content: [
        'Aplique diretamente nos lábios',
        'Para maior precisão, use um pincel de lábios',
        'Pode ser usado com lápis labial',
      ],
    },
  ],
}

export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
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

  const addToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Galeria de Imagens */}
        <div>
          <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
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
              <div className="flex items-center">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm text-gray-600">
                  {product.rating}
                </span>
              </div>
              <span className="text-sm text-gray-400">|</span>
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

          {/* Quantidade e Botão de Compra */}
          <div className="flex items-center gap-4 mb-8">
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
            <Button
              onClick={addToCart}
              className="flex-1"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Adicionar ao Carrinho
            </Button>
          </div>

          {/* Detalhes do Produto */}
          <div className="border-t pt-6 space-y-6">
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
        </div>
      </div>
    </div>
  )
} 