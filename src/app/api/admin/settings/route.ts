import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/settings - Obtém as configurações
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Busca as configurações ou cria se não existirem
    const settings = await prisma.settings.findFirst() || 
      await prisma.settings.create({
        data: {} // Usa os valores padrão definidos no schema
      })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erro ao obter configurações:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/admin/settings - Atualiza as configurações
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Validação básica
    if (!data.siteName || !data.siteDescription || !data.contactEmail) {
      return NextResponse.json(
        { message: 'Dados inválidos' },
        { status: 400 }
      )
    }

    // Busca as configurações existentes
    const existingSettings = await prisma.settings.findFirst()

    // Atualiza ou cria as configurações
    const settings = existingSettings
      ? await prisma.settings.update({
          where: { id: existingSettings.id },
          data: {
            siteName: data.siteName,
            siteDescription: data.siteDescription,
            contactEmail: data.contactEmail,
            phoneNumber: data.phoneNumber || '',
            address: data.address || '',
            freeShippingThreshold: data.freeShippingThreshold,
            enableRegistration: data.enableRegistration,
            enableReviews: data.enableReviews,
            maintenanceMode: data.maintenanceMode,
          },
        })
      : await prisma.settings.create({
          data: {
            siteName: data.siteName,
            siteDescription: data.siteDescription,
            contactEmail: data.contactEmail,
            phoneNumber: data.phoneNumber || '',
            address: data.address || '',
            freeShippingThreshold: data.freeShippingThreshold,
            enableRegistration: data.enableRegistration,
            enableReviews: data.enableReviews,
            maintenanceMode: data.maintenanceMode,
          },
        })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 