import React from 'react'
import IndustryDesignHeader from './IndustryDesignHeader'
import IndustryDesignFilesList from './IndustryDesignFilesList'
import IndustryDesignsSuggestion from './IndustryDesignsSuggestion'
import AboutCad from './AboutCad'
import IndustryDesignsCarousel from './IndustryDesignsCarousel'
import IndustryDesignDropZone from './IndustryDesignDropZone'
import HomeTopNav from '../HomePages/HomepageTopNav/HomeTopNav'
import Footer from '../HomePages/Footer/Footer'

function IndustryDesign({ design, designData }) {
 
  
  return (
    <div>
      {designData && <>
        <HomeTopNav />
      <IndustryDesignHeader design={design} designData={designData.response} />
      {designData.designs && <IndustryDesignsCarousel designData={designData.designs} />}
      {designData.response && <IndustryDesignFilesList designData={designData.response} />} 
     {designData.designs &&  <IndustryDesignsSuggestion type='design' designData={designData.designs}/>}
     {designData.filteredResults && <IndustryDesignsSuggestion designData={designData.filteredResults}/>}
      <div style={{width:'100%',height:'15px',background:'#F4F4F4'}}></div>
      {designData?.report?.cad_report && (
        <AboutCad cadReport={designData.report.cad_report} />
      )}
      <IndustryDesignDropZone />
      <Footer />
      </>}
      
    </div>
  )
}

export default IndustryDesign