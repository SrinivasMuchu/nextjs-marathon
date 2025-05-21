
import React  from 'react'
import styles from './Subscription.module.css'
import SubscriptionList from './SubscriptionList'
import SubscriptionSwitch from './SubscriptionSwitch';
import SubscriptionDemoButton from '@/Components/CommonJsx/SubscriptionDemoButton';

function Subscription() {
   
    return (
        <div id='pricing' className={styles['subscription-page']}>
            <div className={styles['subscription-page-text']}>
                <h2 className={styles['subscription-page-head']}>Marathon-OS Subscription</h2>
                <h6 className={styles['subscription-page-subhead']}>Simple Pricing, Full Access</h6>
                <p className={styles['subscription-page-desc']}>At Marathon-OS, we believe in keeping things straightforward. Get all the
                    tools and features you need to manage your <br/> hardware product lifecycle
                    efficiently, with just one comprehensive plan.</p>
            </div>
            <SubscriptionSwitch styles={styles}/>
          
            {/* <button style={{background:'#610bee',color:'white',borderRadius:'8px',padding:'10px 20px'}}>Request demo</button> */}
            <div className={styles['subscription-page-list']}>
                <SubscriptionList />
               

            </div>
              <SubscriptionDemoButton/>
        </div>
    )
}

export default Subscription