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
        url,
        fonts: FONT_URLS,
        workerFactory,
        progressCbk: () => {},
      });
      if (cancelled) return;
      readLayers(viewer);
      try {
        applyTheme(viewer, themeRef.current);
      } catch (colorError) {
        console.warn("DXF viewer background", colorError);
      }
      fitDrawing(viewer);
      setReady(true);
    };

    (async () => {
      try {
        setReady(false);
        setError("");
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
            {error ? <p className={styles.error}>{error}</p> : <span className={styles.spinner} />}
          </div>
        ) : null}
      </div>
    </div>
  );
}
