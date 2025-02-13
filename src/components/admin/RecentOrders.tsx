import { formatCurrency } from "@/lib/utils";

interface RecentOrdersProps {
  orders: Array<{
    id: string;
    total: number;
    status: string;
    createdAt: string;
    user: {
      name: string;
    };
  }>;
}

const statusLabels = {
  PENDING: "Pendente",
  PROCESSING: "Processando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {order.user.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div className="ml-auto font-medium">
            <p className="text-sm">{formatCurrency(order.total)}</p>
            <p className="text-sm text-muted-foreground">
              {statusLabels[order.status as keyof typeof statusLabels]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
