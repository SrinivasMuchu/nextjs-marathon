"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  getGdtJobStatus,
  gdtUploadPath,
  pollGdtJobUntilDone,
} from "@/api/gdtPipelineApi";
import styles from "./GdtPipeline.module.css";

function badgeClass(status) {
  if (status === "COMPLETED") return styles.badgeDone;
  if (status === "FAILED") return styles.badgeFailed;
  return styles.badgeProcessing;
}

export default function GdtPipelineStatus({ jobId }) {
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [logText, setLogText] = useState(`// Job ${jobId}\n// Connecting…`);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!jobId) return undefined;
    const ac = new AbortController();
    abortRef.current = ac;

    (async () => {
      try {
        const first = await getGdtJobStatus(jobId);
        setJob(first?.job || null);
        const done = await pollGdtJobUntilDone(jobId, {
          signal: ac.signal,
          onUpdate: (j) => {
            setJob(j);
            const lines = [
              `// Job ${jobId}`,
              `// status: ${j?.status || "…"}`,
              j?.pipeline_stage ? `// stage: ${j.pipeline_stage}` : null,
              j?.console_status ? `// ${j.console_status}` : null,
            ].filter(Boolean);
            const history = (j?.console_statuses || [])
              .slice(-12)
              .map((e) => `> ${e.message}`);
            setLogText([...lines, "", ...history].join("\n"));
          },
        });
        setJob(done);
        if (done?.status === "FAILED") {
          setError(done.error_message || "GD&T pipeline failed.");
        }
      } catch (err) {
        if (ac.signal.aborted) return;
        setError(err?.message || "Could not load job status.");
      }
    })();

    return () => ac.abort();
  }, [jobId]);

  const status = job?.status || "PROCESSING";

  return (
    <div className={styles.root}>
      <div className={styles.statusRoot}>
        <p className={styles.brand}>Marathon GD&amp;T</p>
        <h1 style={{ marginTop: 0 }}>{job?.title || "GD&T job"}</h1>
        <p className={styles.statusMeta}>
          <span className={`${styles.badge} ${badgeClass(status)}`}>{status}</span>
          {job?.file_name ? ` · ${job.file_name}` : null}
        </p>

        <div className={styles.statusBox}>{logText}</div>

        {error ? <p className={styles.error}>{error}</p> : null}

        {status === "COMPLETED" ? (
          <p className={styles.statusMeta}>
            Outputs uploaded
            {job?.output_s3_prefix ? (
              <>
                {" "}
                under prefix <code>{job.output_s3_prefix}</code>
              </>
            ) : null}
            . Drawing viewer can be wired next; analysis JSON is in the job output bucket.
          </p>
        ) : null}

        <div className={styles.linkRow}>
          <Link href={gdtUploadPath()}>← Start another GD&T job</Link>
        </div>
      </div>
    </div>
  );
}
