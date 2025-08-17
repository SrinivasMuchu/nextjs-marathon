import React from 'react'
import styles from './CreatorsDashboard.module.css'


const faqQuestions = [
    {
        question: "What file formats are supported?",
        answer: "We currently support industry-standard CAD formats including .stp, .step, .iges, .stl, and more. Our platform automatically generates previews for these formats."
    },
    {
        question: "How do I get paid?",
        answer: "Our monetization features are coming soon! Once launched, you'll be able to set prices for your designs and receive payments via Stripe. We'll take a small platform fee, and the rest goes directly to you."
    },
    {
        question: "Is Marathon-OS free to join?",
        answer: "Yes, creating a profile and sharing your designs is completely free. We only charge a small fee when you monetize your designs (optional)."
    },
    {
        question: "What happens if there's an IP dispute?",
        answer: "We take intellectual property seriously. If there's a dispute, we have a clear process for review. You maintain ownership of your designs, and we provide tools to help protect your work."
    },
    {
        question: "Can I remove my designs later?",
        answer: "Yes, you have full control over your content. You can update or remove your designs at any time through your creator dashboard."
    },
    

]
function CreatorFAQ() {
  return (
    <div className={styles.shareYourDesignsContainer} style={{background:'linear-gradient(0deg, rgba(255, 255, 255, 0.90) 0%, rgba(255, 255, 255, 0.90) 100%), #5B89FF'}}>
        <h1>Frequently Asked Questions</h1>
        <div style={{display:'flex', flexDirection:'column',gap:'20px',width:'100%', alignItems:'center', justifyContent:'center'}}>
            {faqQuestions.map((item, index) => (
                <div className={styles.faqItem} key={index} style={{background:'white', padding:'10px', borderRadius:'5px'}}>
                    <h2>{item.question}</h2>
                    <p>{item.answer}</p>
                </div>
            ))}
        </div>

    </div>
  )
}

export default CreatorFAQ