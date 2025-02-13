<<<<<<< Updated upstream
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse('Não autorizado', { status: 401 })
    }

    await prisma.notification.deleteMany({
      where: {
        userId: session.user.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[NOTIFICATIONS_CLEAR_ALL]', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
=======
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse('Não autorizado', { status: 401 })
    }

    await prisma.notification.deleteMany({
      where: {
        userId: session.user.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[NOTIFICATIONS_CLEAR_ALL]', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
>>>>>>> Stashed changes
} 