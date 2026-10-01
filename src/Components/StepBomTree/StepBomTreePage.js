"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  Check,
  CheckCircle2,
  Clock3,
  Command,
  CornerDownRight,
  Download,
  Gem,
  Hash,
  Info,
  List,
  LockKeyhole,
  Monitor,
  ShieldCheck,
  Upload,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/Components/HomePages/Footer/Footer";
import {
  getOrCreateStepBomUuid,
  pollStepBomJob,
  uploadStepBomFile,
  downloadStepBomReport,
} from "@/api/stepBomApi";
import { boxMeshFromBbox, renderMeshThumb } from "./meshThumb";
import styles from "./StepBomTreePage.module.css";

const STEP_EXT = /\.(step|stp)$/i;
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;
const MAX_UPLOAD_LABEL = "100 MB";

const EXTRACT_FEATURES = [
  {
    Icon: Command,
    title: "Assembly hierarchy",
    description:
      "See parent and child components as a tree instead of working from a flat list of solids.",
  },
  {
    Icon: List,
    title: "Parts list",
    description:
      "Flatten available components into a BOM-style table that is easier to review, count and hand off.",
  },
  {
    Icon: X,
    title: "Component quantities",
    description:
      "Count repeated component instances when the STEP assembly structure identifies them consistently.",
  },
  {
    Icon: Hash,
    title: "Names and identifiers",
    description:
      "Surface available component names, product IDs and other identifiers stored in the source file.",
  },
  {
    Icon: CornerDownRight,
    title: "Assembly levels",
    description:
      "Separate top-level assemblies, subassemblies and parts so the BOM reflects product structure.",
  },
  {
    Icon: Download,
    title: "Export-ready table",
    description:
      "Prepare the extracted list for quoting, procurement, documentation or a spreadsheet workflow.",
  },
];

const HOW_IT_WORKS = [
  {
    title: "Upload the STEP assembly",
    description:
      "Choose a .step or .stp file. Marathon OS reads the file and checks whether an assembly structure is present.",
  },
  {
    title: "Build the assembly tree",
    description:
      "Available parent-child relationships, product names and repeated component instances are organized into a hierarchy.",
  },
  {
    title: "Review and export the BOM",
    description:
      "Inspect quantities and component information, then move the resulting parts list into the next engineering or sourcing workflow.",
  },
];

const OFTEN_AVAILABLE = [
  "Assembly and subassembly relationships",
  "Component or product names",
  "Repeated component instances and quantities",
  "Part or product identifiers",
  "Hierarchy level and parent component",
];

const MAY_BE_MISSING = [
  "Native feature history, sketches and constraints",
  "Supplier, price or procurement data not embedded in the file",
  "Custom ERP/PDM attributes omitted during export",
  "Meaningful hierarchy after a flattened export",
  "Accurate manufacturing intent from geometry alone",
];

const USE_CASES = [
  {
    label: "Quoting",
    title: "Count parts before estimating work",
    description:
      "Understand how many unique and repeated components are present before building a quote.",
  },
  {
    label: "Procurement",
    title: "Turn an assembly into a sourcing list",
    description: "Create a structured starting point for purchasing or supplier review.",
  },
  {
    label: "Documentation",
    title: "Recover a readable product structure",
    description: "Review assembly levels when the native source model is not available.",
  },
  {
    label: "CAD review",
    title: "Check whether a STEP file is truly assembled",
    description:
      "See whether the export contains product hierarchy or only flattened geometry.",
  },
];

const WORKFLOW_LINKS = [
  {
    label: "View",
    title: "STEP File Viewer",
    description: "Inspect the geometry, orientation and overall model in your browser.",
    href: "/tools/step-file-viewer",
  },
  {
    label: "Convert",
    title: "3D CAD File Converter",
    description: "Convert supported CAD, mesh and drawing formats for the next application.",
    href: "/tools/3d-cad-file-converter",
  },
  {
    label: "Document",
    title: "STEP to 2D Drawings",
    description: "Turn a supported STEP or STP model into a multi-view drawing workflow.",
    href: "/tools/cad-drawing-pipeline",
  },
];

const FAQ_ITEMS = [
  {
    question: "Can a STEP file contain a bill of materials?",
    answer:
      "A STEP assembly can contain product structure, component names and repeated component instances that can be organized into a BOM. The exact result depends on what the source CAD system included in the exported STEP file.",
  },
  {
    question: "What information can be extracted from a STEP assembly?",
    answer:
      "Depending on the file, the extractor can organize assembly relationships into a hierarchy and parts table, including component names, quantities and available product identifiers. Some STEP files contain less metadata than others.",
  },
  {
    question: "Do STEP and STP mean the same thing?",
    answer:
      "STEP and STP are commonly used filename extensions for files based on the ISO 10303 STEP standard. Both extensions are widely used for CAD data exchange.",
  },
  {
    question: "Will every STEP file have an assembly tree?",
    answer:
      "No. A single-part STEP file may contain only one product, while some exports flatten assemblies or omit product structure. In those cases there may be little or no hierarchy to extract.",
  },
  {
    question: "Can this recreate the original CAD feature tree?",
    answer:
      "No. A BOM or assembly tree describes product structure. It does not recreate native sketches, constraints, parametric features or the original modeling history from SolidWorks, Inventor, Creo or another authoring system.",
  },
  {
    question: "Can I use the extracted BOM for manufacturing?",
    answer:
      "Use it as a starting point and verify the result against the source model or engineering documentation before production. Supplier information, material specifications, finishes, tolerances or custom PDM fields may not be stored in the STEP file.",
  },
  {
    question: "How are uploaded files handled?",
    answer:
      "Uploaded files are transferred securely, processed privately and automatically deleted within 7 days. Uploaded designs are not intended to become part of the public CAD library.",
  },
];

