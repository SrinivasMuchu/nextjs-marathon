"use client";

import React from "react";
import { useParams } from "next/navigation";
import TextMatchStatus from "@/Components/TextMatch/TextMatchStatus";
import styles from "@/Components/TextMatch/TextMatch.module.css";

export default function PartNameMatchJobPage() {
  const params = useParams();
  const jobId = params?.id ? String(params.id) : "";

  if (!jobId) {
    return (
      <div className={styles.root}>
        <div className={styles.page}>
          <p className={styles.error}>Missing match job id.</p>
        </div>
      </div>
    );
  }

  return <TextMatchStatus jobId={jobId} />;
}
