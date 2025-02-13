<<<<<<< Updated upstream
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Trash2 } from 'lucide-react'
import { useHistory } from '@/hooks/useHistory'
import { formatCurrency } from '@/utils/format'

export function BrowsingHistory() {
  const { items, removeItem, clearHistory } = useHistory()

  if (items.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Produtos Visualizados</h2>
          <Button
            variant="outline"
            onClick={clearHistory}
          >
            Limpar Histórico
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map(({ product, viewedAt }) => (
            <div
              key={product.id}
              className="group bg-white rounded-lg shadow overflow-hidden"
            >
              {/* Imagem */}
              <Link
                href={`/produtos/${product.slug}`}
                className="relative aspect-square block"
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    removeItem(product.id)
                  }}
                  className="absolute top-2 right-2 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remover do histórico"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </Link>

              {/* Informações */}
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                <Link
                  href={`/produtos/${product.slug}`}
                  className="font-medium text-gray-900 hover:text-primary line-clamp-2"
                >
                  {product.name}
                </Link>
                <p className="text-lg font-semibold text-primary mt-2">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 
=======
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import { formatCurrency } from "@/utils/format";

export function BrowsingHistory() {
  const { items, removeItem, clearHistory } = useHistory();

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Produtos Visualizados</h2>
          <Button variant="outline" onClick={clearHistory}>
            Limpar Histórico
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map(({ product, viewedAt }) => (
            <div
              key={product.id}
              className="group bg-white rounded-lg shadow overflow-hidden"
            >
              {/* Imagem */}
              <Link
                href={`/produtos/${product.slug}`}
                className="relative aspect-square block"
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeItem(product.id);
                  }}
                  className="absolute top-2 right-2 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remover do histórico"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </Link>

              {/* Informações */}
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                <Link
                  href={`/produtos/${product.slug}`}
                  className="font-medium text-gray-900 hover:text-primary line-clamp-2"
                >
                  {product.name}
                </Link>
                <p className="text-lg font-semibold text-primary mt-2">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
>>>>>>> Stashed changes
