import React from 'react'
import styles from '../CadHomeDesign/CadHome.module.css'
import CadFileConversionContent from './CadFileConversionContent'
import CadDynamicHeading from './CadDynamicHeading'
import CadDynamicContent from './CadDynamicContent'
import LeftRightBanner from '@/Components/CommonJsx/Adsense/AdsBanner'

function CadFileConversionHeader({ convert, conversionParams }) {
    return (
        <div className={styles['cad-landing-page']}>
            <div style={{width:'100%',maxWidth:'100%',margin:'0 auto',boxSizing:'border-box',position:'relative',height:'100px'}}>
                <LeftRightBanner adSlot="3755241003"/>
            </div>
            <div className={styles['cad-landing-left-cont']}>
                {convert ? <>  <CadDynamicContent conversionParams={conversionParams}/></> : <>  <div className={styles['cad-landing-left-content']}> <h1 className={styles['cad-landing-heading']}>
                        Free Online 3D File Converter – Secure, Fast & Cloud-Based
                    </h1>
                        <p className={styles['cad-landing-description']}>
                            A lightweight, online tool to convert 3D file formats—anytime, anywhere, without installing any software.
                        </p></div></>}



                <CadFileConversionContent convert={convert} conversionParams={conversionParams}/>
            </div>
           
           
        </div>
    )
}

export default CadFileConversionHeader