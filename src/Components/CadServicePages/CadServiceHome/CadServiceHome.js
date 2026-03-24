import React from 'react'
import CadServiceForm from './CadServiceForm'
import styles from './CadServiceHome.module.css'

function CadServiceHome() {
  return (
    <section id="cad-quote" className={styles.section} data-cad-form>
      <div className={styles.leftColumn}>
        <span className={styles.tag}>
          <span className={styles.tagBullet} />
          CAD OUTSOURCING
        </span>
        <h1 className={styles.headline}>
          Stop hiring.
          <br />
          Start shipping
          <br />
          <span className={styles.headlineAccent}>CAD in 24 hrs.</span>
        </h1>
        <p className={styles.description}>
          Share your requirement – we match you with a vetted CAD expert, deliver production-ready files, and handle all the overhead. No contracts, no risk.
        </p>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>500+</span>
            <span className={styles.statLabel}>Projects Delivered</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>&lt;24 hrs</span>
            <span className={styles.statLabel}>Avg. First Response</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>15+</span>
            <span className={styles.statLabel}>CAD Tools Supported</span>
          </div>
        </div>
      </div>
      <div className={styles.rightColumn}>
        <CadServiceForm />
      </div>
    </section>
  )
}

export default CadServiceHome
