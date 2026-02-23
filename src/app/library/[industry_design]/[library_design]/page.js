import IndustryCadViewer from '@/Components/IndustryDesigns/IndustryCadViewer';
import Library from '@/Components/Library/Library';
import { ASSET_PREFIX_URL, BASE_URL } from '@/config';
import React from 'react';
import axios from 'axios';
import { resolveCategorySlugToName, tagSlugToName, getLibraryPath, getLibraryCanonicalAndRobots } from '@/common.helper';

export async function generateMetadata({ params, searchParams }) {
  const { industry_design, library_design } = params;
  const fileId = searchParams?.fileId;

  if (fileId) {
    return {
      title: `File Viewer – Instantly Open & Explore | Marathon OS`,
      description: `View files instantly with Marathon OS CAD Viewer. No software installation required—just upload, view, and explore complex 3D models in seconds.`,
      openGraph: {
        images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }],
      },
      metadataBase: new URL('https://marathon-os.com'),
      alternates: { canonical: `/library/${industry_design}/${library_design}` },
      robots: 'noindex, nofollow',
    };
  }

  const categoriesRes = await axios.get(`${BASE_URL}/v1/cad/get-categories`, { cache: 'no-store' }).catch(() => ({ data: {} }));
  const categories = categoriesRes.data?.data || [];
  const categoryName = resolveCategorySlugToName(industry_design, categories);
  const tagValue = tagSlugToName(library_design); // raw cad_tag_name
  const tagLabel = tagValue.replace(/-/g, ' ');
  if (!categoryName && !tagValue) {
    return {
      title: 'CAD Design Library | Marathon OS',
      description: 'Browse Marathon OS\'s CAD Design Library.',
      metadataBase: new URL('https://marathon-os.com'),
      alternates: { canonical: getLibraryPath({ categoryName: categoryName || undefined, tagName: tagValue || undefined }) },
    };
  }

  const pageNum = parseInt(searchParams?.page, 10) || 1;
  const title = categoryName && tagLabel
    ? `${tagLabel} in ${categoryName} CAD Models | STEP, STL, IGES | Marathon OS${pageNum > 1 ? ` - Page ${pageNum}` : ''}`
    : [categoryName, tagLabel].filter(Boolean).join(' – ') + ' – Library | Marathon OS';

  const path = getLibraryPath({ categoryName: categoryName || undefined, tagName: tagValue || undefined });
  const { canonicalPath, robots, prevPath, nextPath } = getLibraryCanonicalAndRobots({
    path,
    searchParams: searchParams ?? {},
  });

  const description = categoryName && tagLabel
    ? `Find ${tagLabel} CAD models in ${categoryName}. Download STEP/STP, IGES, STL and more. Filter by file type, price & popularity. Preview online.`
    : `Browse 3D CAD models in ${categoryName || 'the library'}${tagLabel ? ` tagged with ${tagLabel}` : ''}.`;

  const base = 'https://marathon-os.com';
  const linkOther = [];
  if (prevPath) linkOther.push({ rel: 'prev', url: `${base}${prevPath}` });
  linkOther.push({ rel: 'next', url: `${base}${nextPath}` });

  return {
    title,
    description,
    openGraph: {
      images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }],
    },
    ...(robots && { robots: { index: false, follow: true } }),
    metadataBase: new URL(base),
    alternates: { canonical: canonicalPath },
    ...(linkOther.length > 0 && { icons: { other: linkOther } }),
  };
}

export default async function LibraryTwoSegmentPage({ params, searchParams }) {
  const { industry_design, library_design } = params;
  const fileId = searchParams?.fileId;

  if (fileId) {
    return <IndustryCadViewer designId={params} type="library" />;
  }

  const categoriesRes = await axios.get(`${BASE_URL}/v1/cad/get-categories`, { cache: 'no-store' }).catch(() => ({ data: {} }));
  const categories = categoriesRes.data?.data || [];
  const categoryName = resolveCategorySlugToName(industry_design, categories);
  const tagValue = tagSlugToName(library_design); // raw for API

  const merged = { ...searchParams, category: categoryName || undefined, tags: tagValue || undefined };
  return (
    <div>
      <Library searchParams={merged} />
    </div>
  );
}
