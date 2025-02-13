'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const banners = [
  {
    id: 1,
    title: 'Novidades em Maquiagem',
    description: 'Descubra as últimas tendências em produtos de beleza',
    image: '/images/banners/maquiagem.jpg',
    link: '/categorias/maquiagem',
  },
  {
    id: 2,
    title: 'Cuidados com a Pele',
    description: 'Produtos especiais para sua rotina de skincare',
    image: '/images/banners/skincare.jpg',
    link: '/categorias/skincare',
  },
  {
    id: 3,
    title: 'Fragrâncias Exclusivas',
    description: 'Encontre seu perfume ideal com preços especiais',
    image: '/images/banners/perfumes.jpg',
    link: '/categorias/perfumes',
  },
]

export function HeroBanner() {
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }

  return (
    <div className="relative h-[500px] overflow-hidden">
      {/* Banners */}
      <div
        className="flex transition-transform duration-500 h-full"
        style={{ transform: `translateX(-${currentBanner * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="min-w-full relative h-full"
          >
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {banner.title}
              </h2>
              <p className="text-lg md:text-xl mb-8 max-w-2xl">
                {banner.description}
              </p>
              <Link
                href={banner.link}
                className="bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/90 transition-colors"
              >
                Explorar
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Controles */}
      <button
        onClick={prevBanner}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 text-white hover:bg-white/50 transition-colors"
        aria-label="Banner anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextBanner}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 text-white hover:bg-white/50 transition-colors"
        aria-label="Próximo banner"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentBanner ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Ir para banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
} 