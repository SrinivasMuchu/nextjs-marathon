"use client";

import { useEffect, useState } from "react";

let overlayState = null;
let persistAcrossRoute = false;
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener(overlayState));
}

export function persistConverterLoadingOverlay() {
  persistAcrossRoute = true;
}

export function showConverterLoadingOverlay(payload) {
  overlayState = { ...payload, open: true };
  emit();
}

export function updateConverterLoadingOverlay(patch) {
  if (!overlayState?.open) return;
  overlayState = { ...overlayState, ...patch, open: true };
  emit();
}

export function hideConverterLoadingOverlay() {
  persistAcrossRoute = false;
  overlayState = null;
  emit();
}

export function shouldPersistConverterLoadingOverlay() {
  return persistAcrossRoute;
}

export function getConverterLoadingOverlay() {
  return overlayState;
}

export function useConverterLoadingOverlay() {
  const [state, setState] = useState(overlayState);

  useEffect(() => {
    listeners.add(setState);
    setState(overlayState);
    return () => listeners.delete(setState);
  }, []);

  return state;
}
