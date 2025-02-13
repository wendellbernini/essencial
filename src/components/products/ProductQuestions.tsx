<<<<<<< Updated upstream
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { MessageCircle, Trash2 } from 'lucide-react'
import { useQuestions } from '@/hooks/useQuestions'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/utils/format'

interface ProductQuestionsProps {
  productId: string
}

export function ProductQuestions({ productId }: ProductQuestionsProps) {
  const { user, isAuthenticated } = useAuth()
  const {
    questions,
    isLoading,
    error,
    fetchQuestions,
    addQuestion,
    removeQuestion,
    addAnswer,
    removeAnswer,
  } = useQuestions(productId)

  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswers, setNewAnswers] = useState<{ [key: string]: string }>({})
  const [showAnswerForm, setShowAnswerForm] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestion.trim()) return

    const question = await addQuestion(newQuestion)
    if (question) {
      setNewQuestion('')
    }
  }

  const handleSubmitAnswer = async (questionId: string) => {
    const content = newAnswers[questionId]
    if (!content?.trim()) return

    const answer = await addAnswer(questionId, content)
    if (answer) {
      setNewAnswers(prev => ({ ...prev, [questionId]: '' }))
      setShowAnswerForm(prev => ({ ...prev, [questionId]: false }))
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pergunta?')) {
      return
    }

    await removeQuestion(questionId)
  }

  const handleDeleteAnswer = async (questionId: string, answerId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta resposta?')) {
      return
    }

    await removeAnswer(questionId, answerId)
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Formulário de Nova Pergunta */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitQuestion} className="space-y-4">
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Faça uma pergunta sobre este produto..."
            className="w-full px-4 py-2 border rounded-md resize-none"
            rows={3}
            required
          />
          <Button type="submit">
            Enviar Pergunta
          </Button>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-600">
            Faça login para fazer uma pergunta sobre este produto
          </p>
        </div>
      )}

      {/* Lista de Perguntas */}
      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="bg-white rounded-lg shadow p-6">
            {/* Pergunta */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                {question.user.image ? (
                  <Image
                    src={question.user.image}
                    alt={question.user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 font-medium">
                      {question.user.name[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{question.user.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {formatDate(question.createdAt)}
                    </span>
                  </div>
                  {(user?.id === question.userId || user?.role === 'ADMIN') && (
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Excluir pergunta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="mt-2">{question.content}</p>

                {/* Respostas */}
                <div className="mt-4 space-y-4">
                  {question.answers.map((answer) => (
                    <div key={answer.id} className="pl-8 border-l">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          {answer.user.image ? (
                            <Image
                              src={answer.user.image}
                              alt={answer.user.name}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-500 font-medium">
                                {answer.user.name[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">
                                {answer.user.name}
                                {answer.user.role === 'ADMIN' && (
                                  <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                                    Vendedor
                                  </span>
                                )}
                              </span>
                              <span className="text-sm text-gray-500 ml-2">
                                {formatDate(answer.createdAt)}
                              </span>
                            </div>
                            {(user?.id === answer.userId || user?.role === 'ADMIN') && (
                              <button
                                onClick={() => handleDeleteAnswer(question.id, answer.id)}
                                className="text-red-600 hover:text-red-700"
                                title="Excluir resposta"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <p className="mt-2">{answer.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Formulário de Resposta */}
                {isAuthenticated && (
                  <div className="mt-4">
                    {showAnswerForm[question.id] ? (
                      <div className="space-y-2">
                        <textarea
                          value={newAnswers[question.id] || ''}
                          onChange={(e) =>
                            setNewAnswers(prev => ({
                              ...prev,
                              [question.id]: e.target.value,
                            }))
                          }
                          placeholder="Escreva sua resposta..."
                          className="w-full px-4 py-2 border rounded-md resize-none"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSubmitAnswer(question.id)}
                          >
                            Responder
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowAnswerForm(prev => ({
                                ...prev,
                                [question.id]: false,
                              }))
                              setNewAnswers(prev => ({
                                ...prev,
                                [question.id]: '',
                              }))
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setShowAnswerForm(prev => ({
                            ...prev,
                            [question.id]: true,
                          }))
                        }
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Responder
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              Nenhuma pergunta ainda. Seja o primeiro a perguntar!
            </p>
          </div>
        )}
      </div>
    </div>
  )
=======
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { MessageCircle, Trash2 } from 'lucide-react'
import { useQuestions } from '@/hooks/useQuestions'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/utils/format'

interface ProductQuestionsProps {
  productId: string
}

export function ProductQuestions({ productId }: ProductQuestionsProps) {
  const { user, isAuthenticated } = useAuth()
  const {
    questions,
    isLoading,
    error,
    fetchQuestions,
    addQuestion,
    removeQuestion,
    addAnswer,
    removeAnswer,
  } = useQuestions(productId)

  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswers, setNewAnswers] = useState<{ [key: string]: string }>({})
  const [showAnswerForm, setShowAnswerForm] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestion.trim()) return

    const question = await addQuestion(newQuestion)
    if (question) {
      setNewQuestion('')
    }
  }

  const handleSubmitAnswer = async (questionId: string) => {
    const content = newAnswers[questionId]
    if (!content?.trim()) return

    const answer = await addAnswer(questionId, content)
    if (answer) {
      setNewAnswers(prev => ({ ...prev, [questionId]: '' }))
      setShowAnswerForm(prev => ({ ...prev, [questionId]: false }))
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pergunta?')) {
      return
    }

    await removeQuestion(questionId)
  }

  const handleDeleteAnswer = async (questionId: string, answerId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta resposta?')) {
      return
    }

    await removeAnswer(questionId, answerId)
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Formulário de Nova Pergunta */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitQuestion} className="space-y-4">
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Faça uma pergunta sobre este produto..."
            className="w-full px-4 py-2 border rounded-md resize-none"
            rows={3}
            required
          />
          <Button type="submit">
            Enviar Pergunta
          </Button>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-600">
            Faça login para fazer uma pergunta sobre este produto
          </p>
        </div>
      )}

      {/* Lista de Perguntas */}
      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="bg-white rounded-lg shadow p-6">
            {/* Pergunta */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                {question.user.image ? (
                  <Image
                    src={question.user.image}
                    alt={question.user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 font-medium">
                      {question.user.name[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{question.user.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {formatDate(question.createdAt)}
                    </span>
                  </div>
                  {(user?.id === question.userId || user?.role === 'ADMIN') && (
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Excluir pergunta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="mt-2">{question.content}</p>

                {/* Respostas */}
                <div className="mt-4 space-y-4">
                  {question.answers.map((answer) => (
                    <div key={answer.id} className="pl-8 border-l">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          {answer.user.image ? (
                            <Image
                              src={answer.user.image}
                              alt={answer.user.name}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-500 font-medium">
                                {answer.user.name[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">
                                {answer.user.name}
                                {answer.user.role === 'ADMIN' && (
                                  <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                                    Vendedor
                                  </span>
                                )}
                              </span>
                              <span className="text-sm text-gray-500 ml-2">
                                {formatDate(answer.createdAt)}
                              </span>
                            </div>
                            {(user?.id === answer.userId || user?.role === 'ADMIN') && (
                              <button
                                onClick={() => handleDeleteAnswer(question.id, answer.id)}
                                className="text-red-600 hover:text-red-700"
                                title="Excluir resposta"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <p className="mt-2">{answer.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Formulário de Resposta */}
                {isAuthenticated && (
                  <div className="mt-4">
                    {showAnswerForm[question.id] ? (
                      <div className="space-y-2">
                        <textarea
                          value={newAnswers[question.id] || ''}
                          onChange={(e) =>
                            setNewAnswers(prev => ({
                              ...prev,
                              [question.id]: e.target.value,
                            }))
                          }
                          placeholder="Escreva sua resposta..."
                          className="w-full px-4 py-2 border rounded-md resize-none"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSubmitAnswer(question.id)}
                          >
                            Responder
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowAnswerForm(prev => ({
                                ...prev,
                                [question.id]: false,
                              }))
                              setNewAnswers(prev => ({
                                ...prev,
                                [question.id]: '',
                              }))
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setShowAnswerForm(prev => ({
                            ...prev,
                            [question.id]: true,
                          }))
                        }
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Responder
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              Nenhuma pergunta ainda. Seja o primeiro a perguntar!
            </p>
          </div>
        )}
      </div>
    </div>
  )
>>>>>>> Stashed changes
} 