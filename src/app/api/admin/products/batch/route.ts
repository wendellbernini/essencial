import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { ids } = await request.json()

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: 'IDs inválidos' },
        { status: 400 }
      )
    }

    // Exclui os produtos
    await prisma.product.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Erro ao excluir produtos:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 