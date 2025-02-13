"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface OrderStatusPieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = {
  PENDING: "#fbbf24", // yellow
  PROCESSING: "#60a5fa", // blue
  SHIPPED: "#a78bfa", // purple
  DELIVERED: "#34d399", // green
  CANCELLED: "#f87171", // red
};

const statusLabels = {
  PENDING: "Pendente",
  PROCESSING: "Processando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

export function OrderStatusPieChart({ data }: OrderStatusPieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${statusLabels[name as keyof typeof statusLabels]} (${(percent * 100).toFixed(0)}%)`
          }
          outerRadius={100}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[entry.name as keyof typeof COLORS]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
