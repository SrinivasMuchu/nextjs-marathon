import styles from "./CadDrawingPipeline.module.css";

const FORMATS = [
  {
    acronym: "PDF",
    title: "Print-Ready PDF",
    description:
      "Multi-sheet PDF with title block, drawing borders, and all views. A3/A4/ANSI sizes. Ready for printing or sharing.",
  },
  {
    acronym: "SVG",
    title: "Scalable Vector",
    description:
      "Resolution-independent vector files. Embed in documentation, web pages, or technical reports at any scale.",
  },
  {
    acronym: "DXF",
    title: "CAD Exchange",
    description:
      "Industry-standard DXF for importing back into AutoCAD, SolidWorks, Fusion 360, or any CNC toolchain.",
  },
  {
    acronym: "PNG",
    title: "High-Res Raster",
    description:
      "High-resolution PNG with dimensions overlaid. Perfect for presentations, inspection sheets, and quick reference.",
  },
];

export default function CadDrawingPipelineOutputFormats() {
  return (
    <section className={styles.outputFormats} aria-labelledby="cad-pipeline-formats-title">
      <p className={styles.outputFormatsLabel}>Output formats</p>
      <h2 id="cad-pipeline-formats-title" className={styles.outputFormatsTitle}>
        Every Format You Need
      </h2>
      <p className={styles.outputFormatsDesc}>
        One upload generates all four formats simultaneously. No extra steps.
      </p>

      <div className={styles.outputFormatsGrid}>
        {FORMATS.map((format) => (
          <article key={format.acronym} className={styles.outputFormatCard}>
            <p className={styles.outputFormatAcronym}>{format.acronym}</p>
            <h3 className={styles.outputFormatCardTitle}>{format.title}</h3>
            <p className={styles.outputFormatCardText}>{format.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
