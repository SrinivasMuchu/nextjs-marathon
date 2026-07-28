import React from 'react'
import styles from './WhyMarathon.module.css'

const FEATURES = [
  {
    title: 'Better-fit options',
    description:
      'Agencies are matched to your project type, CAD software, deliverables, timeline and relevant experience. You are not left searching through a generic directory.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="m15 9-2 4-4 2 2-4 4-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Less time spent sourcing',
    description:
      'Share the requirement once. Marathon coordinates the first round of questions, so your team spends less time on outreach, repeated calls and vendor follow-ups.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'A decision you control',
    description:
      'Compare the proposed approach, timeline and quotation. Choose the agency that fits your project, or decline the options without being locked in.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 4h12v16H6z" stroke="currentColor" strokeWidth="2" />
        <path d="M9 9h6M9 13h6M9 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
]

function WhyMarathon() {
  return (
    <section className={styles.section} id="why">
      <div className={styles.narrow}>
        <div className={styles.eyebrow}>Why Marathon</div>
        <h2 className={styles.title}>Your CAD requirement should not become another sourcing project.</h2>
        <p className={styles.sub}>
          When your internal team is full, the deadline is close or the work needs specialist expertise, Marathon gives
          you a faster path to relevant external capacity.
        </p>

        <div className={styles.grid}>
          {FEATURES.map((feature) => (
            <article key={feature.title} className={styles.card}>
              <div className={styles.icon}>{feature.icon}</div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDesc}>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyMarathon
