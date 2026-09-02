import { BASE_URL } from "@/config";

function isUserPipelineRequest({ source, prefix }) {
  return Boolean(String(prefix || "").trim()) || String(source || "").toLowerCase() === "user";
}

/**
 * SVG + inline PDF stay public for preview/SEO. Lock ZIP, DXF, FCStd, and attachment downloads.
 */
export function isGatedLibraryDownload({ source, prefix, ext, disposition, file, isZip }) {
  if (isUserPipelineRequest({ source, prefix })) return false;
  if (isZip) return true;
  if (file) return true;
  const kind = String(ext || "").toLowerCase();
  const asAttachment = String(disposition || "").toLowerCase() === "attachment";
  if (kind === "dxf" || kind === "fcstd") return true;
  if (asAttachment) return true;
  return false;
}

export async function assertTwoDLibraryDownloadAccess(request, designId) {
  const uuid = request.headers.get("user-uuid") || "";
  if (!BASE_URL) {
    return { ok: false, status: 503, message: "Download service is not configured." };
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/cad/2d-library/check-download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(uuid ? { "user-uuid": uuid } : {}),
      },
      body: JSON.stringify({ cad_file_id: designId }),
      cache: "no-store",
    });
    const payload = await res.json().catch(() => null);
    if (payload?.data?.can_download) return { ok: true };

    const reason = payload?.data?.reason || "";
    const status = reason === "auth_required" || reason === "payment_required" ? 401 : 403;
    return {
      ok: false,
      status,
      message: payload?.meta?.message || "Payment required to download this drawing set.",
      reason,
    };
  } catch (error) {
    return { ok: false, status: 503, message: "Could not verify download access." };
  }
}
