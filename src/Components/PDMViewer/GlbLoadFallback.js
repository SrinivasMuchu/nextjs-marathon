"use client";

import React from "react";

/** Older CAD viewer jobs only have `{id}.glb`. New jobs also upload `{id}_compressed.glb`. */
export function uncompressedCadViewerGlbUrl(url) {
  if (!url || !String(url).includes("_compressed.glb")) return "";
  return String(url).replace("_compressed.glb", ".glb");
}

/**
 * Loads `url`. If that file 404s and it is a Draco `{id}_compressed.glb`, retries `{id}.glb`.
 */
export class GlbLoadFallback extends React.Component {
  state = { stage: "primary", hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.setState((prev) => {
      const fallback = uncompressedCadViewerGlbUrl(this.props.url);
      if (prev.stage === "primary" && fallback) {
        return { hasError: false, stage: "fallback" };
      }
      return { hasError: true, stage: "failed" };
    });
  }

  componentDidUpdate(prev) {
    if (prev.url !== this.props.url && this.state.stage !== "primary") {
      this.setState({ hasError: false, stage: "primary" });
    }
  }

  render() {
    if (this.state.stage === "failed" || this.state.hasError) return null;
    const fallback = uncompressedCadViewerGlbUrl(this.props.url);
    const url =
      this.state.stage === "fallback" && fallback ? fallback : this.props.url;
    return this.props.children(url);
  }
}
