'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingBag, 
  Users, 
  Settings,
  LogOut
} from 'lucide-react'

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
  },
  {
    title: 'Produtos',
    icon: Package,
    href: '/admin/produtos',
  },
  {
    title: 'Categorias',
    icon: Tags,
    href: '/admin/categorias',
  },
  {
    title: 'Pedidos',
    icon: ShoppingBag,
    href: '/admin/pedidos',
  },
  {
    title: 'Usuários',
    icon: Users,
    href: '/admin/usuarios',
  },
  {
    title: 'Configurações',
    icon: Settings,
    href: '/admin/configuracoes',
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()

  // Aguarda o carregamento da sessão
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Redireciona se não estiver autenticado ou não for admin
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    router.replace('/auth/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <Link href="/admin" className="text-2xl font-bold text-primary">
              Essencial Admin
            </Link>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-md hover:bg-gray-50 hover:text-primary transition-colors"
              >
                <item.icon className="w-5 h-5" />
                {item.title}
              </Link>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={() => logout()}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
} 