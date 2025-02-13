<<<<<<< Updated upstream
'use client'

import { ReactNode } from 'react'
import dynamic from 'next/dynamic'

const LoadingPlaceholder = ({ height }: { height: string }) => (
  <div className="animate-pulse">
    <div className={`${height} bg-gray-200 rounded-lg`}></div>
  </div>
)

export const ProductReviews = dynamic(
  () => import('./ProductReviews').then(mod => mod.ProductReviews),
  {
    loading: () => <LoadingPlaceholder height="h-32" />,
    ssr: false,
  }
)

export const ProductQuestions = dynamic(
  () => import('./ProductQuestions').then(mod => mod.ProductQuestions),
  {
    loading: () => <LoadingPlaceholder height="h-32" />,
    ssr: false,
  }
)

export const BrowsingHistory = dynamic(
  () => import('./BrowsingHistory').then(mod => mod.BrowsingHistory),
  {
    loading: () => <LoadingPlaceholder height="h-64" />,
    ssr: false,
  }
)

export const ProductRecommendations = dynamic(
  () => import('./ProductRecommendations').then(mod => mod.ProductRecommendations),
  {
    loading: () => <LoadingPlaceholder height="h-64" />,
    ssr: false,
  }
=======
'use client'

import { ReactNode } from 'react'
import dynamic from 'next/dynamic'

const LoadingPlaceholder = ({ height }: { height: string }) => (
  <div className="animate-pulse">
    <div className={`${height} bg-gray-200 rounded-lg`}></div>
  </div>
)

export const ProductReviews = dynamic(
  () => import('./ProductReviews').then(mod => mod.ProductReviews),
  {
    loading: () => <LoadingPlaceholder height="h-32" />,
    ssr: false,
  }
)

export const ProductQuestions = dynamic(
  () => import('./ProductQuestions').then(mod => mod.ProductQuestions),
  {
    loading: () => <LoadingPlaceholder height="h-32" />,
    ssr: false,
  }
)

export const BrowsingHistory = dynamic(
  () => import('./BrowsingHistory').then(mod => mod.BrowsingHistory),
  {
    loading: () => <LoadingPlaceholder height="h-64" />,
    ssr: false,
  }
)

export const ProductRecommendations = dynamic(
  () => import('./ProductRecommendations').then(mod => mod.ProductRecommendations),
  {
    loading: () => <LoadingPlaceholder height="h-64" />,
    ssr: false,
  }
>>>>>>> Stashed changes
) 