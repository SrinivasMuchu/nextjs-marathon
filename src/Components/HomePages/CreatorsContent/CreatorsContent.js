import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IMAGEURLS } from '../../../config'
import { FaArrowRight } from 'react-icons/fa6'
import styles from './CreatorsContent.module.css'
import StartSellingButton from './StartSellingButton'

function CreatorsContent() {
  const steps = [
    {
      icon: IMAGEURLS.createProfileLogo,
      title: 'Create your profile',
      description: 'Set up your creator profile with your expertise and portfolio.'
    },
    {
      icon: IMAGEURLS.uploadCadFile,
      title: 'Upload CAD files',
      description: 'Upload your CAD files in supported formats to the platform.'
    },
    {
      icon: IMAGEURLS.addDetails,
      title: 'Add details',
      description: 'Add title, description, and tags so engineers can discover your designs.'
    },
    {
      icon: IMAGEURLS.setPrice,
      title: 'Set pricing & publish',
      description: 'Choose to share for free or set a price, then publish your design.'
    }
  ]

  return (
    <div className={styles.creatorsContentContainer}>
      <div className={styles.creatorsContentWrapper}>
        <div className={styles.creatorsContentLeft}>
          <Image src={IMAGEURLS.creatorMarathon} alt="creator-marathon" width={500} height={500} />
          <h3 className={styles.creatorsContentTitle}>Become a creator on Marathon-OS</h3>
          <p className={styles.creatorsContentDescription}>
            Publish your CAD designs, reach engineering teams, and monetize your work on a platform built for real engineering use.
          </p>
          <StartSellingButton />
        </div>
        {/* <div style={{ background: '#E5E7EB'}} className={styles.creatorsContentStepSeparator}></div> */}
        <div className={styles.creatorsContentRight}>
          {steps.map((step, index) => (
            <div key={index} className={styles.creatorsContentStep}>
              <div className={styles.creatorsContentStepIcon}>
                <Image 
                  src={step.icon} 
                  alt={step.title}
                  width={48}
                  height={48}
                />
              </div>
              <div className={styles.creatorsContentStepContent}>
                <h3 className={styles.creatorsContentStepTitle}>{step.title}</h3>
                <p className={styles.creatorsContentStepDescription}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CreatorsContent