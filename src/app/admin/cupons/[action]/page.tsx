<<<<<<< Updated upstream
'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import { useCoupons } from '@/hooks/useCoupons'

interface CouponFormData {
  code: string
  type: 'PERCENTAGE' | 'FIXED'
  value: string
  minValue: string
  maxUses: string
  startDate: string
  endDate: string
  active: boolean
}

const initialFormData: CouponFormData = {
  code: '',
  type: 'PERCENTAGE',
  value: '',
  minValue: '',
  maxUses: '',
  startDate: '',
  endDate: '',
  active: true,
}

export default function CouponForm({
  params,
}: {
  params: Promise<{ action: string }>
}) {
  const router = useRouter()
  const { action } = use(params)
  const isEditing = action !== 'novo'
  const { getCoupon, createCoupon, updateCoupon } = useCoupons()
  const [formData, setFormData] = useState<CouponFormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isEditing) {
      loadCoupon()
    }
  }, [isEditing])

  async function loadCoupon() {
    try {
      setIsLoading(true)
      const coupon = await getCoupon(action)
      if (coupon) {
        setFormData({
          code: coupon.code,
          type: coupon.type,
          value: String(coupon.value),
          minValue: coupon.minValue ? String(coupon.minValue) : '',
          maxUses: coupon.maxUses ? String(coupon.maxUses) : '',
          startDate: coupon.startDate
            ? new Date(coupon.startDate).toISOString().split('T')[0]
            : '',
          endDate: coupon.endDate
            ? new Date(coupon.endDate).toISOString().split('T')[0]
            : '',
          active: coupon.active,
        })
      }
    } catch (err) {
      console.error('Erro ao carregar cupom:', err)
      router.push('/admin/cupons')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const data = {
        code: formData.code,
        type: formData.type,
        value: Number(formData.value),
        minValue: formData.minValue ? Number(formData.minValue) : null,
        maxUses: formData.maxUses ? Number(formData.maxUses) : null,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        active: formData.active,
      }

      if (isEditing) {
        await updateCoupon(action, data)
      } else {
        await createCoupon(data)
      }

      router.push('/admin/cupons')
    } catch (err) {
      console.error('Erro ao salvar cupom:', err)
      setError(err instanceof Error ? err.message : 'Erro ao salvar cupom')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && isEditing) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Editar Cupom' : 'Novo Cupom'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  code: e.target.value.toUpperCase(),
                }))
              }
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  type: e.target.value as 'PERCENTAGE' | 'FIXED',
                }))
              }
              className="w-full px-4 py-2 border rounded-md"
              required
            >
              <option value="PERCENTAGE">Porcentagem</option>
              <option value="FIXED">Valor Fixo</option>
            </select>
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor
            </label>
            <div className="relative">
              {formData.type === 'PERCENTAGE' && (
                <span className="absolute right-4 top-2">%</span>
              )}
              {formData.type === 'FIXED' && (
                <span className="absolute left-4 top-2">R$</span>
              )}
              <input
                type="number"
                value={formData.value}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, value: e.target.value }))
                }
                className={`w-full px-4 py-2 border rounded-md ${
                  formData.type === 'FIXED' ? 'pl-10' : ''
                }`}
                min="0"
                step={formData.type === 'PERCENTAGE' ? '1' : '0.01'}
                required
              />
            </div>
          </div>

          {/* Valor Mínimo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Mínimo (opcional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2">R$</span>
              <input
                type="number"
                value={formData.minValue}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, minValue: e.target.value }))
                }
                className="w-full px-4 py-2 pl-10 border rounded-md"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Limite de Usos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Limite de Usos (opcional)
            </label>
            <input
              type="number"
              value={formData.maxUses}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, maxUses: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-md"
              min="0"
            />
          </div>

          {/* Data de Início */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Início (opcional)
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Data de Término */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Término (opcional)
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, active: e.target.checked }))
              }
              className="h-4 w-4 text-primary border-gray-300 rounded"
            />
            <label htmlFor="active" className="ml-2 text-sm text-gray-700">
              Cupom ativo
            </label>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            {isEditing ? 'Salvar Alterações' : 'Criar Cupom'}
          </Button>
        </div>
      </form>
    </div>
  )
