import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Wrench } from 'lucide-react'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center px-4">
        <div className="mb-8">
          <Wrench className="w-16 h-16 text-primary mx-auto" />
        </div>

        <h1 className="text-3xl font-bold mb-4">
          Site em Manutenção
        </h1>

        <p className="text-gray-600 mb-8">
          Estamos realizando algumas melhorias em nosso site.
          Por favor, volte em alguns instantes.
        </p>

        <div className="space-y-4">
          <Button asChild>
            <Link href="/auth/login">
              Login Administrativo
            </Link>
          </Button>

          <p className="text-sm text-gray-500">
            Se você é um administrador, faça login para acessar o site.
          </p>
        </div>
      </div>
    </div>
  )
} 