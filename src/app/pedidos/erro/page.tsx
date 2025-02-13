'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OrderErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')
  const orderId = searchParams.get('external_reference')

  if (!paymentId || !status || !orderId) {
    router.push('/')
    return null
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
        </div>

        <h1 className="text-3xl font-bold mb-4">
          Erro no pagamento
        </h1>

        <p className="text-gray-600 mb-8">
          Infelizmente houve um erro ao processar o pagamento do seu pedido #{orderId}.
          Por favor, tente novamente ou entre em contato com nosso suporte.
        </p>

        <div className="space-y-4">
          <Button asChild>
            <Link href="/carrinho">
              Tentar Novamente
            </Link>
          </Button>

          <Button
            variant="outline"
            asChild
          >
            <Link href="/contato">
              Contatar Suporte
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 