import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./ConverterDirectory.module.css";

const SUMMARY_STATS = [
  { value: "60+", label: "conversion tools" },
  { value: "10", label: "supported formats" },
  { value: "3", label: "geometry families" },
];

const CONVERTERS = [
  {
    from: "STEP",
    to: "STL",
    href: "/tools/convert-step-to-stl",
    description: "Prepare CAD geometry for slicing and 3D printing.",
    badge: "MOST USED",
  },
  {
    from: "STL",
    to: "STEP",
    href: "/tools/convert-stl-to-step",
    description: "Move mesh geometry into a CAD-compatible workflow.",
  },
  {
    from: "IGES",
    to: "STEP",
    href: "/tools/convert-iges-to-step",
    description: "Bring legacy surfaces into a modern CAD handoff.",
  },
  {
    from: "STEP",
    to: "IGES",
    href: "/tools/convert-step-to-iges",
    description: "Exchange engineering geometry across older CAD systems.",
  },
  {
    from: "OBJ",
    to: "STL",
    href: "/tools/convert-obj-to-stl",
    description: "Create a practical mesh file for printing workflows.",
  },
  {
    from: "OBJ",
    to: "STEP",
    href: "/tools/convert-obj-to-step",
    description: "Take mesh geometry into a mechanical CAD workflow.",
  },
  {
    from: "DWG",
    to: "DXF",
    href: "/tools/convert-dwg-to-dxf",
    description: "Make 2D drawings easier to exchange across tools.",
  },
  {
    from: "DXF",
    to: "DWG",
    href: "/tools/convert-dxf-to-dwg",
    description: "Move exchange drawings back into a DWG workflow.",
  },
];

function ConverterDirectory() {
  return (
    <section className={styles.section} id="converters">
      <div className={styles.shell}>
        <div className={styles.heading}>
          <div>
            <p className={styles.label}>SPECIALIST CONVERTERS</p>
            <h2 className={styles.title}>Every common CAD handoff, in one place.</h2>
          </div>
          <p className={styles.description}>
            Start with the exact route your next application, printer, supplier or production
            workflow requires.
          </p>
        </div>

        <div className={styles.summary}>
          {SUMMARY_STATS.map(({ value, label }) => (
            <span key={label}>
              <strong>{value}</strong> {label}
            </span>
          ))}
          <Link className={styles.summaryLink} href="/tools/3d-cad-file-converter">
            View the complete directory
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.grid}>
          {CONVERTERS.map(({ from, to, href, description, badge }) => (
            <Link key={href} className={styles.card} href={href}>
              <div className={styles.cardHead}>
                <span className={styles.route}>
                  <strong>{from}</strong>
                  <span className={styles.miniArrow}>
                    <ArrowRight size={16} aria-hidden="true" />
                  </span>
                  <strong className={styles.toFormat}>{to}</strong>
                </span>
                {badge ? <span className={styles.badge}>{badge}</span> : null}
              </div>
              <p>{description}</p>
              <span className={styles.cardCta}>
                Open converter
                <ArrowRight size={15} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>

        <div className={styles.banner}>
          <div>
            <span>Can you convert my file?</span>
            <strong>Choose from more than 60 specialist conversion tools.</strong>
          </div>
          <Link className={styles.bannerButton} href="/tools/3d-cad-file-converter">
            Find the exact converter
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ConverterDirectory;
