import React from 'react'
import { Check } from 'lucide-react'
import GetStartedButton from './GetStartedButton'
import styles from './EngagementModels.module.css'

const PLANS = [
  {
    title: 'Fixed Project',
    description: 'Best for: Defined scope with clear deliverables',
    features: [
      'Scoped quote upfront',
      'Milestone-based delivery',
      'Revisions included in scope',
      'Final file handover + checklist',
    ],
    badge: null,
    primary: false,
  },
  {
    title: 'Hourly Support',
    description: 'Best for: Ongoing changes or ad-hoc requests',
    features: [
      'Pay only for hours used',
      'Weekly timesheets',
      'Flexible scheduling',
      'No long-term commitment',
    ],
    badge: 'Most Popular',
    primary: true,
  },
  {
    title: 'Monthly Retainer',
    description: 'Best for: Continuous CAD needs at scale',
    features: [
      'Dedicated designer(s)',
      'Priority turnaround',
      'Volume discounts',
      'Monthly reporting',
    ],
    badge: null,
    primary: false,
  },
]

function EngagementModels({ embedded = false }) {
  const content = (
    <>
      <div className={styles.header}>
        <span className={styles.label}>Engagement Models</span>
        <h2 className={styles.title}>Choose what fits your workflow</h2>
      </div>
      <div className={styles.grid}>
        {PLANS.map((plan) => (
          <div
            key={plan.title}
            className={`${styles.card} ${plan.primary ? styles.featured : ''}`}
          >
            {plan.badge && (
              <div className={styles.badge}>{plan.badge}</div>
            )}
            <h3 className={styles.cardTitle}>{plan.title}</h3>
            <p className={styles.cardDesc}>{plan.description}</p>
            <ul className={styles.featureList}>
              {plan.features.map((feature) => (
                <li key={feature} className={styles.featureItem}>
                  <span className={styles.check}>
                    <Check size={10} strokeWidth={3} color="#7C3AED" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <GetStartedButton primary={plan.primary} />
          </div>
        ))}
      </div>
    </>
  )

  if (embedded) {
    return <div className={styles.embeddedWrap}>{content}</div>
  }

  return <section className={styles.section}>{content}</section>
}

export default EngagementModels
