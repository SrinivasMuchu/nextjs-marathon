import React from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  Check,
  ChevronDown,
  File,
  Hexagon,
  Layers,
  Pencil,
  X,
} from 'lucide-react'
import styles from './ConvertPairPage.module.css'

function withBold(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => (
    part.startsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong> : part
  ))
}

const PAGE_LINKS = [
  ['#stl-how', 'How to convert'],
  ['#stl-what', 'What you get'],
  ['#stl-formats', 'STL vs STEP'],
  ['#stl-prepare', 'Prepare the mesh'],
  ['#stl-units', 'Units'],
  ['#stl-cad', 'Open in CAD'],
  ['#stl-trouble', 'Troubleshooting'],
  ['#step-faq-heading', 'FAQ'],
]

const HOW_STEPS = [
  ['Upload the STL', 'Drop a binary or ASCII .stl file up to 300 MB onto the converter. The triangle count appears as soon as the file is chosen.'],
  ['Set the units', 'STL has no unit field, so choose millimetres, inches or centimetres to match how the model was made.'],
  ['Convert', 'The mesh is repaired, flat areas are merged into single faces and the triangles are stitched into a closed solid.'],
  ['Open in CAD', 'Download the .step and open it in SolidWorks, Fusion, Onshape, FreeCAD or any program that reads STEP.'],
]

const CAN_DO = [
  'Measure it, section it and check clearances',
  'Cut, drill, extrude and shell it with normal CAD tools',
  'Combine it with other bodies or place it in an assembly',
  'Send it to a supplier or program that only accepts STEP',
  'Use it as an accurate reference to rebuild the part',
]

const CANNOT_DO = [
  'Restore feature history or sketches',
  'Turn faceted holes and fillets into true cylinders and arcs',
  'Let you change a dimension by editing a number',
]

const ROUTE_ROWS = [
  ['How it is made', 'Triangles stitched into a solid automatically', 'Modelled again as features, using the mesh as a reference'],
  ['Time', 'Seconds to minutes', 'Hours to days, depending on complexity'],
  ['Cost', 'First 2 downloads free, then $1.80–$2.99', 'Quoted per part by a designer'],
  ['Flat faces', { text: 'Clean single faces when merged', tone: 'yes' }, { text: 'Exact', tone: 'yes' }],
  ['Holes, fillets, curves', { text: 'Faceted', tone: 'no' }, { text: 'True cylinders and arcs', tone: 'yes' }],
  ['Edit by changing a dimension', { text: 'No', tone: 'no' }, { text: 'Yes, with full feature history', tone: 'yes' }],
  ['Best for', 'Modifying printable models, fit checks, assemblies, file-format requirements', 'CNC machining, drawings with tolerances, injection moulding, design changes'],
]

const FORMAT_ROWS = [
  ['Geometry', 'Loose triangles', 'Solid made of flat faces', 'Exact surfaces and solids'],
  ['Opens as a solid in CAD', { text: 'Usually not, or with limits', tone: 'no' }, { text: 'Yes', tone: 'yes' }, { text: 'Yes', tone: 'yes' }],
  ['Units', 'Not stored', 'Stored (the unit you choose)', 'Stored'],
  ['Curved surfaces', 'Faceted', 'Faceted', 'Smooth'],
  ['Feature history', 'No', 'No', 'No (STEP does not carry feature history)'],
  ['Typical file size', 'Compact (binary)', 'Several times larger than the STL', 'Compact'],
]

const GLANCE = [
  ['Input', 'Binary and ASCII .stl files'],
  ['Output', '.step (AP214 by default, AP242 or AP203 on request)'],
  ['Maximum upload', '300 MB'],
  ['Price', 'First 2 downloads free, any size. Then $2.99 each, or from $1.80 with credit packs'],
  ['Default settings', 'Millimetres, mesh repair on, flat faces merged, all triangles kept'],
  ['Works on', 'Any modern browser on Windows, macOS, Linux, iPad and Android'],
  ['File retention', 'Deleted automatically within 7 days, never published'],
]

const TRIANGLE_ROWS = [
  ['Under 50,000', 'Opens quickly in most CAD programs', 'Convert as is'],
  ['50,000 to 200,000', 'Usable, but slower to rotate and edit', 'Keep Merge flat faces on'],
  ['Over 200,000', 'Slow imports, and some programs may refuse the file', 'Reduce to 50% or 25% first'],
]

