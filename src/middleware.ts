import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Admin sayfalarını kontrol et
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Login sayfasına erişime izin ver
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Admin oturumunu kontrol et
    const adminSession = request.cookies.get('adminSession')?.value;
    
    if (!adminSession) {
      // Oturum yoksa login sayfasına yönlendir
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // /home yolundan gelenleri ana sayfaya yönlendir
  if (request.nextUrl.pathname === '/home') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/home']
}; 