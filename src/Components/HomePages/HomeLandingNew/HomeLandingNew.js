import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CloudUpload,
  Files,
  Gauge,
  Workflow,
} from "lucide-react";
import ConversionConsole from "./ConversionConsole";
import styles from "./HomeLandingNew.module.css";

const ASSURANCE_ITEMS = [
  "No software install",
  "Up to 300 MB",
  "Auto-delete in 7 days",
];

const METRICS = [
  { icon: Files, value: "150,000+", label: "files converted" },
  { icon: CloudUpload, value: "10 TB+", label: "CAD data handled" },
  { icon: Workflow, value: "60+", label: "specialist conversion tools" },
  { icon: Gauge, value: "300 MB", label: "supported per file" },
];

function HomeLandingNew() {
  return (
    <section className={styles.hero}>
      <div className={`${styles.heroOrbit} ${styles.heroOrbitOne}`} aria-hidden="true" />
      <div className={`${styles.heroOrbit} ${styles.heroOrbitTwo}`} aria-hidden="true" />

      <div className={styles.shell}>
        <div className={styles.heroLayout}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>
              <BadgeCheck size={14} aria-hidden="true" />
              YOUR #1 CAD CONVERSION WORKSPACE
            </div>

            <h1 className={styles.heroTitle}>The CAD converter experts.</h1>

            <p className={styles.heroLead}>
              Change the format or turn a 3D model into a 2D drawing set. Marathon OS
              gives you 60+ specialist tools, precise outputs and the fastest path from
              the file you have to the file you need.
            </p>

            <div className={styles.heroActions}>
              <Link
                className={`${styles.button} ${styles.buttonWhite} ${styles.buttonLarge}`}
                href="/tools/3d-cad-file-converter"
              >
                Find my converter
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                className={`${styles.button} ${styles.buttonGhost} ${styles.buttonLarge}`}
                href="#conversion-types"
              >
                See both conversion types
              </Link>
            </div>

            <div className={styles.heroAssurance}>
              {ASSURANCE_ITEMS.map((item) => (
                <span key={item}>
                  <Check size={14} aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <ConversionConsole />
        </div>
      </div>

      <div className={styles.shell}>
        <div className={styles.metricBar} aria-label="Marathon OS conversion statistics">
          {METRICS.map(({ icon: Icon, value, label }) => (
            <div key={label} className={styles.metric}>
              <Icon size={18} aria-hidden="true" />
              <div>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeLandingNew;
