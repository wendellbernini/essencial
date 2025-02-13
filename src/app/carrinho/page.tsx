<<<<<<< Updated upstream
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/utils/format'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useCoupons } from '@/hooks/useCoupons'

declare global {
  interface Window {
    MercadoPago?: any
  }
}

export default function CartPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const {
    items,
    totalQuantity,
    totalAmount,
    updateItemQuantity,
    removeItem,
  } = useCart()
  const { validateCoupon } = useCoupons()
  const [isLoading, setIsLoading] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState<string | null>(null)
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string
    discount: number
    total: number
  } | null>(null)

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/carrinho')
      return
    }

    try {
      setIsLoading(true)

      // Cria a preferência de pagamento
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          couponId: appliedCoupon?.code,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar checkout')
      }

      const { preferenceId } = await response.json()

      // Inicializa o Mercado Pago
      const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY)
      
      // Cria o botão de pagamento
      const checkout = mp.checkout({
        preference: {
          id: preferenceId,
        },
        render: {
          container: '#payment-button',
          label: 'Pagar com Mercado Pago',
        },
      })
    } catch (error) {
      console.error('Erro ao processar checkout:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode) return

    try {
      setCouponError(null)
      const result = await validateCoupon(couponCode, totalAmount)
      
      if (result) {
        setAppliedCoupon({
          code: result.coupon.code,
          discount: result.discount,
          total: result.total,
        })
        setCouponCode('')
      }
    } catch (error) {
      console.error('Erro ao aplicar cupom:', error)
      setCouponError(error instanceof Error ? error.message : 'Erro ao aplicar cupom')
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponError(null)
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
          <p className="text-gray-600 mb-8">
            Adicione alguns produtos para começar suas compras.
          </p>
          <Button asChild>
            <Link href="/produtos">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continuar comprando
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Produtos */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-white rounded-lg shadow"
              >
                {/* Imagem */}
                <div className="relative w-24 h-24 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                {/* Informações */}
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-lg font-semibold text-primary">
                    {formatCurrency(item.price)}
                  </p>

                  {/* Quantidade */}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() =>
                          updateItemQuantity(item.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-gray-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateItemQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="font-semibold">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({totalQuantity} itens)</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Frete</span>
                <span className="text-green-600">Grátis</span>
              </div>

              {/* Cupom */}
              <div className="pt-4">
                {appliedCoupon ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Cupom ({appliedCoupon.code})</span>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-600 hover:text-red-700 text-xs"
                      >
                        Remover
                      </button>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Desconto</span>
                      <span>-{formatCurrency(appliedCoupon.discount)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Código do cupom"
                        className="flex-1 px-4 py-2 border rounded-md"
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyCoupon}
                      >
                        Aplicar
                      </Button>
                    </div>
                    {couponError && (
                      <p className="text-sm text-red-600">{couponError}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-semibold text-lg">
                  {formatCurrency(appliedCoupon ? appliedCoupon.total : totalAmount)}
                </span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              isLoading={isLoading}
              className="w-full mb-4"
            >
              Finalizar Compra
            </Button>

            {/* Container para o botão do Mercado Pago */}
            <div id="payment-button" className="w-full"></div>

            <Button
              variant="outline"
              className="w-full mt-4"
              asChild
            >
              <Link href="/produtos">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continuar comprando
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
=======
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/format'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useCoupons } from '@/hooks/useCoupons'

declare global {
  interface Window {
    MercadoPago?: any
  }
}

export default function CartPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const {
    items,
    totalQuantity,
    totalAmount,
    updateItemQuantity,
    removeItem,
  } = useCart()
  const { validateCoupon } = useCoupons()
  const [isLoading, setIsLoading] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState<string | null>(null)
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string
    discount: number
    total: number
  } | null>(null)

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/carrinho')
      return
    }

    try {
      setIsLoading(true)

      // Cria a preferência de pagamento
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          couponId: appliedCoupon?.code,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar checkout')
      }

      const { preferenceId } = await response.json()

      // Inicializa o Mercado Pago
      const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY)
      
      // Cria o botão de pagamento
      const checkout = mp.checkout({
        preference: {
          id: preferenceId,
        },
        render: {
          container: '#payment-button',
          label: 'Pagar com Mercado Pago',
        },
      })
    } catch (error) {
      console.error('Erro ao processar checkout:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode) return

    try {
      setCouponError(null)
      const result = await validateCoupon(couponCode, totalAmount)
      
      if (result) {
        setAppliedCoupon({
          code: result.coupon.code,
          discount: result.discount,
          total: result.total,
        })
        setCouponCode('')
      }
    } catch (error) {
      console.error('Erro ao aplicar cupom:', error)
      setCouponError(error instanceof Error ? error.message : 'Erro ao aplicar cupom')
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponError(null)
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
          <p className="text-gray-600 mb-8">
            Adicione alguns produtos para começar suas compras.
          </p>
          <Button asChild>
            <Link href="/produtos">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continuar comprando
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Produtos */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-white rounded-lg shadow"
              >
                {/* Imagem */}
                <div className="relative w-24 h-24 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                {/* Informações */}
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-lg font-semibold text-primary">
                    {formatCurrency(item.price)}
                  </p>

                  {/* Quantidade */}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() =>
                          updateItemQuantity(item.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-gray-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateItemQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="font-semibold">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({totalQuantity} itens)</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Frete</span>
                <span className="text-green-600">Grátis</span>
              </div>

              {/* Cupom */}
              <div className="pt-4">
                {appliedCoupon ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Cupom ({appliedCoupon.code})</span>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-600 hover:text-red-700 text-xs"
                      >
                        Remover
                      </button>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Desconto</span>
                      <span>-{formatCurrency(appliedCoupon.discount)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Código do cupom"
                        className="flex-1 px-4 py-2 border rounded-md"
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyCoupon}
                      >
                        Aplicar
                      </Button>
                    </div>
                    {couponError && (
                      <p className="text-sm text-red-600">{couponError}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-semibold text-lg">
                  {formatCurrency(appliedCoupon ? appliedCoupon.total : totalAmount)}
                </span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              isLoading={isLoading}
              className="w-full mb-4"
            >
              Finalizar Compra
            </Button>

            {/* Container para o botão do Mercado Pago */}
            <div id="payment-button" className="w-full"></div>

            <Button
              variant="outline"
              className="w-full mt-4"
              asChild
            >
              <Link href="/produtos">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continuar comprando
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
>>>>>>> Stashed changes
} 