"use client";

import React from "react";
import { NOTIFY_WHEN_DONE } from "@/lib/converterMeshSettings";
import styles from "./ConverterFunnel.module.css";

function ConverterNotifyBanner({ email }) {
  return (
    <p className={styles.notifyBanner} role="status">
      {email ? (
        <>
          Once done, you will be notified at <strong>{email}</strong>. Feel free to leave
          this tab — your file will wait in Dashboard → CAD Converter.
        </>
      ) : (
        NOTIFY_WHEN_DONE
      )}
    </p>
  );
}

export default ConverterNotifyBanner;
