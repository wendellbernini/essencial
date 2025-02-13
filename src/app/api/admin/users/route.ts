import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// GET /api/admin/users - Lista todos os usuários
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
    const role = searchParams.get('role')

    // Construir query
    const where: Prisma.UserWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          { email: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        ],
      }),
      ...(role && { role: role as Prisma.UserRole }),
    }

    // Buscar usuários com paginação
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      users,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error('Erro ao listar usuários:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 