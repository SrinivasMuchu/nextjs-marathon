import { notFound, redirect } from "next/navigation";
import TwoDLibrary from "@/Components/Library/TwoDLibrary";
import TwoDTechnicalDrawingPage from "@/Components/IndustryDesigns/TwoDTechnicalDrawingPage";
import TwoDLibraryDrawingDownloads from "@/Components/IndustryDesigns/TwoDLibraryDrawingDownloads";
import TwoDTechnicalDrawingPageJsonLd from "@/Components/JsonLdSchemas/TwoDTechnicalDrawingPageJsonLd";
import { BASE_URL, TECH_DRAW_LIBRARY_PREFIX } from "@/config";
import { resolveCategorySlugToName } from "@/common.helper";
import { fetchTwoDLibraryCategories } from "@/api/twoDLibraryDesignsApi";
import { buildPageMetadata, buildTwoDDrawingMetadata } from "@/lib/seo/pageMetadata";
import { fetchTechDrawBundle } from "@/lib/techDraw/fetchTechDrawBundle";
import { mapTechDrawBundleToPageProps } from "@/lib/techDraw/mapTechDrawBundleToPageProps";
import {
  buildTwoDDrawingHeroStatsFromGeometry,
  buildTwoDDrawingHeroTitle,
} from "@/lib/techDraw/twoDDrawingPageHelpers";
import {
  TWO_D_LIBRARY_BASE,
  TWO_D_LIBRARY_TITLE,
  TWO_D_LIBRARY_DESCRIPTION,
  get2DLibraryPath,
  get2DLibraryPathWithQuery,
  isTwoDDesignRoute,
} from "@/data/twoDLibraryPage";

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

