import React from 'react'
import FaqItem from './FaqItem'
import styles from './Faq.module.css'

const faqData = [
  {
    question: 'How do I publish a CAD file?',
    answer: 'To publish a CAD file, navigate to your dashboard and click on "Upload CAD File". Select your file, add a title, description, and set your pricing. Once you\'ve filled in all the required details, click "Publish" to make your design available on the marketplace.'
  },
  {
    question: 'How can I earn money with my designs?',
    answer: 'You can earn money by setting a price for your CAD designs when publishing them. When other users purchase your designs, you\'ll receive the payment (minus platform fees). You can also offer free designs to build your reputation and portfolio.'
  },
  {
    question: 'What are the community guidelines?',
    answer: 'Our community guidelines ensure a respectful and professional environment. Be respectful to other creators, provide accurate descriptions for your designs, and ensure all uploaded files comply with intellectual property laws. Harassment, spam, or inappropriate content is not tolerated.'
  },
  {
    question: 'How do I get support?',
    answer: 'You can get support by contacting our support team through the "Contact Us" page, or by emailing invite@marathon-os.com. We also have a comprehensive help center with articles and tutorials to help you get started.'
  },
  {
    question: 'Can I collaborate with other creators?',
    answer: 'Yes! Collaboration is encouraged on Marathon-OS. You can work with other creators on joint projects, share designs privately with team members, and even create collaborative collections. Use the collaboration features in your dashboard to invite others to work together.'
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
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Faq
