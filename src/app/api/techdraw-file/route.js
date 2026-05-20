import { NextResponse } from "next/server";
import { DESIGN_GLB_PREFIX_URL, TECH_DRAW_LIBRARY_PREFIX } from "@/config";

const LIBRARY_PREFIX = TECH_DRAW_LIBRARY_PREFIX.replace(/\/$/, "");
const USER_PREFIX = `${DESIGN_GLB_PREFIX_URL.replace(/\/$/, "")}/user-freecad-techdraw`;
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
  const dispositionParam = String(url.searchParams.get("disposition") || "")
    .trim()
    .toLowerCase();

  if (!DESIGN_ID_RE.test(designId)) {
    return NextResponse.json({ error: "invalid designId" }, { status: 400 });
  }

  if (file) {
    if (!file.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "invalid file" }, { status: 400 });
    }
  } else {
    if (!Number.isInteger(sheet) || sheet < 1) {
      return NextResponse.json({ error: "invalid sheet" }, { status: 400 });
    }
    if (!["svg", "dxf", "pdf"].includes(ext)) {
      return NextResponse.json({ error: "invalid ext" }, { status: 400 });
    }
  }

  const root = cdnRoot(source, designId);
  const urls = targetUrls(root, { sheet, ext, variant, file });
  if (!urls.length) {
    return NextResponse.json({ error: "invalid params" }, { status: 400 });
  }

  const hit = await fetchFirstOk(urls);
  if (!hit) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const resolvedExt = file ? "pdf" : ext;
  const inline = dispositionParam !== "attachment";
  const body = await hit.upstream.arrayBuffer();

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": mimeFor(resolvedExt),
      "Content-Disposition": inline ? "inline" : `attachment; filename="${file || `sheet_${sheet}.${resolvedExt}`}"`,
      "Cache-Control": "public, max-age=120, s-maxage=120",
    },
  });
}
