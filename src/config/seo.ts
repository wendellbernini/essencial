export const siteConfig = {
  name: 'Essencial',
  description: 'Os melhores produtos de beleza você encontra aqui',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/images/og-image.jpg',
  links: {
    instagram: 'https://instagram.com/essencial',
    facebook: 'https://facebook.com/essencial',
  },
}

export type SeoProps = {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  robots?: string
  keywords?: string[]
}

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  url = siteConfig.url,
  type = 'website',
  robots = 'index, follow',
  keywords = [
    'cosméticos',
    'beleza',
    'maquiagem',
    'skincare',
    'perfumes',
    'produtos de beleza',
  ],
}: SeoProps = {}) {
  return {
    title: title === siteConfig.name ? title : `${title} | ${siteConfig.name}`,
    description,
    openGraph: {
      title: title === siteConfig.name ? title : `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'pt_BR',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots,
    keywords,
    alternates: {
      canonical: url,
    },
    metadataBase: new URL(siteConfig.url),
  }
} 