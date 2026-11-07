import styles from "./CadDrawingPipeline.module.css";

const GUIDES = [
  {
    title: "Edit the FCStd in FreeCAD",
    steps: [
      <>
        Open the .FCStd file in FreeCAD and switch to the <strong>TechDraw</strong> workbench.
      </>,
      <>
        Drag views to reposition them, or change their scale in the <strong>Property</strong> panel.
      </>,
      <>
        Add dimensions with the <strong>TechDraw</strong> dimension tools, and click the editable
        fields in the title block to change its text.
      </>,
      <>
        Export again with <strong>File → Export</strong> or the TechDraw export commands.
      </>,
    ],
  },
  {
    title: "Edit the DXF in AutoCAD or DraftSight",
    steps: [
      <>Open the .dxf file directly.</>,
      <>
        Check the units with <strong>UNITS</strong> and measure one dimension to confirm the scale.
      </>,
      <>Add tolerances, notes and your own title block, then save as DWG if needed.</>,
    ],
  },
  {
    title: "SolidWorks",
    steps: [
      <>
        Open the STEP, then choose <strong>File → Make Drawing from Part</strong>.
      </>,
      <>Drag views from the View Palette onto the sheet.</>,
      <>
        Use <strong>Model Items</strong> on the Annotation tab to bring in dimensions.
      </>,
    ],
  },
  {
    title: "Autodesk Fusion",
    steps: [
      <>Open the STEP as a design.</>,
      <>
        Choose <strong>File → New Drawing → From Design</strong>, then pick the standard and sheet
        size.
      </>,
      <>Place the base view, add projected views and dimension them.</>,
    ],
  },
  {
    title: "AutoCAD",
    steps: [
      <>
        Bring the STEP in with <strong>IMPORT</strong> (full AutoCAD, not LT).
      </>,
      <>
        Set up a view direction and run <strong>FLATSHOT</strong> to create a 2D projection.
      </>,
      <>Repeat for each view and add dimensions manually.</>,
    ],
  },
];

export default function CadDrawingPipelineEditGuide() {
  return (
    <section className={styles.editBand} id="how-to-edit" aria-labelledby="cad-pipeline-edit-title">
      <div className={styles.editLayout}>
        <div className={styles.editIntro}>
          <p className={styles.pricingEyebrow}>Make changes</p>
          <h2 id="cad-pipeline-edit-title" className={styles.editTitle}>
            Edit your drawing, or make one yourself
          </h2>
          <p>
            The FreeCAD file is the easiest way to change a generated drawing, because the views
            stay linked to the 3D model. The DXF suits anyone who already works in 2D CAD.
          </p>
          <p>
            If you have a CAD program, you can also make drawings yourself. These are the starting
            points in the most common ones.
          </p>
        </div>

        <div className={styles.editList}>
          {GUIDES.map((guide) => (
            <details key={guide.title} className={styles.editItem} open>
              <summary className={styles.editSummary}>{guide.title}</summary>
              <ol className={styles.editSteps}>
                {guide.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
