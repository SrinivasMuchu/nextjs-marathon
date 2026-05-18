import TwoDDrawingCtaBannerButton from "./TwoDDrawingCtaBannerButton";
import styles from "./TwoDDrawingCtaBanner.module.css";

const defaultChecks = [
  "Ready in under 4 minutes",
  "9 sheets · PDF, SVG, DXF, PNG",
  "No subscription · pay per file",
];

/**
 * Server shell + client upload button only. Responsive: stacks on narrow viewports; CTA row wraps.
 */
export default function TwoDDrawingCtaBanner({
  generateHref = "/generate",
  eyebrow = "Paid Pipeline · $4 per set",
  title = "Have your own CAD file? Get 2D drawings just like these.",
  description = "Upload any STEP, IGES, or FreeCAD file. Our AI analyses the 3D geometry, selects the best views and section cuts, and delivers a complete 2D engineering drawing set in under 4 minutes.",
  buttonLabel = "⚡ Upload CAD & Generate — $4",
  price = "$4",
  priceSubtext = "per drawing set",
  turnaround = "4 min",
  turnaroundLabel = "avg. turnaround",
  checks = defaultChecks,
}) {
  return (
    <section className={styles.banner} aria-labelledby="two-d-cta-heading">
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id="two-d-cta-heading" className={styles.title}>
            {title}
          </h2>
          <p className={styles.desc}>{description}</p>
          <div className={styles.ctaRow}>
            <TwoDDrawingCtaBannerButton href={generateHref}>
              {buttonLabel}
            </TwoDDrawingCtaBannerButton>
            <ul className={styles.checks}>
              {checks.map((line) => (
                <li key={line}>✓ {line}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.priceBig}>{price}</div>
          <div className={styles.priceSub}>{priceSubtext}</div>
          <div className={styles.timeBadge}>
            <div className={styles.timeVal}>{turnaround}</div>
            <div className={styles.timeKey}>{turnaroundLabel}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
