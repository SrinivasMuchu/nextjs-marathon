import Library from '@/Components/Library/Library';
import { ASSET_PREFIX_URL, BASE_URL } from '@/config';
import {
  getLibraryCanonicalAndRobots,
  getLibraryCategoryPath,
  resolveCategorySlugToName,
} from '@/common.helper';
import { LIBRARY_CATEGORY_PAGES } from '@/data/libraryPage';
import axios from 'axios';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params, searchParams }) {
  const slug = params?.slug;
  const pageConfig = LIBRARY_CATEGORY_PAGES[slug];
  if (!pageConfig) notFound();

  const categoriesRes = await axios
    .get(`${BASE_URL}/v1/cad/get-categories`, { cache: 'no-store' })
    .catch(() => ({ data: {} }));
  const categories = categoriesRes.data?.data || [];
  const categoryName = resolveCategorySlugToName(slug, categories);
  if (!categoryName) notFound();

  const page = parseInt(searchParams?.page, 10) || 1;
  const path = getLibraryCategoryPath(slug);
  const { canonicalPath, robots, prevPath, nextPath } = getLibraryCanonicalAndRobots({
    path,
    searchParams: searchParams ?? {},
  });

  const base = 'https://marathon-os.com';
  const linkOther = [];
  if (prevPath) linkOther.push({ rel: 'prev', url: `${base}${prevPath}` });
  if (nextPath) linkOther.push({ rel: 'next', url: `${base}${nextPath}` });

  return {
    title: pageConfig.title + (page > 1 ? ` - Page ${page}` : ''),
    description: pageConfig.description,
    ...(robots && { robots: { index: false, follow: true } }),
    openGraph: {
      images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }],
    },
    metadataBase: new URL(base),
    alternates: { canonical: canonicalPath },
    ...(linkOther.length > 0 && { icons: { other: linkOther } }),
  };
}

export default async function LibraryCategoryPage({ params, searchParams }) {
  const slug = params?.slug;
  const pageConfig = LIBRARY_CATEGORY_PAGES[slug];
  if (!pageConfig) notFound();

  const categoriesRes = await axios
    .get(`${BASE_URL}/v1/cad/get-categories`, { cache: 'no-store' })
    .catch(() => ({ data: {} }));
  const categories = categoriesRes.data?.data || [];
  const categoryName = resolveCategorySlugToName(slug, categories);
  if (!categoryName) notFound();

  const queryParams = searchParams ?? {};
  const merged = {
    ...queryParams,
    category: categoryName,
    libraryPageVariant: 'category',
    libraryPageSlug: slug,
  };

  return <Library searchParams={merged} pageConfig={pageConfig} />;
}
