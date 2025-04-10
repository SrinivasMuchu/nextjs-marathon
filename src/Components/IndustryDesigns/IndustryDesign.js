import React from 'react'
import IndustryDesignHeader from './IndustryDesignHeader'
import IndustryDesignFilesList from './IndustryDesignFilesList'
import IndustryDesignsSuggestion from './IndustryDesignsSuggestion'
import AboutCad from './AboutCad'
import IndustryDesignsCarousel from './IndustryDesignsCarousel'
import IndustryDesignDropZone from './IndustryDesignDropZone'


function IndustryDesign() {
  return (
    <div>
        <IndustryDesignHeader/>
        <IndustryDesignsCarousel/>
        <IndustryDesignFilesList/>
        <IndustryDesignsSuggestion type='design'/>
        <IndustryDesignsSuggestion/>
        <div style={{width:'100%',height:'15px',background:'#F4F4F4'}}></div>
        <AboutCad/>
        <IndustryDesignDropZone/>

    </div>
  )
}

export default IndustryDesign