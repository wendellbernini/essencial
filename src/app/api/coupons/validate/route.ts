import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/coupons/validate - Valida um cupom
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { code, total } = await request.json()

    if (!code || !total) {
      return NextResponse.json(
        { message: 'Código do cupom e valor total são obrigatórios' },
        { status: 400 }
      )
    }

    // Busca o cupom
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!coupon) {
      return NextResponse.json(
        { message: 'Cupom não encontrado' },
        { status: 404 }
      )
    }

    // Verifica se o cupom está ativo
    if (!coupon.active) {
      return NextResponse.json(
        { message: 'Cupom inativo' },
        { status: 400 }
      )
    }

    // Verifica se o cupom está dentro do período válido
    const now = new Date()
    if (coupon.startDate && now < coupon.startDate) {
      return NextResponse.json(
        { message: 'Cupom ainda não está válido' },
        { status: 400 }
      )
    }
    if (coupon.endDate && now > coupon.endDate) {
      return NextResponse.json(
        { message: 'Cupom expirado' },
        { status: 400 }
      )
    }

    // Verifica se o cupom atingiu o limite de usos
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json(
        { message: 'Cupom atingiu o limite de usos' },
        { status: 400 }
      )
    }

    // Verifica se atinge o valor mínimo
    if (coupon.minValue && total < Number(coupon.minValue)) {
      return NextResponse.json(
        { message: `Valor mínimo para este cupom é ${coupon.minValue}` },
        { status: 400 }
      )
    }

    // Calcula o desconto
    let discount = 0
    if (coupon.type === 'PERCENTAGE') {
      discount = total * (Number(coupon.value) / 100)
    } else {
      discount = Number(coupon.value)
      if (discount > total) {
        discount = total
      }
    }

    return NextResponse.json({
      coupon,
      discount,
      total: total - discount,
    })
  } catch (error) {
    console.error('Erro ao validar cupom:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 