"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { confirmTechDrawDatums } from "@/api/cadDrawingPipelineApi";
import styles from "./CadDrawingPipeline.module.css";

const TechDrawDatumViewer = dynamic(() => import("./TechDrawDatumViewer"), {
  ssr: false,
  loading: () => (
    <div className={styles.datumViewerEmpty}>
      <p>Loading 3D viewer…</p>
    </div>
  ),
});

const LETTERS = ["A", "B", "C"];
const LETTER_HELP = {
  A: "Primary — seats or mounts the part",
  B: "Secondary — orients against A",
  C: "Tertiary — last remaining freedom",
};
const MODE_SUGGESTED = "suggested";
const MODE_PICK = "pick";

function resolveDatumEntry(id, candidates, pickable) {
  if (id == null || id === "") return null;
  const sid = String(id);
  return (
    candidates.find((c) => String(c.id) === sid) || pickable.find((c) => String(c.id) === sid) || null
  );
}

function displayLabel(id, candidates, pickable) {
  const entry = resolveDatumEntry(id, candidates, pickable);
  return entry?.label || `D${id}`;
}

function candidateLabel(c) {
  const kind = c?.kind === "axis" ? "Axis" : "Plane";
  const alt = c?.alternate ? " · alternate" : "";
  const ev = (c?.evidence || c?.reason || "").trim();
  return `${c?.label || `D${c?.id}`} · ${kind}${alt}${ev ? ` — ${ev}` : ""}`;
}

function pickableLabel(c) {
  const kind = c?.kind === "axis" ? "Axis" : "Plane";
  const ev = (c?.evidence || c?.reason || "").trim();
  return `${c?.label || `D${c?.id}`} · ${kind}${ev ? ` — ${ev}` : ""}`;
}

