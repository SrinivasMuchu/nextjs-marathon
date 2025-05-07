import Library from '@/Components/Library/Library';
import React from 'react';

// This function sets metadata based on query params
export async function generateMetadata({ searchParams }) {
  const category = searchParams?.category || null;
  const page = parseInt(searchParams?.page) || 1;

  const categoryName = category ? capitalize(category) : 'Engineering';

  // Title logic
  const title = `${categoryName} CAD Design Library | 3D Models for Product Development${page > 1 ? ` - Page ${page}` : ''} | Marathon OS`;

  // Description logic
  const description = (category || page > 1)
    ? `Explore 3D CAD models in the ${categoryName} category. Ideal for engineers and designers looking for high-quality, ready-to-use designs.`
    : 'Discover a rich library of 3D CAD designs for engineering and product development. Browse models across industries to accelerate design inspiration and collaboration.';

  // Canonical URL logic
  let canonicalPath = '/library';
  if (category) {
    canonicalPath += `?category=${category}`;
  }

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
