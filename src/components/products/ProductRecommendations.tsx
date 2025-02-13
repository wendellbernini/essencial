"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRecommendations } from "@/hooks/useRecommendations";
import { formatCurrency } from "@/utils/format";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  brand: string;
  reason?: string;
}

interface ProductRecommendationsProps {
  productId?: string;
  title?: string;
  type?: "general" | "similar" | "frequently-bought";
  limit?: number;
}

export function ProductRecommendations({
  productId,
  title = "Recomendados para Você",
  type = "general",
  limit = 6,
}: ProductRecommendationsProps) {
  const {
    getRecommendations,
    getSimilarProducts,
    getFrequentlyBoughtTogether,
    isLoading,
    error,
  } = useRecommendations();

  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    loadRecommendations();
  }, [productId, type]);

  async function loadRecommendations() {
    let data: Product[] = [];

    switch (type) {
      case "similar":
        if (productId) {
          data = await getSimilarProducts(productId, limit);
        }
        break;
      case "frequently-bought":
        if (productId) {
          data = await getFrequentlyBoughtTogether(productId, limit);
        }
        break;
      default:
        data = await getRecommendations(productId, limit);
    }

    setRecommendations(data);
  }

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">{title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-8">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {recommendations.map((product) => (
            <Link
              key={product.id}
              href={`/produtos/${product.slug}`}
              className="group"
            >
              <div className="aspect-square relative rounded-lg overflow-hidden mb-4">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                <h3 className="font-medium text-gray-900 group-hover:text-primary line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-lg font-semibold text-primary mt-2">
                  {formatCurrency(product.price)}
                </p>
                <p className="text-sm text-gray-500 mt-1">{product.reason}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
