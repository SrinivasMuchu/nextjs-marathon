"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMyTestimonials, withdrawTestimonial } from "@/api/feedbackApi";
import styles from "./Feedback.module.css";

const STATUS = {
  awaiting_confirmation: "Waiting until you've used the file",
  pending: "Waiting for a person to check it",
  published: "Shown on our site",
};

/**
 * Profile (flow 6d): the user's quotes with "Stop sharing". A withdrawn quote leaves our pages
 * within the hour (the promise is 24 h). Renders nothing when the user has no quotes.
 */
export default function MyQuotes() {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState("");

  useEffect(() => {
    let alive = true;
    getMyTestimonials().then((list) => { if (alive) setRows(list || []); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  if (!rows.length) return null;

  async function stop(id) {
    if (!window.confirm("Stop sharing this review? We take it down within 24 hours.")) return;
    setBusy(id);
    try {
      await withdrawTestimonial(id);
      setRows((prev) => prev.filter((r) => r._id !== id));
      toast.success("Your review is no longer shared.");
    } catch (err) {
      toast.error(err?.message || "Couldn't update that. Please try again.");
    } finally {
      setBusy("");
    }
  }

  return (
    <section style={{ marginTop: 24 }} aria-label="Your reviews">
      <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>Your reviews</h3>
      <p className={styles.muted} style={{ margin: "0 0 12px" }}>Reviews you let us quote on our site.</p>
      <div className={styles.quotesList}>
        {rows.map((r) => (
          <div key={r._id} className={styles.quoteRow}>
            <div style={{ flex: "1 1 260px", minWidth: 0 }}>
              <p>&ldquo;{r.text}&rdquo;</p>
              <p className={styles.muted}>
                {[r.display_name, r.role, r.company].filter(Boolean).join(" · ")} · {STATUS[r.status] || r.status}
              </p>
            </div>
            <button type="button" className={styles.secondaryBtn} onClick={() => stop(r._id)} disabled={busy === r._id}>
              {busy === r._id ? "Stopping…" : "Stop sharing"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
