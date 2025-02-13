import { formatCurrency } from "@/lib/utils";

interface TopProductsProps {
  products: Array<{
    name: string;
    total: number;
    quantity: number;
  }>;
}

export function TopProducts({ products }: TopProductsProps) {
  return (
    <div className="space-y-8">
      {products.map((product) => (
        <div key={product.name} className="flex items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{product.name}</p>
            <p className="text-sm text-muted-foreground">
              {product.quantity} vendas
            </p>
          </div>
          <div className="ml-auto text-sm font-medium">
            {formatCurrency(product.total)}
          </div>
        </div>
      ))}
    </div>
  );
}
