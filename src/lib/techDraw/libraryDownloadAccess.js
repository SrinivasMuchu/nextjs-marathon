import { BASE_URL } from "@/config";

const USER_FOLDERS = new Set([
  "freecad-techdraw",
  "freecad-2d-techdraw",
  "user-freecad-techdraw",
  "qwen_tech_draw_designs",
  "techdraw-output",
]);

const LIBRARY_FOLDERS = new Set(["2d-technical-drawings", "techdraw-v2"]);

/**
 * prefix is only a folder hint. It must be `{allowedFolder}/{this designId}`.
 * Library folders stay on the library payment check. User-upload folders stay
 * on the user TechDraw payment check. Anything else is rejected.
 */
export function classifyTechDrawLocation({ source, prefix, designId }) {
  const id = String(designId || "").trim();
  const raw = String(prefix || "").trim().replace(/^\/+/, "").replace(/\/+$/, "");

  if (raw) {
    if (raw.includes("..") || raw.includes("\\") || raw.includes("//")) {
      return { ok: false };
    }
    const parts = raw.split("/");
    if (parts.length !== 2 || parts[1].toLowerCase() !== id.toLowerCase()) {
      return { ok: false };
    }
    const folder = parts[0];
    if (!/^[a-z0-9_-]+$/i.test(folder)) return { ok: false };
    const safePrefix = `${folder}/${id}`;
    if (LIBRARY_FOLDERS.has(folder)) return { ok: true, kind: "library", prefix: safePrefix };
    if (USER_FOLDERS.has(folder)) return { ok: true, kind: "user", prefix: safePrefix };
    return { ok: false };
  }

  if (String(source || "").toLowerCase() === "user") {
    return { ok: true, kind: "user", prefix: "" };
  }
  return { ok: true, kind: "library", prefix: "" };
}

/**
 * SVG + inline PDF stay public for preview. ZIP, DXF, FreeCAD, and
 * attachment downloads follow the payment check for that location.
 */
export function isPaidTechDrawDeliverable({ ext, disposition, file, isZip }) {
  if (isZip) return true;
  const asAttachment = String(disposition || "").toLowerCase() === "attachment";
  if (file) {
    const name = String(file).toLowerCase();
    if (name.endsWith(".fcstd")) return true;
    if (name.endsWith(".glb") || name.endsWith(".stl")) return false;
    if (name.endsWith(".pdf") || name.endsWith(".svg")) return asAttachment;
    return true;
  }
  const kind = String(ext || "").toLowerCase();
  if (kind === "dxf" || kind === "fcstd") return true;
  if (asAttachment) return true;
  return false;
}

/** @deprecated Use isPaidTechDrawDeliverable. prefix/source no longer skip payment. */
export function isGatedLibraryDownload(args) {
  return isPaidTechDrawDeliverable(args);
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

async function assertAdminTechDrawJobAccess(request, jobId) {
  const adminUuid = request.headers.get("admin-uuid") || "";
  if (!adminUuid || !BASE_URL) return false;
  try {
    const res = await fetch(`${BASE_URL}/v1/admin-pannel/get-techdraw-job/${jobId}`, {
      headers: { "admin-uuid": adminUuid, Accept: "application/json" },
      cache: "no-store",
    });
    const payload = await res.json().catch(() => null);
    return Boolean(payload?.meta?.success);
  } catch {
    return false;
  }
}

/**
 * User-upload drawing set: first org job, free retry, and an already-paid job
 * download free. Later jobs require payment. A verified admin may download too.
 */
export async function assertUserTechDrawDownloadAccess(request, jobId) {
  const uuid = request.headers.get("user-uuid") || "";
  if (!BASE_URL) {
    return { ok: false, status: 503, message: "Download service is not configured." };
  }

  if (uuid) {
    try {
      const res = await fetch(`${BASE_URL}/v1/cad-techdraw/check-download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-uuid": uuid,
        },
        body: JSON.stringify({ job_id: jobId }),
        cache: "no-store",
      });
      const payload = await res.json().catch(() => null);
      if (payload?.data?.can_download) return { ok: true, reason: payload?.data?.reason };

      if (payload?.data?.reason === "expired") {
        return {
          ok: false,
          status: 410,
          message:
            payload?.meta?.message ||
            "This drawing expired after 7 days and is no longer available.",
          reason: "expired",
        };
      }

      if (payload?.data?.reason === "payment_required") {
        return {
          ok: false,
          status: 401,
          message: payload?.meta?.message || "Payment required to download this drawing set.",
          reason: "payment_required",
        };
      }
    } catch {
      return { ok: false, status: 503, message: "Could not verify download access." };
    }
  }

  if (await assertAdminTechDrawJobAccess(request, jobId)) {
    return { ok: true, reason: "admin" };
  }

  return {
    ok: false,
    status: 401,
    message: "Payment required to download this drawing set.",
    reason: "payment_required",
  };
}

export async function assertTechDrawDeliverableAccess(request, designId, location) {
  if (location?.kind === "user") {
    return assertUserTechDrawDownloadAccess(request, designId);
  }
  return assertTwoDLibraryDownloadAccess(request, designId);
}

export function userOutputPrefix(location, designId) {
  if (location?.prefix) return location.prefix;
  if (location?.kind === "user") return `qwen_tech_draw_designs/${designId}`;
  return "";
}

/** Ask the API for signed CloudFront URLs. Customer files are not on the public CDN. */
export async function signUserOutputFiles(request, designId, prefix, files) {
  if (!BASE_URL) return { ok: false, status: 503, message: "Download service is not configured." };
  const headers = { "Content-Type": "application/json" };
  const uuid = request.headers.get("user-uuid") || "";
  const adminUuid = request.headers.get("admin-uuid") || "";
  if (uuid) headers["user-uuid"] = uuid;
  if (adminUuid) headers["admin-uuid"] = adminUuid;

  try {
    const res = await fetch(`${BASE_URL}/v1/cad-techdraw/signed-output-urls`, {
      method: "POST",
      headers,
      body: JSON.stringify({ job_id: designId, prefix, files }),
      cache: "no-store",
    });
    const payload = await res.json().catch(() => null);
    if (!payload?.meta?.success) {
      return {
        ok: false,
        status: payload?.data?.reason === "payment_required" ? 401 : 403,
        message: payload?.meta?.message || "You do not have access to this drawing.",
      };
    }
    return { ok: true, urls: payload.data?.urls || {}, prefix: payload.data?.prefix || prefix };
  } catch {
    return { ok: false, status: 503, message: "Could not verify download access." };
  }
}

export async function fetchFirstSignedUserFile(request, designId, prefix, relativePaths) {
  const signed = await signUserOutputFiles(request, designId, prefix, relativePaths);
  if (!signed.ok) return { error: signed };
  for (const rel of relativePaths) {
    const target = signed.urls?.[rel];
    if (!target) continue;
    try {
      const upstream = await fetch(target, { cache: "no-store" });
      if (upstream.ok) return { upstream, target };
    } catch {
      /* try next */
    }
  }
  return { upstream: null };
}
