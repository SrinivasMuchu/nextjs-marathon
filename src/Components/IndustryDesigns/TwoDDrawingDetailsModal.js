"use client";

import { useCallback, useEffect, useId, useState } from "react";
import PopupWrapper from "@/Components/CommonJsx/PopupWrapper";
import { TwoDDrawingReportBody } from "./TwoDDrawingReportBody";
import styles from "./TwoDDrawingDetailsModal.module.css";

/**
 * HTML modal mirroring PDF cover (1st page) + review report (last pages).
 */
export default function TwoDDrawingDetailsModal({ details, open, onClose }) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !details) return null;

  return (
    <PopupWrapper>
      <div
        className={styles.backdropClick}
        role="presentation"
        onClick={onClose}
      >
        <div
          className={styles.panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(e) => e.stopPropagation()}
        >
          <header className={styles.header}>
            <div className={styles.letterhead}>
              <div className={styles.logoRow}>
                <span className={styles.logoMark} aria-hidden>
                  M
                </span>
                <span className={styles.logoWord}>Marathon</span>
                <span className={styles.site}>marathon-os.com</span>
              </div>
              <h2 id={titleId} className={styles.title}>
                Drawing details
              </h2>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close details"
            >
              ✕
            </button>
          </header>

          <div className={styles.body}>
            <TwoDDrawingReportBody details={details} />
          </div>
        </div>
      </div>
    </PopupWrapper>
  );
}

/** Sidebar / toolbar control that opens the details modal. */
export function TwoDDrawingDetailsButton({ details, className }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  if (!details?.sheetIndex?.length && !details?.coverTitle) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setOpen(true)}
      >
        View drawing details
      </button>
      <TwoDDrawingDetailsModal details={details} open={open} onClose={close} />
    </>
  );
}
