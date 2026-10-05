"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  uploadStepBomFile,
  downloadStepBomReport,
} from "@/api/stepBomApi";
import { boxMeshFromBbox, renderMeshThumb } from "./meshThumb";
import { stepBomJobPath } from "@/lib/stepBomRoutes";
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

function dash(value) {
  if (value == null || value === "") return "—";
  return String(value);
}

function fmtXyz(point) {
  if (!point || typeof point !== "object") return "—";
  const x = Number(point.x);
  const y = Number(point.y);
  const z = Number(point.z);
  if (![x, y, z].every(Number.isFinite)) return "—";
  return `${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)}`;
}

function fmtPositive(value, digits = 1) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return "—";
  return formatNumber(n, digits);
}

function checkStatusClass(status) {
  const key = String(status || "").toLowerCase();
  if (key === "pass") return styles.reportPass;
  if (key === "warn") return styles.reportWarn;
  if (key === "fail") return styles.reportFail;
  return styles.reportNa;
}

function excelColumnLabel(index) {
  let n = index + 1;
  let label = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    label = String.fromCharCode(65 + rem) + label;
    n = Math.floor((n - 1) / 26);
  }
  return label;
}

function excelSheets({ fileName, summary, uniqueParts, treeRows }) {
  const totalQty =
    summary?.total_part_quantity ||
    uniqueParts.reduce((sum, part) => sum + (Number(part.quantity) || 0), 0);
  const totalMass = uniqueParts.reduce(
    (sum, part) => sum + estMassKg(part.volume_mm3, part.quantity),
    0,
  );
  return {
    summary: {
      id: "summary",
      name: "Summary",
      columns: [
        { key: "field", header: "Field" },
        { key: "value", header: "Value" },
      ],
      rows: [
        { field: "File", value: fileName || "step-bom" },
        { field: "Assemblies", value: summary?.assembly_count || 0 },
        { field: "Unique parts", value: uniqueParts.length },
        { field: "Total quantity", value: totalQty },
        { field: "Tree nodes", value: treeRows.length || summary?.node_count || 0 },
        { field: "Est. mass density", value: "Mild steel 7.85 g/cm³" },
        { field: "Est. mass method", value: "Solid volume × density (not bounding-box volume)" },
        { field: "Est. total mass", value: formatMass(totalMass) },
      ],
    },
    parts: {
      id: "parts",
      name: "Parts",
      columns: [
        { key: "part_number", header: "Part number" },
        { key: "name", header: "Designation" },
        { key: "quantity", header: "Qty" },
        { key: "lxwxh", header: "L x W x H (mm)" },
        { key: "size_x", header: "Size X (mm)" },
        { key: "size_y", header: "Size Y (mm)" },
        { key: "size_z", header: "Size Z (mm)" },
        { key: "volume_mm3", header: "Volume (mm³)" },
        { key: "mass_g", header: "Est. mass (g)" },
        { key: "mass_kg", header: "Est. mass (kg)" },
        { key: "material", header: "Material" },
        { key: "area_mm2", header: "Area (mm²)" },
      ],
      rows: uniqueParts.map((part) => {
        const box = part.bbox_mm || {};
        return {
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
        };
      }),
    },
    tree: {
      id: "tree",
      name: "Assembly tree",
      columns: [
        { key: "level", header: "Level" },
        { key: "part_number", header: "Part number" },
        { key: "name", header: "Designation" },
        { key: "type", header: "Type" },
        { key: "quantity", header: "Qty" },
        { key: "total_quantity", header: "Total qty" },
        { key: "lxwxh", header: "L x W x H (mm)" },
        { key: "size_x", header: "Size X (mm)" },
        { key: "size_y", header: "Size Y (mm)" },
        { key: "size_z", header: "Size Z (mm)" },
        { key: "volume_mm3", header: "Volume (mm³)" },
        { key: "mass_g", header: "Est. mass (g)" },
        { key: "mass_kg", header: "Est. mass (kg)" },
        { key: "material", header: "Material" },
        { key: "area_mm2", header: "Area (mm²)" },
        { key: "solid_count", header: "Solids" },
      ],
      rows: treeRows.map((row) => ({
        ...row,
        name: `${"  ".repeat(row.level || 0)}${row.name}`,
        material: row.material || "—",
      })),
      boldKey: "type",
      boldValue: "Assembly",
    },
  };
}

