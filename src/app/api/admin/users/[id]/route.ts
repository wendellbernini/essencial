import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/users/[id] - Obtém um usuário específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Erro ao obter usuário:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/users/[id] - Atualiza as permissões de um usuário
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Validação básica
    if (!data.role) {
      return NextResponse.json(
        { message: 'Permissão é obrigatória' },
        { status: 400 }
      )
    }

    // Verifica se a permissão é válida
    const validRoles = ['USER', 'ADMIN']
    if (!validRoles.includes(data.role)) {
      return NextResponse.json(
        { message: 'Permissão inválida' },
        { status: 400 }
      )
    }

    // Não permite que um admin remova sua própria permissão
    if (params.id === session.user.id && data.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Você não pode remover sua própria permissão de administrador' },
        { status: 400 }
      )
    }

    // Atualiza o usuário
    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        role: data.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 