const PREPARE_CARDS = [
  ['Works well', 'Mechanical and printable parts', 'Brackets, enclosures, mounts and other models with large flat faces convert into compact, easy-to-edit solids.'],
  ['Works, with care', 'Organic or highly curved models', 'Figures and sculpted shapes have no flat areas to merge, so every triangle stays a face. Reduce the triangle count first.'],
  ['Consider a rebuild', '3D scans', 'Scans often hold millions of triangles plus noise and holes. For engineering use, a rebuilt model from the scan is usually the better result.'],
]

const UNIT_FIXES = [
  ['About 25× too small', 'Inches'],
  ['About 25× too large', 'Millimetres'],
  ['10× too small', 'Centimetres'],
  ['10× too large', 'Millimetres'],
]

const CAD_PROGRAMS = [
  {
    name: 'SolidWorks',
    steps: [
      'Go to **File → Open** and set the file type to STEP (*.step, *.stp).',
      'Open the file. If SolidWorks offers Import Diagnostics, run it to check the faces.',
      'Edit with Extruded Cut, Delete Face and Move Face.',
    ],
  },
  {
    name: 'Autodesk Fusion',
    steps: [
      'Go to **File → Open → Open from my computer**, or upload the file in the Data Panel.',
      'The STEP opens as solid bodies in a new design.',
      'Edit with Press Pull, Extrude cuts and Combine.',
    ],
  },
  {
    name: 'Onshape',
    steps: [
      'On the Documents page, choose **Create → Import files** and select the .step.',
      'Open the new document to find the part in its Part Studio.',
      'Edit with Move face, Delete part faces and Extrude.',
    ],
  },
  {
    name: 'Autodesk Inventor',
    steps: [
      'Go to **File → Open** and choose STEP files as the file type.',
      'Open the file as a part, then edit with direct-edit and extrude tools.',
    ],
  },
  {
    name: 'FreeCAD (convert it yourself)',
    intro: 'FreeCAD can do the same conversion on your own computer:',
    steps: [
      'Open the STL and switch to the **Part** workbench.',
      'Select the mesh and choose **Part → Create shape from mesh**.',
      'Select the new shape and choose **Part → Convert to solid**.',
      'Choose **Part → Create a copy → Refine shape** to merge flat faces.',
      'Select the refined solid and use **File → Export** to save it as STEP.',
    ],
  },
]

const HOOD_STEPS = [
  ['Read the STL', 'Binary or ASCII is detected automatically, and coordinates are scaled by the units you chose.'],
  ['Repair the mesh', 'Duplicate vertices are joined, flipped triangles are corrected and small holes are closed.'],
  ['Reduce, if asked', 'The triangle count is cut to your chosen percentage while keeping the overall shape.'],
  ['Build the solid', 'Each triangle becomes a planar face, and the faces are sewn into a closed shell and turned into a solid.'],
  ['Merge flat faces', 'Neighbouring faces on the same plane are combined, so a flat side becomes one face instead of hundreds.'],
  ['Write the STEP', 'The solid is saved in the STEP version you picked, with the units recorded in the file.'],
  ['Delete the files', 'The uploaded STL and the converted STEP are removed automatically within 7 days.'],
]

