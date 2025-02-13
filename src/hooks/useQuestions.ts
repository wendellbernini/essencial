<<<<<<< Updated upstream
import { useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface User {
  name: string
  image: string | null
  role?: 'USER' | 'ADMIN'
}

interface Answer {
  id: string
  content: string
  createdAt: string
  user: User
  userId: string
}

interface Question {
  id: string
  content: string
  createdAt: string
  user: User
  userId: string
  answers: Answer[]
}

export function useQuestions(productId: string) {
  const { isAuthenticated } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/products/${productId}/questions`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar perguntas')
      }

      const data = await response.json()
      setQuestions(data)
    } catch (err) {
      console.error('Erro ao carregar perguntas:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar perguntas')
    } finally {
      setIsLoading(false)
    }
  }, [productId])

  const addQuestion = useCallback(async (content: string) => {
    if (!isAuthenticated) return null

    try {
      setError(null)
      const response = await fetch(`/api/products/${productId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao enviar pergunta')
      }

      setQuestions(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Erro ao enviar pergunta:', err)
      setError(err instanceof Error ? err.message : 'Erro ao enviar pergunta')
      return null
    }
  }, [isAuthenticated, productId])

  const removeQuestion = useCallback(async (questionId: string) => {
    if (!isAuthenticated) return false

    try {
      setError(null)
      const response = await fetch(
        `/api/products/${productId}/questions/${questionId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao excluir pergunta')
      }

      setQuestions(prev => prev.filter(question => question.id !== questionId))
      return true
    } catch (err) {
      console.error('Erro ao excluir pergunta:', err)
      setError(err instanceof Error ? err.message : 'Erro ao excluir pergunta')
      return false
    }
  }, [isAuthenticated, productId])

  const addAnswer = useCallback(async (questionId: string, content: string) => {
    if (!isAuthenticated) return null

    try {
      setError(null)
      const response = await fetch(
        `/api/products/${productId}/questions/${questionId}/answers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        }
      )

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao enviar resposta')
      }

      setQuestions(prev =>
        prev.map(question =>
          question.id === questionId
            ? { ...question, answers: [...question.answers, data] }
            : question
        )
      )
      return data
    } catch (err) {
      console.error('Erro ao enviar resposta:', err)
      setError(err instanceof Error ? err.message : 'Erro ao enviar resposta')
      return null
    }
  }, [isAuthenticated, productId])

  const removeAnswer = useCallback(async (questionId: string, answerId: string) => {
    if (!isAuthenticated) return false

    try {
      setError(null)
      const response = await fetch(
        `/api/products/${productId}/questions/${questionId}/answers/${answerId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao excluir resposta')
      }

      setQuestions(prev =>
        prev.map(question =>
          question.id === questionId
            ? {
                ...question,
                answers: question.answers.filter(answer => answer.id !== answerId),
              }
            : question
        )
      )
      return true
    } catch (err) {
      console.error('Erro ao excluir resposta:', err)
      setError(err instanceof Error ? err.message : 'Erro ao excluir resposta')
      return false
    }
  }, [isAuthenticated, productId])

  return {
    questions,
    isLoading,
    error,
    fetchQuestions,
    addQuestion,
    removeQuestion,
    addAnswer,
    removeAnswer,
  }
=======
import { useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface User {
  name: string
  image: string | null
  role?: 'USER' | 'ADMIN'
}

interface Answer {
  id: string
  content: string
  createdAt: string
  user: User
  userId: string
}

interface Question {
  id: string
  content: string
  createdAt: string
  user: User
  userId: string
  answers: Answer[]
}

export function useQuestions(productId: string) {
  const { isAuthenticated } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/products/${productId}/questions`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar perguntas')
      }

      const data = await response.json()
      setQuestions(data)
    } catch (err) {
      console.error('Erro ao carregar perguntas:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar perguntas')
    } finally {
      setIsLoading(false)
    }
  }, [productId])

  const addQuestion = useCallback(async (content: string) => {
    if (!isAuthenticated) return null

    try {
      setError(null)
      const response = await fetch(`/api/products/${productId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao enviar pergunta')
      }

      setQuestions(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Erro ao enviar pergunta:', err)
      setError(err instanceof Error ? err.message : 'Erro ao enviar pergunta')
      return null
    }
  }, [isAuthenticated, productId])

  const removeQuestion = useCallback(async (questionId: string) => {
    if (!isAuthenticated) return false

    try {
      setError(null)
      const response = await fetch(
        `/api/products/${productId}/questions/${questionId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao excluir pergunta')
      }

      setQuestions(prev => prev.filter(question => question.id !== questionId))
      return true
    } catch (err) {
      console.error('Erro ao excluir pergunta:', err)
      setError(err instanceof Error ? err.message : 'Erro ao excluir pergunta')
      return false
    }
  }, [isAuthenticated, productId])

  const addAnswer = useCallback(async (questionId: string, content: string) => {
    if (!isAuthenticated) return null

    try {
      setError(null)
      const response = await fetch(
        `/api/products/${productId}/questions/${questionId}/answers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        }
      )

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao enviar resposta')
      }

      setQuestions(prev =>
        prev.map(question =>
          question.id === questionId
            ? { ...question, answers: [...question.answers, data] }
            : question
        )
      )
      return data
    } catch (err) {
      console.error('Erro ao enviar resposta:', err)
      setError(err instanceof Error ? err.message : 'Erro ao enviar resposta')
      return null
    }
  }, [isAuthenticated, productId])

  const removeAnswer = useCallback(async (questionId: string, answerId: string) => {
    if (!isAuthenticated) return false

    try {
      setError(null)
      const response = await fetch(
        `/api/products/${productId}/questions/${questionId}/answers/${answerId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao excluir resposta')
      }

      setQuestions(prev =>
        prev.map(question =>
          question.id === questionId
            ? {
                ...question,
                answers: question.answers.filter(answer => answer.id !== answerId),
              }
            : question
        )
      )
      return true
    } catch (err) {
      console.error('Erro ao excluir resposta:', err)
      setError(err instanceof Error ? err.message : 'Erro ao excluir resposta')
      return false
    }
  }, [isAuthenticated, productId])

  return {
    questions,
    isLoading,
    error,
    fetchQuestions,
    addQuestion,
    removeQuestion,
    addAnswer,
    removeAnswer,
  }
>>>>>>> Stashed changes
} 