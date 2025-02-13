import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/recommendations/frequently-bought - Retorna produtos frequentemente comprados juntos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const limit = parseInt(searchParams.get('limit') || '3')

    if (!productId) {
      return NextResponse.json(
        { message: 'ID do produto é obrigatório' },
        { status: 400 }
      )
    }

    // Busca pedidos que contêm o produto
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            productId,
          },
        },
        status: 'DELIVERED', // Considera apenas pedidos entregues
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })

    // Mapeia produtos que foram comprados junto
    const productCounts = new Map<string, number>()
    orders.forEach(order => {
      order.items
        .filter(item => item.productId !== productId) // Exclui o produto atual
        .forEach(item => {
          const count = productCounts.get(item.productId) || 0
          productCounts.set(item.productId, count + 1)
        })
    })

    // Converte para array e ordena por frequência
    const frequentProducts = Array.from(productCounts.entries())
      .sort((a, b) => b[1] - a[1]) // Ordena por contagem
      .slice(0, limit) // Limita ao número solicitado

    if (frequentProducts.length === 0) {
      return NextResponse.json({
        recommendations: [],
      })
    }

    // Busca detalhes dos produtos mais frequentes
    const recommendations = await prisma.product.findMany({
      where: {
        id: {
          in: frequentProducts.map(([id]) => id),
        },
      },
      include: {
        category: true,
      },
    })

    // Adiciona score e reason baseado na frequência
    const scoredRecommendations = recommendations.map(product => {
      const frequency = productCounts.get(product.id) || 0
      const maxFrequency = frequentProducts[0][1]
      const score = frequency / maxFrequency // Normaliza o score entre 0 e 1

      return {
        ...product,
        score,
        reason: `Comprado junto ${frequency} ${
          frequency === 1 ? 'vez' : 'vezes'
        }`,
      }
    })

    // Ordena por score (frequência normalizada)
    scoredRecommendations.sort((a, b) => b.score - a.score)

    return NextResponse.json({
      recommendations: scoredRecommendations,
    })
  } catch (error) {
    console.error('Erro ao buscar produtos frequentemente comprados juntos:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 