import React from 'react'
import styles from '../CadHomeDesign/CadHome.module.css'
import CadFileConversionContent from './CadFileConversionContent'
import CadDynamicHeading from './CadDynamicHeading'
import CadDynamicContent from './CadDynamicContent'

function CadFileConversionHeader({ convert }) {
    return (
        <div className={styles['cad-landing-page']}>
            <div className={styles['cad-landing-left-cont']}>
                {convert ? <>  <CadDynamicContent/></> : <>  <div className={styles['cad-landing-left-content']}> <h1 className={styles['cad-landing-heading']}>
                        Free Online 3D File Converter – Secure, Fast & Cloud-Based
                    </h1>
                        <p className={styles['cad-landing-description']}>
                            A lightweight, online tool to convert 3D file formats—anytime, anywhere, without installing any software.
                        </p></div></>}



                <CadFileConversionContent convert={convert}/>
            </div>

        </div>
    )
}

export default CadFileConversionHeader