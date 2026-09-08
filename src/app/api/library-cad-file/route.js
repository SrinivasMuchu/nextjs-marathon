import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 120;

const API_BASE = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '');

/**
 * Proxy a library CAD file for tools that need a browser File (e.g. drawing pipeline).
 * Resolves signed URL on the server and streams bytes — avoids CloudFront CORS.
 */
export async function GET(request) {
  if (!API_BASE) {
    return NextResponse.json(
      { meta: { success: false, message: 'NEXT_PUBLIC_BASE_URL is not set.' } },
      { status: 500 },
    );
  }

  const userUuid = request.headers.get('user-uuid') || '';
  if (!userUuid) {
    return NextResponse.json(
      { meta: { success: false, message: 'user-uuid header is required.' } },
      { status: 400 },
    );
  }

  const designId = String(new URL(request.url).searchParams.get('designId') || '').trim();
  if (!/^[a-f0-9]{24}$/i.test(designId)) {
    return NextResponse.json(
      { meta: { success: false, message: 'Valid designId is required.' } },
      { status: 400 },
    );
  }

  try {
    const metaRes = await fetch(
      `${API_BASE}/v1/cad/library-source-for-tool?design_id=${encodeURIComponent(designId)}`,
      {
        headers: { 'user-uuid': userUuid },
        cache: 'no-store',
      },
    );
    const metaJson = await metaRes.json();
    if (!metaJson?.meta?.success || !metaJson?.data?.download_url) {
      return NextResponse.json(
        {
          meta: {
            success: false,
            message: metaJson?.meta?.message || 'Could not resolve library file.',
          },
        },
        { status: 400 },
      );
    }

    const { download_url, file_name, file_type, page_title } = metaJson.data;
    const fileRes = await fetch(download_url, { cache: 'no-store' });
    if (!fileRes.ok) {
      return NextResponse.json(
        { meta: { success: false, message: 'Failed to download library CAD file.' } },
        { status: 502 },
      );
    }

    const buffer = Buffer.from(await fileRes.arrayBuffer());
    const headers = new Headers();
    headers.set('Content-Type', fileRes.headers.get('content-type') || 'application/octet-stream');
    headers.set('Content-Length', String(buffer.length));
    headers.set(
      'Content-Disposition',
      `attachment; filename="${String(file_name || `model.${file_type || 'step'}`).replace(/"/g, '')}"`,
    );
    headers.set('x-file-name', String(file_name || ''));
    headers.set('x-file-type', String(file_type || 'step'));
    if (page_title) headers.set('x-page-title', encodeURIComponent(String(page_title)));
    headers.set('Cache-Control', 'no-store');

    return new NextResponse(buffer, { status: 200, headers });
  } catch (error) {
    console.error('library-cad-file proxy:', error);
    return NextResponse.json(
      { meta: { success: false, message: 'Internal error loading library file.' } },
      { status: 500 },
    );
  }
}
