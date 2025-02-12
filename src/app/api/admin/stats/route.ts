import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Datas para comparação
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Buscar todas as estatísticas em paralelo
    const [
      totalProducts,
      totalUsers,
      ordersToday,
      ordersYesterday,
      usersThisMonth,
      usersLastMonth,
      revenueThisMonth,
      revenueLastMonth,
      salesByDay,
      topProducts,
      ordersByStatus,
      recentOrders
    ] = await Promise.all([
      // Total de produtos
      prisma.product.count(),

      // Total de usuários
      prisma.user.count({
        where: { role: 'USER' }
      }),

      // Pedidos hoje
      prisma.order.count({
        where: {
          createdAt: {
            gte: today,
          }
        }
      }),

      // Pedidos ontem
      prisma.order.count({
        where: {
          createdAt: {
            gte: yesterday,
            lt: today,
          }
        }
      }),

      // Usuários este mês
      prisma.user.count({
        where: {
          role: 'USER',
          createdAt: {
            gte: thisMonth,
            lt: nextMonth,
          }
        }
      }),

      // Usuários mês passado
      prisma.user.count({
        where: {
          role: 'USER',
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          }
        }
      }),

      // Vendas este mês
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: thisMonth,
            lt: nextMonth,
          },
          status: {
            in: ['PROCESSING', 'SHIPPED', 'DELIVERED']
          }
        },
        _sum: {
          total: true
        }
      }),

      // Vendas mês passado
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
          status: {
            in: ['PROCESSING', 'SHIPPED', 'DELIVERED']
          }
        },
        _sum: {
          total: true
        }
      }),

      // Vendas por dia (últimos 30 dias)
      prisma.order.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
          status: {
            in: ['PROCESSING', 'SHIPPED', 'DELIVERED']
          }
        },
        _sum: {
          total: true
        }
      }),

      // Produtos mais vendidos
      prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: {
            createdAt: {
              gte: thisMonth,
            }
          }
        },
        _sum: {
          quantity: true,
          price: true
        },
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        },
        take: 5
      }).then(async (items) => {
        // Buscar nomes dos produtos
        const products = await prisma.product.findMany({
          where: {
            id: {
              in: items.map(item => item.productId)
            }
          }
        })
        return items.map(item => ({
          name: products.find(p => p.id === item.productId)?.name || 'Produto removido',
          quantity: item._sum.quantity || 0,
          total: Number(item._sum.price) || 0
        }))
      }),

      // Status dos pedidos
      prisma.order.groupBy({
        by: ['status'],
        _count: true
      }),

      // Últimos pedidos
      prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      })
    ])

    // Calcular crescimentos
    const ordersGrowth = ordersYesterday === 0
      ? 100
      : ((ordersToday - ordersYesterday) / ordersYesterday) * 100

    const usersGrowth = usersLastMonth === 0
      ? 100
      : ((usersThisMonth - usersLastMonth) / usersLastMonth) * 100

    const revenueGrowth = Number(revenueLastMonth._sum.total || 0) === 0
      ? 100
      : ((Number(revenueThisMonth._sum.total || 0) - Number(revenueLastMonth._sum.total || 0)) / Number(revenueLastMonth._sum.total || 0)) * 100

    // Agrupar vendas por dia
    const salesByDayMap = salesByDay.reduce((acc, sale) => {
      const date = new Date(sale.createdAt).toISOString().split('T')[0]
      acc[date] = Number(sale._sum.total || 0)
      return acc
    }, {} as Record<string, number>)

    // Preencher dias faltantes
    const allDays: Array<{ date: string, total: number }> = []
    for (let d = new Date(thirtyDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
      const date = d.toISOString().split('T')[0]
      allDays.push({
        date,
        total: salesByDayMap[date] || 0
      })
    }

    return NextResponse.json({
      totalProducts,
      totalOrders: ordersToday,
      totalUsers,
      totalRevenue: Number(revenueThisMonth._sum.total || 0),
      comparisons: {
        ordersGrowth: Math.round(ordersGrowth),
        usersGrowth: Math.round(usersGrowth),
        revenueGrowth: Math.round(revenueGrowth),
      },
      salesByDay: allDays,
      topProducts,
      ordersByStatus,
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        total: Number(order.total),
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        user: order.user
      }))
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 