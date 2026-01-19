import DesignHubContent from './DesignHubContent'
import styles from './DesignHub.module.css'

const DesignHub = () => {
  return (
    <div className={styles.designHubContainer}>
        <h1 className={styles.designHubHead}>Marathon-OS Design Hub</h1>
        <p className={styles.designHubDesc}>Everything you need to design faster, smarter, and with more impact.</p>
        <DesignHubContent />
    </div>
  )
}

export default DesignHub
