"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import CadFileConversionContent from "./CadFileConversionContent";
import useConverterPriceDisplay from "@/Components/HomePages/shared/useConverterPriceDisplay";
import { getConverterFaqQuestions, withConverterFaqPrice } from "@/data/cadToolFaqs";
import home from "@/Components/HomePages/HomeLandingNew/HomeHero.module.css";
import styles from "./StepTo3dmHero.module.css";

const OUTPUTS = [
  { id: "STEP", note: "rebuilt CAD · mm" },
  { id: "3MF", note: "one object · mm" },
  { id: "OBJ", note: "mesh for rendering" },
  { id: "IGES", note: "rebuilt CAD · IGES" },
  { id: "PLY", note: "binary mesh" },
  { id: "OFF", note: "plain-text mesh" },
  { id: "BREP", note: "rebuilt · Open CASCADE" },
  { id: "3DM", note: "Rhino mesh" },
];

const STL_ROUTES = [
  ["STEP", true],
  ["3MF", false],
  ["OBJ", false],
  ["PLY", false],
  ["OFF", false],
  ["BREP", true],
  ["3DM", false],
];

function RouteArrow() {
  return (
    <span className={styles.arr} aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </span>
  );
}

function MoreArrow() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  );
}

function FormatPair({ from, to, fromCad = false, toCad = false }) {
  return (
    <span className={styles.pair}>
      <span className={`${styles.hubBadge} ${fromCad ? styles.badgeCad : styles.badgeMesh}`}>{from}</span>
      <i>→</i>
      <span className={`${styles.hubBadge} ${toCad ? styles.badgeCad : styles.badgeMesh}`}>{to}</span>
    </span>
  );
}

function MeshPart() {
  return (
    <g>
      <g stroke="#6A2BE0" strokeOpacity="0.45" strokeWidth="0.9">
        <polygon points="196,58 190,67 190,129 196,120" fill="#D0BDFA" />
        <polygon points="190,67 173,75 173,137 190,129" fill="#D9C9FB" />
        <polygon points="173,75 148,80 148,142 173,137" fill="#E3D8FC" />
        <polygon points="148,80 118,82 118,144 148,142" fill="#EEE7FD" />
        <polygon points="118,82 88,80 88,142 118,144" fill="#F7F4FE" />
        <polygon points="88,80 63,75 63,137 88,142" fill="#FEFEFE" />
        <polygon points="63,75 46,67 46,129 63,137" fill="#FFFFFF" />
        <polygon points="46,67 40,58 40,120 46,129" fill="#FFFFFF" />
      </g>
      <polygon points="196,58 190,67 173,75 148,80 118,82 88,80 63,75 46,67 40,58 46,49 63,41 88,36 118,34 148,36 173,41 190,49" fill="#FBF9FF" stroke="#6A2BE0" strokeOpacity="0.45" strokeWidth="0.9" />
      <polygon points="142,58 135,63 118,65 101,63 94,58 101,53 118,51 135,53" fill="#4716B2" />
    </g>
  );
}

function StepViz() {
  return (
    <svg viewBox="0 0 560 200" role="img" aria-labelledby="stl-iges-viz-title">
      <title id="stl-iges-viz-title">An STL triangle mesh and the same part rebuilt as an IGES model</title>
      <defs>
        <linearGradient id="stl-iges-cyl" x1="0" x2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor="#F1EAFE" />
          <stop offset="0.8" stopColor="#C9B3F7" />
          <stop offset="1" stopColor="#E6DAFD" />
        </linearGradient>
      </defs>
      <MeshPart />
      <path d="M364 58 V120 A78 24 0 0 0 520 120 V58 Z" fill="url(#stl-iges-cyl)" />
      <ellipse cx="442" cy="58" rx="78" ry="24" fill="#FBF9FF" />
      <ellipse cx="442" cy="58" rx="24" ry="7.4" fill="#4716B2" />
      <path d="M418 58 A24 7.4 0 0 0 466 58" fill="none" stroke="#8B5CF6" strokeWidth="1.5" />
      <g transform="translate(280 92)">
        <circle r="24" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.4)" />
        <path d="M-9 0 H9 M3 -6 L9 0 L3 6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="118" y="172" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="17" fontWeight="800" fill="#fff">STL</text>
      <text x="118" y="190" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="500" fill="#E3D5FF">triangle mesh · no units</text>
      <text x="442" y="172" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="17" fontWeight="800" fill="#fff">IGES</text>
      <text x="442" y="190" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="500" fill="#E3D5FF">rebuilt from the mesh</text>
    </svg>
  );
}

