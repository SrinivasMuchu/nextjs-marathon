import React from 'react'
import IndustryDesignHeader from './IndustryDesignHeader'
import IndustryDesignFilesList from './IndustryDesignFilesList'
import IndustryDesignsSuggestion from './IndustryDesignsSuggestion'
import AboutCad from './AboutCad'
import IndustryDesignsCarousel from './IndustryDesignsCarousel'
import IndustryDesignDropZone from './IndustryDesignDropZone'
import HomeTopNav from '../HomePages/HomepageTopNav/HomeTopNav'
import Footer from '../HomePages/Footer/Footer'
import ActiveLastBreadcrumb from '../CommonJsx/BreadCrumbs'

function IndustryDesign({ design, designData }) {

  
  return (
    <div>
      {designData && <>
        <HomeTopNav />
        <ActiveLastBreadcrumb 
          links={[
            { label: 'CAD viewer', href: '/tools/cad-viewer' },       
            { label: `${design.industry}`, href: `/industry/${design.industry}` },
            { label: `${designData.response.part_name}`, href: `/industry/${design.industry}/${design.part}` },
            { label: `${designData.response.page_title}`, href: `/industry/${design.industry}/${design.part}/${design.design_id}` },
          
          ]}
        />
      <IndustryDesignHeader design={design} designData={designData.response} />
      {designData.designs && <IndustryDesignsCarousel designData={designData.response}  />}
      {designData.response && <IndustryDesignFilesList designData={designData.response} />} 
     {designData.designs &&  <IndustryDesignsSuggestion type='design' designData={designData.designs} design={design}/>}
     {designData.filteredResults && <IndustryDesignsSuggestion designData={designData.filteredResults} design={design}/>}
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