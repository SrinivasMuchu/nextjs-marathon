"use client";

import React, { useState } from "react";
import styles from "./Feedback.module.css";

const MAX_MARKS = 20;

/**
 * Flow 2b, optional: "Mark the problem" — click the sheet; we store the sheet number and x, y (0–1).
 * Clicking a mark removes it.
 */
export default function MarkProblem({ sheets, marks, onChange }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  if (!sheets?.length) return null;
  const sheet = sheets[Math.min(index, sheets.length - 1)];
  const onSheet = marks.filter((m) => m.sheet === sheet.sheet);

  const add = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height || marks.length >= MAX_MARKS) return;
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 1000;
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 1000;
    onChange([...marks, { sheet: sheet.sheet, x, y }]);
  };

  if (!open) {
    return (
      <button type="button" className={styles.linkBtn} onClick={() => setOpen(true)}>
        Mark the problem on the sheet <span className={styles.muted}>(optional)</span>
      </button>
    );
  }

  return (
    <div className={styles.group}>
      <span className={styles.label}>Mark the problem <span className={styles.muted}>— click the sheet; click a mark to remove it</span></span>
      {sheets.length > 1 ? (
        <div className={styles.chips}>
          {sheets.map((s, i) => (
            <button
              key={s.sheet}
              type="button"
              className={`${styles.chip} ${i === index ? styles.chipOn : ""}`}
              onClick={() => setIndex(i)}
            >
              Sheet {s.sheet}{marks.some((m) => m.sheet === s.sheet) ? " •" : ""}
            </button>
          ))}
        </div>
      ) : null}
      <div style={{ position: "relative", border: "1px solid #e3dded", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
        <img
          src={sheet.src}
          alt={sheet.label || `Sheet ${sheet.sheet}`}
          style={{ display: "block", width: "100%", height: "auto", cursor: "crosshair" }}
          onClick={add}
        />
        {onSheet.map((m) => (
          <button
            key={`${m.x}-${m.y}`}
            type="button"
            aria-label="Remove mark"
            onClick={() => onChange(marks.filter((k) => k !== m))}
            style={{
              position: "absolute",
              left: `${m.x * 100}%`,
              top: `${m.y * 100}%`,
              width: 22,
              height: 22,
              marginLeft: -11,
              marginTop: -11,
              borderRadius: 999,
              border: "2px solid #fff",
              background: "#e5484d",
              boxShadow: "0 0 0 2px rgba(229,72,77,0.35)",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}
