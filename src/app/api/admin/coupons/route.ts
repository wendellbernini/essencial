<<<<<<< Updated upstream
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// GET /api/admin/coupons - Lista todos os cupons
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')

    // Construir query
    const where: Prisma.CouponWhereInput = {
      ...(search && {
        code: { contains: search, mode: 'insensitive' },
      }),
    }

    // Buscar cupons com paginação
    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.coupon.count({ where }),
    ])

    return NextResponse.json({
      coupons,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error('Erro ao listar cupons:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/admin/coupons - Cria um novo cupom
export async function POST(request: Request) {
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

    // Verifica se já existe um cupom com este código
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: data.code.toUpperCase() },
    })

    if (existingCoupon) {
      return NextResponse.json(
        { message: 'Já existe um cupom com este código' },
        { status: 400 }
      )
    }

    // Cria o cupom
    const coupon = await prisma.coupon.create({
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

    return NextResponse.json(coupon, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar cupom:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
=======
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// GET /api/admin/coupons - Lista todos os cupons
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')

    // Construir query
    const where: Prisma.CouponWhereInput = {
      ...(search && {
        code: { contains: search, mode: 'insensitive' },
      }),
    }

    // Buscar cupons com paginação
    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.coupon.count({ where }),
    ])

    return NextResponse.json({
      coupons,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error('Erro ao listar cupons:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/admin/coupons - Cria um novo cupom
export async function POST(request: Request) {
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

    // Verifica se já existe um cupom com este código
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: data.code.toUpperCase() },
    })

    if (existingCoupon) {
      return NextResponse.json(
        { message: 'Já existe um cupom com este código' },
        { status: 400 }
      )
    }

    // Cria o cupom
    const coupon = await prisma.coupon.create({
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

    return NextResponse.json(coupon, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar cupom:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
>>>>>>> Stashed changes
} 