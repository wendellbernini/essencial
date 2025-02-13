import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/recommendations - Retorna recomendações baseadas no histórico
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '6')
    const exclude = searchParams.get('exclude')
    const history = searchParams.get('history')?.split(',') || []

    // Se não houver histórico, retorna produtos populares
    if (history.length === 0) {
      const popularProducts = await prisma.product.findMany({
        where: {
          ...(exclude && { NOT: { id: exclude } }),
        },
        orderBy: {
          orderItems: {
            _count: 'desc',
          },
        },
        take: limit,
        include: {
          category: true,
        },
      })

      return NextResponse.json({
        recommendations: popularProducts.map(product => ({
          ...product,
          score: 1,
          reason: 'Produtos mais vendidos',
        })),
      })
    }

    // Busca os produtos do histórico para análise
    const historyProducts = await prisma.product.findMany({
      where: {
        id: {
          in: history,
        },
      },
      include: {
        category: true,
      },
    })

    // Extrai características comuns
    const categories = new Set(historyProducts.map(p => p.categoryId))
    const brands = new Set(historyProducts.map(p => p.brand))
    const avgPrice =
      historyProducts.reduce((acc, p) => acc + Number(p.price), 0) /
      historyProducts.length
    const priceRange = {
      min: avgPrice * 0.7, // 30% menor que a média
      max: avgPrice * 1.3, // 30% maior que a média
    }

    // Busca produtos similares
    const recommendations = await prisma.product.findMany({
      where: {
        OR: [
          // Mesma categoria
          {
            categoryId: {
              in: Array.from(categories),
            },
          },
          // Mesma marca
          {
            brand: {
              in: Array.from(brands),
            },
          },
          // Faixa de preço similar
          {
            price: {
              gte: priceRange.min,
              lte: priceRange.max,
            },
          },
        ],
        // Exclui produtos já vistos e o produto atual
        NOT: {
          id: {
            in: [...history, ...(exclude ? [exclude] : [])],
          },
        },
      },
      include: {
        category: true,
      },
      take: limit * 2, // Busca mais produtos para calcular scores
    })

    // Calcula score para cada produto
    const scoredProducts = recommendations.map(product => {
      let score = 0
      let reasons: string[] = []

      // Pontuação por categoria
      if (categories.has(product.categoryId)) {
        score += 0.4
        reasons.push('Categoria similar')
      }

      // Pontuação por marca
      if (brands.has(product.brand)) {
        score += 0.3
        reasons.push('Mesma marca')
      }

      // Pontuação por preço
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
    console.error('Erro ao gerar recomendações:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 