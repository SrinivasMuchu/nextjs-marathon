import { BASE_URL } from "@/config";
import { fetchTechDrawBundle } from "@/lib/techDraw/fetchTechDrawBundle";
import { notFound, redirect } from "next/navigation";

const DESIGN_ID_RE = /^[a-f0-9]{24}$/;

export async function generateMetadata({ params }) {
  const { designId } = params;
  let route = "";
  if (BASE_URL && DESIGN_ID_RE.test(String(designId || ""))) {
    try {
      const u = `${BASE_URL}/v1/cad/get-design-basic-meta?design_id=${encodeURIComponent(
        designId
      )}`;
      const r = await fetch(u, { cache: "no-store" });
      if (r.ok) {
        const p = await r.json();
        route = String(p?.data?.route || "").trim();
      }
    } catch {}
  }
  return {
    title: "2D Technical Drawings | Marathon OS",
    description:
      "AI-assisted 2D technical drawing set: sheets, dimensions metadata, and downloads (PDF, SVG, DXF).",
    metadataBase: new URL("https://marathon-os.com"),
    alternates: {
      canonical: route
        ? `/library/2d-technical-drawing/${encodeURIComponent(route)}`
        : `/library/2d-technical-drawing/${designId}`,
    },
  };
}

export default async function TwoDTechnicalDrawingByLibraryRoutePage({ params }) {
  const { designId } = params;
  if (!DESIGN_ID_RE.test(designId)) notFound();

  const bundle = await fetchTechDrawBundle(designId);
  const route = String(bundle?.designMeta?.route || "").trim();
  if (route) {
    redirect(`/library/2d-technical-drawing/${encodeURIComponent(route)}`);
  }
  if (!bundle?.geometryPerSheet || typeof bundle.geometryPerSheet !== "object") {
    notFound();
  }
  notFound();
}

