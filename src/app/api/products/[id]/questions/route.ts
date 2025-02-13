<<<<<<< Updated upstream
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/products/[id]/questions - Lista todas as perguntas de um produto
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const questions = await prisma.question.findMany({
      where: { productId: params.id },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        answers: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Erro ao listar perguntas:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/products/[id]/questions - Cria uma nova pergunta
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

    const { content } = await request.json()

    // Validação básica
    if (!content?.trim()) {
      return NextResponse.json(
        { message: 'A pergunta não pode estar vazia' },
        { status: 400 }
      )
    }

    // Verifica se o produto existe
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json(
        { message: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Cria a pergunta
    const question = await prisma.question.create({
      data: {
        content,
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

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar pergunta:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id]/questions/[questionId] - Exclui uma pergunta
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; questionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const question = await prisma.question.findUnique({
      where: { id: params.questionId },
    })

    if (!question) {
      return NextResponse.json(
        { message: 'Pergunta não encontrada' },
        { status: 404 }
      )
    }

    // Verifica se o usuário é o autor da pergunta ou um admin
    if (question.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 403 }
      )
    }

    await prisma.question.delete({
      where: { id: params.questionId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Erro ao excluir pergunta:', error)
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

// GET /api/products/[id]/questions - Lista todas as perguntas de um produto
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const questions = await prisma.question.findMany({
      where: { productId: params.id },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        answers: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Erro ao listar perguntas:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/products/[id]/questions - Cria uma nova pergunta
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

    const { content } = await request.json()

    // Validação básica
    if (!content?.trim()) {
      return NextResponse.json(
        { message: 'A pergunta não pode estar vazia' },
        { status: 400 }
      )
    }

    // Verifica se o produto existe
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json(
        { message: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Cria a pergunta
    const question = await prisma.question.create({
      data: {
        content,
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

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar pergunta:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id]/questions/[questionId] - Exclui uma pergunta
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; questionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const question = await prisma.question.findUnique({
      where: { id: params.questionId },
    })

    if (!question) {
      return NextResponse.json(
        { message: 'Pergunta não encontrada' },
        { status: 404 }
      )
    }

    // Verifica se o usuário é o autor da pergunta ou um admin
    if (question.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 403 }
      )
    }

    await prisma.question.delete({
      where: { id: params.questionId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Erro ao excluir pergunta:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
>>>>>>> Stashed changes
} 