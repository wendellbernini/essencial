import { HeroBanner } from '@/components/home/HeroBanner'
import { FeaturedCategories } from '@/components/home/FeaturedCategories'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { Newsletter } from '@/components/home/Newsletter'

export default function Home() {
  return (
    <>
      <HeroBanner />
      <FeaturedCategories />
      <FeaturedProducts />
      <Newsletter />
    </>
  )
}
