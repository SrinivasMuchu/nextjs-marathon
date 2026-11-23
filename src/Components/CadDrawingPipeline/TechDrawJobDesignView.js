"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getTechDrawJobStatus } from "@/api/cadDrawingPipelineApi";
import Loading from "@/Components/CommonJsx/Loaders/Loading";
import { techDrawDesignPath, techDrawPipelineStatusPath } from "@/lib/techDraw/techDrawJobRoutes";
import TechDrawJobLibraryResults from "./TechDrawJobLibraryResults";
import { recordFeedbackJobEvent } from "@/api/feedbackApi";

export default function TechDrawJobDesignView({
  jobId,
  fetchJobStatus = getTechDrawJobStatus,
  adminMode = false,
  getPipelineStatusPath = techDrawPipelineStatusPath,
  getDesignPath = techDrawDesignPath,
}) {
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { job: data } = await fetchJobStatus(jobId);
        if (cancelled) return;
        setJob(data);
        // Flow 11: opening a finished drawing counts as "viewed".
        if (!adminMode && String(data?.status || "").toUpperCase() === "COMPLETED") {
          recordFeedbackJobEvent({ jobId, jobType: "drawing", event: "result_viewed" });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Could not load drawing.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [adminMode, fetchJobStatus, jobId]);

  if (error) {
    return (
      <p style={{ padding: 24, fontFamily: "system-ui" }}>
        {error}{" "}
        <Link href={getPipelineStatusPath(jobId)} style={{ color: "#610bee" }}>
          View pipeline status
        </Link>
      </p>
    );
  }

  if (!job) {
    return <Loading smallScreen={true} />;
  }

  return (
    <TechDrawJobLibraryResults
      jobId={jobId}
      job={job}
      adminMode={adminMode}
      getPipelineStatusPath={getPipelineStatusPath}
      getDesignPath={getDesignPath}
    />
  );
}
