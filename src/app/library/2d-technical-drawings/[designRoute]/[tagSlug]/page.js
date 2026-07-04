import { notFound, permanentRedirect } from "next/navigation";
import TwoDLibrary from "@/Components/Library/TwoDLibrary";
import { resolveCategorySlugToName, normalizeLibraryTagSlug } from "@/common.helper";
import { fetchTwoDLibraryCategories } from "@/api/twoDLibraryDesignsApi";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";
import {
  TWO_D_LIBRARY_BASE,
  get2DLibraryPath,
  get2DLibraryPathWithQuery,
  isTwoDDesignRoute,
} from "@/data/twoDLibraryPage";

function stripPathParamsFromSearchParams(searchParams) {
  if (!searchParams) return {};
  const { category: _category, tags: _tags, ...rest } = searchParams;
  return rest;
}

export async function generateMetadata({ params, searchParams }) {
  const categorySegment = String(params?.designRoute || "").trim();
  const tagSlug = normalizeLibraryTagSlug(params?.tagSlug || "");
  if (!categorySegment || !tagSlug || isTwoDDesignRoute(categorySegment)) {
    return buildPageMetadata({
      title: "2D Technical Drawing Library | Marathon OS",
      description: "Browse 2D technical drawings on Marathon OS.",
      canonicalPath: TWO_D_LIBRARY_BASE,
    });
  }

  const categories = await fetchTwoDLibraryCategories();
  const categoryName = resolveCategorySlugToName(categorySegment, categories);
  if (!categoryName) {
    return buildPageMetadata({
      title: "2D Technical Drawing Library | Marathon OS",
      description: "Browse 2D technical drawings on Marathon OS.",
      canonicalPath: TWO_D_LIBRARY_BASE,
    });
  }

  const tagLabel = tagSlug.replace(/-/g, " ");
  const page = parseInt(searchParams?.page, 10) || 1;
  const title = `${tagLabel} in ${categoryName} 2D Technical Drawings | PDF, SVG, DXF | Marathon OS${
    page > 1 ? ` - Page ${page}` : ""
  }`;
  const description = `Browse ${tagLabel} 2D technical drawings in ${categoryName}. Download PDF, SVG and DXF drawing sets for engineering review.`;

  return buildPageMetadata({
    title,
    description,
    canonicalPath: get2DLibraryPath({ categoryName, tagName: tagSlug }),
  });
}

export default async function TwoDLibraryCategoryTagPage({ params, searchParams }) {
  const categorySegment = String(params?.designRoute || "").trim();
  const tagSlug = normalizeLibraryTagSlug(params?.tagSlug || "");

  if (!categorySegment || isTwoDDesignRoute(categorySegment)) {
    notFound();
  }
  if (!tagSlug) {
    permanentRedirect(
      get2DLibraryPathWithQuery({
        categoryName: categorySegment,
        ...stripPathParamsFromSearchParams(searchParams),
      })
    );
  }

  const categories = await fetchTwoDLibraryCategories();
  const categoryName = resolveCategorySlugToName(categorySegment, categories);
  if (!categoryName) {
    permanentRedirect(TWO_D_LIBRARY_BASE);
  }

  const queryParams = searchParams ?? {};
  if (queryParams.tags || queryParams.category) {
    permanentRedirect(
      get2DLibraryPathWithQuery({
        categoryName,
        tagName: tagSlug,
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

  const merged = {
    ...stripPathParamsFromSearchParams(queryParams),
    category: categoryName,
    tags: tagSlug,
  };

  return (
    <TwoDLibrary
      searchParams={merged}
      basePath={get2DLibraryPath({ categoryName, tagName: tagSlug })}
    />
  );
}
