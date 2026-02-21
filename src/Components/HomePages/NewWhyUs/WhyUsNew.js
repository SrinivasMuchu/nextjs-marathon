import React from 'react'
import Image from 'next/image'
import { IMAGEURLS } from '../../../config'
import styles from './WhyUsNew.module.css'

function WhyUsNew() {
  const features = [
    {
      image: IMAGEURLS.whyUs1,
      title: 'No blind downloads',
      description: 'Preview CAD files online using Marathon previewer before you pay.'
    },
    {
      image: IMAGEURLS.whyUs2,
      title: 'Quality-checked designs',
      description: 'Every CAD file is manually reviewed before listing.'
    },
    {
      image: IMAGEURLS.whyUs3,
      title: 'Built for engineering use',
      description: 'Focused on real engineering, manufacturing, and production needs.'
    }
  ]

  return (
    <div className={styles.whyUsNewContainer} id="why-us">
      <div className={styles.whyUsNewHeader}>
        <h3 className={styles.whyUsNewTitle}>Why Marathon-OS?</h3>
        <p className={styles.whyUsNewSubtitle}>
          For people who need CAD files they can actually trust and use.
        </p>
        <div className={styles.whyUsNewCards}>
        {features.map((feature, index) => (
          <div key={index} className={styles.whyUsNewCard}>
            <div className={styles.whyUsNewCardImage}>
              <Image 
                src={feature.image} 
                alt={feature.title}
                width={400}
                height={300}
                className={styles.whyUsNewImage}
                unoptimized
              />
            </div>
            <div className={styles.whyUsNewCardContent} style={{ padding: '20px' }}
            >
              <h3 className={styles.whyUsNewCardTitle}>{feature.title}</h3>
              <p className={styles.whyUsNewCardDescription}>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
      </div>
      
      
    </div>
  )
}

export default WhyUsNew