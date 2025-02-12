'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/utils/format'

// Dados mockados para exemplo
const products = [
  {
    id: '1',
    name: 'Batom Matte Vermelho',
    price: 49.90,
    stock: 100,
    category: 'Maquiagem',
    featured: true,
    image: '/images/products/lipstick.jpg',
  },
  // Adicionar mais produtos conforme necessário
]

export default function ProductsPage() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const toggleAllProducts = () => {
    setSelectedProducts(prev =>
      prev.length === products.length ? [] : products.map(p => p.id)
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Button asChild>
          <Link href="/admin/produtos/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Link>
        </Button>
      </div>

      {/* Filtros e Ações */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="flex-1 px-4 py-2 border rounded-md"
          />
          <select className="px-4 py-2 border rounded-md">
            <option value="">Todas as categorias</option>
            <option value="maquiagem">Maquiagem</option>
            <option value="skincare">Skincare</option>
            <option value="cabelos">Cabelos</option>
            <option value="perfumes">Perfumes</option>
          </select>
          {selectedProducts.length > 0 && (
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Selecionados
            </Button>
          )}
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length}
                  onChange={toggleAllProducts}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Preço
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Estoque
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Destaque
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 relative rounded overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.stock}
                </td>
                <td className="px-6 py-4">
                  <Star
                    className={`w-5 h-5 ${
                      product.featured
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <button
                    className="text-primary hover:text-primary/80 mr-3"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-700"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 