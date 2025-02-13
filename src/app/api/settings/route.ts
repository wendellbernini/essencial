import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 