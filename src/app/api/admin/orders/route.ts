import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// GET /api/admin/orders - Lista todos os pedidos
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10
    const search = searchParams.get('search')
    const status = searchParams.get('status')

    // Construir query
    const where: Prisma.OrderWhereInput = {
      ...(search && {
        OR: [
          { id: { contains: search } },
          { user: { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } } },
          { user: { email: { contains: search, mode: 'insensitive' as Prisma.QueryMode } } },
        ],
      }),
      ...(status && { status: status as Prisma.OrderStatus }),
    }

    // Buscar pedidos com paginação
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      orders,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error('Erro ao listar pedidos:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 