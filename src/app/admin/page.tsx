'use client'

import { useState, useEffect } from 'react'
import { Package, ShoppingBag, Users, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react'
import { formatCurrency } from '@/utils/format'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  recentOrders: Array<{
    id: string
    total: number
    status: string
    createdAt: string
    user: {
      name: string
    }
  }>
  salesByDay: Array<{
    date: string
    total: number
  }>
  topProducts: Array<{
    name: string
    total: number
    quantity: number
  }>
  ordersByStatus: Array<{
    status: string
    count: number
  }>
  comparisons: {
    ordersGrowth: number
    revenueGrowth: number
    usersGrowth: number
  }
}

interface OrderStatusResponse {
  status: string
  count: number
}

interface PieChartData {
  name: string
  value: number
  color: string
}

interface PieChartLabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  name: string
}

const COLORS = {
  PENDING: '#fbbf24', // yellow
  PROCESSING: '#60a5fa', // blue
  SHIPPED: '#a78bfa', // purple
  DELIVERED: '#34d399', // green
  CANCELLED: '#f87171', // red
}

const statusLabels = {
  PENDING: 'Pendente',
  PROCESSING: 'Processando',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !stats) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-96 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  // Formatar dados para o gráfico de linha
  const chartData = stats?.salesByDay.map(day => ({
    date: new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    total: day.total,
  }))

  // Formatar dados para o gráfico de pizza
  const pieData = stats?.ordersByStatus.map((status: OrderStatusResponse) => ({
    name: statusLabels[status.status as keyof typeof statusLabels],
    value: status.count,
    color: COLORS[status.status as keyof typeof COLORS],
  }))

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Total de Produtos</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
            <Package className="w-8 h-8 text-primary" />
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-gray-500">Últimos 30 dias</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Pedidos Hoje</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-primary" />
          </div>
          <div className="flex items-center gap-1 text-sm">
            {stats.comparisons.ordersGrowth >= 0 ? (
              <>
                <ArrowUp className="w-4 h-4 text-green-500" />
                <span className="text-green-600">
                  +{stats.comparisons.ordersGrowth}%
                </span>
              </>
            ) : (
              <>
                <ArrowDown className="w-4 h-4 text-red-500" />
                <span className="text-red-600">
                  {stats.comparisons.ordersGrowth}%
                </span>
              </>
            )}
            <span className="text-gray-500">vs. ontem</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Total de Clientes</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
          <div className="flex items-center gap-1 text-sm">
            {stats.comparisons.usersGrowth >= 0 ? (
              <>
                <ArrowUp className="w-4 h-4 text-green-500" />
                <span className="text-green-600">
                  +{stats.comparisons.usersGrowth}%
                </span>
              </>
            ) : (
              <>
                <ArrowDown className="w-4 h-4 text-red-500" />
                <span className="text-red-600">
                  {stats.comparisons.usersGrowth}%
                </span>
              </>
            )}
            <span className="text-gray-500">vs. mês anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Vendas do Mês</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <div className="flex items-center gap-1 text-sm">
            {stats.comparisons.revenueGrowth >= 0 ? (
              <>
                <ArrowUp className="w-4 h-4 text-green-500" />
                <span className="text-green-600">
                  +{stats.comparisons.revenueGrowth}%
                </span>
              </>
            ) : (
              <>
                <ArrowDown className="w-4 h-4 text-red-500" />
                <span className="text-red-600">
                  {stats.comparisons.revenueGrowth}%
                </span>
              </>
            )}
            <span className="text-gray-500">vs. mês anterior</span>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Vendas por Dia */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Vendas por Dia</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Total']}
                  labelFormatter={(label: string) => `Data: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status dos Pedidos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Status dos Pedidos</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: PieChartLabelProps) => {
                    const {
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                      name,
                    } = props

                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                      >
                        {`${name} ${(percent * 100).toFixed(0)}%`}
                      </text>
                    )
                  }}
                  outerRadius={100}
                  dataKey="value"
                >
                  {pieData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} pedidos`, 'Total']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Produtos Mais Vendidos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Produtos Mais Vendidos</h2>
          <div className="space-y-4">
            {stats.topProducts.map((product) => (
              <div key={product.name} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.quantity} vendas</p>
                </div>
                <p className="font-medium">{formatCurrency(product.total)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Últimos Pedidos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Últimos Pedidos</h2>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">#{order.id}</p>
                  <p className="text-sm text-gray-500">{order.user.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(order.total)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 