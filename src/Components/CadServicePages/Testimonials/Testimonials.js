import React from 'react'
import RequestQuoteButton from '../RequestQuoteButton/RequestQuoteButton'
import styles from './Testimonials.module.css'

const TESTIMONIALS = [
  {
    quote:
      "Marathon cut our CAD turnaround by 60%. We were struggling to keep pace with our product roadmap — two engineers were bottlenecked just on 3D modeling. Within a week of onboarding Marathon, we had a dedicated SolidWorks designer who understood our tolerancing standards from day one. The files were production-ready, GD&T was clean, and not a single part came back from our CM with a query. We've been on their monthly retainer for 8 months and I'd recommend them to any hardware team that wants to move fast without burning out their internal team.",
    metric: '↑ 60% faster CAD turnaround',
    metricVariant: null,
    name: 'Sarah C.',
    role: 'VP of Engineering',
    roleLine2: 'Industrial Equipment Manufacturer',
    initials: 'SC',
    avatarStyle: { background: 'linear-gradient(135deg,#7C3AED,#A78BFA)' },
    style: 'styleB',
    featured: true,
  },
  {
    quote:
      "50+ sheet metal parts in SolidWorks, full drawing packs with title blocks, delivered ahead of schedule. Zero revision requests came back from our manufacturing partner. That's never happened before.",
    metric: '0 revision requests from CM',
    metricVariant: null,
    name: 'James R.',
    role: 'Product Design Lead',
    roleLine2: 'Consumer Hardware Brand',
    initials: 'JR',
    avatarStyle: { background: 'linear-gradient(135deg,#059669,#34D399)' },
    style: 'styleA',
    featured: false,
  },
  {
    quote:
      "Their Revit team integrated seamlessly. LOD 300 models were accurate, well-organized, and saved us weeks of internal effort on a brutal project deadline. We're now using them as a permanent overflow resource.",
    metric: 'Weeks of internal effort saved',
    metricVariant: 'green',
    name: 'Anika P.',
    role: 'BIM Manager',
    roleLine2: 'Architecture & Construction Firm',
    initials: 'AP',
    avatarStyle: { background: 'linear-gradient(135deg,#0D9488,#5EEAD4)' },
    quoteMarkColor: '#6EE7B7',
    style: 'styleD',
    featured: false,
  },
  {
    quote:
      "We sent a sketch on a napkin and a WhatsApp voice note explaining the concept. Three days later we had a fully-dimensioned Fusion 360 model ready for prototyping. Genuinely impressive.",
    metric: 'Sketch → prototype-ready in 3 days',
    metricVariant: null,
    name: 'Marco K.',
    role: 'Co-founder & CPO',
    roleLine2: 'D2C Hardware Startup',
    initials: 'MK',
    avatarStyle: { background: 'linear-gradient(135deg,#7C3AED,#EC4899)' },
    style: 'styleC',
    featured: false,
  },
  {
    quote:
      "As an automotive supplier, our tolerances are unforgiving. Marathon matched us with a CATIA V5 specialist who understood GD&T at a professional level. No hand-holding required — they just got it.",
    metric: 'CATIA V5 + GD&T specialist match',
    metricVariant: null,
    name: 'Rajiv S.',
    role: 'Senior Design Engineer',
    roleLine2: 'Automotive Tier-1 Supplier',
    initials: 'RS',
    avatarStyle: { background: 'linear-gradient(135deg,#DC2626,#F87171)' },
    style: 'styleE',
    featured: false,
  },
  // {
  //   quote:
  //     'We were quoted 6 weeks by a local firm. Marathon delivered a complete furniture assembly package — exploded views, BOM, CNC-ready DXFs — in 9 days. The quality was better and the cost was half.',
  //   metric: '6-week job done in 9 days',
  //   metricVariant: 'amber',
  //   name: 'Lena B.',
  //   role: 'Head of Product',
  //   roleLine2: 'Furniture & Home Goods Brand',
  //   initials: 'LB',
  //   avatarStyle: { background: 'linear-gradient(135deg,#D97706,#FCD34D)', color: '#1A1635' },
  //   quoteMarkColor: '#FCD34D',
  //   style: 'styleF',
  //   featured: false,
  // },
]

function Testimonials() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.rating}>
          <span className={styles.ratingStars}>★★★★★</span>
          <span>Rated 4.9/5 across 500+ delivered projects</span>
        </div>
        <h2 className={styles.title}>What our clients actually say</h2>
        <p className={styles.sub}>
          Engineering teams, product designers, and BIM managers who&apos;ve shipped with Marathon.
        </p>
      </div>
      <div className={styles.grid}>
        {TESTIMONIALS.map((t) => (
          <div
            key={t.initials}
            className={`${styles.card} ${styles[t.style]} ${t.featured ? styles.featuredCard : ''}`}
          >
            <div>
              <div className={styles.cardStars}>★★★★★</div>
              <span
                className={styles.quoteMark}
                style={t.quoteMarkColor ? { color: t.quoteMarkColor } : undefined}
              >
                &ldquo;
              </span>
              <p className={styles.quote}>{t.quote}</p>
              <div
                className={`${styles.metric} ${t.metricVariant ? styles[t.metricVariant] : ''}`}
              >
                {t.metric}
              </div>
            </div>
            <div className={styles.author}>
              <div className={styles.avatar} style={t.avatarStyle}>
                {t.initials}
              </div>
              <div>
                <div className={styles.name}>{t.name}</div>
                <div className={styles.role}>
                  {t.role}
                  <br />
                  {t.roleLine2}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.ctaWrap}>
        <RequestQuoteButton variant="light" />
      </div>
    </section>
  )
}

export default Testimonials
