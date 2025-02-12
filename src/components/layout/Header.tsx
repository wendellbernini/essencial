'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/Button'
import { ShoppingBag, User, Search } from 'lucide-react'

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const { totalQuantity } = useCart()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            Essencial
          </Link>

          {/* Navegação Principal */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/produtos"
              className="text-sm font-medium text-gray-700 hover:text-primary"
            >
              Produtos
            </Link>
            <Link
              href="/categorias"
              className="text-sm font-medium text-gray-700 hover:text-primary"
            >
              Categorias
            </Link>
            <Link
              href="/promocoes"
              className="text-sm font-medium text-gray-700 hover:text-primary"
            >
              Promoções
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-700 hover:text-primary"
            >
              Blog
            </Link>
          </nav>

          {/* Ações do Usuário */}
          <div className="flex items-center gap-4">
            {/* Busca */}
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-primary"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Carrinho */}
            <Link
              href="/carrinho"
              className="p-2 text-gray-500 hover:text-primary relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {/* Menu do Usuário */}
            {isAuthenticated ? (
              <div className="relative group">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-primary flex items-center gap-2"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium hidden md:block">
                    {user?.name}
                  </span>
                </button>
                <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    href="/perfil"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Meu Perfil
                  </Link>
                  <Link
                    href="/pedidos"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Meus Pedidos
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Painel Admin
                    </Link>
                  )}
                  <button
                    onClick={() => logout()}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link href="/auth/login">Entrar</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 