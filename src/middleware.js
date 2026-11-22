import { NextResponse } from 'next/server';
import { librarySeoGuard } from '@/middleware/librarySeoGuard';

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
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;

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
    url.pathname = '/tools/3d-cad-viewer';
    return NextResponse.redirect(url, 308);
  }

  const libraryResponse = await librarySeoGuard(request);
  if (libraryResponse) {
    return libraryResponse;
  }

  return NextResponse.next();
}

export const config = {
  // Include bare `/library` — `/library/:path*` alone can miss query-only root URLs.
  matcher: ['/tools/3D-cad-viewer', '/library', '/library/:path*', '/robots.txt'],
};
