import { NextResponse } from "next/server";
import JSZip from "jszip";
import { TECH_DRAW_LIBRARY_PREFIX } from "@/config";

export const runtime = "nodejs";

const ALLOW_PREFIX = TECH_DRAW_LIBRARY_PREFIX.replace(/\/$/, "");
const DESIGN_ID_RE = /^[a-f0-9]{24}$/;

async function fetchBytes(url) {
  const res = await fetch(url, { next: { revalidate: 120 } });
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

  await Promise.all(
    rootJson.map(async (name) => {
      const buf = await fetchBytes(`${root}/${name}`);
      if (buf) zip.file(name, buf);
    })
  );

  const combinedPdf = await fetchBytes(`${root}/technical_drawing_simple.pdf`);
  if (combinedPdf) zip.file("technical_drawing_simple.pdf", combinedPdf);

  for (let i = 1; i <= nSheets; i++) {
    const [pdf, svg, dxf] = await Promise.all([
      fetchBytes(`${root}/sheet_${i}.pdf`),
      fetchBytes(`${root}/svg/sheet_${i}.svg`),
      fetchBytes(`${root}/dxf/sheet_${i}.dxf`),
    ]);
    if (pdf) zip.file(`pdf/sheet_${i}.pdf`, pdf);
    if (svg) zip.file(`svg/sheet_${i}.svg`, svg);
    if (dxf) zip.file(`dxf/sheet_${i}.dxf`, dxf);
  }

  const out = await zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  return new NextResponse(out, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="techdraw-${designId}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
