import React from 'react'
import CreatorsProfile from './CreatorsProfile'
import CreatorsStats from './CreatorsStats'
import AboutCreator from './AboutCreator'
import CreatorRating from './CreatorRating'
import styles from './Creators.module.css'
function CreatorLeftCont({creatorId,viewer}) {
  return (
    <div className={styles.creatorLeft} style={{display:'flex', flexDirection:'column', gap:'16px'}}>
        <CreatorsProfile creatorId={creatorId} viewer={viewer}/>
        <CreatorsStats creatorId={creatorId} viewer={viewer}/>
        <CreatorRating/>
        <AboutCreator creatorId={creatorId} viewer={viewer}/>
        {/* <ToolsAndSkills/>
        <WebsiteUrls/> */}
        {/* <CreatorTools/> */}
    </div>
  )
}

export default CreatorLeftCont