function formatMb(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 MB";
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatNumber(value, digits = 1) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: digits });
}

function formatSize(bbox) {
  if (!bbox) return "—";
  const x = Number(bbox.x);
  const y = Number(bbox.y);
  const z = Number(bbox.z);
  if (![x, y, z].every(Number.isFinite)) return "—";
  return `${formatNumber(x, 1)} × ${formatNumber(y, 1)} × ${formatNumber(z, 1)} mm`;
}

const STEEL_DENSITY_G_CM3 = 7.85;

function estMassKg(volumeMm3, qty = 1) {
  const volume = Number(volumeMm3) || 0;
  const count = Number(qty) || 1;
  if (volume <= 0) return 0;
  return (volume * STEEL_DENSITY_G_CM3 * count) / 1e6;
}

function formatMass(kg) {
  const n = Number(kg);
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n >= 100) return `${formatNumber(n, 1)} kg`;
  if (n >= 1) return `${formatNumber(n, 2)} kg`;
  return `${formatNumber(n * 1000, 1)} g`;
}

function partNumber(node) {
  const values = [node?.part_number, node?.source_name, node?.name];
  for (const raw of values) {
    const text = String(raw || "").trim();
    if (/^\d{1,4}$/.test(text)) return text;
  }
  return "";
}

function formatLxWxH(bbox) {
  if (!bbox) return "";
  const x = Number(bbox.x);
  const y = Number(bbox.y);
  const z = Number(bbox.z);
  if (![x, y, z].every(Number.isFinite)) return "";
  return `${x.toFixed(1)} x ${y.toFixed(1)} x ${z.toFixed(1)}`;
}

function estMassG(volumeMm3, qty = 1) {
  return Number((estMassKg(volumeMm3, qty) * 1000).toFixed(1));
}

function outcomeScore(status) {
  return { pass: 1, warn: 0.55, fail: 0.15, na: 0 }[status] || 0;
}

function usableBomIdentity(row) {
  const values = [row?.part_number, row?.source_name, row?.name, row?.designation];
  for (const raw of values) {
    const text = String(raw || "").trim();
    if (!text) continue;
    if (/^(part|solid|body|compound|shape|assembly|product)(\s*\d+)?$/i.test(text)) continue;
    if (/^part\s+[\d.,]+\s*[×x]\s*/i.test(text)) continue;
    if (["assembly", "unnamed", "—", "-"].includes(text.toLowerCase())) continue;
    return true;
  }
  return false;
}

function scoreBomQualityClient({ flat = [], summary = {} } = {}) {
  const parts = flat.filter((row) => String(row?.type || "").toLowerCase() === "part");
  const assemblies = flat.filter((row) => String(row?.type || "").toLowerCase() === "assembly");
  const maxLevel = flat.reduce((max, row) => Math.max(max, Number(row?.level) || 0), 0);
  const uniquePartCount =
    Number(summary.unique_part_count) ||
    (Array.isArray(summary.unique_parts) ? summary.unique_parts.length : parts.length);
  const assemblyCount = Number(summary.assembly_count) || assemblies.length;

  let structure = "warn";
  if (!parts.length) structure = "fail";
  else if (maxLevel <= 0 && assemblyCount <= 1 && uniquePartCount <= 1) structure = "warn";
  else if (maxLevel >= 1 || assemblyCount >= 1) structure = "pass";

  const identityPct = parts.length
    ? Math.round((1000 * parts.filter(usableBomIdentity).length) / parts.length) / 10
    : 0;
  const identity = !parts.length ? "fail" : identityPct >= 80 ? "pass" : identityPct >= 50 ? "warn" : "fail";

  const totalQty = parts.reduce((sum, part) => sum + (Number(part.quantity) || 1), 0);
  const quantity = !parts.length ? "fail" : totalQty >= uniquePartCount ? "pass" : "warn";

  const geometryPct = parts.length
    ? Math.round((1000 * parts.filter((part) => Number(part.volume_mm3) > 0).length) / parts.length) / 10
    : 0;
  const geometry = !parts.length ? "fail" : geometryPct >= 95 ? "pass" : geometryPct >= 70 ? "warn" : "fail";

  const previewPct = parts.length
    ? Math.round((1000 * parts.filter((part) => part.preview_id).length) / parts.length) / 10
    : 0;
  const preview = !parts.length ? "fail" : previewPct >= 90 ? "pass" : previewPct >= 60 ? "warn" : "fail";

  const checks = [
    { status: structure, weight: 0.25 },
    { status: identity, weight: 0.2 },
    { status: quantity, weight: 0.2 },
    { status: geometry, weight: 0.2 },
    { status: preview, weight: 0.15 },
  ];
  const confidence =
    Math.round(checks.reduce((sum, check) => sum + check.weight * outcomeScore(check.status) * 100, 0) * 10) /
    10;
  const statuses = checks.map((check) => check.status);
  const verdict = statuses.includes("fail") ? "fail" : statuses.includes("warn") ? "warn" : "pass";
  return {
    confidence_pct: confidence,
    verdict_label: {
      pass: "COMPLETED",
      warn: "COMPLETED WITH WARNINGS",
      fail: "COMPLETED WITH ERRORS",
    }[verdict],
  };
}

