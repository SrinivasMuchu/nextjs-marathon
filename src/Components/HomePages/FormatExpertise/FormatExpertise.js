import Link from "next/link";
import { ArrowRight, Box, FileOutput, Layers, ShieldCheck } from "lucide-react";
import styles from "./FormatExpertise.module.css";

const FAMILIES = [
  {
    number: "01",
    icon: Box,
    title: "CAD solids and surfaces",
    description: "For mechanical CAD, supplier handoffs and manufacturing workflows.",
    formats: ["STEP", "IGES", "BREP", "3DM"],
  },
  {
    number: "02",
    icon: Layers,
    title: "Meshes and 3D printing",
    description: "For slicing, printing, scanning, rendering and mesh editing.",
    formats: ["STL", "OBJ", "PLY", "OFF"],
  },
  {
    number: "03",
    icon: FileOutput,
    title: "2D technical drawings",
    description: "For drafting exchange, production drawings and downstream tools.",
    formats: ["DWG", "DXF"],
  },
];

function FormatExpertise() {
  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <div className={styles.layout}>
          <div className={styles.copy}>
            <p className={styles.label}>FORMAT EXPERTISE</p>
            <h2 className={styles.title}>CAD solids are not meshes. Drawings are different again.</h2>
            <p className={styles.description}>
              The best conversion starts with understanding what the file contains and what the
              next workflow expects. Marathon OS makes that distinction clear before you upload.
            </p>

            <div className={styles.note}>
              <ShieldCheck size={19} aria-hidden="true" />
              <span>
                <strong>Clear quality notes</strong> explain when a format change may affect
                features, surfaces or editability.
              </span>
            </div>

            <Link className={styles.link} href="/tools/3d-cad-file-converter">
              Explore supported formats
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className={styles.familyList}>
            {FAMILIES.map(({ number, icon: Icon, title, description, formats }) => (
              <article key={number} className={styles.familyCard}>
                <div className={styles.familyNumber}>{number}</div>
                <span className={styles.familyIcon}>
                  <Icon size={22} aria-hidden="true" />
                </span>
                <div className={styles.familyCopy}>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <div className={styles.formatPills}>
                  {formats.map((format) => (
                    <span key={format}>{format}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FormatExpertise;