const TROUBLE = [
  {
    icon: Hexagon,
    title: 'CAD shows a surface, not a solid',
    body: 'The STL is not watertight. Holes, gaps or overlapping triangles stop it from enclosing a volume, so the converter outputs surfaces instead.',
    fix: 'Fix: convert with Repair mesh on. If it is still open, close the holes in a mesh editor and convert again.',
    link: 'Turn on mesh repair',
    href: '#cad-file-converter',
  },
  {
    icon: Pencil,
    title: 'The part is the wrong size',
    body: 'STL has no units, and the file was converted with a different unit from the one it was modelled in.',
    fix: 'Fix: convert again with the unit from the scale table.',
    link: 'See the scale table',
    href: '#stl-units',
  },
  {
    icon: File,
    title: 'The STEP is huge or CAD freezes',
    body: 'Every triangle became a face. Dense meshes produce STEP files several times larger than the STL.',
    fix: 'Fix: reduce triangles to 50% and keep Merge flat faces on.',
    link: 'Reduce to 50%',
    href: '#cad-file-converter',
  },
  {
    icon: Layers,
    title: 'Flat sides are split into hundreds of faces',
    body: 'Flat-face merging was turned off, or the flat areas are not perfectly flat in the mesh.',
    fix: 'Fix: convert with Merge flat faces on.',
    link: 'Turn on face merging',
    href: '#cad-file-converter',
  },
  {
    icon: AlertCircle,
    title: 'I can’t change a hole size or fillet',
    body: 'Converted geometry has no feature history. A faceted hole is a ring of flat faces, not a cylinder.',
    fix: 'Fix: cut the old hole out with an extrude, then add a new hole at the exact size.',
    link: 'Get the model rebuilt',
    href: '/cad-services',
  },
  {
    icon: AlertCircle,
    title: 'Conversion fails on a damaged mesh',
    body: 'Self-intersecting or non-manifold triangles that are too severe for automatic repair.',
    fix: 'Fix: run your slicer’s or mesh editor’s repair, export a new STL and convert that.',
    link: 'Inspect it in the STL viewer',
    href: '/tools/stl-file-viewer',
  },
]

const RELATED = [
  { badges: ['STL'], title: 'STL viewer', body: 'Check the mesh for holes and scale before converting', href: '/tools/stl-file-viewer' },
  { badges: ['STEP'], title: 'STEP viewer', body: 'Inspect the converted solid in your browser', href: '/tools/step-file-viewer' },
  { badges: ['STEP', 'STL'], title: 'STEP to STL', body: 'Turn CAD models into print-ready meshes', href: '/tools/convert-step-to-stl' },
  { badges: ['OBJ', 'STL'], title: 'OBJ to STL', body: 'Convert an OBJ first, then on to STEP', href: '/tools/convert-obj-to-stl' },
  { badges: ['STEP', 'OBJ'], title: 'STEP to OBJ', body: 'Mesh for rendering and visualisation', href: '/tools/convert-step-to-obj' },
  { badges: ['CAD'], title: 'Rebuild a model from STL', body: 'Fully editable features from a mesh or scan', href: '/cad-services' },
]

function Cell({ value }) {
  if (value && typeof value === 'object') {
    return <td className={value.tone === 'yes' ? styles.markYes : styles.markNo}>{value.text}</td>
  }
  return <td>{value}</td>
}

