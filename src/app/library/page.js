import Library from '@/Components/Library/Library';
import { ASSET_PREFIX_URL } from '@/config';
import React from 'react';
import { getLibraryCanonicalAndRobots } from '@/common.helper';
import {
  LIBRARY_DEFAULT_DESCRIPTION,
  LIBRARY_DEFAULT_TITLE,
} from '@/data/libraryPage';
import StickyCadStrip from '@/Components/CadServicesBanners/StickyCadStrip';

export async function generateMetadata({ searchParams }) {
  const page = parseInt(searchParams?.page, 10) || 1;
  const title = `${LIBRARY_DEFAULT_TITLE}${page > 1 ? ` - Page ${page}` : ''}`;
  const description = LIBRARY_DEFAULT_DESCRIPTION;

  const { canonicalPath, robots, prevPath, nextPath } = getLibraryCanonicalAndRobots({
    path: '/library',
    searchParams: searchParams ?? {},
  });

  const base = 'https://marathon-os.com';
  const linkOther = [];
  if (prevPath) linkOther.push({ rel: 'prev', url: `${base}${prevPath}` });
  if (nextPath) linkOther.push({ rel: 'next', url: `${base}${nextPath}` });

  return {
    title,
    description,
    ...(robots && { robots: { index: false, follow: true } }),
    openGraph: {
      images: [
        {
          url: `${ASSET_PREFIX_URL}logo-1.png`,
          width: 1200,
          height: 630,
          type: 'image/png',
        },
      ],
    },
    metadataBase: new URL(base),
    alternates: {
      canonical: canonicalPath,
    },
    ...(linkOther.length > 0 && { icons: { other: linkOther } }),
  };
}

function LibraryPage({ searchParams }) {
  return (
    <div>
      <Library searchParams={searchParams} />
      <StickyCadStrip />
    </div>
  );
}

export default LibraryPage;
