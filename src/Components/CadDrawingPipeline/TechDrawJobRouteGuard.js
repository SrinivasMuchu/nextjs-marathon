"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTechDrawJobStatus } from "@/api/cadDrawingPipelineApi";
import Loading from "@/Components/CommonJsx/Loaders/Loading";
import {
  isTechDrawJobComplete,
  techDrawDesignPath,
  techDrawPipelineStatusPath,
} from "@/lib/techDraw/techDrawJobRoutes";

/**
 * @param {"pipeline" | "design"} mode
 * pipeline — redirect to design when job is complete
 * design — redirect to pipeline status when job is not complete (incl. failed)
 */
export default function TechDrawJobRouteGuard({ jobId, mode, children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { job } = await getTechDrawJobStatus(jobId);
        if (cancelled) return;

        const complete = isTechDrawJobComplete(job);

        if (mode === "pipeline" && complete) {
          router.replace(techDrawDesignPath(jobId));
          return;
        }

        if (mode === "design" && !complete) {
          router.replace(techDrawPipelineStatusPath(jobId));
          return;
        }

        setReady(true);
      } catch {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [jobId, mode, router]);

  if (!ready) {
    return <Loading smallScreen={true} />;
  }

  return children;
}