function StlToStepSections() {
  return (
    <>
      <nav className={styles.pageNav} aria-label="On this page">
        <span>On this page:</span>
        {PAGE_LINKS.map(([href, label]) => (
          <a key={href} href={href}>{label}</a>
        ))}
      </nav>

      <section className={styles.stepHow} aria-labelledby="stl-how">
        <div className={styles.workflowInner}>
          <p className={styles.eyebrow}>Step by step</p>
          <h2 id="stl-how">How to convert STL to STEP</h2>
          <p className={styles.stepHowIntro}>
            To convert STL to STEP online, upload your .stl file above, choose the units the model was designed in (usually millimetres), keep mesh repair and flat-face merging on, then click <strong>Convert STL to STEP</strong> and download the .step file. Your first 2 downloads are free. The result opens as a solid in any CAD program, made up of the same flat facets as the STL.
          </p>
          <div className={styles.stepHowGrid}>
            {HOW_STEPS.map(([title, description], index) => (
              <article key={title} className={styles.stepHowCard}>
                <span className={styles.stepHowNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <a href="#cad-file-converter" className={styles.convertButton}>Convert STL to STEP</a>
        </div>
      </section>

      <section className={styles.formatsSection} aria-labelledby="stl-what" style={{ background: '#f6f3fb' }}>
        <div className={styles.meshInner}>
          <p className={styles.eyebrow}>Set expectations</p>
          <h2 id="stl-what">What you get: a solid made of facets</h2>
          <p className={styles.carriesLead}>
            An STL only contains triangles. The exact circles, fillets and dimensions of the original design were lost when it was exported, so no converter can bring them back automatically. What STL to STEP conversion does is turn those triangles into a proper solid that CAD software can work with.
          </p>
          <div className={styles.carriesGrid}>
            <article>
              <h3 className={styles.keptTitle}>What you can do with the STEP</h3>
              <ul>
                {CAN_DO.map((item) => (
                  <li key={item}><Check size={16} aria-hidden="true" /> {item}</li>
                ))}
              </ul>
            </article>
            <article>
              <h3 className={styles.lostTitle}>What it can’t do</h3>
              <ul>
                {CANNOT_DO.map((item) => (
                  <li key={item}><X size={16} aria-hidden="true" /> {item}</li>
                ))}
              </ul>
              <p className={styles.carriesNote}>Need those? <Link href="/cad-services">A CAD designer can rebuild the model</Link> as fully editable features.</p>
            </article>
          </div>
          <div className={styles.meshExamples} role="group" aria-label="A plate with a hole at three stages">
            <article>
              <svg viewBox="0 0 220 220" aria-label="Original plate with a perfectly round hole">
                <rect x="30" y="30" width="160" height="160" rx="2" fill="#efe7fe" stroke="#6a2be0" strokeWidth="2.5" />
                <circle cx="110" cy="110" r="40" fill="#fff" stroke="#6a2be0" strokeWidth="2.5" />
              </svg>
              <h3>Original CAD design</h3>
              <p>Exact flat face and round hole</p>
            </article>
            <article>
              <svg viewBox="0 0 220 220" aria-label="The same plate as triangles, with a polygonal hole">
                <rect x="30" y="30" width="160" height="160" fill="#efe7fe" stroke="#6a2be0" strokeWidth="2.5" />
                <polygon points="150,110 147,125 138,138 125,147 110,150 95,147 82,138 73,125 70,110 73,95 82,82 95,73 110,70 125,73 138,82 147,95" fill="#fff" stroke="#6a2be0" strokeWidth="2.5" strokeLinejoin="round" />
              </svg>
              <h3>STL, or STEP without merging</h3>
              <p>Every triangle becomes its own face</p>
            </article>
            <article>
              <svg viewBox="0 0 220 220" aria-label="Plate with one merged flat face and a polygonal hole">
                <rect x="30" y="30" width="160" height="160" fill="#efe7fe" stroke="#6a2be0" strokeWidth="2.5" />
                <polygon points="150,110 147,125 138,138 125,147 110,150 95,147 82,138 73,125 70,110 73,95 82,82 95,73 110,70 125,73 138,82 147,95" fill="#fff" stroke="#6a2be0" strokeWidth="2.5" strokeLinejoin="round" />
              </svg>
              <h3>STEP with flat faces merged</h3>
              <p>One clean top face, hole stays faceted</p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.compareSection} aria-labelledby="stl-route">
        <div className={styles.meshInner}>
          <p className={styles.eyebrow}>Choose your route</p>
          <h2 id="stl-route">Converted STEP vs a rebuilt CAD model</h2>
          <p className={styles.compareLead}>
            Most people searching for STL to STEP need one of two things. Pick the one that matches what happens next to the part.
          </p>
          <div className={styles.compareTableWrap}>
            <table>
              <thead>
                <tr>
                  <th scope="col" />
                  <th scope="col">Converted STEP (this tool)</th>
                  <th scope="col">Rebuilt CAD model</th>
                </tr>
              </thead>
              <tbody>
                {ROUTE_ROWS.map(([label, converted, rebuilt]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    <Cell value={converted} />
                    <Cell value={rebuilt} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.routeChoices}>
            <article>
              <h3>Convert my STL</h3>
              <span>Use the converter when a faceted solid is enough for fit checks, assemblies or a file-format requirement.</span>
              <p><a href="#cad-file-converter">Convert my STL</a></p>
            </article>
            <article>
              <h3>Get a model rebuilt</h3>
              <span>Ask a designer when you need true holes and curves, feature history, machining or drawings.</span>
              <p><Link href="/cad-services">Get a model rebuilt</Link></p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.formatsSection} aria-labelledby="stl-formats" style={{ background: '#f6f3fb' }}>
        <div className={styles.meshInner}>
          <p className={styles.eyebrow}>The formats</p>
          <h2 id="stl-formats">STL vs STEP: what’s the difference?</h2>
          <div className={styles.formatCards}>
            <article>
              <h3>STL file (.stl)</h3>
              <p>An STL file describes the surface of a 3D object as a list of flat triangles. It was created by 3D Systems in 1987 for stereolithography and is the standard file for 3D printing.</p>
              <p>It stores no units, colours, part names or design intent, only triangle corners and the direction each one faces.</p>
            </article>
            <article>
              <h3>STEP file (.step, .stp)</h3>
              <p>A STEP file is a CAD exchange format defined by ISO 10303. It stores solid bodies as connected faces, edges and vertices, along with units and assembly structure, and every major CAD program can open it.</p>
              <p>STP is not a different format, just the shorter extension. Choose either name when you save.</p>
            </article>
          </div>
          <div className={styles.compareTableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>STL</th>
                  <th>STEP converted from STL</th>
                  <th>STEP from original CAD</th>
                </tr>
              </thead>
              <tbody>
                {FORMAT_ROWS.map(([label, stl, converted, original]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    <Cell value={stl} />
                    <Cell value={converted} />
                    <Cell value={original} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.glanceCard}>
            <h3>This converter at a glance</h3>
            <dl>
              {GLANCE.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className={`${styles.meshSettings} ${styles.bgWhite}`} aria-labelledby="stl-prepare">
        <div className={styles.meshInner}>
          <p className={styles.eyebrow}>Before you convert</p>
          <h2 id="stl-prepare">Prepare the STL for a clean STEP</h2>
          <p className={styles.meshLead}>
            The quality of the STEP depends on the mesh you start with. Two things matter most: whether the mesh is closed, and how many triangles it has.
          </p>
          <div className={styles.meshTableCard}>
            <h3>Triangle count guide</h3>
            <div className={styles.meshTableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>Triangles in the STL</th>
                    <th>What to expect in CAD</th>
                    <th>Recommended setting</th>
                  </tr>
                </thead>
                <tbody>
                  {TRIANGLE_ROWS.map(([count, expect, setting]) => (
                    <tr key={count}>
                      <th scope="row">{count}</th>
                      <td>{expect}</td>
                      <td>{setting}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className={styles.meshCaption}>The converter shows the triangle count of binary STL files as soon as you choose one.</p>
          <div className={styles.compareChoices}>
            {PREPARE_CARDS.map(([meta, title, body]) => (
              <article key={title}>
                <p>{meta}</p>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.unitsSection} aria-labelledby="stl-units">
        <div className={styles.unitsGrid}>
          <div>
            <p className={styles.eyebrow}>Units and scale</p>
            <h2 id="stl-units">Choose the right units</h2>
            <p>An STL stores coordinates such as 25.4 with no unit attached. STEP does store units, so the converter needs you to say what those numbers mean. Pick the unit the model was designed in and the STEP opens at its real size.</p>
            <p>Models from Printables, Thingiverse, MakerWorld and most slicers are in millimetres. Files from older American CAD workflows are sometimes in inches. If you are not sure, convert in millimetres, measure a known feature in CAD, and use the table to correct it.</p>
          </div>
          <div className={styles.scaleCard}>
            <h3>If the part opens at the wrong size</h3>
            <table>
              <thead>
                <tr>
                  <th>What you see in CAD</th>
                  <th>Convert again with</th>
                </tr>
              </thead>
              <tbody>
                {UNIT_FIXES.map(([seen, unit]) => (
                  <tr key={seen}>
                    <td>{seen}</td>
                    <td><strong>{unit}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={styles.desktopSection} aria-labelledby="stl-cad">
        <div className={styles.desktopGrid}>
          <div>
            <p className={styles.eyebrow}>Next steps</p>
            <h2 id="stl-cad">Open and edit the STEP in your CAD program</h2>
            <p>Every major CAD program imports STEP as solid bodies. Once it is open, edit it with direct-modelling tools that push, cut and delete faces rather than features.</p>
            <p>To change a faceted hole to a true size, cut it out with an extrude a little larger than the facets, then add a new hole feature at the exact diameter. The same trick works for bosses and slots.</p>
          </div>
          <div className={styles.desktopList}>
            {CAD_PROGRAMS.map((program, index) => (
              <details key={program.name} className={styles.desktopItem} open={index === 0}>
                <summary>
                  {program.name}
                  <ChevronDown size={18} aria-hidden="true" />
                </summary>
                {program.intro ? <p>{program.intro}</p> : null}
                <ol>
                  {program.steps.map((step) => (
                    <li key={step}>{withBold(step)}</li>
                  ))}
                </ol>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.hoodSection} ${styles.bgSoft}`} aria-labelledby="stl-hood">
        <div className={styles.printGrid}>
          <div>
            <p className={styles.eyebrow}>Under the hood</p>
            <h2 id="stl-hood">How the converter works</h2>
            <p>Every conversion runs the same steps on our servers, using the settings you choose, so you know exactly what was done to your geometry.</p>
            <p className={styles.printViewerLink}>
              <Link href="/about-us">Read about the Marathon OS engineering team</Link>
            </p>
          </div>
          <ol className={styles.printChecks}>
            {HOOD_STEPS.map(([title, body], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${styles.troubleSection} ${styles.bgWhite}`} aria-labelledby="stl-trouble">
        <div className={styles.meshInner}>
          <p className={styles.eyebrow}>Common problems</p>
          <h2 id="stl-trouble">STL to STEP troubleshooting</h2>
          <p className={styles.troubleLead}>Most problems come from an open mesh, the wrong units or too many triangles. Where a setting fixes it, the link takes you back to the converter.</p>
          <div className={styles.troubleGrid}>
            {TROUBLE.map(({ icon: Icon, title, body, fix, link, href }) => (
              <article key={title}>
                <div className={styles.troubleTitle}>
                  <span><Icon size={16} aria-hidden="true" /></span>
                  <h3>{title}</h3>
                </div>
                <p>{body}</p>
                <p className={styles.troubleFix}>{fix}</p>
                <Link href={href}>{link}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.secureSection} aria-labelledby="stl-secure">
        <div className={styles.securePanel}>
          <div>
            <p className={`${styles.eyebrow} ${styles.secureEyebrow}`}>Secure processing</p>
            <h2 id="stl-secure">Your design files stay yours</h2>
            <p>Models you convert may be your own designs or a client’s. Conversion uploads are kept separate from the public Marathon OS CAD library, and this is exactly how they are handled.</p>
          </div>
          <div className={styles.secureGrid}>
            <article>
              <h3>Encrypted transfer</h3>
              <p>Files are uploaded and downloaded over an encrypted connection.</p>
            </article>
            <article>
              <h3>Automatic deletion</h3>
              <p>Uploaded STLs and converted STEP files are deleted automatically within 7 days.</p>
            </article>
            <article>
              <h3>You keep ownership</h3>
              <p>Uploading or converting a file never transfers ownership of the design to Marathon OS.</p>
            </article>
            <article>
              <h3>Never published</h3>
              <p>Converted files are never listed in the public CAD library.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}

function StlToStepClose() {
  return (
    <>
      <section className={styles.relatedSection} aria-labelledby="stl-related">
        <div className={styles.meshInner}>
          <p className={styles.eyebrow}>Related tools</p>
          <h2 id="stl-related">More STL and STEP tools</h2>
          <p className={styles.relatedLead}>Check the mesh before converting, go the other way, or get a fully editable model.</p>
          <div className={styles.relatedGrid}>
            {RELATED.map((tool) => (
              <Link key={tool.href} href={tool.href} className={styles.relatedCard}>
                <span className={styles.relatedBadges}>
                  {tool.badges.map((badge, index) => (
                    <React.Fragment key={`${tool.href}-${badge}`}>
                      {index > 0 ? <i aria-hidden="true">→</i> : null}
                      <em>{badge}</em>
                    </React.Fragment>
                  ))}
                </span>
                <strong>{tool.title}</strong>
                <small>{tool.body}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className={`${styles.designerCta} ${styles.designerCtaSection} ${styles.bgWhite}`} aria-labelledby="stl-cta">
        <div className={`${styles.designerPanel} ${styles.designerPanelRow}`}>
          <div>
            <h2 id="stl-cta">Need a fully editable CAD model?</h2>
            <p>Conversion gives you a faceted solid. If you need true holes and curves, feature history, or a model ready for machining or drawings, a CAD designer can rebuild it from your STL or scan.</p>
          </div>
          <div>
            <Link href="/cad-services">Get a model rebuilt</Link>
            <a href="#cad-file-converter">Convert another STL file</a>
          </div>
        </div>
      </section>
    </>
  )
}

export { StlToStepSections, StlToStepClose }
