import TwoDTechnicalDrawingPage from "@/Components/IndustryDesigns/TwoDTechnicalDrawingPage";
import TwoDTechnicalDrawingContent from "@/Components/IndustryDesigns/TwoDTechnicalDrawingContent";
import { fetchTechDrawBundle } from "@/lib/techDraw/fetchTechDrawBundle";
import { mapTechDrawBundleToPageProps } from "@/lib/techDraw/mapTechDrawBundleToPageProps";
import { notFound } from "next/navigation";

const DESIGN_ID_RE = /^[a-f0-9]{24}$/;

export async function generateMetadata({ params }) {
  const { industry_design, designId } = params;
  return {
    title: "2D Technical Drawings | Marathon OS",
    description:
      "AI-assisted 2D technical drawing set: sheets, dimensions metadata, and downloads (PDF, SVG, DXF).",
    metadataBase: new URL("https://marathon-os.com"),
    alternates: {
      canonical: `/library/${encodeURIComponent(
        industry_design
      )}/2d-technical-drawing/${designId}`,
    },
  };
}

export default async function TwoDTechnicalDrawingByLibraryRoutePage({ params }) {
  const { designId } = params;
  if (!DESIGN_ID_RE.test(designId)) notFound();

  const bundle = await fetchTechDrawBundle(designId);
  if (!bundle.geometryPerSheet || typeof bundle.geometryPerSheet !== "object") {
    notFound();
  }

  const props = mapTechDrawBundleToPageProps(designId, bundle);
  const { breadcrumbLinks, heroProps, designId: _d, baseUrl: _u, ...contentProps } = props;

  return (
    <TwoDTechnicalDrawingPage breadcrumbLinks={breadcrumbLinks} heroProps={heroProps}>
      <TwoDTechnicalDrawingContent {...contentProps} />
    </TwoDTechnicalDrawingPage>
  );
}

