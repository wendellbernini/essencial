import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse('Não autorizado', { status: 401 })
    }

    const preferences = await prisma.notificationPreferences.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (!preferences) {
      // Criar preferências padrão se não existirem
      const defaultPreferences = await prisma.notificationPreferences.create({
        data: {
          userId: session.user.id,
          email: true,
          push: true,
          priceAlerts: true,
          stockAlerts: true,
          orderUpdates: true,
          promotions: true,
        },
      })

      return NextResponse.json(defaultPreferences)
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('[NOTIFICATION_PREFERENCES_GET]', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse('Não autorizado', { status: 401 })
    }

    const body = await req.json()

    const preferences = await prisma.notificationPreferences.update({
      where: {
        userId: session.user.id,
      },
      data: body,
    })

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('[NOTIFICATION_PREFERENCES_PUT]', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
} 