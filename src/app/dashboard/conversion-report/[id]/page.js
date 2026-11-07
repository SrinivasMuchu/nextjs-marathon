"use client";

import React from "react";
import { useParams } from "next/navigation";
import ConversionReportView from "@/Components/History/ConversionReportView";

/** Full quality report for one conversion (opened from "View Details"). */
export default function ConversionReportPage() {
  const params = useParams();
  const fileId = params?.id ? String(params.id) : "";
  return <ConversionReportView fileId={fileId} />;
}
