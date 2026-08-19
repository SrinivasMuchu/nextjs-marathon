"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { confirmTechDrawDatums } from "@/api/cadDrawingPipelineApi";
import styles from "./CadDrawingPipeline.module.css";

const LETTERS = ["A", "B", "C"];
const LETTER_HELP = {
  A: "Primary — seats or mounts the part",
  B: "Secondary — orients against A",
  C: "Tertiary — last remaining freedom",
};

function candidateLabel(c) {
  const kind = c?.kind === "axis" ? "Axis" : "Plane";
  const alt = c?.alternate ? " · alternate" : "";
  const ev = (c?.evidence || c?.reason || "").trim();
  return `${c?.label || `D${c?.id}`} · ${kind}${alt}${ev ? ` — ${ev}` : ""}`;
}

export default function TechDrawDatumPicker({ jobId, job, adminMode = false, onConfirmed }) {
  const candidates = Array.isArray(job?.gdt_datum_candidates) ? job.gdt_datum_candidates : [];
  const [picks, setPicks] = useState({ A: "", B: "", C: "" });
  const [submitting, setSubmitting] = useState(false);

  const usedIds = useMemo(
    () => new Set(LETTERS.map((L) => picks[L]).filter(Boolean)),
    [picks],
  );

  const setLetter = (letter, value) => {
    setPicks((prev) => ({ ...prev, [letter]: value }));
  };

  const datumsPayload = () => {
    const out = {};
    for (const L of LETTERS) {
      if (picks[L] !== "") out[L] = `D${picks[L]}`;
    }
    return out;
  };

  const submit = async (auto) => {
    if (adminMode) return;
    if (!auto && !picks.A && !picks.B && !picks.C) {
      toast.error("Pick at least datum A, or let the engine choose.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await confirmTechDrawDatums(jobId, {
        auto,
        datums: auto ? {} : datumsPayload(),
      });
      toast.success(auto ? "Engine will choose datums. Continuing…" : "Datums saved. Continuing…");
      onConfirmed?.(result?.job || result);
    } catch (err) {
      toast.error(err?.message || "Could not save datums.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!candidates.length) {
    return (
      <div className={`${styles.resultBanner} ${styles.resultBannerWarn}`} style={{ marginBottom: 16 }}>
        <span className={styles.resultIcon}>📐</span>
        <div>
          <div className={styles.resultText}>Waiting for datum candidates</div>
          <div className={styles.resultSub}>
            View capture finished. Candidate faces will appear here in a moment.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.datumPicker}>
      <div className={styles.datumPickerHeader}>
        <span className={styles.datumPickerIcon} aria-hidden>
          📐
        </span>
        <div>
          <div className={styles.datumPickerTitle}>Choose the datum reference frame</div>
          <p className={styles.datumPickerLead}>
            These are the faces and axes the engine found on your model. Assign A (primary),
            B (secondary), and C (tertiary) — or let the engine choose from function.
          </p>
        </div>
      </div>

      <div className={styles.datumPickerGrid}>
        {LETTERS.map((letter) => (
          <label key={letter} className={styles.datumPickerField}>
            <span className={styles.datumPickerLetter}>Datum {letter}</span>
            <span className={styles.datumPickerHint}>{LETTER_HELP[letter]}</span>
            <select
              className={styles.datumPickerSelect}
              value={picks[letter]}
              disabled={adminMode || submitting}
              onChange={(e) => setLetter(letter, e.target.value)}
            >
              <option value="">Not used</option>
              {candidates.map((c) => {
                const id = String(c.id);
                const taken = usedIds.has(id) && picks[letter] !== id;
                return (
                  <option key={id} value={id} disabled={taken}>
                    {candidateLabel(c)}
                  </option>
                );
              })}
            </select>
          </label>
        ))}
      </div>

      <ul className={styles.datumCandidateList}>
        {candidates.map((c) => (
          <li key={c.id}>
            <strong>{c.label || `D${c.id}`}</strong>
            <span className={styles.datumKindBadge}>{c.kind === "axis" ? "axis" : "plane"}</span>
            {c.alternate ? <span className={styles.datumAltBadge}>alt</span> : null}
            <span>{c.evidence || c.reason || ""}</span>
          </li>
        ))}
      </ul>

      {adminMode ? (
        <p className={styles.datumPickerLead}>
          Datum selection is waiting on the job owner. This admin view is read-only.
        </p>
      ) : (
        <div className={styles.datumPickerActions}>
          <button
            type="button"
            className={styles.pipelineHeroSubmitBtn}
            style={{ marginTop: 0 }}
            disabled={submitting}
            onClick={() => submit(false)}
          >
            {submitting ? "Saving…" : "Confirm datums & continue"}
          </button>
          <button
            type="button"
            className={styles.pipelineBackStep}
            disabled={submitting}
            onClick={() => submit(true)}
          >
            Let the engine choose
          </button>
        </div>
      )}
    </div>
  );
}
