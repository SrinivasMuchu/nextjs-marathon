import React from 'react'
import CadServiceForm from './CadServiceForm'
import styles from './CadServiceHome.module.css'

const SCOPE_ITEMS = [
  'Mechanical Parts',
  'Assemblies',
  'Technical Drawings',
  'Product Enclosures',
  'Manufacturing CAD',
  'Reverse Engineering',
]

function CadServiceHome() {
  return (
    <section id="cad-quote" className={styles.section} data-cad-form>
      <div className={styles.container}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <div className={styles.heroBadge}>CAD agency matching for real project needs</div>
            <h1 className={styles.headline}>
              Get the right CAD team on your project. <span className={styles.headlineAccent}>Faster.</span>
            </h1>
            <p className={styles.heroLead}>
              Share your requirement once. Marathon identifies relevant CAD agencies from a network of 1,000+ partners,
              coordinates the initial questions and helps you compare the best-fit options before you choose.
            </p>

            <div className={styles.heroProof} aria-label="Marathon CAD services proof points">
              <div className={styles.proofItem}>
                <strong>1,000+</strong>
                <span>CAD agencies across software, industries and project types</span>
              </div>
              <div className={styles.proofItem}>
                <strong>1 brief</strong>
                <span>One clear requirement instead of repeating it to multiple vendors</span>
              </div>
              <div className={styles.proofItem}>
                <strong>0 commitment</strong>
                <span>Review the options before deciding who you want to work with</span>
              </div>
            </div>

            <div className={styles.heroAssurance}>
              <span><b>✓</b> Relevant partner matching</span>
              <span><b>✓</b> NDA available</span>
              <span><b>✓</b> You choose the final partner</span>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <CadServiceForm />
          </div>
        </div>

        <div className={styles.scopeStrip}>
          <p>Support for the CAD work already on your desk</p>
          <div className={styles.scopeList}>
            {SCOPE_ITEMS.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CadServiceHome
