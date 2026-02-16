import IndustryDesign from '@/Components/IndustryDesigns/IndustryDesign';
import Library from '@/Components/Library/Library';
import { ASSET_PREFIX_URL, BASE_URL } from '@/config';
import { notFound } from 'next/navigation';
import { resolveCategorySlugToName, getLibraryPath } from '@/common.helper';
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

  const page = parseInt(searchParams?.page) || 1;
  const title = `${categoryName} CAD Design Library - Browse 3D CAD Models${page > 1 ? ` - Page ${page}` : ''} | Marathon OS`;
  const description = `Explore 3D CAD models in the ${categoryName} category. Ideal for engineers and designers looking for high-quality, ready-to-use designs.`;
  const canonicalPath = getLibraryPath({ categoryName });

  return {
    title,
    description,
    openGraph: {
      images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }],
    },
    metadataBase: new URL('https://marathon-os.com'),
    alternates: { canonical: canonicalPath },
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
