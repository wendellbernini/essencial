import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Ignora rotas da API e admin
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/auth')
  ) {
    return NextResponse.next()
  }

  try {
    // Verifica se o site está em modo de manutenção
    const response = await fetch(`${request.nextUrl.origin}/api/settings`)
    const settings = await response.json()

    if (settings?.maintenanceMode) {
      // Verifica se o usuário é admin
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      })

      if (token?.role !== 'ADMIN') {
        return NextResponse.rewrite(new URL('/maintenance', request.url))
      }
    }
  } catch (error) {
    console.error('Erro ao verificar modo de manutenção:', error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 