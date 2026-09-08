import Link from "next/link";
import { ArrowRight, Download, Eye, FileInput, RefreshCw } from "lucide-react";
import styles from "./ConversionWorkflow.module.css";

const STEPS = [
  {
    number: "01",
    icon: FileInput,
    title: "Choose the route",
    text: "Select the format you have and the format the next workflow needs.",
  },
  {
    number: "02",
    icon: RefreshCw,
    title: "Convert securely",
    text: "Upload on the dedicated converter page and process the file in your browser workflow.",
  },
  {
    number: "03",
    icon: Download,
    title: "Inspect and continue",
    text: "Download the result, preview supported geometry and move the job forward.",
  },
];

function ConversionWorkflow() {
  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.shell}>
        <header className={styles.heading}>
          <div className={styles.headingMain}>
            <p className={styles.label}>BUILT TO KEEP WORK MOVING</p>
            <h2 className={styles.title}>From incompatible to ready in three clear steps.</h2>
          </div>
          <p className={styles.description}>
            Start from the converter that matches your exact task. Upload only when you reach that
            dedicated route.
          </p>
        </header>

        <div className={styles.grid}>
          {STEPS.map(({ number, icon: Icon, title, text }) => (
            <article key={number} className={styles.card}>
              <span className={styles.stepNumber}>{number}</span>
              <span className={styles.stepIcon}>
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardText}>{text}</p>
            </article>
          ))}
        </div>

        <div className={styles.viewerBridge}>
          <div className={styles.viewerCopy}>
            <span className={styles.viewerIcon}>
              <Eye size={23} aria-hidden="true" />
            </span>
            <div>
              <span className={styles.viewerLabel}>MARATHON OS CAD VIEWER</span>
              <h3 className={styles.viewerTitle}>See the file before and after conversion.</h3>
              <p className={styles.viewerText}>
                Inspect supported CAD and mesh files in your browser without installing another
                application.
              </p>
            </div>
          </div>
          <Link className={styles.viewerButton} href="/tools/3d-cad-viewer">
            Open CAD Viewer
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ConversionWorkflow;
