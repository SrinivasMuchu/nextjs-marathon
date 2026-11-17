import { NextResponse } from 'next/server';
import { librarySeoGuard } from '@/middleware/librarySeoGuard';

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
