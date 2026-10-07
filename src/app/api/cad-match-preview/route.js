import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const API_BASE = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
const ALLOWED_HOSTS = new Set([
  "d1m7wq8q1jgofx.cloudfront.net",
  "cad-output-files.s3.amazonaws.com",
  "cad-output-files.s3.ap-south-1.amazonaws.com",
]);

function isAllowedPreviewUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    if (!ALLOWED_HOSTS.has(u.hostname)) return false;
    // Only match-job preview GLBs (never arbitrary URLs).
    return /^\/match\/[a-f0-9]{24}\/preview\.glb$/i.test(u.pathname);
  } catch {
    return false;
  }
}

/**
 * Same-origin proxy for CAD Match query preview GLBs.
 * CloudFront/S3 often omit CORS, so <model-viewer> cannot fetch the CDN URL
 * directly from the browser — resulting in a black empty preview pane.
 */
export async function GET(request) {
  if (!API_BASE) {
    return NextResponse.json(
      { meta: { success: false, message: "NEXT_PUBLIC_BASE_URL is not set." } },
      { status: 500 },
    );
  }

  const reqUrl = new URL(request.url);
  const jobId = String(reqUrl.searchParams.get("jobId") || "").trim();
  // model-viewer cannot set custom headers — also accept uuid query param.
  const userUuid =
    request.headers.get("user-uuid") ||
    String(reqUrl.searchParams.get("uuid") || "").trim();
  if (!/^[a-f0-9]{24}$/i.test(jobId)) {
    return NextResponse.json(
      { meta: { success: false, message: "Valid jobId is required." } },
      { status: 400 },
    );
  }
  if (!userUuid) {
    return NextResponse.json(
      { meta: { success: false, message: "user-uuid header is required." } },
      { status: 400 },
    );
  }

  try {
    const statusRes = await fetch(
      `${API_BASE}/v1/cad-match/status/${encodeURIComponent(jobId)}`,
      {
        headers: { "user-uuid": userUuid },
        cache: "no-store",
      },
    );
    const statusJson = await statusRes.json();
    const glbUrl = statusJson?.data?.glb_url;
    if (!statusJson?.meta?.success || !glbUrl) {
      return NextResponse.json(
        {
          meta: {
            success: false,
            message:
              statusJson?.meta?.message || "Preview not ready for this job.",
          },
        },
        { status: 404 },
      );
    }
    if (!isAllowedPreviewUrl(glbUrl)) {
      return NextResponse.json(
        { meta: { success: false, message: "Preview URL not allowed." } },
        { status: 400 },
      );
    }

    const fileRes = await fetch(glbUrl, { cache: "no-store" });
    if (!fileRes.ok) {
      return NextResponse.json(
        { meta: { success: false, message: "Failed to fetch preview GLB." } },
        { status: 502 },
      );
    }

    const buffer = Buffer.from(await fileRes.arrayBuffer());
    const headers = new Headers();
    headers.set("Content-Type", "model/gltf-binary");
    headers.set("Content-Length", String(buffer.length));
    headers.set("Cache-Control", "private, max-age=300");
    // Explicit CORS for safety if ever requested cross-origin.
    headers.set("Access-Control-Allow-Origin", "*");

    return new NextResponse(buffer, { status: 200, headers });
  } catch (error) {
    console.error("cad-match-preview proxy:", error);
    return NextResponse.json(
      { meta: { success: false, message: "Preview proxy failed." } },
      { status: 500 },
    );
  }
}