function statusLabel(status) {
  if (status === "PENDING") return "Queued on Kafka topic sample_step";
  if (status === "PROCESSING") return "Extracting BOM and building accuracy PDF";
  if (status === "COMPLETED") return "BOM tree + accuracy PDF ready";
  if (status === "FAILED") return "Extraction failed";
  return "Waiting";
}

function repairMojibake(value) {
  const text = String(value || "");
  if (!text) return "";
  try {
    const bytes = Uint8Array.from([...text].map((ch) => ch.charCodeAt(0)));
    if (bytes.some((b) => b > 255)) return text;
    if (!bytes.some((b) => b >= 128)) return text;
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes) || text;
  } catch {
    return text;
  }
}

function stripInstanceSuffix(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[\s._-]*\d{3,}$/u, "")
    .trim();
}

function canonicalName(value) {
  let text = repairMojibake(String(value || "")).replace(/\s+/g, " ").trim();
  let previous = "";
  while (text && text !== previous) {
    previous = text;
    text = text
      .replace(/\s*\(\s*solid\s+\d+\s*\)\s*$/i, "")
      .replace(/[._][A-Za-z]*\d{3,}$/i, "")
      .replace(/\s+[A-Za-z][A-Za-z0-9_-]*\d{3,}$/i, "")
      .replace(/[\s._-]*\d{3,}$/u, "")
      .trim();
  }
  return text || stripInstanceSuffix(repairMojibake(value)) || "Part";
}

function isGenericName(value) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return true;
  if (/^open\s+cascade\s+step\s+translator(?:\s+[\d.]+)*(?:\s+\d+)*$/i.test(text)) return true;
  if (/^(part|solid|compound|shape|body|imported\s*part)(?:[\s._-]*\d+)*$/i.test(text)) return true;
  if (/^part\s+\d/i.test(text)) return true;
  return false;
}

function partLabel(node) {
  if (isGenericName(node?.name)) {
    const size = formatSize(node?.bbox_mm);
    return size !== "—" ? `Part ${size}` : "Part";
  }
  const cleaned = canonicalName(node?.name);
  if (!cleaned || isGenericName(cleaned)) {
    const size = formatSize(node?.bbox_mm);
    return size !== "—" ? `Part ${size}` : "Part";
  }
  return cleaned;
}

function isAssemblyNode(node) {
  return node?.type === "assembly" || (Array.isArray(node?.children) && node.children.length > 0);
}

function instanceSuffix(value) {
  const match = String(value || "").trim().match(/(\d{2,})\s*$/);
  return match ? match[1] : "";
}

function assemblyLabel(node) {
  const raw = String(node?.name || "").trim();
  if (raw && !isGenericName(raw)) return canonicalName(raw);
  const inst = instanceSuffix(raw) || instanceSuffix(node?.source_name);
  return inst ? `Assembly ${inst}` : "Assembly";
}

function nodeLabel(node) {
  return isAssemblyNode(node) ? assemblyLabel(node) : partLabel(node);
}

function geomKey(node) {
  const box = node?.bbox_mm || {};
  const dims = [Number(box.x) || 0, Number(box.y) || 0, Number(box.z) || 0]
    .map((value) => (Math.round(value * 2) / 2).toFixed(1))
    .sort((left, right) => Number(left) - Number(right));
  const vol = Math.abs(Number(node?.volume_mm3) || 0);
  const volKey = vol >= 50 ? String(Math.round(vol)) : vol.toFixed(1);
  return `${volKey}|${dims.join("x")}`;
}

function mergeUniquePartList(parts) {
  const grouped = new Map();
  for (const part of parts || []) {
    const key = geomKey(part);
    const qty = Number(part.quantity) || 1;
    const existing = grouped.get(key);
    if (existing) {
      existing.quantity += qty;
      if (!existing.preview_id && part.preview_id) existing.preview_id = part.preview_id;
      continue;
    }
    grouped.set(key, {
      ...part,
      name: partLabel(part),
      quantity: qty,
    });
  }
  return Array.from(grouped.values());
}

function childMergeKey(node) {
  if (isAssemblyNode(node)) {
    const kids = Array.isArray(node?.children) ? node.children : [];
    const nested = kids
      .map((child) => `${childMergeKey(child)}×${Number(child.quantity) || 1}`)
      .sort()
      .join(",");
    return `asm|${geomKey(node)}|${nested}`;
  }
  return `part|${geomKey(node)}`;
}

