'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Search, Mail, ShoppingBag, UserX, UserCheck } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  image: string | null
  role: 'USER' | 'ADMIN'
  emailVerified: string | null
  createdAt: string
  _count: {
    orders: number
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchTerm, roleFilter])

  async function fetchUsers() {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter && { role: roleFilter }),
      })

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()

      setUsers(data.users)
      setTotalPages(data.pagination.pages)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchUsers()
  }

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar permissão')
      }

      fetchUsers()
    } catch (error) {
      console.error('Erro ao atualizar permissão:', error)
      alert('Erro ao atualizar permissão do usuário')
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Usuários</h1>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
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
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">Todas as permissões</option>
            <option value="USER">Usuários</option>
            <option value="ADMIN">Administradores</option>
          </select>
        </div>
      </div>

      {/* Lista de Usuários */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Cadastro
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Pedidos
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Permissão
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <ShoppingBag className="w-4 h-4" />
                      {user._count.orders} pedidos
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.emailVerified ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <UserCheck className="w-4 h-4" />
                        <span className="text-sm">Verificado</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <UserX className="w-4 h-4" />
                        <span className="text-sm">Não verificado</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <option value="USER">Usuário</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </td>
                </tr>
              ))}
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
              {[...Array(totalPages)].map((_, i) => (
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
} 