import React from 'react'
import { Users, TrendingUp, FileText } from 'lucide-react'
import styles from './WhyMarathon.module.css'

const FEATURES = [
  {
    icon: Users,
    title: 'Vetted Designers Only',
    description:
      'Every designer on our platform passes a multi-stage vetting — tool proficiency tests, portfolio review, and trial project. You only ever work with proven professionals.',
  },
  {
    icon: TrendingUp,
    title: 'Flexible Engagement',
    description:
      'Scale up or down as your project needs shift. Pick hourly for ad-hoc work, fixed-price for scoped projects, or a monthly retainer when you need dedicated capacity.',
  },
  {
    icon: FileText,
    title: 'Production-Ready Outputs',
    description:
      'Native CAD files, full export packages, and manufacturing-ready drawing packs — delivered with zero revision surprises. What ships from us, ships to your factory.',
  },
]

function WhyMarathon() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>Why Marathon</span>
        <h2 className={styles.title}>Outsource CAD without the hiring overhead</h2>
        <p className={styles.sub}>
          You send requirements → we match a vetted designer → you get production-ready deliverables. No recruitment, no overhead, no delays.
        </p>
      </div>
      <div className={styles.grid}>
        {FEATURES.map((feature) => {
          const Icon = feature.icon
          return (
            <div key={feature.title} className={styles.card}>
              <div className={styles.icon}>
                <Icon size={22} strokeWidth={2} color="#7C3AED" />
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDesc}>{feature.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default WhyMarathon
