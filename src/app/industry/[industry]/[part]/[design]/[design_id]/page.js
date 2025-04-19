import IndustryCadViewer from '@/Components/IndustryDesigns/IndustryCadViewer'
import React from 'react'


function IndustryCadViewerPage({ params }) {
  
  const design = params;
  return (
    <IndustryCadViewer designId={design} />
  )
}

export default IndustryCadViewerPage