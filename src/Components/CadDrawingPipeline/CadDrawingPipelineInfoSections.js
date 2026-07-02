import {
  PIPELINE_BEFORE_USING_COPY,
  PIPELINE_GENERATOR_CREATES,
  PIPELINE_OUTPUT_FILES,
  PIPELINE_SUPPORTED_INPUTS,
} from '@/data/cadDrawingPipelinePage';
import styles from './CadDrawingPipeline.module.css';

function InfoBlock({ id, label, title, items, body }) {
  return (
    <section className={styles.infoBlock} aria-labelledby={id}>
      <p className={styles.infoBlockLabel}>{label}</p>
      <h2 id={id} className={styles.infoBlockTitle}>
        {title}
      </h2>
      {items ? (
        <ul className={styles.infoBlockList}>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {body ? <p className={styles.infoBlockBody}>{body}</p> : null}
    </section>
  );
}

export default function CadDrawingPipelineInfoSections() {
  return (
    <div className={styles.infoSections}>
      <InfoBlock
        id="pipeline-supported-inputs"
        label="Input formats"
        title="Supported input files"
        items={PIPELINE_SUPPORTED_INPUTS}
      />
      <InfoBlock
        id="pipeline-output-files"
        label="Deliverables"
        title="Output files included"
        items={PIPELINE_OUTPUT_FILES}
      />
      <InfoBlock
        id="pipeline-generator-creates"
        label="Drawing set"
        title="What the drawing generator creates"
        items={PIPELINE_GENERATOR_CREATES}
      />
      <InfoBlock
        id="pipeline-before-using"
        label="Important"
        title="Before using generated drawings"
        body={PIPELINE_BEFORE_USING_COPY}
      />
    </div>
  );
}
