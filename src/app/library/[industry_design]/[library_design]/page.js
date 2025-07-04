import IndustryCadViewer from '@/Components/IndustryDesigns/IndustryCadViewer'
import React from 'react'


export async function generateMetadata({ params }) {
  const { industry_design, library_design } = params;

  return {
    title: ` File Viewer – Instantly Open & Explore  | Marathon OS  `,
    description: `View files instantly with Marathon OS CAD Viewer. No software installation required—just upload, view, and explore complex 3D models in seconds. Our proprietary rendering engine ensures smooth performance with zero lag and no glitches, even for large assemblies.`,
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
      canonical: `/library/${industry_design}/${library_design}`,
  },
  robots: 'noindex, nofollow',
  };
}
function LibraryCategory({ params }) {
  const design = params;
 
  return (
    <IndustryCadViewer designId={design} type='library'/>
  )
}

export default LibraryCategory