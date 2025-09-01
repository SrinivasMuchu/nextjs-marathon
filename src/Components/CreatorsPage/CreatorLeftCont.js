import React from 'react'
import CreatorsProfile from './CreatorsProfile'
import CreatorsStats from './CreatorsStats'
import AboutCreator from './AboutCreator'
import CreatorRating from './CreatorRating'
import styles from './Creators.module.css'
import CreatorLink from './CreatorLink'
import DownloadsRatingAlert from './DownloadsRatingAlert'
function CreatorLeftCont({creatorId, setIsVerified}) {
  return (
    <div className={styles.creatorLeft} style={{display:'flex', flexDirection:'column', gap:'16px'}}>
        <CreatorsProfile creatorId={creatorId}  setIsVerified={setIsVerified}/>
        <DownloadsRatingAlert/>
        <CreatorsStats creatorId={creatorId}  />
        {/* <CreatorRating/> */}
        <AboutCreator creatorId={creatorId}  setIsVerified={setIsVerified}/>
       {!creatorId && <CreatorLink/>}
        {/* <ToolsAndSkills/>
        <WebsiteUrls/> */}
        {/* <CreatorTools/> */}
    </div>
  )
}

export default CreatorLeftCont