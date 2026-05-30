"use client";

import { useEffect } from "react";
import { trackTechDrawPageView } from "@/lib/techDraw/techDrawAnalytics";

/**
 * Fires 2d_technical_page_viewed once when a TechDraw-related page mounts.
 * @param {"upload"|"pipeline_status"|"job_design"|"library"|"library_list"} pageType
 */
export default function TechDrawPageViewTracker({
  pageType,
  jobId = "",
  designId = "",
}) {
  useEffect(() => {
    trackTechDrawPageView({ pageType, jobId, designId });
  }, [pageType, jobId, designId]);

  return null;
}