=======
'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useCoupons } from '@/hooks/useCoupons'

interface CouponFormData {
  code: string
  type: 'PERCENTAGE' | 'FIXED'
  value: string
  minValue: string
  maxUses: string
  startDate: string
  endDate: string
  active: boolean
}

const initialFormData: CouponFormData = {
  code: '',
  type: 'PERCENTAGE',
  value: '',
  minValue: '',
  maxUses: '',
  startDate: '',
  endDate: '',
  active: true,
}

export default function CouponForm({
  params,
}: {
  params: Promise<{ action: string }>
}) {
  const router = useRouter()
  const { action } = use(params)
  const isEditing = action !== 'novo'
  const { getCoupon, createCoupon, updateCoupon } = useCoupons()
  const [formData, setFormData] = useState<CouponFormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isEditing) {
      loadCoupon()
    }
  }, [isEditing])

  async function loadCoupon() {
    try {
      setIsLoading(true)
      const coupon = await getCoupon(action)
      if (coupon) {
        setFormData({
          code: coupon.code,
          type: coupon.type,
          value: String(coupon.value),
          minValue: coupon.minValue ? String(coupon.minValue) : '',
          maxUses: coupon.maxUses ? String(coupon.maxUses) : '',
          startDate: coupon.startDate
            ? new Date(coupon.startDate).toISOString().split('T')[0]
            : '',
          endDate: coupon.endDate
            ? new Date(coupon.endDate).toISOString().split('T')[0]
            : '',
          active: coupon.active,
        })
      }
    } catch (err) {
      console.error('Erro ao carregar cupom:', err)
      router.push('/admin/cupons')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const data = {
        code: formData.code,
        type: formData.type,
        value: Number(formData.value),
        minValue: formData.minValue ? Number(formData.minValue) : null,
        maxUses: formData.maxUses ? Number(formData.maxUses) : null,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        active: formData.active,
      }

      if (isEditing) {
        await updateCoupon(action, data)
      } else {
        await createCoupon(data)
      }

      router.push('/admin/cupons')
    } catch (err) {
      console.error('Erro ao salvar cupom:', err)
      setError(err instanceof Error ? err.message : 'Erro ao salvar cupom')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && isEditing) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Editar Cupom' : 'Novo Cupom'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  code: e.target.value.toUpperCase(),
                }))
              }
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  type: e.target.value as 'PERCENTAGE' | 'FIXED',
                }))
              }
              className="w-full px-4 py-2 border rounded-md"
              required
            >
              <option value="PERCENTAGE">Porcentagem</option>
              <option value="FIXED">Valor Fixo</option>
            </select>
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor
            </label>
            <div className="relative">
              {formData.type === 'PERCENTAGE' && (
                <span className="absolute right-4 top-2">%</span>
              )}
              {formData.type === 'FIXED' && (
                <span className="absolute left-4 top-2">R$</span>
              )}
              <input
                type="number"
                value={formData.value}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, value: e.target.value }))
                }
                className={`w-full px-4 py-2 border rounded-md ${
                  formData.type === 'FIXED' ? 'pl-10' : ''
                }`}
                min="0"
                step={formData.type === 'PERCENTAGE' ? '1' : '0.01'}
                required
              />
            </div>
          </div>

          {/* Valor Mínimo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Mínimo (opcional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2">R$</span>
              <input
                type="number"
                value={formData.minValue}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, minValue: e.target.value }))
                }
                className="w-full px-4 py-2 pl-10 border rounded-md"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Limite de Usos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Limite de Usos (opcional)
            </label>
            <input
              type="number"
              value={formData.maxUses}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, maxUses: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-md"
              min="0"
            />
          </div>

          {/* Data de Início */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Início (opcional)
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Data de Término */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Término (opcional)
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, active: e.target.checked }))
              }
              className="h-4 w-4 text-primary border-gray-300 rounded"
            />
            <label htmlFor="active" className="ml-2 text-sm text-gray-700">
              Cupom ativo
            </label>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            {isEditing ? 'Salvar Alterações' : 'Criar Cupom'}
          </Button>
        </div>
      </form>
    </div>
  )
>>>>>>> Stashed changes
} 