function collapseNode(node) {
  if (!node) return node;
  const grouped = new Map();
  for (const child of node.children || []) {
    const collapsed = collapseNode(child);
    const key = childMergeKey(collapsed);
    const qty = Number(collapsed.quantity) || 1;
    const existing = grouped.get(key);
    if (existing) {
      existing.quantity = (Number(existing.quantity) || 1) + qty;
      if (!existing.preview_id && collapsed.preview_id) existing.preview_id = collapsed.preview_id;
      if (!existing.part_number) existing.part_number = partNumber(collapsed);
      continue;
    }
    grouped.set(key, {
      ...collapsed,
      name: nodeLabel(collapsed),
      part_number: partNumber(collapsed),
      quantity: qty,
    });
  }
  const children = Array.from(grouped.values());
  return {
    ...node,
    name: nodeLabel({ ...node, children }),
    part_number: partNumber(node),
    quantity: Number(node.quantity) || 1,
    children,
  };
}

function flattenCollapsed(node, level = 0, parentQty = 1, rows = []) {
  if (!node) return rows;
  const qty = Number(node.quantity) || 1;
  const total = qty * (Number(parentQty) || 1);
  const box = node.bbox_mm || {};
  rows.push({
    level,
    part_number: partNumber(node),
    designation: nodeLabel(node),
    name: nodeLabel(node),
    type: node.type === "assembly" ? "Assembly" : "Part",
    quantity: qty,
    total_quantity: total,
    size_x: Number(box.x) || 0,
    size_y: Number(box.y) || 0,
    size_z: Number(box.z) || 0,
    lxwxh: formatLxWxH(node.bbox_mm),
    volume_mm3: Number(node.volume_mm3) || 0,
    area_mm2: Number(node.area_mm2) || 0,
    solid_count: Number(node.solid_count) || 0,
    mass_kg: estMassKg(node.volume_mm3, total),
    mass_g: estMassG(node.volume_mm3, 1),
    material: "Steel (est.)",
    bbox_mm: node.bbox_mm || null,
    preview_id: node.preview_id || "",
  });
  for (const child of node.children || []) {
    flattenCollapsed(child, level + 1, total, rows);
  }
  return rows;
}

function styleHeader(row) {
  row.font = { bold: true, color: { argb: "FFFFFFFF" } };
  row.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1F2937" },
  };
  row.alignment = { vertical: "middle" };
}

