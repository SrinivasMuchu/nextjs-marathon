

import React, { useRef, useState, useEffect } from "react";
import styles from '../CadHomeDesign/CadHome.module.css'
import CadFileConversionWrapper from './CadFileConversionWrapper'

function CadFileUploads({ convert,allowedFormats }) {
   
   
   
 
    return (
        <>

            <CadFileConversionWrapper convert={convert}>
                    <div className={styles["cad-dropzone-content"]}>
                        <p className={styles['cad-dropzone-head']}>
                            Drag & drop your 3D <span className={styles['cad-dropzone-file']} style={{ cursor: 'pointer' }}>files</span> here to convert

                        </p>
                        <p className={styles['cad-dropzone-desc']} >
                        {convert ? `Supported formats:${allowedFormats.join(", ")}` : "Supported formats: STEP (.step, .stp), IGES (.igs, .iges), STL (.stl), PLY (.ply), OFF (.off), BREP (.brp, .brep), OBJ (.obj)"}
                           

                        </p>
                        

                    </div>
                    </CadFileConversionWrapper>

        </>




    );
}

export default CadFileUploads;


