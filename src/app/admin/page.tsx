import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react'

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Produtos</p>
              <p className="text-2xl font-bold">120</p>
            </div>
            <Package className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pedidos Hoje</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Clientes</p>
              <p className="text-2xl font-bold">1.234</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Vendas do Mês</p>
              <p className="text-2xl font-bold">R$ 12.345</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Últimos Pedidos */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Últimos Pedidos</h2>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-4">ID</th>
                <th className="pb-4">Cliente</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Data</th>
                <th className="pb-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-t">
                <td className="py-4">#1234</td>
                <td className="py-4">João Silva</td>
                <td className="py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    Entregue
                  </span>
                </td>
                <td className="py-4">12/02/2024</td>
                <td className="py-4 text-right">R$ 299,90</td>
              </tr>
              {/* Adicionar mais linhas conforme necessário */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 