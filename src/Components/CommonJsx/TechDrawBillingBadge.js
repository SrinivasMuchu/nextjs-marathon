import React from "react";
import { getTechDrawPriceDisplay } from "@/api/cadDrawingPipelineApi";

/** Free vs paid TechDraw job (dashboard cards). Paid jobs show list price (e.g. $4.99). */
export default function TechDrawBillingBadge({ billingType }) {
  const isPaid = String(billingType || "").toLowerCase() === "paid";
  const paidLabel = getTechDrawPriceDisplay().baseLabel;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: isPaid ? "rgba(97, 11, 238, 0.92)" : "rgba(255, 255, 255, 0.95)",
        color: isPaid ? "#fff" : "#374151",
        border: isPaid ? "none" : "1px solid #e5e7eb",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      {isPaid ? paidLabel : "Free"}
    </div>
  );
}
