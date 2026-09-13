import { permanentRedirect } from "next/navigation";
import TwoDLibrary from "@/Components/Library/TwoDLibrary";
import { getLibraryCanonicalAndRobots, normalizeLibraryTagSlug } from "@/common.helper";
import {
  TWO_D_LIBRARY_BASE,
  get2DLibraryPath,
} from "@/data/twoDLibraryPage";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

function requireValidTagSlug(rawSlug) {
  const slug = normalizeLibraryTagSlug(rawSlug);
  if (!slug) permanentRedirect(TWO_D_LIBRARY_BASE);
  return slug;
}

export async function generateMetadata({ params, searchParams }) {
  const tagSlug = requireValidTagSlug(params?.tag || "");
  const tagLabel = tagSlug.replace(/-/g, " ");
  const page = parseInt(searchParams?.page, 10) || 1;
  const title = `${tagLabel} 2D Technical Drawings | PDF, SVG, DXF | Marathon OS${
    page > 1 ? ` - Page ${page}` : ""
  }`;
  const description = `Browse ${tagLabel} 2D technical drawings generated from 3D CAD models. Download PDF, SVG and DXF drawing sets for engineering review.`;

  const path = get2DLibraryPath({ tagName: tagSlug });
  const { canonicalPath, robots } = getLibraryCanonicalAndRobots({
    path,
    searchParams: searchParams ?? {},
  });

  return buildPageMetadata({
    title,
    description,
    canonicalPath,
    extra: {
      ...(robots && { robots: { index: false, follow: true } }),
    },
  });
}

export default function TwoDLibraryTagPage({ params, searchParams }) {
  const tagSlug = requireValidTagSlug(params?.tag || "");
  const merged = { ...searchParams, tags: tagSlug };
  return (
    <TwoDLibrary searchParams={merged} basePath={TWO_D_LIBRARY_BASE} />
  );
}
