<<<<<<< Updated upstream
import { useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface Coupon {
  id: string
  code: string
  type: 'PERCENTAGE' | 'FIXED'
  value: number
  minValue: number | null
  maxUses: number | null
  usedCount: number
  startDate: string | null
  endDate: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

interface CouponValidation {
  coupon: Coupon
  discount: number
  total: number
}

export function useCoupons() {
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateCoupon = useCallback(async (code: string, total: number) => {
    if (!isAuthenticated) return null

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, total }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao validar cupom')
      }

      return data as CouponValidation
    } catch (err) {
      console.error('Erro ao validar cupom:', err)
      setError(err instanceof Error ? err.message : 'Erro ao validar cupom')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const fetchCoupons = useCallback(async (page = 1, search?: string) => {
    if (!isAuthenticated) return null

    try {
      setIsLoading(true)
      setError(null)
      const params = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
      })

      const response = await fetch(`/api/admin/coupons?${params}`)
      if (!response.ok) {
        throw new Error('Erro ao carregar cupons')
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error('Erro ao carregar cupons:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar cupons')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const getCoupon = useCallback(async (id: string) => {
    if (!isAuthenticated) return null

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/coupons/${id}`)
      if (!response.ok) {
        throw new Error('Erro ao carregar cupom')
      }

      const data = await response.json()
      return data as Coupon
    } catch (err) {
      console.error('Erro ao carregar cupom:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar cupom')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const createCoupon = useCallback(async (data: Partial<Coupon>) => {
    if (!isAuthenticated) return null

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()
      if (!response.ok) {
        throw new Error(responseData.message || 'Erro ao criar cupom')
      }

      return responseData as Coupon
    } catch (err) {
      console.error('Erro ao criar cupom:', err)
      setError(err instanceof Error ? err.message : 'Erro ao criar cupom')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const updateCoupon = useCallback(async (id: string, data: Partial<Coupon>) => {
    if (!isAuthenticated) return null

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()
      if (!response.ok) {
        throw new Error(responseData.message || 'Erro ao atualizar cupom')
      }

      return responseData as Coupon
    } catch (err) {
      console.error('Erro ao atualizar cupom:', err)
      setError(err instanceof Error ? err.message : 'Erro ao atualizar cupom')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const deleteCoupon = useCallback(async (id: string) => {
    if (!isAuthenticated) return false

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir cupom')
      }

      return true
    } catch (err) {
      console.error('Erro ao excluir cupom:', err)
      setError(err instanceof Error ? err.message : 'Erro ao excluir cupom')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  return {
    isLoading,
    error,
    validateCoupon,
    fetchCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
  }
=======
import { useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface Coupon {
  id: string
  code: string
  type: 'PERCENTAGE' | 'FIXED'
  value: number
  minValue: number | null
  maxUses: number | null
  usedCount: number
  startDate: string | null
  endDate: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

interface CouponValidation {
  coupon: Coupon
  discount: number
  total: number
}

export function useCoupons() {
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateCoupon = useCallback(async (code: string, total: number) => {
    if (!isAuthenticated) return null

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, total }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao validar cupom')
      }

      return data as CouponValidation
    } catch (err) {
      console.error('Erro ao validar cupom:', err)
      setError(err instanceof Error ? err.message : 'Erro ao validar cupom')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const fetchCoupons = useCallback(async (page = 1, search?: string) => {
    if (!isAuthenticated) return null

    try {
      setIsLoading(true)
      setError(null)
      const params = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
      })

      const response = await fetch(`/api/admin/coupons?${params}`)
      if (!response.ok) {
        throw new Error('Erro ao carregar cupons')
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error('Erro ao carregar cupons:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar cupons')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const getCoupon = useCallback(async (id: string) => {
    if (!isAuthenticated) return null

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/coupons/${id}`)
      if (!response.ok) {
        throw new Error('Erro ao carregar cupom')
      }

      const data = await response.json()
      return data as Coupon
    } catch (err) {
      console.error('Erro ao carregar cupom:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar cupom')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const createCoupon = useCallback(async (data: Partial<Coupon>) => {
    if (!isAuthenticated) return null

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()
      if (!response.ok) {
        throw new Error(responseData.message || 'Erro ao criar cupom')
      }

      return responseData as Coupon
    } catch (err) {
      console.error('Erro ao criar cupom:', err)
      setError(err instanceof Error ? err.message : 'Erro ao criar cupom')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const updateCoupon = useCallback(async (id: string, data: Partial<Coupon>) => {
    if (!isAuthenticated) return null

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()
      if (!response.ok) {
        throw new Error(responseData.message || 'Erro ao atualizar cupom')
      }

      return responseData as Coupon
    } catch (err) {
      console.error('Erro ao atualizar cupom:', err)
      setError(err instanceof Error ? err.message : 'Erro ao atualizar cupom')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const deleteCoupon = useCallback(async (id: string) => {
    if (!isAuthenticated) return false

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir cupom')
      }

      return true
    } catch (err) {
      console.error('Erro ao excluir cupom:', err)
      setError(err instanceof Error ? err.message : 'Erro ao excluir cupom')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  return {
    isLoading,
    error,
    validateCoupon,
    fetchCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
  }
>>>>>>> Stashed changes
} 