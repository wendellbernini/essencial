import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await prisma.user.update({
      where: { email: 'berniniwendell13@gmail.com' },
      data: { role: 'ADMIN' },
    })

    return NextResponse.json(
      { message: 'Usuário atualizado para ADMIN com sucesso', user },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 