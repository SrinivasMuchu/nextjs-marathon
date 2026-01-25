'use client'
import React, { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import styles from './Faq.module.css'

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={styles.faqItem}>
      <button 
        className={styles.faqQuestion} 
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        <span className={styles.faqQuestionText}>{question}</span>
        <FiChevronDown 
          className={`${styles.faqIcon} ${isOpen ? styles.faqIconOpen : ''}`} 
        />
      </button>
      {isOpen && (
        <div className={styles.faqAnswer}>
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}

export default FaqItem
