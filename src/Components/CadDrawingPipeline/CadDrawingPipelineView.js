"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { startCadDrawingPipeline, TECHDRAW_PIPELINE_PATH } from "@/api/cadDrawingPipelineApi";
import { BASE_URL } from "@/config";
import styles from "./CadDrawingPipeline.module.css";

const STEP_EXT = /\.(step|stp)$/i;

const API_URL_DISPLAY = `${BASE_URL || ""}${TECHDRAW_PIPELINE_PATH}`;

const STAGES = [
  {
    name: "Stage 1 · View Capture",
    desc: "Captures orthographic snapshots — front, top, sides, isometric — for analysis.",
  },
  {
    name: "Stage 2 · Smart View Selection",
    desc: "AI reviews views, picks the most informative set, sections, details, and BOM.",
  },
  {
    name: "Stage 3 · Drawing Sheet Setup",
    desc: "Creates sheets, places views at scale, exports geometry for dimensioning.",
  },
  {
    name: "Stage 4 · Dimension Planning",
    desc: "AI plans which measurements to show and where to place annotations.",
  },
  {
    name: "Stage 5 · Annotate & Export",
    desc: "Applies dimensions and exports PDF, SVG, DXF, and BOM.",
  },
];

const SHEET_LABELS = [
  ["Front", "View"],
  ["Right", "View"],
  ["Top", "View"],
  ["Isometric", "View"],
  ["Section", "A–A"],
  ["Detail", "B"],
];

function logLineClass(kind) {
  switch (kind) {
    case "ok":
      return styles.logOk;
    case "warn":
      return styles.logWarn;
    case "err":
      return styles.logErr;
    case "hdr":
      return styles.logHdr;
    case "dim":
      return styles.logDim;
    default:
      return styles.logInfo;
  }
}

/** Pull download rows from common API shapes (best-effort). */
function outputItemsFromResult(data) {
  const root = data?.data ?? data;
  if (!root || typeof root !== "object") return [];

  const items = [];
  const add = (ext, name, href = null, size = "") => {
    items.push({ ext, name, href, size });
  };

  if (typeof root.pdf_url === "string") add("pdf", "technical_drawing_simple.pdf", root.pdf_url);
  if (typeof root.pdf === "string") add("pdf", root.pdf.split("/").pop() || "drawing.pdf", root.pdf);

  if (Array.isArray(root.downloads)) {
    for (const d of root.downloads) {
      if (!d) continue;
      const url = d.url || d.href || d.link;
      const label = d.label || d.name || url || "file";
      const ext = (d.ext || d.type || "").toLowerCase().replace(".", "") || "file";
      add(ext, label, url, d.size || "");
    }
  }

  if (items.length === 0 && data != null) {
    add("json", "Full API response", null, "");
  }
  return items;
}

function statNumber(root, keys) {
  const o = root?.data ?? root;
  if (!o || typeof o !== "object") return null;
  for (const k of keys) {
    const v = o[k];
    if (v != null && v !== "") return String(v);
  }
  return null;
}

