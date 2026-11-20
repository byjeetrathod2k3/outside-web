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

  // 2. Strict API Security for Admin Endpoints
  // Protect all /api/admin/* endpoints from unauthenticated public access
  if (pathname.startsWith('/api/admin')) {
    // Public authentication endpoints: login/logout/session check
    if (pathname === '/api/admin/auth') {
      return NextResponse.next();
    }

    const token = request.cookies.get('outside_session')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Super Admin authentication required' },
        { status: 401 }
      );
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] });
      if (payload.role !== 'SUPER_ADMIN') {
        return NextResponse.json(
          { error: 'Forbidden: Super Admin access required' },
          { status: 403 }
        );
      }
      return NextResponse.next();
    } catch {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or expired session' },
        { status: 401 }
      );
    }
  }

  // 3. Direct /admin route security:
  // When accessed via /admin (standard admin URL):
  // Securely redirect unauthenticated users to the login screen,
  // or redirect authenticated admins to the configured base path
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (pathname === '/admin/login') {
      return NextResponse.redirect(new URL(`${adminBasePath}/login`, request.url));
    }

    const internalPath = pathname.slice('/admin'.length) || '';
    const token = request.cookies.get('outside_session')?.value;

    if (!token) {
      const loginUrl = new URL(`${adminBasePath}/login`, request.url);
      loginUrl.searchParams.set('from', `${adminBasePath}${internalPath}`);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] });
      if (payload.role !== 'SUPER_ADMIN') {
        const loginUrl = new URL(`${adminBasePath}/login`, request.url);
        const redirectRes = NextResponse.redirect(loginUrl);
        redirectRes.cookies.delete('outside_session');
        return redirectRes;
      }
      // If configured base path is not /admin, redirect to the stealth mount
      if (adminBasePath !== '/admin') {
        return NextResponse.redirect(new URL(`${adminBasePath}${internalPath}`, request.url));
      }
    } catch {
      const loginUrl = new URL(`${adminBasePath}/login`, request.url);
      const redirectRes = NextResponse.redirect(loginUrl);
      redirectRes.cookies.delete('outside_session');
      return redirectRes;
    }
  }

  // 4. Configured Admin Route Handler (e.g., /outside-studio-ops/*)
  if (pathname === adminBasePath || pathname.startsWith(`${adminBasePath}/`)) {
    const internalPath = pathname.slice(adminBasePath.length) || '/';
    const targetPath = `/admin${internalPath === '/' ? '' : internalPath}`;
    const rewriteUrl = new URL(targetPath, request.url);

    // Apply strict indexing protection headers
    const headers = new Headers(request.headers);
    headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');

    // Allow public access to the admin login screen
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
