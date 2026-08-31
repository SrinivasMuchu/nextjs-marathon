"use client";

import React, { Component, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { DESIGN_GLB_PREFIX_URL } from "@/config";
import { techDrawCdnBaseFromPrefix } from "@/lib/techDraw/fetchTechDrawBundleFromPrefix";
import styles from "./CadDrawingPipeline.module.css";

// Unlit fill — always visible on dark UI (no env map / lighting dependency).
const CAD_FILL = "#c5c5ca";
const CAD_EDGE = "#1a1a1e";
const EDGE_THRESHOLD_DEG = 24;
const VIEW_BG = "#14141c";

const LETTER_COLORS = {
  A: "#7c5cff",
  B: "#00e5a0",
  C: "#f5a623",
};

const IDLE_PLANE = "#a78bfa";
const IDLE_AXIS = "#67e8f9";
const HOVER = "#ffffff";

function asVec3(arr, fallback = [0, 0, 0]) {
  if (!Array.isArray(arr) || arr.length < 3) return new THREE.Vector3(...fallback);
  const x = Number(arr[0]);
  const y = Number(arr[1]);
  const z = Number(arr[2]);
  if (![x, y, z].every(Number.isFinite)) return new THREE.Vector3(...fallback);
  return new THREE.Vector3(x, y, z);
}

function unit(v) {
  const n = v.length();
  if (n < 1e-9) return new THREE.Vector3(0, 0, 1);
  return v.clone().multiplyScalar(1 / n);
}

export function buildDatumPreviewUrl(job, jobId) {
  if (!job && !jobId) return "";
  if (job?.datum_preview_url) return String(job.datum_preview_url).trim();

  const id = String(jobId || job?._id || job?.id || "").trim();
  const prefix = String(
    job?.datum_preview_prefix ||
      job?.output_s3_prefix ||
      (id ? `freecad-techdraw/${id}` : ""),
  )
    .trim()
    .replace(/^\//, "");
  const file = String(job?.datum_preview_file || "datum_preview.glb").trim().replace(/^\//, "");
  if (!prefix || !file) return "";

  const base =
    techDrawCdnBaseFromPrefix(prefix) ||
    `${DESIGN_GLB_PREFIX_URL.replace(/\/$/, "")}/${prefix}`;
  return `${base.replace(/\/$/, "")}/${file}`;
}

class ViewerErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  static getDerivedStateFromError() {
    return { error: true };
  }

  render() {
    if (this.state.error) return this.props.fallback;
    return this.props.children;
  }
}

function applyVisibleCadLook(root) {
  root.traverse((node) => {
    if (!node.isMesh || !node.geometry) return;

    // Always unlit — lit GLB materials go black with no lights / after hard reload.
    const fill = new THREE.MeshBasicMaterial({
      color: CAD_FILL,
      side: THREE.DoubleSide,
      toneMapped: false,
      vertexColors: false,
    });
    if (Array.isArray(node.material)) {
      node.material.forEach((m) => m?.dispose?.());
    } else {
      node.material?.dispose?.();
    }
    node.material = fill;
    node.castShadow = false;
    node.receiveShadow = false;

    if (!node.getObjectByName("__cad_edges__")) {
      const edgeGeo = new THREE.EdgesGeometry(node.geometry, EDGE_THRESHOLD_DEG);
      const edgeLines = new THREE.LineSegments(
        edgeGeo,
        new THREE.LineBasicMaterial({
          color: CAD_EDGE,
          toneMapped: false,
        }),
      );
      edgeLines.name = "__cad_edges__";
      edgeLines.raycast = () => null;
      node.add(edgeLines);
    }
  });
}

function prepareCadRoot(object3d) {
  const root = new THREE.Group();
  root.add(object3d);
  // FreeCAD / STEP = Z-up → three.js Y-up
  root.rotation.x = -Math.PI / 2;
  root.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(root);
  if (!box.isEmpty()) {
    const center = box.getCenter(new THREE.Vector3());
    root.position.sub(center);
    root.updateMatrixWorld(true);
    const sized = new THREE.Box3().setFromObject(root);
    root.userData.fitSize = sized.getSize(new THREE.Vector3());
    // Visual CAD center after recenter — always world origin.
    root.userData.fitCenter = new THREE.Vector3(0, 0, 0);
  } else {
    root.userData.fitSize = new THREE.Vector3(1, 1, 1);
    root.userData.fitCenter = new THREE.Vector3(0, 0, 0);
  }
  applyVisibleCadLook(root);
  return root;
}

function GlbModel({ url, modelRef, onReady, children }) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => prepareCadRoot(scene.clone(true)), [scene]);

  useLayoutEffect(() => {
    modelRef.current = model;
    onReady?.();
    return () => {
      modelRef.current = null;
    };
    // Intentionally omit onReady — parent recreates it every render; that was
    // re-fitting the camera (and snapping rotation back) on hover/pick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, modelRef]);

  return <primitive object={model}>{children}</primitive>;
}

function StlModel({ url, modelRef, onReady, children }) {
  const geometry = useLoader(STLLoader, url);
  const model = useMemo(() => {
    const geo = geometry.clone();
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ color: CAD_FILL, toneMapped: false }),
    );
    return prepareCadRoot(mesh);
  }, [geometry]);

  useLayoutEffect(() => {
    modelRef.current = model;
    onReady?.();
    return () => {
      modelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, modelRef]);

  return <primitive object={model}>{children}</primitive>;
}

