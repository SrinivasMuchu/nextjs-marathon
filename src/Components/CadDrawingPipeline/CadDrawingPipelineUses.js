import styles from "./CadDrawingPipeline.module.css";

const USES = [
  {
    title: "Getting a quote",
    body: "Machine shops and fabricators price faster from a dimensioned PDF than from a 3D file alone.",
  },
  {
    title: "Cutting flat parts",
    body: "Use the DXF view outline as a starting profile for laser, waterjet or plasma cutting, after deleting the border and dimensions and scaling it back to 1:1 (the DXF is at drawing scale).",
  },
  {
    title: "Checking a downloaded model",
    body: "See the real dimensions of a model from a supplier catalogue or CAD library without installing CAD software.",
  },
  {
    title: "Coursework and portfolios",
    body: "Produce clean orthographic and section views of your own designs, then refine them in FreeCAD.",
  },
  {
    title: "Manuals and documentation",
    body: "Drop SVG views into assembly guides, datasheets and product pages.",
  },
  {
    title: "A head start on drafting",
    body: "Start from a laid-out, dimensioned sheet and spend your time on tolerances and notes instead of placing views.",
  },
];

export default function CadDrawingPipelineUses() {
  return (
    <section className={styles.usesBand} aria-labelledby="cad-pipeline-uses-title">
      <div className={styles.usesInner}>
        <p className={styles.pricingEyebrow}>Who it&apos;s for</p>
        <h2 id="cad-pipeline-uses-title" className={styles.usesTitle}>
          What people use STEP drawings for
        </h2>
        <p className={styles.usesLede}>
          A 3D model is great on screen, but many people and machines still work from a 2D sheet.
        </p>
        <ul className={styles.usesGrid}>
          {USES.map((item) => (
            <li key={item.title} className={styles.usesCard}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
