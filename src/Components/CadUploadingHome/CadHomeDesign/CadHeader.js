import Image from 'next/image'
import React from 'react'
import styles from './CadHome.module.css'
import CadHomeDropZone from './CadHomeDropZone'
import { IMAGEURLS } from '@/config'
import FormateSelector from './FormateSelector'

function CadHeader() {
  return (
    <div className={styles['cad-landing-page']}>
      <div className={styles['cad-landing-left-cont']}>
        <div className={styles['cad-landing-left-content']}> <h1 className={styles['cad-landing-heading']}>
          Free Online CAD Viewer –Secure, Fast & Cloud-Based
        </h1>
          <p className={styles['cad-landing-description']}>A lightweight, online CAD viewer to quickly preview 3D models—anytime, anywhere.

          </p></div>
        {/* <FormateSelector/> */}

        <CadHomeDropZone isStyled={false} />
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