"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, SlidersHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import { useProducts } from "@/hooks/useProducts";

// Dados mockados para exemplo
const products = [
  {
    id: "1",
    name: "Batom Matte Vermelho",
    slug: "batom-matte-vermelho",
    price: 49.9,
    rating: 4.5,
    brand: "MAC",
    image: "/images/products/batom.jpg",
  },
  // Adicionar mais produtos conforme necessário
];

const categories = [
  { id: "1", name: "Maquiagem", slug: "maquiagem" },
  { id: "2", name: "Skincare", slug: "skincare" },
  { id: "3", name: "Cabelos", slug: "cabelos" },
  { id: "4", name: "Perfumes", slug: "perfumes" },
];

const brands = [
  "MAC",
  "Lancôme",
  "La Roche-Posay",
  "Carolina Herrera",
  "Clinique",
  "Dior",
  "Estée Lauder",
  "Shiseido",
];

const sortOptions = [
  { label: "Mais recentes", value: "createdAt:desc" },
  { label: "Mais antigos", value: "createdAt:asc" },
  { label: "Menor preço", value: "price:asc" },
  { label: "Maior preço", value: "price:desc" },
  { label: "A-Z", value: "name:asc" },
  { label: "Z-A", value: "name:desc" },
];

export default function ProductsPage() {
  // Estados
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt:desc");
  const [page, setPage] = useState(1);

  // Hook de produtos
  const { products, metadata, isLoading, error, fetchProducts } = useProducts();

  // Efeito para buscar produtos quando os filtros mudarem
  useEffect(() => {
    const [orderBy, order] = sort.split(":");

    fetchProducts({
      category:
        selectedCategories.length > 0 ? selectedCategories[0] : undefined,
      brand: selectedBrands.length > 0 ? selectedBrands[0] : undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      search: search || undefined,
      orderBy,
      order: order as "asc" | "desc",
      page,
      limit: 12,
    });
  }, [
    fetchProducts,
    selectedCategories,
    selectedBrands,
    priceRange,
    search,
    sort,
    page,
  ]);

  // Handlers
  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
    setPage(1); // Reset página ao mudar filtro
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setPage(1); // Reset página ao mudar filtro
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset página ao buscar
  };

  const handleSort = (value: string) => {
    setSort(value);
    setPage(1); // Reset página ao ordenar
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Barra de Busca e Ordenação */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produtos..."
            className="flex-1 px-4 py-2 border rounded-md"
          />
          <Button type="submit">
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </form>

        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-8">
        {/* Sidebar com Filtros */}
        <aside
          className={`w-64 shrink-0 ${showFilters ? "block" : "hidden"} md:block`}
        >
          <div className="space-y-6">
            {/* Categorias */}
            <div>
              <h3 className="font-semibold mb-3">Categorias</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.slug)}
                      onChange={() => toggleCategory(category.slug)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Marcas */}
            <div>
              <h3 className="font-semibold mb-3">Marcas</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Preço */}
            <div>
              <h3 className="font-semibold mb-3">Preço</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Mínimo</label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="w-full"
                  />
                  <span className="text-sm">
                    {formatCurrency(priceRange[0])}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Máximo</label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-full"
                  />
                  <span className="text-sm">
                    {formatCurrency(priceRange[1])}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Grid de Produtos */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-500">
              Nenhum produto encontrado
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/produtos/${product.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {product.brand}
                      </p>
                      <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-lg font-semibold text-gray-900 mt-2">
                        {formatCurrency(Number(product.price))}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Paginação */}
              {metadata && metadata.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={!metadata.hasPrevPage}
                  >
                    Anterior
                  </Button>
                  {Array.from({ length: metadata.totalPages }).map(
                    (_, index) => (
                      <Button
                        key={index}
                        variant={page === index + 1 ? "primary" : "outline"}
                        onClick={() => setPage(index + 1)}
                      >
                        {index + 1}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={!metadata.hasNextPage}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
