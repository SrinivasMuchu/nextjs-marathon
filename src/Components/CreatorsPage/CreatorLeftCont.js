import React from 'react'
import CreatorsProfile from './CreatorsProfile'
import CreatorsStats from './CreatorsStats'
import AboutCreator from './AboutCreator'

function CreatorLeftCont() {
  return (
    <div style={{display:'flex', flexDirection:'column', width:'30%',gap:'16px'}}>
        <CreatorsProfile/>
        <CreatorsStats/>
        <AboutCreator/>
        {/* <ToolsAndSkills/>
        <WebsiteUrls/> */}
        {/* <CreatorTools/> */}
    </div>
  )
}

export default CreatorLeftCont