import React from 'react'
import CreatorLeftCont from './CreatorLeftCont'
import CreatorsRightCont from './CreatorsRightCont'

function CreatorsHome() {
  return (
    <div style={{display:'flex'}}>
        <CreatorLeftCont />
        <CreatorsRightCont />
    </div>
  )
}

export default CreatorsHome