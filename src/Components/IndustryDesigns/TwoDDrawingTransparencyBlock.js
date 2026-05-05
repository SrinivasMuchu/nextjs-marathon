import styles from "./TwoDDrawingTransparencyBlock.module.css";

const defaultMetaStats = [
  { value: "6", label: "Views Analysed" },
  { value: "9", label: "Sheets Generated" },
  { value: "2", label: "Section Cuts" },
  // { value: "12", label: "BOM Items" },
  { value: "4", label: "Export Formats" },
  { value: "14 Feb 2026", label: "Generated" },
];

const defaultIntroParagraphs = [
  "The Marathon 3D→2D pipeline rendered 6 views of the 3D CAD model (front, top, left, right, isometric, hidden-lines) and passed them through our AI analysis engine.",
  // BOM wording trimmed: previously also mentioned inferring materials / BOM-style procurement data.
  "The AI reasoned about the geometry — identifying components, planning which section cuts would reveal the most critical internal features, and selecting detail view anchor points. It then produced a drawing configuration that generated the final sheets automatically.",
];

/**
 * Server component: AI transparency copy + run metadata cards. Flex-wrap: two columns on desktop, stacked on mobile; metadata uses flex-wrap (2-col → 1-col).
 */
export default function TwoDDrawingTransparencyBlock({
  metaStats,
  introParagraphs,
  strongLine = "These are 2D engineering drawings, not 3D files.",
  strongLineRest = " Dimensions are extracted from the 3D geometry and should be verified against the source model before use in manufacturing.",
}) {
  void defaultMetaStats;
  void defaultIntroParagraphs;
  const safeMetaStats = Array.isArray(metaStats) ? metaStats : [];
  const safeIntro = Array.isArray(introParagraphs) ? introParagraphs : [];
  return (
    <section className={styles.wrap} aria-labelledby="transparency-heading">
      <div className={styles.left}>
        <p className={styles.label}>AI Transparency</p>
        <h2 id="transparency-heading" className={styles.title}>
          How these drawings were generated
        </h2>
        {safeIntro.map((p, i) => (
          <p key={i} className={styles.text}>
            {p}
          </p>
        ))}
        <p className={styles.text}>
          <strong>{strongLine}</strong>
          {strongLineRest}
        </p>
      </div>
      <div className={styles.right}>
        <p className={styles.label}>Run Metadata</p>
        <div className={styles.stats}>
          {safeMetaStats.map((item) => (
            <div key={item.label} className={styles.stat}>
              <div className={styles.statVal}>{item.value}</div>
              <div className={styles.statKey}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
