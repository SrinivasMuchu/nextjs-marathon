import React from 'react'
import IndustryDesignHeader from './IndustryDesignHeader'
import IndustryDesignFilesList from './IndustryDesignFilesList'
import IndustryDesignsSuggestion from './IndustryDesignsSuggestion'
import AboutCad from './AboutCad'
import IndustryDesignsCarousel from './IndustryDesignsCarousel'
import IndustryDesignDropZone from './IndustryDesignDropZone'

function IndustryDesign({ design, designData }) {
  console.log('Design data:', design, designData)
  
  return (
    <div>
      <IndustryDesignHeader design={design} designData={designData.response} />
      <IndustryDesignsCarousel designData={designData.designs} />
      <IndustryDesignFilesList designData={designData.designs} />
      <IndustryDesignsSuggestion type='design' />
      <IndustryDesignsSuggestion />
      <div style={{width:'100%',height:'15px',background:'#F4F4F4'}}></div>
      {designData?.report?.cad_report && (
        <AboutCad cadReport={designData.report.cad_report} />
      )}
      <IndustryDesignDropZone />
    </div>
  )
}

export default IndustryDesign