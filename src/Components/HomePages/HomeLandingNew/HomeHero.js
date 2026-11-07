"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { contextState } from "@/Components/CommonJsx/ContextProvider";
import { markHomeUploadTarget } from "./useConsumeHomeFile";
import useConverterPriceDisplay from "../shared/useConverterPriceDisplay";
import { getSinglePriceLabelFromInfo } from "@/lib/converterPricing";
import useTechDrawPriceDisplay from "@/Components/CadDrawingPipeline/useTechDrawPriceDisplay";
import HomePricing from "./HomePricing";
import HomeFaq from "./HomeFaq";
import styles from "./HomeHero.module.css";

const FAM = {
  STEP: "cad", IGES: "cad", BREP: "cad", "3DM": "cad",
  STL: "mesh", "3MF": "mesh", OBJ: "mesh", PLY: "mesh", OFF: "mesh",
  DXF: "2d", DWG: "2d",
};

const EXT = {
  step: "STEP", stp: "STEP", iges: "IGES", igs: "IGES", brep: "BREP", brp: "BREP",
  "3dm": "3DM", stl: "STL", "3mf": "3MF", obj: "OBJ", ply: "PLY", off: "OFF",
  dxf: "DXF", dwg: "DWG",
};

const DEFAULT_TO = {
  STEP: "STL", IGES: "STEP", BREP: "STEP", "3DM": "STEP",
  STL: "STEP", "3MF": "STEP", OBJ: "STL", PLY: "STL", OFF: "STL",
  DXF: "DWG", DWG: "DXF",
};

const VIEWERS = ["STEP", "STL", "IGES", "OBJ", "3DM", "PLY", "BREP", "OFF", "DXF", "DWG"];

const GROUPS = [
  { label: "CAD solids and surfaces", values: ["STEP", "IGES", "BREP", "3DM"] },
  { label: "Meshes", values: ["STL", "3MF", "OBJ", "PLY", "OFF"] },
  { label: "2D drawings", values: ["DXF", "DWG"] },
];

const VIEW_GROUPS = [
  { label: "CAD solids and surfaces", values: ["STEP", "IGES", "BREP", "3DM"] },
  { label: "Meshes", values: ["STL", "OBJ", "PLY", "OFF"] },
  { label: "2D drawings", values: ["DXF", "DWG"] },
];

const KINDS = {
  exact: ["CAD → CAD", "Exact curves and solids carry across. Holes stay round."],
  tess: ["CAD → Mesh", "Curves become flat facets. STL also drops units."],
  solid: ["Mesh → CAD", "Opens and cuts in CAD, but curves stay faceted."],
  mesh: ["Mesh → Mesh", "Triangles carry across. Colour depends on the target."],
  d2: ["2D → 2D", "Layers, blocks and text carry across."],
};

const BEST = {
  STEP: "SolidWorks, Fusion, Onshape, CATIA",
  IGES: "legacy CAD and CAM",
  BREP: "FreeCAD and Open CASCADE",
  "3DM": "Rhino and Grasshopper",
  STL: "every 3D printing slicer",
  "3MF": "Bambu Studio, PrusaSlicer, Cura",
  OBJ: "Blender, renderers, game engines",
  PLY: "scan and colour mesh tools",
  OFF: "geometry research code",
  DXF: "laser, CNC and CAM",
  DWG: "AutoCAD",
};

const FINE = {
  view: "Free · works in any modern browser",
  bom: "STEP and STP assemblies",
};

const TOOL_GROUPS = [
  {
    title: "CAD",
    icon: "cad",
    formats: [
      { label: "STEP", kind: "fmtCad" },
      { label: "IGES", kind: "fmtCad" },
      { label: "BREP", kind: "fmtCad" },
    ],
    tools: ["SolidWorks", "Fusion", "Onshape", "CATIA", "Creo", "FreeCAD"],
  },
  {
    title: "Drafting and design",
    icon: "draft",
    formats: [
      { label: "DWG", kind: "fmt2d" },
      { label: "DXF", kind: "fmt2d" },
      { label: "3DM", kind: "fmtCad" },
      { label: "OBJ", kind: "fmtMesh" },
    ],
    tools: ["AutoCAD", "Rhino", "Blender"],
  },
  {
    title: "3D printing",
    icon: "print",
    formats: [
      { label: "STL", kind: "fmtMesh" },
      { label: "3MF", kind: "fmtMesh" },
    ],
    tools: ["PrusaSlicer", "Bambu Studio", "Cura"],
  },
];

const JOBS = [
  {
    id: "print",
    label: "3D printing",
    icon: "print",
    routes: [
      { href: "/tools/convert-step-to-stl", from: "STEP", to: "STL", kind: "tess", kindLabel: "CAD → Mesh" },
      { href: "/tools/convert-step-to-3mf", from: "STEP", to: "3MF", kind: "tess", kindLabel: "CAD → Mesh" },
      { href: "/tools/convert-obj-to-stl", from: "OBJ", to: "STL", kind: "mesh", kindLabel: "Mesh → Mesh" },
      { href: "/tools/convert-3dm-to-stl", from: "3DM", to: "STL", kind: "tess", kindLabel: "CAD → Mesh" },
    ],
    tip: "STL has no units. Use 3MF to avoid scale mistakes.",
  },
  {
    id: "edit",
    label: "Editing a mesh",
    icon: "mesh",
    routes: [
      { href: "/tools/convert-stl-to-step", from: "STL", to: "STEP", kind: "solid", kindLabel: "Mesh → CAD" },
      { href: "/tools/convert-obj-to-step", from: "OBJ", to: "STEP", kind: "solid", kindLabel: "Mesh → CAD" },
      { href: "/tools/convert-ply-to-step", from: "PLY", to: "STEP", kind: "solid", kindLabel: "Mesh → CAD" },
      { href: "/tools/convert-stl-to-iges", from: "STL", to: "IGES", kind: "solid", kindLabel: "Mesh → CAD" },
    ],
    tip: <>You get a faceted solid. Need true features? <Link href="/cad-services">Hire a designer</Link>.</>,
  },
  {
    id: "supplier",
    label: "Supplier handoff",
    icon: "supplier",
    routes: [
      { href: "/tools/convert-step-to-iges", from: "STEP", to: "IGES", kind: "exact", kindLabel: "CAD → CAD" },
      { href: "/tools/convert-iges-to-step", from: "IGES", to: "STEP", kind: "exact", kindLabel: "CAD → CAD" },
      { href: "/tools/convert-step-to-2d-drawing", from: "STEP", to: "2D", kind: "exact", kindLabel: "2D drawing set" },
      { href: "/tools/step-bom-extractor", from: "STEP", to: "BOM", kind: "exact", kindLabel: "Bill of materials" },
    ],
    tip: "Shops quote from a STEP file plus a dimensioned PDF.",
  },
  {
    id: "cnc",
    label: "Laser and CNC",
    icon: "cnc",
    routes: [
      { href: "/tools/convert-dwg-to-dxf", from: "DWG", to: "DXF", kind: "d2", kindLabel: "2D → 2D" },
      { href: "/tools/convert-dxf-to-dwg", from: "DXF", to: "DWG", kind: "d2", kindLabel: "2D → 2D" },
      { href: "/tools/dwg-file-viewer", title: "DWG viewer", kind: "d2", kindLabel: "Free viewer" },
      { href: "/tools/dxf-file-viewer", title: "DXF viewer", kind: "d2", kindLabel: "Free viewer" },
    ],
    tip: "Laser and CNC software reads DXF far more widely than DWG.",
  },
  {
    id: "rhino",
    label: "Rhino",
    icon: "draft",
    routes: [
      { href: "/tools/convert-3dm-to-step", from: "3DM", to: "STEP", kind: "exact", kindLabel: "CAD → CAD" },
      { href: "/tools/convert-step-to-3dm", from: "STEP", to: "3DM", kind: "exact", kindLabel: "CAD → CAD" },
      { href: "/tools/convert-iges-to-3dm", from: "IGES", to: "3DM", kind: "exact", kindLabel: "CAD → CAD" },
      { href: "/tools/convert-3dm-to-stl", from: "3DM", to: "STL", kind: "tess", kindLabel: "CAD → Mesh" },
    ],
    tip: "STEP keeps NURBS exact between Rhino and SolidWorks.",
  },
  {
    id: "render",
    label: "Rendering",
    icon: "render",
    routes: [
      { href: "/tools/convert-step-to-obj", from: "STEP", to: "OBJ", kind: "tess", kindLabel: "CAD → Mesh" },
      { href: "/tools/convert-stl-to-obj", from: "STL", to: "OBJ", kind: "mesh", kindLabel: "Mesh → Mesh" },
      { href: "/tools/convert-3dm-to-obj", from: "3DM", to: "OBJ", kind: "tess", kindLabel: "CAD → Mesh" },
      { href: "/tools/convert-step-to-ply", from: "STEP", to: "PLY", kind: "tess", kindLabel: "CAD → Mesh" },
    ],
    tip: "OBJ is the most widely supported mesh in render tools.",
  },
];

const MATRIX = [
  { id: "STEP", group: "CAD" },
  { id: "IGES", group: "CAD" },
  { id: "BREP", group: "CAD" },
  { id: "3DM", group: "CAD", end: true },
  { id: "STL", group: "Mesh", start: true },
  { id: "3MF", group: "Mesh" },
  { id: "OBJ", group: "Mesh" },
  { id: "PLY", group: "Mesh" },
  { id: "OFF", group: "Mesh", end: true },
  { id: "DXF", group: "2D", start: true },
  { id: "DWG", group: "2D" },
];

const POPULAR = [
  ["STEP", "STL"],
  ["STL", "STEP"],
  ["IGES", "STEP"],
  ["STEP", "IGES"],
  ["STEP", "3MF"],
  ["OBJ", "STL"],
  ["OBJ", "STEP"],
  ["STL", "OBJ"],
  ["3DM", "STEP"],
  ["STEP", "3DM"],
  ["DWG", "DXF"],
  ["DXF", "DWG"],
];

