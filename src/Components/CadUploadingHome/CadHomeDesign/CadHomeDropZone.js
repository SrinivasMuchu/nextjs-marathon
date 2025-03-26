

import React from "react";
import styles from "./CadHome.module.css";
import CadDropZoneWrapper from "./CadDropZoneWrapper";

function CadHomeDropZone({ isStyled,allowedFormats,type }) {

  return (
    <>

<CadDropZoneWrapper isStyled={isStyled} type={type}>
     
        <div className={styles["cad-dropzone-content"]} style={isStyled ? { textAlign: "center", alignItems: "center" } : {}}>
          <p className={styles["cad-dropzone-head"]}>
            Drag & drop your 3D{" "}
            <span className={styles["cad-dropzone-file"]} style={{ cursor: "pointer" }}>
              files
            </span>{" "}
            here
          </p>
          <p className={styles["cad-dropzone-desc"]} style={isStyled ? { width: "80%", textAlign: "center" } : {}}>
            { `Supported formats: ${allowedFormats.join(", ")}`}
          </p>

         
        </div>
    
    </CadDropZoneWrapper>

    </>




  );
}

export default CadHomeDropZone;
