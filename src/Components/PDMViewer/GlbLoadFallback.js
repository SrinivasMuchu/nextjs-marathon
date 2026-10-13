"use client";

import React, { useEffect, useRef, useState } from "react";

/** Older jobs only have `{id}.glb`. New CAD viewer / library GLB jobs also upload `{id}_compressed.glb`. */
export function uncompressedCadViewerGlbUrl(url) {
  if (!url || !String(url).includes("_compressed.glb")) return "";
  return String(url).replace("_compressed.glb", ".glb");
}

function downloadGlbWithProgress(url, onProgress, signal) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";

    const abort = () => {
      try {
        xhr.abort();
      } catch {
        /* ignore */
      }
      reject(new DOMException("Aborted", "AbortError"));
    };
    if (signal) {
      if (signal.aborted) {
        abort();
        return;
      }
      signal.addEventListener("abort", abort, { once: true });
    }

    xhr.onprogress = (event) => {
      if (!event.lengthComputable || event.total <= 0) {
        onProgress?.(null);
        return;
      }
      const pct = Math.min(100, Math.round((event.loaded / event.total) * 100));
      onProgress?.(pct);
    };

    xhr.onload = () => {
      if (signal) signal.removeEventListener("abort", abort);
      if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
        onProgress?.(100);
        const blob = new Blob([xhr.response], { type: "model/gltf-binary" });
        resolve(URL.createObjectURL(blob));
        return;
      }
      reject(new Error(`HTTP ${xhr.status || 0}`));
    };

    xhr.onerror = () => {
      if (signal) signal.removeEventListener("abort", abort);
      reject(new Error("Network error while downloading GLB"));
    };

    xhr.onabort = () => {
      if (signal) signal.removeEventListener("abort", abort);
      reject(new DOMException("Aborted", "AbortError"));
    };

    xhr.send();
  });
}

/**
 * Downloads compressed GLB first (when URL is `*_compressed.glb`), then falls back to uncompressed.
 * Returns a blob object URL for `useGLTF` once the file bytes are ready.
 */
