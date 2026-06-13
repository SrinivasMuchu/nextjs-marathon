"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ClearIcon from "@mui/icons-material/Clear";
import PopupWrapper from "@/Components/CommonJsx/PopupWrapper";
import {
  DIMENSION_EXTRACTION_FAILED_USER_MSG,
  DIMENSION_EXTRACTION_FREE_RETRY_MSG,
} from "@/api/techDrawErrors";
import { techDrawFreeRetryUploadPath } from "@/lib/techDraw/techDrawJobRoutes";
import styles from "./CadDrawingPipeline.module.css";

export default function TechDrawDimensionExtractionFailedModal({
  jobId,
  onClose,
}) {
  const router = useRouter();

  const handleFreeRetry = () => {
    onClose?.();
    router.push(techDrawFreeRetryUploadPath(jobId));
  };

  return (
    <PopupWrapper>
      <div
        className={styles.dimensionFailureModal}
        role="dialog"
        aria-labelledby="techdraw-dimension-failure-title"
        aria-modal="true"
      >
        <div className={styles.dimensionFailureModalHeader}>
          <h2 id="techdraw-dimension-failure-title" className={styles.dimensionFailureModalTitle}>
            Dimensions could not be generated
          </h2>
          <button
            type="button"
            className={styles.dimensionFailureModalClose}
            onClick={onClose}
            aria-label="Close"
          >
            <ClearIcon fontSize="small" />
          </button>
        </div>

        <p className={styles.dimensionFailureModalBody}>{DIMENSION_EXTRACTION_FAILED_USER_MSG}</p>
        <p className={styles.dimensionFailureModalSub}>{DIMENSION_EXTRACTION_FREE_RETRY_MSG}</p>

        <div className={styles.dimensionFailureModalActions}>
          <button type="button" className={styles.dimensionFailureModalSecondary} onClick={onClose}>
            Close
          </button>
          <button type="button" className={styles.dimensionFailureModalPrimary} onClick={handleFreeRetry}>
            Upload replacement file (free)
          </button>
        </div>
      </div>
    </PopupWrapper>
  );
}