function FaqBody({ item }) {
  if (item.question === "Should I send a supplier STEP or IGES?") {
    const [before, after] = item.answer.split("STL to STEP");
    return (
      <p>
        {before}
        <Link href="/tools/convert-stl-to-step">STL to STEP</Link>
        {after}
      </p>
    );
  }
  if (item.question === "Are my STL files private?") {
    const [before] = item.answer.split(" Privacy Policy.");
    return (
      <p>
        {before}{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>
    );
  }
  return <p>{item.answer}</p>;
}

export default function StlToIgesHero() {
  const router = useRouter();
  const { priceLabel } = useConverterPriceDisplay();
  const priceSentence = `First 2 files free, any size up to 300 MB. After that, ${priceLabel ? `${priceLabel} or ` : ""}1 credit per file.`;
  const faqs = withConverterFaqPrice(getConverterFaqQuestions("stl-to-iges"), priceLabel);

  return (
    <>
      <section className={home.hero} aria-labelledby="hero-title">
        <div className={`${home.wrap} ${styles.layout}`}>
          <div className={`${home.copy} ${styles.copy}`}>
            <nav aria-label="Breadcrumb">
              <ol className={styles.crumbs}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/tools">Tools</Link></li>
                <li><Link href="/tools/3d-cad-file-converter">CAD converter</Link></li>
                <li><span aria-current="page">STL to IGES</span></li>
              </ol>
            </nav>
            <h1 className={home.title} id="hero-title">
              Convert STL to IGES or IGS <span>online</span>
            </h1>
            <p className={`${home.lede} ${styles.lede}`}>
              Upload an .stl and download an IGES file for CAM software, Rhino or older CAD. Flat areas come back as single faces instead of dozens of triangles.{" "}
              <span className={styles.price}>{priceSentence}</span>
            </p>
          </div>

          <div className={`${home.card} ${styles.slot}`} id="cad-file-converter">
            <div className={home.head}>
              <h2>STL to IGES converter</h2>
              <span className={`${home.secure} ${styles.hideNarrow}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="6" cy="19" r="3" /><circle cx="18" cy="5" r="3" /><path d="M9 19h8.5a3.5 3.5 0 000-7h-11a3.5 3.5 0 010-7H15" /></svg>
                Rebuilt · IGES
              </span>
            </div>
            <div className={styles.route}>
              <div className={styles.routeCell}>
                <span className={`${styles.badge} ${styles.badgeMesh}`}>STL</span>
                <div>
                  <b>From STL</b>
                  <small>binary or ASCII</small>
                </div>
              </div>
              <span className={styles.arrow} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
              <div className={styles.routeCell}>
                <span className={`${styles.badge} ${styles.badgeCad}`}>IGES</span>
                <div className={styles.routeCopy}>
                  <label className={home.srOnly} htmlFor="stl-to-iges-output">Convert to</label>
                  <select
                    id="stl-to-iges-output"
                    className={styles.select}
                    value="IGES"
                    onChange={(event) => {
                      const next = event.target.value;
                      if (next !== "IGES") router.push(`/tools/convert-stl-to-${next.toLowerCase()}`);
                    }}
                  >
                    {OUTPUTS.map((option) => (
                      <option key={option.id} value={option.id}>{option.id}</option>
                    ))}
                  </select>
                  <small>rebuilt CAD · IGES</small>
                </div>
              </div>
            </div>
            <CadFileConversionContent convert conversionParams="stl-to-iges" designVariant="step3dmHero" />
            <p className={styles.reverse}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h13l-4-4M17 17H4l4 4" /></svg>
              <span>Have an IGES file? You can also <Link href="/tools/convert-iges-to-stl">convert IGES back to STL</Link>.</span>
            </p>
          </div>

          <div className={styles.art}>
            <ul className={`${home.ticks} ${styles.ticks}`} aria-label="Key facts">
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
                Files up to 300 MB
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>
                Flat areas merged
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 14l4-4" /><path d="M3.3 19a10 10 0 1117.4 0" /></svg>
                Units: mm, cm, m or in
              </li>
            </ul>
            <figure className={`${home.viz} ${styles.viz}`}><StepViz /></figure>
          </div>
        </div>
      </section>

      <section className={styles.glance} id="at-a-glance" aria-labelledby="glance-title">
        <div className={home.wrap}>
          <h2 id="glance-title" className={home.srOnly}>STL to IGES converter at a glance</h2>
          <dl className={styles.glanceList}>
            <div>
              <dt><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>Converts</dt>
              <dd>STL (binary or ASCII) to IGES (.igs).</dd>
            </div>
            <div>
              <dt><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v12M7 11l5 5 5-5M4 20h16" /></svg>You get</dt>
              <dd>One IGES file in millimetres, rebuilt from the mesh. Closed solids can be written as IGES B-rep solids; otherwise you get trimmed surfaces. Meshes over 1 million triangles come back as a faceted surface model.</dd>
            </div>
            <div>
              <dt><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 14l4-4" /><path d="M3.3 19a10 10 0 1117.4 0" /></svg>File size</dt>
              <dd>Up to 300 MB. We email you when the file is ready.</dd>
            </div>
            <div>
              <dt><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.6 13.4 13.4 20.6a2 2 0 01-2.8 0L3 13V3h10l7.6 7.6a2 2 0 010 2.8z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>Price</dt>
              <dd>{priceSentence}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={styles.how} id="how-to" aria-labelledby="how-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>How to convert STL to IGES</p>
            <h2 className={home.platformTitle} id="how-title">STL to IGES in <span className={home.grad}>four steps</span></h2>
          </div>
          <div className={styles.answer}>
            <p><b>To convert STL to IGES,</b> sign in, upload the .stl above, choose the units the model was made in (usually millimetres) and download the IGES file. The rebuild merges flat areas into single faces and fits cylinders and free-form surfaces where the mesh allows. Curved areas may stay faceted, and there&apos;s no feature tree. STL to IGS is the same conversion.</p>
          </div>
          <ol className={styles.steps}>
            <li>
              <span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></svg></span>
              <h3>Upload</h3>
              <p>Sign in, then drop a binary or ASCII .stl file up to 300 MB onto the converter.</p>
            </li>
            <li>
              <span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 14l4-4" /><path d="M3.3 19a10 10 0 1117.4 0" /></svg></span>
              <h3>Set units</h3>
              <p>Choose the units the model was made in: millimetres, centimetres, metres or inches.</p>
            </li>
            <li>
              <span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="3" /><circle cx="18" cy="5" r="3" /><path d="M9 19h8.5a3.5 3.5 0 000-7h-11a3.5 3.5 0 010-7H15" /></svg></span>
              <h3>Convert</h3>
              <p>Flat areas are merged into single faces, and curved areas are fitted where the mesh allows.</p>
            </li>
            <li>
              <span className={styles.stepIcon} aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v12M7 11l5 5 5-5M4 20h16" /></svg></span>
              <h3>Download</h3>
              <p>We email you when the IGES is ready. Open it and check whether it arrived as solids or surfaces.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className={styles.changes} id="what-changes" aria-labelledby="wc-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>STL vs IGES</p>
            <h2 className={home.platformTitle} id="wc-title">What changes when STL becomes IGES</h2>
            <p>STL stores triangles. IGES stores curves and surfaces.</p>
          </div>
          <div className={styles.keepLose}>
            <article className={styles.keep}>
              <h3>
                <span className={styles.mark} aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg></span>
                What the IGES keeps
              </h3>
              <ul>
                <li>The shape of the mesh, in millimetres</li>
                <li>Flat areas, as single faces</li>
                <li>Curved areas, fitted as cylinders or free-form faces where the mesh allows</li>
                <li>Every body in its position</li>
              </ul>
            </article>
            <article className={styles.lose}>
              <h3>
                <span className={styles.mark} aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg></span>
                What it leaves behind
              </h3>
              <ul>
                <li>Feature history, sketches and constraints, which an STL never had</li>
                <li>The exact curves of the original design: the rebuild can only follow the triangles</li>
                <li>Curved detail on rough or very large meshes, which stays faceted</li>
              </ul>
            </article>
          </div>
          <p className={styles.honest}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.5" /></svg>
            <span>Need exact, editable geometry? <Link href="/cad-services">Hire a CAD designer</Link> to model the part from the mesh.</span>
          </p>
        </div>
      </section>

      <section className={styles.meshNote} id="rebuild" aria-labelledby="rs-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>What the rebuild does</p>
            <h2 className={home.platformTitle} id="rs-title">From triangles to faces</h2>
            <p>A plain conversion turns every triangle into a face. Ours merges flat areas and fits curves where the mesh allows.</p>
          </div>
          <div className={styles.choose}>
            <div>
              <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeMesh}`}>STL</span><b>Flat areas</b></span>
              <p>Neighbouring triangles on one flat area become a single face, so a flat side comes back as one face, not dozens of triangles.</p>
            </div>
            <div>
              <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeCad}`}>IGES</span><b>Curved areas</b></span>
              <p>Cylinders and free-form surfaces are fitted where the mesh is clean enough. Elsewhere, curved areas stay faceted.</p>
            </div>
            <div>
              <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeCad}`}>IGES</span><b>Solids or surfaces</b></span>
              <p>When the rebuild gives a closed solid that passes our read-back check, it&apos;s written in IGES B-rep mode (type 186). Otherwise you get trimmed surfaces (type 144) to knit in your CAD program.</p>
            </div>
          </div>
          <p className={styles.unitNote}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.5" /></svg>
            <span>There&apos;s no feature tree: you edit the geometry directly. After download, look at a hole: a fitted hole is one cylindrical face; a faceted one is many strips.</span>
          </p>
        </div>
      </section>

      <section className={styles.compareBand} id="compare" aria-labelledby="fmt-title">
        <div className={home.wrap}>
          <div className={home.sh}>
            <p className={home.eyebrow}>Choose the right format</p>
            <h2 className={home.platformTitle} id="fmt-title">STL vs IGES vs STEP</h2>
            <p>Pick by what the next program needs.</p>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.formatTable}>
              <caption className={home.srOnly}>STL, IGES, STEP compared</caption>
              <thead>
                <tr>
                  <th scope="col" />
                  <th scope="col"><span className={`${styles.badge} ${styles.badgeMesh}`}>STL</span></th>
                  <th scope="col" className={styles.hl}><span className={`${styles.badge} ${styles.badgeCad}`}>IGES</span></th>
                  <th scope="col"><span className={`${styles.badge} ${styles.badgeCad}`}>STEP</span></th>
                </tr>
              </thead>
              <tbody>
                <tr><th scope="row">Geometry</th><td>Triangles only</td><td className={styles.hl}>Curves and surfaces; solids in B-rep mode</td><td>Solids and surfaces</td></tr>
                <tr><th scope="row">Units</th><td>Not stored</td><td className={styles.hl}>Stored (ours is mm)</td><td>Stored (ours is mm)</td></tr>
                <tr><th scope="row">Standard</th><td>No formal standard</td><td className={styles.hl}>IGES 5.3, last updated in 1996</td><td>ISO 10303, still developed</td></tr>
                <tr><th scope="row">Best for</th><td>3D printing</td><td className={styles.hl}>CAM and older CAD</td><td>Modern CAD exchange and suppliers</td></tr>
              </tbody>
            </table>
          </div>
          <div className={styles.choose}>
            <div>
              <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeCad}`}>IGES</span><b>Convert to IGES when</b></span>
              <p>A CAM program, older CAD system or supplier asks for IGES or IGS.</p>
              <span className={styles.more}>You&apos;re in the right place</span>
            </div>
            <Link href="/tools/convert-stl-to-step" aria-label="STL to STEP for CAD">
              <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeCad}`}>STEP</span><b>Choose STEP when</b></span>
              <p>The receiver accepts STEP: it&apos;s the current standard, and the rebuild is the same.</p>
              <span className={styles.more}>STL to STEP for CAD <MoreArrow /></span>
            </Link>
            <Link href="/tools/convert-stl-to-brep" aria-label="STL to BREP for OCCT tools">
              <span className={styles.chooseTop}><span className={`${styles.badge} ${styles.badgeCad}`}>BREP</span><b>Choose BREP when</b></span>
              <p>The model is going into FreeCAD, CadQuery or gmsh.</p>
              <span className={styles.more}>STL to BREP for OCCT tools <MoreArrow /></span>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.openBand} id="open-in" aria-labelledby="open-title">
        <div className={home.wrap}>
          <div className={styles.splitHead}>
            <div>
              <p className={home.eyebrow}>Open it anywhere</p>
              <h2 className={home.platformTitle} id="open-title">Where IGES files open</h2>
            </div>
            <p>Most CAD and CAM programs import IGES.</p>
          </div>
          <div className={styles.apps}>
            <div><b>SolidWorks</b><span className={styles.yes}>Imports IGES</span></div>
            <div><b>Fusion</b><span className={styles.yes}>Imports IGES</span></div>
            <div><b>Rhino</b><span className={styles.yes}>Imports IGES</span></div>
            <div><b>Mastercam</b><span className={styles.yes}>Imports IGES</span></div>
            <div><b>CATIA</b><span className={styles.yes}>Imports IGES</span></div>
            <div><b>FreeCAD</b><span className={styles.yes}>Imports IGES</span></div>
          </div>
          <p className={styles.unitNote}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.5" /></svg>
            <span>If a program asks how to import IGES, choose the option that keeps solids or knits surfaces into solids.</span>
          </p>
        </div>
      </section>

      <section className={styles.relatedBand} id="related" aria-labelledby="rel-title">
        <div className={home.wrap}>
          <div className={styles.splitHead}>
            <div>
              <p className={home.eyebrow}>Related conversions</p>
              <h2 className={home.platformTitle} id="rel-title">More STL and IGES tools</h2>
            </div>
            <Link className={styles.more} href="/tools/3d-cad-file-converter">
              All 74 conversion routes
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
          <p className={styles.reverseNote}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h13l-4-4M17 17H4l4 4" /></svg>
            <span>Going the other way? You can also <Link href="/tools/convert-iges-to-stl">convert IGES back to STL</Link>. It meshes the exact IGES geometry at a 1.0 mm chord tolerance.</span>
          </p>
          <div className={styles.hub}>
            <div className={styles.hubCard}>
              <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></svg>
                Convert STL to…
              </h3>
              <div className={styles.hubLinks}>
                {STL_ROUTES.map(([to, toCad]) => (
                  <Link key={to} href={`/tools/convert-stl-to-${to.toLowerCase()}`} aria-label={`STL to ${to}`}>
                    <FormatPair from="STL" to={to} toCad={toCad} />
                    <RouteArrow />
                  </Link>
                ))}
              </div>
            </div>
            <div className={styles.hubCard}>
              <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></svg>
                Also converting to IGES?
              </h3>
              <div className={`${styles.hubLinks} ${styles.hubStack}`}>
                <Link href="/tools/convert-obj-to-iges">
                  <FormatPair from="OBJ" to="IGES" toCad />
                  <span className={styles.sib}>OBJ meshes to IGES</span>
                  <RouteArrow />
                </Link>
                <Link href="/tools/convert-ply-to-iges">
                  <FormatPair from="PLY" to="IGES" toCad />
                  <span className={styles.sib}>PLY scans to IGES</span>
                  <RouteArrow />
                </Link>
                <Link href="/tools/3d-cad-file-converter">
                  <b className={styles.allRoutes}>All routes</b>
                  <RouteArrow />
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.hubTools}>
            <Link href="/tools/stl-file-viewer">
              <span className={styles.toolIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg></span>
              Free STL viewer
            </Link>
            <Link href="/tools/iges-file-viewer">
              <span className={styles.toolIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg></span>
              Free IGES viewer
            </Link>
            <Link href="/tools/3d-cad-viewer">
              <span className={styles.toolIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></svg></span>
              3D CAD viewer
            </Link>
            <Link href="/cad-services">
              <span className={styles.toolIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" /></svg></span>
              Hire a CAD designer
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.faqBand} id="faq" aria-labelledby="faq-title">
        <div className={`${home.wrap} ${styles.faqGrid}`}>
          <div className={styles.faqSide}>
            <p className={home.eyebrow}>FAQ</p>
            <h2 className={home.platformTitle} id="faq-title">STL to IGES questions</h2>
            <p>The rebuild, units, solids or surfaces, pricing and your files.</p>
            <Link className={styles.ghostBtn} href="/contact-us">Contact us</Link>
            <small className={styles.faqUpdated}>Last updated 13 November 2026</small>
          </div>
          <div className={styles.faqList}>
            {faqs.map((item, index) => (
              <details key={item.question} className={styles.acc} open={index === 0}>
                <summary>{item.question}</summary>
                <div className={styles.accBody}><FaqBody item={item} /></div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.closeBand} aria-labelledby="cta-title">
        <div className={home.wrap}>
          <div className={styles.cta}>
            <h2 id="cta-title">Convert your STL file to IGES</h2>
            <p>An IGES rebuilt from your mesh, in millimetres, for CAM and older CAD. {priceSentence}</p>
            <div className={styles.ctaBtns}>
              <a className={styles.ctaLight} href="#cad-file-converter">Convert STL to IGES</a>
              <Link className={styles.ctaOutline} href="/tools/3d-cad-file-converter">See all converters</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
