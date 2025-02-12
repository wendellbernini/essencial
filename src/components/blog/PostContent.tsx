'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { formatDate } from '@/utils/format'
import { useAuth } from '@/hooks/useAuth'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { RelatedPosts } from '@/components/blog/RelatedPosts'

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
  createdAt: string | Date
}

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    name: string
    image: string | null
  }
  userId: string
}

interface PostContentProps {
  post: Post
}

export function PostContent({ post }: PostContentProps) {
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [post.slug])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/blog/${post.slug}/comments`)
      if (!response.ok) {
        throw new Error('Erro ao carregar comentários')
      }
      const data = await response.json()
      setComments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erro ao carregar comentários:', error)
      setComments([])
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/blog/${post.slug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar comentário')
      }

      const comment = await response.json()
      setComments(prev => [comment, ...prev])
      setNewComment('')
    } catch (error) {
      console.error('Erro ao enviar comentário:', error)
      alert('Erro ao enviar comentário. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) {
      return
    }

    try {
      const response = await fetch(`/api/blog/${post.slug}/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir comentário')
      }

      setComments(prev => prev.filter(comment => comment.id !== commentId))
    } catch (error) {
      console.error('Erro ao excluir comentário:', error)
      alert('Erro ao excluir comentário')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        {/* Voltar */}
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para o Blog
            </Link>
          </Button>
        </div>

        {/* Imagem */}
        {post.image && (
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Conteúdo */}
        <div className="prose prose-lg max-w-none mb-12">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-500">
              {formatDate(post.createdAt)}
            </p>
            <ShareButtons
              url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`}
              title={post.title}
              description={post.content.substring(0, 200)}
            />
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="prose prose-lg max-w-none"
          />
        </div>

        {/* Posts Relacionados */}
        <div className="mt-12 border-t pt-12">
          <RelatedPosts
            currentPostId={post.id}
            categoryId={post.category?.id}
          />
        </div>

        {/* Comentários */}
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold mb-8">Comentários</h2>

          {/* Formulário de Comentário */}
          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escreva seu comentário..."
                rows={3}
                className="w-full px-4 py-2 border rounded-md mb-4"
                required
              />
              <Button type="submit" isLoading={isSubmitting}>
                Enviar Comentário
              </Button>
            </form>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg mb-8">
              <p className="text-gray-600">
                <Link href="/auth/login" className="text-primary hover:underline">
                  Faça login
                </Link>{' '}
                para deixar um comentário.
              </p>
            </div>
          )}

          {/* Lista de Comentários */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-gray-500">
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="shrink-0">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                      {comment.user.image ? (
                        <Image
                          src={comment.user.image}
                          alt={comment.user.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          {comment.user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium">{comment.user.name}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        {(user?.id === comment.userId || user?.role === 'ADMIN') && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Excluir comentário"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </article>
    </div>
  )
} 