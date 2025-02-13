import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Busca produtos
  const products = await prisma.product.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  // Busca categorias
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  // Busca posts do blog
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  // Rotas estáticas
  const staticRoutes = [
    '',
    '/produtos',
    '/categorias',
    '/blog',
    '/sobre',
    '/contato',
    '/favoritos',
    '/carrinho',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Rotas de produtos
  const productRoutes = products.map(product => ({
    url: `${baseUrl}/produtos/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Rotas de categorias
  const categoryRoutes = categories.map(category => ({
    url: `${baseUrl}/categorias/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Rotas do blog
  const blogRoutes = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [
    ...staticRoutes,
    ...productRoutes,
    ...categoryRoutes,
    ...blogRoutes,
  ]
} 