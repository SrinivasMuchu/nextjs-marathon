import React from 'react'
import { FileText, Phone, Search, CheckSquare, Clock } from 'lucide-react'
import EngagementModels from '../EngagementModels/EngagementModels'
import styles from './HowItWorks.module.css'

const STEPS = [
  {
    num: 1,
    icon: FileText,
    title: 'Submit Requirement',
    description: 'Fill the form with project details, files, and timeline.',
  },
  {
    num: 2,
    icon: Phone,
    title: 'We Clarify + Scope',
    description: 'Quick async or live clarification within hours — no waiting days.',
  },
  {
    num: 3,
    icon: Search,
    title: 'Match + Quote',
    description: 'We assign the right designer and share a fixed, transparent quote.',
  },
  {
    num: 4,
    icon: CheckSquare,
    title: 'Delivery + Iterations',
    description: 'Receive files, request revisions, approve — all in one place.',
  },
]

function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>Process</span>
        <h2 className={styles.title}>How it works</h2>
        <p className={styles.sub}>
          From requirement to delivery — fully managed, fully transparent.
        </p>
      </div>
      <div className={styles.stepsRow}>
        {STEPS.map((step) => {
          const Icon = step.icon
          return (
            <div key={step.num} className={styles.step}>
              <div className={styles.stepNum}>{step.num}</div>
              <div className={styles.stepIcon}>
                <Icon size={20} strokeWidth={2} color="#7C3AED" />
              </div>
              <h4 className={styles.stepTitle}>{step.title}</h4>
              <p className={styles.stepDesc}>{step.description}</p>
            </div>
          )
        })}
      </div>
      <div className={styles.kickoff}>
        <Clock size={16} strokeWidth={2} />
        <span>Typical kickoff within 24–72 hours of submission</span>
      </div>
      <EngagementModels embedded />
    </section>
  )
}

export default HowItWorks
