import Link from "next/link";
import { ArrowRight, Check, Wrench } from "lucide-react";
import styles from "./ConversionDesignerCta.module.css";

const POINTS = [
  "Vetted CAD specialists",
  "Clear project scope",
  "Files built for the next step",
];

function ConversionDesignerCta() {
  return (
    <section className={styles.section} aria-labelledby="conversion-designer-cta-heading">
      <div className={styles.shell}>
        <div className={styles.banner}>
          <span className={styles.icon} aria-hidden="true">
            <Wrench size={29} />
          </span>

          <div className={styles.copy}>
            <span className={styles.label}>WHEN A CONVERTER CANNOT SOLVE THE GEOMETRY</span>
            <h2 id="conversion-designer-cta-heading" className={styles.title}>
              Bring in a CAD designer for the work that needs a human.
            </h2>
            <p className={styles.description}>
              Get help with damaged geometry, parametric rebuilds, part changes, new designs and
              production-ready drawings.
            </p>
            <div className={styles.points}>
              {POINTS.map((point) => (
                <span key={point} className={styles.point}>
                  <Check size={14} aria-hidden="true" />
                  {point}
                </span>
              ))}
            </div>
          </div>

          <Link className={styles.ctaButton} href="/cad-services">
            Hire a CAD designer
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ConversionDesignerCta;