const BADGE = { cad: "badgeCad", mesh: "badgeMesh", "2d": "badge2d" };

const HOW_STEPS = [
  { title: "Upload", body: "Any of 11 formats, up to 300 MB.", icon: "up" },
  { title: "Pick the output", body: "Convert, view, extract a BOM or draw.", icon: "flow" },
  { title: "Download", body: "Your first 2 files are free.", icon: "down" },
];

const COMPARE = [
  { label: "Engineering formats only", us: "y", generic: "n", desktop: "y" },
  { label: "Shows what a conversion changes", us: "y", generic: "n", desktop: "m" },
  { label: "74 conversion routes", us: "y", generic: "m", genericNote: "varies", desktop: "m", desktopNote: "add-ins" },
  { label: "Files up to 300 MB", us: "y", generic: "m", genericNote: "often less", desktop: "y" },
  { label: "BOM from a STEP assembly", us: "y", generic: "n", desktop: "m", desktopNote: "add-ins" },
  { label: "2D drawings from STEP", us: "y", usPrice: true, generic: "n", desktop: "m", desktopNote: "manual" },
  { label: "Nothing to install", us: "y", generic: "y", desktop: "n" },
  { label: "No subscription", us: "y", generic: "m", genericNote: "ads or limits", desktop: "n" },
  { label: "Human CAD designers on call", us: "y", generic: "n", desktop: "n" },
];

const VIEWER_CARDS = [
  { id: "STEP", kind: "badgeCad" },
  { id: "STL", kind: "badgeMesh" },
  { id: "IGES", kind: "badgeCad" },
  { id: "OBJ", kind: "badgeMesh" },
  { id: "3DM", kind: "badgeCad" },
  { id: "PLY", kind: "badgeMesh" },
  { id: "BREP", kind: "badgeCad" },
  { id: "OFF", kind: "badgeMesh" },
  { id: "DXF", kind: "badge2d" },
  { id: "DWG", kind: "badge2d" },
];

const BOM_ROWS = [
  { n: 1, name: "Gearbox_Assembly", level: 0, qty: 1, depth: 0, asm: true },
  { n: 2, name: "Housing_Main", level: 1, qty: 1, depth: 1 },
  { n: 3, name: "Cover_Plate", level: 1, qty: 1, depth: 1 },
  { n: 4, name: "Input_Shaft_Sub", level: 1, qty: 1, depth: 1, asm: true },
  { n: 5, name: "Gear_Spur_Z24", level: 2, qty: 2, depth: 2 },
  { n: 6, name: "Bearing_6204", level: 2, qty: 4, depth: 2 },
  { n: 7, name: "Screw_M6x20_ISO4762", level: 1, qty: 12, depth: 1 },
];

const MAX_BYTES = 300 * 1024 * 1024;
const DRAW_MAX_BYTES = 100 * 1024 * 1024;

const TABS = [
  { id: "convert", label: "Convert" },
  { id: "view", label: "View" },
  { id: "bom", label: "BOM" },
  { id: "draw", label: "2D drawing" },
];

function routeOk(from, to) {
  if (from === to) return false;
  const a = FAM[from];
  const b = FAM[to];
  if (a === "2d" || b === "2d") return a === b;
  return true;
}

function kindOf(from, to) {
  const a = FAM[from];
  const b = FAM[to];
  if (a === "2d") return "d2";
  if (a === "cad" && b === "cad") return "exact";
  if (a === "cad") return "tess";
  if (b === "cad") return "solid";
  return "mesh";
}

function extensionOf(file) {
  return (file.name.split(".").pop() || "").toLowerCase();
}

function formatOf(file) {
  return EXT[extensionOf(file)] || "";
}

function formatSize(bytes) {
  if (bytes < 1048576) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12l5 5L20 6" />
    </svg>
  );
}

function FormatOptions({ groups, from, disableInvalid }) {
  return groups.map((group) => (
    <optgroup key={group.label} label={group.label}>
      {group.values.map((value) => (
        <option key={value} value={value} disabled={disableInvalid ? !routeOk(from, value) : false}>
          {value}
        </option>
      ))}
    </optgroup>
  ));
}

function destinationFor({ mode, from, to, viewFmt }) {
  if (mode === "view") return `/tools/${viewFmt.toLowerCase()}-file-viewer`;
  if (mode === "bom") return "/tools/step-bom-extractor";
  if (mode === "draw") return "/tools/convert-step-to-2d-drawing";
  return `/tools/convert-${from.toLowerCase()}-to-${to.toLowerCase()}`;
}

