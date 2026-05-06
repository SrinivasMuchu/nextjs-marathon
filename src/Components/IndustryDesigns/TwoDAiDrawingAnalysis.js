import styles from "./TwoDAiDrawingAnalysis.module.css";

const defaultSources = [
  {
    icon: "📄",
    iconMods: [],
    title: "drawing_plan.md → ## View-by-View Analysis",
    description:
      "One paragraph per view — the AI's reasoning about what it saw and why this projection was included.",
  },
  {
    icon: "⚙️",
    iconMods: ["itemIconPurple"],
    title: 'drawing_config.py → DRAWING_CONFIG_SEMANTIC["sheet_2"]',
    description:
      "Section plane normals & origins, detail anchor coordinates, radii, and full description strings.",
  },
  // BOM / bill of materials card (disabled)
  // {
  //   icon: "📊",
  //   iconMods: [],
  //   title: "bom.csv → rows",
  //   description:
  //     "Part names, materials, and quantities extracted by the AI from geometry analysis.",
  // },
  {
    icon: "{ }",
    iconMods: ["itemIconBlue", "itemIconMono"],
    title: "Dimension and sheet geometry output",
    description:
      "Dimension IDs per sheet and solid-to-sheet mapping — drives the stat strip counts.",
  },
];

/**
 * Server component: AI drawing analysis intro and pipeline source grid (no interactive UI).
 */
export default function TwoDAiDrawingAnalysis({ sources = defaultSources }) {
  return (
    <section className={styles.section} aria-labelledby="ai-drawing-analysis-heading">
      <p className={styles.eyebrow}>AI Drawing Analysis</p>
      <h2 id="ai-drawing-analysis-heading" className={styles.title}>
        What the AI Decided &amp; Why
      </h2>
      <p className={styles.lead}>
        The cards below explain how the generated drawing outputs and assets connect
        to the final technical sheets.
      </p>

      <div className={styles.gridWrap}>
        <div className={styles.grid}>
          {sources.map((item) => (
            <div key={item.title} className={styles.item}>
              <span
                className={[
                  styles.itemIcon,
                  ...(item.iconMods || []).map((k) => styles[k]),
                ].join(" ")}
                aria-hidden
              >
                {item.icon}
              </span>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <p className={styles.itemDesc}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
