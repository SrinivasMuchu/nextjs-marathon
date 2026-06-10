import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import JSZip from "jszip";
import { DESIGN_GLB_PREFIX_URL, TECH_DRAW_LIBRARY_PREFIX } from "@/config";

export const runtime = "nodejs";
/** Allow long ZIP builds on Vercel Pro / similar (ignored elsewhere). */
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const LIBRARY_PREFIX = TECH_DRAW_LIBRARY_PREFIX.replace(/\/$/, "");
const USER_PREFIX = `${DESIGN_GLB_PREFIX_URL.replace(/\/$/, "")}/user-freecad-techdraw`;
const DESIGN_ID_RE = /^[a-f0-9]{24}$/;

const CDN_FETCH_INIT = {
  cache: "no-store",
  headers: {
    Accept: "*/*",
    "User-Agent": "MarathonOS-Frontend/1.0 (techdraw-bundle)",
  },
};

function cdnRoot(source, designId) {
  if (source === "user") return `${USER_PREFIX}/${designId}`;
  return `${LIBRARY_PREFIX}/${designId}`;
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

  if (!designId || !DESIGN_ID_RE.test(designId)) {
    return NextResponse.json({ error: "Invalid designId" }, { status: 400 });
  }

  const root = cdnRoot(source, designId);

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
  zip.file("geometry_per_sheet.json", geoBytes);

  for (const name of rootJsonFiles(source)) {
    const buf = await fetchBytes(`${root}/${name}`);
    if (buf) zip.file(name, buf);
  }

  const combinedPdf = await fetchFirstBytes([
    `${root}/technical_drawing_simple.pdf`,
    `${root}/drawing.pdf`,
  ]);
  if (combinedPdf) zip.file("technical_drawing_simple.pdf", combinedPdf);

  const fcstd = await fetchBytes(`${root}/technical_drawing_simple.FCStd`);
  if (fcstd) zip.file("technical_drawing_simple.FCStd", fcstd);

  /* Sequential fetches reduce peak memory vs Promise.all (helps small serverless). */
  for (let i = 1; i <= nSheets; i++) {
    const pdf = await fetchSheetPdf(root, i);
    if (pdf) zip.file(`pdf/sheet_${i}.pdf`, pdf);

    const svg = await fetchSheetSvg(root, i);
    if (svg) zip.file(`svg/sheet_${i}.svg`, svg);

    const dxf = await fetchSheetDxf(root, i);
    if (dxf) zip.file(`dxf/sheet_${i}.dxf`, dxf);
  }

  const nodeStream = zip.generateNodeStream({
    type: "nodebuffer",
    streamFiles: true,
    compression: "DEFLATE",
    compressionOptions: { level: 4 },
  });

  const webStream = Readable.toWeb(nodeStream);
  const filenamePrefix = source === "user" ? "techdraw-user" : "techdraw";

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filenamePrefix}-${designId}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
