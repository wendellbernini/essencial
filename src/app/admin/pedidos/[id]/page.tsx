'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { formatCurrency } from '@/utils/format'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    name: string
    images: string[]
  }
}

interface Order {
  id: string
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  total: number
  createdAt: string
  user: {
    name: string
    email: string
  }
  address: {
    street: string
    number: string
    complement: string | null
    district: string
    city: string
    state: string
    zipCode: string
  } | null
  items: OrderItem[]
}

const statusMap = {
  PENDING: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700' },
  PROCESSING: { label: 'Processando', color: 'bg-blue-100 text-blue-700' },
  SHIPPED: { label: 'Enviado', color: 'bg-purple-100 text-purple-700' },
  DELIVERED: { label: 'Entregue', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-700' },
}

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const { id } = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [])

  async function fetchOrder() {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/orders/${id}`)
      const data = await response.json()
      setOrder(data)
    } catch (error) {
      console.error('Erro ao carregar pedido:', error)
      router.push('/admin/pedidos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar status')
      }

      fetchOrder()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status do pedido')
    }
  }

  if (isLoading || !order) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">
          Pedido #{order.id}
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Informações do Pedido */}
        <div className="md:col-span-2 space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Status do Pedido</h2>
            <div className="flex items-center justify-between">
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value as Order['status'])}
                className={`px-4 py-2 rounded-full text-sm font-medium ${statusMap[order.status].color}`}
              >
                {Object.entries(statusMap).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString('pt-BR')}
              </span>
            </div>
          </div>

          {/* Itens */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Itens do Pedido</h2>
            </div>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex gap-4">
                  <div className="relative w-20 aspect-square shrink-0">
                    <Image
                      src={item.product.images[0] || '/images/placeholder.jpg'}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">
                      Quantidade: {item.quantity}
                    </p>
                    <p className="text-sm font-medium">
                      {formatCurrency(item.price)} cada
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-gray-50 flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="text-xl font-bold">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cliente */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Cliente</h2>
            <div className="space-y-2">
              <p className="font-medium">{order.user.name}</p>
              <p className="text-sm text-gray-500">{order.user.email}</p>
            </div>
          </div>

          {/* Endereço de Entrega */}
          {order.address && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Endereço de Entrega</h2>
              <div className="space-y-2 text-sm">
                <p>
                  {order.address.street}, {order.address.number}
                  {order.address.complement && ` - ${order.address.complement}`}
                </p>
                <p>{order.address.district}</p>
                <p>
                  {order.address.city} - {order.address.state}
                </p>
                <p>CEP: {order.address.zipCode}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 