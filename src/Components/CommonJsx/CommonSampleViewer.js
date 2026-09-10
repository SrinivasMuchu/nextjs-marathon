"use client"
import React, { useContext } from 'react'
import { useRouter } from "next/navigation";
import { cadViewerFiles, convertedFiles, sendGAtagEvent } from '@/common.helper';
import styles from '../CadUploadingHome/CadHomeDesign/CadHome.module.css'
import heroStyles from '../CadUploadingHome/CadHomeDesign/CadViewerHero.module.css'
import { CAD_VIEWER_EVENT } from '@/config';
import { Car, Truck, Wrench, Radio } from 'lucide-react'
import { contextState } from '@/Components/CommonJsx/ContextProvider'
import { toast } from 'react-toastify'

const SAMPLE_ICONS = [Car, Truck, Wrench, Radio]

function CommonSampleViewer({ variant, prompt, sampleLabel, sampleFormat, sampleGallery }) {
  const router = useRouter();
  const { setFile } = useContext(contextState);
  const formatSample = sampleFormat
    ? convertedFiles.find((file) => file.format === String(sampleFormat).toLowerCase())
    : null;
  const gallerySamples = sampleGallery ? convertedFiles.filter((file) => file.url) : [];

  const handleViewFile = (designId) => {
    sendGAtagEvent({ event_name: 'viewer_sample_file_clicked', event_category: CAD_VIEWER_EVENT })

    router.push(`/tools/cad-renderer?designId=${designId}&sample=true&glb=true`);
  }

  const handleConvertedSample = async (sample) => {
    if (!sample?.url) return;
    sendGAtagEvent({ event_name: 'viewer_sample_file_clicked', event_category: CAD_VIEWER_EVENT })
    try {
      const response = await fetch(sample.url);
      if (!response.ok) throw new Error('sample fetch failed');
      const blob = await response.blob();
      const file = new File([blob], sample.name, {
        type: blob.type || 'application/octet-stream',
      });
      setFile(file);
      router.push('/tools/cad-uploading');
    } catch {
      toast.error('Unable to open the sample file.');
    }
  }

  const samplePrompt = prompt || (variant === 'dark'
    ? "Don't have a file? Try a sample:"
    : "Don't have a file? Try one of these samples:");

  if (sampleFormat && !formatSample) return null;

  const galleryButtons = gallerySamples.map((file) => (
    <button
      type="button"
      key={file.id}
      className={variant === 'dark' ? heroStyles.sampleChip : undefined}
      onClick={() => handleConvertedSample(file)}
    >
      {String(file.format || '').toUpperCase()}
    </button>
  ))

  const singleFormatButton = formatSample ? (
    <button
      type="button"
      className={variant === 'dark' ? heroStyles.sampleChip : undefined}
      onClick={() => handleConvertedSample(formatSample)}
    >
      {sampleLabel || formatSample.name}
    </button>
  ) : null

  if (variant === 'dark') {
    return (
      <div className={heroStyles.samplesDark}>
        <span className={heroStyles.samplesDarkLabel}>{samplePrompt}</span>
        <div className={heroStyles.samplesDarkGrid}>
          {gallerySamples.length ? galleryButtons : singleFormatButton || (
            cadViewerFiles.map((file, index) => {
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
            })
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={styles["cad-dropzone-samples"]}>
      <span>{samplePrompt}</span>
      <div className={styles["cad-dropzone-sample-btns"]}>
        {gallerySamples.length ? galleryButtons : singleFormatButton || (
          cadViewerFiles.map((file) => (
            <button type="button" key={file.id} onClick={() => handleViewFile(file.id)}>{file.name}</button>
          ))
        )}
      </div>
    </div>
  )
}

export default CommonSampleViewer
