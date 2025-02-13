import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/newsletter/[id] - Obtém um assinante específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id: params.id },
    })

    if (!subscriber) {
      return NextResponse.json(
        { message: 'Assinante não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(subscriber)
  } catch (error) {
    console.error('Erro ao obter assinante:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/newsletter/[id] - Cancela a inscrição de um assinante
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verifica se o assinante existe
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id: params.id },
    })

    if (!subscriber) {
      return NextResponse.json(
        { message: 'Assinante não encontrado' },
        { status: 404 }
      )
    }

    // Desativa o assinante
    await prisma.newsletterSubscriber.update({
      where: { id: params.id },
      data: { active: false },
    })

    return NextResponse.json({
      message: 'Inscrição cancelada com sucesso',
    })
  } catch (error) {
    console.error('Erro ao cancelar inscrição:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 