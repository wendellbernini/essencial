'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/utils/format'

interface Post {
  id: string
  title: string
  slug: string
  image: string | null
  createdAt: string
}

interface RelatedPostsProps {
  currentPostId: string
  categoryId?: string | null
}

export function RelatedPosts({ currentPostId, categoryId }: RelatedPostsProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRelatedPosts()
  }, [currentPostId, categoryId])

  async function fetchRelatedPosts() {
    try {
      setIsLoading(true)
      const searchParams = new URLSearchParams({
        exclude: currentPostId,
        ...(categoryId && { category: categoryId }),
        limit: '3',
      })

      const response = await fetch(`/api/blog/related?${searchParams}`)
      if (!response.ok) {
        throw new Error('Erro ao carregar posts relacionados')
      }

      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Erro ao carregar posts relacionados:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse space-y-4">
            <div className="aspect-video bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Posts Relacionados</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map(post => (
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
                <h3 className="font-medium group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
} 