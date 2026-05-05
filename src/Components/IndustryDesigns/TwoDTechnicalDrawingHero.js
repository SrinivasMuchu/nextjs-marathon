import styles from "./TwoDTechnicalDrawingHero.module.css";

/* Tag pills (not shown by default; pass `tags={[...]}` to render):
 * Electrical
 * IP67
 * Ethernet
 * M12 Connector
 * Angle Connector
 * Engineering Drawing
 * PDF · SVG · DXF · PNG
 */
const defaultTags = [];

const defaultStats = [
  { value: "9", label: "Drawing Sheets" },
  { value: "6", label: "Views Analysed" },
  { value: "4", label: "Export Formats" },
  { value: "2", label: "Section Cuts" },
  // { value: "12", label: "BOM Items" },
  { value: "1st Angle", label: "Projection" },
];

/**
 * Server component: hero for 2D technical drawing product pages (badges, title, optional tags, stat strip).
 */
export default function TwoDTechnicalDrawingHero({
  title = "Industrial IP67 Ethernet M12 Angle Connector — 2D Technical Drawing Set",
  tags = defaultTags,
  stats = defaultStats,
  showBadges = true,
}) {
  return (
    <header className={styles.hero}>
      {showBadges && (
        <div className={styles.chipRow} aria-label="Drawing highlights">
          <span className={`${styles.chip} ${styles.chip2d}`}>
            <span aria-hidden>📐</span> 2D Technical Drawings
          </span>
          <span className={`${styles.chip} ${styles.chipAi}`}>
            <span aria-hidden>🤖</span> AI Generated
          </span>
          <span className={`${styles.chip} ${styles.chipFree}`}>Free Download</span>
        </div>
      )}

      <h1 className={styles.title}>{title}</h1>

      {tags.length > 0 && (
        <div className={styles.tagRow}>
          {tags.map((t) => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>
      )}

      <div className={styles.statStrip} role="list">
        {stats.map((s) => (
          <div key={s.label} className={styles.statItem} role="listitem">
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statKey}>{s.label}</div>
          </div>
        ))}
      </div>
    </header>
  );
}
