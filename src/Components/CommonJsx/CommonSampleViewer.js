"use client"
import React from 'react'
import { useRouter } from "next/navigation";
import { cadViewerFiles, sendGAtagEvent } from '@/common.helper';
import styles from '../CadUploadingHome/CadHomeDesign/CadHome.module.css'
import { CAD_VIEWER_EVENT } from '@/config';

function CommonSampleViewer() {
      const router = useRouter();
        const handleViewFile = (fileId) => {
          sendGAtagEvent({ event_name: 'viewer_sample_file_clicked', event_category: CAD_VIEWER_EVENT })

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