import React from 'react'
import CreatorsProfile from './CreatorsProfile'
import CreatorsStats from './CreatorsStats'
import AboutCreator from './AboutCreator'
import CreatorTools from './CreatorTools'
import styles from './Creators.module.css'
function CreatorLeftCont() {
  return (
    <div style={{display:'flex', flexDirection:'column', width:'30%',gap:'16px'}}>
        <CreatorsProfile/>
        <CreatorsStats/>
        <AboutCreator/>
        <CreatorTools/>
    </div>
  )
}

export default CreatorLeftCont