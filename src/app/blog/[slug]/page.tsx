import { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PostContent } from '@/components/blog/PostContent'

interface Post {
  id: string
  title: string
  slug: string
  content: string
  image: string | null
  category: {
    id: string
    name: string
    slug: string
  } | null
  createdAt: string | Date
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug: params.slug,
        published: true,
      },
      include: {
        category: true,
      },
    })

    if (!post) {
      return {
        title: 'Post não encontrado | Blog Essencial',
        description: 'O post que você está procurando não foi encontrado.',
      }
    }

    return {
      title: `${post.title} | Blog Essencial`,
      description: post.content.slice(0, 160),
      openGraph: {
        title: post.title,
        description: post.content.slice(0, 160),
        ...(post.image && {
          images: [{ url: post.image }],
        }),
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.content.slice(0, 160),
        ...(post.image && {
          images: [post.image],
        }),
      },
    }
  } catch (error) {
    console.error('Erro ao gerar metadata:', error)
    return {
      title: 'Blog Essencial',
      description: 'Dicas de beleza, tutoriais e novidades do mundo da cosmetologia',
    }
  }
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: {
      slug,
      published: true,
    },
    include: {
      category: true,
    },
  })

  if (!post) {
    notFound()
  }

  return {
    ...post,
    createdAt: post.createdAt.toISOString(),
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PostContent post={post} />
    </Suspense>
  )
} 