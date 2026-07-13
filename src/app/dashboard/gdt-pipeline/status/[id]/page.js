"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import GdtPipelineStatus from "@/Components/GdtPipeline/GdtPipelineStatus";

export default function GdtJobStatusPage() {
  const params = useParams();
  const jobId = params?.id ? String(params.id) : "";

  if (!jobId) {
    return (
      <p style={{ padding: 24, fontFamily: "system-ui" }}>
        Missing job id. Start from{" "}
        <Link href="/tools/gdt-pipeline">the GD&amp;T upload page</Link>.
      </p>
    );
  }

  return <GdtPipelineStatus jobId={jobId} />;
}
