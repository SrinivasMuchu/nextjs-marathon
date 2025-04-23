import React from 'react'
import IndustryUploadWrapper from './IndustryUploadWrapper'
import styles from '../CadUploadingHome/CadHomeDesign/CadHome.module.css'

function IndustryUpload() {
    return (
        <IndustryUploadWrapper>
            <div className={styles["cad-dropzone-content"]}>
                <p className={styles['cad-dropzone-head']}>
                    Drag & drop your 3D <span className={styles['cad-dropzone-file']} style={{ cursor: 'pointer' }}>files</span> 

                </p>
                <p className={styles['cad-dropzone-desc']} >
                     Supported formats: STEP (.step, .stp), IGES (.igs, .iges), STL (.stl), PLY (.ply), OFF (.off), BREP (.brp, .brep)

                </p>


            </div>
        </IndustryUploadWrapper>
    )
}

export default IndustryUpload