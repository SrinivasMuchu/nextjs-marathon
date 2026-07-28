import React from 'react'
import styles from './HowItWorks.module.css'

const STEPS = [
  {
    num: '01',
    title: 'Share the requirement once',
    description: 'Tell us what needs to be designed, the expected output, preferred software and target timeline.',
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 3h7l4 4v14H7z" stroke="currentColor" strokeWidth="2" />
        <path d="M14 3v5h5M10 12h5M10 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'We identify relevant agencies',
    description: 'Marathon checks the network for partners that fit the capability, software, scope and availability you need.',
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="2" />
        <path d="m15 15 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Review questions and quotations',
    description: 'We coordinate clarifications and bring the relevant responses together so you can compare the available options.',
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 5h14v14H5z" stroke="currentColor" strokeWidth="2" />
        <path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Choose the partner and start',
    description: 'Finalise the agency, confirm the working terms, share the detailed files and move the project forward.',
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

function HowItWorks() {
  return (
    <section className={styles.section} id="process">
      <div className={styles.narrow}>
        <div className={styles.eyebrow}>How it works</div>
        <h2 className={styles.title}>One coordinated process from requirement to project start.</h2>
        <p className={styles.sub}>
          You focus on the work that needs to get done. Marathon organises the search and initial coordination.
        </p>

        <div className={styles.stepsGrid}>
          {STEPS.map((step) => (
            <article key={step.num} className={styles.stepCard}>
              <div className={styles.stepTop}>
                <span className={styles.stepNumber}>Step {step.num}</span>
                <div className={styles.icon}>{step.icon}</div>
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.description}</p>
            </article>
          ))}
        </div>

        <div className={styles.processNote}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 10V8a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span>
            <strong>Your project details stay controlled.</strong> Agencies receive only the information needed to
            assess fit. Detailed files are shared with the agency you select, under NDA where required.
          </span>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
