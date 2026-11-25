import { sendClarityEvent, sendGAtagEvent } from "@/common.helper";

/** GA4 + Microsoft Clarity for the review / rating popups. */
export function trackFeedbackEvent(eventName, params = {}) {
  const clean = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === "") return;
    clean[key] = typeof value === "number" ? value : String(value).slice(0, 100);
  });
  sendGAtagEvent({
    event_name: eventName,
    event_category: "FEEDBACK",
    ...clean,
  });
  sendClarityEvent(eventName, { feedback_funnel: eventName, ...clean });
}
