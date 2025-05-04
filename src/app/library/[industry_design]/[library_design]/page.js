import IndustryCadViewer from '@/Components/IndustryDesigns/IndustryCadViewer'
import React from 'react'

function LibraryCategory({ params }) {
  const design = params;
  console.log("Library Category Params:", params); // 👈 Debugging line
  return (
    <IndustryCadViewer designId={design} type='library'/>
  )
}

export default LibraryCategory