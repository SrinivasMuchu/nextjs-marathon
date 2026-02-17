import IndustryDesign from '@/Components/IndustryDesigns/IndustryDesign';
import Library from '@/Components/Library/Library';
import { ASSET_PREFIX_URL, BASE_URL } from '@/config';
import { notFound } from 'next/navigation';
import { resolveCategorySlugToName, getLibraryPath, getLibraryCanonicalAndRobots } from '@/common.helper';
import axios from 'axios';

export const revalidate = 60;

export async function generateMetadata({ params, searchParams }) {
  const segment = params?.industry_design;

  try {
    const response = await fetch(`${BASE_URL}/v1/cad/design-meta-data?route=${segment}`, { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      const designData = data?.data;
      if (designData) {
        return {
          title: `${designData.meta_title} | Marathon OS`,
          description: designData.meta_description,
          openGraph: {
            images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }],
          },
          metadataBase: new URL('https://marathon-os.com'),
          alternates: { canonical: `/library/${segment}` },
        };
      }
    }
  } catch (_) {}

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

  try {
    const response = await fetch(`${BASE_URL}/v1/cad/get-industry-part-design?industry_design_route=${segment}`, { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      if (data?.data) {
        const normalizedData = { ...data.data, report: data.data.report };
        return <IndustryDesign design={segment} designData={normalizedData} type="library" />;
      }
    }
  } catch (_) {}

  const categoriesRes = await axios.get(`${BASE_URL}/v1/cad/get-categories`, { cache: 'no-store' }).catch(() => ({ data: {} }));
  const categories = categoriesRes.data?.data || [];
  const categoryName = resolveCategorySlugToName(segment, categories);
  if (!categoryName) notFound();

  const merged = { ...searchParams, category: categoryName };
  return (
    <div>
      <Library searchParams={merged} />
    </div>
  );
}
