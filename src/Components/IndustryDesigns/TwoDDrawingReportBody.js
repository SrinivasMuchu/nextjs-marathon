"use client";

import styles from "./TwoDDrawingDetailsModal.module.css";

function StatCards({ items }) {
  if (!items?.length) return null;
  return (
    <div className={styles.statGrid}>
      {items.map((item) => (
        <div
          key={item.label}
          className={`${styles.statCard} ${item.warn ? styles.statCardWarn : ""} ${item.accent ? styles.statCardAccent : ""}`}
        >
          <div className={styles.statValue}>{item.value}</div>
          <div className={styles.statLabel}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function Section({ title, children, eyebrow }) {
  if (!children) return null;
  return (
    <section className={styles.section}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h3 className={styles.sectionTitle}>{title}</h3>
      {children}
    </section>
  );
}

function SimpleTable({ columns, rows, empty }) {
  if (!rows?.length) {
    return empty ? <p className={styles.muted}>{empty}</p> : null;
  }
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c.key}>{row[c.key] ?? "—"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Cover + review report body (modal and inline page section). */
export function TwoDDrawingReportBody({ details }) {
  if (!details) return null;

  const coverStats = [
    { value: details.coverStats?.sheets ?? 0, label: "sheets", accent: true },
    {
      value: details.coverStats?.controlFrames ?? 0,
      label: "control frames",
    },
    {
      value: details.coverStats?.dimensionsNotDrawn ?? 0,
      label: "dimensions not drawn",
      warn: (details.coverStats?.dimensionsNotDrawn ?? 0) > 0,
    },
  ];

  const reviewStats = [
    {
      value: details.reviewSummary?.dimensionsDrawn ?? 0,
      label: "dimensions drawn",
      accent: true,
    },
    {
      value: details.reviewSummary?.selectedNotDrawn ?? 0,
      label: "selected, not drawn",
      warn: (details.reviewSummary?.selectedNotDrawn ?? 0) > 0,
    },
    {
      value: details.reviewSummary?.controlFrames ?? 0,
      label: "control frames",
    },
    {
      value: details.reviewSummary?.assumedTolerances ?? 0,
      label: "assumed tolerances",
      warn: (details.reviewSummary?.assumedTolerances ?? 0) > 0,
    },
  ];

  const dimCount = details.dimensionSchedule?.length ?? 0;

  return (
    <div className={styles.reportBody}>
      <Section title="TECHNICAL DRAWING">
        <h4 className={styles.partTitle}>
          {details.coverTitle || details.designId || details.productTitle}
        </h4>
        {details.productTitle &&
        details.coverTitle &&
        details.productTitle !== details.coverTitle ? (
          <p className={styles.productAlias}>{details.productTitle}</p>
        ) : null}
        <StatCards items={coverStats} />
        <h5 className={styles.subhead}>Sheet index</h5>
        <SimpleTable
          columns={[
            { key: "sheet", label: "Sheet" },
            { key: "view", label: "View" },
            { key: "scale", label: "Scale" },
            { key: "content", label: "Content" },
          ]}
          rows={details.sheetIndex}
          empty="No sheet index available for this drawing."
        />
        <p className={styles.footnote}>
          Generated automatically and intended for review before use. A companion
          review report lists what needs checking.
        </p>
      </Section>

      <Section title="DRAWING REVIEW REPORT">
        <h4 className={styles.partTitle}>
          {details.coverTitle || details.designId || details.productTitle}
        </h4>
        <p className={styles.muted}>
          This drawing is generated automatically and is a first draft. The items
          below need a human decision.
        </p>
        <h5 className={styles.subhead}>Summary</h5>
        <StatCards items={reviewStats} />

        {details.tolerancesToVerify?.length ? (
          <>
            <h5 className={styles.subhead}>Tolerances to verify</h5>
            <SimpleTable
              columns={[
                { key: "characteristic", label: "Characteristic" },
                { key: "tol", label: "Tol" },
                { key: "datumRefs", label: "Datums" },
                { key: "confidence", label: "Confidence" },
                { key: "reason", label: "Reason" },
              ]}
              rows={details.tolerancesToVerify}
            />
          </>
        ) : null}

        {details.dimensionsNotDrawn?.length ? (
          <>
            <h5 className={styles.subhead}>Dimensions not drawn</h5>
            <SimpleTable
              columns={[
                { key: "sheet", label: "Sheet" },
                { key: "type", label: "Type" },
                { key: "value", label: "Value" },
                { key: "description", label: "Description" },
                { key: "reason", label: "Reason" },
              ]}
              rows={details.dimensionsNotDrawn}
            />
          </>
        ) : null}

        {details.toleranceSchedule?.length ? (
          <>
            <h5 className={styles.subhead}>Tolerance schedule</h5>
            <SimpleTable
              columns={[
                { key: "characteristic", label: "Characteristic" },
                { key: "tol", label: "Tol" },
                { key: "zone", label: "Zone" },
                { key: "datumRefs", label: "Datums" },
                { key: "confidence", label: "Confidence" },
              ]}
              rows={details.toleranceSchedule}
            />
          </>
        ) : null}

        {dimCount ? (
          <>
            <h5 className={styles.subhead}>Dimension schedule</h5>
            <p className={styles.scheduleCount}>
              All {dimCount} dimension(s) drawn.
            </p>
            <SimpleTable
              columns={[
                { key: "index", label: "#" },
                { key: "sheet", label: "Sheet" },
                { key: "type", label: "Type" },
                { key: "value", label: "Value" },
                { key: "description", label: "Description" },
              ]}
              rows={details.dimensionSchedule}
            />
          </>
        ) : null}

        {details.nothingToReview ? (
          <p className={styles.okNote}>
            Nothing to review: no dimensions were dropped and no control frames
            rest on an assumption.
          </p>
        ) : null}

        {!details.hasReviewContent ? (
          <p className={styles.muted}>
            Detailed review metadata is not available for this drawing set yet.
            Cover information above is still shown from the generated sheet index.
          </p>
        ) : null}
      </Section>
    </div>
  );
}
