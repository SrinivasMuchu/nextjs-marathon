import { Check, LockKeyhole } from "lucide-react";
import styles from "./ConversionPrivacy.module.css";

const PRIVACY_POINTS = [
  "Encrypted during upload",
  "Processed privately",
  "Deleted after 7 days",
  "Never added to the public library",
];

function ConversionPrivacy() {
  return (
    <section className={styles.section} aria-labelledby="conversion-privacy-heading">
      <div className={styles.shell}>
        <div className={styles.inner}>
          <div className={styles.titleBlock}>
            <span className={styles.icon}>
              <LockKeyhole size={22} aria-hidden="true" />
            </span>
            <div>
              <span className={styles.label}>PRIVATE FILE HANDLING</span>
              <h2 id="conversion-privacy-heading" className={styles.heading}>
                Your engineering files stay your files.
              </h2>
            </div>
          </div>

          <div className={styles.points}>
            {PRIVACY_POINTS.map((point) => (
              <span key={point} className={styles.point}>
                <Check size={15} aria-hidden="true" />
                {point}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ConversionPrivacy;
