import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/utils/format'

// GET /api/admin/posts/[id] - Obtém um post específico
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

    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        category: true,
      },
    })

    if (!post) {
      return NextResponse.json(
        { message: 'Post não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Erro ao obter post:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/posts/[id] - Atualiza um post
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

    const { title, content, image, published, categoryId } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { message: 'Título e conteúdo são obrigatórios' },
        { status: 400 }
      )
    }

    const slug = slugify(title)

    // Verificar se já existe outro post com este slug
    const existingPost = await prisma.post.findFirst({
      where: {
        slug,
        NOT: { id: params.id }
      }
    })

    if (existingPost) {
      return NextResponse.json(
        { message: 'Já existe um post com este título' },
        { status: 400 }
      )
    }

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        content,
        image,
        published,
        categoryId,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Erro ao atualizar post:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/posts/[id] - Exclui um post
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

    await prisma.post.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Post excluído com sucesso' }
    )
  } catch (error) {
    console.error('Erro ao excluir post:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 