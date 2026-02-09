import { IMAGEURLS } from '@/config'
import Image from 'next/image'
import React from 'react'
import styles from './OrgFeatures.module.css'

function OrgFeatures({type}) {
  return (
    <div className={styles['features-page']}>
        <div className={styles['features-cont']}>
            {type === 'cad' ? (
              <>
                <div className={styles['features-text']}>
                  <Image src={IMAGEURLS.check} alt="CAD Viewer feature" width={24} height={24} />
                  <span>Open CAD files instantly in your browser.</span>
                </div>
                <div className={styles['features-text']}>
                  <Image src={IMAGEURLS.check} alt="CAD Viewer feature" width={24} height={24} />
                  <span>No software needed.</span>
                </div>
                <div className={styles['features-text']}>
                <Image src={IMAGEURLS.check} alt="CAD Viewer feature" width={24} height={24} />
                  <span>Private uploads.</span>
                </div>
                <div className={styles['features-text']}>
                <Image src={IMAGEURLS.check} alt="CAD Viewer feature" width={24} height={24} />
                  <span>Automatically deleted after 24hrs.</span>
                </div>
                <div className={styles['features-text']}>
                <Image src={IMAGEURLS.check} alt="CAD Viewer feature" width={24} height={24} />
                  <span>Upload files up to 300 MB</span>
                </div>
              </>
            ) : (
              <>
                <div className={styles['features-text']}>
                  <Image src={IMAGEURLS.check} alt="Organization Features" width={24} height={24} />
                  <span>File stay private</span>
                </div>
                <div className={styles['features-text']}>
                  <Image src={IMAGEURLS.check} alt="Organization Features" width={24} height={24} />
                  <span>Automatically deleted after 24hrs</span>
                </div>
                {type === 'org' && (
                  <div className={styles['features-text']}>
                    <Image src={IMAGEURLS.check} alt="Organization Features" width={24} height={24} />
                    <span>Import / export anytime</span>
                  </div>
                )}
              </>
            )}
        </div>
    </div>
  )
}

export default OrgFeatures