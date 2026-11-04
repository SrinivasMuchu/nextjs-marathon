import { NextResponse } from "next/server";
import { resolveTechDrawCdnRoot } from "@/lib/techDraw/techDrawCdnRoots";
import {
  assertTechDrawDeliverableAccess,
  classifyTechDrawLocation,
  fetchFirstSignedUserFile,
  isPaidTechDrawDeliverable,
  userOutputPrefix,
} from "@/lib/techDraw/libraryDownloadAccess";

const DESIGN_ID_RE = /^[a-f0-9]{24}$/;

const CDN_FETCH_INIT = {
  cache: "no-store",
  headers: {
    Accept: "*/*",
    "User-Agent": "MarathonOS-Frontend/1.0 (techdraw-file)",
  },
};

function mimeFor(ext) {
  if (ext === "svg") return "image/svg+xml; charset=utf-8";
  if (ext === "dxf") return "application/dxf";
  if (ext === "pdf") return "application/pdf";
  if (ext === "fcstd") return "application/octet-stream";
  if (ext === "glb") return "model/gltf-binary";
  if (ext === "stl") return "model/stl";
  return "application/octet-stream";
}

function cdnRoot(source, designId) {
  if (source === "user") return `${USER_PREFIX}/${designId}`;
  return `${LIBRARY_PREFIX}/${designId}`;
}

/** Ordered CDN paths to try (first match wins). */
function targetUrls(root, { sheet, ext, variant, file }) {
  if (file) {
    const name = String(file).replace(/^\/+/, "");
    return [`${root}/${name}`];
  }

  const n = Number(sheet);
  if (!Number.isInteger(n) || n < 1) return [];

  if (ext === "pdf") {
    return [
      `${root}/sheet_${n}.pdf`,
      `${root}/pdf/sheet_${n}.pdf`,
      `${root}/technical_drawing_simple.pdf`,
    ];
  }

  if (ext === "svg") {
    if (variant === "nodim") {
      return [`${root}/svg/sheet_${n}_nodim.svg`];
    }
    return [
      `${root}/svg/sheet_${n}.svg`,
      `${root}/svg/sheet_${n}_nodim.svg`,
    ];
  }

  if (ext === "dxf") {
    return [`${root}/dxf/sheet_${n}.dxf`, `${root}/sheet_${n}.dxf`];
  }

  return [];
}

async function fetchFirstOk(urls) {
  for (const target of urls) {
    try {
      const upstream = await fetch(target, CDN_FETCH_INIT);
      if (upstream.ok) return { upstream, target };
    } catch {
      /* try next */
    }
  }
  return null;
}

export async function GET(request) {
  const url = new URL(request.url);
  const designId = String(url.searchParams.get("designId") || "").trim();
  const sheet = Number(url.searchParams.get("sheet"));
  const ext = String(url.searchParams.get("ext") || "").trim().toLowerCase();
  const source = String(url.searchParams.get("source") || "").trim().toLowerCase();
  const variant = String(url.searchParams.get("variant") || "").trim().toLowerCase();
  const file = String(url.searchParams.get("file") || "").trim();
  const prefix = String(url.searchParams.get("prefix") || "").trim();
  const dispositionParam = String(url.searchParams.get("disposition") || "")
    .trim()
    .toLowerCase();

  if (!DESIGN_ID_RE.test(designId)) {
    return NextResponse.json({ error: "invalid designId" }, { status: 400 });
  }

  if (file) {
    const lower = file.toLowerCase();
    if (lower.includes("..") || lower.includes("/") || lower.includes("\\")) {
      return NextResponse.json({ error: "invalid file" }, { status: 400 });
    }
    if (
      !lower.endsWith(".pdf") &&
      !lower.endsWith(".fcstd") &&
      !lower.endsWith(".glb") &&
      !lower.endsWith(".stl")
    ) {
      return NextResponse.json({ error: "invalid file" }, { status: 400 });
    }
  } else {
    if (!Number.isInteger(sheet) || sheet < 1) {
      return NextResponse.json({ error: "invalid sheet" }, { status: 400 });
    }
    if (!["svg", "dxf", "pdf", "fcstd"].includes(ext)) {
      return NextResponse.json({ error: "invalid ext" }, { status: 400 });
    }
  }

  const location = classifyTechDrawLocation({ source, prefix, designId });
  if (!location.ok) {
    return NextResponse.json({ error: "invalid prefix" }, { status: 400 });
  }

  const gated = isPaidTechDrawDeliverable({
    ext: file ? file.split(".").pop() : ext,
    disposition: dispositionParam,
    file,
  });
  if (gated) {
    const access = await assertTechDrawDeliverableAccess(request, designId, location);
    if (!access.ok) {
      return NextResponse.json({ error: access.message || "payment required" }, { status: access.status || 401 });
    }
  }

  const relativePaths = targetUrls("rel", { sheet, ext, variant, file }).map((item) =>
    item.replace(/^rel\//, ""),
  );
  if (!relativePaths.length) {
    return NextResponse.json({ error: "invalid params" }, { status: 400 });
  }

  let hit = null;
  if (location.kind === "user") {
    const signed = await fetchFirstSignedUserFile(
      request,
      designId,
      userOutputPrefix(location, designId),
      relativePaths,
    );
    if (signed?.error) {
      return NextResponse.json(
        { error: signed.error.message || "payment required" },
        { status: signed.error.status || 401 },
      );
    }
    hit = signed?.upstream ? signed : null;
  } else {
    const root = resolveTechDrawCdnRoot({ designId, source: "", prefix: location.prefix });
    const urls = targetUrls(root, { sheet, ext, variant, file });
    hit = await fetchFirstOk(urls);
  }
  if (!hit) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const resolvedExt = file
    ? String(file).split(".").pop().toLowerCase()
    : ext;
  const inline = dispositionParam !== "attachment" && resolvedExt !== "fcstd";
  const body = await hit.upstream.arrayBuffer();

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": mimeFor(resolvedExt),
      "Content-Disposition": inline ? "inline" : `attachment; filename="${file || `sheet_${sheet}.${resolvedExt}`}"`,
      "Cache-Control": location.kind === "user" || gated ? "private, no-store" : "public, max-age=120, s-maxage=120",
    },
  });
}
