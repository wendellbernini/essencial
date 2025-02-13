<<<<<<< Updated upstream
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/wishlist - Lista todos os produtos na lista de desejos do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            name: true,
            slug: true,
            price: true,
            images: true,
            brand: true,
            description: true,
            stock: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(wishlistItems)
  } catch (error) {
    console.error('Erro ao listar produtos da wishlist:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/wishlist - Adiciona um produto à lista de desejos
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { product } = await request.json()

    if (!product?.id) {
      return NextResponse.json(
        { message: 'ID do produto é obrigatório' },
        { status: 400 }
      )
    }

    // Verifica se o produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: product.id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { message: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Verifica se o produto já está na lista
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: product.id,
        },
      },
    })

    if (existingItem) {
      return NextResponse.json(
        { message: 'Produto já está na lista de desejos' },
        { status: 400 }
      )
    }

    // Adiciona o produto à lista
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId: product.id,
      },
      include: {
        product: {
          select: {
            name: true,
            slug: true,
            price: true,
            images: true,
            brand: true,
            description: true,
            stock: true,
          },
        },
      },
    })

    return NextResponse.json(wishlistItem, { status: 201 })
  } catch (error) {
    console.error('Erro ao adicionar produto à wishlist:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/wishlist/[productId] - Remove um produto da lista de desejos
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { message: 'ID do produto é obrigatório' },
        { status: 400 }
      )
    }

    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Erro ao remover produto da wishlist:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
=======
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/wishlist - Lista todos os produtos na lista de desejos do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            name: true,
            slug: true,
            price: true,
            images: true,
            brand: true,
            description: true,
            stock: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(wishlistItems)
  } catch (error) {
    console.error('Erro ao listar produtos da wishlist:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/wishlist - Adiciona um produto à lista de desejos
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { product } = await request.json()

    if (!product?.id) {
      return NextResponse.json(
        { message: 'ID do produto é obrigatório' },
        { status: 400 }
      )
    }

    // Verifica se o produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: product.id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { message: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Verifica se o produto já está na lista
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: product.id,
        },
      },
    })

    if (existingItem) {
      return NextResponse.json(
        { message: 'Produto já está na lista de desejos' },
        { status: 400 }
      )
    }

    // Adiciona o produto à lista
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId: product.id,
      },
      include: {
        product: {
          select: {
            name: true,
            slug: true,
            price: true,
            images: true,
            brand: true,
            description: true,
            stock: true,
          },
        },
      },
    })

    return NextResponse.json(wishlistItem, { status: 201 })
  } catch (error) {
    console.error('Erro ao adicionar produto à wishlist:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/wishlist/[productId] - Remove um produto da lista de desejos
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { message: 'ID do produto é obrigatório' },
        { status: 400 }
      )
    }

    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Erro ao remover produto da wishlist:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
>>>>>>> Stashed changes
} 