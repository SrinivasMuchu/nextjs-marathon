import Image from 'next/image'
import React from 'react'
import styles from './CadHome.module.css'
import CadDropZoneContent from './CadDropZoneContent'
import { IMAGEURLS } from '@/config'
import FormateSelector from './FormateSelector'
import LeftRightBanner from '@/Components/CommonJsx/Adsense/AdsBanner'

function CadHeader({type}) {
  return (
    <div className={styles['cad-landing-page']}>
      <div style={{width:'100%',maxWidth:'100%',margin:'0 auto',boxSizing:'border-box',position:'relative',height:'100px'}}>
                <LeftRightBanner adSlot="3755241003"/>
            </div>
      <div className={styles['cad-landing-left-cont']}>
        <div className={styles['cad-landing-left-content']}> <h1 className={styles['cad-landing-heading']}>
          Free Online CAD Viewer –Secure, Fast & Cloud-Based
        </h1>
          <p className={styles['cad-landing-description']}>A lightweight, online CAD viewer to quickly preview 3D models—anytime, anywhere.

          </p></div>
        {/* <FormateSelector/> */}

        <CadDropZoneContent isStyled={false} type={type}/>
      </div>
      {/* <div className={styles["cad-landing-wrapper"]}>
        <div className={styles["cad-landing-bg-circle"]}></div>
        <div className={styles["cad-landing-right-cont"]}>
          <Image src={IMAGEURLS.carLogo} alt="upload" width={400} height={360} />
        </div>
      </div> */}

    </div>
  )
}

export default CadHeader