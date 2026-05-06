import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import JSZip from "jszip";
import { TECH_DRAW_LIBRARY_PREFIX } from "@/config";

export const runtime = "nodejs";
/** Allow long ZIP builds on Vercel Pro / similar (ignored elsewhere). */
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const ALLOW_PREFIX = TECH_DRAW_LIBRARY_PREFIX.replace(/\/$/, "");
const DESIGN_ID_RE = /^[a-f0-9]{24}$/;

const CDN_FETCH_INIT = {
  cache: "no-store",
  headers: {
    Accept: "*/*",
    "User-Agent": "MarathonOS-Frontend/1.0 (techdraw-bundle)",
  },
};

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

/**
 * GET /api/techdraw-bundle-zip?designId= — zips published JSON, PDFs, svg/, and dxf/.
 */
export async function GET(request) {
  const designId = new URL(request.url).searchParams.get("designId");
  if (!designId || !DESIGN_ID_RE.test(designId)) {
    return NextResponse.json({ error: "Invalid designId" }, { status: 400 });
  }

  const root = `${ALLOW_PREFIX}/${designId}`;

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

  const rootJson = [
    "dimension_specs.json",
    "view_selection_response.json",
    "dimensions_response.json",
    "llm_usage_log.jsonl",
  ];

  for (const name of rootJson) {
    const buf = await fetchBytes(`${root}/${name}`);
    if (buf) zip.file(name, buf);
  }

  const combinedPdf = await fetchBytes(`${root}/technical_drawing_simple.pdf`);
  if (combinedPdf) zip.file("technical_drawing_simple.pdf", combinedPdf);

  /* Sequential fetches reduce peak memory vs Promise.all (helps small serverless). */
  for (let i = 1; i <= nSheets; i++) {
    const pdf = await fetchBytes(`${root}/sheet_${i}.pdf`);
    if (pdf) zip.file(`pdf/sheet_${i}.pdf`, pdf);
    const svg = await fetchBytes(`${root}/svg/sheet_${i}.svg`);
    if (svg) zip.file(`svg/sheet_${i}.svg`, svg);
    const dxf = await fetchBytes(`${root}/dxf/sheet_${i}.dxf`);
    if (dxf) zip.file(`dxf/sheet_${i}.dxf`, dxf);
  }

  const nodeStream = zip.generateNodeStream({
    type: "nodebuffer",
    streamFiles: true,
    compression: "DEFLATE",
    compressionOptions: { level: 4 },
  });

  const webStream = Readable.toWeb(nodeStream);

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="techdraw-${designId}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
