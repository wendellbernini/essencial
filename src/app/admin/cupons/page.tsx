<<<<<<< Updated upstream
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useCoupons } from '@/hooks/useCoupons'
import { formatCurrency } from '@/utils/format'

interface Coupon {
  id: string
  code: string
  type: 'PERCENTAGE' | 'FIXED'
  value: number
  minValue: number | null
  maxUses: number | null
  usedCount: number
  startDate: string | null
  endDate: string | null
  active: boolean
  createdAt: string
}

export default function CouponsPage() {
  const { fetchCoupons, deleteCoupon } = useCoupons()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadCoupons()
  }, [currentPage, searchTerm])

  async function loadCoupons() {
    try {
      setIsLoading(true)
      const data = await fetchCoupons(currentPage, searchTerm)
      if (data) {
        setCoupons(data.coupons)
        setTotalPages(data.totalPages)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cupom?')) {
      return
    }

    const success = await deleteCoupon(id)
    if (success) {
      loadCoupons()
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Cupons</h1>
        <Button asChild>
          <Link href="/admin/cupons/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Cupom
          </Link>
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código..."
            className="flex-1 px-4 py-2 border rounded-md"
          />
          <Button type="submit">Buscar</Button>
        </form>
      </div>

      {/* Lista de Cupons */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm">{coupon.code}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {coupon.type === 'PERCENTAGE' ? 'Porcentagem' : 'Valor Fixo'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {coupon.type === 'PERCENTAGE'
                      ? `${coupon.value}%`
                      : formatCurrency(coupon.value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {coupon.usedCount}
                    {coupon.maxUses && ` / ${coupon.maxUses}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        coupon.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {coupon.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="mr-2"
                    >
                      <Link href={`/admin/cupons/${coupon.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(coupon.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}

              {coupons.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Nenhum cupom encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t">
            <div className="text-sm text-gray-500">
              Página {currentPage} de {totalPages}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
=======
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useCoupons } from '@/hooks/useCoupons'
import { formatCurrency } from '@/utils/format'

interface Coupon {
  id: string
  code: string
  type: 'PERCENTAGE' | 'FIXED'
  value: number
  minValue: number | null
  maxUses: number | null
  usedCount: number
  startDate: string | null
  endDate: string | null
  active: boolean
  createdAt: string
}

export default function CouponsPage() {
  const { fetchCoupons, deleteCoupon } = useCoupons()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadCoupons()
  }, [currentPage, searchTerm])

  async function loadCoupons() {
    try {
      setIsLoading(true)
      const data = await fetchCoupons(currentPage, searchTerm)
      if (data) {
        setCoupons(data.coupons)
        setTotalPages(data.totalPages)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cupom?')) {
      return
    }

    const success = await deleteCoupon(id)
    if (success) {
      loadCoupons()
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Cupons</h1>
        <Button asChild>
          <Link href="/admin/cupons/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Cupom
          </Link>
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código..."
            className="flex-1 px-4 py-2 border rounded-md"
          />
          <Button type="submit">Buscar</Button>
        </form>
      </div>

      {/* Lista de Cupons */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm">{coupon.code}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {coupon.type === 'PERCENTAGE' ? 'Porcentagem' : 'Valor Fixo'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {coupon.type === 'PERCENTAGE'
                      ? `${coupon.value}%`
                      : formatCurrency(coupon.value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {coupon.usedCount}
                    {coupon.maxUses && ` / ${coupon.maxUses}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        coupon.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {coupon.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="mr-2"
                    >
                      <Link href={`/admin/cupons/${coupon.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(coupon.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}

              {coupons.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Nenhum cupom encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t">
            <div className="text-sm text-gray-500">
              Página {currentPage} de {totalPages}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
>>>>>>> Stashed changes
} 