function cadFitCenter(model) {
  // prepareCadRoot recenters geometry at world origin; group.position is the
  // pre-center offset and must NOT be used as the orbit / look-at target.
  const stored = model?.userData?.fitCenter;
  if (stored?.isVector3) return stored.clone();
  return new THREE.Vector3(0, 0, 0);
}

function applyControlsFit(controls, camera, center, dist, minDistance, maxDistance) {
  if (!controls) return;

  if (typeof controls.target?.copy === "function") {
    controls.target.copy(center);
  }
  if (Number.isFinite(minDistance)) controls.minDistance = minDistance;
  if (Number.isFinite(maxDistance)) controls.maxDistance = maxDistance;

  camera.lookAt(center);
  camera.updateMatrix();
  camera.updateMatrixWorld(true);

  if (typeof controls.update === "function") {
    controls.update();
  }
  // Persist this pose as the OrbitControls baseline (prevents snap-back).
  if (typeof controls.saveState === "function") {
    controls.saveState();
  }

  void dist;
}

function FitCamera({ modelRef, readyTick, fitRequest }) {
  const { camera, controls, size } = useThree();
  const lastFitKeyRef = useRef("");

  // Full reframes only on first model ready + explicit "Reset view".
  // Do NOT reframe on canvas size changes (panel updates after pick used to snap the camera back).
  useLayoutEffect(() => {
    const model = modelRef.current;
    if (!model || !controls) return;
    if (!size?.width || !size?.height) return;
    if (!readyTick) return;

    // readyTick only gates "model is ready"; do not include it in the key —
    // hover/pick re-renders used to bump readyTick and snap the camera back.
    const fitKey = `fit:${fitRequest}`;
    const shouldReframe = lastFitKeyRef.current !== fitKey;

    camera.aspect = size.width / size.height;

    if (!shouldReframe) {
      camera.updateProjectionMatrix();
      return;
    }
    lastFitKeyRef.current = fitKey;

    model.updateWorldMatrix(true, true);
    const dims =
      model.userData?.fitSize?.clone?.() ||
      (() => {
        const box = new THREE.Box3().setFromObject(model);
        return box.isEmpty() ? null : box.getSize(new THREE.Vector3());
      })();
    if (!dims) return;

    const center = cadFitCenter(model);
    const maxDim = Math.max(dims.x, dims.y, dims.z, 1e-4);
    const radius = Math.max(dims.length() * 0.5, maxDim * 0.5);

    const fov = THREE.MathUtils.degToRad(camera.fov);
    const fitH = radius / Math.tan(fov / 2);
    const fitW = radius / (Math.tan(fov / 2) * camera.aspect);
    const dist = Math.max(fitH, fitW) * 1.08;

    const dir = new THREE.Vector3(1, 0.55, 0.85).normalize();
    camera.position.copy(center).addScaledVector(dir, dist);
    camera.near = Math.max(dist / 400, maxDim / 1000);
    camera.far = Math.max(dist * 50, maxDim * 100);
    camera.up.set(0, 1, 0);
    camera.updateProjectionMatrix();

    applyControlsFit(
      controls,
      camera,
      center,
      dist,
      Math.max(radius * 0.2, dist * 0.05),
      dist * 20,
    );
  }, [camera, controls, modelRef, readyTick, fitRequest, size.width, size.height]);

  return null;
}

