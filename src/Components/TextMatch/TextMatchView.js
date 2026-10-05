"use client";

import React, { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowRight, Search } from "lucide-react";
import UserLoginPupUp from "@/Components/CommonJsx/UserLoginPupUp";
import {
  getOrCreateTextMatchUuid,
  submitTextMatchJob,
  textMatchStatusPath,
} from "@/api/textMatchApi";
import styles from "./TextMatch.module.css";

function isUserVerified() {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem("is_verified"));
}

export default function TextMatchView() {
  const router = useRouter();
  const submitLockRef = useRef(false);
  const [partName, setPartName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  React.useEffect(() => {
    getOrCreateTextMatchUuid();
  }, []);

  const runMatch = useCallback(async () => {
    if (submitLockRef.current || submitting) return;
    const query = partName.trim();
    if (!query) {
      toast.error("Enter a part name first.");
      return;
    }
    if (!isUserVerified()) {
      setShowLogin(true);
      return;
    }

    submitLockRef.current = true;
    setSubmitting(true);
    setError("");
    try {
      const data = await submitTextMatchJob(query);
      const jobId = data?.job?.job_id || data?.job_id;
      if (!jobId) throw new Error("Match job was not created.");
      toast.success("Part-name match started.");
      router.push(textMatchStatusPath(jobId));
    } catch (err) {
      const msg = err?.message || "Could not start part-name match.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
      submitLockRef.current = false;
    }
  }, [partName, router, submitting]);

  return (
    <div className={styles.root}>
      <div className={styles.page}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>Part Name Match</span>
          <h1 className={styles.title}>Find designs by part name</h1>
          <p className={styles.subtitle}>
            Enter a part name from GLB metadata. We search indexed{" "}
            <code>parts[].name</code> labels across live library designs via the{" "}
            <code>sample_text_match</code> Kafka flow — not page titles.
          </p>
        </header>

        <div className={styles.card}>
          <div className={styles.searchRow}>
            <label className={styles.searchLabel} htmlFor="part-name-query">
              Part name
            </label>
            <input
              id="part-name-query"
              className={styles.searchInput}
              type="text"
              value={partName}
              placeholder='e.g. "Body Top", "Corner Join", "Rivet"'
              disabled={submitting}
              onChange={(e) => setPartName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runMatch();
              }}
              autoComplete="off"
            />
            <p className={styles.searchHint}>
              Matches only against indexed GLB metadata part names (
              <code>glb_part_names</code>), not design titles.
            </p>
          </div>

          {error ? <div className={styles.error}>{error}</div> : null}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btnPrimary}
              disabled={submitting || !partName.trim()}
              onClick={runMatch}
            >
              {submitting ? (
                "Searching…"
              ) : (
                <>
                  <Search size={16} />
                  Find matching designs
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showLogin ? (
        <UserLoginPupUp
          type="login"
          onClose={() => {
            setShowLogin(false);
            if (isUserVerified()) {
              toast.info("Signed in — click Find matching designs again.");
            }
          }}
        />
      ) : null}
    </div>
  );
}
