<<<<<<< Updated upstream
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/recommendations/similar - Retorna produtos similares
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const limit = parseInt(searchParams.get('limit') || '6')

    if (!productId) {
      return NextResponse.json(
        { message: 'ID do produto é obrigatório' },
        { status: 400 }
      )
    }

    // Busca o produto base
    const baseProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
      },
    })

    if (!baseProduct) {
      return NextResponse.json(
        { message: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Busca produtos similares
    const similarProducts = await prisma.product.findMany({
      where: {
        OR: [
          // Mesma categoria
          {
            categoryId: baseProduct.categoryId,
          },
          // Mesma marca
          {
            brand: baseProduct.brand,
          },
          // Faixa de preço similar (±30%)
          {
            price: {
              gte: Number(baseProduct.price) * 0.7,
              lte: Number(baseProduct.price) * 1.3,
            },
          },
        ],
        // Exclui o produto atual
        NOT: {
          id: productId,
        },
      },
      include: {
        category: true,
      },
      take: limit * 2, // Busca mais produtos para calcular scores
    })

    // Calcula score para cada produto
    const scoredProducts = similarProducts.map(product => {
      let score = 0
      let reasons: string[] = []

      // Pontuação por categoria
      if (product.categoryId === baseProduct.categoryId) {
        score += 0.4
        reasons.push('Categoria similar')
      }

      // Pontuação por marca
      if (product.brand === baseProduct.brand) {
        score += 0.3
        reasons.push('Mesma marca')
      }

      // Pontuação por preço
      const priceRange = {
        min: Number(baseProduct.price) * 0.7,
        max: Number(baseProduct.price) * 1.3,
      }
      if (
        Number(product.price) >= priceRange.min &&
        Number(product.price) <= priceRange.max
      ) {
        score += 0.3
        reasons.push('Faixa de preço similar')
      }

      return {
        ...product,
        score,
        reason: reasons.join(', '),
      }
    })

    // Ordena por score e retorna os melhores
    const topRecommendations = scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return NextResponse.json({
      recommendations: topRecommendations,
    })
  } catch (error) {
    console.error('Erro ao buscar produtos similares:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
=======
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/recommendations/similar - Retorna produtos similares
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const limit = parseInt(searchParams.get('limit') || '6')

    if (!productId) {
      return NextResponse.json(
        { message: 'ID do produto é obrigatório' },
        { status: 400 }
      )
    }

    // Busca o produto base
    const baseProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
      },
    })

    if (!baseProduct) {
      return NextResponse.json(
        { message: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Busca produtos similares
    const similarProducts = await prisma.product.findMany({
      where: {
        OR: [
          // Mesma categoria
          {
            categoryId: baseProduct.categoryId,
          },
          // Mesma marca
          {
            brand: baseProduct.brand,
          },
          // Faixa de preço similar (±30%)
          {
            price: {
              gte: Number(baseProduct.price) * 0.7,
              lte: Number(baseProduct.price) * 1.3,
            },
          },
        ],
        // Exclui o produto atual
        NOT: {
          id: productId,
        },
      },
      include: {
        category: true,
      },
      take: limit * 2, // Busca mais produtos para calcular scores
    })

    // Calcula score para cada produto
    const scoredProducts = similarProducts.map(product => {
      let score = 0
      let reasons: string[] = []

      // Pontuação por categoria
      if (product.categoryId === baseProduct.categoryId) {
        score += 0.4
        reasons.push('Categoria similar')
      }

      // Pontuação por marca
      if (product.brand === baseProduct.brand) {
        score += 0.3
        reasons.push('Mesma marca')
      }

      // Pontuação por preço
      const priceRange = {
        min: Number(baseProduct.price) * 0.7,
        max: Number(baseProduct.price) * 1.3,
      }
      if (
        Number(product.price) >= priceRange.min &&
        Number(product.price) <= priceRange.max
      ) {
        score += 0.3
        reasons.push('Faixa de preço similar')
      }

      return {
        ...product,
        score,
        reason: reasons.join(', '),
      }
    })

    // Ordena por score e retorna os melhores
    const topRecommendations = scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return NextResponse.json({
      recommendations: topRecommendations,
    })
  } catch (error) {
    console.error('Erro ao buscar produtos similares:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
>>>>>>> Stashed changes
} 