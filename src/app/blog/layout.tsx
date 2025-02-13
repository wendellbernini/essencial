import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Essencial',
  description: 'Dicas de beleza, tutoriais e novidades do mundo da cosmetologia',
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 