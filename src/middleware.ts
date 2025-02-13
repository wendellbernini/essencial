import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Verifica se o usuário está tentando acessar uma rota administrativa
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Verifica se o site está em modo de manutenção
  try {
    const response = await fetch(`${request.nextUrl.origin}/api/settings`);
    const settings = await response.json();

    if (settings?.maintenanceMode) {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token || token.role !== "ADMIN") {
        return NextResponse.rewrite(new URL("/maintenance", request.url));
      }
    }
  } catch (error) {
    console.error("Erro ao verificar modo de manutenção:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/admin/:path*",
  ],
};
