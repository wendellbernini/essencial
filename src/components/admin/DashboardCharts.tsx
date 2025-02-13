"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/admin/Overview";
import { OrderStatusPieChart } from "@/components/admin/OrderStatusPieChart";

interface DashboardChartsProps {
  salesByDay: Array<{
    date: string;
    total: number;
  }>;
  ordersByStatus: Array<{
    name: string;
    value: number;
  }>;
}

export function DashboardCharts({
  salesByDay,
  ordersByStatus,
}: DashboardChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Visão Geral</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <Overview data={salesByDay} />
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Status dos Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderStatusPieChart data={ordersByStatus} />
        </CardContent>
      </Card>
    </div>
  );
}
