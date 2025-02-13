import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Primeiro cria uma categoria de teste
    const category = await prisma.category.create({
      data: {
        name: 'Maquiagem',
        slug: 'maquiagem',
        description: 'Produtos de maquiagem',
      },
    })

    // Cria o produto de teste
    const product = await prisma.product.create({
      data: {
        name: 'Batom Teste',
        slug: 'batom-teste',
        description: 'Um batom para testes',
        price: 29.90,
        images: ['/images/products/lipstick.jpg'],
        stock: 100,
        brand: 'Marca Teste',
        categoryId: category.id,
      },
    })

    return NextResponse.json(
      { message: 'Produto de teste criado com sucesso', product },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao criar produto de teste:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 