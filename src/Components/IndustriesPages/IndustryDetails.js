import React from 'react'
import IndustryCadViewerHero from './IndustryCadViewerHero'
import IndustryPdmGlbViewerSection from './IndustryPdmGlbViewerSection'

function IndustryDetails({ industryData, part_name }) {
    return (
        <>
            <IndustryCadViewerHero industryData={industryData} part_name={part_name} />
            <IndustryPdmGlbViewerSection industryData={industryData} />
        </>
    )
}

export default IndustryDetails