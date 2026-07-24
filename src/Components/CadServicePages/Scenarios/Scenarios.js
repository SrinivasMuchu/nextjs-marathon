import React from 'react'
import styles from './Scenarios.module.css'

const SCENARIOS = [
  {
    tag: 'Capacity gap',
    title: 'Your internal team is already full',
    description:
      'A drawing backlog, a new project or a sudden workload spike is taking attention away from higher-priority engineering work.',
    result: 'Bring in external capacity without starting a long hiring cycle.',
  },
  {
    tag: 'Specialist requirement',
    title: 'The work needs a specific tool or capability',
    description:
      'You need an agency with experience in a particular CAD platform, enclosure type, drawing standard or manufacturing process.',
    result: 'Compare partners selected for the actual technical requirement.',
  },
  {
    tag: 'Time-sensitive delivery',
    title: 'The project cannot sit in a sourcing queue',
    description:
      'The next prototype, manufacturing release or client commitment depends on getting the CAD work started quickly.',
    result: 'Move from requirement to relevant agency options through one coordinated process.',
  },
]

function Scenarios() {
  return (
    <section className={styles.section} id="clients">
      <div className={styles.narrow}>
        <div className={styles.eyebrow}>Common client requirements</div>
        <h2 className={styles.title}>Built for the moments when the work cannot wait.</h2>
        <p className={styles.sub}>
          Marathon is most useful when your team needs extra CAD capacity, a specific skill set or a faster route to a
          dependable external partner.
        </p>

        <div className={styles.grid}>
          {SCENARIOS.map((scenario) => (
            <article key={scenario.tag} className={styles.card}>
              <div className={styles.tag}>{scenario.tag}</div>
              <h3>{scenario.title}</h3>
              <p>{scenario.description}</p>
              <div className={styles.result}>
                <b>✓</b>
                <span>{scenario.result}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Scenarios
