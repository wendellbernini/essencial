import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/blog/[slug]/comments - Lista os comentários de um post
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    })

    if (!post) {
      return NextResponse.json(
        { message: 'Post não encontrado' },
        { status: 404 }
      )
    }

    const comments = await prisma.comment.findMany({
      where: { postId: post.id },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Erro ao listar comentários:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/blog/[slug]/comments - Cria um novo comentário
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    })

    if (!post) {
      return NextResponse.json(
        { message: 'Post não encontrado' },
        { status: 404 }
      )
    }

    const data = await request.json()

    // Validação básica
    if (!data.content?.trim()) {
      return NextResponse.json(
        { message: 'O comentário não pode estar vazio' },
        { status: 400 }
      )
    }

    // Cria o comentário
    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        postId: post.id,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar comentário:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/blog/[slug]/comments/[commentId] - Exclui um comentário
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string; commentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
      select: { userId: true },
    })

    if (!comment) {
      return NextResponse.json(
        { message: 'Comentário não encontrado' },
        { status: 404 }
      )
    }

    // Verifica se o usuário é o autor do comentário ou um admin
    if (comment.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 403 }
      )
    }

    await prisma.comment.delete({
      where: { id: params.commentId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Erro ao excluir comentário:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 