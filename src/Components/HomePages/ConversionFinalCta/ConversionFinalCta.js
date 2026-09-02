import Link from "next/link";
import { ArrowRight, BadgeCheck, RefreshCw } from "lucide-react";
import styles from "./ConversionFinalCta.module.css";

function ConversionFinalCta() {
  return (
    <section className={styles.section} aria-labelledby="conversion-final-cta-heading">
      <div className={styles.shell}>
        <span className={styles.badge}>
          <RefreshCw size={14} aria-hidden="true" />
          MARATHON OS CAD CONVERSION
        </span>

        <h2 id="conversion-final-cta-heading" className={styles.title}>
          The file you need is one conversion away.
        </h2>

        <p className={styles.description}>
          Change the format or create the drawing set. Choose the exact result and keep the project
          moving.
        </p>

        <div className={styles.actions}>
          <Link
            className={`${styles.button} ${styles.buttonWhite} ${styles.buttonLarge}`}
            href="/tools/3d-cad-file-converter"
          >
            Convert a CAD format
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link
            className={`${styles.button} ${styles.buttonGhost} ${styles.buttonLarge}`}
            href="/tools/cad-drawing-pipeline"
          >
            Create 2D drawings
          </Link>
        </div>

        <span className={styles.proof}>
          <BadgeCheck size={14} aria-hidden="true" />
          15,000+ files converted across 60+ specialist tools
        </span>
      </div>
    </section>
  );
}

export default ConversionFinalCta;
