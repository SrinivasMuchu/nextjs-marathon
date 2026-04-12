import React from 'react'
import IndustryCadViewerHero from './IndustryCadViewerHero'

function IndustryDetails({ industryData, part_name }) {
    return (
        <IndustryCadViewerHero industryData={industryData} part_name={part_name} />
    )
}

export default IndustryDetails