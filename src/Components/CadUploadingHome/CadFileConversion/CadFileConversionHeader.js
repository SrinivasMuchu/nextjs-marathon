import React from 'react'
import styles from '../CadHomeDesign/CadHome.module.css'
import CadFileConversionContent from './CadFileConversionContent'
import CadDynamicHeading from './CadDynamicHeading'
import CadDynamicContent from './CadDynamicContent'
import LeftRightBanner from '@/Components/CommonJsx/Adsense/AdsBanner'

function CadFileConversionHeader({ convert, conversionParams }) {
    return (
        <div className={styles['cad-landing-page']}>
            <div style={{width:'100%',display:'flex',justifyContent:'center',boxSizing:'border-box',position:'relative',minHeight:'100px'}}>
                <div style={{width:'100%',maxWidth:'970px',margin:'0 auto'}}>
                    <LeftRightBanner adSlot="3755241003"/>
                </div>
            </div>
            <div className={styles['cad-landing-left-cont']}>
                {convert ? <>  <CadDynamicContent conversionParams={conversionParams}/></> : <>  <div className={styles['cad-landing-left-content']}> <h1 className={styles['cad-landing-heading']}>
                Free Online 3D CAD File Converter
                    </h1>
                        <p className={styles['cad-landing-description']}>
                        Secure, lightweight online converter to change CAD & 3D file 
                        formats instantly. Anytime, anywhere.  </p></div></>}



                <CadFileConversionContent convert={convert} conversionParams={conversionParams}/>
            </div>
           
           
        </div>
    )
}

export default CadFileConversionHeader