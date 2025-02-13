<<<<<<< Updated upstream
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/auth/',
        '/carrinho/',
        '/checkout/',
        '/perfil/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
=======
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/auth/',
        '/carrinho/',
        '/checkout/',
        '/perfil/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
>>>>>>> Stashed changes
} 