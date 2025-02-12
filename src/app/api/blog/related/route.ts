import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const exclude = searchParams.get('exclude')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '3')

    // Construir a query
    const where: Prisma.PostWhereInput = {
      published: true,
      ...(exclude && { NOT: { id: exclude } }),
      ...(category && {
        category: {
          slug: category,
        },
      }),
    }

    // Buscar posts relacionados
    const posts = await prisma.post.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Erro ao listar posts relacionados:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 