function HomeHero({ initialDrawingPrices, initialConverterInfo }) {
  const router = useRouter();
  const { setFile } = useContext(contextState);
  const inputRef = useRef(null);
  const [mode, setMode] = useState("convert");
  const [from, setFrom] = useState("STEP");
  const [to, setTo] = useState("STL");
  const [viewFmt, setViewFmt] = useState("STEP");
  const [picked, setPicked] = useState(null);
  const [fileNote, setFileNote] = useState(null);
  const [over, setOver] = useState(false);
  const [jobId, setJobId] = useState("print");
  const { priceLabel } = useConverterPriceDisplay();
  const singlePrice = priceLabel || getSinglePriceLabelFromInfo(initialConverterInfo);
  const { totalLabel } = useTechDrawPriceDisplay(initialDrawingPrices);

  const insight = useMemo(() => {
    const key = kindOf(from, to);
    return { key, label: KINDS[key][0], body: KINDS[key][1], best: BEST[to] || "" };
  }, [from, to]);

  function applyFrom(nextFrom, nextTo) {
    const resolvedTo = routeOk(nextFrom, nextTo) ? nextTo : DEFAULT_TO[nextFrom];
    setFrom(nextFrom);
    setTo(resolvedTo);
  }

  function planForFile(file) {
    const detected = formatOf(file);
    if (!detected) return { error: "Unsupported file type" };
    if (file.size > MAX_BYTES) return { error: "Over the 300 MB limit" };

    let nextMode = mode;
    const nextFrom = detected;
    const nextTo = routeOk(detected, to) ? to : DEFAULT_TO[detected];
    let nextView = viewFmt;

    if ((mode === "bom" || mode === "draw") && detected !== "STEP") nextMode = "convert";
    if (mode === "view") {
      if (VIEWERS.includes(detected)) nextView = detected;
      else nextMode = "convert";
    } else if (VIEWERS.includes(detected)) {
      nextView = detected;
    }

    if (nextMode === "draw" && file.size > DRAW_MAX_BYTES) {
      return { error: "Over the 100 MB drawing limit", nextMode, nextFrom, nextTo, nextView };
    }

    return {
      href: destinationFor({ mode: nextMode, from: nextFrom, to: nextTo, viewFmt: nextView }),
      nextMode,
      nextFrom,
      nextTo,
      nextView,
    };
  }

  function sendFile(file, href) {
    markHomeUploadTarget(href);
    flushSync(() => setFile(file));
    router.push(href);
  }

  function acceptFile(file) {
    if (!file) return;
    const plan = planForFile(file);
    setPicked(file);
    if (plan.error) {
      setFileNote({ ok: false, text: plan.error });
      return;
    }
    setFileNote({ ok: true, text: `${formatOf(file)} detected` });
    setFrom(plan.nextFrom);
    setTo(plan.nextTo);
    setViewFmt(plan.nextView);
    setMode(plan.nextMode);
  }

  function openTool() {
    if (picked && fileNote?.ok) {
      const plan = planForFile(picked);
      if (plan.href) {
        if (plan.nextMode === "view") {
          flushSync(() => setFile(picked));
          router.push("/tools/cad-uploading");
          return;
        }
        sendFile(picked, plan.href);
        return;
      }
    }
    router.push(destinationFor({ mode, from, to, viewFmt }));
  }

  const job = JOBS.find((item) => item.id === jobId) || JOBS[0];

  function selectJob(id, focus) {
    setJobId(id);
    if (focus) {
      requestAnimationFrame(() => document.getElementById(`job-tab-${id}`)?.focus());
    }
  }

  function onJobKey(event) {
    const index = JOBS.findIndex((item) => item.id === jobId);
    let next = null;
    if (event.key === "ArrowRight") next = JOBS[(index + 1) % JOBS.length];
    else if (event.key === "ArrowLeft") next = JOBS[(index - 1 + JOBS.length) % JOBS.length];
    else if (event.key === "Home") next = JOBS[0];
    else if (event.key === "End") next = JOBS[JOBS.length - 1];
    if (!next) return;
    event.preventDefault();
    selectJob(next.id, true);
  }

  const fineText = mode === "convert"
    ? `First 2 files free, any size up to 300 MB. After that, ${priceLabel ? `${priceLabel} or ` : ""}1 credit per file. Prices include tax.`
    : mode === "draw"
      ? `${totalLabel ? `${totalLabel} per set, incl. tax · ` : ""}files up to 100 MB`
      : FINE[mode];

  const buttonLabel = mode === "view"
    ? `Open the free ${viewFmt} viewer`
    : mode === "bom"
      ? "Extract a BOM from STEP"
      : mode === "draw"
        ? "Make a 2D drawing from STEP"
        : `Open ${from} to ${to} converter`;

  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={`${styles.wrap} ${styles.grid}`}>
          <div className={styles.copy}>
            <p className={styles.pill}><b>●</b> 11 formats · nothing to install</p>
            <h1 className={styles.title} id="hero-title">
              Convert, view and draw <span>CAD files</span> online
            </h1>
            <p className={styles.lede}>
              11 engineering formats, 74 conversion routes, free 3D viewers, BOMs and 2D drawings. All in your browser.
            </p>
            <figure className={styles.viz}>
              <HeroViz />
            </figure>
            <ul className={styles.ticks}>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
                Files up to 300 MB
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
                Free 3D viewers
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18.2 8.4a4 4 0 110 7.2c-2.2-1-4.2-3.6-6.2-3.6s-4 2.6-6.2 3.6a4 4 0 110-7.2c2.2 1 4.2 3.6 6.2 3.6s4-2.6 6.2-3.6z" /></svg>
                No subscription
              </li>
            </ul>
          </div>

          <div className={styles.card} id="converter">
            <div className={styles.head}>
              <h2>Start with your CAD file</h2>
              <span className={styles.secure}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
                Up to 300 MB
              </span>
            </div>

            <div className={styles.tabs} role="tablist" aria-label="Choose a tool">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={mode === tab.id}
                  aria-controls="conv-panel"
                  tabIndex={mode === tab.id ? 0 : -1}
                  onClick={() => setMode(tab.id)}
                >
                  <TabIcon id={tab.id} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div id="conv-panel" role="tabpanel" aria-labelledby={`tab-${mode}`}>
              <div
                className={`${styles.drop} ${over ? styles.dropOver : ""}`}
                onDragEnter={(event) => { event.preventDefault(); setOver(true); }}
                onDragOver={(event) => { event.preventDefault(); setOver(true); }}
                onDragLeave={(event) => { event.preventDefault(); setOver(false); }}
                onDrop={(event) => {
                  event.preventDefault();
                  setOver(false);
                  acceptFile(event.dataTransfer.files?.[0]);
                }}
              >
                <div className={styles.dropIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></svg>
                </div>
                <strong>Drop your CAD file here</strong>
                <div className={styles.or}>
                  or{" "}
                  <label className={styles.browse} htmlFor="home-cad-file">browse files</label>
                </div>
                <input
                  ref={inputRef}
                  className={styles.fileInput}
                  id="home-cad-file"
                  type="file"
                  accept=".step,.stp,.stl,.3mf,.iges,.igs,.obj,.3dm,.ply,.brep,.brp,.off,.dxf,.dwg"
                  onChange={(event) => {
                    acceptFile(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
                <small className={styles.hint}>11 formats · up to 300 MB</small>
                {picked ? (
                  <div className={styles.chosen}>
                    <span>
                      <span className={styles.chosenName}>{picked.name}</span>{" "}
                      <span className={styles.chosenSize}>({formatSize(picked.size)})</span>
                    </span>
                    <span className={`${styles.tag} ${fileNote?.ok ? styles.tagOk : styles.tagErr}`}>
                      {fileNote?.text}
                    </span>
                  </div>
                ) : null}
              </div>

              {mode === "convert" ? (
                <div className={styles.mode}>
                  <div className={styles.row}>
                    <div>
                      <label className={styles.lbl} htmlFor="home-from">From</label>
                      <select
                        id="home-from"
                        className={styles.select}
                        value={from}
                        onChange={(event) => applyFrom(event.target.value, to)}
                      >
                        <FormatOptions groups={GROUPS} />
                      </select>
                    </div>
                    <button
                      className={styles.swap}
                      type="button"
                      aria-label="Swap formats"
                      onClick={() => {
                        if (routeOk(to, from)) applyFrom(to, from);
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h13l-4-4M17 17H4l4 4" /></svg>
                    </button>
                    <div>
                      <label className={styles.lbl} htmlFor="home-to">To</label>
                      <select
                        id="home-to"
                        className={styles.select}
                        value={to}
                        onChange={(event) => setTo(event.target.value)}
                      >
                        <FormatOptions groups={GROUPS} from={from} disableInvalid />
                      </select>
                    </div>
                  </div>
                  <div className={styles.insight}>
                    <span className={`${styles.kind} ${styles[insight.key]}`}>{insight.label}</span>
                    <p>
                      {insight.body}
                      <span className={styles.best}>Best for {insight.best}</span>
                    </p>
                  </div>
                </div>
              ) : null}

              {mode === "view" ? (
                <div className={styles.mode}>
                  <div className={styles.setting}>
                    <label className={styles.lbl} htmlFor="home-view-fmt">File type</label>
                    <select
                      id="home-view-fmt"
                      className={styles.select}
                      value={viewFmt}
                      onChange={(event) => setViewFmt(event.target.value)}
                    >
                      <FormatOptions groups={VIEW_GROUPS} />
                    </select>
                  </div>
                  <div className={styles.chips} style={{ marginTop: 12 }}>
                    <span><Check /> Free</span>
                    <span><Check /> Rotate and zoom</span>
                    <span><Check /> No install</span>
                  </div>
                </div>
              ) : null}

              {mode === "bom" ? (
                <div className={styles.mode}>
                  <h3 className={styles.modeTitle}>Parts list from a STEP assembly</h3>
                  <div className={styles.chips}>
                    <span><Check /> Assembly tree</span>
                    <span><Check /> Quantities</span>
                    <span><Check /> Excel download</span>
                  </div>
                </div>
              ) : null}

              {mode === "draw" ? (
                <div className={styles.mode}>
                  <h3 className={styles.modeTitle}>A full drawing set from one STEP file</h3>
                  <div className={styles.chips}>
                    <span><Check /> Views and sections</span>
                    <span><Check /> Dimensions</span>
                    <span><Check /> PDF · DXF · SVG · PNG</span>
                  </div>
                </div>
              ) : null}

              <button className={styles.go} type="button" onClick={openTool}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                {buttonLabel}
              </button>
              <p className={styles.fine}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>
                <span>{fineText}</span>
              </p>
            </div>

            <div className={styles.pairs} aria-label="Popular converters">
              <span>Popular</span>
              <Link href="/tools/convert-step-to-stl">STEP → STL</Link>
              <Link href="/tools/convert-stl-to-step">STL → STEP</Link>
              <Link href="/tools/convert-dwg-to-dxf">DWG → DXF</Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.proof} aria-label="Marathon OS in numbers">
        <div className={styles.proofGrid}>
          <div className={styles.stat}><b>22,000+</b><span>files converted</span></div>
          <div className={styles.stat}><b>11</b><span>CAD, mesh and 2D formats</span></div>
          <div className={styles.stat}><b>74</b><span>conversion routes</span></div>
          <div className={styles.stat}><b>300 MB</b><span>per file</span></div>
        </div>
      </section>

      <section className={styles.works} aria-labelledby="works-title">
        <div className={styles.worksGrid}>
          <div className={styles.worksIntro}>
            <p className={styles.eyebrow}>Files ready for</p>
            <h2 className={styles.worksTitle} id="works-title">The tools you already use</h2>
          </div>
          <div className={styles.worksGroups}>
            {TOOL_GROUPS.map((group) => (
              <div className={styles.wg} key={group.title}>
                <div className={styles.wgTitle}>
                  <span className={styles.wgIcon}><ToolIcon id={group.icon} /></span>
                  {group.title}
                </div>
                <div className={styles.wgFormats}>
                  <span className={styles.via}>via</span>
                  {group.formats.map((format) => (
                    <span className={`${styles.fmt} ${styles[format.kind]}`} key={format.label}>{format.label}</span>
                  ))}
                </div>
                <ul className={styles.wgTools}>
                  {group.tools.map((tool) => <li key={tool}>{tool}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.platform} id="tools" aria-labelledby="tools-title">
        <div className={styles.wrap}>
          <div className={styles.sh}>
            <p className={styles.eyebrow}>One platform</p>
            <h2 className={styles.platformTitle} id="tools-title">
              Everything a CAD file <span className={styles.grad}>needs next</span>
            </h2>
            <p>Convert it, check it, list its parts or draw it.</p>
          </div>
          <div className={styles.bento}>
            <Link className={styles.lead} href="/tools/3d-cad-file-converter">
              <h3>CAD converters</h3>
              <p>Every format engineers actually use.</p>
              <div className={styles.flow} aria-hidden="true">
                {CONVERTER_FLOWS.map(([from, fromKind, to, toKind]) => (
                  <div className={styles.flowLine} key={`${from}-${to}`}>
                    <span className={styles.flowFmt}>{from}<small>{fromKind}</small></span>
                    <i>→</i>
                    <span className={styles.flowFmt}>{to}<small>{toKind}</small></span>
                  </div>
                ))}
              </div>
              <div>
                <p className={styles.big}>74</p>
                <p>conversion routes, 11 formats</p>
              </div>
              <span className={styles.more}>Explore converters <Arrow /></span>
            </Link>
            <Link href="/tools/3d-cad-viewer">
              <div className={styles.art}><ViewerArt /></div>
              <h3>Free 3D viewers</h3>
              <p>Inspect any model in your browser.</p>
              <span className={styles.more}>Open a viewer <Arrow /></span>
            </Link>
            <Link href="/tools/step-bom-extractor">
              <div className={styles.art}><BomArt /></div>
              <h3>STEP BOM extractor</h3>
              <p>Parts and quantities, to Excel.</p>
              <span className={styles.more}>Extract a BOM <Arrow /></span>
            </Link>
            <Link href="/tools/convert-step-to-2d-drawing">
              <div className={styles.art}><DrawingArt /></div>
              <h3>STEP to 2D drawings</h3>
              <p>Views, sections and dimensions.</p>
              <span className={styles.more}>Make a drawing <Arrow /></span>
            </Link>
            <Link href="/library">
              <div className={styles.art}><LibraryArt /></div>
              <h3>CAD library</h3>
              <p>15,000+ models, ready to download.</p>
              <span className={styles.more}>Browse models <Arrow /></span>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.jobsBand} id="jobs" aria-labelledby="jobs-title">
        <div className={styles.wrap}>
          <div className={styles.sh}>
            <p className={styles.eyebrow}>Start from the job</p>
            <h2 className={styles.platformTitle} id="jobs-title">What’s the file for?</h2>
            <p>Pick a job. We’ll show the right conversions.</p>
          </div>
          <div className={styles.jobs}>
            <div className={styles.jobTabs} role="tablist" aria-label="What the file is for">
              {JOBS.map((item) => {
                const selected = item.id === job.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    id={`job-tab-${item.id}`}
                    aria-selected={selected}
                    aria-controls="job-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => selectJob(item.id)}
                    onKeyDown={onJobKey}
                  >
                    <JobIcon id={item.icon} />
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className={styles.jobPanel} role="tabpanel" id="job-panel" aria-labelledby={`job-tab-${job.id}`}>
              <div className={styles.jobRoutes}>
                {job.routes.map((route) => (
                  <Link key={route.href} href={route.href}>
                    <b>
                      {route.title || <>{route.from} <i>→</i> {route.to}</>}
                    </b>
                    <span className={`${styles.kind} ${styles[route.kind]}`}>{route.kindLabel}</span>
                  </Link>
                ))}
              </div>
              <aside className={styles.jobTip}>
                <span className={styles.jobTipIcon} aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
                </span>
                <p>{job.tip}</p>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.routes} id="converters" aria-labelledby="conv-title">
        <div className={styles.wrap}>
          <div className={styles.split}>
            <div>
              <p className={styles.eyebrow}>CAD converters</p>
              <h2 className={styles.platformTitle} id="conv-title">
                The most-used <span className={styles.grad}>conversions</span>
              </h2>
            </div>
            <Link className={styles.more} href="/tools/3d-cad-file-converter">
              All conversion tools <Arrow />
            </Link>
          </div>
          <div className={styles.popGrid}>
            {POPULAR.map(([from, to]) => (
              <Link key={`${from}-${to}`} href={`/tools/convert-${from.toLowerCase()}-to-${to.toLowerCase()}`}>
                <span className={styles.pair}>
                  <span className={`${styles.badge} ${styles[BADGE[FAM[from]]]}`}>{from}</span>
                  <i>→</i>
                  <span className={`${styles.badge} ${styles[BADGE[FAM[to]]]}`}>{to}</span>
                </span>
                <span className={styles.popMeta}>
                  <b>{from} to {to}</b>
                  <span className={styles.arr} aria-hidden="true"><Arrow /></span>
                </span>
              </Link>
            ))}
          </div>
          <div className={styles.subhead} id="routes">
            <h3>Every route, one table</h3>
            <div className={styles.legend}>
              <span className={`${styles.kind} ${styles.exact}`}>CAD → CAD · exact</span>
              <span className={`${styles.kind} ${styles.tess}`}>CAD → Mesh · tessellated</span>
              <span className={`${styles.kind} ${styles.solid}`}>Mesh → CAD · faceted solid</span>
              <span className={`${styles.kind} ${styles.mesh}`}>Mesh → Mesh · mesh to mesh</span>
              <span className={`${styles.kind} ${styles.d2}`}>2D → 2D · drawing</span>
            </div>
          </div>
          <ConversionMatrix />
          <p className={styles.scrollHint}>Swipe the table to see every format.</p>
        </div>
      </section>

      <section className={styles.fidelity} id="fidelity" aria-labelledby="fid-title">
        <div className={styles.wrap}>
          <div className={styles.sh}>
            <p className={styles.eyebrow}>Know what changes</p>
            <h2 className={styles.platformTitle} id="fid-title">Solids, meshes and drawings</h2>
            <p>Three kinds of CAD file. Each conversion tells you what survives.</p>
          </div>
          <div className={styles.families}>
            <figure className={styles.family}>
              <div className={styles.vizBox}><SolidArt /></div>
              <figcaption>
                <h3>CAD solids</h3>
                <p>Exact geometry. Holes stay round.</p>
                <div className={styles.fm}>{["STEP", "IGES", "BREP", "3DM"].map((name) => <span key={name}>{name}</span>)}</div>
              </figcaption>
            </figure>
            <figure className={styles.family}>
              <div className={styles.vizBox}><MeshArt /></div>
              <figcaption>
                <h3>Meshes</h3>
                <p>Flat triangles. Universal, never exact.</p>
                <div className={styles.fm}>{["STL", "3MF", "OBJ", "PLY", "OFF"].map((name) => <span key={name}>{name}</span>)}</div>
              </figcaption>
            </figure>
            <figure className={styles.family}>
              <div className={styles.vizBox}><DrawingFamilyArt /></div>
              <figcaption>
                <h3>2D drawings</h3>
                <p>Views, lines and dimensions on a sheet.</p>
                <div className={styles.fm}>{["DXF", "DWG"].map((name) => <span key={name}>{name}</span>)}</div>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className={styles.viewersBand} id="viewers" aria-labelledby="view-title">
        <div className={styles.wrap}>
          <div className={styles.split}>
            <div>
              <p className={styles.eyebrow}>Free CAD viewers</p>
              <h2 className={styles.platformTitle} id="view-title">Open any CAD file. No software.</h2>
            </div>
            <p>Rotate, zoom and inspect in your browser. Always free.</p>
          </div>
          <div className={styles.viewers}>
            {VIEWER_CARDS.map((card) => (
              <Link key={card.id} href={`/tools/${card.id.toLowerCase()}-file-viewer`}>
                <span className={styles.viewerTop}>
                  <span className={`${styles.badge} ${styles.viewerBadge} ${styles[card.kind]}`}>{card.id}</span>
                  <span className={styles.free}>Free</span>
                </span>
                <b>{card.id} viewer</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.bomBand} id="bom" aria-labelledby="bom-title">
        <div className={`${styles.wrap} ${styles.feature}`}>
          <div>
            <p className={styles.eyebrow}>STEP BOM extractor</p>
            <h2 className={styles.platformTitle} id="bom-title">A bill of materials from any STEP assembly</h2>
            <p className={styles.leadP}>Every part and quantity, without opening CAD.</p>
            <div className={styles.facts}>
              <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg>Assembly tree</span>
              <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Quantities</span>
              <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v12M7 11l5 5 5-5M4 20h16" /></svg>Excel</span>
            </div>
            <Link className={styles.cta} href="/tools/step-bom-extractor">
              Extract a BOM <Arrow />
            </Link>
          </div>
          <div className={styles.visual} role="img" aria-label="Example bill of materials extracted from a gearbox STEP assembly">
            <div className={styles.xl} aria-hidden="true">
              <div className={styles.xlBar}>gearbox-assembly_BOM.xlsx<span>Example output</span></div>
              <div className={styles.xlTabs}><span className={styles.on}>BOM</span><span>Assembly tree</span></div>
              <table className={styles.bomTable}>
                <thead>
                  <tr><th>#</th><th>Part name</th><th>Level</th><th className={styles.qty}>Qty</th></tr>
                </thead>
                <tbody>
                  {BOM_ROWS.map((row) => (
                    <tr
                      key={row.n}
                      className={[row.depth === 1 ? styles.lvl1 : "", row.depth === 2 ? styles.lvl2 : "", row.asm ? styles.asm : ""].filter(Boolean).join(" ") || undefined}
                    >
                      <td>{row.n}</td>
                      <td>{row.name}</td>
                      <td>{row.level}</td>
                      <td className={styles.qty}>{row.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.bomFoot} aria-hidden="true"><span>5 unique parts · 20 pieces</span><span><b>Ready</b> · Download .xlsx</span></div>
          </div>
        </div>
      </section>

      <section className={styles.drawBand} id="drawings" aria-labelledby="draw-title">
        <div className={`${styles.wrap} ${styles.feature} ${styles.featureRev}`}>
          <div>
            <p className={styles.eyebrow}>STEP to 2D drawings</p>
            <h2 className={styles.platformTitle} id="draw-title">From 3D model to shop drawing in 4 minutes</h2>
            <p className={styles.leadP}>Views, sections, dimensions and a title block.</p>
            <div className={styles.facts}>
              <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.6 13.4 13.4 20.6a2 2 0 01-2.8 0L3 13V3h10l7.6 7.6a2 2 0 010 2.8z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>{totalLabel ? `${totalLabel} a set` : "Per set"}</span>
              <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>PDF · DXF · SVG · PNG</span>
              <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 14l4-4" /><path d="M3.3 19a10 10 0 1117.4 0" /></svg>Up to 100 MB</span>
            </div>
            <Link className={styles.cta} href="/tools/convert-step-to-2d-drawing">
              Make a 2D drawing <Arrow />
            </Link>
          </div>
          <div className={styles.visual}>
            <DrawingSheet />
          </div>
        </div>
      </section>

      <section className={styles.whyBand} id="why-us" aria-labelledby="why-title">
        <div className={styles.wrap}>
          <div className={styles.sh}>
            <p className={styles.eyebrow}>Why Marathon OS</p>
            <h2 className={styles.platformTitle} id="why-title">Built for engineers, <span className={styles.grad}>not for every file</span></h2>
            <p>How a specialist CAD platform compares.</p>
          </div>
          <div className={styles.compareWrap}>
            <div className={styles.tableWrap}>
              <table className={styles.compare}>
                <caption className={styles.srOnly}>Marathon OS compared with generic online converters and desktop CAD software</caption>
                <thead>
                  <tr>
                    <th scope="col" />
                    <th scope="col" className={styles.compareUs}>Marathon OS</th>
                    <th scope="col">Generic converters</th>
                    <th scope="col">Desktop CAD</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      <td className={styles.compareUs}><Mark kind={row.us} note={row.usPrice ? totalLabel : ""} /></td>
                      <td><Mark kind={row.generic} note={row.genericNote} /></td>
                      <td><Mark kind={row.desktop} note={row.desktopNote} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.howBand} id="how" aria-labelledby="how-title">
        <div className={styles.wrap}>
          <div className={styles.sh}>
            <p className={styles.eyebrow}>How it works</p>
            <h2 className={styles.platformTitle} id="how-title">Three steps. No install.</h2>
          </div>
          <ol className={styles.steps}>
            {HOW_STEPS.map((step) => (
              <li key={step.title}>
                <span className={styles.stepIcon}><StepIcon id={step.icon} /></span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <HomePricing initialInfo={initialConverterInfo} drawingLabel={totalLabel} />

      <section className={styles.security} id="security" aria-labelledby="sec-title">
        <div className={styles.wrap}>
          <div className={styles.fileBand}>
            <div>
              <p className={styles.eyebrow}>Your files</p>
              <h2 id="sec-title">Your designs stay yours</h2>
              <p>Converted files aren&apos;t added to the public CAD library unless you publish them. Uploading or converting a file never transfers ownership of your design.</p>
              <p className={styles.fileLinks}>
                <Link className={styles.btnLight} href="/privacy-policy">Privacy Policy</Link>
                <Link className={styles.btnOutline} href="/terms-and-conditions">Terms and Conditions</Link>
              </p>
            </div>
            <div className={styles.fileTiles}>
              <div className={styles.fileTile}>
                <span className={styles.fileIc}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg></span>
                <b>HTTPS uploads and downloads</b>
              </div>
              <div className={styles.fileTile}>
                <span className={styles.fileIc}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5" /></svg></span>
                <b>Deleted after 7 days</b>
              </div>
              <div className={styles.fileTile}>
                <span className={styles.fileIc}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="7.5" cy="15.5" r="4.5" /><path d="M10.7 12.3 21 2M16 7l3 3M18 5l2 2" /></svg></span>
                <b>You keep ownership</b>
              </div>
              <div className={styles.fileTile}>
                <span className={styles.fileIc}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3l18 18M10.6 5.1A10 10 0 0112 5c6 0 10 7 10 7a17 17 0 01-3.2 3.9M6.6 6.6C3.8 8.4 2 12 2 12s4 7 10 7a9.6 9.6 0 005.4-1.6" /></svg></span>
                <b>Not published unless you choose</b>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.libraryBand} id="library" aria-label="CAD library and CAD designers">
        <div className={`${styles.wrap} ${styles.duo}`}>
          <div className={styles.panel}>
            <p className={styles.eyebrow}>CAD library</p>
            <p className={styles.num}>15,000+</p>
            <h2>Ready-made CAD models</h2>
            <LibraryMosaic />
            <div className={styles.cats}>
              {LIBRARY_CATS.map(([label, href]) => (
                <Link key={href} href={href}>{label}</Link>
              ))}
            </div>
            <Link className={`${styles.libBtn} ${styles.libGhost}`} href="/library">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
              Browse the library
            </Link>
          </div>
          <div className={styles.panel} id="designers">
            <p className={styles.eyebrow}>When software isn&apos;t enough</p>
            <p className={styles.num}>1,000+</p>
            <h2>CAD partners for hire</h2>
            <p className={styles.sub}>One brief. Matched with the right designers.</p>
            <ul className={styles.svc}>
              <li><span className={styles.svcIc}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></svg></span>STL or scan to editable CAD</li>
              <li><span className={styles.svcIc}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="1" /><path d="M7 7h6v6H7zM16 7v10M7 17h6" /></svg></span>Production drawings with GD&amp;T</li>
              <li><span className={styles.svcIc}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" /></svg></span>Repair and print prep</li>
            </ul>
            <ol className={styles.flowsteps}>
              <li><b>1</b>Share a brief</li>
              <li><b>2</b>Get matched</li>
              <li><b>3</b>Compare and choose</li>
            </ol>
            <Link className={`${styles.libBtn} ${styles.libPrimary}`} href="/cad-services">Hire a CAD designer</Link>
          </div>
        </div>
      </section>

      <section className={styles.formatsBand} id="formats" aria-labelledby="fmt-title">
        <div className={styles.wrap}>
          <div className={styles.sh}>
            <p className={styles.eyebrow}>Format guide</p>
            <h2 className={styles.platformTitle} id="fmt-title">CAD formats at a glance</h2>
            <p>What each format is for, and where to take it next.</p>
          </div>
          <div className={styles.fmts}>
            {FORMATS.map((format) => (
              <article className={styles.formatCard} key={format.id}>
                <div className={styles.fmtTop}>
                  <h3 className={`${styles.fmtBadge} ${styles[format.kind]}`}>{format.id}</h3>
                  <span className={styles.fmtExt}>{format.ext}</span>
                </div>
                <p>{format.title}<small>{format.detail}</small></p>
                <div className={styles.fmtLinks}>
                  {format.links.map(([label, href]) => (
                    <Link key={href} href={href}>{label}</Link>
                  ))}
                </div>
              </article>
            ))}
            <Link className={`${styles.formatCard} ${styles.goTile}`} href="/cad-services">
              <p>Not sure what you have?<small>Drop it in and we&apos;ll detect it.</small></p>
              <span className={styles.arr} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <HomeFaq initialInfo={initialConverterInfo} drawingLabel={totalLabel} />

      <section className={styles.finalBand} aria-labelledby="cta-title">
        <div className={styles.wrap}>
          <div className={styles.finalCard}>
            <h2 id="cta-title">Your next CAD file is two clicks away</h2>
            <p>
              First 2 files free, any size up to 300 MB. After that, {singlePrice ? `${singlePrice} or ` : ""}1 credit per file. No install. No subscription.
            </p>
            <div className={styles.finalBtns}>
              <Link className={styles.finalLight} href="#converter">Convert a CAD file</Link>
              <Link className={styles.finalOutline} href="/tools">See all tools</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const FORMATS = [
  { id: "STEP", kind: "fmtCad", ext: ".step .stp", title: "Sharing CAD between programs", detail: "ISO 10303 exchange format", links: [["Viewer", "/tools/step-file-viewer"], ["to STL", "/tools/convert-step-to-stl"], ["BOM", "/tools/step-bom-extractor"]] },
  { id: "IGES", kind: "fmtCad", ext: ".iges .igs", title: "Legacy CAD and CAM", detail: "Initial Graphics Exchange Specification", links: [["Viewer", "/tools/iges-file-viewer"], ["to STEP", "/tools/convert-iges-to-step"]] },
  { id: "BREP", kind: "fmtCad", ext: ".brep .brp", title: "FreeCAD and Open CASCADE", detail: "Boundary representation", links: [["Viewer", "/tools/brep-file-viewer"], ["to STEP", "/tools/convert-brep-to-step"]] },
  { id: "3DM", kind: "fmtCad", ext: ".3dm", title: "Rhino design work", detail: "Rhino 3D model", links: [["Viewer", "/tools/3dm-file-viewer"], ["to STEP", "/tools/convert-3dm-to-step"]] },
  { id: "STL", kind: "fmtMesh", ext: ".stl", title: "3D printing", detail: "Stereolithography", links: [["Viewer", "/tools/stl-file-viewer"], ["to STEP", "/tools/convert-stl-to-step"]] },
  { id: "3MF", kind: "fmtMesh", ext: ".3mf", title: "Modern 3D printing", detail: "3D Manufacturing Format", links: [["to STL", "/tools/convert-3mf-to-stl"], ["to STEP", "/tools/convert-3mf-to-step"]] },
  { id: "OBJ", kind: "fmtMesh", ext: ".obj", title: "Rendering and games", detail: "Wavefront OBJ", links: [["Viewer", "/tools/obj-file-viewer"], ["to STL", "/tools/convert-obj-to-stl"]] },
  { id: "PLY", kind: "fmtMesh", ext: ".ply", title: "3D scans", detail: "Polygon File Format", links: [["Viewer", "/tools/ply-file-viewer"], ["to STL", "/tools/convert-ply-to-stl"]] },
  { id: "OFF", kind: "fmtMesh", ext: ".off", title: "Geometry research", detail: "Object File Format", links: [["Viewer", "/tools/off-file-viewer"], ["to STL", "/tools/convert-off-to-stl"]] },
  { id: "DXF", kind: "fmt2d", ext: ".dxf", title: "Laser cutting and CNC", detail: "Drawing Exchange Format", links: [["Viewer", "/tools/dxf-file-viewer"], ["to DWG", "/tools/convert-dxf-to-dwg"]] },
  { id: "DWG", kind: "fmt2d", ext: ".dwg", title: "AutoCAD drafting", detail: "AutoCAD drawing", links: [["Viewer", "/tools/dwg-file-viewer"], ["to DXF", "/tools/convert-dwg-to-dxf"]] },
];

const LIBRARY_CATS = [
  ["Automotive", "/library/automotive"],
  ["Aerospace", "/library/aerospace"],
  ["Robotics", "/library/robotics"],
  ["3D Printing", "/library/3d-printing"],
  ["Architecture", "/library/architecture"],
  ["Industrial Design", "/library/industrial-design"],
  ["Medical", "/library/medical"],
  ["Electrical", "/library/electrical"],
];

function LibraryMosaic() {
  return (
    <div className={styles.mosaic} aria-hidden="true">
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><polygon points="21.4,10.3 21.4,13.7 19.0,13.5 18.1,15.9 19.9,17.5 17.5,19.9 15.9,18.1 13.5,19.0 13.7,21.4 10.3,21.4 10.5,19.0 8.1,18.1 6.5,19.9 4.1,17.5 5.9,15.9 5.0,13.5 2.6,13.7 2.6,10.3 5.0,10.5 5.9,8.1 4.1,6.5 6.5,4.1 8.1,5.9 10.5,5.0 10.3,2.6 13.7,2.6 13.5,5.0 15.9,5.9 17.5,4.1 19.9,6.5 18.1,8.1 19.0,10.5" /><circle cx="12" cy="12" r="3" /></svg></span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9z" /><circle cx="12" cy="12" r="3.5" /></svg></span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M5 3h5v12h9v6H5z" /><circle cx="7.5" cy="7" r="1" /><circle cx="15" cy="18" r="1" /></svg></span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="5.8" r="1" /><circle cx="18.2" cy="12" r="1" /><circle cx="12" cy="18.2" r="1" /><circle cx="5.8" cy="12" r="1" /></svg></span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M2 10h5V8h10v2h5v4h-5v2H7v-2H2z" /></svg></span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="7" cy="10" r="1.2" /><circle cx="17" cy="10" r="1.2" /><circle cx="7" cy="14" r="1.2" /><circle cx="17" cy="14" r="1.2" /></svg></span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M7 3h10M7 21h10M8 3c8 2.5-8 4 0 6.5S16 13 8 15.5 16 19 8 21" /></svg></span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><circle cx="12" cy="12" r="2" /><path d="M12 10C11 6 12 2 15 3s0 5-3 7zM13.7 13c3 3 4.8 6.6 2 8s-3.6-4.5-2-8zM10.3 13c-4 1-8 .2-7.6-2.8s5 -1.2 7.6 2.8z" /></svg></span>
    </div>
  );
}

const CONVERTER_FLOWS = [
  ["STEP", "solid", "STL", "mesh"],
  ["STL", "mesh", "STEP", "solid"],
  ["3DM", "NURBS", "STEP", "solid"],
  ["DWG", "drawing", "DXF", "drawing"],
];

function StepIcon({ id }) {
  if (id === "flow") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="6" cy="19" r="3" /><circle cx="18" cy="5" r="3" /><path d="M9 19h8.5a3.5 3.5 0 000-7h-11a3.5 3.5 0 010-7H15" /></svg>
    );
  }
  if (id === "down") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v12M7 11l5 5 5-5M4 20h16" /></svg>
    );
  }
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></svg>
  );
}

function Mark({ kind, note }) {
  return (
    <span className={`${styles.mark} ${styles[`mark${kind}`]}`}>
      <i role="img" aria-label={kind === "y" ? "Yes" : kind === "n" ? "No" : "Partly"}>
        {kind === "y" ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>
        ) : kind === "n" ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 12h12" /></svg>
        )}
      </i>
      {note ? <small>{note}</small> : null}
    </span>
  );
}

function DrawingSheet() {
  return (
    <svg className={styles.sheet} viewBox="0 0 840 594" role="img" aria-labelledby="sheetTitle sheetDesc">
      <title id="sheetTitle">Example 2D drawing sheet generated from a STEP file</title>
      <desc id="sheetDesc">A3 sheet in third-angle projection with top, front and right views of a block with a through hole, an isometric view, section A-A, dimensions and a title block.</desc>
      <defs>
        <marker id="draw-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,1 L10,5 L0,9 z" fill="#6A2BE0" />
        </marker>
        <pattern id="draw-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#16112E" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="840" height="594" fill="#fff" />
      <rect x="14" y="14" width="812" height="566" fill="none" stroke="#16112E" strokeWidth="2" />
      <rect x="110" y="160" width="160" height="80" fill="none" stroke="#16112E" strokeWidth="2" />
      <circle cx="190" cy="200" r="15" fill="none" stroke="#16112E" strokeWidth="2" />
      <line x1="165" y1="200" x2="215" y2="200" stroke="#6B6680" strokeWidth="1" strokeDasharray="14 4 3 4" />
      <line x1="190" y1="175" x2="190" y2="225" stroke="#6B6680" strokeWidth="1" strokeDasharray="14 4 3 4" />
      <line x1="96" y1="200" x2="284" y2="200" stroke="#16112E" strokeWidth="1.2" strokeDasharray="18 4 3 4" />
      <text x="88" y="205" fontFamily="Inter,Arial,sans-serif" fontSize="14" fontWeight="700" fill="#16112E" textAnchor="middle">A</text>
      <text x="292" y="205" fontFamily="Inter,Arial,sans-serif" fontSize="14" fontWeight="700" fill="#16112E" textAnchor="middle">A</text>
      <rect x="110" y="300" width="160" height="60" fill="none" stroke="#16112E" strokeWidth="2" />
      <line x1="175" y1="300" x2="175" y2="360" stroke="#6B6680" strokeWidth="1.3" strokeDasharray="6 4" />
      <line x1="205" y1="300" x2="205" y2="360" stroke="#6B6680" strokeWidth="1.3" strokeDasharray="6 4" />
      <line x1="190" y1="290" x2="190" y2="370" stroke="#6B6680" strokeWidth="1" strokeDasharray="14 4 3 4" />
      <rect x="330" y="300" width="80" height="60" fill="none" stroke="#16112E" strokeWidth="2" />
      <line x1="355" y1="300" x2="355" y2="360" stroke="#6B6680" strokeWidth="1.3" strokeDasharray="6 4" />
      <line x1="385" y1="300" x2="385" y2="360" stroke="#6B6680" strokeWidth="1.3" strokeDasharray="6 4" />
      <line x1="370" y1="290" x2="370" y2="370" stroke="#6B6680" strokeWidth="1" strokeDasharray="14 4 3 4" />
      <line x1="110" y1="364" x2="110" y2="400" stroke="#6A2BE0" strokeWidth="1.2" strokeOpacity=".5" />
      <line x1="270" y1="364" x2="270" y2="400" stroke="#6A2BE0" strokeWidth="1.2" strokeOpacity=".5" />
      <line x1="110" y1="394" x2="270" y2="394" stroke="#6A2BE0" strokeWidth="1.2" markerStart="url(#draw-arrow)" markerEnd="url(#draw-arrow)" />
      <text x="190" y="388" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="600" fill="#6A2BE0" textAnchor="middle">160</text>
      <line x1="106" y1="300" x2="86" y2="300" stroke="#6A2BE0" strokeWidth="1.2" strokeOpacity=".5" />
      <line x1="106" y1="360" x2="86" y2="360" stroke="#6A2BE0" strokeWidth="1.2" strokeOpacity=".5" />
      <line x1="80" y1="300" x2="80" y2="360" stroke="#6A2BE0" strokeWidth="1.2" markerStart="url(#draw-arrow)" markerEnd="url(#draw-arrow)" />
      <text x="72" y="334" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="600" fill="#6A2BE0" textAnchor="end">60</text>
      <line x1="106" y1="160" x2="70" y2="160" stroke="#6A2BE0" strokeWidth="1.2" strokeOpacity=".5" />
      <line x1="106" y1="240" x2="70" y2="240" stroke="#6A2BE0" strokeWidth="1.2" strokeOpacity=".5" />
      <line x1="64" y1="160" x2="64" y2="240" stroke="#6A2BE0" strokeWidth="1.2" markerStart="url(#draw-arrow)" markerEnd="url(#draw-arrow)" />
      <text x="56" y="204" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="600" fill="#6A2BE0" textAnchor="end">80</text>
      <line x1="330" y1="364" x2="330" y2="400" stroke="#6A2BE0" strokeWidth="1.2" strokeOpacity=".5" />
      <line x1="410" y1="364" x2="410" y2="400" stroke="#6A2BE0" strokeWidth="1.2" strokeOpacity=".5" />
      <line x1="330" y1="394" x2="410" y2="394" stroke="#6A2BE0" strokeWidth="1.2" markerStart="url(#draw-arrow)" markerEnd="url(#draw-arrow)" />
      <text x="370" y="388" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="600" fill="#6A2BE0" textAnchor="middle">80</text>
      <line x1="242.6" y1="155.4" x2="200.6" y2="189.4" stroke="#6A2BE0" strokeWidth="1.2" markerEnd="url(#draw-arrow)" />
      <line x1="242.6" y1="155.4" x2="292.6" y2="155.4" stroke="#6A2BE0" strokeWidth="1.2" />
      <text x="246.6" y="149.4" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="600" fill="#6A2BE0" textAnchor="start">Ø30 THRU</text>
      <rect x="560" y="350" width="65" height="60" fill="url(#draw-hatch)" stroke="#16112E" strokeWidth="2" />
      <rect x="655" y="350" width="65" height="60" fill="url(#draw-hatch)" stroke="#16112E" strokeWidth="2" />
      <line x1="625" y1="350" x2="655" y2="350" fill="none" stroke="#16112E" strokeWidth="2" />
      <line x1="625" y1="410" x2="655" y2="410" fill="none" stroke="#16112E" strokeWidth="2" />
      <line x1="640" y1="340" x2="640" y2="420" stroke="#6B6680" strokeWidth="1" strokeDasharray="14 4 3 4" />
      <text x="640" y="444" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="700" fill="#16112E" textAnchor="middle">SECTION A-A</text>
      <polygon points="725.9,239.6 683.0,264.4 683.0,227.2 725.9,202.4" fill="#E4D9FB" stroke="#16112E" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="597.0,214.8 683.0,264.4 683.0,227.2 597.0,177.6" fill="#F1EBFD" stroke="#16112E" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="640.0,152.8 725.9,202.4 683.0,227.2 597.0,177.6" fill="#FBF9FF" stroke="#16112E" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="669.5,194.6 668.4,195.2 667.2,195.7 665.8,196.1 664.4,196.4 663.0,196.5 661.5,196.6 660.0,196.5 658.5,196.4 657.1,196.1 655.8,195.7 654.5,195.2 653.4,194.6 652.4,194.0 651.6,193.3 651.0,192.5 650.5,191.7 650.2,190.9 650.1,190.0 650.2,189.1 650.5,188.3 651.0,187.5 651.6,186.7 652.4,186.0 653.4,185.4 654.5,184.8 655.8,184.3 657.1,183.9 658.5,183.6 660.0,183.5 661.5,183.4 663.0,183.5 664.4,183.6 665.8,183.9 667.2,184.3 668.4,184.8 669.5,185.4 670.5,186.0 671.3,186.7 672.0,187.5 672.5,188.3 672.8,189.1 672.9,190.0 672.8,190.9 672.5,191.7 672.0,192.5 671.3,193.3 670.5,194.0" fill="#D7C8F7" stroke="#16112E" strokeWidth="1.8" />
      <text x="660" y="294" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="700" fill="#16112E" textAnchor="middle">ISOMETRIC VIEW</text>
      <rect x="480" y="470" width="346" height="110" fill="none" stroke="#16112E" strokeWidth="2" />
      <line x1="480" y1="506" x2="826" y2="506" stroke="#16112E" strokeWidth="1" />
      <line x1="480" y1="543" x2="826" y2="543" stroke="#16112E" strokeWidth="1" />
      <line x1="653" y1="506" x2="653" y2="580" stroke="#16112E" strokeWidth="1" />
      <text x="490" y="483" fontFamily="Inter,Arial,sans-serif" fontSize="9" fontWeight="600" fill="#6B6680">PART</text>
      <text x="490" y="498" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="700" fill="#16112E">sample-block.step</text>
      <text x="490" y="520" fontFamily="Inter,Arial,sans-serif" fontSize="9" fontWeight="600" fill="#6B6680">SCALE  /  UNITS</text>
      <text x="490" y="535" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="700" fill="#16112E">1:1  /  mm</text>
      <text x="663" y="520" fontFamily="Inter,Arial,sans-serif" fontSize="9" fontWeight="600" fill="#6B6680">PROJECTION</text>
      <text x="663" y="535" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="700" fill="#16112E">Third angle</text>
      <text x="490" y="557" fontFamily="Inter,Arial,sans-serif" fontSize="9" fontWeight="600" fill="#6B6680">SHEET</text>
      <text x="490" y="572" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="700" fill="#16112E">A3 landscape</text>
      <text x="663" y="557" fontFamily="Inter,Arial,sans-serif" fontSize="9" fontWeight="600" fill="#6B6680">GENERATED BY</text>
      <text x="663" y="572" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="700" fill="#16112E">Marathon OS</text>
    </svg>
  );
}

function SolidArt() {
  return (
    <svg viewBox="0 0 220 140" role="img" aria-label="A CAD plate with an exact circular hole">
      <rect x="30" y="20" width="160" height="100" rx="10" fill="#F1EAFE" stroke="#5B1FD1" strokeWidth="2" />
      <circle cx="110" cy="70" r="30" fill="#fff" stroke="#5B1FD1" strokeWidth="2" />
      <line x1="110" y1="70" x2="131.2" y2="48.8" stroke="#5B1FD1" strokeWidth="1.2" />
      <circle cx="110" cy="70" r="2" fill="#5B1FD1" />
      <text x="136" y="46" fontFamily="Inter,Arial,sans-serif" fontSize="11" fontWeight="700" fill="#5B1FD1">R 30.000</text>
    </svg>
  );
}

function MeshArt() {
  return (
    <svg viewBox="0 0 220 140" role="img" aria-label="The same plate as a triangle mesh, with the hole approximated by flat facets">
      <rect x="30" y="20" width="160" height="100" fill="#EAF0FD" stroke="#2B4C9B" strokeWidth="2" />
      <g stroke="#2B4C9B" strokeWidth=".8" strokeOpacity=".55">
        <line x1="139.0" y1="77.8" x2="190.0" y2="116.2" /><line x1="131.2" y1="91.2" x2="190.0" y2="116.2" />
        <line x1="131.2" y1="91.2" x2="138.9" y2="120.0" /><line x1="117.8" y1="99.0" x2="138.9" y2="120.0" />
        <line x1="117.8" y1="99.0" x2="110.0" y2="120.0" /><line x1="102.2" y1="99.0" x2="110.0" y2="120.0" />
        <line x1="102.2" y1="99.0" x2="81.1" y2="120.0" /><line x1="88.8" y1="91.2" x2="81.1" y2="120.0" />
        <line x1="88.8" y1="91.2" x2="30.0" y2="116.2" /><line x1="81.0" y1="77.8" x2="30.0" y2="116.2" />
        <line x1="81.0" y1="77.8" x2="30.0" y2="70.0" /><line x1="81.0" y1="62.2" x2="30.0" y2="70.0" />
        <line x1="81.0" y1="62.2" x2="30.0" y2="23.8" /><line x1="88.8" y1="48.8" x2="30.0" y2="23.8" />
        <line x1="88.8" y1="48.8" x2="81.1" y2="20.0" /><line x1="102.2" y1="41.0" x2="81.1" y2="20.0" />
        <line x1="102.2" y1="41.0" x2="110.0" y2="20.0" /><line x1="117.8" y1="41.0" x2="110.0" y2="20.0" />
        <line x1="117.8" y1="41.0" x2="138.9" y2="20.0" /><line x1="131.2" y1="48.8" x2="138.9" y2="20.0" />
        <line x1="131.2" y1="48.8" x2="190.0" y2="23.8" /><line x1="139.0" y1="62.2" x2="190.0" y2="23.8" />
        <line x1="139.0" y1="62.2" x2="190.0" y2="70.0" /><line x1="139.0" y1="77.8" x2="190.0" y2="70.0" />
        <line x1="30" y1="20" x2="30.0" y2="23.8" /><line x1="30" y1="20" x2="30.0" y2="70.0" />
        <line x1="190" y1="20" x2="190.0" y2="23.8" /><line x1="190" y1="20" x2="190.0" y2="70.0" />
        <line x1="190" y1="120" x2="190.0" y2="116.2" /><line x1="190" y1="120" x2="190.0" y2="70.0" />
        <line x1="30" y1="120" x2="30.0" y2="116.2" /><line x1="30" y1="120" x2="30.0" y2="70.0" />
      </g>
      <polygon points="139.0,77.8 131.2,91.2 117.8,99.0 102.2,99.0 88.8,91.2 81.0,77.8 81.0,62.2 88.8,48.8 102.2,41.0 117.8,41.0 131.2,48.8 139.0,62.2" fill="#fff" stroke="#2B4C9B" strokeWidth="2" />
      <text x="110" y="74" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="10" fontWeight="700" fill="#2B4C9B">12 facets</text>
    </svg>
  );
}

function DrawingFamilyArt() {
  return (
    <svg viewBox="0 0 220 140" role="img" aria-label="A 2D front view with hidden lines and a dimension">
      <defs>
        <marker id="family-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,1 L10,5 L0,9 z" fill="#3A4256" />
        </marker>
      </defs>
      <rect x="40" y="30" width="140" height="56" fill="#fff" stroke="#16112E" strokeWidth="2" />
      <line x1="95" y1="30" x2="95" y2="86" stroke="#6B6680" strokeWidth="1.4" strokeDasharray="6 4" />
      <line x1="125" y1="30" x2="125" y2="86" stroke="#6B6680" strokeWidth="1.4" strokeDasharray="6 4" />
      <line x1="110" y1="22" x2="110" y2="94" stroke="#6B6680" strokeWidth="1" strokeDasharray="12 3 2 3" />
      <line x1="40" y1="92" x2="40" y2="112" stroke="#3A4256" strokeOpacity=".5" />
      <line x1="180" y1="92" x2="180" y2="112" stroke="#3A4256" strokeOpacity=".5" />
      <line x1="40" y1="106" x2="180" y2="106" stroke="#3A4256" strokeWidth="1.2" markerStart="url(#family-arrow)" markerEnd="url(#family-arrow)" />
      <text x="110" y="101" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="11" fontWeight="700" fill="#3A4256">160</text>
      <text x="110" y="128" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="10" fontWeight="600" fill="#6B6680">FRONT VIEW</text>
    </svg>
  );
}

function MatrixCell({ from, to }) {
  const same = from.id === to.id;
  const ok = !same && routeOk(from.id, to.id);
  const kind = ok ? kindOf(from.id, to.id) : "";
  return (
    <td className={[to.start ? styles.gl : "", same ? styles.self : ""].filter(Boolean).join(" ")}>
      {same ? (
        <span className={styles.na} aria-label="Same format">–</span>
      ) : ok ? (
        <Link
          className={styles[kind]}
          href={`/tools/convert-${from.id.toLowerCase()}-to-${to.id.toLowerCase()}`}
          aria-label={`${from.id} to ${to.id} converter`}
          title={`${from.id} to ${to.id}`}
        >
          {to.id}
        </Link>
      ) : (
        <span className={styles.na} aria-label="Not available">·</span>
      )}
    </td>
  );
}

function ConversionMatrix() {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.matrix}>
        <caption className={styles.srOnly}>All 74 CAD conversion routes on Marathon OS. Rows are the format you have, columns are the format you need.</caption>
        <thead>
          <tr>
            <th scope="col">From ↓ To →</th>
            {MATRIX.map((col) => (
              <th key={col.id} scope="col" className={col.start ? styles.gl : undefined}>
                {col.id}<small>{col.group}</small>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MATRIX.map((row) => (
            <tr key={row.id} className={row.end ? styles.grpEnd : undefined}>
              <th scope="row">{row.id}<small>{row.group}</small></th>
              {MATRIX.map((col) => <MatrixCell key={`${row.id}-${col.id}`} from={row} to={col} />)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  );
}

function JobIcon({ id }) {
  if (id === "mesh") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 3 8v8l9 5 9-5V8z" /><path d="M3 8l9 5 9-5M12 13v8M3 16l9-8 9 8" /></svg>
    );
  }
  if (id === "supplier") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 21V10l6 4V10l6 4V6l6 3v12z" /><path d="M7 17h2M13 17h2" /></svg>
    );
  }
  if (id === "cnc") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M8.1 8.1 20 20M8.1 15.9 20 4" /></svg>
    );
  }
  if (id === "render") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z" /></svg>
    );
  }
  return <ToolIcon id={id === "draft" ? "draft" : "print"} />;
}

function ToolIcon({ id }) {
  if (id === "draft") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19l7-7 3 3-7 7z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z" /><circle cx="11" cy="11" r="2" /></svg>
    );
  }
  if (id === "print") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9V3h12v6M6 18H4a1 1 0 01-1-1v-6a2 2 0 012-2h14a2 2 0 012 2v6a1 1 0 01-1 1h-2" /><rect x="6" y="14" width="12" height="7" rx="1" /></svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></svg>
  );
}

function ViewerArt() {
  return (
    <svg viewBox="0 0 160 110" aria-hidden="true">
      <ellipse cx="80" cy="62" rx="68" ry="20" fill="none" stroke="#CDB8FA" strokeWidth="2" strokeDasharray="4 6" />
      <path d="M80 18 L114 36 L80 54 L46 36 Z" fill="#F4EFFE" />
      <path d="M114 36 V72 L80 90 V54 Z" fill="#DCCBFB" />
      <path d="M46 36 V72 L80 90 V54 Z" fill="#fff" />
      <path d="M80 18 L114 36 V72 L80 90 L46 72 V36 Z M46 36 L80 54 L114 36 M80 54 V90" fill="none" stroke="#6A2BE0" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M12 62 A68 20 0 0 0 148 62" fill="none" stroke="#6A2BE0" strokeWidth="2.2" strokeDasharray="4 6" />
      <path d="M124 76 l10 2 -7 7" fill="none" stroke="#6A2BE0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BomArt() {
  return (
    <svg viewBox="0 0 160 110" aria-hidden="true">
      <rect x="14" y="12" width="11" height="11" rx="3" fill="#6A2BE0" />
      <rect x="31" y="14" width="64" height="7" rx="3.5" fill="#CDB8FA" />
      <rect x="120" y="11" width="28" height="14" rx="7" fill="#E8F6EC" />
      <text x="134" y="21.5" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="9" fontWeight="800" fill="#1E7A3B">×1</text>
      <path d="M21 23 V42 H30" fill="none" stroke="#CDB8FA" strokeWidth="1.6" />
      <rect x="32" y="37" width="11" height="11" rx="3" fill="#A57BFF" />
      <rect x="49" y="39" width="52" height="7" rx="3.5" fill="#E4D9FB" />
      <rect x="120" y="36" width="28" height="14" rx="7" fill="#E8F6EC" />
      <text x="134" y="46.5" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="9" fontWeight="800" fill="#1E7A3B">×4</text>
      <path d="M21 48 V67 H30" fill="none" stroke="#CDB8FA" strokeWidth="1.6" />
      <rect x="32" y="62" width="11" height="11" rx="3" fill="#A57BFF" />
      <rect x="49" y="64" width="40" height="7" rx="3.5" fill="#E4D9FB" />
      <rect x="120" y="61" width="28" height="14" rx="7" fill="#E8F6EC" />
      <text x="134" y="71.5" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="9" fontWeight="800" fill="#1E7A3B">×2</text>
      <path d="M39 73 V92 H48" fill="none" stroke="#CDB8FA" strokeWidth="1.6" />
      <rect x="50" y="87" width="11" height="11" rx="3" fill="#A57BFF" />
      <rect x="67" y="89" width="34" height="7" rx="3.5" fill="#E4D9FB" />
      <rect x="120" y="86" width="28" height="14" rx="7" fill="#E8F6EC" />
      <text x="134" y="96.5" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="9" fontWeight="800" fill="#1E7A3B">×12</text>
    </svg>
  );
}

function DrawingArt() {
  return (
    <svg viewBox="0 0 160 110" aria-hidden="true">
      <rect x="10" y="8" width="140" height="94" rx="4" fill="#fff" stroke="#16112E" strokeWidth="1.6" />
      <rect x="22" y="20" width="44" height="26" fill="none" stroke="#16112E" strokeWidth="1.6" />
      <circle cx="44" cy="33" r="6" fill="none" stroke="#16112E" strokeWidth="1.4" />
      <rect x="22" y="56" width="44" height="18" fill="none" stroke="#16112E" strokeWidth="1.6" />
      <path d="M38 56 V74 M50 56 V74" stroke="#6B6680" strokeDasharray="3 2" />
      <rect x="74" y="56" width="22" height="18" fill="none" stroke="#16112E" strokeWidth="1.6" />
      <path d="M22 82 H66" stroke="#6A2BE0" strokeWidth="1.4" />
      <path d="M22 79 V85 M66 79 V85" stroke="#6A2BE0" strokeWidth="1.4" />
      <path d="M112 22 L130 31 L112 40 L94 31 Z" fill="#F1EAFE" stroke="#16112E" strokeWidth="1.4" />
      <path d="M94 31 V44 L112 53 V40 M130 31 V44 L112 53" fill="#E4D9FB" stroke="#16112E" strokeWidth="1.4" />
      <rect x="104" y="72" width="46" height="30" fill="#F7F4FD" stroke="#16112E" strokeWidth="1.4" />
      <path d="M104 82 H150 M104 92 H150 M127 82 V102" stroke="#16112E" strokeWidth=".8" />
    </svg>
  );
}

function LibraryArt() {
  return (
    <svg viewBox="0 0 160 110" aria-hidden="true">
      <rect x="14" y="10" width="40" height="40" rx="10" fill="#F4EFFE" stroke="#E7E2F2" />
      <g transform="translate(22 18)" fill="none" stroke="#6A2BE0" strokeWidth="1.6" strokeLinejoin="round">
        <polygon points="21.4,10.3 21.4,13.7 19.0,13.5 18.1,15.9 19.9,17.5 17.5,19.9 15.9,18.1 13.5,19.0 13.7,21.4 10.3,21.4 10.5,19.0 8.1,18.1 6.5,19.9 4.1,17.5 5.9,15.9 5.0,13.5 2.6,13.7 2.6,10.3 5.0,10.5 5.9,8.1 4.1,6.5 6.5,4.1 8.1,5.9 10.5,5.0 10.3,2.6 13.7,2.6 13.5,5.0 15.9,5.9 17.5,4.1 19.9,6.5 18.1,8.1 19.0,10.5" />
        <circle cx="12" cy="12" r="3" />
      </g>
      <rect x="60" y="10" width="40" height="40" rx="10" fill="#EAF0FD" stroke="#E7E2F2" />
      <g transform="translate(68 18)" fill="none" stroke="#2B4C9B" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9z" />
        <circle cx="12" cy="12" r="3.5" />
      </g>
      <rect x="106" y="10" width="40" height="40" rx="10" fill="#fff" stroke="#E7E2F2" />
      <g transform="translate(114 18)" fill="none" stroke="#6A2BE0" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M5 3h5v12h9v6H5z" />
        <circle cx="7.5" cy="7" r="1" />
        <circle cx="15" cy="18" r="1" />
      </g>
      <rect x="14" y="56" width="40" height="40" rx="10" fill="#F4EFFE" stroke="#E7E2F2" />
      <g transform="translate(22 64)" fill="none" stroke="#6A2BE0" strokeWidth="1.6" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="5.8" r="1" />
        <circle cx="18.2" cy="12" r="1" />
        <circle cx="12" cy="18.2" r="1" />
        <circle cx="5.8" cy="12" r="1" />
      </g>
      <rect x="60" y="56" width="40" height="40" rx="10" fill="#EAF0FD" stroke="#E7E2F2" />
      <g transform="translate(68 64)" fill="none" stroke="#2B4C9B" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M2 10h5V8h10v2h5v4h-5v2H7v-2H2z" />
      </g>
      <rect x="106" y="56" width="40" height="40" rx="10" fill="#fff" stroke="#E7E2F2" />
      <g transform="translate(114 64)" fill="none" stroke="#6A2BE0" strokeWidth="1.6" strokeLinejoin="round">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="7" cy="10" r="1.2" />
        <circle cx="17" cy="10" r="1.2" />
        <circle cx="7" cy="14" r="1.2" />
        <circle cx="17" cy="14" r="1.2" />
      </g>
    </svg>
  );
}

function TabIcon({ id }) {
  if (id === "view") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
    );
  }
  if (id === "bom") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg>
    );
  }
  if (id === "draw") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="1" /><path d="M7 15h4v-4H7zM14 8h3M14 12h3M14 16h3" /></svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h13l-4-4M17 17H4l4 4" /></svg>
  );
}

