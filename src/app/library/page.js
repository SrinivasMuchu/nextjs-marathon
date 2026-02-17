import Library from '@/Components/Library/Library';
import { ASSET_PREFIX_URL } from '@/config';
import React from 'react';
import { getLibraryCanonicalAndRobots } from '@/common.helper';

// This function sets metadata based on query params
export async function generateMetadata({ searchParams }) {
  const category = searchParams?.category || null;
  const page = parseInt(searchParams?.page) || 1;

  const categoryName = category ? capitalize(category) : 'Engineering';

  // Title logic
  const title = `${categoryName} CAD Design Library - Browse 3D CAD Models${page > 1 ? ` - Page ${page}` : ''} | Marathon OS`;

  // Description logic
  const description = (category || page > 1)
    ? `Explore 3D CAD models in the ${categoryName} category. Ideal for engineers and designers looking for high-quality, ready-to-use designs.`
    : 'Browse Marathon OS\'s CAD Design Library. Search and filter by category or tags, preview models and download 3D CAD files for engineering workflows.';

  const { canonicalPath, robots, prevPath, nextPath } = getLibraryCanonicalAndRobots({
    path: '/library',
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
      images: [
        {
          url: `${ASSET_PREFIX_URL}logo-1.png`,
          width: 1200,
          height: 630,
          type: "image/png",
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


// Capitalizes the first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function LibraryPage({ searchParams }) {
  return (
    <div>
      <Library searchParams={searchParams} />
    </div>
  );
}

export default LibraryPage;
