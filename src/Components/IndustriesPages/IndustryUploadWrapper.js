import { IMAGEURLS } from '@/config'
import React from 'react'
import styles from '../CadUploadingHome/CadHomeDesign/CadHome.module.css'
import { contextState } from "@/Components/CommonJsx/ContextProvider";
import Image from 'next/image';

function IndustryUploadWrapper({children}) {
    return (
        <div
            className={styles["cad-dropzone"]}
            // onDrop={handleDrop}
            // onDragOver={handleDragOver}
            // onClick={handleClick}


        >
            <input
                type="file"
                // ref={fileInputRef}
                style={{ display: "none" }}
                // accept={allowedFormats.join(", ")}
                // onChange={handleFileChange}
            />
            {children}
            <Image
                src={IMAGEURLS.uploadIcon}
                alt="upload"
                width={68}
                height={68}
                style={{ cursor: "pointer" }}
            />
        </div>
    )
}

export default IndustryUploadWrapper