export function useGlbSource(url) {
  const [state, setState] = useState(() => ({
    status: url ? "loading" : "idle",
    progress: 0,
    progressKnown: false,
    stage: "compressed",
    objectUrl: null,
    error: null,
  }));
  const objectUrlRef = useRef(null);

  useEffect(() => {
    if (!url) {
      setState({
        status: "idle",
        progress: 0,
        progressKnown: false,
        stage: "compressed",
        objectUrl: null,
        error: null,
      });
      return undefined;
    }

    const controller = new AbortController();
    const fallbackUrl = uncompressedCadViewerGlbUrl(url);
    const attempts = fallbackUrl
      ? [
          { href: url, stage: "compressed" },
          { href: fallbackUrl, stage: "uncompressed" },
        ]
      : [{ href: url, stage: "direct" }];

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setState({
      status: "loading",
      progress: 0,
      progressKnown: false,
      stage: attempts[0].stage,
      objectUrl: null,
      error: null,
    });

    (async () => {
      let lastError = null;
      for (const attempt of attempts) {
        if (controller.signal.aborted) return;
        setState((prev) => ({
          ...prev,
          status: "loading",
          progress: 0,
          progressKnown: false,
          stage: attempt.stage,
          objectUrl: null,
          error: null,
        }));
        try {
          const objectUrl = await downloadGlbWithProgress(
            attempt.href,
            (pct) => {
              if (controller.signal.aborted) return;
              setState((prev) => ({
                ...prev,
                status: "loading",
                stage: attempt.stage,
                progress: pct == null ? prev.progress : pct,
                progressKnown: pct != null,
              }));
            },
            controller.signal
          );
          if (controller.signal.aborted) {
            URL.revokeObjectURL(objectUrl);
            return;
          }
          objectUrlRef.current = objectUrl;
          setState({
            status: "decoding",
            progress: 100,
            progressKnown: true,
            stage: attempt.stage,
            objectUrl,
            error: null,
          });
          return;
        } catch (err) {
          if (err?.name === "AbortError") return;
          lastError = err;
        }
      }
      if (controller.signal.aborted) return;
      setState({
        status: "failed",
        progress: 0,
        progressKnown: false,
        stage: attempts[attempts.length - 1]?.stage || "direct",
        objectUrl: null,
        error: lastError?.message || "Failed to load GLB",
      });
    })();

    return () => {
      controller.abort();
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [url]);

  const markReady = React.useCallback(() => {
    setState((prev) =>
      prev.status === "ready" ? prev : { ...prev, status: "ready", progress: 100, progressKnown: true }
    );
  }, []);

  return { ...state, markReady };
}

function stageLabel(stage, status) {
  if (status === "decoding") return "Preparing 3D model…";
  if (status === "failed") return "Failed to load model";
  if (stage === "compressed") return "Downloading compressed model…";
  if (stage === "uncompressed") return "Downloading full model…";
  return "Downloading model…";
}

/**
 * Overlay shown inside the viewer while GLB bytes download / decode.
 */
export function GlbViewerDownloadOverlay({
  status,
  progress = 0,
  progressKnown = false,
  stage = "compressed",
  error = null,
  variant = "dark",
}) {
  if (status === "ready" || status === "idle") return null;

  const isDark = variant === "dark";
  const pct = Math.max(0, Math.min(100, Number(progress) || 0));
  const showBar = status === "loading" || status === "decoding";
  const label = error && status === "failed" ? error : stageLabel(stage, status);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        background: isDark
          ? "radial-gradient(circle at center, rgba(30,30,30,0.82) 0%, rgba(18,16,28,0.92) 80%)"
          : "radial-gradient(circle at center, rgba(255,255,255,0.72) 0%, rgba(247,247,248,0.9) 78%)",
      }}
      aria-live="polite"
      aria-busy={status !== "failed"}
    >
      <div
        style={{
          minWidth: 220,
          maxWidth: 280,
          width: "70%",
          textAlign: "center",
          padding: "16px 18px",
          borderRadius: 12,
          background: isDark ? "rgba(18, 16, 28, 0.92)" : "rgba(255, 255, 255, 0.94)",
          border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #e5e7eb",
          boxShadow: isDark
            ? "0 12px 28px rgba(0,0,0,0.45)"
            : "0 12px 26px rgba(15,23,42,0.1)",
          color: isDark ? "#f3f4f6" : "#1f2937",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            margin: "0 auto 12px",
            borderRadius: "50%",
            border: `3px solid ${isDark ? "rgba(255,255,255,0.15)" : "#e5e7eb"}`,
            borderTopColor: "#610bee",
            animation: status === "failed" ? "none" : "glb-dl-spin 0.8s linear infinite",
          }}
        />
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{label}</p>
        {showBar && (
          <>
            <div
              style={{
                marginTop: 12,
                height: 6,
                borderRadius: 999,
                overflow: "hidden",
                background: isDark ? "rgba(255,255,255,0.12)" : "#e5e7eb",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: status === "decoding" ? "100%" : `${progressKnown ? pct : Math.max(pct, 8)}%`,
                  borderRadius: 999,
                  background: "#610bee",
                  transition: "width 160ms ease",
                  opacity: progressKnown || status === "decoding" ? 1 : 0.7,
                }}
              />
            </div>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 12,
                fontWeight: 600,
                color: isDark ? "rgba(243,244,246,0.75)" : "#64748b",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {status === "decoding"
                ? "Almost ready…"
                : progressKnown
                  ? `${pct}%`
                  : "Starting download…"}
            </p>
          </>
        )}
        <style>{`@keyframes glb-dl-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

/**
 * Loads `url` via download (compressed → uncompressed). Renders children with a blob URL when ready.
 * Prefer `useGlbSource` + `GlbViewerDownloadOverlay` when you need an outside-Canvas progress UI.
 */
export function GlbLoadFallback({ url, children, onStatusChange }) {
  const source = useGlbSource(url);

  useEffect(() => {
    onStatusChange?.(source);
  }, [source, onStatusChange]);

  if (source.status === "failed" || !source.objectUrl) return null;
  return children(source.objectUrl, source);
}
