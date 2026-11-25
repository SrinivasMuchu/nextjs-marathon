"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./DxfViewer.module.css";

const FONT_URLS = [
  "/cad-fonts/Roboto-Regular.ttf",
  "/cad-fonts/NotoSans-Regular.ttf",
];
const THEME_STORAGE_KEY = "marathon-dxf-viewer-theme";
const THEME_CLEAR_COLOR = {
  dark: 0x1e1e1e,
  light: 0xffffff,
};

function readSavedTheme() {
  if (typeof window === "undefined") return "dark";
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
  } catch (storageError) {
    return "dark";
  }
}

function applyTheme(viewer, theme) {
  viewer.SetClearColor(THEME_CLEAR_COLOR[theme] || THEME_CLEAR_COLOR.dark);
}

const LOAD_PHASE = {
  font: "Loading fonts",
  fetch: "Downloading the drawing",
  parse: "Reading the drawing",
  prepare: "Preparing the view",
};

function loadStatus(phase, processed, total) {
  const name = LOAD_PHASE[phase] || "Opening the drawing";
  const done = Number(processed);
  const all = Number(total);
  if (Number.isFinite(done) && Number.isFinite(all) && all > 0) {
    const percent = Math.min(100, Math.round((done / all) * 100));
    return `${name}… ${percent}%`;
  }
  return `${name}…`;
}

function fitDrawing(viewer) {
  const bounds = viewer.GetBounds();
  if (!bounds) return;
  const origin = viewer.GetOrigin();
  viewer.FitView(
    bounds.minX - origin.x,
    bounds.maxX - origin.x,
    bounds.minY - origin.y,
    bounds.maxY - origin.y,
    0.1,
  );
}

function createParseWorker() {
  return new Worker(new URL("./dxfViewer.worker.js", import.meta.url));
}

const DXF_SENTINELS = new Set(["ENDSEC", "EOF", "SECTION", "ENDTAB", "ENDBLK", "SEQEND"]);

function isDxfGroupCode(line) {
  const code = line.trim();
  if (!code || code === "-") return false;
  let index = code[0] === "-" ? 1 : 0;
  if (index >= code.length) return false;
  for (; index < code.length; index += 1) {
    const char = code.charCodeAt(index);
    if (char < 48 || char > 57) return false;
  }
  return true;
}

/**
 * Some DXFs repeat the group code before a section end:
 *   0 / 0 / ENDSEC
 * The parser then reads ENDSEC as a group code. Drop that extra 0.
 * Returns null when the text is already paired.
 */
function repairDxfText(text) {
  const newline = text.includes("\r\n") ? "\r\n" : "\n";
  const lines = text.split(/\r?\n/);
  if (lines.length && lines[lines.length - 1] === "") lines.pop();
  const out = [];
  let changed = false;
  let index = 0;
  while (index < lines.length) {
    const code = lines[index].trim();
    if (
      !isDxfGroupCode(lines[index])
      && DXF_SENTINELS.has(code)
      && out.length
      && out[out.length - 1].trim() === "0"
    ) {
      out.pop();
      out.push(lines[index]);
      changed = true;
      index += 1;
      continue;
    }
    out.push(lines[index]);
    index += 1;
    if (index < lines.length) {
      out.push(lines[index]);
      index += 1;
    }
  }
  if (!changed) return null;
  return `${out.join(newline)}${newline}`;
}

async function prepareDrawingUrl(url) {
  const response = await fetch(url);
  if (!response.ok) return { href: url, revoke() {} };
  const text = await response.text();
  const repaired = repairDxfText(text);
  if (!repaired) return { href: url, revoke() {} };
  const blobUrl = URL.createObjectURL(new Blob([repaired], { type: "application/dxf" }));
  return {
    href: blobUrl,
    revoke() {
      URL.revokeObjectURL(blobUrl);
    },
  };
}

/**
 * WebGL DXF viewer (vagran/dxf-viewer). The chrome matches the 3D CAD viewer:
 * the site header stays, and this bar uses the same purple viewer header.
 * Pan is a left drag and the wheel zooms.
 */