function styleHeader(row) {
  row.font = { bold: true, color: { argb: "FFFFFFFF" } };
  row.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF217346" },
  };
  row.alignment = { vertical: "middle" };
}

async function downloadBomExcel({ fileName, summary, uniqueParts, treeRows }) {
  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Marathon STEP BOM";
  workbook.created = new Date();
  const sheets = excelSheets({ fileName, summary, uniqueParts, treeRows });

  Object.values(sheets).forEach((sheet) => {
    const ws = workbook.addWorksheet(sheet.name);
    ws.columns = sheet.columns.map((col) => ({
      header: col.header,
      key: col.key,
      width: Math.max(12, Math.min(48, col.header.length + 6)),
    }));
    styleHeader(ws.getRow(1));
    sheet.rows.forEach((row) => {
      const added = ws.addRow(row);
      if (sheet.boldKey && row[sheet.boldKey] === sheet.boldValue) {
        added.font = { bold: true };
      }
    });
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

const OUTPUT_TABS = [
  { id: "assembly", label: "Assembly" },
  { id: "bom", label: "Bill of materials" },
  { id: "report", label: "Report" },
  { id: "excel", label: "View in Excel" },
];

export function StepBomOutputSection({ job, error }) {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("assembly");
  const [excelSheetId, setExcelSheetId] = useState("summary");
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
  const treeRows = useMemo(
    () => (displayTree ? flattenCollapsed(displayTree) : []),
    [displayTree],
  );
  const jobDone = String(job?.status || "").toUpperCase() === "COMPLETED" && Boolean(displayTree);
  const bomQuality =
    job?.bom_quality ||
    (jobDone ? scoreBomQualityClient({ flat: treeRows, summary: summary || {} }) : null);
  const confidencePct = Number(bomQuality?.confidence_pct);

  const downloadExcel = useCallback(async () => {
    if (!displayTree) return;
    try {
      await downloadBomExcel({
        fileName: job?.file_name || "step-bom",
        summary,
        uniqueParts,
        treeRows,
      });
    } catch (err) {
      toast.error(err?.message || "Could not download Excel.");
    }
  }, [displayTree, job, summary, treeRows, uniqueParts]);

  const sheets = useMemo(
    () =>
      excelSheets({
        fileName: job?.file_name || "step-bom",
        summary,
        uniqueParts,
        treeRows,
      }),
    [job?.file_name, summary, uniqueParts, treeRows],
  );
  const activeExcelSheet = sheets[excelSheetId] || sheets.summary;
  const reportRows = (flat.length ? flat : treeRows).slice(0, 500);
  const uniqueReportParts =
    Array.isArray(summary?.unique_parts) && summary.unique_parts.length
      ? summary.unique_parts
      : uniqueParts;
  const reportStats = bomQuality?.stats || summary || {};
  const reportChecks = Array.isArray(bomQuality?.checks) ? bomQuality.checks : [];

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

  return (
    <>
      <section className={styles.bomOutput} aria-labelledby="step-bom-output-heading">
        <div className={styles.bomOutputInner}>
          <p className={styles.eyebrow}>BOM output</p>
          <h2 id="step-bom-output-heading">See the assembly structure before you export</h2>
          <p className={styles.bomOutputIntro}>
            Switch between the assembly tree, parts list, accuracy report, and spreadsheet view
            of the same extraction.
          </p>

          {jobDone ? (
            <div className={styles.bomActions}>
              {Number.isFinite(confidencePct) ? (
                <span className={styles.bomConfidence}>
                  BOM confidence <strong>{formatNumber(confidencePct, 1)}%</strong>
                  {bomQuality?.verdict_label ? <em> · {bomQuality.verdict_label}</em> : null}
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
          ) : null}

          {job && !jobDone ? (
            <div className={styles.bomOutputStatus} aria-live="polite">
              <span className={`${styles.statusDot} ${styles[`status_${job.status || "PENDING"}`]}`} />
              <strong>{statusLabel(job.status)}</strong>
              {error ? <p className={styles.bomOutputError}>{error}</p> : null}
            </div>
          ) : null}

          {jobDone ? (
            <>
              <div className={styles.bomTabs} role="tablist" aria-label="BOM output views">
                {OUTPUT_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={`${styles.bomTab} ${activeTab === tab.id ? styles.bomTabActive : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className={styles.bomOutputCard}>
                {activeTab === "assembly" ? (
                  <div className={styles.bomOutputPane} role="tabpanel">
                    <h3>Assembly tree</h3>
                    <ul className={styles.outputTreeList}>
                      <AssemblyTreeItem node={displayTree} />
                    </ul>
                  </div>
                ) : null}

                {activeTab === "bom" ? (
                  <div className={styles.bomOutputPane} role="tabpanel">
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
                  </div>
                ) : null}

                {activeTab === "report" ? (
                  <div className={`${styles.bomOutputPane} ${styles.reportPane}`} role="tabpanel">
                    <div className={styles.reportHero}>
                      <div>
                        <p className={styles.reportPill}>Marathon OS · STEP CAD extraction</p>
                        <h3>CAD BOM + geometry report</h3>
                        <p className={styles.reportMuted}>File: {job?.file_name || "step-bom"}</p>
                        <p className={styles.reportMuted}>
                          Job: {job?.job_id || "—"}
                          {bomQuality?.generated_at ? ` · ${bomQuality.generated_at}` : ""}
                        </p>
                        {bomQuality?.verdict_label ? (
                          <p className={styles.reportVerdict}>{bomQuality.verdict_label}</p>
                        ) : null}
                      </div>
                      <div className={styles.reportScore}>
                        <span>BOM confidence</span>
                        <strong>
                          {Number.isFinite(confidencePct) ? `${formatNumber(confidencePct, 1)}%` : "—"}
                        </strong>
                      </div>
                    </div>

                    <h4>1. Accuracy scorecard</h4>
                    <div className={styles.reportTableWrap}>
                      <table className={styles.reportTable}>
                        <thead>
                          <tr>
                            <th>Metric</th>
                            <th>Status</th>
                            <th>Detail</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportChecks.length ? (
                            reportChecks.map((check) => (
                              <tr key={check.id || check.label}>
                                <td>{check.label || check.id}</td>
                                <td className={checkStatusClass(check.status)}>
                                  {String(check.status || "—").toUpperCase()}
                                </td>
                                <td>{check.detail || "—"}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3}>Scorecard is included when the worker finishes the PDF.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {bomQuality?.disclaimer ? (
                      <p className={styles.reportNote}>{bomQuality.disclaimer}</p>
                    ) : null}

                    <h4>2. Extracted file summary</h4>
                    <div className={styles.reportStats}>
                      <div><span>Assemblies</span><strong>{dash(reportStats.assembly_count)}</strong></div>
                      <div><span>Unique parts</span><strong>{dash(reportStats.unique_part_count || uniqueParts.length)}</strong></div>
                      <div><span>Total qty</span><strong>{dash(reportStats.total_part_quantity)}</strong></div>
                      <div><span>Tree nodes</span><strong>{dash(reportStats.node_count || treeRows.length)}</strong></div>
                      <div><span>Max level</span><strong>{dash(reportStats.max_level)}</strong></div>
                      <div><span>Solids</span><strong>{dash(reportStats.total_solid_count)}</strong></div>
                      <div><span>Faces</span><strong>{dash(reportStats.total_face_count)}</strong></div>
                      <div><span>Edges</span><strong>{dash(reportStats.total_edge_count)}</strong></div>
                      <div><span>Overall L×W×H</span><strong>{dash(reportStats.overall_lxwxh)}</strong></div>
                      <div><span>Total volume</span><strong>{fmtPositive(reportStats.total_volume_mm3)} mm³</strong></div>
                      <div><span>Total area</span><strong>{fmtPositive(reportStats.total_area_mm2)} mm²</strong></div>
                      <div><span>Est. total mass</span><strong>{formatMass(reportStats.total_mass_kg)}</strong></div>
                    </div>
                    <p className={styles.reportNote}>
                      Est. mass = BREP solid volume × mild steel 7.85 g/cm³. Material/color only appear when stored in the STEP.
                    </p>

                    <h4>3. Full bill of materials (all extracted fields)</h4>
                    <div className={`${styles.reportTableWrap} ${styles.reportWide}`}>
                      <table className={`${styles.reportTable} ${styles.reportCompact}`}>
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Component</th>
                            <th>Part ID</th>
                            <th>Type</th>
                            <th>Qty</th>
                            <th>Total qty</th>
                            <th>Level</th>
                            <th>L×W×H (mm)</th>
                            <th>Volume</th>
                            <th>Area</th>
                            <th>Est. mass</th>
                            <th>Solids</th>
                            <th>Faces</th>
                            <th>Edges</th>
                            <th>Verts</th>
                            <th>Shape</th>
                            <th>Material</th>
                            <th>Color</th>
                            <th>CoM / Placement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportRows.length ? (
                            reportRows.map((row, index) => {
                              const qty = row.quantity || 1;
                              const totalQty = row.total_quantity || qty;
                              const vol = Number(row.volume_mm3) || 0;
                              let massKg = Number(row.mass_kg) || 0;
                              if (massKg <= 0 && vol > 0) massKg = estMassKg(vol, totalQty);
                              return (
                                <tr key={`report-${index}`}>
                                  <td>{String(index + 1).padStart(2, "0")}</td>
                                  <td>{row.designation || row.name || "—"}</td>
                                  <td>{row.part_number || "—"}</td>
                                  <td>{row.type || "—"}</td>
                                  <td>{qty}</td>
                                  <td>{totalQty}</td>
                                  <td>{row.level ?? "—"}</td>
                                  <td>{row.lxwxh || formatLxWxH(row.bbox_mm) || "—"}</td>
                                  <td>{fmtPositive(vol)}</td>
                                  <td>{fmtPositive(row.area_mm2)}</td>
                                  <td>{formatMass(massKg)}</td>
                                  <td>{row.solid_count || "—"}</td>
                                  <td>{row.face_count || "—"}</td>
                                  <td>{row.edge_count || "—"}</td>
                                  <td>{row.vertex_count || "—"}</td>
                                  <td>{row.shape_type || "—"}</td>
                                  <td>{row.material || "—"}</td>
                                  <td>{row.color_hex || "—"}</td>
                                  <td>
                                    {`${fmtXyz(row.center_of_mass_mm)} / ${fmtXyz(row.placement_mm)}`}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={19}>No BOM rows available.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <h4>4. Unique parts (geometry roll-up)</h4>
                    <div className={`${styles.reportTableWrap} ${styles.reportWide}`}>
                      <table className={`${styles.reportTable} ${styles.reportCompact}`}>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Designation</th>
                            <th>Part ID</th>
                            <th>Qty</th>
                            <th>L×W×H</th>
                            <th>Volume</th>
                            <th>Area</th>
                            <th>Unit mass</th>
                            <th>Total mass</th>
                            <th>Faces</th>
                            <th>Edges</th>
                            <th>Shape</th>
                            <th>Material</th>
                            <th>Color</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uniqueReportParts.length ? (
                            uniqueReportParts.map((part, index) => {
                              const vol = Number(part.volume_mm3) || 0;
                              let unitMass = Number(part.unit_mass_kg) || 0;
                              if (unitMass <= 0 && vol > 0) unitMass = estMassKg(vol, 1);
                              const totalMass = Number(part.mass_kg) || estMassKg(vol, part.quantity);
                              return (
                                <tr key={`unique-${index}`}>
                                  <td>{String(index + 1).padStart(2, "0")}</td>
                                  <td>{part.name || part.designation || "—"}</td>
                                  <td>{part.part_number || "—"}</td>
                                  <td>{part.quantity || 1}</td>
                                  <td>{part.lxwxh || formatLxWxH(part.bbox_mm) || "—"}</td>
                                  <td>{fmtPositive(vol)}</td>
                                  <td>{fmtPositive(part.area_mm2)}</td>
                                  <td>{formatMass(unitMass)}</td>
                                  <td>{formatMass(totalMass)}</td>
                                  <td>{part.face_count || "—"}</td>
                                  <td>{part.edge_count || "—"}</td>
                                  <td>{part.shape_type || "—"}</td>
                                  <td>{part.material || "—"}</td>
                                  <td>{part.color_hex || "—"}</td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={14}>No unique parts.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}

                {activeTab === "excel" ? (
                  <div className={styles.excelApp} role="tabpanel">
                    <div className={styles.excelBar}>
                      <span className={styles.excelFileName}>
                        {(job?.file_name || "step-bom").replace(/\.[^.]+$/, "")}-bom.xlsx
                      </span>
                      <span className={styles.excelCellRef}>
                        {excelColumnLabel(0)}1
                      </span>
                    </div>
                    <div className={styles.excelGridWrap}>
                      <table className={styles.excelGrid}>
                        <thead>
                          <tr>
                            <th className={styles.excelCorner} />
                            {activeExcelSheet.columns.map((col, index) => (
                              <th key={col.key} className={styles.excelColHead}>
                                {excelColumnLabel(index)}
                              </th>
                            ))}
                          </tr>
                          <tr>
                            <th className={styles.excelRowHead}>1</th>
                            {activeExcelSheet.columns.map((col) => (
                              <th key={`h-${col.key}`} className={styles.excelHeaderCell}>
                                {col.header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {activeExcelSheet.rows.map((row, rowIndex) => (
                            <tr key={`xl-${rowIndex}`}>
                              <th className={styles.excelRowHead}>{rowIndex + 2}</th>
                              {activeExcelSheet.columns.map((col) => (
                                <td
                                  key={col.key}
                                  className={
                                    activeExcelSheet.boldKey &&
                                    row[activeExcelSheet.boldKey] === activeExcelSheet.boldValue
                                      ? styles.excelBold
                                      : undefined
                                  }
                                >
                                  {row[col.key] ?? ""}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className={styles.excelSheets}>
                      {Object.values(sheets).map((sheet) => (
                        <button
                          key={sheet.id}
                          type="button"
                          className={`${styles.excelSheetTab} ${
                            excelSheetId === sheet.id ? styles.excelSheetTabActive : ""
                          }`}
                          onClick={() => setExcelSheetId(sheet.id)}
                        >
                          {sheet.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </>
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
    </>
  );
}

export default function StepBomTreePage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    getOrCreateStepBomUuid();
  }, []);

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
      setSubmitting(true);
      setError("");
      try {
        const data = await uploadStepBomFile(file);
        const created = data?.job || data;
        const jobId = created?.job_id;
        if (!jobId) throw new Error("Job was queued but no id was returned.");
        router.push(stepBomJobPath(jobId));
      } catch (err) {
        const message = err?.message || "Could not start STEP BOM extraction.";
        setError(message);
        toast.error(message);
        setSubmitting(false);
      }
    },
    [file, router, submitting],
  );

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
              {submitting ? "Starting…" : "Extract BOM"}
            </button>
            {error ? <p className={styles.bomOutputError}>{error}</p> : null}

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
    </div>
  );
}
