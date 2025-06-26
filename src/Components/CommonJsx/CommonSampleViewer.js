"use client"
import React from 'react'
import { useRouter } from "next/navigation";
import { cadViewerFiles, sendViewerEvent } from '@/common.helper';
import styles from '../CadUploadingHome/CadHomeDesign/CadHome.module.css'

function CommonSampleViewer() {
      const router = useRouter();
        const handleViewFile = (fileId) => {
          sendViewerEvent(`viewer_sample_file_clicked`);
            router.push(`/tools/cad-renderer?fileId=${fileId}&sample=true`);
        }
  return (
    <div className={styles["cad-dropzone-samples"]}>
    <span>Don&apos;t have a file? Try one of these samples:</span>
    <div className={styles["cad-dropzone-sample-btns"]}>
        {cadViewerFiles.map((file) => (
            <button key={file.id} onClick={() => handleViewFile(file.id)}>{file.name}</button>
        ))}
    </div>
</div>
  )
}

export default CommonSampleViewer