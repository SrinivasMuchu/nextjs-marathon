import IndustryCadViewer from '@/Components/IndustryDesigns/IndustryCadViewer';
import Library from '@/Components/Library/Library';
import { ASSET_PREFIX_URL, BASE_URL } from '@/config';
import React from 'react';
import axios from 'axios';
import { resolveCategorySlugToName, tagSlugToName, getLibraryPath } from '@/common.helper';

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
  const tagName = tagSlugToName(library_design);
  if (!categoryName && !tagName) {
    return {
      title: 'CAD Design Library | Marathon OS',
      description: 'Browse Marathon OS\'s CAD Design Library.',
      metadataBase: new URL('https://marathon-os.com'),
      alternates: { canonical: getLibraryPath({ categoryName: categoryName || undefined, tagName: tagName || undefined }) },
    };
  }

  const title = [categoryName, tagName].filter(Boolean).join(' – ') + ' – Library | Marathon OS';
  const canonicalPath = getLibraryPath({ categoryName: categoryName || undefined, tagName: tagName || undefined });

  return {
    title,
    description: `Browse 3D CAD models in ${categoryName || 'the library'}${tagName ? ` tagged with ${tagName}` : ''}.`,
    openGraph: {
      images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }],
    },
    metadataBase: new URL('https://marathon-os.com'),
    alternates: { canonical: canonicalPath },
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
  const tagName = tagSlugToName(library_design);

  const merged = { ...searchParams, category: categoryName || undefined, tags: tagName || undefined };
  return (
    <div>
      <Library searchParams={merged} />
    </div>
  );
}