export default function DxfViewer({ url, fileName }) {
  const canvasRef = useRef(null);
  const viewerRef = useRef(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("The drawing is not on screen yet.");
  const [layers, setLayers] = useState([]);
  const [layersOpen, setLayersOpen] = useState(true);
  const [theme, setTheme] = useState(readSavedTheme);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const readLayers = useCallback((viewer) => {
    const next = [];
    try {
      // A DXF can store layers as off. The viewer starts with every layer shown
      // and every checkbox selected; the user turns individual layers off after that.
      for (const layer of viewer.GetLayers(false)) {
        viewer.ShowLayer(layer.name, true);
        next.push({
          name: layer.name,
          displayName: layer.displayName || layer.name,
          color: layer.color,
          visible: true,
        });
      }
    } catch (layerError) {
      console.warn("DXF layers unavailable", layerError);
    }
    setLayers(next);
  }, []);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container || !url) return undefined;

    let cancelled = false;
    let viewer = null;
    let prepared = null;

    const destroy = () => {
      if (viewer) {
        try {
          viewer.Destroy();
        } catch (destroyError) {
          console.warn("DXF viewer cleanup", destroyError);
        }
        viewer = null;
      }
      viewerRef.current = null;
      container.replaceChildren();
    };

    const load = async (useWorker) => {
      const { DxfViewer: DxfViewerCtor } = await import("dxf-viewer");
      if (cancelled) return;
      destroy();
      viewer = new DxfViewerCtor(container, {
        autoResize: true,
        antialias: true,
        blackWhiteInversion: true,
      });
      try {
        applyTheme(viewer, themeRef.current);
      } catch (colorError) {
        console.warn("DXF viewer background", colorError);
      }
      viewerRef.current = viewer;
      if (!viewer.HasRenderer()) {
        throw new Error("WebGL is not available in this browser.");
      }
      const onMessage = (event) => {
        const detail = event?.detail;
        if (!detail || cancelled) return;
        if (detail.level === "error") setError(detail.message || "The drawing could not be rendered.");
      };
      viewer.Subscribe("message", onMessage);
      let workerFactory = null;
      if (useWorker) {
        try {
          const probe = createParseWorker();
          probe.terminate();
          workerFactory = createParseWorker;
        } catch (workerError) {
          console.warn("DXF parse worker unavailable; parsing on the main thread", workerError);
        }
      }
      await viewer.Load({
        url: prepared?.href || url,
        fonts: FONT_URLS,
        workerFactory,
        progressCbk: (phase, processed, total) => {
          if (!cancelled) setStatus(loadStatus(phase, processed, total));
        },
      });
      if (cancelled) return;
      readLayers(viewer);
      try {
        applyTheme(viewer, themeRef.current);
      } catch (colorError) {
        console.warn("DXF viewer background", colorError);
      }
      fitDrawing(viewer);
      setError("");
      setReady(true);
    };

    (async () => {
      try {
        setReady(false);
        setError("");
        setStatus("The drawing is not on screen yet.");
        try {
          setStatus("Checking the file…");
          prepared = await prepareDrawingUrl(url);
        } catch (prepareError) {
          console.warn("DXF repair skipped", prepareError);
          prepared = null;
        }
        if (cancelled) {
          prepared?.revoke();
          return;
        }
        try {
          await load(true);
        } catch (workerLoadError) {
          if (cancelled) return;
          console.warn("DXF worker load failed; retrying without a worker", workerLoadError);
          await load(false);
        }
      } catch (loadError) {
        if (cancelled) return;
        console.error(loadError);
        setError(loadError?.message || "The drawing could not be rendered.");
        setReady(false);
      }
    })();

    return () => {
      cancelled = true;
      destroy();
      prepared?.revoke();
    };
  }, [url, readLayers]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (viewer && viewer.HasRenderer()) {
      try {
        applyTheme(viewer, theme);
      } catch (colorError) {
        console.warn("DXF viewer background", colorError);
      }
    }
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (storageError) {
      // The drawing still switches; the choice just will not survive a reload.
    }
  }, [theme]);

  const withViewer = (action) => {
    const viewer = viewerRef.current;
    if (!viewer || !viewer.HasRenderer()) return;
    action(viewer);
  };

  const setLayerVisibility = (names, visible) => {
    withViewer((viewer) => {
      names.forEach((name) => viewer.ShowLayer(name, visible));
    });
    const chosen = new Set(names);
    setLayers((current) => current.map((item) => (
      chosen.has(item.name) ? { ...item, visible } : item
    )));
  };

  const onToggleLayer = (layer) => {
    setLayerVisibility([layer.name], !layer.visible);
  };

  const onToggleAllLayers = () => {
    const show = layers.some((layer) => !layer.visible);
    setLayerVisibility(layers.map((layer) => layer.name), show);
  };

  const onFit = () => withViewer((viewer) => fitDrawing(viewer));

  return (
    <div className={`${styles.shell} ${theme === "light" ? styles.shellLight : ""}`}>
      <header className={styles.toolbar}>
        <button
          type="button"
          className={styles.button}
          onClick={() => setLayersOpen((open) => !open)}
          disabled={!ready || layers.length === 0}
          aria-expanded={layersOpen}
        >
          <span className={styles.buttonIcon} aria-hidden="true">☰</span>
          Layers
        </button>
        <span className={styles.title}>{fileName || "Drawing"}</span>
        <button
          type="button"
          className={`${styles.button} ${theme === "dark" ? styles.buttonActive : ""}`}
          onClick={() => setTheme("dark")}
          aria-pressed={theme === "dark"}
        >
          Dark
        </button>
        <button
          type="button"
          className={`${styles.button} ${theme === "light" ? styles.buttonActive : ""}`}
          onClick={() => setTheme("light")}
          aria-pressed={theme === "light"}
        >
          Light
        </button>
        <button type="button" className={styles.button} onClick={onFit} disabled={!ready}>Fit</button>
      </header>
      <div className={styles.stage}>
        <div className={styles.canvas} ref={canvasRef} />
        {layersOpen && layers.length > 0 ? (
          <aside className={styles.layers} aria-label="Layers">
            <label className={styles.layerRow}>
              <input
                type="checkbox"
                checked={layers.every((layer) => layer.visible)}
                onChange={onToggleAllLayers}
              />
              <span>All layers</span>
            </label>
            {layers.map((layer) => (
              <label className={styles.layerRow} key={layer.name}>
                <input
                  type="checkbox"
                  checked={layer.visible}
                  onChange={() => onToggleLayer(layer)}
                />
                <span
                  className={styles.swatch}
                  style={{ background: `#${((Number(layer.color) || 0) >>> 0).toString(16).padStart(6, "0").slice(-6)}` }}
                />
                <span>{layer.displayName}</span>
              </label>
            ))}
          </aside>
        ) : null}
        {!ready || error ? (
          <div className={styles.overlay} role="status">
            {error ? <p className={styles.error}>{error}</p> : (
              <div className={styles.loading}>
                <span className={styles.spinner} />
                <p className={styles.loadingText}>{status}</p>
                <p className={styles.loadingHint}>Nothing is shown until the whole file has loaded.</p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
