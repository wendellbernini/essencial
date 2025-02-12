import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// GET /api/blog - Lista todos os posts publicados
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '9')
    const search = searchParams.get('search')
    const category = searchParams.get('category')

    // Construir a query
    const where: Prisma.PostWhereInput = {
      published: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          { content: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        ],
      }),
      ...(category && {
        category: {
          slug: category,
        },
      }),
    }

    // Buscar posts e total
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      posts,
      totalPages,
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error('Erro ao listar posts:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 