/** Mongo-only fields (version is not in Elasticsearch). */
async function fetchDesignVersionMeta(designId) {
  if (!BASE_URL || !designId) return null;
  try {
    const url = `${BASE_URL}/v1/cad/get-design-basic-meta?design_id=${encodeURIComponent(designId)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const payload = await res.json();
    return payload?.meta?.success ? payload?.data || null : null;
  } catch {
    return null;
  }
}

async function fetchCategories() {
  return fetchTwoDLibraryCategories();
}

function stripCategoryFromSearchParams(searchParams) {
  if (!searchParams) return {};
  const { category: _category, ...rest } = searchParams;
  return rest;
}

export async function generateMetadata({ params, searchParams }) {
  const segment = String(params?.designRoute || "").trim();
  if (!segment) {
    return buildPageMetadata({
      title: TWO_D_LIBRARY_TITLE,
      description: TWO_D_LIBRARY_DESCRIPTION,
      canonicalPath: TWO_D_LIBRARY_BASE,
    });
  }

  if (isTwoDDesignRoute(segment)) {
    const design = await fetchDesignByRoute(segment);
    const productName = String(
      design?.page_title ||
        design?.part_name ||
        segment.replace(/-/g, " ").trim() ||
        "Product"
    ).trim();
    const { title, description } = buildTwoDDrawingMetadata(productName);
    const canonicalPath = `/library/2d-technical-drawings/${encodeURIComponent(segment)}`;

    return buildPageMetadata({
      title,
      description,
      canonicalPath,
    });
  }

  const categories = await fetchCategories();
  const categoryName = resolveCategorySlugToName(segment, categories);
  if (!categoryName) {
    return buildPageMetadata({
      title: TWO_D_LIBRARY_TITLE,
      description: TWO_D_LIBRARY_DESCRIPTION,
      canonicalPath: TWO_D_LIBRARY_BASE,
    });
  }

  const page = parseInt(searchParams?.page, 10) || 1;
  const title = `${categoryName} 2D Technical Drawings | PDF, SVG, DXF | Marathon OS${
    page > 1 ? ` - Page ${page}` : ""
  }`;
  const description = `Browse ${categoryName} 2D technical drawings generated from 3D CAD models. Download PDF, SVG and DXF drawing sets for engineering review.`;

  return buildPageMetadata({
    title,
    description,
    canonicalPath: get2DLibraryPath({ categoryName }),
  });
}

async function renderDesignPage(designRoute) {
  const design = await fetchDesignByRoute(designRoute);
  const designId = String(design?._id || "").trim();
  if (!/^[a-f0-9]{24}$/i.test(designId)) notFound();

  // version / output_s3_prefix are Mongo-only (not in ES) — prefer basic-meta.
  const versionMeta = await fetchDesignVersionMeta(designId);
  const isVersioned = Boolean(versionMeta?.version ?? design?.version);
  const outputS3Prefix = String(
    versionMeta?.output_s3_prefix ||
      design?.output_s3_prefix ||
      (isVersioned ? `techdraw-v2/${designId}` : ""),
  ).trim();

  const bundle = await fetchTechDrawBundle(designId, {
    version: isVersioned,
    outputS3Prefix,
    designMeta: {
      ...design,
      version: isVersioned,
      output_s3_prefix: outputS3Prefix || undefined,
    },
  });
  if (!bundle.geometryPerSheet || typeof bundle.geometryPerSheet !== "object") {
    notFound();
  }

  const props = mapTechDrawBundleToPageProps(designId, {
    ...bundle,
    version: isVersioned,
  });
  const { baseUrl: _u, ...contentProps } = props;

  const title = String(design?.page_title || design?.part_name || "2D Technical Drawing Set").trim();
  const cadModelHref = `/library/${encodeURIComponent(designRoute)}`;
  const { description: pageDescription } = buildTwoDDrawingMetadata(title);
  const breadcrumbLinks = [
    { label: "Library", href: "/library" },
    { label: "2D Technical Drawings", href: TWO_D_LIBRARY_BASE },
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
    showFreeDownloadBadge: false,
    showLibraryPriceChip: true,
    libraryPriceVersion: isVersioned,
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
          designTitle={title}
        />
      </TwoDTechnicalDrawingPage>
    </>
  );
}

export default async function TwoDLibrarySegmentPage({ params, searchParams }) {
  const segment = String(params?.designRoute || "").trim();
  if (!segment) notFound();

  if (isTwoDDesignRoute(segment)) {
    return renderDesignPage(segment);
  }

  const categories = await fetchCategories();
  const categoryName = resolveCategorySlugToName(segment, categories);
  if (!categoryName) {
    redirect(TWO_D_LIBRARY_BASE);
  }

  const queryParams = searchParams ?? {};
  const tagsParam = queryParams.tags;
  if (tagsParam) {
    redirect(
      get2DLibraryPathWithQuery({
        categoryName,
        tagName: tagsParam,
        search: queryParams.search,
        page: queryParams.page,
        sort: queryParams.sort,
        recency: queryParams.recency,
        free_paid: queryParams.free_paid,
        file_format: queryParams.file_format,
        output_format: queryParams.output_format,
        projection: queryParams.projection,
      })
    );
  }

  const queryCategory = queryParams.category;
  if (queryCategory) {
    const resolvedQueryCategory = resolveCategorySlugToName(queryCategory, categories);
    if (!resolvedQueryCategory || resolvedQueryCategory !== categoryName) {
      redirect(
        get2DLibraryPathWithQuery({
          categoryName,
          tagName: queryParams.tags || null,
          search: queryParams.search,
          page: queryParams.page,
          sort: queryParams.sort,
          recency: queryParams.recency,
          free_paid: queryParams.free_paid,
          file_format: queryParams.file_format,
          output_format: queryParams.output_format,
          projection: queryParams.projection,
        })
      );
    }
  }

  const merged = {
    ...stripCategoryFromSearchParams(queryParams),
    category: categoryName,
  };

  return (
    <TwoDLibrary
      searchParams={merged}
      basePath={get2DLibraryPath({ categoryName })}
    />
  );
}
