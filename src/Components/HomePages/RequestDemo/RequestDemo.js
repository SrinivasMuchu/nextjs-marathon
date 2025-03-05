import React from 'react'
import footerStyles from '../Footer/Footer.module.css'
import styles from './Popup.module.css'
import DemoForm from './DemoForm';
import CloseDemoBtn from './CloseDemoBtn';


function RequestDemo({ onclose,setOpenDemoForm,openPopUp,error }) {

  return (
    <>
      <div className={styles['demo-popup']}>

        <div className={styles['demo-popup-cont']}>

          <div className={styles['demo-head']}>
            <span style={{color:'black'}}>{error?'Contact us':'Request demo'}</span>
            <CloseDemoBtn onclose={onclose} styles={styles}/>
            {/* <span>x</span> */}
           
          </div>
          {error &&<><span style={{color:'red'}}>{error}</span> <br/></>}
          <DemoForm styles={styles} footerStyles={footerStyles} onclose={onclose} setOpenDemoForm={setOpenDemoForm} openPopUp={openPopUp}/>
        </div>




      </div>


    </>

  )
}

export default RequestDemo