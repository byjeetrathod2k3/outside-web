import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'outside_super_secure_secret_key_production_32chars_min'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Strict Security Headers & NoIndex for Admin Routes
  if (pathname.startsWith('/admin')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');

    // Allow public access only to login
    if (pathname === '/admin/login') {
      return response;
    }

    // Check admin authentication session cookie
    const token = request.cookies.get('outside_session')?.value;

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] });
      return response;
    } catch {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      const redirectRes = NextResponse.redirect(loginUrl);
      redirectRes.cookies.delete('outside_session');
      return redirectRes;
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
