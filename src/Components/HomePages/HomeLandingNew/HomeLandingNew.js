import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  CloudUpload,
  FileOutput,
  Files,
  Gauge,
  Layers,
  Workflow,
} from "lucide-react";
import TechDrawPriceAmount from "../shared/TechDrawPriceAmount";
import styles from "./HomeLandingNew.module.css";

const ASSURANCE_ITEMS = [
  "No software install",
  "Up to 300 MB",
  "Auto-delete in 7 days",
];

const QUICK_ROUTES = [
  { label: "STL", target: "STEP", href: "/tools/convert-stl-to-step" },
  { label: "IGES", target: "STEP", href: "/tools/convert-iges-to-step" },
  { label: "DWG", target: "DXF", href: "/tools/convert-dwg-to-dxf" },
];

const METRICS = [
  { icon: Files, value: "15,000+", label: "files converted" },
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

          <div className={styles.conversionConsole} aria-label="Marathon OS CAD conversion routes">
            <div className={styles.consoleHead}>
              <div>
                <span>MARATHON CONVERSION DESK</span>
                <strong>Choose the result you need</strong>
              </div>
              <span className={styles.livePill}>
                <span />
                ONLINE
              </span>
            </div>

            <div className={styles.consoleRoute}>
              <div className={styles.consoleFormat}>
                <small>SOURCE FILE</small>
                <strong>STEP</strong>
                <span>.step&nbsp;&nbsp;.stp</span>
              </div>
              <div className={styles.consoleArrow}>
                <span>CONVERT</span>
                <ArrowRight size={20} aria-hidden="true" />
              </div>
              <div className={`${styles.consoleFormat} ${styles.consoleFormatTarget}`}>
                <small>READY FILE</small>
                <strong>STL</strong>
                <span>.stl</span>
              </div>
            </div>

            <div className={styles.consolePurpose}>
              <span className={styles.consolePurposeIcon}>
                <Layers size={18} aria-hidden="true" />
              </span>
              <div>
                <small>WHY THIS ROUTE</small>
                <strong>Prepare engineering geometry for 3D printing</strong>
              </div>
            </div>

            <Link className={styles.consoleButton} href="/tools/convert-step-to-stl">
              Open STEP to STL converter
              <ArrowRight size={17} aria-hidden="true" />
            </Link>

            <Link className={styles.consoleAlternative} href="/tools/cad-drawing-pipeline">
              <span className={styles.consoleAltIcon}>
                <FileOutput size={18} aria-hidden="true" />
              </span>
              <span className={styles.consoleAltCopy}>
                <small>NEED MANUFACTURING DRAWINGS?</small>
                <strong>STEP or STP to 2D drawing set</strong>
              </span>
              <span className={styles.consoleAltPrice}>
                <TechDrawPriceAmount />
                <ChevronRight size={15} aria-hidden="true" />
              </span>
            </Link>

            <div className={styles.consoleQuick}>
              <span>MORE FORMAT CONVERSIONS</span>
              <div>
                {QUICK_ROUTES.map((route) => (
                  <Link key={route.href} href={route.href}>
                    {route.label}
                    <ChevronRight size={12} aria-hidden="true" />
                    {route.target}
                  </Link>
                ))}
              </div>
            </div>
          </div>
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
