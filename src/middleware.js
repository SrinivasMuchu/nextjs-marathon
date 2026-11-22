import { NextResponse } from 'next/server';
import { librarySeoGuard } from '@/middleware/librarySeoGuard';
import {
  isTestingServerHost,
  safeNextPath,
  TESTING_ACCESS_PATH,
  TESTING_ADMIN_COOKIE,
} from '@/lib/testingServerGate';

/** Hosts that receive public/robots.txt. Every other host gets disallow-all. */
const PRODUCTION_ROBOTS_HOSTS = new Set(['marathon-os.com', 'www.marathon-os.com']);

/** Body previously emitted by src/app/robots.js. */
const DISALLOW_ALL_ROBOTS = 'User-Agent: *\nDisallow: /\n\n';

function hostnameFromHeader(value) {
  return (value || '').split(',')[0].trim().toLowerCase().replace(/:\d+$/, '');
}

function isProductionRobotsHost(request) {
  const candidates = [
    request.headers.get('x-forwarded-host'),
    request.headers.get('host'),
    request.nextUrl.hostname,
  ];
  return candidates.some((value) => PRODUCTION_ROBOTS_HOSTS.has(hostnameFromHeader(value)));
}

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

  if (pathname === '/robots.txt') {
    if (isProductionRobotsHost(request)) {
      return NextResponse.next();
    }
    return new NextResponse(DISALLOW_ALL_ROBOTS, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  }

  if (pathname === '/tools/3D-cad-viewer') {
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
  // Skip API, Next internals, and files with an extension. `/robots.txt` is
  // listed on its own because that exclusion would otherwise skip it.
  matcher: ['/((?!api/|_next/|.*\\..*).*)', '/robots.txt'],
};
