import IndustryDesign from '@/Components/IndustryDesigns/IndustryDesign';
import Library from '@/Components/Library/Library';
import { ASSET_PREFIX_URL, BASE_URL } from '@/config';
import { notFound } from 'next/navigation';
import { resolveCategorySlugToName, getLibraryPath, getLibraryCanonicalAndRobots } from '@/common.helper';
import axios from 'axios';
import { cache } from 'react';

export const revalidate = 60;

const fetchDesignData = cache(async (segment) => {
  try {
    const response = await fetch(
      `${BASE_URL}/v1/cad/get-industry-part-design?industry_design_route=${encodeURIComponent(segment)}`,
      { next: { revalidate: 60 } }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data?.data ?? null;
  } catch {
    return null;
  }
});

/** Design routes contain a MongoDB ObjectId (24 hex chars); category slugs do not. Use this to differentiate. */
function isDesignRoute(segment) {
  return typeof segment === 'string' && /[a-f0-9]{24}/i.test(segment);
}

export async function generateMetadata({ params, searchParams }) {
  const segment = params?.industry_design;

  if (isDesignRoute(segment)) {
    const designWrapper = await fetchDesignData(segment);
    const design = designWrapper?.response;

    if (design) {
          const productName = design.page_title || design.part_name || '3D CAD Model';
          const modelName = design.part_name || design.page_title || productName;

          const rawFileType = typeof design.file_type === 'string' ? design.file_type : 'step';
          const fileTypeLabel = rawFileType.toLowerCase().replace(/^\./, '');

          const priceNumber = typeof design.price === 'number' ? design.price : Number(design.price || 0);
          const isPaid = !Number.isNaN(priceNumber) && priceNumber > 0;
          const isDownloadable = design.is_downloadable !== false;

          let priceSnippet = '';
          if (isDownloadable) {
            if (isPaid) {
              priceSnippet = ` $${priceNumber}/Download.`;
            } else {
              priceSnippet = ' Free Download.';
            }
          }

          const title = `${productName} CAD Model - Download ${fileTypeLabel} | Marathon OS`;
          const description = `Download the ${modelName} 3D CAD model in ${fileTypeLabel}. Preview online and get included views/files only on Marathon OS.${priceSnippet}`;

      return {
        title,
        description,
        openGraph: {
          images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }],
        },
        metadataBase: new URL('https://marathon-os.com'),
        alternates: { canonical: `/library/${segment}` },
      };
    }
    notFound();
  }

  // No Mongo ID → category slug → resolve via categories
  const categoriesRes = await axios.get(`${BASE_URL}/v1/cad/get-categories`, { cache: 'no-store' }).catch(() => ({ data: {} }));
  const categories = categoriesRes.data?.data || [];
  const categoryName = resolveCategorySlugToName(segment, categories);
  if (!categoryName) notFound();

  const page = parseInt(searchParams?.page, 10) || 1;
  const title = `${categoryName} CAD Models | STEP, STL, IGES Downloads | Marathon OS${page > 1 ? ` - Page ${page}` : ''}`;
  const description = `Download ${categoryName} 3D CAD models in STEP/STP, IGES, STL and more. Filter by tags, file type, price & popularity. Preview online.`;

  const path = getLibraryPath({ categoryName });
  const { canonicalPath, robots, prevPath, nextPath } = getLibraryCanonicalAndRobots({
    path,
    searchParams: searchParams ?? {},
  });

  const base = 'https://marathon-os.com';
  const linkOther = [];
  if (prevPath) linkOther.push({ rel: 'prev', url: `${base}${prevPath}` });
  linkOther.push({ rel: 'next', url: `${base}${nextPath}` });

  return {
    title,
    description,
    ...(robots && { robots: { index: false, follow: true } }),
    openGraph: {
      images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }],
    },
    metadataBase: new URL(base),
    alternates: { canonical: canonicalPath },
    ...(linkOther.length > 0 && { icons: { other: linkOther } }),
  };
}

export default async function LibrarySegmentPage({ params, searchParams }) {
  const segment = params?.industry_design;

  if (isDesignRoute(segment)) {
    const designData = await fetchDesignData(segment);
    if (designData) {
      const normalizedData = { ...designData, report: designData.report };
      return <IndustryDesign design={segment} designData={normalizedData} type="library" />;
    }
    notFound();
  }

  // No Mongo ID → category slug → resolve via categories
  const categoriesRes = await axios.get(`${BASE_URL}/v1/cad/get-categories`, { cache: 'no-store' }).catch(() => ({ data: {} }));
  const categories = categoriesRes.data?.data || [];
  const categoryName = resolveCategorySlugToName(segment, categories);
  if (!categoryName) notFound();

  // Merge URL query params with category from path (path segment is not in searchParams)
  const queryParams = searchParams ?? {};
  const merged = { ...queryParams, category: categoryName };
  return (
    <div>
      <Library searchParams={merged} />
    </div>
  );
}
