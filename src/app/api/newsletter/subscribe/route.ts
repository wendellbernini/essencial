import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    // Verifica se o email já está cadastrado
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (existingSubscriber) {
      // Se o assinante estiver inativo, reativa
      if (!existingSubscriber.active) {
        await prisma.newsletterSubscriber.update({
          where: { id: existingSubscriber.id },
          data: { active: true },
        })

        return NextResponse.json({
          message: 'Inscrição reativada com sucesso!',
        })
      }

      return NextResponse.json(
        { message: 'Este email já está inscrito na newsletter' },
        { status: 400 }
      )
    }

    // Cria novo assinante
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        name,
      },
    })

    // TODO: Enviar email de boas-vindas

    return NextResponse.json({
      message: 'Inscrição realizada com sucesso!',
      subscriber,
    })
  } catch (error) {
    console.error('Erro ao processar inscrição:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 