'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Download, UserX } from 'lucide-react'
import { formatDate } from '@/utils/format'

interface Subscriber {
  id: string
  email: string
  name: string | null
  active: boolean
  createdAt: string
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchSubscribers()
  }, [currentPage, searchTerm])

  async function fetchSubscribers() {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/admin/newsletter?${params}`)
      if (!response.ok) {
        throw new Error('Erro ao carregar assinantes')
      }

      const data = await response.json()
      setSubscribers(data.subscribers)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Erro ao carregar assinantes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/newsletter/export')
      if (!response.ok) {
        throw new Error('Erro ao exportar assinantes')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Erro ao exportar assinantes:', error)
      alert('Erro ao exportar assinantes')
    }
  }

  const handleUnsubscribe = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta inscrição?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/newsletter/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao cancelar inscrição')
      }

      setSubscribers(prev =>
        prev.map(sub =>
          sub.id === id ? { ...sub, active: false } : sub
        )
      )
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error)
      alert('Erro ao cancelar inscrição')
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Newsletter</h1>
        <Button
          variant="outline"
          onClick={handleExport}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou email..."
            className="flex-1 px-4 py-2 border rounded-md"
          />
          <Button type="submit">
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </form>
      </div>

      {/* Lista de Assinantes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td className="px-6 py-4">
                    {subscriber.email}
                  </td>
                  <td className="px-6 py-4">
                    {subscriber.name || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subscriber.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {subscriber.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(subscriber.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {subscriber.active && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnsubscribe(subscriber.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <UserX className="w-4 h-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}

              {subscribers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Nenhum assinante encontrado
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
} 