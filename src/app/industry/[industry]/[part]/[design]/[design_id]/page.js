import IndustryCadViewer from '@/Components/IndustryDesigns/IndustryCadViewer'
import React from 'react'

export async function generateMetadata({ params }) {
  const { industry, part,design,design_id } = params;

  return {
    title: `${industry} - ${part} CAD Viewer`,
    description: `Explore detailed CAD designs for ${part} in the ${industry} industry.`,
    openGraph: {
      title: `${industry} - ${part} CAD Viewer`,
      description: `View and analyze CAD models for ${part} in the ${industry} industry.`,
      type: 'website',
    },
    metadataBase: new URL("https://marathon-os.com"),
    alternates: {
      canonical: `/industry/${industry}/${part}/${design}/${design_id}`,
  },
  };
}

function IndustryCadViewerPage({ params }) {
  const design = params;
  return (
    <IndustryCadViewer designId={design} />
  )
}

export default IndustryCadViewerPage;
