import { NextResponse } from "next/server";
import { spawnSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_BASE = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
const FREECAD_CONTAINER = process.env.FREECAD_CONTAINER_NAME || "freecad_service";

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function outcomeScore(status) {
  return { pass: 1, warn: 0.55, fail: 0.15, na: 0 }[status] || 0;
}

function usableIdentity(row) {
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

function scoreBomQuality(job) {
  const flat = Array.isArray(job?.bom_flat) ? job.bom_flat : [];
  const summary = job?.bom_summary || {};
  const parts = flat.filter((row) => String(row?.type || "").toLowerCase() === "part");
  const assemblies = flat.filter((row) => String(row?.type || "").toLowerCase() === "assembly");
  const maxLevel = flat.reduce((max, row) => Math.max(max, Number(row?.level) || 0), 0);
  const uniquePartCount =
    Number(summary.unique_part_count) ||
    (Array.isArray(summary.unique_parts) ? summary.unique_parts.length : parts.length);
  const assemblyCount = Number(summary.assembly_count) || assemblies.length;

  let structureStatus = "warn";
  let structureDetail = "Partial structure recovered.";
  if (!parts.length) {
    structureStatus = "fail";
    structureDetail = "No solids or parts were recovered from the STEP file.";
  } else if (maxLevel <= 0 && assemblyCount <= 1 && uniquePartCount <= 1) {
    structureStatus = "warn";
    structureDetail = "File looks like a single part or fused solid — little hierarchy to extract.";
  } else if (maxLevel >= 1 || assemblyCount >= 1) {
    structureStatus = "pass";
    structureDetail = `Assembly hierarchy found (${maxLevel} levels, ${assemblyCount} assemblies, ${uniquePartCount} unique parts).`;
  }

  const named = parts.filter(usableIdentity).length;
  const identityPct = parts.length ? Math.round((1000 * named) / parts.length) / 10 : 0;
  const identityStatus = !parts.length
    ? "fail"
    : identityPct >= 80
      ? "pass"
      : identityPct >= 50
        ? "warn"
        : "fail";

  const totalQty = parts.reduce((sum, part) => sum + (Number(part.quantity) || 1), 0);
  const qtyGt1 = parts.filter((part) => (Number(part.quantity) || 1) > 1).length;
  const quantityStatus = !parts.length ? "fail" : totalQty >= uniquePartCount ? "pass" : "warn";

  const withVol = parts.filter((part) => Number(part.volume_mm3) > 0).length;
  const geometryPct = parts.length ? Math.round((1000 * withVol) / parts.length) / 10 : 0;
  const geometryStatus = !parts.length
    ? "fail"
    : geometryPct >= 95
      ? "pass"
      : geometryPct >= 70
        ? "warn"
        : "fail";

  const withPreview = parts.filter((part) => part.preview_id).length;
  const previewPct = parts.length ? Math.round((1000 * withPreview) / parts.length) / 10 : 0;
  const previewStatus = !parts.length
    ? "fail"
    : previewPct >= 90
      ? "pass"
      : previewPct >= 60
        ? "warn"
        : "fail";

  const checks = [
    {
      id: "structure",
      label: "Structure completeness",
      status: structureStatus,
      detail: structureDetail,
      weight: 0.25,
    },
    {
      id: "identity",
      label: "Identity coverage",
      status: identityStatus,
      detail: `${identityPct}% of parts have a usable name or part number.`,
      weight: 0.2,
    },
    {
      id: "quantity",
      label: "Quantity confidence",
      status: quantityStatus,
      detail: `Quantities reconciled (${uniquePartCount} unique, ${totalQty} total, ${qtyGt1} repeated).`,
      weight: 0.2,
    },
    {
      id: "geometry",
      label: "Geometry / mass coverage",
      status: geometryStatus,
      detail: `${geometryPct}% of parts have solid volume for estimated mass.`,
      weight: 0.2,
    },
    {
      id: "preview",
      label: "Preview coverage",
      status: previewStatus,
      detail: `${previewPct}% of parts have a CAD preview thumb.`,
      weight: 0.15,
    },
  ];

  const confidence = Math.round(
    checks.reduce((sum, check) => sum + check.weight * outcomeScore(check.status) * 100, 0) * 10,
  ) / 10;
  const statuses = checks.map((check) => check.status);
  const verdict = statuses.includes("fail")
    ? "fail"
    : statuses.includes("warn")
      ? "warn"
      : "pass";
  const verdictLabel = {
    pass: "COMPLETED",
    warn: "COMPLETED WITH WARNINGS",
    fail: "COMPLETED WITH ERRORS",
  }[verdict];

  const totalMass =
    Number(summary.total_mass_kg) ||
    parts.reduce(
      (sum, part) => sum + ((Number(part.volume_mm3) || 0) * 7.85 * (Number(part.quantity) || 1)) / 1e6,
      0,
    );

  return {
    confidence_pct: confidence,
    verdict,
    verdict_label: verdictLabel,
    checks,
    stats: {
      assembly_count: assemblyCount,
      unique_part_count: uniquePartCount,
      total_part_quantity: Number(summary.total_part_quantity) || totalQty,
      node_count: Number(summary.node_count) || flat.length,
      max_level: maxLevel,
      total_mass_kg: Math.round(totalMass * 10000) / 10000,
    },
    disclaimer:
      "BOM confidence measures how complete and consistent the extracted STEP product structure is. It is not a comparison against a PDM/golden BOM.",
    generated_at: new Date().toISOString(),
  };
}

function buildHtml(job, quality) {
  const fileName = job.file_name || "step-bom";
  const flat = Array.isArray(job.bom_flat) ? job.bom_flat : [];
  const stats = quality.stats || {};
  const checkRows = (quality.checks || [])
    .map(
      (check) =>
        `<tr><td>${esc(check.label)}</td><td><strong>${esc(check.status)}</strong></td><td>${esc(check.detail)}</td></tr>`,
    )
    .join("");
  const bomRows = flat
    .slice(0, 400)
    .map((row, index) => {
      const vol = Number(row.volume_mm3) || 0;
      let massKg = Number(row.mass_kg) || 0;
      if (massKg <= 0 && vol > 0) massKg = (vol * 7.85 * (Number(row.quantity) || 1)) / 1e6;
      const massTxt =
        massKg >= 1 ? `${massKg.toFixed(2)} kg` : massKg > 0 ? `${(massKg * 1000).toFixed(1)} g` : "—";
      return `<tr><td>${String(index + 1).padStart(2, "0")}</td><td>${esc(row.designation || row.name || "—")}</td><td>${esc(row.part_number || "—")}</td><td>${esc(row.quantity || 1)}</td><td>${esc(massTxt)}</td><td>${esc(row.level ?? "—")}</td></tr>`;
    })
    .join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>BOM accuracy report — ${esc(fileName)}</title>
<style>
@page{size:A4;margin:16mm}
body{font-family:Helvetica,Arial,sans-serif;color:#1a1523;font-size:11px;line-height:1.45;margin:0}
h1{font-size:20px;margin:0 0 4px}h2{font-size:13px;margin:22px 0 8px;border-bottom:1px solid #e6e0ef;padding-bottom:4px}
.muted{color:#667085}.hero{display:flex;justify-content:space-between;gap:16px}
.pct{font-size:34px;font-weight:750;color:#7025e5}
table{width:100%;border-collapse:collapse}th,td{border-top:1px solid #ece7f2;padding:7px 6px;text-align:left}
th{background:#f7f3fc;font-size:10px;text-transform:uppercase;color:#667085}
.note{background:#faf8fc;border:1px solid #ece7f2;padding:10px 12px;border-radius:8px;margin-top:10px}
</style></head><body>
<div class="hero"><div>
<div class="muted">Marathon OS · STEP BOM</div>
<h1>BOM accuracy report</h1>
<div class="muted">File: ${esc(fileName)}</div>
<div class="muted">Job: ${esc(job.job_id || "")} · ${esc(quality.generated_at || "")}</div>
<div style="margin-top:8px"><strong>${esc(quality.verdict_label || "")}</strong></div>
</div><div style="text-align:right"><div class="muted">BOM confidence</div><div class="pct">${esc(quality.confidence_pct)}%</div></div></div>
<h2>1. Accuracy scorecard</h2>
<table><thead><tr><th>Metric</th><th>Status</th><th>Detail</th></tr></thead><tbody>${checkRows}</tbody></table>
<div class="note">${esc(quality.disclaimer || "")}</div>
<h2>2. Assembly summary</h2>
<table><tr><td>Assemblies</td><td><strong>${esc(stats.assembly_count)}</strong></td><td>Unique parts</td><td><strong>${esc(stats.unique_part_count)}</strong></td></tr>
<tr><td>Total quantity</td><td><strong>${esc(stats.total_part_quantity)}</strong></td><td>Est. total mass</td><td><strong>${esc(stats.total_mass_kg)} kg</strong></td></tr></table>
<h2>3. Bill of materials</h2>
<table><thead><tr><th>Item</th><th>Component</th><th>Part ID</th><th>Qty</th><th>Est. mass</th><th>Level</th></tr></thead>
<tbody>${bomRows || "<tr><td colspan='6'>No BOM rows</td></tr>"}</tbody></table>
</body></html>`;
}

export async function GET(request, { params }) {
  if (!API_BASE) {
    return NextResponse.json(
      { meta: { success: false, message: "NEXT_PUBLIC_BASE_URL is not set." } },
      { status: 500 },
    );
  }
  const userUuid = request.headers.get("user-uuid") || "";
  if (!userUuid) {
    return NextResponse.json(
      { meta: { success: false, message: "user-uuid header is required." } },
      { status: 400 },
    );
  }
  const id = params?.id;
  if (!id) {
    return NextResponse.json(
      { meta: { success: false, message: "job id is required." } },
      { status: 400 },
    );
  }

  try {
    const statusRes = await fetch(`${API_BASE}/v1/cad-step-bom/status/${id}`, {
      headers: { "user-uuid": userUuid, Accept: "application/json" },
      cache: "no-store",
    });
    const json = await statusRes.json();
    const job = json?.data?.job || json?.job;
    if (!statusRes.ok || !job) {
      return NextResponse.json(
        { meta: { success: false, message: json?.meta?.message || "Job not found." } },
        { status: 404 },
      );
    }
    if (String(job.status || "").toUpperCase() !== "COMPLETED") {
      return NextResponse.json(
        { meta: { success: false, message: "Job is not completed yet." } },
        { status: 409 },
      );
    }

    if (job.report_pdf_url) {
      const pdfRes = await fetch(job.report_pdf_url);
      if (pdfRes.ok) {
        const bytes = Buffer.from(await pdfRes.arrayBuffer());
        const stem = String(job.file_name || "step-bom").replace(/\.[^.]+$/, "");
        return new NextResponse(bytes, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${stem}-bom-accuracy.pdf"`,
          },
        });
      }
    }

    const quality = job.bom_quality || scoreBomQuality(job);
    const html = buildHtml(job, quality);
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "step-bom-report-"));
    const htmlPath = path.join(tmp, "report.html");
    const pdfPath = path.join(tmp, "report.pdf");
    fs.writeFileSync(htmlPath, html, "utf8");

    const code = `from report import html_to_pdf\nprint(html_to_pdf(${JSON.stringify(htmlPath)}, ${JSON.stringify(pdfPath)}) or "")\n`;
    const rendered = spawnSync(
      "docker",
      ["exec", "-i", FREECAD_CONTAINER, "python3", "-c", code],
      { encoding: "utf8", timeout: 180000 },
    );

    let pdfBytes = null;
    if (fs.existsSync(pdfPath) && fs.statSync(pdfPath).size > 512) {
      pdfBytes = fs.readFileSync(pdfPath);
    }

    try {
      fs.rmSync(tmp, { recursive: true, force: true });
    } catch {
      /* ignore */
    }

    if (!pdfBytes) {
      console.error("step-bom-report pdf failed", rendered.stdout, rendered.stderr);
      // Fallback: return printable HTML so the user can still download a report.
      const stem = String(job.file_name || "step-bom").replace(/\.[^.]+$/, "");
      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `attachment; filename="${stem}-bom-accuracy.html"`,
        },
      });
    }

    const stem = String(job.file_name || "step-bom").replace(/\.[^.]+$/, "");
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${stem}-bom-accuracy.pdf"`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { meta: { success: false, message: err?.message || "Report generation failed." } },
      { status: 500 },
    );
  }
}
