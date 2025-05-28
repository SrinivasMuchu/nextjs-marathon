import IndustryCadViewer from '@/Components/IndustryDesigns/IndustryCadViewer';
import React from 'react'

function page({params}) {
   const design = params;
    return (
      <IndustryCadViewer designId={design} />
    )
}

export default page
