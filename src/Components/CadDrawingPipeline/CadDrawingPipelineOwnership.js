import styles from "./CadDrawingPipeline.module.css";

const POINTS = [
  {
    title: "Encrypted transfer",
    body: "Files are uploaded and downloaded over an encrypted connection.",
  },
  {
    title: "7-day access",
    body: "Generated drawings can be downloaded for 7 days.",
  },
  {
    title: "You keep ownership",
    body: "Uploading a model or generating drawings never transfers ownership of the design.",
  },
  {
    title: "Never published",
    body: "Your models and drawings are never listed in the public CAD library.",
  },
];

export default function CadDrawingPipelineOwnership() {
  return (
    <section className={styles.ownBand} aria-labelledby="cad-pipeline-own-title">
      <div className={styles.ownPanel}>
        <div>
          <p className={styles.ownEyebrow}>Secure processing</p>
          <h2 id="cad-pipeline-own-title" className={styles.ownTitle}>
            Your designs stay yours
          </h2>
          <p className={styles.ownLede}>
            Engineering models and drawings often contain confidential product details. Uploads are
            kept separate from the public Marathon OS CAD library, and this is exactly how they are
            handled.
          </p>
        </div>
        <ul className={styles.ownGrid}>
          {POINTS.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.body}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
