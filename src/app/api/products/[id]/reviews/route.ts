import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/products/[id]/reviews - Lista todas as avaliações de um produto
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: params.id },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Erro ao listar avaliações:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/products/[id]/reviews - Cria uma nova avaliação
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { rating, comment } = await request.json()

    // Validação básica
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: 'Avaliação inválida' },
        { status: 400 }
      )
    }

    // Verifica se o usuário já avaliou este produto
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: params.id,
        userId: session.user.id,
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { message: 'Você já avaliou este produto' },
        { status: 400 }
      )
    }

    // Verifica se o usuário comprou o produto
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: params.id,
        order: {
          userId: session.user.id,
          status: { in: ['DELIVERED'] },
        },
      },
    })

    if (!hasPurchased) {
      return NextResponse.json(
        { message: 'Você precisa comprar o produto para avaliá-lo' },
        { status: 400 }
      )
    }

    // Cria a avaliação
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId: session.user.id,
        productId: params.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar avaliação:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id]/reviews/[reviewId] - Exclui uma avaliação
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; reviewId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const review = await prisma.review.findUnique({
      where: { id: params.reviewId },
    })

    if (!review) {
      return NextResponse.json(
        { message: 'Avaliação não encontrada' },
        { status: 404 }
      )
    }

    // Verifica se o usuário é o autor da avaliação ou um admin
    if (review.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 403 }
      )
    }

    await prisma.review.delete({
      where: { id: params.reviewId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Erro ao excluir avaliação:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 