export default function CadDrawingPipelineView() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const [logs, setLogs] = useState(() => [
    { kind: "dim", text: "// Marathon-OS Drawing Pipeline ready." },
    { kind: "dim", text: "// Configure inputs and press Run." },
  ]);
  const [overallStatus, setOverallStatus] = useState("READY");
  const [activeStageIndex, setActiveStageIndex] = useState(-1);
  const [stagesDone, setStagesDone] = useState(() => STAGES.map(() => false));
  const [stagesError, setStagesError] = useState(false);
  const [advOpen, setAdvOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [runStats, setRunStats] = useState({
    sheets: "—",
    dims: "—",
    tokens: "—",
    time: "—",
  });

  const stageTimerRef = useRef(null);
  const runStartRef = useRef(null);
  const fileInputRef = useRef(null);

  const appendLog = useCallback((kind, text) => {
    setLogs((prev) => [...prev, { kind, text }]);
  }, []);

  const resetRunUi = useCallback(() => {
    setError("");
    setResult(null);
    setActiveStageIndex(-1);
    setStagesDone(STAGES.map(() => false));
    setStagesError(false);
    setRunStats({ sheets: "—", dims: "—", tokens: "—", time: "—" });
  }, []);

  useEffect(() => {
    return () => {
      if (stageTimerRef.current) clearInterval(stageTimerRef.current);
    };
  }, []);

  const pickFile = useCallback(
    (f) => {
      if (!f) return;
      setFile(f);
      setError("");
      setResult(null);
      appendLog("info", `  File selected: ${f.name}`);
    },
    [appendLog]
  );

  const onPickFile = (e) => {
    pickFile(e.target.files?.[0]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && STEP_EXT.test(f.name)) pickFile(f);
    else if (f) toast.error("Only .step or .stp files are allowed.");
  };

  const sheetReadyCount = (() => {
    const root = result?.data ?? result;
    const n = statNumber(result, ["sheet_count", "sheets", "total_sheets"]);
    if (n != null) return Math.min(6, Math.max(0, parseInt(n, 10) || 0));
    if (root?.outputs && Array.isArray(root.outputs)) return Math.min(6, root.outputs.length);
    return result ? 0 : 0;
  })();

  const outputItems = result ? outputItemsFromResult(result) : [];

  const onSubmit = async (e) => {
    e.preventDefault();
    if (stageTimerRef.current) {
      clearInterval(stageTimerRef.current);
      stageTimerRef.current = null;
    }

    resetRunUi();
    setLogs([
      { kind: "dim", text: "// Marathon-OS Drawing Pipeline ready." },
      { kind: "dim", text: "// Configure inputs and press Run." },
    ]);

    if (!file) {
      toast.error("Choose a STEP or STP file.");
      return;
    }
    if (!STEP_EXT.test(file.name)) {
      toast.error("Only .step or .stp files are allowed.");
      return;
    }

    setLoading(true);
    setOverallStatus("RUNNING");
    runStartRef.current = Date.now();
    appendLog("hdr", "========== RUN START ==========");
    appendLog("info", `  POST ${API_URL_DISPLAY}`);
    appendLog("info", `  File: ${file.name}`);
    if (title.trim()) appendLog("info", `  Title: ${title.trim()}`);

    setActiveStageIndex(0);
    stageTimerRef.current = setInterval(() => {
      setActiveStageIndex((i) => Math.min(STAGES.length - 1, i + 1));
    }, 2400);

    try {
      const data = await startCadDrawingPipeline({
        file,
        title: title.trim(),
        description: description.trim(),
      });

      if (stageTimerRef.current) {
        clearInterval(stageTimerRef.current);
        stageTimerRef.current = null;
      }

      const elapsed = ((Date.now() - (runStartRef.current || Date.now())) / 1000).toFixed(1);
      setResult(data);
      setActiveStageIndex(-1);
      setStagesDone(STAGES.map(() => true));
      setOverallStatus("DONE ✓");

      const root = data?.data ?? data;
      setRunStats({
        sheets: statNumber(data, ["sheet_count", "sheets", "total_sheets"]) ?? "—",
        dims: statNumber(data, ["dimensions_applied", "dims", "dimension_count"]) ?? "—",
        tokens: statNumber(data, ["tokens_used", "tokens"]) ?? "—",
        time: `${elapsed}s`,
      });

      appendLog("ok", "  ✓ Pipeline request completed (see response & outputs).");
      toast.success("Pipeline finished.");
    } catch (err) {
      if (stageTimerRef.current) {
        clearInterval(stageTimerRef.current);
        stageTimerRef.current = null;
      }

      const msg =
        err?.response?.data?.meta?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Request failed";
      const text = typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);
      setError(text);
      setStagesError(true);
      setOverallStatus("ERROR");
      setActiveStageIndex(-1);
      appendLog("err", `  ✗ ${text}`);
      toast.error("Pipeline request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>M</div>
            <div>
              <div className={styles.logoText}>Marathon-OS</div>
              <div className={styles.logoSub}>Engineering · Manufacturing · Supply Chain</div>
            </div>
          </div>
          <div className={styles.headerBadge}>CAD Pipeline v1.0</div>
        </header>

        <h1 className={styles.pageTitle}>
          Drawing <span className={styles.pageTitleAccent}>Pipeline</span>
        </h1>
        <p className={styles.pageDesc}>
          Upload a STEP file and run the TechDraw pipeline on the server. This page matches the v3
          prototype layout; the request is a single multipart call to{" "}
          <code>{API_URL_DISPLAY}</code> — no S3 presign in this flow.
        </p>

        {error ? (
          <div className={`${styles.resultBanner} ${styles.resultBannerErr}`}>
            <span className={styles.resultIcon}>✕</span>
            <div>
              <div className={styles.resultText}>Request failed</div>
              <div className={styles.resultSub}>{error}</div>
            </div>
          </div>
        ) : null}

        {result && !error ? (
          <div className={`${styles.resultBanner} ${styles.resultBannerOk}`}>
            <span className={styles.resultIcon}>✓</span>
            <div>
              <div className={styles.resultText}>Pipeline response received</div>
              <div className={styles.resultSub}>
                Check terminal log, stats, and output list. Tune parsing when your API shape is
                final.
              </div>
            </div>
          </div>
        ) : null}

        <div className={styles.layout}>
          <div>
            <div className={`${styles.card} ${styles.cardMb}`}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>📐</div>
                <div className={styles.cardTitle}>Input configuration</div>
              </div>
              <div className={styles.cardBody}>
                <form onSubmit={onSubmit}>
                  <div
                    className={`${styles.uploadZone} ${dragOver ? styles.uploadZoneDrag : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    role="presentation"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".step,.stp"
                      onChange={onPickFile}
                      disabled={loading}
                      aria-label="STEP file"
                    />
                    <div className={styles.uploadIcon}>📦</div>
                    <div className={styles.uploadLabel}>Drop STEP / STP here</div>
                    <div className={styles.uploadHint}>or click to browse · .step .stp</div>
                    {file ? <div className={styles.uploadFileName}>✓ {file.name}</div> : null}
                  </div>

                  <div className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor="cad-pipeline-title">
                      Drawing title
                    </label>
                    <input
                      id="cad-pipeline-title"
                      className={styles.input}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Ring Jewelry 1 | Professional CAD Design"
                      disabled={loading}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor="cad-pipeline-desc">
                      Description
                    </label>
                    <textarea
                      id="cad-pipeline-desc"
                      className={styles.textarea}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Notes for the LLM / title block"
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="button"
                    className={styles.advToggle}
                    onClick={() => setAdvOpen((v) => !v)}
                  >
                    <span className={`${styles.advChevron} ${advOpen ? styles.advChevronOpen : ""}`}>
                      ▶
                    </span>{" "}
                    Advanced options
                  </button>
                  <div className={`${styles.advPanel} ${advOpen ? styles.advPanelOpen : ""}`}>
                    <div className={styles.fieldRow}>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>Drawing standard</label>
                        <select className={styles.select} disabled={loading} defaultValue="iso">
                          <option value="iso">ISO (1st angle)</option>
                          <option value="ansi">ANSI (3rd angle)</option>
                        </select>
                      </div>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>Sheet size</label>
                        <select className={styles.select} disabled={loading} defaultValue="A3">
                          <option value="A3">A3 (420×297mm)</option>
                          <option value="A2">A2 (594×420mm)</option>
                          <option value="A4">A4 (297×210mm)</option>
                        </select>
                      </div>
                    </div>
                    <p className={styles.hint}>
                      Advanced fields are UI-only for now; wire them to the API when the backend
                      accepts them.
                    </p>
                  </div>

                  <button className={styles.runBtn} type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <span className={styles.spinner} aria-hidden />
                        Running pipeline…
                      </>
                    ) : (
                      <>▶ Run drawing pipeline</>
                    )}
                  </button>

                  <p className={styles.hint}>
                    Multipart fields: <code>step</code> (file), <code>title</code>,{" "}
                    <code>description</code>. Header: <code>user-uuid</code> when present.
                  </p>
                </form>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderGrow}>
                  <div className={styles.cardIcon}>⚙️</div>
                  <div className={styles.cardTitle}>Pipeline stages</div>
                </div>
                <span className={styles.tokenBadge}>{overallStatus}</span>
              </div>

              <div className={styles.stages}>
                {STAGES.map((s, i) => {
                  const done = stagesDone[i];
                  const active = loading && !stagesError && activeStageIndex === i;
                  const err = stagesError && i === STAGES.length - 1 && !done;
                  const stageClass = [
                    styles.stage,
                    active ? styles.stageActive : "",
                    done ? styles.stageDone : "",
                    err ? styles.stageError : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <div key={s.name} className={stageClass}>
                      <div className={styles.stageNum}>
                        {done ? (
                          "✓"
                        ) : active ? (
                          <span className={styles.spinner} aria-hidden />
                        ) : (
                          <span>{i + 1}</span>
                        )}
                      </div>
                      <div className={styles.stageContent}>
                        <div className={styles.stageName}>{s.name}</div>
                        <div className={styles.stageDesc}>{s.desc}</div>
                        <div className={styles.stageStatus}>
                          {done ? "DONE" : active ? "RUNNING" : err ? "ERROR" : "WAITING"}
                        </div>
                        <div className={styles.stageProgress}>
                          <div className={styles.stageProgressFill} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={styles.terminal}>
                <div className={styles.terminalBar}>
                  <span className={`${styles.tDot} ${styles.tDot1}`} />
                  <span className={`${styles.tDot} ${styles.tDot2}`} />
                  <span className={`${styles.tDot} ${styles.tDot3}`} />
                  <span className={styles.terminalLabel}>pipeline.log</span>
                </div>
                <div className={styles.terminalBody}>
                  {logs.map((line, idx) => (
                    <span key={`${idx}-${line.text.slice(0, 24)}`} className={styles.logLine}>
                      <span className={logLineClass(line.kind)}>{line.text}</span>
                      <br />
                    </span>
                  ))}
                  <span className={`${styles.logLine} ${styles.logCursor}`} />
                </div>
              </div>

              {result ? (
                <div className={styles.cardBody} style={{ paddingTop: 0 }}>
                  <pre className={styles.jsonPre}>{JSON.stringify(result, null, 2)}</pre>
                </div>
              ) : null}
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>📊</div>
                <div className={styles.cardTitle}>Run statistics</div>
              </div>
              <div className={styles.statsGrid}>
                <div className={styles.stat}>
                  <div className={styles.statVal}>{runStats.sheets}</div>
                  <div className={styles.statLabel}>Sheets</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statVal}>{runStats.dims}</div>
                  <div className={styles.statLabel}>Dimensions</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statVal}>{runStats.tokens}</div>
                  <div className={styles.statLabel}>AI tokens</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statVal}>{runStats.time}</div>
                  <div className={styles.statLabel}>Duration</div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>🗂</div>
                <div className={styles.cardTitle}>Sheet previews</div>
              </div>
              <div className={styles.sheetsGrid}>
                {SHEET_LABELS.map(([a, b], i) => {
                  const ready = result && sheetReadyCount > 0 && i < sheetReadyCount;
                  return (
                    <div
                      key={`${a}-${b}`}
                      className={`${styles.sheetThumb} ${ready ? styles.sheetThumbReady : ""}`}
                    >
                      {ready ? <div className={styles.sheetThumbBadge}>PDF</div> : null}
                      <div className={styles.sheetThumbIcon}>{ready ? "🗒" : "📄"}</div>
                      <div className={styles.sheetThumbLabel}>
                        {a}
                        <br />
                        {b}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>📁</div>
                <div className={styles.cardTitle}>Output files</div>
              </div>
              <div className={styles.outputFiles}>
                {!result ? (
                  <div className={styles.outputEmpty}>
                    No outputs yet.
                    <br />
                    Run the pipeline to populate this list.
                  </div>
                ) : (
                  outputItems.map((item, idx) => {
                    const extClass =
                      item.ext === "pdf"
                        ? styles.extPdf
                        : item.ext === "svg"
                          ? styles.extSvg
                          : item.ext === "dxf"
                            ? styles.extDxf
                            : item.ext === "csv"
                              ? styles.extCsv
                              : styles.extJson;
                    const Inner = item.href ? "a" : "div";
                    const props = item.href
                      ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
                      : {};
                    return (
                      <Inner
                        key={`${item.name}-${idx}`}
                        className={styles.outputItem}
                        {...props}
                      >
                        <span className={`${styles.outputExt} ${extClass}`}>
                          {item.ext.toUpperCase()}
                        </span>
                        <span className={styles.outputName}>{item.name}</span>
                        {item.size ? (
                          <span className={styles.outputSize}>{item.size}</span>
                        ) : null}
                      </Inner>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
