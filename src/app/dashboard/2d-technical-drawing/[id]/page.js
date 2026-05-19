"use client";

import React from "react";
import { useParams } from "next/navigation";
import CadDrawingPipelineStatus from "@/Components/CadDrawingPipeline/CadDrawingPipelineStatus";

export default function TechDrawJobStatusPage() {
  const params = useParams();
  const jobId = params?.id ? String(params.id) : "";

  if (!jobId) {
    return (
      <p style={{ padding: 24, fontFamily: "system-ui" }}>
        Missing job id. Start a new drawing from{" "}
        <a href="/tools/cad-drawing-pipeline">the pipeline upload page</a>.
      </p>
    );
  }

  return <CadDrawingPipelineStatus jobId={jobId} />;
}
