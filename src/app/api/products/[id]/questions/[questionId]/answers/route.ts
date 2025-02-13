<<<<<<< Updated upstream
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/products/[id]/questions/[questionId]/answers - Cria uma nova resposta
export async function POST(
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

    const { content } = await request.json()

    // Validação básica
    if (!content?.trim()) {
      return NextResponse.json(
        { message: 'A resposta não pode estar vazia' },
        { status: 400 }
      )
    }

    // Verifica se a pergunta existe
    const question = await prisma.question.findUnique({
      where: { id: params.questionId },
    })

    if (!question) {
      return NextResponse.json(
        { message: 'Pergunta não encontrada' },
        { status: 404 }
      )
    }

    // Cria a resposta
    const answer = await prisma.answer.create({
      data: {
        content,
        userId: session.user.id,
        questionId: params.questionId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json(answer, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar resposta:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id]/questions/[questionId]/answers/[answerId] - Exclui uma resposta
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; questionId: string; answerId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const answer = await prisma.answer.findUnique({
      where: { id: params.answerId },
    })

    if (!answer) {
      return NextResponse.json(
        { message: 'Resposta não encontrada' },
        { status: 404 }
      )
    }

    // Verifica se o usuário é o autor da resposta ou um admin
    if (answer.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 403 }
      )
    }

    await prisma.answer.delete({
      where: { id: params.answerId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Erro ao excluir resposta:', error)
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

// POST /api/products/[id]/questions/[questionId]/answers - Cria uma nova resposta
export async function POST(
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

    const { content } = await request.json()

    // Validação básica
    if (!content?.trim()) {
      return NextResponse.json(
        { message: 'A resposta não pode estar vazia' },
        { status: 400 }
      )
    }

    // Verifica se a pergunta existe
    const question = await prisma.question.findUnique({
      where: { id: params.questionId },
    })

    if (!question) {
      return NextResponse.json(
        { message: 'Pergunta não encontrada' },
        { status: 404 }
      )
    }

    // Cria a resposta
    const answer = await prisma.answer.create({
      data: {
        content,
        userId: session.user.id,
        questionId: params.questionId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json(answer, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar resposta:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id]/questions/[questionId]/answers/[answerId] - Exclui uma resposta
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; questionId: string; answerId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const answer = await prisma.answer.findUnique({
      where: { id: params.answerId },
    })

    if (!answer) {
      return NextResponse.json(
        { message: 'Resposta não encontrada' },
        { status: 404 }
      )
    }

    // Verifica se o usuário é o autor da resposta ou um admin
    if (answer.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 403 }
      )
    }

    await prisma.answer.delete({
      where: { id: params.answerId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Erro ao excluir resposta:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
>>>>>>> Stashed changes
} 