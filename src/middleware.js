import { NextResponse } from 'next/server';
import { librarySeoGuard } from '@/middleware/librarySeoGuard';

/**
 * Case-only redirects must use exact pathname checks. next.config redirects match
 * case-insensitively on some hosts, which loops /tools/3D-cad-viewer → itself.
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;

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
  matcher: ['/tools/3D-cad-viewer', '/library', '/library/:path*'],
};
