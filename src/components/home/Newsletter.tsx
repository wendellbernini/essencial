'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      // TODO: Implementar integração com API de newsletter
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulando delay
      setStatus('success')
      setMessage('Obrigado por se inscrever!')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage('Ocorreu um erro. Tente novamente.')
    }
  }

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <Mail className="h-12 w-12 mx-auto mb-4 text-white" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Fique por dentro das novidades
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Assine nossa newsletter e receba ofertas exclusivas, dicas de beleza e
            lançamentos em primeira mão.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                required
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-white/90 focus:ring-2 focus:ring-white/50 disabled:opacity-50"
              >
                {status === 'loading' ? 'Enviando...' : 'Assinar'}
              </button>
            </div>
            {message && (
              <p
                className={`mt-4 text-sm ${
                  status === 'success' ? 'text-white' : 'text-red-200'
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
} 