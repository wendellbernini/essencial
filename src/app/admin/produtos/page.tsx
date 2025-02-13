"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ArrowUpDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: {
    name: string;
  };
  brand: string;
  inStock: boolean;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  message?: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [metadata, setMetadata] = useState<
    Omit<ProductsResponse, "products" | "message">
  >({
    total: 0,
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    fetchProducts();
  }, [page]);

  async function fetchProducts() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/products?page=${page}&limit=10`);
      const data: ProductsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao carregar produtos");
      }

      setProducts(data.products || []);
      setMetadata({
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
        hasNextPage: data.hasNextPage,
        hasPrevPage: data.hasPrevPage,
      });
    } catch (error) {
      console.error("Erro ao listar produtos:", error);
      setError("Falha ao carregar produtos");
    } finally {
      setIsLoading(false);
    }
  }

  const toggleProduct = (productId: string) => {
    setSelectedProducts((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  const toggleAllProducts = () => {
    if (!products) return;

    setSelectedProducts((current) =>
      current.length === products.length ? [] : products.map((p) => p.id)
    );
  };

  const handleDeleteSelected = async () => {
    if (!selectedProducts.length) return;

    if (
      !confirm(
        `Tem certeza que deseja excluir ${selectedProducts.length} produto(s)?`
      )
    )
      return;

    try {
      const response = await fetch("/api/admin/products/batch", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedProducts }),
      });

      if (!response.ok) {
        throw new Error("Falha ao excluir produtos");
      }

      toast.success("Produtos excluídos com sucesso!");
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      console.error("Erro ao excluir produtos:", error);
      toast.error("Erro ao excluir produtos");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Button onClick={() => router.push("/admin/produtos/novo")}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Ações em Lote e Busca */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {selectedProducts.length > 0 && (
          <Button
            variant="destructive"
            onClick={handleDeleteSelected}
            className="w-full md:w-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir Selecionados ({selectedProducts.length})
          </Button>
        )}
        <div className="flex-1 flex gap-2">
          <Input
            type="text"
            placeholder="Buscar produtos..."
            className="flex-1"
          />
          <Button>
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={
                      products.length > 0 &&
                      selectedProducts.length === products.length
                    }
                    onCheckedChange={() => toggleAllProducts()}
                  />
                  <button
                    onClick={() => {
                      // Implementar ordenação
                    }}
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    Produto
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </div>
              </th>
              <th className="px-6 py-3 text-left">Categoria</th>
              <th className="px-6 py-3 text-left">Marca</th>
              <th className="px-6 py-3 text-left">Preço</th>
              <th className="px-6 py-3 text-left">Estoque</th>
              <th className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => toggleProduct(product.id)}
                    />
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{product.category.name}</td>
                <td className="px-6 py-4">{product.brand}</td>
                <td className="px-6 py-4">{formatCurrency(product.price)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      product.inStock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.inStock ? "Em estoque" : "Fora de estoque"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        router.push(`/admin/produtos/${product.id}/editar`)
                      }
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        if (
                          confirm(
                            "Tem certeza que deseja excluir este produto?"
                          )
                        ) {
                          // Implementar exclusão
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {metadata.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={!metadata.hasPrevPage}
          >
            Anterior
          </Button>
          {Array.from({ length: metadata.totalPages }).map((_, index) => (
            <Button
              key={index}
              variant={page === index + 1 ? "default" : "outline"}
              onClick={() => setPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={!metadata.hasNextPage}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
