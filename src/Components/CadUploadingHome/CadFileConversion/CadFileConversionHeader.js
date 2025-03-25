import React from 'react'
import styles from '../CadHomeDesign/CadHome.module.css'
import CadFileUploads from './CadFileUploads'

function CadFileConversionHeader() {
    return (
        <div className={styles['cad-landing-page']}>
            <div className={styles['cad-landing-left-cont']}>
                <div className={styles['cad-landing-left-content']}> <h1 className={styles['cad-landing-heading']}>
                    Free Online CAD Viewer –Secure, Fast & Cloud-Based
                </h1>
                    <p className={styles['cad-landing-description']}>A lightweight, online CAD viewer to quickly preview 3D models—anytime, anywhere.

                    </p></div>


                <CadFileUploads />
            </div>

        </div>
    )
}

export default CadFileConversionHeader