import React from 'react'
import styles from './TrustedByBanner.module.css'

const COMPANIES = [
  'NovaTech Engineering',
  'Form Factor Industrial',
  'BuildRight Architecture',
  'Ventus Automotive',
  'Nexlayer Products',
]

function TrustedByBanner() {
  return (
    <section className={styles.banner}>
      <span className={styles.intro}>TRUSTED BY TEAMS AT</span>
      <div className={styles.companies}>
        {COMPANIES.map((company) => (
          <span key={company} className={styles.companyName}>
            {company}
          </span>
        ))}
      </div>
    </section>
  )
}

export default TrustedByBanner
