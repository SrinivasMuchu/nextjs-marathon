import Link from "next/link";
import { ArrowRight, ChevronRight, FileOutput, RefreshCw } from "lucide-react";
import styles from "./ConversionTypes.module.css";

const FORMAT_EXAMPLES = [
  { from: "STEP", to: "STL" },
  { from: "STL", to: "STEP" },
  { from: "IGES", to: "STEP" },
];

const DRAWING_OUTPUTS = ["PDF", "SVG", "DXF", "PNG"];

function ConversionTypes() {
  return (
    <section className={styles.section} id="conversion-types">
      <div className={styles.shell}>
        <div className={styles.heading}>
          <div>
            <p className={styles.label}>TWO CONVERSION JOBS. ONE SPECIALIST PLATFORM.</p>
            <h2 className={styles.title}>Tell us what the next step needs.</h2>
          </div>
          <p className={styles.description}>
            Choose a new file format for the same geometry, or create a clear 2D drawing set
            from a 3D model.
          </p>
        </div>

        <div className={styles.grid}>
          <article className={styles.card}>
            <div className={styles.cardTop}>
              <span className={styles.cardIcon}>
                <RefreshCw size={24} aria-hidden="true" />
              </span>
              <span className={styles.cardNumber}>01</span>
            </div>

            <p className={styles.cardLabel}>FORMAT TO FORMAT</p>
            <h3 className={styles.cardTitle}>Convert STEP to STL and 60+ similar routes.</h3>
            <p className={styles.cardText}>
              Move between CAD solids, surfaces, meshes and drawing formats without installing
              another application.
            </p>

            <div className={styles.examples}>
              {FORMAT_EXAMPLES.map(({ from, to }) => (
                <span key={`${from}-${to}`}>
                  {from}
                  <ChevronRight size={12} aria-hidden="true" />
                  {to}
                </span>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.priceBlock}>
                <small>SINGLE DOWNLOAD</small>
                <strong>$2.99</strong>
              </div>
              <Link className={styles.primaryButton} href="/tools/3d-cad-file-converter">
                Choose a format converter
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </article>

          <article className={`${styles.card} ${styles.drawingCard}`}>
            <div className={styles.cardTop}>
              <span className={styles.cardIcon}>
                <FileOutput size={24} aria-hidden="true" />
              </span>
              <span className={styles.cardNumber}>02</span>
            </div>

            <p className={styles.cardLabel}>3D CAD TO 2D</p>
            <h3 className={styles.cardTitle}>Turn STEP or STP into a usable drawing set.</h3>
            <p className={styles.cardText}>
              Create multi-view technical sheets for quoting, review, documentation and workshop
              handoffs.
            </p>

            <div className={`${styles.examples} ${styles.outputPills}`}>
              {DRAWING_OUTPUTS.map((format) => (
                <span key={format}>{format}</span>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.priceBlock}>
                <small>PER DRAWING SET</small>
                <strong>$5.99</strong>
              </div>
              <Link className={styles.whiteButton} href="/tools/cad-drawing-pipeline">
                Create 2D drawings
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default ConversionTypes;
