import Image from 'next/image'
import Link from 'next/link'

const categories = [
  {
    id: 1,
    name: 'Maquiagem',
    image: '/images/categories/makeup.jpg',
    link: '/categorias/maquiagem',
    description: 'Produtos para realçar sua beleza',
  },
  {
    id: 2,
    name: 'Skincare',
    image: '/images/categories/skincare.jpg',
    link: '/categorias/skincare',
    description: 'Cuidados essenciais para sua pele',
  },
  {
    id: 3,
    name: 'Cabelos',
    image: '/images/categories/hair.jpg',
    link: '/categorias/cabelos',
    description: 'Tratamentos e finalizadores',
  },
  {
    id: 4,
    name: 'Perfumes',
    image: '/images/categories/perfume.jpg',
    link: '/categorias/perfumes',
    description: 'Fragrâncias nacionais e importadas',
  },
]

export function FeaturedCategories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Categorias em Destaque
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.link}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="aspect-square relative">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-white/90">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
} 