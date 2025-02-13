import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Dados mockados para exemplo
    const mockStats = {
      totalProducts: 150,
      totalOrders: 25,
      totalUsers: 500,
      totalRevenue: 15000,
      recentOrders: [
        {
          id: "1",
          total: 299.9,
          status: "PENDING",
          createdAt: new Date().toISOString(),
          user: {
            name: "João Silva",
          },
        },
      ],
      salesByDay: [
        {
          date: new Date().toISOString(),
          total: 1500,
        },
        {
          date: new Date(Date.now() - 86400000).toISOString(), // Ontem
          total: 2000,
        },
        {
          date: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
          total: 1800,
        },
      ],
      topProducts: [
        {
          name: "Batom Matte",
          total: 1500,
          quantity: 50,
        },
      ],
      ordersByStatus: [
        { status: "PENDING", count: 10 },
        { status: "PROCESSING", count: 5 },
        { status: "SHIPPED", count: 3 },
        { status: "DELIVERED", count: 15 },
        { status: "CANCELLED", count: 2 },
      ],
      comparisons: {
        ordersGrowth: 15,
        revenueGrowth: 25,
        usersGrowth: 10,
      },
    };

    return NextResponse.json(mockStats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}
