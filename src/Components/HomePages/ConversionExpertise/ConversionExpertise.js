import { Eye, RefreshCw, ScanLine, TimerReset } from "lucide-react";
import styles from "./ConversionExpertise.module.css";

const STANDARDS = [
  {
    icon: TimerReset,
    label: "60+ DIRECT TOOLS",
    title: "Our fastest path to the right format",
    text: "Go straight to the exact source and target pair. No software install, no plugins and no long setup before the real work can continue.",
  },
  {
    icon: ScanLine,
    label: "10 ENGINEERING FORMATS",
    title: "Our most precise conversion workflow",
    text: "See the input, output and intended use before you start. We also explain when moving between CAD and mesh formats can change editability.",
  },
  {
    icon: Eye,
    label: "VIEW BEFORE YOU MOVE ON",
    title: "A result you can inspect",
    text: "Open supported files in the Marathon OS viewer before or after conversion, so the output is not a blind download.",
  },
];

function ConversionExpertise() {
  return (
    <section className={styles.section} id="why-marathon">
      <div className={styles.shell}>
        <div className={styles.intro}>
          <p className={styles.label}>CONVERSION FIRST, BY DESIGN</p>

          <div className={styles.introCopy}>
            <h2 className={styles.title}>Not a toolbox with a converter hidden inside.</h2>
            <p className={styles.description}>
              Marathon OS is built around the handoff between file formats. We help engineers,
              makers and production teams get from the file they received to the file the next
              tool can use.
            </p>
          </div>

          <aside className={styles.aside}>
            <RefreshCw size={21} aria-hidden="true" />
            <strong>
              Conversion is not a side feature here. It is the job we are built to do
              exceptionally well.
            </strong>
          </aside>
        </div>

        <div className={styles.grid}>
          {STANDARDS.map(({ icon: Icon, label, title, text }) => (
            <article key={label} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.cardIcon}>
                  <Icon size={21} aria-hidden="true" />
                </span>
                <span className={styles.cardLabel}>{label}</span>
              </div>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardText}>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ConversionExpertise;
