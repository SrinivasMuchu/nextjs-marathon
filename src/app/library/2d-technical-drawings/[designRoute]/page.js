import TwoDTechnicalDrawingPage from "@/Components/IndustryDesigns/TwoDTechnicalDrawingPage";
import TwoDTechnicalDrawingContent from "@/Components/IndustryDesigns/TwoDTechnicalDrawingContent";
import TwoDTechnicalDrawingPageJsonLd from "@/Components/JsonLdSchemas/TwoDTechnicalDrawingPageJsonLd";
import { BASE_URL, TECH_DRAW_LIBRARY_PREFIX } from "@/config";
import { buildPageMetadata, buildTwoDDrawingMetadata, deriveTwoDDrawingMetaFromGeometry } from "@/lib/seo/pageMetadata";
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

async function fetchGeometryPerSheet(designId) {
  try {
    const base = `${TECH_DRAW_LIBRARY_PREFIX}/${designId}`;
    const res = await fetch(`${base}/geometry_per_sheet.json`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function deriveHeroStatsFromGeometry(geo) {
  if (!geo || typeof geo !== "object") return null;
  const entries = Object.values(geo);
  const views = new Set(
    entries.map((e) => String(e?.view_name || "").trim()).filter(Boolean)
  ).size;
  const sections = entries.filter((e) => {
    const label = String(e?.label || "");
    const view = String(e?.view_name || "");
    return /section/i.test(label) || /^section/i.test(view);
  }).length;
  return {
    sheets: entries.length,
    views,
    sections,
  };
}

export async function generateMetadata({ params }) {
  const designRoute = String(params?.designRoute || "").trim();
  const design = await fetchDesignByRoute(designRoute);
  const productName = String(
    design?.page_title ||
      design?.part_name ||
      designRoute.replace(/-/g, " ").trim() ||
      "Product"
  ).trim();
  const designId = String(design?._id || "").trim();
  const geometryPerSheet =
    /^[a-f0-9]{24}$/i.test(designId) ? await fetchGeometryPerSheet(designId) : null;
  const { viewType, sectionDetailType } = deriveTwoDDrawingMetaFromGeometry(geometryPerSheet);
  const { title, description } = buildTwoDDrawingMetadata(productName, {
    viewType,
    sectionDetailType,
  });
  const canonicalPath = `/library/2d-technical-drawings/${encodeURIComponent(designRoute)}`;

  return buildPageMetadata({
    title,
    description,
    canonicalPath,
  });
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
  const { baseUrl: _u, ...contentProps } = props;

  const lightStats = deriveHeroStatsFromGeometry(bundle.geometryPerSheet);
  const title = String(design?.page_title || design?.part_name || "2D Technical Drawing Set").trim();
  const cadModelHref = `/library/${encodeURIComponent(designRoute)}`;
  const { viewType, sectionDetailType } = deriveTwoDDrawingMetaFromGeometry(bundle.geometryPerSheet);
  const { description: pageDescription } = buildTwoDDrawingMetadata(title, {
    viewType,
    sectionDetailType,
  });
  const breadcrumbLinks = [
    { label: "Library", href: "/library" },
    { label: "2D Technical Drawings", href: "/library/2d-technical-drawings" },
    { label: title },
  ];

  const heroProps = {
    title: `${title} — 2D Technical Drawing Set (2D CAD drawings)`,
    tags: [],
    stats: [
      { value: String(lightStats?.sheets ?? "0"), label: "Drawing Sheets" },
      { value: String(lightStats?.views ?? "0"), label: "Views Analysed" },
      { value: "3", label: "Export Formats" },
      { value: String(lightStats?.sections ?? "0"), label: "Section Cuts" },
      { value: "1st Angle", label: "Projection" },
    ],
    showBadges: true,
  };

  return (
    <>
      <TwoDTechnicalDrawingPageJsonLd
        designRoute={designRoute}
        designId={designId}
        pageTitle={title}
        description={pageDescription}
      />
      <TwoDTechnicalDrawingPage breadcrumbLinks={breadcrumbLinks} heroProps={heroProps} designId={designId}>
        <TwoDTechnicalDrawingContent
          {...contentProps}
          cadModelHref={cadModelHref}
          currentDesignId={designId}
        />
      </TwoDTechnicalDrawingPage>
    </>
  );
}

