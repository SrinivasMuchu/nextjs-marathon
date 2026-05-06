import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import JSZip from "jszip";
import { TECH_DRAW_LIBRARY_PREFIX } from "@/config";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const ALLOW_PREFIX = TECH_DRAW_LIBRARY_PREFIX.replace(/\/$/, "");
const DESIGN_ID_RE = /^[a-f0-9]{24}$/;

const CDN_FETCH_INIT = {
  cache: "no-store",
  headers: {
    Accept: "*/*",
    "User-Agent": "MarathonOS-Frontend/1.0 (techdraw-pdf-bundle)",
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
 * GET /api/techdraw-pdf-bundle?designId=
 * Bundles all known PDFs for a design: technical drawing + per-sheet PDFs.
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

  const nSheets = sortGeometryKeys(geometryPerSheet).length;
  if (nSheets < 1) {
    return NextResponse.json({ error: "No sheets in bundle" }, { status: 404 });
  }

  const zip = new JSZip();
  let added = 0;

  const rootPdfCandidates = [
    "technical_drawing_simple.pdf",
    "drawing.pdf",
  ];
  for (const name of rootPdfCandidates) {
    const pdf = await fetchBytes(`${root}/${name}`);
    if (pdf) {
      zip.file(name, pdf);
      added += 1;
    }
  }

  for (let i = 1; i <= nSheets; i += 1) {
    const fileName = `sheet_${i}.pdf`;
    const sheetPdf =
      (await fetchBytes(`${root}/${fileName}`)) ||
      (await fetchBytes(`${root}/pdf/${fileName}`));
    if (sheetPdf) {
      zip.file(`sheets/${fileName}`, sheetPdf);
      added += 1;
    }
  }

  if (!added) {
    return NextResponse.json({ error: "No PDFs found in bundle" }, { status: 404 });
  }

  /* STORE: PDFs barely compress; faster CPU on serverless. */
  const nodeStream = zip.generateNodeStream({
    type: "nodebuffer",
    streamFiles: true,
    compression: "STORE",
  });

  const webStream = Readable.toWeb(nodeStream);

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="techdraw-pdfs-${designId}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
