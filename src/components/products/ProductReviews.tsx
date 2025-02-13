'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Star, Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/utils/format'

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: {
    name: string
    image: string | null
  }
  userId: string
}

interface ProductReviewsProps {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { user, isAuthenticated } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`)
      if (!response.ok) {
        throw new Error('Erro ao carregar avaliações')
      }
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error)
      setReviews([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao enviar avaliação')
      }

      setReviews(prev => [data, ...prev])
      setNewReview({ rating: 5, comment: '' })
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error)
      setError(error instanceof Error ? error.message : 'Erro ao enviar avaliação')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta avaliação?')) {
      return
    }

    try {
      const response = await fetch(
        `/api/products/${productId}/reviews/${reviewId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao excluir avaliação')
      }

      setReviews(prev => prev.filter(review => review.id !== reviewId))
    } catch (error) {
      console.error('Erro ao excluir avaliação:', error)
      alert('Erro ao excluir avaliação')
    }
  }

  const averageRating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0

  return (
    <div>
      {/* Resumo */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 ${
                star <= Math.round(averageRating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <div>
          <span className="font-medium">{averageRating.toFixed(1)}</span>
          <span className="text-gray-500 ml-1">
            ({reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'})
          </span>
        </div>
      </div>

      {/* Formulário de Avaliação */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="space-y-4">
            {/* Estrelas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sua avaliação
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setNewReview((prev) => ({ ...prev, rating: star }))
                    }
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newReview.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comentário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seu comentário
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview((prev) => ({ ...prev, comment: e.target.value }))
                }
                rows={3}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={isSubmitting}>
              Enviar Avaliação
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <p className="text-gray-600">
            <Link href="/auth/login" className="text-primary hover:underline">
              Faça login
            </Link>{' '}
            para avaliar este produto.
          </p>
        </div>
      )}

      {/* Lista de Avaliações */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500">
            Nenhuma avaliação ainda. Seja o primeiro a avaliar!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="flex gap-4">
              <div className="shrink-0">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                  {review.user.image ? (
                    <Image
                      src={review.user.image}
                      alt={review.user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      {review.user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.user.name}</span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    {(user?.id === review.userId || user?.role === 'ADMIN') && (
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Excluir avaliação"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 