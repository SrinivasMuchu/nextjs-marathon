import { NextResponse } from 'next/server';
import { librarySeoGuard } from '@/middleware/librarySeoGuard';
import {
  isTestingServerHost,
  safeNextPath,
  TESTING_ACCESS_PATH,
  TESTING_ADMIN_COOKIE,
} from '@/lib/testingServerGate';

/**
 * Case-only redirects must use exact pathname checks. next.config redirects match
 * case-insensitively on some hosts, which loops /tools/3D-cad-viewer → itself.
 * Every path segment is lowercased, including product slugs.
 */
function lowercasePath(pathname) {
  const next = pathname.toLowerCase();
  return next === pathname ? null : next;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const lowerPath = lowercasePath(pathname);

  if (lowerPath) {
    const url = request.nextUrl.clone();
    url.pathname = lowerPath;
    return NextResponse.redirect(url, 308);
  }

  const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  if (isTestingServerHost(forwardedHost) && pathname !== TESTING_ACCESS_PATH) {
    const session = request.cookies.get(TESTING_ADMIN_COOKIE)?.value;
    if (!session) {
      const isPrefetch = request.headers.get('next-router-prefetch') === '1'
        || request.headers.get('purpose') === 'prefetch';
      // Prefetch redirects were pulling the open page back to the login screen.
      if (isPrefetch) {
        return new NextResponse(null, {
          status: 204,
          headers: { 'Cache-Control': 'private, no-store' },
        });
      }
      const url = request.nextUrl.clone();
      url.pathname = TESTING_ACCESS_PATH;
      url.search = '';
      const next = safeNextPath(`${pathname}${request.nextUrl.search || ''}`);
      if (next !== '/') url.searchParams.set('next', next);
      const redirect = NextResponse.redirect(url);
      redirect.headers.set('Cache-Control', 'private, no-store');
      return redirect;
    }
  }

  const libraryResponse = await librarySeoGuard(request);
  if (libraryResponse) {
    return libraryResponse;
  }

  return NextResponse.next();
}

export const config = {
  // Skip API, Next internals, and files with an extension. Include bare `/library`.
  matcher: ['/((?!api/|_next/|.*\\..*).*)'],
};
