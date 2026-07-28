import React from 'react'
import styles from './BriefSection.module.css'

const BRIEF_ITEMS = [
  {
    num: '1',
    title: 'What needs to be done',
    description:
      'Part modelling, assembly work, drawings, enclosure design, revisions, conversion or ongoing drafting support.',
  },
  {
    num: '2',
    title: 'What you need delivered',
    description: 'Native CAD files, manufacturing drawings, BOMs, exports, revisions or a defined package of outputs.',
  },
  {
    num: '3',
    title: 'Software and file requirements',
    description: 'Your preferred CAD tool, current file formats and any standards the final work must follow.',
  },
  {
    num: '4',
    title: 'Timeline and useful context',
    description: 'Your target date, current project stage and any references that help explain the work.',
  },
]

function BriefSection() {
  return (
    <section className={styles.section} id="brief">
      <div className={styles.narrow}>
        <div className={styles.layout}>
          <div className={styles.copy}>
            <div className={styles.eyebrow}>A better brief creates a better match</div>
            <h2 className={styles.title}>Give us the essentials. We will take it from there.</h2>
            <p className={styles.lead}>
              You do not need a long proposal document. A clear project summary is enough for Marathon to understand the
              requirement and find the right type of CAD support.
            </p>

            <div className={styles.list}>
              {BRIEF_ITEMS.map((item) => (
                <div key={item.num} className={styles.item}>
                  <div className={styles.check}>{item.num}</div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.sample}>
            <span className={styles.sampleLabel}>Example of a useful brief</span>
            <h3>Clear enough to match. Simple enough to submit.</h3>
            <blockquote>
              “We need a sheet-metal enclosure model and manufacturing drawings for an electronics product. The PCB
              layout is ready. The work should be completed in SOLIDWORKS, with the first design version required within
              two weeks. We can share the full dimensions and internal product files after selecting the agency.”
            </blockquote>
            <div className={styles.sampleFooter}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="m5 12 4 4L19 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Enough information to shortlist relevant agencies before the full technical handover.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BriefSection
