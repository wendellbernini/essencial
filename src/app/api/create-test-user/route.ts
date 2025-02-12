import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Verifica se já existe um usuário com este email
    const existingUser = await prisma.user.findUnique({
      where: { email: 'teste@teste.com' },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Usuário de teste já existe' },
        { status: 200 }
      )
    }

    // Cria o usuário de teste
    const hashedPassword = await bcrypt.hash('123456', 12)
    
    const user = await prisma.user.create({
      data: {
        name: 'Usuário Teste',
        email: 'teste@teste.com',
        password: hashedPassword,
        role: 'USER',
      },
    })

    return NextResponse.json(
      { message: 'Usuário de teste criado com sucesso', user },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao criar usuário de teste:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 