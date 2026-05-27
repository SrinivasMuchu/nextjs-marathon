"use client";

import { useEffect } from "react";
import { sendGAtagEvent } from "@/common.helper";
import { CAD_2D_DRAWING_EVENT } from "@/config";

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 80);
}

export default function TwoDDrawingAnalyticsTracker({ designId }) {
  useEffect(() => {
    sendGAtagEvent({
      event_name: "techdraw_page_view",
      event_category: CAD_2D_DRAWING_EVENT,
      design_id: designId || "",
      page_path: window.location.pathname,
    });

    const onClick = (event) => {
      const root = document.querySelector("[data-techdraw-analytics-root='true']");
      if (!root) return;

      const clickable = event.target?.closest?.("button, a");
      if (!clickable || !root.contains(clickable)) return;

      const label = normalizeText(
        clickable.getAttribute("aria-label") ||
          clickable.getAttribute("title") ||
          clickable.textContent
      );

      sendGAtagEvent({
        event_name: "techdraw_page_click",
        event_category: CAD_2D_DRAWING_EVENT,
        design_id: designId || "",
        click_target: label || "unknown",
        element_type: clickable.tagName.toLowerCase(),
      });
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
    };
  }, [designId]);

  return null;
}
