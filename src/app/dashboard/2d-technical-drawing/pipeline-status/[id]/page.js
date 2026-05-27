"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import CadDrawingPipelineStatus from "@/Components/CadDrawingPipeline/CadDrawingPipelineStatus";
import TechDrawJobRouteGuard from "@/Components/CadDrawingPipeline/TechDrawJobRouteGuard";

export default function TechDrawJobStatusPage() {
  const params = useParams();
  const jobId = params?.id ? String(params.id) : "";

  if (!jobId) {
    return (
      <p style={{ padding: 24, fontFamily: "system-ui" }}>
        Missing job id. Start a new drawing from{" "}
        <Link href="/tools/cad-drawing-pipeline">the pipeline upload page</Link>.
      </p>
    );
  }

  return (
    <TechDrawJobRouteGuard jobId={jobId} mode="pipeline">
      <CadDrawingPipelineStatus jobId={jobId} />
    </TechDrawJobRouteGuard>
  );
}
