import React from 'react'
import styles from './NetworkSection.module.css'

const MATCH_ITEMS = [
  'CAD software fit',
  'Project and industry relevance',
  'Deliverable requirements',
  'Timeline and availability',
  'Scope complexity',
  'Communication and coordination',
]

function NetworkSection() {
  return (
    <section className={styles.section}>
      <div className={styles.narrow}>
        <div className={styles.layout}>
          <div className={styles.panel}>
            <div className={styles.number}>1,000+</div>
            <h3>Agencies in the network. One process for your team.</h3>
            <p>
              The size of the network creates choice. The matching process makes that choice useful by narrowing it to
              partners relevant to your requirement.
            </p>
          </div>

          <div className={styles.content}>
            <div className={styles.eyebrow}>Network depth with project-level matching</div>
            <h2>More options should lead to a better fit, not more work for you.</h2>
            <p>
              Marathon uses the information in your brief to identify agencies that are suitable for the actual work,
              not simply available in the directory.
            </p>

            <div className={styles.matchGrid}>
              {MATCH_ITEMS.map((item) => (
                <div key={item} className={styles.matchItem}>
                  <b>✓</b> {item}
                </div>
              ))}
            </div>

            <div className={styles.assurance}>
              <strong>Marathon coordinates the early-stage process.</strong> Your team gets a focused set of relevant
              options without managing multiple disconnected vendor conversations.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NetworkSection
