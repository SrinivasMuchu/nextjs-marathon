import TwoDTechnicalDrawingPage from "@/Components/IndustryDesigns/TwoDTechnicalDrawingPage";
import TwoDTechnicalDrawingContent from "@/Components/IndustryDesigns/TwoDTechnicalDrawingContent";
import { BASE_URL } from "@/config";
import { fetchTechDrawBundle } from "@/lib/techDraw/fetchTechDrawBundle";
import { mapTechDrawBundleToPageProps } from "@/lib/techDraw/mapTechDrawBundleToPageProps";
import { notFound } from "next/navigation";

async function fetchDesignByRoute(designRoute) {
  if (!BASE_URL) return null;
  try {
    const url = `${BASE_URL}/v1/cad/get-industry-part-design?industry_design_route=${encodeURIComponent(
      designRoute
    )}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const payload = await res.json();
    return payload?.data?.response || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const designRoute = String(params?.designRoute || "").trim();
  return {
    title: "2D Technical Drawings | Marathon OS",
    description:
      "AI-assisted 2D technical drawing set: sheets, dimensions metadata, and downloads (PDF, SVG, DXF).",
    metadataBase: new URL("https://marathon-os.com"),
    alternates: {
      canonical: `/library/2d-technical-drawing/${encodeURIComponent(designRoute)}`,
    },
  };
}

export default async function TwoDTechnicalDrawingByDesignRoutePage({ params }) {
  const designRoute = String(params?.designRoute || "").trim();
  if (!designRoute) notFound();

  const design = await fetchDesignByRoute(designRoute);
  const designId = String(design?._id || "").trim();
  if (!/^[a-f0-9]{24}$/i.test(designId)) notFound();

  const bundle = await fetchTechDrawBundle(designId);
  if (!bundle.geometryPerSheet || typeof bundle.geometryPerSheet !== "object") {
    notFound();
  }

  const props = mapTechDrawBundleToPageProps(designId, bundle);
  const { breadcrumbLinks, heroProps, baseUrl: _u, ...contentProps } = props;

  return (
    <TwoDTechnicalDrawingPage breadcrumbLinks={breadcrumbLinks} heroProps={heroProps}>
      <TwoDTechnicalDrawingContent {...contentProps} currentDesignId={designId} />
    </TwoDTechnicalDrawingPage>
  );
}

