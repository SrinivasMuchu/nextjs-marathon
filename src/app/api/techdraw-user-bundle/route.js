import { NextResponse } from "next/server";
import {
  classifyTechDrawLocation,
  signUserOutputFiles,
} from "@/lib/techDraw/libraryDownloadAccess";

const DESIGN_ID_RE = /^[a-f0-9]{24}$/;

const JSON_FILES = [
  "geometry_per_sheet.json",
  "view_selection_response.json",
  "dimension_specs.json",
  "dimension_specs_meta.json",
  "dimension_rejections.json",
  "gdt_scheme.json",
  "drawing_details.json",
];

async function fetchSignedJson(request, designId, prefix, file) {
  const signed = await signUserOutputFiles(request, designId, prefix, [file]);
  if (!signed.ok) return { error: signed };
  const url = signed.urls?.[file];
  if (!url) return { data: null };
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return { data: null };
  if (file.endsWith(".py")) return { data: await res.text() };
  return { data: await res.json() };
}

/**
 * Owner/admin bundle JSON for a customer TechDraw job.
 * The browser must not read these files from the public CDN.
 */
export async function GET(request) {
  const url = new URL(request.url);
  const designId = String(url.searchParams.get("designId") || "").trim();
  const prefixParam = String(url.searchParams.get("prefix") || "").trim();
  if (!DESIGN_ID_RE.test(designId)) {
    return NextResponse.json({ error: "invalid designId" }, { status: 400 });
  }

  const prefixes = [];
  if (prefixParam) prefixes.push(prefixParam);
  prefixes.push(`freecad-techdraw/${designId}`);
  prefixes.push(`qwen_tech_draw_designs/${designId}`);
  prefixes.push(`user-freecad-techdraw/${designId}`);
  prefixes.push(`freecad-2d-techdraw/${designId}`);
  prefixes.push(`techdraw-output/${designId}`);

  const seen = new Set();
  for (const prefix of prefixes) {
    if (!prefix || seen.has(prefix)) continue;
    seen.add(prefix);
    const location = classifyTechDrawLocation({ prefix, designId });
    if (!location.ok || location.kind !== "user") continue;

    const geometry = await fetchSignedJson(
      request,
      designId,
      location.prefix,
      "geometry_per_sheet.json",
    );
    if (geometry.error) {
      return NextResponse.json(
        { error: geometry.error.message || "forbidden" },
        { status: geometry.error.status || 401 },
      );
    }
    if (!geometry.data || typeof geometry.data !== "object") continue;

    const rest = {};
    await Promise.all(
      JSON_FILES.slice(1).map(async (file) => {
        const loaded = await fetchSignedJson(request, designId, location.prefix, file);
        rest[file] = loaded.error ? null : loaded.data;
      }),
    );
    const config = await fetchSignedJson(request, designId, location.prefix, "drawing_config_simple.py");

    return NextResponse.json({
      baseUrl: "",
      outputS3Prefix: location.prefix,
      geometryPerSheet: geometry.data,
      viewSelectionResponse: rest["view_selection_response.json"],
      dimensionSpecs: rest["dimension_specs.json"],
      dimensionSpecsMeta: rest["dimension_specs_meta.json"],
      dimensionRejections: rest["dimension_rejections.json"],
      gdtScheme: rest["gdt_scheme.json"],
      drawingConfigPy: config.error ? "" : config.data || "",
      drawingDetailsJson: rest["drawing_details.json"],
      dimensionsResponse: null,
      designMeta: null,
      availabilityBySheet: null,
      isUserPipelineOutput: true,
    });
  }

  return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
}
