import React from 'react'
import CreatorLeftCont from './CreatorLeftCont'
import CreatorsRightCont from './CreatorsRightCont'
import CreatorCoverPage from './CreatorCoverPage'

function CreatorsHome() {
  return (
    <>
    <CreatorCoverPage />
    <div style={{display:'flex'}}>
        <CreatorLeftCont />
        <CreatorsRightCont />
    </div>
    </>
    
  )
}

export default CreatorsHome