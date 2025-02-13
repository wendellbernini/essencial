'use client'

import { Scale } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useComparison } from '@/hooks/useComparison'
import Link from 'next/link'

export function CompareFloatingButton() {
  const { items } = useComparison()

  if (items.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link href="/comparar">
        <Button className="shadow-lg">
          <Scale className="h-4 w-4 mr-2" />
          Comparar ({items.length})
        </Button>
      </Link>
    </div>
  )
} 