import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import JSZip from "jszip";
import { resolveTechDrawCdnRoot } from "@/lib/techDraw/techDrawCdnRoots";
import {
  assertTechDrawDeliverableAccess,
  classifyTechDrawLocation,
  signUserOutputFiles,
  userOutputPrefix,
} from "@/lib/techDraw/libraryDownloadAccess";

export const runtime = "nodejs";
/** Allow long ZIP builds on Vercel Pro / similar (ignored elsewhere). */
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const DESIGN_ID_RE = /^[a-f0-9]{24}$/;

const CDN_FETCH_INIT = {
  cache: "no-store",
  headers: {
    Accept: "*/*",
    "User-Agent": "MarathonOS-Frontend/1.0 (techdraw-bundle)",
  },
};

function cdnRoot(source, designId, prefix) {
  return resolveTechDrawCdnRoot({ designId, source, prefix });
}

async function fetchBytes(url) {
  const res = await fetch(url, CDN_FETCH_INIT);
  if (!res.ok) return null;
  return new Uint8Array(await res.arrayBuffer());
}

function sortGeometryKeys(geometryPerSheet) {
  if (!geometryPerSheet || typeof geometryPerSheet !== "object") return [];
  return Object.keys(geometryPerSheet).sort(
    (a, b) => Number(a) - Number(b) || String(a).localeCompare(String(b))
  );
}

function rootJsonFiles(source) {
  if (source === "user") {
    return [
      "dimension_specs.json",
      "view_selection_response.json",
      "dimensions_response.json",
    ];
  }
  return [
    "dimension_specs.json",
    "view_selection_response.json",
    "dimensions_response.json",
    "llm_usage_log.jsonl",
  ];
}

/**
 * GET /api/techdraw-bundle-zip?designId=&source=&prefix=
 * Zips published JSON, combined PDF, and per-sheet PDF/SVG/DXF files.
 * Library and user-upload jobs both require their own download check.
 */
export async function GET(request) {
  const url = new URL(request.url);
  const designId = url.searchParams.get("designId");
  const source = String(url.searchParams.get("source") || "").trim().toLowerCase();
  const prefix = String(url.searchParams.get("prefix") || "").trim();
  const formatFilter = String(url.searchParams.get("format") || "")
    .trim()
    .toLowerCase();

  if (!designId || !DESIGN_ID_RE.test(designId)) {
    return NextResponse.json({ error: "Invalid designId" }, { status: 400 });
  }

  const location = classifyTechDrawLocation({ source, prefix, designId });
  if (!location.ok) {
    return NextResponse.json({ error: "invalid prefix" }, { status: 400 });
  }

  const access = await assertTechDrawDeliverableAccess(request, designId, location);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.message || "payment required" },
      { status: access.status || 401 },
    );
  }

  const userPipeline = location.kind === "user";
  const outputPrefix = userOutputPrefix(location, designId);
  const root = cdnRoot(userPipeline ? "user" : "", designId, location.prefix);
  const signedUrlCache = new Map();

  async function readBytes(relativePath) {
    if (!userPipeline) return fetchBytes(`${root}/${relativePath}`);
    let signedUrl = signedUrlCache.get(relativePath);
    if (!signedUrl) {
      const signed = await signUserOutputFiles(request, designId, outputPrefix, [relativePath]);
      if (!signed.ok) return null;
      signedUrl = signed.urls?.[relativePath];
      if (signedUrl) signedUrlCache.set(relativePath, signedUrl);
    }
    if (!signedUrl) return null;
    return fetchBytes(signedUrl);
  }

  async function readFirst(relativePaths) {
    for (const rel of relativePaths) {
      const buf = await readBytes(rel);
      if (buf) return buf;
    }
    return null;
  }

  const geoBytes = await readBytes("geometry_per_sheet.json");
  if (!geoBytes) {
    return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
  }

  let geometryPerSheet;
  try {
    geometryPerSheet = JSON.parse(new TextDecoder().decode(geoBytes));
  } catch {
    return NextResponse.json({ error: "Invalid geometry JSON" }, { status: 500 });
  }

  const keys = sortGeometryKeys(geometryPerSheet);
  const nSheets = keys.length;
  if (nSheets < 1) {
    return NextResponse.json({ error: "No sheets in bundle" }, { status: 404 });
  }

  const zip = new JSZip();
  const includeAll = !formatFilter || formatFilter === "all";
  const includePdf = includeAll || formatFilter === "pdf";
  const includeSvg = includeAll || formatFilter === "svg";
  const includeDxf = includeAll || formatFilter === "dxf";

  if (includeAll) {
    zip.file("geometry_per_sheet.json", geoBytes);

    for (const name of rootJsonFiles(userPipeline ? "user" : source)) {
      const buf = await readBytes(name);
      if (buf) zip.file(name, buf);
    }
  }

  if (includePdf) {
    const combinedPdf = await readFirst([
      "technical_drawing_simple.pdf",
      "drawing.pdf",
    ]);
    if (combinedPdf) zip.file("technical_drawing_simple.pdf", combinedPdf);
  }

  if (includeAll) {
    const fcstd = await readBytes("technical_drawing_simple.FCStd");
    if (fcstd) zip.file("technical_drawing_simple.FCStd", fcstd);
  }

  /* Sequential fetches reduce peak memory vs Promise.all (helps small serverless). */
  for (let i = 1; i <= nSheets; i++) {
    if (includePdf) {
      const pdf = await readFirst([`sheet_${i}.pdf`, `pdf/sheet_${i}.pdf`]);
      if (pdf) zip.file(`pdf/sheet_${i}.pdf`, pdf);
    }

    if (includeSvg) {
      const svg = await readFirst([`svg/sheet_${i}.svg`, `svg/sheet_${i}_nodim.svg`]);
      if (svg) zip.file(`svg/sheet_${i}.svg`, svg);
    }

    if (includeDxf) {
      const dxf = await readFirst([`dxf/sheet_${i}.dxf`, `sheet_${i}.dxf`]);
      if (dxf) zip.file(`dxf/sheet_${i}.dxf`, dxf);
    }
  }

  const nodeStream = zip.generateNodeStream({
    type: "nodebuffer",
    streamFiles: true,
    compression: "DEFLATE",
    compressionOptions: { level: 4 },
  });

  const webStream = Readable.toWeb(nodeStream);
  const filenamePrefix = userPipeline ? "techdraw-user" : "techdraw";
  const formatSuffix =
    formatFilter === "pdf" || formatFilter === "svg" || formatFilter === "dxf"
      ? `-${formatFilter}`
      : "";

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filenamePrefix}-${designId}${formatSuffix}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
