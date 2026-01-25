import Library from '@/Components/Library/Library';
import React from 'react';

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
    : 'Browse Marathon OS’s CAD Design Library. Search and filter by category or tags, preview models and download 3D CAD files for engineering workflows.';

  // Canonical URL logic
  let canonicalPath = '/library';
  const canonicalParams = new URLSearchParams();

  if (category) canonicalParams.set('category', category);
  if (searchParams?.page) canonicalParams.set('page', '1'); // force page=1 if page is present in query

  const queryString = canonicalParams.toString();
  if (queryString) canonicalPath += `?${queryString}`;

  return {
    title,
    description,
    openGraph: {
      images: [
        {
          url: "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png",
          width: 1200,
          height: 630,
          type: "image/png",
        },
      ],
    },
    metadataBase: new URL("https://marathon-os.com"),
    alternates: {
      canonical: canonicalPath,
    },
  };
}


// Capitalizes first letter



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
