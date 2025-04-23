import React from 'react'
import styles from '../CadUploadingHome/CadHomeDesign/CadHome.module.css'

function IndustryHeading({ part_name, industryData }) {
    return (
        <>
            {part_name ? <div className={styles['cad-landing-left-content']}> <h1 className={styles['cad-landing-heading']}>
                Free Online CAD Viewer for the {industryData.industry}
            </h1>
                <p className={styles['cad-landing-description']}>
                    A lightweight, online tool to convert 3D file like the {industryData.part_name}—anytime, anywhere, without installing any software.
                </p></div> : <div className={styles['cad-landing-left-content']}> <h1 className={styles['cad-landing-heading']}>
                Upload and view 3D CAD files like the {industryData.industry}—no software needed.
                </h1>
                <p className={styles['cad-landing-description']}>
                    A lightweight, online tool to convert 3D file formats—anytime, anywhere, without installing any software.
                </p></div>}
        </>

    )
}

export default IndustryHeading