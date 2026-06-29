import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import JSZip from "jszip";
import { resolveTechDrawCdnRoot } from "@/lib/techDraw/techDrawCdnRoots";

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

function isUserPipelineSource(source, prefix) {
  return Boolean(String(prefix || "").trim()) || source === "user";
}

async function fetchBytes(url) {
  const res = await fetch(url, CDN_FETCH_INIT);
  if (!res.ok) return null;
  return new Uint8Array(await res.arrayBuffer());
}

async function fetchFirstBytes(urls) {
  for (const url of urls) {
    const bytes = await fetchBytes(url);
    if (bytes) return bytes;
  }
  return null;
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

async function fetchSheetPdf(root, sheetNum) {
  return fetchFirstBytes([
    `${root}/sheet_${sheetNum}.pdf`,
    `${root}/pdf/sheet_${sheetNum}.pdf`,
  ]);
}

async function fetchSheetSvg(root, sheetNum) {
  return fetchFirstBytes([
    `${root}/svg/sheet_${sheetNum}.svg`,
    `${root}/svg/sheet_${sheetNum}_nodim.svg`,
  ]);
}

async function fetchSheetDxf(root, sheetNum) {
  return fetchFirstBytes([
    `${root}/dxf/sheet_${sheetNum}.dxf`,
    `${root}/sheet_${sheetNum}.dxf`,
  ]);
}

/**
 * GET /api/techdraw-bundle-zip?designId=&source=
 * Zips published JSON, combined PDF, and per-sheet PDF/SVG/DXF files.
 * source=user reads from user-freecad-techdraw/{designId} on CDN.
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

  const root = cdnRoot(source, designId, prefix);
  const userPipeline = isUserPipelineSource(source, prefix);

  const geoBytes = await fetchBytes(`${root}/geometry_per_sheet.json`);
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
      const buf = await fetchBytes(`${root}/${name}`);
      if (buf) zip.file(name, buf);
    }
  }

  if (includePdf) {
    const combinedPdf = await fetchFirstBytes([
      `${root}/technical_drawing_simple.pdf`,
      `${root}/drawing.pdf`,
    ]);
    if (combinedPdf) zip.file("technical_drawing_simple.pdf", combinedPdf);
  }

  if (includeAll) {
    const fcstd = await fetchBytes(`${root}/technical_drawing_simple.FCStd`);
    if (fcstd) zip.file("technical_drawing_simple.FCStd", fcstd);
  }

  /* Sequential fetches reduce peak memory vs Promise.all (helps small serverless). */
  for (let i = 1; i <= nSheets; i++) {
    if (includePdf) {
      const pdf = await fetchSheetPdf(root, i);
      if (pdf) zip.file(`pdf/sheet_${i}.pdf`, pdf);
    }

    if (includeSvg) {
      const svg = await fetchSheetSvg(root, i);
      if (svg) zip.file(`svg/sheet_${i}.svg`, svg);
    }

    if (includeDxf) {
      const dxf = await fetchSheetDxf(root, i);
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
