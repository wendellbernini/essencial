import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parâmetros de filtro
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const minPrice = Number(searchParams.get('minPrice')) || 0
    const maxPrice = Number(searchParams.get('maxPrice')) || 1000000
    const search = searchParams.get('search')
    
    // Parâmetros de paginação
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 12
    const skip = (page - 1) * limit
    
    // Parâmetros de ordenação
    const orderBy = searchParams.get('orderBy') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    // Construir query
    const where: Prisma.ProductWhereInput = {
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
      ...(category && { categoryId: category }),
      ...(brand && { brand }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          { description: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        ],
      }),
    }

    // Buscar produtos
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          [orderBy]: order as Prisma.SortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    // Calcular metadata da paginação
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      products,
      metadata: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    })
  } catch (error) {
    console.error('Erro ao listar produtos:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 