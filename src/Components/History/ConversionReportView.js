"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { getConverterReport } from "@/api/converterPaymentApi";
import { getFeedbackContext, recordFeedbackJobEvent } from "@/api/feedbackApi";
import { sendGAtagEvent } from "@/common.helper";
import AbandonFeedback from "../Feedback/AbandonFeedback";
import FeedbackDialog from "../Feedback/FeedbackDialog";
import feedbackStyles from "../Feedback/Feedback.module.css";
import { toCadOutputCdnUrl } from "@/config";
import Loading from "../CommonJsx/Loaders/Loading";
import styles from "./ConversionReportView.module.css";

const DASHBOARD_CONVERTER_PATH = "/dashboard?cad_type=CAD_CONVERTER";

/**
 * Shows the conversion quality report on its own page. The report HTML is loaded
 * through the API (opening its S3 link directly makes the browser download it)
 * and rendered in a sandboxed frame, so it cannot run scripts or reach the app.
 */
function ConversionReportView({ fileId }) {
  const [state, setState] = useState({ loading: true, error: "", report: null });
  // Flow 11a: a quiet "Not what you expected?" for finished, signed-in, never-downloaded, non-sample files.
  const [abandonCtx, setAbandonCtx] = useState(null);
  const [askOpen, setAskOpen] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (!fileId) {
      setState({ loading: false, error: "Missing conversion id.", report: null });
      return undefined;
    }
    if (typeof window !== "undefined" && !localStorage.getItem("uuid")) {
      setState({ loading: false, error: "Please sign in to view this report.", report: null });
      return undefined;
    }
    let cancelled = false;
    setState({ loading: true, error: "", report: null });
    getConverterReport(fileId)
      .then((report) => {
        if (cancelled) return;
        setState({ loading: false, error: "", report });
        recordFeedbackJobEvent({ jobId: fileId, event: "result_viewed" });
        sendGAtagEvent({ event_name: "converter_result_viewed", event_category: "FEEDBACK", event_label: "report" });
        getFeedbackContext(fileId, "converter")
          .then((ctx) => {
            if (cancelled || !ctx?.content) return;
            const j = ctx.job || {};
            if (j.state === "completed" && !j.downloaded && !j.sample_file) {
              setAbandonCtx(ctx);
              setAnswered(Boolean(ctx.feedback?.abandoned));
            }
          })
          .catch(() => {});
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            loading: false,
            error: err?.message || "Could not load the report.",
            report: null,
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [fileId]);

  const { loading, error, report } = state;
  const inputFmt = String(report?.input_format || "").toUpperCase();
  const outputFmt = String(report?.output_format || "").toUpperCase();
  const pdfUrl = report?.report_pdf_url
    ? toCadOutputCdnUrl(report.report_pdf_url) || report.report_pdf_url
    : "";

  return (
    <div className={styles.page}>
      <header className={styles.bar}>
        <Link href={DASHBOARD_CONVERTER_PATH} className={styles.back}>
          <ArrowLeft size={16} />
          My conversions
        </Link>
        <div className={styles.title}>
          <strong>{report?.file_name || "Conversion report"}</strong>
          {inputFmt && outputFmt ? <span>{inputFmt} → {outputFmt} quality report</span> : null}
        </div>
        <div className={styles.actions}>
          {pdfUrl ? (
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={styles.secondary}>
              <FileText size={16} />
              PDF report
            </a>
          ) : null}
          {abandonCtx && !answered ? (
            <button type="button" className={feedbackStyles.linkBtn} onClick={() => setAskOpen(true)}>
              Not what you expected?
            </button>
          ) : null}
          <Link href={DASHBOARD_CONVERTER_PATH} className={styles.primary}>
            Go to download
          </Link>
        </div>
      </header>

      {abandonCtx && !answered && !askOpen ? (
        <aside className={`${feedbackStyles.sideCard} ${styles.marginCard}`} aria-label="Not what you expected?">
          <p>Didn&apos;t get what you needed from this file?</p>
          <button type="button" className={feedbackStyles.linkBtn} onClick={() => setAskOpen(true)}>
            Tell us why
          </button>
        </aside>
      ) : null}
      {askOpen && abandonCtx ? (
        <FeedbackDialog label="Not what you expected?" onClose={() => setAskOpen(false)}>
          <AbandonFeedback
            context={abandonCtx}
            jobId={fileId}
            source="abandon_link"
            onDone={() => setAnswered(true)}
            onClose={() => setAskOpen(false)}
          />
        </FeedbackDialog>
      ) : null}

      {loading ? (
        <div className={styles.center}>
          <Loading smallScreen={true} />
        </div>
      ) : error ? (
        <div className={styles.center}>
          <p className={styles.error}>{error}</p>
          <Link href={DASHBOARD_CONVERTER_PATH} className={styles.primary}>
            Back to my conversions
          </Link>
        </div>
      ) : (
        <iframe
          className={styles.frame}
          title={`Quality report for ${report?.file_name || "conversion"}`}
          srcDoc={report?.html || ""}
          sandbox=""
        />
      )}
    </div>
  );
}

export default ConversionReportView;
