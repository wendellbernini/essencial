'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Star, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/utils/format'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: {
    id: string
    name: string
  }
  featured: boolean
  images: string[]
}

interface ProductsResponse {
  products: Product[]
  pagination: {
    total: number
    pages: number
    page: number
    limit: number
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  })

  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchTerm, categoryFilter])

  async function fetchProducts() {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter && { category: categoryFilter }),
      })

      const response = await fetch(`/api/admin/products?${params}`)
      const data: ProductsResponse = await response.json()

      setProducts(data.products)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts()
  }

  const handleDelete = async (ids: string[]) => {
    if (!confirm('Tem certeza que deseja excluir os produtos selecionados?')) {
      return
    }

    try {
      const response = await fetch('/api/admin/products/batch', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      })

      if (response.ok) {
        setSelectedProducts([])
        fetchProducts()
      } else {
        throw new Error('Erro ao excluir produtos')
      }
    } catch (error) {
      console.error('Erro ao excluir produtos:', error)
      alert('Erro ao excluir produtos. Tente novamente.')
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
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
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md"
            />
            <Button type="submit">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </form>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">Todas as categorias</option>
            {/* TODO: Adicionar categorias dinâmicas */}
          </select>

          {selectedProducts.length > 0 && (
            <Button
              variant="outline"
              onClick={() => handleDelete(selectedProducts)}
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
        <div className="overflow-x-auto">
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
                          src={product.images[0] || '/images/placeholder.jpg'}
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
                    {product.category.name}
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
                    <Link
                      href={`/admin/produtos/${product.id}`}
                      className="text-primary hover:text-primary/80 mr-3"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete([product.id])}
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

        {/* Paginação */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t">
            <div className="text-sm text-gray-500">
              Mostrando {(pagination.page - 1) * pagination.limit + 1} a{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
              {pagination.total} resultados
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              {[...Array(pagination.pages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === pagination.pages}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 