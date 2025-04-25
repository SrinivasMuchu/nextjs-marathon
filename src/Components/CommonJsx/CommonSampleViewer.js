"use client"
import React from 'react'
import { useRouter } from "next/navigation";
import { cadViewerFiles } from '@/common.helper';
import styles from '../CadUploadingHome/CadHomeDesign/CadHome.module.css'

function CommonSampleViewer() {
      const router = useRouter();
        const handleViewFile = (fileId) => {
            localStorage.setItem('sample_view_cad_key', fileId)
    
            router.push("/tools/cad-renderer");
            // router.push(`/industry/robotics-and-automation/robotic-arm/cad-model-of-viper-robotic-arm-for-6801252ab1f61b010dd05a64/${fileId}`);
        }
  return (
    <div className={styles["cad-dropzone-samples"]}>
    <span>Sample files</span>
    <div className={styles["cad-dropzone-sample-btns"]}>
        {cadViewerFiles.map((file) => (

            <button key={file.id} onClick={() => handleViewFile(file.id)}>{file.name}</button>

        ))}
    </div>
</div>
  )
}

export default CommonSampleViewer