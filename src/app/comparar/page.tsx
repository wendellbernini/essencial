<<<<<<< Updated upstream
'use client'

import { useComparison } from '@/hooks/useComparison'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/utils/format'
import { X } from 'lucide-react'

export default function ComparePage() {
  const { items, removeItem, clearComparison } = useComparison()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Comparação de Produtos</h1>
        <p className="text-gray-500 mb-8">
          Nenhum produto adicionado à comparação.
        </p>
        <Link href="/produtos">
          <Button>Ver produtos</Button>
        </Link>
      </div>
    )
  }

  // Lista de características para comparar
  const features = [
    'Marca',
    'Preço',
    'Estoque',
    'Descrição',
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Comparação de Produtos</h1>
        <Button variant="outline" onClick={clearComparison}>
          Limpar comparação
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Cabeçalho com imagens e nomes */}
          <thead>
            <tr>
              <th className="w-48"></th>
              {items.map(product => (
                <th key={product.id} className="p-4 min-w-[250px]">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 z-10"
                      onClick={() => removeItem(product.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="aspect-square relative rounded-lg overflow-hidden mb-4">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Link
                      href={`/produtos/${product.slug}`}
                      className="text-lg font-medium hover:text-primary"
                    >
                      {product.name}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Corpo com características */}
          <tbody>
            {features.map(feature => (
              <tr key={feature} className="border-t">
                <td className="p-4 font-medium bg-gray-50">{feature}</td>
                {items.map(product => (
                  <td key={product.id} className="p-4">
                    {feature === 'Preço' && formatCurrency(product.price)}
                    {feature === 'Marca' && product.brand}
                    {feature === 'Estoque' && `${product.stock} unidades`}
                    {feature === 'Descrição' && product.description}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
=======
'use client'

import { useComparison } from '@/hooks/useComparison'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/format'
import { X } from 'lucide-react'

export default function ComparePage() {
  const { items, removeItem, clearComparison } = useComparison()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Comparação de Produtos</h1>
        <p className="text-gray-500 mb-8">
          Nenhum produto adicionado à comparação.
        </p>
        <Link href="/produtos">
          <Button>Ver produtos</Button>
        </Link>
      </div>
    )
  }

  // Lista de características para comparar
  const features = [
    'Marca',
    'Preço',
    'Estoque',
    'Descrição',
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Comparação de Produtos</h1>
        <Button variant="outline" onClick={clearComparison}>
          Limpar comparação
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Cabeçalho com imagens e nomes */}
          <thead>
            <tr>
              <th className="w-48"></th>
              {items.map(product => (
                <th key={product.id} className="p-4 min-w-[250px]">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 z-10"
                      onClick={() => removeItem(product.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="aspect-square relative rounded-lg overflow-hidden mb-4">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Link
                      href={`/produtos/${product.slug}`}
                      className="text-lg font-medium hover:text-primary"
                    >
                      {product.name}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Corpo com características */}
          <tbody>
            {features.map(feature => (
              <tr key={feature} className="border-t">
                <td className="p-4 font-medium bg-gray-50">{feature}</td>
                {items.map(product => (
                  <td key={product.id} className="p-4">
                    {feature === 'Preço' && formatCurrency(product.price)}
                    {feature === 'Marca' && product.brand}
                    {feature === 'Estoque' && `${product.stock} unidades`}
                    {feature === 'Descrição' && product.description}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
>>>>>>> Stashed changes
} 