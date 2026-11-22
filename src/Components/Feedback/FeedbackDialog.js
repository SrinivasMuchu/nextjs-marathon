"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import PopupWrapper from "@/Components/CommonJsx/PopupWrapper";
import styles from "./Feedback.module.css";

/** Modal shell shared by the failed-job and didn't-download questions. Escape and × close it. */
export default function FeedbackDialog({ label, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <PopupWrapper>
      {/* Portal events still bubble through React parents (rows, <Link> cards): stop them here. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div style={{ display: "contents" }} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal} role="dialog" aria-modal="true" aria-label={label}>
          <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
          {children}
        </div>
      </div>
    </PopupWrapper>
  );
}
