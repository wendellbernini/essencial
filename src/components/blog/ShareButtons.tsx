'use client'

import { Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description || '')

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      alert('Link copiado para a área de transferência!')
    } catch (error) {
      console.error('Erro ao copiar link:', error)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Compartilhar:</span>
      
      {/* Facebook */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(shareLinks.facebook, '_blank')}
        title="Compartilhar no Facebook"
      >
        <Facebook className="w-4 h-4" />
      </Button>

      {/* Twitter */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(shareLinks.twitter, '_blank')}
        title="Compartilhar no Twitter"
      >
        <Twitter className="w-4 h-4" />
      </Button>

      {/* LinkedIn */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(shareLinks.linkedin, '_blank')}
        title="Compartilhar no LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </Button>

      {/* Copiar Link */}
      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        title="Copiar link"
      >
        <LinkIcon className="w-4 h-4" />
      </Button>
    </div>
  )
} 