import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    // Verifica se o email está cadastrado
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (!subscriber) {
      return NextResponse.json(
        { message: 'Email não encontrado na lista de assinantes' },
        { status: 404 }
      )
    }

    // Desativa o assinante
    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: { active: false },
    })

    return NextResponse.json({
      message: 'Inscrição cancelada com sucesso!',
    })
  } catch (error) {
    console.error('Erro ao cancelar inscrição:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 