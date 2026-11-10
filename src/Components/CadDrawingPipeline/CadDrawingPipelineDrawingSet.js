import styles from "./CadDrawingPipeline.module.css";

const FEATURES = [
  {
    title: "Orthographic views",
    body: "Front, top and side views aligned to each other in the projection you choose, with visible and hidden edges.",
  },
  {
    title: "Isometric view",
    body: "A 3D reference view so anyone reading the sheet can picture the part at a glance.",
  },
  {
    title: "Dimensions",
    body: "Overall length, width and height, plus hole diameters and the main feature sizes, in millimetres.",
  },
  {
    title: "Section views",
    body: "Cuts through internal features such as holes, pockets and bores, hatched in the standard way.",
  },
  {
    title: "Title block",
    body: "Part name, scale, units and projection, ready for your drawing number.",
  },
  {
    title: "Five file formats",
    body: "PDF, DXF and SVG for sharing and CAD, plus a FreeCAD file you can keep editing.",
  },
];

function ExampleSheet() {
  return (
    <svg className={styles.setSheetSvg} viewBox="0 0 1000 640" role="img" aria-label="Example drawing of a block with a through hole">
      <defs>
        <pattern id="setSheetHatch" patternUnits="userSpaceOnUse" width="8" height="8">
          <path d="M-1 9 L9 -1" stroke="#9aa3b8" strokeWidth="1" />
        </pattern>
        <marker id="setDimArrow" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 Z" fill="#5b46e0" />
        </marker>
      </defs>

      <rect x="8" y="8" width="984" height="624" fill="#fff" stroke="#d9d3e6" strokeWidth="1.5" />

      <g stroke="#241f33" strokeWidth="1.6" fill="none">
        <rect x="150" y="58" width="280" height="108" />
        <circle cx="290" cy="112" r="20" />
        <line x1="150" y1="112" x2="430" y2="112" stroke="#8b93a7" strokeDasharray="10 4 2 4" />
        <line x1="290" y1="58" x2="290" y2="166" stroke="#8b93a7" strokeDasharray="10 4 2 4" />
      </g>
      <text x="128" y="116" fill="#241f33" fontSize="13" fontFamily="Inter, sans-serif">A</text>
      <text x="438" y="116" fill="#241f33" fontSize="13" fontFamily="Inter, sans-serif">A</text>
      <line x1="318" y1="96" x2="372" y2="52" stroke="#5b46e0" strokeWidth="1.2" />
      <text x="376" y="50" fill="#5b46e0" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif">Ø30 THRU</text>

      <g stroke="#5b46e0" strokeWidth="1.2" fill="none">
        <line x1="118" y1="58" x2="118" y2="166" markerStart="url(#setDimArrow)" markerEnd="url(#setDimArrow)" />
        <line x1="128" y1="58" x2="108" y2="58" />
        <line x1="128" y1="166" x2="108" y2="166" />
      </g>
      <text x="104" y="118" fill="#5b46e0" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif" textAnchor="middle" transform="rotate(-90 104 118)">80</text>

      <g stroke="#241f33" strokeWidth="1.6" fill="none">
        <rect x="150" y="230" width="280" height="86" />
        <line x1="270" y1="230" x2="270" y2="316" strokeDasharray="5 4" />
        <line x1="310" y1="230" x2="310" y2="316" strokeDasharray="5 4" />
      </g>
      <g stroke="#5b46e0" strokeWidth="1.2" fill="none">
        <line x1="118" y1="230" x2="118" y2="316" markerStart="url(#setDimArrow)" markerEnd="url(#setDimArrow)" />
        <line x1="128" y1="230" x2="108" y2="230" />
        <line x1="128" y1="316" x2="108" y2="316" />
        <line x1="150" y1="348" x2="430" y2="348" markerStart="url(#setDimArrow)" markerEnd="url(#setDimArrow)" />
        <line x1="150" y1="316" x2="150" y2="358" />
        <line x1="430" y1="316" x2="430" y2="358" />
      </g>
      <text x="104" y="280" fill="#5b46e0" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif" textAnchor="middle" transform="rotate(-90 104 280)">60</text>
      <text x="290" y="342" fill="#5b46e0" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif" textAnchor="middle">160</text>

      <g stroke="#241f33" strokeWidth="1.6" fill="none">
        <rect x="500" y="230" width="110" height="86" />
        <line x1="548" y1="230" x2="548" y2="316" strokeDasharray="5 4" />
        <line x1="562" y1="230" x2="562" y2="316" strokeDasharray="5 4" />
      </g>
      <g stroke="#5b46e0" strokeWidth="1.2" fill="none">
        <line x1="500" y1="348" x2="610" y2="348" markerStart="url(#setDimArrow)" markerEnd="url(#setDimArrow)" />
        <line x1="500" y1="316" x2="500" y2="358" />
        <line x1="610" y1="316" x2="610" y2="358" />
      </g>
      <text x="555" y="342" fill="#5b46e0" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif" textAnchor="middle">80</text>

      <g transform="translate(690,48)">
        <polygon points="20,46 130,8 230,46 120,84" fill="#ece7fb" stroke="#241f33" strokeWidth="1.6" />
        <polygon points="20,46 120,84 120,168 20,130" fill="#f8f6fd" stroke="#241f33" strokeWidth="1.6" />
        <polygon points="120,84 230,46 230,130 120,168" fill="#ddd6f4" stroke="#241f33" strokeWidth="1.6" />
        <ellipse cx="120" cy="46" rx="18" ry="9" fill="#f4f1fb" stroke="#6a5acd" strokeWidth="1.4" />
      </g>
      <text x="808" y="250" fill="#241f33" fontSize="13" fontWeight="700" letterSpacing="0.08em" fontFamily="Inter, sans-serif" textAnchor="middle">ISOMETRIC VIEW</text>

      <g transform="translate(690,286)">
        <rect width="200" height="78" fill="url(#setSheetHatch)" stroke="#241f33" strokeWidth="1.6" />
        <line x1="100" y1="0" x2="100" y2="78" stroke="#241f33" strokeWidth="1.6" />
      </g>
      <text x="790" y="392" fill="#241f33" fontSize="13" fontWeight="700" letterSpacing="0.08em" fontFamily="Inter, sans-serif" textAnchor="middle">SECTION A-A</text>

      <g transform="translate(560,470)" fontFamily="Inter, sans-serif">
        <rect width="400" height="130" fill="#fff" stroke="#241f33" strokeWidth="1.4" />
        <line x1="0" y1="46" x2="400" y2="46" stroke="#241f33" />
        <line x1="0" y1="88" x2="400" y2="88" stroke="#241f33" />
        <line x1="200" y1="46" x2="200" y2="130" stroke="#241f33" />
        <text x="12" y="16" fill="#8a8498" fontSize="10" letterSpacing="0.06em">PART</text>
        <text x="12" y="36" fill="#241f33" fontSize="15" fontWeight="700">sample-block.step</text>
        <text x="12" y="62" fill="#8a8498" fontSize="10" letterSpacing="0.04em">SCALE / UNITS</text>
        <text x="12" y="80" fill="#241f33" fontSize="14" fontWeight="700">1:1 / mm</text>
        <text x="212" y="62" fill="#8a8498" fontSize="10" letterSpacing="0.04em">PROJECTION</text>
        <text x="212" y="80" fill="#241f33" fontSize="14" fontWeight="700">Third angle</text>
        <text x="12" y="104" fill="#8a8498" fontSize="10" letterSpacing="0.04em">SHEET</text>
        <text x="12" y="122" fill="#241f33" fontSize="14" fontWeight="700">A0 landscape</text>
        <text x="212" y="104" fill="#8a8498" fontSize="10" letterSpacing="0.04em">GENERATED BY</text>
        <text x="212" y="122" fill="#241f33" fontSize="14" fontWeight="700">Marathon OS</text>
      </g>
    </svg>
  );
}

export default function CadDrawingPipelineDrawingSet() {
  return (
    <section className={styles.setBand} aria-labelledby="cad-pipeline-set-title">
      <div className={styles.setInner}>
        <p className={styles.pricingEyebrow}>What you get</p>
        <h2 id="cad-pipeline-set-title" className={styles.setTitle}>
          What&apos;s in a drawing set
        </h2>
        <p className={styles.setLede}>
          Each set is a complete sheet laid out the way a drafter would start one, generated from
          your STEP geometry.
        </p>

        <figure className={styles.setSheet}>
          <ExampleSheet />
          <figcaption>Example sheet: a block with a through hole in third-angle projection on A0.</figcaption>
        </figure>

        <ul className={styles.setGrid}>
          {FEATURES.map((item) => (
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
