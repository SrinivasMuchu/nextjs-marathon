import IndustryCadViewer from '@/Components/IndustryDesigns/IndustryCadViewer'
import React from 'react'


function IndustryCadViewerPage({ params }) {
  
  const design_id = params.design_id;
  return (
    <IndustryCadViewer designId={design_id} />
  )
}

export default IndustryCadViewerPage