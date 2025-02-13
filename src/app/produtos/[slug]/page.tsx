<<<<<<< Updated upstream
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star, Minus, Plus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/utils/format'
import { useCart } from '@/hooks/useCart'
import { useHistory } from '@/hooks/useHistory'
import { ProductReviews } from '@/components/products/ProductReviews'
import { WishlistButton } from '@/components/products/WishlistButton'
import { ProductQuestions } from '@/components/products/ProductQuestions'
import { BrowsingHistory, ProductRecommendations } from '@/components/products/dynamic'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { constructMetadata } from '@/config/seo'
import { JsonLd, generateProductJsonLd, generateBreadcrumbJsonLd } from '@/components/JsonLd'
import { ProductDetails } from '@/components/products/ProductDetails'
import { convertPrismaProduct } from '@/utils/prisma'
import dynamic from 'next/dynamic'

// Importações dinâmicas
const DynamicProductReviews = dynamic(() => import('@/components/products/dynamic').then(mod => mod.ProductReviews), {
  loading: () => <div className="animate-pulse h-32 bg-gray-200 rounded-lg" />
})

const DynamicProductQuestions = dynamic(() => import('@/components/products/dynamic').then(mod => mod.ProductQuestions), {
  loading: () => <div className="animate-pulse h-32 bg-gray-200 rounded-lg" />
})

const DynamicBrowsingHistory = dynamic(() => import('@/components/products/dynamic').then(mod => mod.BrowsingHistory), {
  loading: () => <div className="animate-pulse h-64 bg-gray-200 rounded-lg" />
})

const DynamicProductRecommendations = dynamic(() => import('@/components/products/dynamic').then(mod => mod.ProductRecommendations), {
  loading: () => <div className="animate-pulse h-64 bg-gray-200 rounded-lg" />
})

// Dados mockados para exemplo
const product = {
  id: '1',
  name: 'Batom Matte Vermelho',
  description: 'Um batom de longa duração com acabamento matte perfeito. Sua fórmula rica em pigmentos proporciona cor intensa e uniforme, enquanto hidrata os lábios.',
  price: 49.90,
  rating: 4.5,
  brand: 'MAC',
  stock: 100,
  images: [
    '/images/products/lipstick.jpg',
    '/images/products/lipstick-2.jpg',
    '/images/products/lipstick-3.jpg',
  ],
  details: [
    {
      title: 'Características',
      content: [
        'Acabamento matte',
        'Longa duração',
        'Alta pigmentação',
        'Fórmula hidratante',
      ],
    },
    {
      title: 'Como Usar',
      content: [
        'Aplique diretamente nos lábios',
        'Para maior precisão, use um pincel de lábios',
        'Pode ser usado com lápis labial',
      ],
    },
  ],
}

interface Props {
  params: { slug: string }
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  })

  if (!product) {
    notFound()
  }

  return convertPrismaProduct(product)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug)

  return constructMetadata({
    title: product.name,
    description: product.description,
    image: product.images[0],
    type: 'product',
  })
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug)

  return (
    <>
      {/* Schema.org markup */}
      <JsonLd data={generateProductJsonLd(product)} />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Produtos', url: '/produtos' },
          { name: product.category.name, url: `/categorias/${product.category.slug}` },
          { name: product.name, url: `/produtos/${product.slug}` },
        ])}
      />

      <div className="container mx-auto px-4 py-8">
        <ProductDetails product={product} />

        <div className="mt-16 space-y-16">
          <DynamicProductReviews productId={product.id} />
          <DynamicProductQuestions productId={product.id} />
          <DynamicProductRecommendations 
            productId={product.id}
            title="Produtos Similares"
            type="similar"
          />
          <DynamicBrowsingHistory />
        </div>
      </div>
    </>
  )
=======
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star, Minus, Plus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/format'
import { useCart } from '@/hooks/useCart'
import { useHistory } from '@/hooks/useHistory'
import { ProductReviews } from '@/components/products/ProductReviews'
import { WishlistButton } from '@/components/products/WishlistButton'
import { ProductQuestions } from '@/components/products/ProductQuestions'
import { BrowsingHistory, ProductRecommendations } from '@/components/products/dynamic'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { constructMetadata } from '@/config/seo'
import { JsonLd, generateProductJsonLd, generateBreadcrumbJsonLd } from '@/components/JsonLd'
import { ProductDetails } from '@/components/products/ProductDetails'
import { convertPrismaProduct } from '@/utils/prisma'
import dynamic from 'next/dynamic'

// Importações dinâmicas
const DynamicProductReviews = dynamic(() => import('@/components/products/dynamic').then(mod => mod.ProductReviews), {
  loading: () => <div className="animate-pulse h-32 bg-gray-200 rounded-lg" />
})

const DynamicProductQuestions = dynamic(() => import('@/components/products/dynamic').then(mod => mod.ProductQuestions), {
  loading: () => <div className="animate-pulse h-32 bg-gray-200 rounded-lg" />
})

const DynamicBrowsingHistory = dynamic(() => import('@/components/products/dynamic').then(mod => mod.BrowsingHistory), {
  loading: () => <div className="animate-pulse h-64 bg-gray-200 rounded-lg" />
})

const DynamicProductRecommendations = dynamic(() => import('@/components/products/dynamic').then(mod => mod.ProductRecommendations), {
  loading: () => <div className="animate-pulse h-64 bg-gray-200 rounded-lg" />
})

// Dados mockados para exemplo
const product = {
  id: '1',
  name: 'Batom Matte Vermelho',
  description: 'Um batom de longa duração com acabamento matte perfeito. Sua fórmula rica em pigmentos proporciona cor intensa e uniforme, enquanto hidrata os lábios.',
  price: 49.90,
  rating: 4.5,
  brand: 'MAC',
  stock: 100,
  images: [
    '/images/products/lipstick.jpg',
    '/images/products/lipstick-2.jpg',
    '/images/products/lipstick-3.jpg',
  ],
  details: [
    {
      title: 'Características',
      content: [
        'Acabamento matte',
        'Longa duração',
        'Alta pigmentação',
        'Fórmula hidratante',
      ],
    },
    {
      title: 'Como Usar',
      content: [
        'Aplique diretamente nos lábios',
        'Para maior precisão, use um pincel de lábios',
        'Pode ser usado com lápis labial',
      ],
    },
  ],
}

interface Props {
  params: { slug: string }
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  })

  if (!product) {
    notFound()
  }

  return convertPrismaProduct(product)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug)

  return constructMetadata({
    title: product.name,
    description: product.description,
    image: product.images[0],
    type: 'product',
  })
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug)

  return (
    <>
      {/* Schema.org markup */}
      <JsonLd data={generateProductJsonLd(product)} />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Produtos', url: '/produtos' },
          { name: product.category.name, url: `/categorias/${product.category.slug}` },
          { name: product.name, url: `/produtos/${product.slug}` },
        ])}
      />

      <div className="container mx-auto px-4 py-8">
        <ProductDetails product={product} />

        <div className="mt-16 space-y-16">
          <DynamicProductReviews productId={product.id} />
          <DynamicProductQuestions productId={product.id} />
          <DynamicProductRecommendations 
            productId={product.id}
            title="Produtos Similares"
            type="similar"
          />
          <DynamicBrowsingHistory />
        </div>
      </div>
    </>
  )
>>>>>>> Stashed changes
} 