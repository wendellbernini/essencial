import { HeroBanner } from '@/components/home/HeroBanner'
import { FeaturedCategories } from '@/components/home/FeaturedCategories'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { Newsletter } from '@/components/home/Newsletter'
import { BrowsingHistory } from '@/components/products/BrowsingHistory'
import { ProductRecommendations } from '@/components/products/ProductRecommendations'

export default function Home() {
  return (
    <>
      <HeroBanner />
      <FeaturedCategories />
      <FeaturedProducts />
      <ProductRecommendations />
      <BrowsingHistory />
      <Newsletter />
    </>
  )
}
