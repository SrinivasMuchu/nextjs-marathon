"use client";

import React from "react";
import { useParams } from "next/navigation";
import Footer from "@/Components/HomePages/Footer/Footer";
import CadMatchStatus from "@/Components/CadMatch/CadMatchStatus";
import styles from "@/Components/CadMatch/CadMatch.module.css";

export default function CadMatchJobPage() {
  const params = useParams();
  const jobId = String(params?.id || "").trim();

  return (
    <div className={styles.root}>
      {jobId ? (
        <CadMatchStatus jobId={jobId} />
      ) : (
        <div className={styles.page}>
          <p className={styles.error}>Missing match job id.</p>
        </div>
      )}
      <Footer />
    </div>
  );
}