function letterForCandidate(picks, candidateId) {
  const id = String(candidateId);
  for (const L of ["A", "B", "C"]) {
    if (String(picks[L] || "") === id) return L;
  }
  return null;
}

function overlayColor(candidateId, picks, hoveredId) {
  const letter = letterForCandidate(picks, candidateId);
  if (letter) return LETTER_COLORS[letter];
  if (String(hoveredId) === String(candidateId)) return HOVER;
  return null;
}

function nearestCandidateId(localPoint, candidates) {
  let bestId = null;
  let bestScore = Infinity;
  for (const c of candidates) {
    const fr = c.feature_ref;
    if (!fr?.center) continue;
    const center = asVec3(fr.center);
    let score;
    if (c.kind === "axis" || fr.kind === "axis") {
      const axis = unit(asVec3(fr.axis, [0, 0, 1]));
      const rel = localPoint.clone().sub(center);
      const along = rel.dot(axis);
      const radial = rel.clone().addScaledVector(axis, -along).length();
      score = radial + Math.abs(along) * 0.15;
    } else {
      const normal = unit(asVec3(fr.normal, [0, 0, 1]));
      const rel = localPoint.clone().sub(center);
      const planar = rel.clone().addScaledVector(normal, -rel.dot(normal)).length();
      const along = Math.abs(rel.dot(normal));
      score = planar * 0.35 + along;
    }
    if (score < bestScore) {
      bestScore = score;
      bestId = c.id;
    }
  }
  return bestId;
}

const DRAG_PX = 8;

function pointerClient(e) {
  const n = e?.nativeEvent || e;
  return { x: n?.clientX ?? 0, y: n?.clientY ?? 0 };
}

function useClickOrDragPick(onPick, disabled) {
  const downRef = useRef(null);

  const onPointerDown = (e) => {
    // Never stopPropagation / preventDefault — Arcball needs the DOM gesture.
    if (disabled) return;
    const { x, y } = pointerClient(e);
    downRef.current = {
      x,
      y,
      id: e.object?.userData?.datumId ?? null,
      point: e.point?.clone?.() || null,
    };
  };

  const onPointerUp = (e) => {
    if (disabled) return;
    const down = downRef.current;
    downRef.current = null;
    if (!down) return;
    const { x, y } = pointerClient(e);
    if (Math.hypot(x - down.x, y - down.y) > DRAG_PX) return;
    const datumId = e.object?.userData?.datumId ?? down.id;
    onPick?.(datumId, down.point || e.point);
  };

  return { onPointerDown, onPointerUp };
}

