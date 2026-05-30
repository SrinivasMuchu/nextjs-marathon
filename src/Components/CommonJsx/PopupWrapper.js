"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./CommonStyles.module.css";

function PopupWrapper({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className={styles.popUpMain}>{children}</div>,
    document.body,
  );
}

export default PopupWrapper;
