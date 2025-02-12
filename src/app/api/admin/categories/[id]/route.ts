import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/utils/format'

// Obter categoria
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

    const category = await prisma.blogCategory.findUnique({
      where: { id: params.id }
    })

    if (!category) {
      return NextResponse.json(
        { message: 'Categoria não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Erro ao obter categoria:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Atualizar categoria
export async function PATCH(
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

    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json(
        { message: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    const slug = slugify(name)

    // Verificar se já existe outra categoria com o mesmo slug
    const existingCategory = await prisma.blogCategory.findFirst({
      where: {
        slug,
        NOT: { id: params.id }
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { message: 'Já existe uma categoria com este nome' },
        { status: 400 }
      )
    }

    const category = await prisma.blogCategory.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Excluir categoria
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

    // Verificar se existem posts usando esta categoria
    const postsCount = await prisma.post.count({
      where: { categoryId: params.id }
    })

    if (postsCount > 0) {
      return NextResponse.json(
        { message: 'Não é possível excluir uma categoria que possui posts' },
        { status: 400 }
      )
    }

    await prisma.blogCategory.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Categoria excluída com sucesso' }
    )
  } catch (error) {
    console.error('Erro ao excluir categoria:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 