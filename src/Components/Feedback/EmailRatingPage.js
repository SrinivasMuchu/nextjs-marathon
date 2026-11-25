"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getEmailRatingContext, submitEmailRating } from "@/api/feedbackApi";
import ConversionFeedbackForm from "./ConversionFeedbackForm";
import AbandonFeedback from "./AbandonFeedback";
import { CardHeader } from "./FeedbackHost";
import styles from "./Feedback.module.css";

const PAGE = {
  minHeight: "70vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "48px 16px",
  background: "linear-gradient(180deg, #f7f5ff 0%, #ffffff 60%)",
};

/**
 * Flow 4c: the page an email star link opens. The star from the link is pre-selected, but NOTHING is saved
 * on page load — mail scanners open links and run JavaScript. The rating saves only on "Save rating".
 * No login: the signed token in the link (one job, 14 days) is the only key.
 */
export default function EmailRatingPage() {
  const params = useSearchParams();
  const [token, setToken] = useState("");
  const [star, setStar] = useState(0);
  const [source, setSource] = useState("email_link");
  const [ready, setReady] = useState(false);
  const [state, setState] = useState({ loading: true, error: "", context: null });
  const fetched = useRef(false);

  // The token is taken out of the URL before analytics run. Read it after mount so the
  // server render and the first client render both show the loading state.
  useEffect(() => {
    let stored = "";
    let storedStar = "";
    let storedSource = "";
    try {
      stored = sessionStorage.getItem("feedback_rate_t") || "";
      storedStar = sessionStorage.getItem("feedback_rate_r") || "";
      storedSource = sessionStorage.getItem("feedback_rate_s") || "";
    } catch {
      stored = "";
    }
    const t = stored || params.get("t") || "";
    const r = storedStar || params.get("r") || "";
    const s = storedSource || params.get("s") || "";
    setToken(t);
    setStar(Number(r) || 0);
    setSource(s === "deletion_email" ? "deletion_email" : "email_link");
    setReady(true);
  }, [params]);

  useEffect(() => {
    if (!ready || fetched.current) return;
    fetched.current = true; // one hit per page view (StrictMode would otherwise count two)
    if (!token) {
      setState({ loading: false, error: "This link is incomplete.", context: null });
      return;
    }
    getEmailRatingContext(token, star >= 1 && star <= 5 ? star : undefined)
      .then((context) => setState({ loading: false, error: "", context }))
      .catch((err) => setState({ loading: false, error: err?.message || "This link has expired.", context: null }));
  }, [ready, token, star]);

  const { loading, error, context } = state;
  const submitFn = (payload) => submitEmailRating({ ...payload, t: token, source });

  let body;
  if (loading) {
    body = <p className={styles.muted}>Loading…</p>;
  } else if (error || !context) {
    body = (
      <div className={styles.form}>
        <p className={styles.title}>We couldn&apos;t open this rating</p>
        <p className={styles.muted}>{error || "This link has expired."}</p>
        <Link className={styles.linkBtn} href="/dashboard">Rate it from your dashboard</Link>
      </div>
    );
  } else if (context.kind === "abandon") {
    body = (
      <AbandonFeedback
        context={context}
        submitFn={submitFn}
        source="email_link"
        title={`Was something wrong with ${context.job?.file_name || "your file"}?`}
      />
    );
  } else if (!context.rateable) {
    body = (
      <div className={styles.form}>
        <p className={styles.title}>This file can&apos;t be rated</p>
        <p className={styles.muted}>It may still be converting, or it was a sample file.</p>
      </div>
    );
  } else {
    body = (
      <ConversionFeedbackForm
        context={context}
        source={source}
        channel="email"
        dashboardHint={false}
        initialRating={star >= 1 && star <= 5 ? star : 0}
        submitFn={submitFn}
        header={<CardHeader context={context} />}
      />
    );
  }

  return (
    <main style={PAGE}>
      <div className={styles.modal} style={{ boxShadow: "0 18px 48px rgba(32, 16, 64, 0.10)", border: "1px solid #ebe7f2" }}>
        {body}
      </div>
    </main>
  );
}
