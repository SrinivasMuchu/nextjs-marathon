import TwoDDrawingRemoteSheetImg from "./TwoDDrawingRemoteSheetImg";
import styles from "./TwoDDrawingViewCards.module.css";

const BADGE = {
  ortho: { label: "Orthographic", className: styles.badgeOrtho },
  iso: { label: "Isometric", className: styles.badgeIso },
  hidden: { label: "Hidden", className: styles.badgeHidden },
};

const defaultViews = [
  {
    title: "Front View",
    badgeKey: "ortho",
    source: "drawing_plan.md → ### Front View",
    body: "Shows the exchanger in an upright orientation. At the top, there is a smaller inlet/outlet nozzle with a flanged connection (bolted flange with ~8 bolt holes visible). Below that is a conical transition/reducer leading into the main shell body. The central shell has a rectangular inspection window or flat pad visible. At the bottom, a larger tube-side nozzle is visible with a tubesheet face showing approximately 30+ tube holes arranged in a circular pattern, surrounded by a bolted flange ring. Below that is another flanged nozzle connection at the very bottom.",
    imageSrc: "",
  },
  {
    title: "Top View",
    badgeKey: "ortho",
    source: "drawing_plan.md → ### Top View",
    body: "Looking down, the top nozzle with its tubesheet pattern is clearly visible (showing the tube holes from above). The conical transition and the rectangular flat section on the shell are visible. At the far bottom, the smaller bottom nozzle with its own tube pattern is visible.",
    imageSrc: "",
  },
  {
    title: "Left Side View",
    badgeKey: "ortho",
    source: "drawing_plan.md → ### Left Side View",
    body: "Reveals the cross-shaped or multi-nozzle configuration. The main shell body is oriented along the Z-axis (horizontal in this view), with two lateral nozzles extending to the left and right — these are the shell-side inlet and outlet connections. Each lateral nozzle has a bolted flange. The top and bottom nozzles (tube-side) are also visible. The conical transitions between the shell and nozzles are clearly shown.",
    imageSrc: "",
  },
  {
    title: "Right Side View",
    badgeKey: "ortho",
    source: "drawing_plan.md → ### Right Side View",
    body: "Confirms the symmetrical arrangement. The large lateral nozzle with its tubesheet face (showing ~30 tube holes) is prominently visible. This confirms the exchanger has tube bundles running horizontally (along the Z-axis) through the shell, with the gyroid infill surrounding or integrated with the tubes.",
    imageSrc: "",
  },
  {
    title: "Isometric View",
    badgeKey: "iso",
    source: "drawing_plan.md → ### Isometric View",
    body: "Provides the best overall understanding: This is essentially a cross-flow or multi-pass heat exchanger with two vertical nozzles (top and bottom, tube-side connections with tubesheets), two horizontal/lateral nozzles (shell-side connections with tubesheets), a central bulbous shell body with conical transitions, and a gyroid infill structure that is internal and not visible from outside.",
    imageSrc: "",
  },
  {
    title: "Front — Hidden Lines",
    badgeKey: "hidden",
    source: "drawing_plan.md → ### Front View with Hidden Lines",
    body: "Shows the large lateral tubesheet face-on with all ~30 tube holes clearly visible. The shell profile and transition cones are well-defined. Chosen because the external views alone cannot make the internal tubesheet dimensionable without hidden-line projection.",
    imageSrc: "",
  },
];

/**
 * Server component: view-by-view analysis cards. Uses flex-wrap for responsive rows.
 */
export default function TwoDDrawingViewCards({ views = defaultViews }) {
  return (
    <section className={styles.section} aria-label="View-by-view analysis">
      <div className={styles.list}>
        {views.map((v) => {
          const b = BADGE[v.badgeKey] || BADGE.ortho;
          return (
            <article key={v.title} className={styles.card}>
              <div className={styles.preview}>
                {v.imageSrc ? (
                  <TwoDDrawingRemoteSheetImg
                    src={v.imageSrc}
                    previewCandidates={v.previewCandidates}
                    alt={v.title}
                  />
                ) : (
                  <div className={styles.previewPlaceholder}>{v.title}</div>
                )}
              </div>
              <div className={styles.body}>
                <div className={styles.titleRow}>
                  <h3 className={styles.title}>{v.title}</h3>
                  <span className={`${styles.badge} ${b.className}`}>{b.label}</span>
                </div>
                <p className={styles.text}>{v.body}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
