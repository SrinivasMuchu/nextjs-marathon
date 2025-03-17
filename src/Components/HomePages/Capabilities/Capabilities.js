
import styles from './Capabilities.module.css'
import CapabilityCards from './CapabilityCards'


function Capabilities() {
  return (
    <div id='capabilities' className={styles['capabilities-page']}>
        <div className={styles['capabilities-page-head']}>
            <h1 className={styles['capabilities-page-head-title']}>Capabilities</h1>
            <p className={styles['capabilities-page-head-desc']}>Seamless management of engineering, manufacturing, supply chain, and change processes—all in one platform.</p>
        </div>
        <div className={styles['capabilities-page-img']}>
            
                <CapabilityCards styles={styles}/>
               
           
        </div>
    </div>
  )
}

export default Capabilities