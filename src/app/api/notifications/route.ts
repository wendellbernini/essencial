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

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('[NOTIFICATIONS_GET]', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse('Não autorizado', { status: 401 })
    }

    const body = await req.json()
    const { type, title, message, data } = body

    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        data,
        userId: session.user.id,
      },
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error('[NOTIFICATIONS_POST]', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse('Não autorizado', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return new NextResponse('ID não fornecido', { status: 400 })
    }

    await prisma.notification.delete({
      where: {
        id,
        userId: session.user.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[NOTIFICATIONS_DELETE]', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
} 