function HeroViz() {
  return (
    <svg viewBox="0 0 560 200" role="img" aria-label="The same part as an exact STEP solid and as a faceted STL mesh">
      <defs>
        <linearGradient id="home-cyl" x1="0" x2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor="#F1EAFE" />
          <stop offset="0.8" stopColor="#C9B3F7" />
          <stop offset="1" stopColor="#E6DAFD" />
        </linearGradient>
      </defs>
      <path d="M40 58 V120 A78 24 0 0 0 196 120 V58 Z" fill="url(#home-cyl)" />
      <ellipse cx="118" cy="58" rx="78" ry="24" fill="#FBF9FF" />
      <ellipse cx="118" cy="58" rx="24" ry="7.4" fill="#4716B2" />
      <path d="M94 58 A24 7.4 0 0 0 142 58" fill="none" stroke="#8B5CF6" strokeWidth="1.5" />
      <g stroke="#6A2BE0" strokeOpacity="0.45" strokeWidth="0.9">
        <polygon points="520,58 514,67 514,129 520,120" fill="#D0BDFA" />
        <polygon points="514,67 497,75 497,137 514,129" fill="#D9C9FB" />
        <polygon points="497,75 472,80 472,142 497,137" fill="#E3D8FC" />
        <polygon points="472,80 442,82 442,144 472,142" fill="#EEE7FD" />
        <polygon points="442,82 412,80 412,142 442,144" fill="#F7F4FE" />
        <polygon points="412,80 387,75 387,137 412,142" fill="#FEFEFE" />
        <polygon points="387,75 370,67 370,129 387,137" fill="#FFFFFF" />
        <polygon points="370,67 364,58 364,120 370,129" fill="#FFFFFF" />
      </g>
      <polygon points="520,58 514,67 497,75 472,80 442,82 412,80 387,75 370,67 364,58 370,49 387,41 412,36 442,34 472,36 497,41 514,49" fill="#FBF9FF" stroke="#6A2BE0" strokeOpacity="0.45" strokeWidth="0.9" />
      <polygon points="466,58 459,63 442,65 425,63 418,58 425,53 442,51 459,53" fill="#4716B2" />
      <g transform="translate(280 92)">
        <circle r="24" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.4)" />
        <path d="M-9 0 H9 M3 -6 L9 0 L3 6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="118" y="172" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="17" fontWeight="800" fill="#fff">STEP</text>
      <text x="118" y="190" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="500" fill="#E3D5FF">exact B-rep · true circle</text>
      <text x="442" y="172" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="17" fontWeight="800" fill="#fff">STL</text>
      <text x="442" y="190" textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="13" fontWeight="500" fill="#E3D5FF">triangle mesh · no units</text>
    </svg>
  );
}

export default HomeHero;
