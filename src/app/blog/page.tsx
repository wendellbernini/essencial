'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/utils/format'
import { NewsletterForm } from '@/components/blog/NewsletterForm'

interface Post {
  id: string
  title: string
  slug: string
  content: string
  image: string | null
  category: {
    id: string
    name: string
    slug: string
  } | null
  createdAt: string
}

interface Category {
  id: string
  name: string
  slug: string
  _count: {
    posts: number
  }
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [currentPage, searchTerm, selectedCategory])

  async function fetchCategories() {
    try {
      const response = await fetch('/api/admin/categories')
      if (!response.ok) {
        throw new Error('Erro ao carregar categorias')
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  async function fetchPosts() {
    try {
      setIsLoading(true)
      const searchParams = new URLSearchParams({
        page: currentPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory }),
      })

      const response = await fetch(`/api/blog?${searchParams}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar posts')
      }

      const data = await response.json()
      setPosts(data.posts)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse max-w-6xl mx-auto">
          <div className="h-12 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="space-y-4">
                <div className="aspect-video bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold">Blog</h1>

          {/* Busca e Filtros */}
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar posts..."
                className="px-4 py-2 border rounded-md"
              />
            </form>

            <select
              value={selectedCategory || ''}
              onChange={(e) => {
                setSelectedCategory(e.target.value || null)
                setCurrentPage(1)
              }}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name} ({category._count.posts})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Posts */}
          <div className="lg:col-span-2">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Nenhum post encontrado
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group"
                  >
                    <article className="space-y-4">
                      {/* Imagem */}
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                        {post.image ? (
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Sem imagem
                          </div>
                        )}
                      </div>

                      {/* Conteúdo */}
                      <div>
                        <h2 className="text-xl font-semibold group-hover:text-primary">
                          {post.title}
                        </h2>
                        {post.category && (
                          <span className="inline-block px-2 py-1 mt-2 text-xs font-medium bg-primary/10 text-primary rounded">
                            {post.category.name}
                          </span>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="px-4 py-2">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Newsletter */}
            <NewsletterForm />

            {/* Categorias */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Categorias</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(
                        selectedCategory === category.slug ? null : category.slug
                      )
                      setCurrentPage(1)
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === category.slug
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <span className="text-sm opacity-75">
                        {category._count.posts}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 