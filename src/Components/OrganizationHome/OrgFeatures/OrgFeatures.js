import { IMAGEURLS } from '@/config'
import Image from 'next/image'
import React from 'react'
import styles from './OrgFeatures.module.css'

function OrgFeatures({type}) {
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
            {type === 'org' &&  <div className={styles['features-text']}>
                <Image src={IMAGEURLS.importExport} alt="Organization Features" width={24} height={24} />
                <span>Import / export anytime</span>
            </div>}
           
           {type === 'cad' && <div className={styles['features-text']}>
                <Image src={IMAGEURLS.uploadLimit} alt="Organization Features" width={24} height={24} />
                <span>add upto 300MB</span>
            </div>}
            
        </div>
    </div>
  )
}

export default OrgFeatures