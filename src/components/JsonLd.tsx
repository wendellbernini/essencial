<<<<<<< Updated upstream
'use client'

interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function generateProductJsonLd(product: {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  brand: string
  stock: number
  slug: string
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    productID: product.id,
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/produtos/${product.slug}`,
      priceCurrency: 'BRL',
      price: product.price,
      availability: product.stock > 0 
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  }
}

export function generateOrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Essencial',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    sameAs: [
      'https://instagram.com/essencial',
      'https://facebook.com/essencial',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+55-11-99999-9999',
      contactType: 'customer service',
      areaServed: 'BR',
      availableLanguage: 'Portuguese',
    },
  }
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
=======
'use client'

interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function generateProductJsonLd(product: {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  brand: string
  stock: number
  slug: string
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    productID: product.id,
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/produtos/${product.slug}`,
      priceCurrency: 'BRL',
      price: product.price,
      availability: product.stock > 0 
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  }
}

export function generateOrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Essencial',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    sameAs: [
      'https://instagram.com/essencial',
      'https://facebook.com/essencial',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+55-11-99999-9999',
      contactType: 'customer service',
      areaServed: 'BR',
      availableLanguage: 'Portuguese',
    },
  }
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
>>>>>>> Stashed changes
} 