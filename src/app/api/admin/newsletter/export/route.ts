import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar todos os assinantes ativos
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    })

    // Criar conteúdo CSV
    const headers = ['Email', 'Nome', 'Data de Inscrição']
    const rows = subscribers.map(sub => [
      sub.email,
      sub.name || '',
      new Date(sub.createdAt).toLocaleDateString('pt-BR'),
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n')

    // Criar resposta com o arquivo CSV
    const response = new NextResponse(csvContent)
    response.headers.set('Content-Type', 'text/csv')
    response.headers.set(
      'Content-Disposition',
      `attachment; filename="newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv"`
    )

    return response
  } catch (error) {
    console.error('Erro ao exportar assinantes:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 