export default function TechDrawDatumPicker({ jobId, job, adminMode = false, onConfirmed }) {
  const candidates = Array.isArray(job?.gdt_datum_candidates) ? job.gdt_datum_candidates : [];
  const pickable = Array.isArray(job?.gdt_datum_pickable) ? job.gdt_datum_pickable : [];
  const hasPickable = pickable.length > 0;
  const [mode, setMode] = useState(hasPickable ? MODE_SUGGESTED : MODE_SUGGESTED);
  const pickMode = mode === MODE_PICK && hasPickable;
  const [picks, setPicks] = useState({ A: "", B: "", C: "" });
  const [activeLetter, setActiveLetter] = useState("A");
  const [submitting, setSubmitting] = useState(false);
  const [focusCandidateId, setFocusCandidateId] = useState(null);
  const candidateItemRefs = useRef({});

  const dropdownOptions = useMemo(() => {
    if (pickMode) return pickable;
    return candidates;
  }, [pickMode, pickable, candidates]);

  const usedIds = useMemo(
    () => new Set(LETTERS.map((L) => picks[L]).filter(Boolean)),
    [picks],
  );

  useEffect(() => {
    if (focusCandidateId == null) return;
    const el = candidateItemRefs.current[String(focusCandidateId)];
    el?.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
  }, [focusCandidateId]);

  const setLetter = (letter, value) => {
    setPicks((prev) => {
      const next = { ...prev, [letter]: value };
      return next;
    });
    if (value) setFocusCandidateId(String(value));
  };

  const assignCandidate = (candidateId) => {
    if (adminMode || submitting) return;
    const id = String(candidateId);
    setFocusCandidateId(id);
    setPicks((prev) => {
      const next = { ...prev };
      for (const L of LETTERS) {
        if (String(next[L]) === id) next[L] = "";
      }
      next[activeLetter] = id;
      return next;
    });
    const idx = LETTERS.indexOf(activeLetter);
    if (idx >= 0 && idx < LETTERS.length - 1) {
      setActiveLetter(LETTERS[idx + 1]);
    }
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

  if (!candidates.length && !pickable.length) {
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
        <div className={styles.datumPickerHeaderBody}>
          <div className={styles.datumPickerTitleRow}>
            <div className={styles.datumPickerTitle}>Choose the datum reference frame</div>
            {hasPickable ? (
              <div className={styles.datumModeToggle} role="tablist" aria-label="Datum selection mode">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === MODE_SUGGESTED}
                  className={`${styles.datumModeBtn}${mode === MODE_SUGGESTED ? ` ${styles.datumModeBtnOn}` : ""}`}
                  disabled={adminMode || submitting}
                  onClick={() => setMode(MODE_SUGGESTED)}
                >
                  Suggested datums
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === MODE_PICK}
                  className={`${styles.datumModeBtn}${mode === MODE_PICK ? ` ${styles.datumModeBtnOn}` : ""}`}
                  disabled={adminMode || submitting}
                  onClick={() => setMode(MODE_PICK)}
                >
                  Pick on model
                </button>
              </div>
            ) : null}
          </div>
          <p className={styles.datumPickerLead}>
            {pickMode
              ? "Click any planar face or cylindrical surface on the model to assign A, B, and C — or use the dropdowns."
              : "Use engine-suggested datums from the list, click highlighted overlays on the model, or let the engine choose."}
          </p>
        </div>
      </div>

      <div className={styles.datumPickerLayout}>
        <TechDrawDatumViewer
          job={job}
          jobId={jobId}
          candidates={candidates}
          pickableCandidates={pickable}
          pickMode={pickMode}
          picks={picks}
          activeLetter={activeLetter}
          onPickCandidate={assignCandidate}
          disabled={adminMode || submitting}
        />

        <div className={styles.datumPickerSide}>
          <div className={styles.datumActiveRow}>
            <span className={styles.datumActiveLabel}>Assigning</span>
            <div className={styles.datumActiveLetters}>
              {LETTERS.map((letter) => {
                const selected = activeLetter === letter;
                const filled = Boolean(picks[letter]);
                return (
                  <button
                    key={letter}
                    type="button"
                    className={`${styles.datumActiveBtn}${selected ? ` ${styles.datumActiveBtnOn}` : ""}${
                      filled ? ` ${styles.datumActiveBtnFilled}` : ""
                    }`}
                    disabled={adminMode || submitting}
                    onClick={() => setActiveLetter(letter)}
                    aria-pressed={selected}
                  >
                    {letter}
                    {filled ? ` · ${displayLabel(picks[letter], candidates, pickable)}` : ""}
                  </button>
                );
              })}
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
                  onChange={(e) => {
                    setLetter(letter, e.target.value);
                    setActiveLetter(letter);
                  }}
                  onFocus={() => setActiveLetter(letter)}
                >
                  <option value="">Not used</option>
                  {dropdownOptions.map((c) => {
                    const id = String(c.id);
                    const taken = usedIds.has(id) && picks[letter] !== id;
                    return (
                      <option key={id} value={id} disabled={taken}>
                        {pickMode ? pickableLabel(c) : candidateLabel(c)}
                      </option>
                    );
                  })}
                </select>
              </label>
            ))}
          </div>

          {pickMode ? (
            <div className={styles.datumPickSummary}>
              <div className={styles.datumPickSummaryTitle}>Your frame</div>
              {LETTERS.every((L) => !picks[L]) ? (
                <p className={styles.datumPickSummaryEmpty}>
                  Click the model to assign datum {activeLetter}. Every retained face and cylinder is available (
                  {pickable.length} surfaces).
                </p>
              ) : (
                <ul className={styles.datumPickSummaryList}>
                  {LETTERS.map((letter) => {
                    if (!picks[letter]) return null;
                    const entry = resolveDatumEntry(picks[letter], candidates, pickable);
                    return (
                      <li key={letter}>
                        <button
                          type="button"
                          className={styles.datumPickSummaryItem}
                          disabled={adminMode || submitting}
                          onClick={() => setActiveLetter(letter)}
                        >
                          <span className={styles.datumAssignedBadge}>{letter}</span>
                          <strong>{displayLabel(picks[letter], candidates, pickable)}</strong>
                          <span className={styles.datumKindBadge}>{entry?.kind === "axis" ? "axis" : "plane"}</span>
                          <span>{entry?.evidence || entry?.reason || ""}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
              {candidates.length ? (
                <button
                  type="button"
                  className={styles.datumSwitchModeLink}
                  disabled={adminMode || submitting}
                  onClick={() => setMode(MODE_SUGGESTED)}
                >
                  Switch to suggested datums
                </button>
              ) : null}
            </div>
          ) : (
            <ul className={styles.datumCandidateList}>
              {candidates.map((c) => {
                const id = String(c.id);
                const assigned = LETTERS.find((L) => picks[L] === id);
                const focused = String(focusCandidateId) === id;
                return (
                  <li
                    key={c.id}
                    ref={(node) => {
                      if (node) candidateItemRefs.current[id] = node;
                      else delete candidateItemRefs.current[id];
                    }}
                  >
                    <button
                      type="button"
                      className={`${styles.datumCandidateBtn}${assigned ? ` ${styles.datumCandidateBtnOn}` : ""}${
                        focused ? ` ${styles.datumCandidateBtnFocus}` : ""
                      }`}
                      disabled={adminMode || submitting}
                      onClick={() => assignCandidate(c.id)}
                    >
                      <strong>{c.label || `D${c.id}`}</strong>
                      <span className={styles.datumKindBadge}>{c.kind === "axis" ? "axis" : "plane"}</span>
                      {c.alternate ? <span className={styles.datumAltBadge}>alt</span> : null}
                      {assigned ? <span className={styles.datumAssignedBadge}>{assigned}</span> : null}
                      <span>{c.evidence || c.reason || ""}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

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
