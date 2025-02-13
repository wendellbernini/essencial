'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao se inscrever na newsletter')
      }

      setMessage({
        type: 'success',
        text: 'Inscrição realizada com sucesso! Obrigado por se inscrever.',
      })
      setEmail('')
      setName('')
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erro ao se inscrever na newsletter',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-primary text-white p-8 rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-6 h-6" />
        <h3 className="text-xl font-bold">Inscreva-se na Newsletter</h3>
      </div>
      
      <p className="mb-6">
        Receba as últimas novidades, dicas e tutoriais diretamente no seu email.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome (opcional)"
            className="w-full px-4 py-2 rounded-md bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>

        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor email"
            required
            className="w-full px-4 py-2 rounded-md bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>

        {message && (
          <div
            className={`p-3 rounded ${
              message.type === 'success'
                ? 'bg-green-500/20 text-green-100'
                : 'bg-red-500/20 text-red-100'
            }`}
          >
            {message.text}
          </div>
        )}

        <Button
          type="submit"
          variant="outline"
          className="w-full bg-white text-primary hover:bg-white/90"
          isLoading={isLoading}
        >
          Inscrever-se
        </Button>
      </form>
    </div>
  )
} 