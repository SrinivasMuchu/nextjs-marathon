import TwoDTechnicalDrawingPage from "@/Components/IndustryDesigns/TwoDTechnicalDrawingPage";
import TwoDTechnicalDrawingContent from "@/Components/IndustryDesigns/TwoDTechnicalDrawingContent";
import TwoDTechnicalDrawingPageJsonLd from "@/Components/JsonLdSchemas/TwoDTechnicalDrawingPageJsonLd";
import { BASE_URL, TECH_DRAW_LIBRARY_PREFIX } from "@/config";
import { buildPageMetadata, buildTwoDDrawingMetadata } from "@/lib/seo/pageMetadata";
import { fetchTechDrawBundle } from "@/lib/techDraw/fetchTechDrawBundle";
import { mapTechDrawBundleToPageProps } from "@/lib/techDraw/mapTechDrawBundleToPageProps";
import {
  buildTwoDDrawingHeroStatsFromGeometry,
  buildTwoDDrawingHeroTitle,
} from "@/lib/techDraw/twoDDrawingPageHelpers";
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

export async function generateMetadata({ params }) {
  const designRoute = String(params?.designRoute || "").trim();
  const design = await fetchDesignByRoute(designRoute);
  const productName = String(
    design?.page_title ||
      design?.part_name ||
      designRoute.replace(/-/g, " ").trim() ||
      "Product"
  ).trim();
  const { title, description } = buildTwoDDrawingMetadata(productName);
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

  const title = String(design?.page_title || design?.part_name || "2D Technical Drawing Set").trim();
  const cadModelHref = `/library/${encodeURIComponent(designRoute)}`;
  const { description: pageDescription } = buildTwoDDrawingMetadata(title);
  const breadcrumbLinks = [
    { label: "Library", href: "/library" },
    { label: "2D Technical Drawings", href: "/library/2d-technical-drawings" },
    { label: title },
  ];

  const savedAtUtc =
    bundle.viewSelectionResponse?.saved_at_utc ||
    bundle.dimensionsResponse?.saved_at_utc ||
    "";

  const heroProps = {
    title: buildTwoDDrawingHeroTitle(title),
    tags: [],
    stats: buildTwoDDrawingHeroStatsFromGeometry(bundle.geometryPerSheet, {
      savedAtUtc,
      sourceCadFormat: design?.file_type || bundle.designMeta?.file_type || "step",
      sourceModelTitle: title,
      sourceModelHref: cadModelHref,
    }),
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
      <TwoDTechnicalDrawingPage
        breadcrumbLinks={breadcrumbLinks}
        heroProps={heroProps}
        designId={designId}
        cadModelHref={cadModelHref}
      >
        <TwoDTechnicalDrawingContent
          {...contentProps}
          cadModelHref={cadModelHref}
          currentDesignId={designId}
        />
      </TwoDTechnicalDrawingPage>
    </>
  );
}
