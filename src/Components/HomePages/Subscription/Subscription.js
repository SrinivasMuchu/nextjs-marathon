
import React  from 'react'
import styles from './Subscription.module.css'
import SubscriptionList from './SubscriptionList'
import SubscriptionSwitch from './SubscriptionSwitch';

function Subscription() {
   
    return (
        <div id='pricing' className={styles['subscription-page']}>
            <div className={styles['subscription-page-text']}>
                <span className={styles['subscription-page-head']}>Marathon-OS Subscription</span>
                <span className={styles['subscription-page-subhead']}>Simple Pricing, Full Access</span>
                <span className={styles['subscription-page-desc']}>At Marathon-OS, we believe in keeping things straightforward. Get all the
                    tools and features you need to manage your hardware product lifecycle
                    efficiently, with just one comprehensive plan.</span>
            </div>
            <SubscriptionSwitch styles={styles}/>
            <div className={styles['subscription-page-list']}>
                <SubscriptionList />
               

            </div>
        </div>
    )
}

export default Subscription