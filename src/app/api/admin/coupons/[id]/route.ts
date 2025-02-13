import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// GET /api/admin/coupons/[id] - Obtém um cupom específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const coupon = await prisma.coupon.findUnique({
      where: { id: params.id },
    })

    if (!coupon) {
      return NextResponse.json(
        { message: 'Cupom não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(coupon)
  } catch (error) {
    console.error('Erro ao obter cupom:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/coupons/[id] - Atualiza um cupom
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Validação básica
    if (!data.code || !data.type || !data.value) {
      return NextResponse.json(
        { message: 'Dados inválidos' },
        { status: 400 }
      )
    }

    // Verifica se já existe outro cupom com este código
    const existingCoupon = await prisma.coupon.findFirst({
      where: {
        code: data.code.toUpperCase(),
        NOT: { id: params.id },
      },
    })

    if (existingCoupon) {
      return NextResponse.json(
        { message: 'Já existe um cupom com este código' },
        { status: 400 }
      )
    }

    // Atualiza o cupom
    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data: {
        code: data.code.toUpperCase(),
        type: data.type,
        value: new Prisma.Decimal(data.value),
        minValue: data.minValue ? new Prisma.Decimal(data.minValue) : null,
        maxUses: data.maxUses || null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        active: data.active ?? true,
      },
    })

    return NextResponse.json(coupon)
  } catch (error) {
    console.error('Erro ao atualizar cupom:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/coupons/[id] - Exclui um cupom
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    await prisma.coupon.delete({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Erro ao excluir cupom:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 