async function downloadBomExcel({ fileName, summary, uniqueParts, treeRows }) {
  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Marathon STEP BOM";
  workbook.created = new Date();

  const summarySheet = workbook.addWorksheet("Summary");
  summarySheet.columns = [
    { header: "Field", key: "field", width: 28 },
    { header: "Value", key: "value", width: 40 },
  ];
  styleHeader(summarySheet.getRow(1));
  [
    ["File", fileName || "step-bom"],
    ["Assemblies", summary?.assembly_count || 0],
    ["Unique parts", uniqueParts.length],
    ["Total quantity", summary?.total_part_quantity || uniqueParts.reduce((sum, part) => sum + (Number(part.quantity) || 0), 0)],
    ["Tree nodes", treeRows.length || summary?.node_count || 0],
    ["Est. mass density", "Mild steel 7.85 g/cm³"],
    ["Est. mass method", "Solid volume × density (not bounding-box volume)"],
    ["Est. total mass", formatMass(uniqueParts.reduce((sum, part) => sum + estMassKg(part.volume_mm3, part.quantity), 0))],
  ].forEach(([field, value]) => summarySheet.addRow({ field, value }));

  const partsSheet = workbook.addWorksheet("Parts");
  partsSheet.columns = [
    { header: "Part number", key: "part_number", width: 14 },
    { header: "Designation", key: "name", width: 42 },
    { header: "Qty", key: "quantity", width: 10 },
    { header: "L x W x H (mm)", key: "lxwxh", width: 28 },
    { header: "Size X (mm)", key: "size_x", width: 14 },
    { header: "Size Y (mm)", key: "size_y", width: 14 },
    { header: "Size Z (mm)", key: "size_z", width: 14 },
    { header: "Volume (mm³)", key: "volume_mm3", width: 16 },
    { header: "Est. mass (g)", key: "mass_g", width: 16 },
    { header: "Est. mass (kg)", key: "mass_kg", width: 16 },
    { header: "Material", key: "material", width: 16 },
    { header: "Area (mm²)", key: "area_mm2", width: 14 },
  ];
  styleHeader(partsSheet.getRow(1));
  uniqueParts.forEach((part) => {
    const box = part.bbox_mm || {};
    partsSheet.addRow({
      part_number: partNumber(part),
      name: partLabel(part),
      quantity: Number(part.quantity) || 1,
      lxwxh: formatLxWxH(box),
      size_x: Number(box.x) || 0,
      size_y: Number(box.y) || 0,
      size_z: Number(box.z) || 0,
      volume_mm3: Number(part.volume_mm3) || 0,
      mass_g: estMassG(part.volume_mm3, 1),
      mass_kg: Number(estMassKg(part.volume_mm3, part.quantity).toFixed(4)),
      material: "Steel (est.)",
      area_mm2: Number(part.area_mm2) || 0,
    });
  });

  const treeSheet = workbook.addWorksheet("Assembly tree");
  treeSheet.columns = [
    { header: "Level", key: "level", width: 10 },
    { header: "Part number", key: "part_number", width: 14 },
    { header: "Designation", key: "name", width: 48 },
    { header: "Type", key: "type", width: 12 },
    { header: "Qty", key: "quantity", width: 10 },
    { header: "Total qty", key: "total_quantity", width: 12 },
    { header: "L x W x H (mm)", key: "lxwxh", width: 28 },
    { header: "Size X (mm)", key: "size_x", width: 14 },
    { header: "Size Y (mm)", key: "size_y", width: 14 },
    { header: "Size Z (mm)", key: "size_z", width: 14 },
    { header: "Volume (mm³)", key: "volume_mm3", width: 16 },
    { header: "Est. mass (g)", key: "mass_g", width: 16 },
    { header: "Est. mass (kg)", key: "mass_kg", width: 16 },
    { header: "Material", key: "material", width: 16 },
    { header: "Area (mm²)", key: "area_mm2", width: 14 },
    { header: "Solids", key: "solid_count", width: 10 },
  ];
  styleHeader(treeSheet.getRow(1));
  treeRows.forEach((row) => {
    const added = treeSheet.addRow({
      ...row,
      name: `${"  ".repeat(row.level)}${row.name}`,
      material: row.material || "—",
    });
    if (row.type === "Assembly") {
      added.font = { bold: true };
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${(fileName || "step-bom").replace(/\.[^.]+$/, "")}-bom.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
}

function AssemblyTreeItem({ node, depth = 0 }) {
  const children = Array.isArray(node?.children) ? node.children : [];
  const label = nodeLabel(node);
  const qty = Number(node?.quantity) || 1;
  return (
    <li className={styles.outputTreeItem} style={{ "--depth": depth }}>
      <label className={styles.outputTreeRow}>
        <input type="checkbox" defaultChecked className={styles.outputTreeCheck} />
        <span className={styles.outputTreeName}>
          {label}
          {qty > 1 ? <em>×{qty}</em> : null}
        </span>
      </label>
      {children.length ? (
        <ul className={styles.outputTreeList}>
          {children.map((child, index) => (
            <AssemblyTreeItem
              key={`${childMergeKey(child)}-${index}`}
              node={child}
              depth={depth + 1}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function BomPartThumb({ mesh, bbox, size = 44, alt, onOpen }) {
  const src = useMemo(() => {
    const fromMesh = mesh ? renderMeshThumb(mesh, size) : "";
    if (fromMesh) return fromMesh;
    if (bbox) return renderMeshThumb(boxMeshFromBbox(bbox, `bbox-${size}`), size);
    return "";
  }, [bbox, mesh, size]);

  if (!src) {
    return <div className={styles.bomThumbPlaceholder} style={{ width: size, height: size }} aria-hidden />;
  }

  return (
    <button
      type="button"
      className={styles.bomThumbBtn}
      onClick={() => onOpen?.(src, alt)}
      aria-label={alt ? `Open photo of ${alt}` : "Open part photo"}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt || "Part"} className={styles.bomThumb} width={size} height={size} />
    </button>
  );
}

export default function StepBomTreePage() {
  const searchParams = useSearchParams();
  const jobIdFromUrl = searchParams.get("jobId") || searchParams.get("job_id") || "";
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    getOrCreateStepBomUuid();
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (!jobIdFromUrl) return undefined;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    let cancelled = false;

    (async () => {
      setSubmitting(true);
      setError("");
      setJob({ status: "PENDING", job_id: jobIdFromUrl });
      try {
        const finished = await pollStepBomJob(jobIdFromUrl, {
          signal: controller.signal,
          onUpdate: (next) => {
            if (!cancelled) setJob(next);
          },
        });
        if (!cancelled && finished?.status === "FAILED") {
          setError(finished.error_message || "BOM extraction failed.");
        }
      } catch (err) {
        if (controller.signal.aborted || cancelled) return;
        const message = err?.message || "Could not load STEP BOM job.";
        setError(message);
        toast.error(message);
      } finally {
        if (!cancelled) setSubmitting(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [jobIdFromUrl]);

  const summary = job?.bom_summary || null;
  const tree = job?.bom_tree || null;
  const displayTree = useMemo(() => (tree ? collapseNode(tree) : null), [tree]);
  const flat = useMemo(
    () => (Array.isArray(job?.bom_flat) ? job.bom_flat : []),
    [job],
  );
  const partsById = useMemo(() => {
    const map = {};
    for (const part of job?.preview_parts || []) {
      if (part?.id) map[part.id] = part;
    }
    return map;
  }, [job]);

  const uniqueParts = useMemo(() => {
    const fromFlat = flat
      .filter((row) => row?.type === "part")
      .map((row) => ({
        ...row,
        quantity: Number(row.total_quantity) || Number(row.quantity) || 1,
      }));
    const fromSummary = Array.isArray(summary?.unique_parts) ? summary.unique_parts : [];
    return mergeUniquePartList(fromFlat.length ? fromFlat : fromSummary);
  }, [flat, summary]);

  const pickFile = useCallback((nextFile) => {
    if (!nextFile) return;
    if (!STEP_EXT.test(nextFile.name)) {
      toast.error("Only .step or .stp files are allowed.");
      return;
    }
    if (nextFile.size > MAX_UPLOAD_BYTES) {
      toast.error(`File is ${formatMb(nextFile.size)}. Maximum size is ${MAX_UPLOAD_LABEL}.`);
      return;
    }
    setFile(nextFile);
    setError("");
    setJob(null);
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      setDragOver(false);
      pickFile(event.dataTransfer.files?.[0]);
    },
    [pickFile],
  );

  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!file || submitting) return;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setSubmitting(true);
      setError("");
      setJob({ status: "PENDING", file_name: file.name });
      try {
        const data = await uploadStepBomFile(file);
        const created = data?.job || data;
        setJob(created);
        const jobId = created?.job_id;
        if (!jobId) throw new Error("Job was queued but no id was returned.");
        const finished = await pollStepBomJob(jobId, {
          signal: controller.signal,
          onUpdate: setJob,
        });
        if (finished?.status === "FAILED") {
          setError(finished.error_message || "BOM extraction failed.");
        }
      } catch (err) {
        const message = err?.message || "Could not start STEP BOM extraction.";
        setError(message);
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
    [file, submitting],
  );

  const treeRows = useMemo(
    () => (displayTree ? flattenCollapsed(displayTree) : []),
    [displayTree],
  );

  const downloadExcel = useCallback(async () => {
    if (!displayTree) return;
    try {
      await downloadBomExcel({
        fileName: file?.name || job?.file_name || "step-bom",
        summary,
        uniqueParts,
        treeRows,
      });
    } catch (err) {
      const message = err?.message || "Could not download Excel.";
      toast.error(message);
    }
  }, [displayTree, file, job, summary, treeRows, uniqueParts]);

  const downloadPdf = useCallback(async () => {
    const pdfUrl = job?.report_pdf_url;
    const htmlUrl = job?.report_html_url;
    if (pdfUrl || htmlUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl || htmlUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.download = `${(job?.file_name || "step-bom").replace(/\.[^.]+$/, "")}-bom-accuracy.${pdfUrl ? "pdf" : "html"}`;
      link.click();
      return;
    }
    const jobId = job?.job_id;
    if (!jobId) {
      toast.error("No completed job to export.");
      return;
    }
    try {
      await downloadStepBomReport(jobId);
      toast.success("BOM accuracy report downloaded.");
    } catch (err) {
      toast.error(err?.message || "Could not download PDF report.");
    }
  }, [job]);

  const showOutput = Boolean(job || displayTree || treeRows.length);
  const jobDone = String(job?.status || "").toUpperCase() === "COMPLETED" && Boolean(displayTree);

  useEffect(() => {
    if (!showOutput) return undefined;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById("step-bom-pipeline")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [showOutput]);
  const bomQuality =
    job?.bom_quality ||
    (jobDone
      ? scoreBomQualityClient({ flat: treeRows, summary: summary || {} })
      : null);
  const confidencePct = Number(bomQuality?.confidence_pct);

  return (
    <div className={styles.root}>
      <section className={styles.hero} aria-label="STEP BOM extractor" id="step-bom-upload">
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <div className={styles.heroBadges}>
              <span className={styles.freeBadge}>
                <Zap size={13} aria-hidden /> STEP &amp; STP supported
              </span>
              <span>
                <Gem size={13} aria-hidden /> BOM + assembly hierarchy
              </span>
              <span>
                <Monitor size={13} aria-hidden /> No software installation
              </span>
            </div>
            <h1>Extract a BOM from a STEP file</h1>
            <p>
              Turn STEP and STP assemblies into a bill of materials and hierarchy so you can
              review names, quantities, and structure without opening CAD software.
            </p>
            <p>
              Results depend on the product structure and metadata present in the source file.
            </p>
            <div className={styles.trustRow}>
              <span>
                <ShieldCheck size={15} aria-hidden /> Encrypted uploads
              </span>
              <span>
                <Upload size={15} aria-hidden /> Up to {MAX_UPLOAD_LABEL}
              </span>
              <span>
                <Clock3 size={15} aria-hidden /> Automatically deleted within 7 days
              </span>
            </div>
          </div>

          <form className={styles.uploadCard} onSubmit={onSubmit} aria-label="Upload STEP assembly">
            <div className={styles.uploadHeader}>
              <div>
                <h2>Upload your STEP or STP assembly</h2>
                <p>
                  Marathon OS reads the available product structure and organizes it into a BOM
                  and assembly tree.
                </p>
              </div>
              <span className={styles.secureBadge}>
                <LockKeyhole size={12} aria-hidden /> Secure
              </span>
            </div>

            <input
              ref={fileInputRef}
              className={styles.fileInputHidden}
              type="file"
              accept=".step,.stp,application/step"
              onChange={(event) => pickFile(event.target.files?.[0])}
            />

            {file ? (
              <div className={styles.selectedFile}>
                <span className={styles.selectedFileIcon} aria-hidden>
                  <Check size={18} />
                </span>
                <div className={styles.selectedFileMeta}>
                  <strong>{file.name}</strong>
                  <span>{formatMb(file.size)}</span>
                </div>
                <button
                  type="button"
                  className={styles.selectedFileClear}
                  onClick={() => {
                    setFile(null);
                    setJob(null);
                    setError("");
                  }}
                  aria-label="Remove file"
                >
                  ×
                </button>
              </div>
            ) : (
              <div
                className={`${styles.dropzone} ${dragOver ? styles.dropzoneDrag : ""}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                <span className={styles.dropIcon} aria-hidden>
                  <Upload size={22} />
                </span>
                <p className={styles.dropHeadline}>Drag and drop your STEP file here</p>
                <p className={styles.dropSub}>or choose a file from your computer</p>
                <span className={styles.browseBtn}>Browse files</span>
                <p className={styles.dropMax}>Maximum file size: {MAX_UPLOAD_LABEL}</p>
              </div>
            )}

            <div className={styles.controlRow}>
              <label className={styles.controlField}>
                Input format
                <span className={styles.controlValue}>STEP / STP</span>
              </label>
              <label className={styles.controlField}>
                Extract
                <span className={styles.controlValue}>BOM + assembly tree</span>
              </label>
            </div>

            <button className={styles.submitBtn} type="submit" disabled={!file || submitting}>
              {submitting ? "Extracting BOM…" : "Extract BOM"}
            </button>

            <div className={styles.notice} role="note">
              <Info size={16} aria-hidden />
              <p>
                This extractor depends on names, quantities, and hierarchy present in the
                original CAD file. Incomplete STEP metadata may produce incomplete results.
              </p>
            </div>
          </form>
        </div>
      </section>

      {showOutput ? (
        <section
          id="step-bom-pipeline"
          className={styles.bomOutput}
          aria-labelledby="step-bom-output-heading"
        >
          <div className={styles.bomOutputInner}>
            <p className={styles.eyebrow}>BOM output</p>
            <h2 id="step-bom-output-heading">See the assembly structure before you export</h2>
            <p className={styles.bomOutputIntro}>
              The page keeps the engineering hierarchy visible on the left and the flattened parts
              list on the right, so users can understand both where a component sits and how many
              times it appears.
            </p>

            {job && !jobDone ? (
              <div className={styles.bomOutputStatus} aria-live="polite">
                <span className={`${styles.statusDot} ${styles[`status_${job.status || "PENDING"}`]}`} />
                <strong>{statusLabel(job.status)}</strong>
                {error ? <p className={styles.bomOutputError}>{error}</p> : null}
              </div>
            ) : null}

            {jobDone ? (
              <div className={styles.bomOutputCard}>
                <div className={styles.bomOutputPane}>
                  <h3>Assembly tree</h3>
                  <ul className={styles.outputTreeList}>
                    <AssemblyTreeItem node={displayTree} />
                  </ul>
                </div>
                <div className={styles.bomOutputPane}>
                  <h3>Bill of materials</h3>
                  <div className={styles.bomTableWrap}>
                    <table className={styles.bomTable}>
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Photo</th>
                          <th>Component</th>
                          <th>Part ID</th>
                          <th>Qty</th>
                          <th>Est. mass</th>
                          <th>Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {treeRows.map((row, index) => {
                          const label = row.designation || row.name;
                          const mesh = row.preview_id ? partsById[row.preview_id] : null;
                          return (
                            <tr key={`${row.name}-${index}`}>
                              <td>{String(index + 1).padStart(2, "0")}</td>
                              <td>
                                <BomPartThumb
                                  mesh={mesh}
                                  bbox={row.bbox_mm}
                                  size={44}
                                  alt={label}
                                  onOpen={(src, alt) => setPhotoPreview({ src, alt })}
                                />
                              </td>
                              <td>{label}</td>
                              <td>{row.part_number || "—"}</td>
                              <td className={styles.bomQty}>{row.quantity}</td>
                              <td className={styles.bomMass}>
                                {row.volume_mm3 ? formatMass(row.mass_kg) : "—"}
                              </td>
                              <td>{row.level}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className={styles.bomActions}>
                    {Number.isFinite(confidencePct) ? (
                      <span className={styles.bomConfidence}>
                        BOM confidence <strong>{formatNumber(confidencePct, 1)}%</strong>
                        {bomQuality?.verdict_label ? (
                          <em> · {bomQuality.verdict_label}</em>
                        ) : null}
                      </span>
                    ) : null}
                    <button
                      type="button"
                      className={styles.bomPdfBtn}
                      onClick={downloadPdf}
                      disabled={!job?.report_pdf_url && !job?.report_html_url && !job?.job_id}
                    >
                      Download PDF report
                    </button>
                    <button type="button" className={styles.bomExportBtn} onClick={downloadExcel}>
                      Export Excel
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {jobDone && job?.time_taken_seconds ? (
              <p className={styles.bomOutputMeta}>
                Finished in {formatNumber(job.time_taken_seconds, 2)}s
                {summary?.assembly_count != null
                  ? ` · ${summary.assembly_count} assemblies · ${uniqueParts.length} unique parts`
                  : null}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className={styles.extracts} aria-labelledby="step-bom-extracts-heading">
        <div className={styles.extractsInner}>
          <p className={styles.eyebrow}>What it extracts</p>
          <h2 id="step-bom-extracts-heading">Turn STEP product structure into useful BOM data</h2>
          <p className={styles.extractsIntro}>
            STEP can hold more than geometry. When the source export contains assembly relationships
            and product metadata, Marathon OS can organize those records into a readable structure
            for review and downstream work.
          </p>
          <div className={styles.extractGrid}>
            {EXTRACT_FEATURES.map(({ Icon, title, description }) => (
              <article key={title} className={styles.extractCard}>
                <span className={styles.extractIcon} aria-hidden>
                  <Icon size={18} />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.howItWorks} aria-labelledby="step-bom-how-heading">
        <div className={styles.howItWorksInner}>
          <p className={styles.eyebrow}>How it works</p>
          <h2 id="step-bom-how-heading">Extract a STEP BOM in three steps</h2>
          <p className={styles.howIntro}>
            No desktop installation is required to inspect the product structure stored in the file.
          </p>
          <div className={styles.howGrid}>
            {HOW_IT_WORKS.map((step, index) => (
              <article key={step.title} className={styles.howStep}>
                <span className={styles.howNumber}>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.limits} aria-labelledby="step-bom-limits-heading">
        <div className={styles.limitsInner}>
          <p className={styles.eyebrow}>Read before extracting</p>
          <h2 id="step-bom-limits-heading">What a STEP BOM can and cannot tell you</h2>
          <p className={styles.limitsIntro}>
            The quality of a generated BOM depends on the way the original CAD system exported the
            STEP file. The extractor should preserve that distinction instead of inventing missing
            engineering information.
          </p>
          <div className={styles.limitsGrid}>
            <article className={styles.limitsColumn}>
              <h3>Often available in structured STEP assemblies</h3>
              <p className={styles.limitsColumnIntro}>
                When included by the exporting CAD application, these fields can support a useful BOM.
              </p>
              <ul>
                {OFTEN_AVAILABLE.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={16} className={styles.limitsCheck} aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className={`${styles.limitsColumn} ${styles.limitsMissing}`}>
              <h3>May be missing or unreliable</h3>
              <p className={styles.limitsColumnIntro}>
                A STEP file is an exchange file, not a replacement for the source CAD/PDM system.
              </p>
              <ul>
                {MAY_BE_MISSING.map((item) => (
                  <li key={item}>
                    <AlertTriangle size={16} className={styles.limitsWarn} aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.useCases} aria-labelledby="step-bom-use-heading">
        <div className={styles.useCasesInner}>
          <p className={styles.eyebrow}>When to use it</p>
          <h2 id="step-bom-use-heading">Built for fast engineering handoffs</h2>
          <p className={styles.useCasesIntro}>
            Use the extractor when you receive a STEP assembly but do not have the original CAD or
            PDM environment that created it.
          </p>
          <div className={styles.useCaseGrid}>
            {USE_CASES.map((item) => (
              <article key={item.label} className={styles.useCaseCard}>
                <p className={styles.useCaseLabel}>{item.label}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.workflow} aria-labelledby="step-bom-workflow-heading">
        <div className={styles.workflowInner}>
          <p className={styles.eyebrow}>Continue the workflow</p>
          <h2 id="step-bom-workflow-heading">Use the STEP file after extracting the BOM</h2>
          <p className={styles.workflowIntro}>
            Move from product structure to visual inspection, format conversion or manufacturing
            documentation with related Marathon OS tools.
          </p>
          <div className={styles.workflowGrid}>
            {WORKFLOW_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className={styles.workflowCard}>
                <p className={styles.workflowLabel}>{item.label}</p>
                <span className={styles.workflowTitle}>
                  {item.title}
                  <ArrowRight size={16} aria-hidden />
                </span>
                <p>{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.faq} aria-labelledby="step-bom-faq-heading">
        <div className={styles.faqInner}>
          <p className={styles.eyebrow}>Frequently asked questions</p>
          <h2 id="step-bom-faq-heading">STEP BOM extractor FAQs</h2>
          <p className={styles.faqIntro}>
            Common questions about STEP assemblies, product structure and BOM extraction.
          </p>
          <div className={styles.faqList}>
            {FAQ_ITEMS.map((item) => (
              <article key={item.question} className={styles.faqItem}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.finalCta} aria-label="Upload STEP file">
        <div className={styles.finalCtaInner}>
          <div>
            <h2>Have a STEP assembly? Extract the structure.</h2>
            <p>Upload the file and turn the product hierarchy into a BOM you can actually review.</p>
          </div>
          <a href="#step-bom-upload" className={styles.finalCtaBtn}>
            Upload STEP file
            <ArrowUp size={16} aria-hidden />
          </a>
        </div>
      </section>

      <Footer />

      {photoPreview?.src ? (
        <button
          type="button"
          className={styles.bomPhotoModal}
          onClick={() => setPhotoPreview(null)}
          aria-label="Close photo preview"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoPreview.src}
            alt={photoPreview.alt || "Part"}
            className={styles.bomPhotoModalImg}
            onClick={(event) => event.stopPropagation()}
          />
        </button>
      ) : null}
    </div>
  );
}
