import styles from "./CadDrawingPipeline.module.css";

const FORMATS = [
  {
    id: "format-pdf",
    name: "PDF",
    use: "Printing, emailing and requesting quotes. Vector, so it stays sharp at any zoom.",
    opens: "Any PDF reader or browser",
  },
  {
    id: "format-dxf",
    name: "DXF",
    use: "Layered DXF of each drawing sheet, with real dimension entities, for editing in 2D CAD. It is at drawing scale, not 1:1 part geometry.",
    opens: "AutoCAD, DraftSight, LibreCAD, QCAD",
  },
  {
    id: "format-svg",
    name: "SVG",
    use: "Web pages, manuals and diagrams that need clean, scalable line art.",
    opens: "Browsers, Inkscape, Illustrator, Figma",
  },
  {
    id: "format-fcstd",
    name: "FCStd",
    use: "Changing the drawing: moving views, adding dimensions, editing the title block.",
    opens: "FreeCAD (free, Windows, macOS, Linux)",
  },
];

export default function CadDrawingPipelineFormats() {
  return (
    <section className={styles.formatsBand} id="file-formats" aria-labelledby="cad-pipeline-formats-choice-title">
      <div className={styles.formatsInner}>
        <p className={styles.pricingEyebrow}>File formats</p>
        <h2 id="cad-pipeline-formats-choice-title" className={styles.formatsTitle}>
          Which format to use
        </h2>
        <p className={styles.formatsLede}>
          Every drawing set includes all four formats, so you can send the right one to each person
          without converting again.
        </p>

        <div className={styles.formatsTableWrap}>
          <table className={styles.formatsTable}>
            <thead>
              <tr>
                <th scope="col">Format</th>
                <th scope="col">Use it for</th>
                <th scope="col">Opens in</th>
              </tr>
            </thead>
            <tbody>
              {FORMATS.map((row) => (
                <tr key={row.id} id={row.id}>
                  <th scope="row">{row.name}</th>
                  <td>{row.use}</td>
                  <td>{row.opens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
