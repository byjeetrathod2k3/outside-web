import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'outside_super_secure_secret_key_production_32chars_min'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminBasePath = (process.env.ADMIN_BASE_PATH || '/outside-studio-ops').replace(/\/$/, '');

  // 1. Permanent 308 Redirect Manager
  if (pathname === '/drops') {
    return NextResponse.redirect(new URL('/', request.url), 308);
  }
  if (pathname === '/archive') {
    return NextResponse.redirect(new URL('/vault', request.url), 308);
  }

  // 2. Direct /admin discovery block (stealth mode protection)
  // When ADMIN_BASE_PATH is configured to a stealth route, /admin returns 404
  if (pathname.startsWith('/admin') && adminBasePath !== '/admin') {
    return NextResponse.rewrite(new URL('/_not-found', request.url), { status: 404 });
  }

  // 3. Stealth Admin Route Handler (e.g., /outside-studio-ops/*)
  if (pathname === adminBasePath || pathname.startsWith(`${adminBasePath}/`)) {
    const internalPath = pathname.slice(adminBasePath.length) || '/';
    const targetPath = `/admin${internalPath === '/' ? '' : internalPath}`;
    const rewriteUrl = new URL(targetPath, request.url);

    // Apply strict indexing protection headers
    const headers = new Headers(request.headers);
    headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');

    // Allow public access to the stealth login screen
    if (pathname === `${adminBasePath}/login` || internalPath === '/login') {
      const res = NextResponse.rewrite(new URL('/admin/login', request.url), {
        request: { headers },
      });
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
      return res;
    }

    // Check super admin session cookie
    const token = request.cookies.get('outside_session')?.value;
    if (!token) {
      const loginUrl = new URL(`${adminBasePath}/login`, request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] });

      // Super Admin single-role enforcement
      if (payload.role !== 'SUPER_ADMIN') {
        const loginUrl = new URL(`${adminBasePath}/login`, request.url);
        const redirectRes = NextResponse.redirect(loginUrl);
        redirectRes.cookies.delete('outside_session');
        return redirectRes;
      }

      const res = NextResponse.rewrite(rewriteUrl, {
        request: { headers },
      });
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
      return res;
    } catch {
      const loginUrl = new URL(`${adminBasePath}/login`, request.url);
      loginUrl.searchParams.set('from', pathname);
      const redirectRes = NextResponse.redirect(loginUrl);
      redirectRes.cookies.delete('outside_session');
      return redirectRes;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     * - images/ (public asset directory)
     * - api/og (dynamic OG generator)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|api/og).*)',
  ],
};
