import styles from "./CadDrawingPipeline.module.css";
import { MARATHON_OS_BADGE, MARATHON_OS_BRAND } from "./pipelineConstants";

const FEATURES = [
  {
    icon: "🧠",
    title: "Intelligent view selection",
    description:
      "The AI reviews rendered views of your model and picks the most informative orthographic, section, and detail views for the drawing set.",
  },
  {
    icon: "📐",
    title: "Automatic dimensioning",
    description:
      "Critical dimensions are identified and placed on each sheet so manufacturing and inspection teams get usable drawings without manual drafting.",
  },
  {
    icon: "📋",
    title: "Component identification",
    description:
      "Parts and assemblies are analysed so components can be reflected in the drawing configuration and bill of materials where applicable.",
  },
  {
    icon: "⚠️",
    title: "Human review recommended",
    description:
      "Always verify critical dimensions against your source CAD before release to production — AI accelerates drafting, not engineering sign-off.",
  },
];

const STATS = [
  { value: "14k", label: "Tokens per drawing" },
  { value: "6", label: "Views analysed" },
  { value: "~4 min", label: "End-to-end time" },
  { value: "100%", label: "Automated" },
];

export default function CadDrawingPipelineTransparency() {
  return (
    <section className={styles.transparency} aria-labelledby="cad-pipeline-transparency-title">
      <div className={styles.transparencyLayout}>
        <div className={styles.transparencyMain}>
          <p className={styles.transparencyLabel}>Transparency</p>
          <h2 id="cad-pipeline-transparency-title" className={styles.transparencyTitle}>
            Powered by {MARATHON_OS_BRAND}
          </h2>
          <p className={styles.transparencyIntro}>
            Every 2D technical drawing on Marathon OS is produced by our automated pipeline.
            Your 3D model is rendered from multiple angles, then{" "}
            <span className={styles.transparencyHighlight}>{MARATHON_OS_BRAND}</span> analyses the
            geometry to plan views, section cuts, dimensions, and sheet layout before FreeCAD
            generates the final drawing files.
          </p>

          <ul className={styles.transparencyFeatures}>
            {FEATURES.map((item) => (
              <li key={item.title} className={styles.transparencyFeature}>
                <span className={styles.transparencyFeatureIcon} aria-hidden>
                  {item.icon}
                </span>
                <div>
                  <h3 className={styles.transparencyFeatureTitle}>{item.title}</h3>
                  <p className={styles.transparencyFeatureText}>{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className={styles.transparencyPanel} aria-label="Pipeline run stats">
          <div className={styles.transparencyPanelHead}>
            <code className={styles.transparencyModel}>{MARATHON_OS_BADGE}</code>
            <span className={styles.transparencyStatus}>Active</span>
          </div>
          <p className={styles.transparencyPanelDesc}>
            {MARATHON_OS_BRAND} reasons over multi-view renders of your 3D geometry to select views,
            plan sections, and configure the drawing pipeline before sheets are exported.
          </p>
          <div className={styles.transparencyStats}>
            {STATS.map((stat) => (
              <div key={stat.label} className={styles.transparencyStat}>
                <div className={styles.transparencyStatValue}>{stat.value}</div>
                <div className={styles.transparencyStatLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
