'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function OrderPendingPage() {
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
          <Clock className="w-16 h-16 text-yellow-500 mx-auto" />
        </div>

        <h1 className="text-3xl font-bold mb-4">
          Pagamento em processamento
        </h1>

        <p className="text-gray-600 mb-8">
          Seu pedido #{orderId} está aguardando a confirmação do pagamento.
          Assim que o pagamento for confirmado, você receberá um e-mail com os detalhes do pedido.
        </p>

        <div className="space-y-4">
          <Button asChild>
            <Link href="/pedidos">
              Acompanhar Pedido
            </Link>
          </Button>

          <Button
            variant="outline"
            asChild
          >
            <Link href="/produtos">
              Continuar Comprando
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 