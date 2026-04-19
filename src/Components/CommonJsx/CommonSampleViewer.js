"use client"
import React from 'react'
import { useRouter } from "next/navigation";
import { cadViewerFiles, sendGAtagEvent } from '@/common.helper';
import styles from '../CadUploadingHome/CadHomeDesign/CadHome.module.css'
import heroStyles from '../CadUploadingHome/CadHomeDesign/CadViewerHero.module.css'
import { CAD_VIEWER_EVENT } from '@/config';
import { Car, Truck, Wrench, Radio } from 'lucide-react'

const SAMPLE_ICONS = [Car, Truck, Wrench, Radio]

function CommonSampleViewer({ variant }) {
  const router = useRouter();
  const handleViewFile = (fileId) => {
    sendGAtagEvent({ event_name: 'viewer_sample_file_clicked', event_category: CAD_VIEWER_EVENT })

    router.push(`/tools/cad-renderer?fileId=${fileId}&sample=true&glb=true`);
  }

  if (variant === 'dark') {
    return (
      <div className={heroStyles.samplesDark}>
        <span className={heroStyles.samplesDarkLabel}>Don&apos;t have a file? Try a sample:</span>
        <div className={heroStyles.samplesDarkGrid}>
          {cadViewerFiles.map((file, index) => {
            const Icon = SAMPLE_ICONS[index] || Radio
            return (
              <button
                type="button"
                key={file.id}
                className={heroStyles.sampleChip}
                onClick={() => handleViewFile(file.id)}
              >
                <span className={heroStyles.sampleChipIcon} aria-hidden>
                  <Icon size={18} strokeWidth={2.2} />
                </span>
                {file.name}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={styles["cad-dropzone-samples"]}>
      <span>Don&apos;t have a file? Try one of these samples:</span>
      <div className={styles["cad-dropzone-sample-btns"]}>
        {cadViewerFiles.map((file) => (
          <button type="button" key={file.id} onClick={() => handleViewFile(file.id)}>{file.name}</button>
        ))}
      </div>
    </div>
  )
}

export default CommonSampleViewer
