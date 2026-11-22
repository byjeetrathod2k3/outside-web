import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'outside_super_secure_secret_key_production_32chars_min'
);

// Stealth hidden admin route mounts
const HIDDEN_ADMIN_PATHS = [
  (process.env.ADMIN_BASE_PATH || '/sys-admin-gate').replace(/\/$/, ''),
  '/sys-admin-gate',
  '/portal-auth-9x2k',
  '/outside-studio-ops',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 0. Static assets and internal Next.js routes bypass
  if (
    pathname.startsWith('/_next') ||
    pathname === '/_not-found' ||
    pathname === '/not-found' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 1. Permanent 308 Redirects
  if (pathname === '/drops') {
    return NextResponse.redirect(new URL('/', request.url), 308);
  }
  if (pathname === '/archive') {
    return NextResponse.redirect(new URL('/vault', request.url), 308);
  }

  // 2. Strict API Security for Admin Endpoints (/api/admin/*)
  if (pathname.startsWith('/api/admin')) {
    // Public authentication endpoint for admin login
    if (pathname === '/api/admin/auth') {
      return NextResponse.next();
    }

    const token = request.cookies.get('outside_session')?.value;
    if (!token) {
      // Return 404 Not Found to prevent route enumeration
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] });
      if (payload.role !== 'SUPER_ADMIN') {
        // Customers or unauthorized roles get 404 Not Found
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  }

  // 3. Direct /admin route security:
  // Strictly block public access to /admin or /admin/*
  // Rather than redirecting (which would leak the hidden admin URL), rewrite to /not-found (404)
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    // Only allow if authenticated super admin is directly on the internal rewrite
    const token = request.cookies.get('outside_session')?.value;
    if (!token) {
      return NextResponse.rewrite(new URL('/not-found', request.url), { status: 404 });
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] });
      if (payload.role !== 'SUPER_ADMIN') {
        return NextResponse.rewrite(new URL('/not-found', request.url), { status: 404 });
      }
      // Super admin can access
      return NextResponse.next();
    } catch {
      return NextResponse.rewrite(new URL('/not-found', request.url), { status: 404 });
    }
  }

  // 4. Hidden Admin URL Route Gate (e.g. /sys-admin-gate, /portal-auth-9x2k)
  const matchedHiddenPath = HIDDEN_ADMIN_PATHS.find(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (matchedHiddenPath) {
    const internalPath = pathname.slice(matchedHiddenPath.length) || '/';
    const isLoginPath =
      pathname === `${matchedHiddenPath}/login` ||
      internalPath === '/login' ||
      internalPath === '/';

    const headers = new Headers(request.headers);
    headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');

    // Check for super admin session token
    const token = request.cookies.get('outside_session')?.value;
    let isSuperAdmin = false;

    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] });
        if (payload.role === 'SUPER_ADMIN') {
          isSuperAdmin = true;
        }
      } catch {
        isSuperAdmin = false;
      }
    }

    // A. If user is authenticated as SUPER_ADMIN:
    if (isSuperAdmin) {
      if (isLoginPath && internalPath === '/login') {
        // Already logged in, redirect to admin dashboard
        return NextResponse.redirect(new URL(matchedHiddenPath, request.url));
      }
      // Rewrite to internal /admin route
      const targetPath = `/admin${internalPath === '/' ? '' : internalPath}`;
      const res = NextResponse.rewrite(new URL(targetPath, request.url), {
        request: { headers },
      });
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
      return res;
    }

    // B. If NOT authenticated:
    // Allow entry ONLY on the secret login gate
    if (isLoginPath) {
      const res = NextResponse.rewrite(new URL('/admin/login', request.url), {
        request: { headers },
      });
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
      return res;
    }

    // Unauthorized attempt to access internal admin routes (e.g. /sys-admin-gate/orders):
    // Block standard customer accounts and unauthenticated users, redirecting to a standard 404 page!
    return NextResponse.rewrite(new URL('/not-found', request.url), { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, and static assets (.png, .jpg, .svg, etc.)
     * - api/og (dynamic OG generator)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|api/og|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest)$).*)',
  ],
};