function PlaneOverlay({ candidate, color, opacity, onHover, onPick, disabled, modelSize }) {
  const fr = candidate.feature_ref || {};
  const normal = unit(asVec3(fr.normal, [0, 0, 1]));
  const center = asVec3(fr.center).addScaledVector(normal, Math.max(modelSize * 0.01, 0.2));
  const raw = Math.max(Number(candidate.size) || 20, 8) * 0.4;
  const radius = Math.min(raw, Math.max(modelSize * 0.4, 6));
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  const pick = useClickOrDragPick((id) => {
    if (id != null) onPick?.(id);
  }, disabled);

  return (
    <mesh
      userData={{ datumId: candidate.id }}
      position={center.toArray()}
      quaternion={quat}
      renderOrder={20}
      onPointerOver={(e) => {
        document.body.style.cursor = disabled ? "grab" : "pointer";
        if (!disabled) onHover?.(candidate.id);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "grab";
        onHover?.(null);
      }}
      onPointerDown={pick.onPointerDown}
      onPointerUp={pick.onPointerUp}
    >
      <circleGeometry args={[radius, 28]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function AxisOverlay({ candidate, color, opacity, onHover, onPick, disabled, modelSize }) {
  const fr = candidate.feature_ref || {};
  const center = asVec3(fr.center);
  const axis = unit(asVec3(fr.axis, [0, 0, 1]));
  const diameter = Math.max(Number(fr.diameter) || Number(candidate.size) || 8, 2);
  const length = Math.min(
    Math.max(diameter * 4, Number(candidate.size) || 20, 16),
    Math.max(modelSize * 1.1, 16),
  );
  const radius = Math.max(Math.min(diameter * 0.18, modelSize * 0.05), 0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);
  const pick = useClickOrDragPick((id) => {
    if (id != null) onPick?.(id);
  }, disabled);

  return (
    <mesh
      userData={{ datumId: candidate.id }}
      position={center.toArray()}
      quaternion={quat}
      renderOrder={20}
      onPointerOver={() => {
        document.body.style.cursor = disabled ? "grab" : "pointer";
        if (!disabled) onHover?.(candidate.id);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "grab";
        onHover?.(null);
      }}
      onPointerDown={pick.onPointerDown}
      onPointerUp={pick.onPointerUp}
    >
      <cylinderGeometry args={[radius, radius, length, 14]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function DatumOverlays({ candidates, picks, hoveredId, onHover, onPick, disabled, modelSize, pickMode = false }) {
  return (
    <group>
      {candidates.map((c) => {
        const fr = c.feature_ref;
        if (!fr?.center) return null;
        const assigned = letterForCandidate(picks, c.id);
        const isHover = String(hoveredId) === String(c.id);
        const color =
          overlayColor(c.id, picks, hoveredId) || (c.kind === "axis" ? IDLE_AXIS : IDLE_PLANE);
        const opacity = assigned ? 0.7 : isHover ? 0.55 : pickMode ? 0.18 : 0.38;
        const props = { candidate: c, color, opacity, onHover, onPick, disabled, modelSize };
        if (c.kind === "axis" || fr.kind === "axis") {
          return <AxisOverlay key={c.id} {...props} />;
        }
        return <PlaneOverlay key={c.id} {...props} />;
      })}
    </group>
  );
}

function ModelScene({
  glbUrl,
  isStl,
  candidates,
  pickPool,
  pickMode = false,
  picks,
  hoveredId,
  onHover,
  onPick,
  disabled,
  fitRequest,
}) {
  const modelRef = useRef(null);
  const [readyTick, setReadyTick] = useState(0);
  const [modelSize, setModelSize] = useState(50);
  const downRef = useRef(null);
  const clickPool = pickPool?.length ? pickPool : candidates;
  const overlayCandidates = useMemo(() => {
    if (!pickMode) return candidates;
    return clickPool;
  }, [pickMode, candidates, clickPool]);

  const onReady = () => {
    requestAnimationFrame(() => {
      const model = modelRef.current;
      if (model) {
        const size =
          model.userData?.fitSize?.clone?.() ||
          (() => {
            const box = new THREE.Box3().setFromObject(model);
            return box.isEmpty() ? null : box.getSize(new THREE.Vector3());
          })();
        if (size) setModelSize(Math.max(size.x, size.y, size.z, 1));
      }
      // Only signal readiness once — never increment again (avoids camera reset).
      setReadyTick((n) => (n > 0 ? n : 1));
    });
  };

  const handlePointerDown = (e) => {
    if (disabled) return;
    const { x, y } = pointerClient(e);
    downRef.current = {
      x,
      y,
      datumId: e.object?.userData?.datumId ?? null,
      point: e.point?.clone?.() || null,
    };
  };

  const handlePointerUp = (e) => {
    if (disabled) return;
    const down = downRef.current;
    downRef.current = null;
    if (!down) return;
    const { x, y } = pointerClient(e);
    if (Math.hypot(x - down.x, y - down.y) > DRAG_PX) return;

    if (down.datumId != null || e.object?.userData?.datumId != null) {
      // Overlay handlers already assigned — skip mesh nearest-hit pick.
      return;
    }

    const model = modelRef.current;
    const point = down.point || e.point;
    if (!model || !point) return;
    const cadLocal = model.worldToLocal(point.clone());
    const id = nearestCandidateId(cadLocal, clickPool);
    if (id != null) onPick?.(id);
  };

  const overlays = overlayCandidates.length ? (
    <DatumOverlays
      candidates={overlayCandidates}
      picks={picks}
      hoveredId={hoveredId}
      onHover={onHover}
      onPick={onPick}
      disabled={disabled}
      modelSize={modelSize}
      pickMode={pickMode}
    />
  ) : null;

  return (
    <>
      <group onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
        {isStl ? (
          <StlModel url={glbUrl} modelRef={modelRef} onReady={onReady}>
            {overlays}
          </StlModel>
        ) : (
          <GlbModel url={glbUrl} modelRef={modelRef} onReady={onReady}>
            {overlays}
          </GlbModel>
        )}
      </group>

      <FitCamera modelRef={modelRef} readyTick={readyTick} fitRequest={fitRequest} />
      {/* OrbitControls with damping off = view stays exactly where the user releases. */}
      <OrbitControls
        makeDefault
        enableDamping={false}
        enablePan
        enableRotate
        enableZoom
        zoomSpeed={1.15}
        rotateSpeed={0.9}
        panSpeed={0.9}
        minDistance={0.01}
        maxDistance={1e7}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        onStart={() => {
          document.body.style.cursor = "grabbing";
        }}
        onEnd={() => {
          document.body.style.cursor = "grab";
        }}
      />
    </>
  );
}

export default function TechDrawDatumViewer({
  job,
  jobId,
  candidates = [],
  pickableCandidates = [],
  pickMode = false,
  picks,
  activeLetter,
  onPickCandidate,
  disabled = false,
}) {
  const [hoveredId, setHoveredId] = useState(null);
  const [mountCanvas, setMountCanvas] = useState(false);
  const [fitRequest, setFitRequest] = useState(0);
  const previewUrl = useMemo(
    () => buildDatumPreviewUrl(job, jobId || job?._id || job?.id),
    [job, jobId],
  );
  const isStl = /\.stl(\?|$)/i.test(previewUrl);
  const pickPool = useMemo(
    () => (pickableCandidates?.length ? pickableCandidates : candidates),
    [pickableCandidates, candidates],
  );

  useEffect(() => {
    let cancelled = false;
    const id = window.setTimeout(() => {
      if (!cancelled) setMountCanvas(true);
    }, 20);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  if (!previewUrl) {
    return (
      <div className={styles.datumViewerEmpty}>
        <p>3D preview is preparing… You can still pick datums from the list.</p>
      </div>
    );
  }

  const fallback = (
    <div className={styles.datumViewerEmpty}>
      <p>Could not load 3D preview. Use the dropdowns or list below.</p>
    </div>
  );

  return (
    <div className={styles.datumViewerShell}>
      <div className={styles.datumViewerToolbar}>
        <span className={styles.datumViewerHint}>
          {disabled
            ? "Read-only preview"
            : pickMode
              ? `Click any face or cylinder on the model for Datum ${activeLetter}`
              : `Drag to tumble · scroll to zoom · right-drag to pan · click for Datum ${activeLetter}`}
        </span>
        <div className={styles.datumViewerToolbarRight}>
          <div className={styles.datumViewerLegend}>
            {["A", "B", "C"].map((L) => (
              <span
                key={L}
                className={styles.datumViewerLegendItem}
                style={{ "--swatch": LETTER_COLORS[L] }}
              >
                {L}
              </span>
            ))}
          </div>
          <button
            type="button"
            className={styles.datumViewerResetBtn}
            onClick={() => setFitRequest((n) => n + 1)}
            title="Reset camera to fit the part"
          >
            Reset view
          </button>
        </div>
      </div>
      <div className={styles.datumViewerCanvas}>
        {!mountCanvas ? (
          <div className={styles.datumViewerEmpty}>
            <p>Loading 3D preview…</p>
          </div>
        ) : (
          <ViewerErrorBoundary fallback={fallback}>
            <Canvas
              camera={{ position: [3, 2, 3], fov: 35, near: 0.01, far: 1e6 }}
              dpr={[1, 1.75]}
              frameloop="always"
              gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
              onCreated={({ gl }) => {
                gl.setClearColor(VIEW_BG, 1);
                gl.toneMapping = THREE.NoToneMapping;
                gl.outputColorSpace = THREE.SRGBColorSpace;
                gl.domElement.style.touchAction = "none";
                gl.domElement.style.cursor = "grab";
              }}
              style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }}
            >
              <Suspense fallback={null}>
                <ModelScene
                  glbUrl={previewUrl}
                  isStl={isStl}
                  candidates={candidates}
                  pickPool={pickPool}
                  pickMode={pickMode}
                  picks={picks}
                  hoveredId={hoveredId}
                  onHover={setHoveredId}
                  onPick={onPickCandidate}
                  disabled={disabled}
                  fitRequest={fitRequest}
                />
              </Suspense>
            </Canvas>
          </ViewerErrorBoundary>
        )}
      </div>
    </div>
  );
}
