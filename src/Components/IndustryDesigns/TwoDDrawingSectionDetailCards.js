import styles from "./TwoDDrawingSectionDetailCards.module.css";

const defaultGroups = [
  {
    srcTag:
      'drawing_config.py → DRAWING_CONFIG_SEMANTIC["sheet_2"]["section_a"] and ["section_b"]',
    variant: "section",
    cards: [
      {
        symbol: "A — A",
        label: "section_a",
        meta: "normal: (0, 0, 1) · origin: (−2.884, 956.338, 0.0)",
        description:
          "Longitudinal vertical section through the center of the heat exchanger at Z=0, revealing the internal gyroid lattice infill structure, conical transition geometry from shell to top and bottom nozzles, tubesheet cross-sections at lateral nozzle connections, shell wall thickness, and internal flow passage geometry. This cut bisects the assembly symmetrically, showing the full internal arrangement from top nozzle through upper cone, shell body with gyroid core, lower cone, to bottom nozzle.",
        bullets: [
          "Internal gyroid lattice infill structure",
          "Conical transition geometry shell → nozzle",
          "Shell wall thickness in section",
          "Tubesheet thickness and tube hole pattern in cross-section",
        ],
      },
      {
        symbol: "B — B",
        label: "section_b",
        meta: "normal: (0, 1, 0) · origin: (−2.884, 600.0, 0.740)",
        description:
          "Horizontal cross-section through the main shell body at the lateral nozzle centerline elevation (Y=600 mm), revealing the gyroid infill pattern in plan view, the shell wall cross-section in the radial direction, the lateral nozzle internal bore geometry, tubesheet face and tube hole pattern from the cut plane, and the relationship between the gyroid lattice and the shell inner wall.",
        bullets: [
          "Gyroid infill pattern in plan at mid-height",
          "Shell wall radial thickness at nozzle elevation",
          "Both lateral nozzle internal bores in a single view",
          "Heat transfer surface area distribution",
        ],
      },
    ],
  },
  {
    srcTag:
      'drawing_config.py → DRAWING_CONFIG_SEMANTIC["sheet_2"]["detail_c"] and ["detail_d"]',
    variant: "detail",
    cards: [
      {
        symbol: "Detail C",
        label: "detail_c · base_view: section_a",
        meta: "anchor: (0.0, 600.0, 0.0) · radius: 20",
        description:
          "Tubesheet-to-shell junction detail at the lateral nozzle connection, showing tubesheet thickness, tube hole drilling pattern in cross-section, tube-to-tubesheet joint geometry, shell-to-tubesheet weld preparation, and the termination interface where the gyroid infill structure meets the tubesheet face. Critical for manufacturing and inspection specifications.",
        bullets: [
          "Tubesheet thickness and tube hole drilling pattern",
          "Tube-to-tubesheet joint geometry",
          "Shell-to-tubesheet weld preparation",
          "Gyroid infill termination at tubesheet face",
        ],
      },
      {
        symbol: "Detail D",
        label: "detail_d · base_view: section_b",
        meta: "anchor: (0.0, 600.0, 350.0) · radius: 20",
        description:
          "Shell wall and lateral nozzle penetration detail showing the nozzle-to-shell intersection geometry, reinforcement pad or integral reinforcement, internal bore profile, gyroid lattice interface with the shell inner wall, and wall thickness at the nozzle opening. Critical for pressure vessel code compliance and stress analysis verification.",
        bullets: [
          "Nozzle-to-shell intersection geometry",
          "Reinforcement pad / integral reinforcement profile",
          "Internal bore profile and wall thickness",
          "Gyroid lattice interface with shell inner wall",
        ],
      },
    ],
  },
];

function Card({ card, variant }) {
  const isSection = variant === "section";
  return (
    <article className={styles.card}>
      <div
        className={`${styles.head} ${isSection ? styles.headSection : styles.headDetail}`}
      >
        <span
          className={`${styles.sym} ${isSection ? styles.symSection : styles.symDetail}`}
        >
          {card.symbol}
        </span>
        <span
          className={`${styles.lbl} ${isSection ? styles.lblSection : styles.lblDetail}`}
        >
          {card.label}
        </span>
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>{card.meta}</div>
        <p className={styles.desc}>{card.description}</p>
        <ul className={styles.list}>
          {card.bullets.map((line) => (
            <li
              key={line}
              className={`${styles.item} ${isSection ? styles.itemSection : styles.itemDetail}`}
            >
              {line}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/**
 * Server component: section cuts + detail views. Rows use flex-wrap for mobile stacking.
 * Pass `groups={[]}` to hide; omit `groups` for demo defaults.
 */
export default function TwoDDrawingSectionDetailCards({ groups }) {
  void defaultGroups;
  const data = Array.isArray(groups) ? groups : [];
  if (!data.length) return null;

  return (
    <div className={styles.wrapper} aria-label="Section cuts and detail views">
      {data.map((group) => (
        <div key={group.srcTag} className={styles.group}>
          <div className={styles.srcTag}>{group.srcTag}</div>
          <div className={styles.row}>
            {group.cards.map((card) => (
              <Card key={card.label} card={card} variant={group.variant} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
