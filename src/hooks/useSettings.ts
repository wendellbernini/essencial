import { useState, useCallback } from 'react'

interface Settings {
  id: string
  siteName: string
  siteDescription: string
  contactEmail: string
  phoneNumber: string
  address: string
  freeShippingThreshold: number
  enableRegistration: boolean
  enableReviews: boolean
  maintenanceMode: boolean
  updatedAt: string
}

export function useSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/admin/settings')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar configurações')
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar configurações')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateSettings = useCallback(async (data: Partial<Settings>) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar configurações')
      }

      const updatedSettings = await response.json()
      return updatedSettings
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar configurações')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    fetchSettings,
    updateSettings,
  }
} 