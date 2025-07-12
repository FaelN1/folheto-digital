import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

   if (pathname === '/') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  // Rotas que precisam de autenticação
  const protectedRoutes = ['/dashboard', '/intern'];
  
  // Rotas de autenticação (login, register)
  const authRoutes = ['/auth/login', '/auth/register'];

  // Se está tentando acessar uma rota protegida sem token
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Se está logado e tentando acessar login/auth/register, redirecionar para dashboard
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [

    '/dashboard/:path*',
    '/intern/:path*',
    '/auth/login',
    '/auth/register'
  ]
};