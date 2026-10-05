"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { toast } from "react-toastify";
import Footer from "@/Components/HomePages/Footer/Footer";
import CadFileNotifyPopUp from "@/Components/CommonJsx/CadFileNotifyPopUp";
import { pollStepBomJob } from "@/api/stepBomApi";
import { StepBomOutputSection } from "./StepBomTreePage";
import cube from "@/Components/CommonJsx/Loaders/Cube.json";
import styles from "./StepBomJobPage.module.css";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

function statusCopy(status) {
  if (status === "LOADING") return "Loading job";
  if (status === "PENDING") return "In queue";
  if (status === "PROCESSING") return "Extracting BOM";
  if (status === "COMPLETED") return "Completed";
  if (status === "FAILED") return "Failed";
  return status || "Waiting";
}

export default function StepBomJobPage({ jobId }) {
  const [job, setJob] = useState({ job_id: jobId, status: "LOADING" });
  const [error, setError] = useState("");
  const [showNotifyPopUp, setShowNotifyPopUp] = useState(false);

  useEffect(() => {
    if (!jobId) return undefined;
    const controller = new AbortController();
    let cancelled = false;
    setError("");
    setJob({ job_id: jobId, status: "LOADING", file_name: "" });

    (async () => {
      try {
        const finished = await pollStepBomJob(jobId, {
          signal: controller.signal,
          onUpdate: (next) => {
            if (!cancelled) setJob(next);
          },
        });
        if (!cancelled && finished?.status === "FAILED") {
          setError(finished.error_message || "BOM extraction failed.");
        }
      } catch (err) {
        if (controller.signal.aborted || cancelled) return;
        const message = err?.message || "Could not load STEP BOM job.";
        setError(message);
        toast.error(message);
        setJob((prev) => ({ ...prev, status: "FAILED", error_message: message }));
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [jobId]);

  const status = String(job?.status || "LOADING").toUpperCase();
  const running = status === "LOADING" || status === "PENDING" || status === "PROCESSING";
  const fileName = job?.file_name || "your STEP file";

  useEffect(() => {
    if (status !== "PENDING" && status !== "PROCESSING") {
      setShowNotifyPopUp(false);
      return undefined;
    }
    const timer = setTimeout(() => {
      if (!localStorage.getItem("is_verified")) {
        setShowNotifyPopUp(true);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [status, jobId]);

  return (
    <div className={styles.page}>
      {showNotifyPopUp ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        >
          <CadFileNotifyPopUp setIsApiSlow={setShowNotifyPopUp} cad_type="CAD_STEP_BOM" />
        </div>
      ) : null}
      {running || status === "FAILED" ? (
        <div className={styles.inner}>
          <Link href="/tools/step-bom-extractor" className={styles.back}>
            ← Upload another STEP file
          </Link>
          <section className={styles.loaderCard} aria-live="polite">
            <div className={styles.cube} aria-hidden>
              <Lottie animationData={cube} loop={running} style={{ width: 180, height: 180 }} />
            </div>
            <h1 className={styles.title}>
              {status === "FAILED"
                ? "BOM extraction failed"
                : status === "LOADING"
                  ? "Opening STEP BOM"
                  : `Extracting ${fileName}`}
            </h1>
            <p className={styles.subtitle}>
              {status === "FAILED"
                ? error || job?.error_message || "Please try another file."
                : status === "LOADING"
                  ? "Loading the saved assembly tree and report."
                  : "The worker is building the assembly tree, quantities, and accuracy report."}
            </p>
            <p className={`${styles.status} ${status === "FAILED" ? styles.failed : ""}`}>
              {statusCopy(status)}
            </p>
            {status === "FAILED" ? (
              <div className={styles.actions}>
                <Link href="/tools/step-bom-extractor" className={styles.retryBtn}>
                  Try another file
                </Link>
              </div>
            ) : null}
          </section>
        </div>
      ) : (
        <StepBomOutputSection job={job} error={error} />
      )}
      <Footer />
    </div>
  );
}
