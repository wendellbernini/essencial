import { Metadata } from "next";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { DashboardShell } from "@/components/admin/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentOrders } from "@/components/admin/RecentOrders";
import { TopProducts } from "@/components/admin/TopProducts";
import { formatCurrency } from "@/lib/utils";
import { DashboardCharts } from "@/components/admin/DashboardCharts";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Painel administrativo da loja",
};

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string;
    total: number;
    status: string;
    createdAt: string;
    user: {
      name: string;
    };
  }>;
  salesByDay: Array<{
    date: string;
    total: number;
  }>;
  topProducts: Array<{
    name: string;
    total: number;
    quantity: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
  }>;
  comparisons: {
    ordersGrowth: number;
    revenueGrowth: number;
    usersGrowth: number;
  };
}

interface OrderStatusResponse {
  status: string;
  count: number;
}

interface PieChartData {
  name: string;
  value: number;
}

export default async function AdminPage() {
  const response = await fetch("http://localhost:3000/api/admin/stats", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Falha ao carregar estatísticas");
  }

  const stats: DashboardStats = await response.json();

  const pieChartData: PieChartData[] =
    stats?.ordersByStatus?.map((item: OrderStatusResponse) => ({
      name: item.status,
      value: item.count,
    })) || [];

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Visão geral da sua loja" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Produtos
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M2 12h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalProducts || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.comparisons?.ordersGrowth > 0 ? "+" : ""}
              {stats?.comparisons?.ordersGrowth || 0}% desde ontem
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.comparisons?.usersGrowth > 0 ? "+" : ""}
              {stats?.comparisons?.usersGrowth || 0}% desde ontem
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.comparisons?.revenueGrowth > 0 ? "+" : ""}
              {stats?.comparisons?.revenueGrowth || 0}% desde ontem
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.comparisons?.revenueGrowth > 0 ? "+" : ""}
              {stats?.comparisons?.revenueGrowth || 0}% desde ontem
            </p>
          </CardContent>
        </Card>
      </div>

      <DashboardCharts
        salesByDay={stats?.salesByDay || []}
        ordersByStatus={pieChartData}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Últimos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders orders={stats?.recentOrders || []} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <TopProducts products={stats?.topProducts || []} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
