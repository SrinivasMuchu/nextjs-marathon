import React from 'react'
import FaqItem from './FaqItem'
import styles from './Faq.module.css'

const faqData = [
  {
    question: 'What is MarathonOS?',
    answer: 'MarathonOS is a marketplace where CAD designers sell CAD designs to engineers, agencies, and organizations. Buyers can discover designs, purchase securely, and download instantly.'
  },
  {
    question: 'How do I publish a CAD file?',
    answer: 'Go to your dashboard and click "Upload CAD File." Upload your file, add a title, description, previews, and pricing, then click "Publish" to list it on the marketplace.'
  },
  {
    question: 'How do I buy and download a design?',
    answer: 'Open the design page and click "Buy/Download." After checkout, your file will appear in your Purchases/Downloads section, where you can download it anytime based on the license.'
  },
  {
    question: 'How do licensing and usage rights work?',
    answer: 'All designs come with a Standard Usage License, allowing you to use, modify, remix, and commercially use the asset in your own products, client work, marketing, and team projects—royalty-free. Reselling or redistributing the original CAD file itself is not permitted.'
  },
  {
    question: 'How do creators earn money and get paid?',
    answer: 'Creators set their own prices when publishing. When a buyer purchases a design, creators earn the sale amount minus a 10% commission, with earnings visible in the dashboard.'
  },
  {
    question: 'Can I collaborate with other creators or share with my team?',
    answer: 'Yes. Collaboration is supported through your dashboard. You can work with other creators on shared projects, and teams can manage access to designs based on the license or plan.'
  },
  {
    question: 'What if there\'s a problem with a file or I need help?',
    answer: (
      <>
        If a file is broken, incorrect, or you need support, contact us via the Contact Us page or email{' '}
        <a href="mailto:invite@marathon-os.com" style={{ color: 'inherit', textDecoration: 'underline' }}>
          invite@marathon-os.com
        </a>
        {' '}with the listing link or order details, and we&apos;ll help resolve it.
      </>
    )
  }
]

function Faq() {
  return (
    <div className={styles.faqContainer}>
      <div className={styles.faqContent}>
        <div className={styles.faqHeader}>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
        </div>
        
        <div className={styles.faqList}>
          {faqData.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Faq
