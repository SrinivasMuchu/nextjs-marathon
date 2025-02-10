import React from 'react'
import footerStyles from '../Footer/Footer.module.css'
import styles from '../Workflow/WorkFlow.module.css'
import DemoForm from './DemoForm';
import CloseDemoBtn from './CloseDemoBtn';


function RequestDemo({ onclose }) {

  return (
    <>
      <div className={styles['demo-popup']}>

        <div className={styles['demo-popup-cont']}>

          <div className={styles['demo-head']}>
            <span style={{color:'black'}}>Request demo</span>
            <CloseDemoBtn onclose={onclose}/>
            {/* <span>x</span> */}
           
          </div>
          <DemoForm styles={styles} footerStyles={footerStyles} onclose={onclose} />
        </div>




      </div>


    </>

  )
}

export default RequestDemo