import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/blog/[slug] - Obtém um post específico
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug: params.slug,
        published: true,
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