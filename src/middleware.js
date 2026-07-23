import { NextResponse } from 'next/server';
import { librarySeoGuard } from '@/middleware/librarySeoGuard';

/**
 * Case-only redirects must use exact pathname checks. next.config redirects match
 * case-insensitively on some hosts, which loops /tools/3d-cad-viewer → itself.
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === '/tools/3D-cad-viewer') {
    const url = request.nextUrl.clone();
    url.pathname = '/tools/3d-cad-viewer';
    return NextResponse.redirect(url, 308);
  }

  const libraryResponse = librarySeoGuard(request);
  if (libraryResponse) {
    return libraryResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/tools/3D-cad-viewer', '/library/:path*'],
};
