import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/orders/[id] - Obtém um pedido específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        address: true,
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { message: 'Pedido não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Erro ao obter pedido:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/orders/[id] - Atualiza o status de um pedido
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Validação básica
    if (!data.status) {
      return NextResponse.json(
        { message: 'Status é obrigatório' },
        { status: 400 }
      )
    }

    // Verifica se o status é válido
    const validStatus = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    if (!validStatus.includes(data.status)) {
      return NextResponse.json(
        { message: 'Status inválido' },
        { status: 400 }
      )
    }

    // Atualiza o pedido
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: data.status,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // TODO: Enviar email de notificação para o cliente

    return NextResponse.json(order)
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 