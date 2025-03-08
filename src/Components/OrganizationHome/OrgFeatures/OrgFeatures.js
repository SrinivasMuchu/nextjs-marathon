import { IMAGEURLS } from '@/config'
import Image from 'next/image'
import React from 'react'
import styles from './OrgFeatures.module.css'

function OrgFeatures() {
  return (
    <div className={styles['features-page']}>
        <div className={styles['features-cont']}>
            <div className={styles['features-text']}>
                <Image src={IMAGEURLS.safetyIcon} alt="Organization Features" width={24} height={24} />
                <span>File stay private</span>
            </div>
            <div className={styles['features-text']}>
                <Image src={IMAGEURLS.autoDelete} alt="Organization Features" width={24} height={24} />
                <span>Automatically deleted after 24hrs</span>
            </div>
            <div className={styles['features-text']}>
                <Image src={IMAGEURLS.importExport} alt="Organization Features" width={24} height={24} />
                <span>Import / export anytime</span>
            </div>
        </div>
    </div>
  )
}

export default OrgFeatures