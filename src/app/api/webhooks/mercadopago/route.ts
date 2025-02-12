import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPaymentById } from '@/lib/mercadopago'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Verifica se é uma notificação de pagamento
    if (data.type !== 'payment') {
      return new NextResponse(null, { status: 200 })
    }

    // Busca informações do pagamento
    const payment = await getPaymentById(data.data.id)
    const orderId = payment.body.external_reference

    if (!orderId) {
      throw new Error('ID do pedido não encontrado')
    }

    // Atualiza o status do pedido
    let orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

    switch (payment.body.status) {
      case 'approved':
        orderStatus = 'PROCESSING'
        break
      case 'pending':
        orderStatus = 'PENDING'
        break
      case 'rejected':
        orderStatus = 'CANCELLED'
        break
      default:
        orderStatus = 'PENDING'
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: orderStatus,
        paymentIntent: payment.body.id.toString(),
      },
    })

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return NextResponse.json(
      { message: 'Erro ao processar notificação' },
      { status: 500 }
    )
  }
} 