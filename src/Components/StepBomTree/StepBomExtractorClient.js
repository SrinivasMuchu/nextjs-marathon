"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { getStepBomFileIdFromSearchParams } from "@/lib/stepBomRoutes";
import StepBomJobPage from "@/Components/StepBomTree/StepBomJobPage";
import StepBomTreePage from "@/Components/StepBomTree/StepBomTreePage";

export default function StepBomExtractorClient() {
  const searchParams = useSearchParams();
  const fileId = getStepBomFileIdFromSearchParams(searchParams);
  if (fileId) return <StepBomJobPage jobId={fileId} />;
  return <StepBomTreePage />;
}
