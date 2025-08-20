import React from 'react'
import CreatorsProfile from './CreatorsProfile'
import CreatorsStats from './CreatorsStats'
import AboutCreator from './AboutCreator'

function CreatorLeftCont({creatorId,viewer}) {
  return (
    <div style={{display:'flex', flexDirection:'column', width:'30%',gap:'16px'}}>
        <CreatorsProfile creatorId={creatorId} viewer={viewer}/>
        <CreatorsStats creatorId={creatorId} viewer={viewer}/>
        <AboutCreator creatorId={creatorId} viewer={viewer}/>
        {/* <ToolsAndSkills/>
        <WebsiteUrls/> */}
        {/* <CreatorTools/> */}
    </div>
  )
}

export default CreatorLeftCont