'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()
  const { login, loginWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const result = await login(email, password)
      if (!result?.error) {
        router.push('/')
      } else {
        setError('Email ou senha inválidos')
      }
    } catch (error) {
      setError('Ocorreu um erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Entre na sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link
              href="/auth/register"
              className="font-medium text-primary hover:text-primary/90"
            >
              crie uma conta gratuita
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Senha"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Lembrar-me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/auth/forgot-password"
                className="font-medium text-primary hover:text-primary/90"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
            >
              Entrar
            </Button>

            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => loginWithGoogle()}
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.367,1.722-1.478,3.153-3.076,3.938 C13.713,18.773,12.141,19.012,10.545,18.737c-2.731-0.469-4.918-2.692-5.336-5.434c-0.532-3.497,1.875-6.636,5.283-6.95 c1.641-0.151,3.201,0.437,4.364,1.533c0.286,0.27,0.734,0.261,1.011-0.019l2.468-2.468c0.292-0.292,0.284-0.764-0.018-1.045 c-2.087-1.936-4.895-3.067-7.852-2.892C4.027,2.214,0.365,6.177,0.079,11.538c-0.346,6.489,4.733,11.971,11.216,11.971 c2.934,0,5.621-1.172,7.567-3.072c1.912-1.867,3.011-4.439,3.011-7.167v-1.909c0-0.706-0.573-1.279-1.279-1.279h-8.049"></path>
              </svg>
              Continuar com Google
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 