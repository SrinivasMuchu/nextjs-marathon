import React from 'react'
import FaqAccordion from './FaqAccordion'
import RequestQuoteButton from '../RequestQuoteButton/RequestQuoteButton'
import styles from './Faq.module.css'

const FAQ_ITEMS = [
  {
    question: 'How fast can you start?',
    answer:
      'Most projects kick off within 24–72 hours of submitting your requirement. Once we scope and quote your project, a designer is assigned the same day you approve.',
  },
  {
    question: 'Which CAD tools do you support?',
    answer:
      'We support 15+ tools including SolidWorks, AutoCAD, Fusion 360, Creo, CATIA, NX, Revit, Inventor, ANSYS, and more. Just tell us your stack.',
  },
  {
    question: 'Who owns the IP?',
    answer:
      'You do. 100%. All deliverables, source files, and design data are fully transferred to you upon payment. We retain no rights.',
  },
  {
    question: 'Do you sign NDAs?',
    answer:
      'Yes. We sign mutual NDAs before project kick-off. All designers on our platform are bound by confidentiality agreements. Request one at any time.',
  },
  {
    question: 'Can you work from sketches or photos?',
    answer:
      'Absolutely. We work from hand sketches, photos, napkin drawings, PDFs, or verbal descriptions. If you can communicate the intent, we can model it.',
  },
  {
    question: 'What file formats will I get?',
    answer:
      'Native CAD format of your choice, plus STEP, IGES, STL, DWG, and PDF exports as required. We\'ll confirm the exact package during scoping.',
  },
  {
    question: 'How do revisions work?',
    answer:
      'Revision rounds are defined in your quote upfront. We don\'t surprise you with extra charges. If scope changes significantly, we\'ll renegotiate transparently before proceeding.',
  },
  {
    question: 'How do you estimate cost and timeline?',
    answer:
      'After you submit your requirement, we scope with you (async or a quick call), then present a fixed quote with delivery timeline. No hourly surprises unless you choose hourly.',
  },
  {
    question: 'Do you support long-term engagement?',
    answer:
      'Yes — our Monthly Retainer model gives you a dedicated designer, priority turnaround, and volume pricing for teams with continuous CAD needs.',
  },
]

function Faq() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>FAQ</span>
        <h2 className={styles.title}>Frequently asked questions</h2>
        <p className={styles.sub}>
          Everything you need to know before getting started.
        </p>
      </div>
      <FaqAccordion items={FAQ_ITEMS} />
      <div className={styles.ctaWrap}>
        <RequestQuoteButton variant="light" />
      </div>
    </section>
  )
}

export default Faq
