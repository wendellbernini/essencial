import dynamic from 'next/dynamic'

export const ProductReviews = dynamic(
  () => import('./ProductReviews').then(mod => mod.ProductReviews),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    ),
  }
)

export const ProductQuestions = dynamic(
  () => import('./ProductQuestions').then(mod => mod.ProductQuestions),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    ),
  }
)

export const BrowsingHistory = dynamic(
  () => import('./BrowsingHistory').then(mod => mod.BrowsingHistory),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    ),
  }
)

export const ProductRecommendations = dynamic(
  () => import('./ProductRecommendations').then(mod => mod.ProductRecommendations),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    ),
  }
) 