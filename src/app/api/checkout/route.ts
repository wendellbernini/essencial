<<<<<<< Updated upstream
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createPreference } from '@/lib/mercadopago'

// POST /api/checkout - Cria um novo pedido
export async function POST(request: Request) {
  try {
    // Verifica autenticação
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Recebe os dados do carrinho
    const data = await request.json()
    const { items, couponId } = data

    if (!items?.length) {
      return NextResponse.json(
        { message: 'Carrinho vazio' },
        { status: 400 }
      )
    }

    // Calcula o total
    const subtotal = items.reduce(
      (acc: number, item: any) => acc + (item.price * item.quantity),
      0
    )

    // Processa o cupom se fornecido
    let discount = 0
    let coupon = null
    if (couponId) {
      coupon = await prisma.coupon.findUnique({
        where: { code: couponId },
      })

      if (coupon) {
        // Verifica se o cupom está ativo
        if (!coupon.active) {
          return NextResponse.json(
            { message: 'Cupom inativo' },
            { status: 400 }
          )
        }

        // Verifica se o cupom está dentro do período válido
        const now = new Date()
        if (coupon.startDate && now < coupon.startDate) {
          return NextResponse.json(
            { message: 'Cupom ainda não está válido' },
            { status: 400 }
          )
        }
        if (coupon.endDate && now > coupon.endDate) {
          return NextResponse.json(
            { message: 'Cupom expirado' },
            { status: 400 }
          )
        }

        // Verifica se o cupom atingiu o limite de usos
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
          return NextResponse.json(
            { message: 'Cupom atingiu o limite de usos' },
            { status: 400 }
          )
        }

        // Verifica se atinge o valor mínimo
        if (coupon.minValue && subtotal < Number(coupon.minValue)) {
          return NextResponse.json(
            { message: `Valor mínimo para este cupom é ${coupon.minValue}` },
            { status: 400 }
          )
        }

        // Calcula o desconto
        if (coupon.type === 'PERCENTAGE') {
          discount = subtotal * (Number(coupon.value) / 100)
        } else {
          discount = Number(coupon.value)
          if (discount > subtotal) {
            discount = subtotal
          }
        }
      }
    }

    // Calcula o total final
    const total = subtotal - discount

    // Busca o endereço padrão do usuário
    const defaultAddress = await prisma.address.findFirst({
      where: {
        userId: session.user.id,
        isDefault: true,
      },
    })

    // Cria o pedido no banco
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        addressId: defaultAddress?.id || '', // Temporário: permitir pedido sem endereço
        status: 'PENDING',
        total,
        couponId: coupon?.id,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    // Atualiza o contador de usos do cupom
    if (coupon) {
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: {
          usedCount: {
            increment: 1,
          },
        },
      })
    }

    // Cria a preferência no Mercado Pago
    const preference = await createPreference({
      items: items.map((item: any) => ({
        id: item.id,
        title: item.name,
        description: `${item.name} - Quantidade: ${item.quantity}`,
        picture_url: item.image,
        quantity: item.quantity,
        unit_price: item.price,
      })),
      payer: {
        email: session.user.email,
        name: session.user.name,
      },
      external_reference: order.id,
    })

    return NextResponse.json({
      orderId: order.id,
      preferenceId: preference.body.id,
    })
  } catch (error) {
    console.error('Erro ao criar checkout:', error)
    return NextResponse.json(
      { message: 'Erro ao processar pedido' },
      { status: 500 }
    )
  }
=======
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createPreference } from '@/lib/mercadopago'

// POST /api/checkout - Cria um novo pedido
export async function POST(request: Request) {
  try {
    // Verifica autenticação
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Recebe os dados do carrinho
    const data = await request.json()
    const { items, couponId } = data

    if (!items?.length) {
      return NextResponse.json(
        { message: 'Carrinho vazio' },
        { status: 400 }
      )
    }

    // Calcula o total
    const subtotal = items.reduce(
      (acc: number, item: any) => acc + (item.price * item.quantity),
      0
    )

    // Processa o cupom se fornecido
    let discount = 0
    let coupon = null
    if (couponId) {
      coupon = await prisma.coupon.findUnique({
        where: { code: couponId },
      })

      if (coupon) {
        // Verifica se o cupom está ativo
        if (!coupon.active) {
          return NextResponse.json(
            { message: 'Cupom inativo' },
            { status: 400 }
          )
        }

        // Verifica se o cupom está dentro do período válido
        const now = new Date()
        if (coupon.startDate && now < coupon.startDate) {
          return NextResponse.json(
            { message: 'Cupom ainda não está válido' },
            { status: 400 }
          )
        }
        if (coupon.endDate && now > coupon.endDate) {
          return NextResponse.json(
            { message: 'Cupom expirado' },
            { status: 400 }
          )
        }

        // Verifica se o cupom atingiu o limite de usos
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
          return NextResponse.json(
            { message: 'Cupom atingiu o limite de usos' },
            { status: 400 }
          )
        }

        // Verifica se atinge o valor mínimo
        if (coupon.minValue && subtotal < Number(coupon.minValue)) {
          return NextResponse.json(
            { message: `Valor mínimo para este cupom é ${coupon.minValue}` },
            { status: 400 }
          )
        }

        // Calcula o desconto
        if (coupon.type === 'PERCENTAGE') {
          discount = subtotal * (Number(coupon.value) / 100)
        } else {
          discount = Number(coupon.value)
          if (discount > subtotal) {
            discount = subtotal
          }
        }
      }
    }

    // Calcula o total final
    const total = subtotal - discount

    // Busca o endereço padrão do usuário
    const defaultAddress = await prisma.address.findFirst({
      where: {
        userId: session.user.id,
        isDefault: true,
      },
    })

    // Cria o pedido no banco
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        addressId: defaultAddress?.id || '', // Temporário: permitir pedido sem endereço
        status: 'PENDING',
        total,
        couponId: coupon?.id,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    // Atualiza o contador de usos do cupom
    if (coupon) {
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: {
          usedCount: {
            increment: 1,
          },
        },
      })
    }

    // Cria a preferência no Mercado Pago
    const preference = await createPreference({
      items: items.map((item: any) => ({
        id: item.id,
        title: item.name,
        description: `${item.name} - Quantidade: ${item.quantity}`,
        picture_url: item.image,
        quantity: item.quantity,
        unit_price: item.price,
      })),
      payer: {
        email: session.user.email,
        name: session.user.name,
      },
      external_reference: order.id,
    })

    return NextResponse.json({
      orderId: order.id,
      preferenceId: preference.body.id,
    })
  } catch (error) {
    console.error('Erro ao criar checkout:', error)
    return NextResponse.json(
      { message: 'Erro ao processar pedido' },
      { status: 500 }
    )
  }
>>>>>>> Stashed changes
} 