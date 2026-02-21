import React from 'react'
import styles from './CreatorsDashboard.module.css'
import CreatorDashboardButton from './CreatorDashboardButton'

function StartShareDesign() {
  return (
    <div className={styles.startShareDesignContainer} style={{background:'#610bee',color:'white'}}>
        <h3 style={{fontSize:'clamp(24px, 5vw, 36px)',textAlign:'center'}}>Start sharing your designs with the world</h3>
        <p style={{fontSize:'20px',textAlign:'center'}}>Join our growing community of creators and make an impact in the open hardware ecosystem.</p>
         <CreatorDashboardButton buttonName='Join as Creator'/>
    </div>
  )
}

export default StartShareDesign