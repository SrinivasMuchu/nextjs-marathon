import React from 'react'
import styles from './Testimonials.module.css'

const TESTIMONIALS = [
  {
    quote: "Marathon cut our CAD turnaround by 60%. The 3D models were production-ready from day one. We've been on their retainer model for 8 months and haven't looked back.",
    name: 'Sarah Chen',
    role: 'VP of Engineering, NovaTech Engineering',
    initials: 'SC',
    avatarColor: '#7C3AED',
  },
  {
    quote: "We needed 50+ sheet metal parts modeled in SolidWorks with full drawing packs — ahead of schedule, zero revision requests from our manufacturing partner.",
    name: 'James Rodriguez',
    role: 'Product Design Lead, FormFactor Industrial',
    initials: 'JR',
    avatarColor: '#059669',
  },
  {
    quote: "Their Revit team integrated seamlessly with our workflow. LOD 300 models were accurate, well-organized, and saved us weeks of internal effort on a brutal deadline.",
    name: 'Anika Patel',
    role: 'BIM Manager, BuildRight Architecture',
    initials: 'AP',
    avatarColor: '#DC2626',
  },
]

function Testimonials() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>Social Proof</span>
        <h2 className={styles.title}>Trusted by engineering teams building real products</h2>
        <p className={styles.sub}>
          What companies with demanding CAD workflows say about working with us.
        </p>
      </div>
      <div className={styles.grid}>
        {TESTIMONIALS.map((t) => (
          <div key={t.initials} className={styles.card}>
            <div className={styles.stars}>★★★★★</div>
            <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>
            <div className={styles.author}>
              <div className={styles.avatar} style={{ background: t.avatarColor }}>
                {t.initials}
              </div>
              <div>
                <div className={styles.name}>{t.name}</div>
                <div className={styles.role}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
