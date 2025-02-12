import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createPreference } from '@/lib/mercadopago'

export async function POST(request: Request) {
  try {
    // Verifica autenticação
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Recebe os dados do carrinho
    const data = await request.json()
    const { items } = data

    if (!items?.length) {
      return NextResponse.json(
        { message: 'Carrinho vazio' },
        { status: 400 }
      )
    }

    // Busca o endereço padrão do usuário
    const defaultAddress = await prisma.address.findFirst({
      where: {
        userId: session.user.id,
        isDefault: true,
      },
    })

    // Cria o pedido no banco
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        addressId: defaultAddress?.id || '', // Temporário: permitir pedido sem endereço
        status: 'PENDING',
        total: items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0),
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    // Cria a preferência no Mercado Pago
    const preference = await createPreference({
      items: items.map((item: any) => ({
        id: item.id,
        title: item.name,
        description: `${item.name} - Quantidade: ${item.quantity}`,
        picture_url: item.image,
        quantity: item.quantity,
        unit_price: item.price,
      })),
      payer: {
        email: session.user.email,
        name: session.user.name,
      },
      external_reference: order.id,
    })

    return NextResponse.json({
      orderId: order.id,
      preferenceId: preference.body.id,
    })
  } catch (error) {
    console.error('Erro ao criar checkout:', error)
    return NextResponse.json(
      { message: 'Erro ao processar pedido' },
      { status: 500 }
    )
  }
} 