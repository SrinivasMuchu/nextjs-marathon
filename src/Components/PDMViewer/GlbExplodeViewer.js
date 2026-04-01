"use client";

import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  Suspense,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * Default camera distance from OrbitControls target (origin). ~4 fits normalized unit-scale GLB;
 * old value 570 matched large CAD extents.
 */
const INITIAL_ORBIT_CAMERA_DISTANCE = 3.936;

/** Bust browser + CDN caches (CloudFront often serves an old GLB after S3 overwrite). */
function withAssetCacheBust(url, cacheBust) {
  if (!url || cacheBust == null || cacheBust === "") return url;
  const join = url.includes("?") ? "&" : "?";
  return `${url}${join}v=${encodeURIComponent(String(cacheBust))}`;
}

/** Fallback when JSON has no per-part explode */
const MAX_EXPLODE_SCALE = 12.0;

/**
 * Normalized CAD: distanceScale = max(MIN, NUM/effectiveSpan, R×RADIUS_MULT).
 * The R term keeps separation proportional to assembly size when JSON distances stay tiny.
 * Tune these if 100% dismantle should read more “catalog exploded view”.
 */
const NORMALIZED_EXPLODE_DISTANCE_SCALE_MIN = 55.0;
const NORMALIZED_EXPLODE_DISTANCE_SCALE_NUMERATOR = 110.0;
/** Extra scale from bounding-sphere radius R (world units) on the normalized path. */
const NORMALIZED_EXPLODE_DISTANCE_RADIUS_MULT = 28.0;
/**
 * If meta omits `normalizeTargetMaxSpan` but R is below this, treat as normalized (span 1).
 * Wider than ~2.5 so ~unit-scale assemblies that fill the view still get strong dismantle.
 */
const ASSUME_NORMALIZED_IF_BOUNDING_RADIUS_LE = 6.0;
/** Legacy non-normalized: scale dismantle vs bounding sphere radius (JSON distances ~CAD units). */
const LEGACY_EXPLODE_RADIUS_FACTOR = 0.38;

/** Reference UI accent (replaces red in CAD-style viewer chrome). */
const UI_ACCENT = "#610bee";
const UI_PANEL_RGBA = "rgba(18, 16, 28, 0.88)";
const UI_VIEWPORT_BG = "#1E1E1E";
const CAD_BASE_COLOR = "#999999";
const CAD_EDGE_COLOR = "#1f1f24";
const CAD_EDGE_THRESHOLD_DEG = 22;
/** Full `GlbExplodeViewer` root height. */
const UI_VIEWER_ROOT_HEIGHT = "90vh";
/** Assembly tree panel height (scrolls inside). */
const UI_ASSEMBLY_PANEL_HEIGHT = "60vh";
/** Assembly tree drawer */
const UI_TREE_WIDTH = 256;
/** Right-side camera / views stack — keep narrow like reference */
const UI_CONTROL_COLUMN_W = 102;
/** D-pad orbit button size (px) */
const UI_DPAD_BTN = 22;
const UI_DPAD_ZOOM_H = 20;

const _camOffset = new THREE.Vector3();
const _camSpherical = new THREE.Spherical();

const VIEW_PRESETS = {
  FRONT: [0, 0, 1],
  BACK: [0, 0, -1],
  LEFT: [-1, 0, 0],
  RIGHT: [1, 0, 0],
  TOP: [0, 1, 0],
  BOTTOM: [0, -1, 0],
  ISOMETRIC: null,
};

/**
 * Applies camera preset / orbit nudges / dolly when `request` changes (same Canvas as OrbitControls).
 */
function CameraViewControls({ request }) {
  const { camera, controls } = useThree();

  useLayoutEffect(() => {
    if (!request || !controls?.target) return;
    const target = controls.target;
    let dist = camera.position.distanceTo(target);
    if (!Number.isFinite(dist) || dist < 1e-6) {
      dist = INITIAL_ORBIT_CAMERA_DISTANCE;
    }

    const kind = request.kind;

    if (kind === "preset") {
      const name = request.name;
      let ax = 0;
      let ay = 0;
      let az = 1;
      if (name === "ISOMETRIC") {
        const s = 1 / Math.sqrt(3);
        ax = s;
        ay = s;
        az = s;
      } else {
        const d = VIEW_PRESETS[name];
        if (d) [ax, ay, az] = d;
      }
      camera.position.set(
        target.x + ax * dist,
        target.y + ay * dist,
        target.z + az * dist
      );
      if (name === "TOP") camera.up.set(0, 0, -1);
      else if (name === "BOTTOM") camera.up.set(0, 0, 1);
      else camera.up.set(0, 1, 0);
      camera.lookAt(target);
      controls.update();
      return;
    }

    if (kind === "nudge") {
      _camOffset.copy(camera.position).sub(target);
      _camSpherical.setFromVector3(_camOffset);
      _camSpherical.theta += request.dTheta ?? 0;
      _camSpherical.phi += request.dPhi ?? 0;
      _camSpherical.phi = Math.max(
        0.08,
        Math.min(Math.PI - 0.08, _camSpherical.phi)
      );
      _camOffset.setFromSpherical(_camSpherical);
      camera.position.copy(target).add(_camOffset);
      camera.up.set(0, 1, 0);
      camera.lookAt(target);
      controls.update();
      return;
    }

    if (kind === "dolly") {
      const dir = request.dir > 0 ? 1 : -1;
      if (typeof controls.dollyIn === "function" && typeof controls.dollyOut === "function") {
        if (dir > 0) controls.dollyOut();
        else controls.dollyIn();
      } else {
        _camOffset.copy(camera.position).sub(target);
        const len = _camOffset.length();
        if (len > 1e-6) {
          _camOffset.normalize();
          camera.position.addScaledVector(_camOffset, dir * len * 0.12);
        }
        camera.lookAt(target);
      }
      controls.update();
    }
  }, [request, camera, controls]);

  return null;
}

function forEachMeshMaterial(mesh, fn) {
  const m = mesh.material;
  if (!m) return;
  if (Array.isArray(m)) m.forEach(fn);
  else fn(m);
}

const _scratchViewDir = new THREE.Vector3();
const _scratchExplodeDir = new THREE.Vector3();

/**
 * Projects motion onto the plane facing the camera — reads as sliding on-screen,
 * not true 3D dismantling. Prefer world-space JSON explodeDir (default) for assembly explode.
 */
function screenPlaneExplodeDirection(base, viewDir, out) {
  const along = base.dot(viewDir);
  out.copy(base).addScaledVector(viewDir, -along);
  if (out.lengthSq() < 1e-16) {
    if (Math.abs(viewDir.y) < 0.9) out.set(0, 1, 0).cross(viewDir);
    else out.set(1, 0, 0).cross(viewDir);
  }
  out.normalize();
  if (out.dot(base) < 0) out.negate();
  return out;
}

function normalizeName(s) {
  if (!s) return "";
  return String(s)
    .trim()
    .replace(/\s+/g, "_")
    .toLowerCase();
}

/** Skip JSON rows that are bogus bboxes or datum junk (old exports) */
function isValidPartBbox(p) {
  const b = p?.bbox;
  if (!b) return false;
  const nums = [b.xmin, b.ymin, b.zmin, b.xmax, b.ymax, b.zmax];
  for (const v of nums) {
    if (typeof v !== "number" || !Number.isFinite(v)) return false;
    if (Math.abs(v) > 1e30) return false;
  }
  if (b.xmin > b.xmax || b.ymin > b.ymax || b.zmin > b.zmax) return false;
  return true;
}

function isDatumPartName(name) {
  if (!name) return false;
  const s = String(name).trim().toLowerCase().replace(/\s+/g, "");
  return /^(origin\d*|x-?axis\d*|y-?axis\d*|z-?axis\d*|xy-?plane\d*|xz-?plane\d*|yz-?plane\d*)$/.test(
    s
  );
}

/** Map GLB/OBJ node names -> JSON part (exportName / sourceName / name) */
function buildPartLookup(partsMeta) {
  const byKey = new Map();
  const add = (key, p) => {
    if (key == null || key === "") return;
    const k = String(key);
    if (!byKey.has(k)) byKey.set(k, p);
    const n = normalizeName(k);
    if (n && !byKey.has(n)) byKey.set(n, p);
  };
  for (const p of partsMeta || []) {
    add(p.exportName, p);
    add(p.sourceName, p);
    add(p.name, p);
  }
  return byKey;
}

/** Build lookup: exact name, normalized name, and by id */
function buildExplodeMetaMap(partsMeta) {
  const byExact = new Map();
  const byNorm = new Map();
  if (!partsMeta?.length) return { byExact, byNorm };

  for (const p of partsMeta) {
    const name = p.name;
    if (!name) continue;
    const dirArr = p.explodeDir;
    const dist = p.explodeDistance;
    if (
      !Array.isArray(dirArr) ||
      dirArr.length < 3 ||
      dist == null ||
      Number.isNaN(Number(dist))
    ) {
      continue;
    }
    const dir = new THREE.Vector3(
      Number(dirArr[0]),
      Number(dirArr[1]),
      Number(dirArr[2])
    );
    if (dir.lengthSq() > 0) dir.normalize();
    else dir.set(0, 0, 1);

    const entry = {
      dir,
      distance: Number(dist),
      jsonName: name,
      id: p.id,
    };
    byExact.set(name, entry);
    byNorm.set(normalizeName(name), entry);
  }
  return { byExact, byNorm };
}

function metaToExplode(meta) {
  if (
    !meta ||
    !Array.isArray(meta.explodeDir) ||
    meta.explodeDir.length < 3 ||
    meta.explodeDistance == null
  )
    return null;
  const dir = new THREE.Vector3(
    Number(meta.explodeDir[0]),
    Number(meta.explodeDir[1]),
    Number(meta.explodeDir[2])
  );
  if (dir.lengthSq() > 0) dir.normalize();
  else dir.set(0, 0, 1);
  return {
    dir,
    distance: Number(meta.explodeDistance),
    jsonName: meta.name || meta.exportName,
  };
}

function resolveExplodeMeta(
  partName,
  index,
  byExact,
  byNorm,
  partsMeta,
  partLookup
) {
  const tryPart = (p) => metaToExplode(p);

  if (partName && partLookup?.size) {
    let p = partLookup.get(partName);
    if (!p) p = partLookup.get(normalizeName(partName));
    const m = tryPart(p);
    if (m) return m;
  }

  const usable = (partsMeta || []).filter(
    (p) =>
      isValidPartBbox(p) &&
      !isDatumPartName(p.name) &&
      Array.isArray(p.explodeDir) &&
      p.explodeDistance != null
  );

  if (usable.length && index < usable.length) {
    const m = tryPart(usable[index]);
    if (m) return m;
  }

  if (partsMeta?.length && index < partsMeta.length) {
    const m = tryPart(partsMeta[index]);
    if (m) return m;
  }
  if (partName && byExact.has(partName)) return byExact.get(partName);
  const n = normalizeName(partName);
  if (n && byNorm.has(n)) return byNorm.get(n);
  return null;
}

function ExplodableModel({
  url,
  explode,
  activePartName,
  partsMeta,
  /** Set when meta JSON includes finite `normalizeTargetMaxSpan` > 0 (normalized GLB); otherwise null. */
  normalizeTargetMaxSpan = null,
  /** Map part label (JSON name) → visible; missing keys default to visible. */
  partVisibility = null,
  /** Called when user hovers a part in the 3D view with the pointer. Receives part label or null. */
  onHoverPart = null,
  /** If true, motion is flattened to the camera plane (slide). If false, uses JSON/CAD radial dirs — real dismantle. */
  screenPlaneExplode = false,
  /** Without part metadata there is nothing to align explode to — motion stays off. */
  explodeEnabled = true,
}) {
  const { scene } = useGLTF(url);
  const { camera } = useThree();

  useLayoutEffect(() => {
    return () => {
      try {
        useGLTF.clear(url);
      } catch {
        /* ignore */
      }
    };
  }, [url]);
  const partsRef = useRef([]);
  const partsByNameRef = useRef({});
  const radiusRef = useRef(1);
  const explodeRef = useRef(explode);
  const activePartRef = useRef(activePartName);
  const explodeEnabledRef = useRef(explodeEnabled);
  const normalizeTargetMaxSpanRef = useRef(normalizeTargetMaxSpan);
  const partVisibilityRef = useRef(partVisibility);
  useLayoutEffect(() => {
    explodeRef.current = explode;
    activePartRef.current = activePartName;
    explodeEnabledRef.current = explodeEnabled;
    normalizeTargetMaxSpanRef.current = normalizeTargetMaxSpan;
    partVisibilityRef.current = partVisibility;
  }, [
    explode,
    activePartName,
    explodeEnabled,
    normalizeTargetMaxSpan,
    partVisibility,
  ]);
  const { byExact, byNorm } = useMemo(
    () => buildExplodeMetaMap(partsMeta),
    [partsMeta]
  );

  const partLookup = useMemo(
    () => buildPartLookup(partsMeta),
    [partsMeta]
  );

  const { rootGroup, radius } = useMemo(() => {
    const clone = scene.clone(true);
    clone.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const radius = Math.max(
      box.getSize(new THREE.Vector3()).length() * 0.5,
      1e-6
    );
    radiusRef.current = radius;

    const root = new THREE.Group();
    partsRef.current = [];
    partsByNameRef.current = {};

    const meshNodes = [];
    clone.traverse((node) => {
      if (
        node.geometry &&
        (node.isMesh || node.isSkinnedMesh || node.isInstancedMesh)
      ) {
        meshNodes.push(node);
      }
    });

    meshNodes.forEach((node, index) => {
      // Clone materials per mesh so hover/selection color changes affect only this part.
      if (Array.isArray(node.material)) {
        node.material = node.material.map((m) =>
          m && typeof m.clone === "function" ? m.clone() : m
        );
      } else if (node.material && typeof node.material.clone === "function") {
        node.material = node.material.clone();
      }

      // Enforce CAD base tone for the full design.
      forEachMeshMaterial(node, (mat) => {
        if (!mat || !mat.color) return;
        mat.color.set(CAD_BASE_COLOR);
        // Flatten PBR response so the model does not appear black from angle/light.
        if ("metalness" in mat) mat.metalness = 0.0;
        if ("roughness" in mat) mat.roughness = 1.0;
        if (mat.emissive) mat.emissive.set("#2a2a2a");
        if ("emissiveIntensity" in mat) mat.emissiveIntensity = 0.45;
        // Ignore texture darkening for uniform CAD color.
        if ("map" in mat) mat.map = null;
        if ("aoMap" in mat) mat.aoMap = null;
        if ("lightMap" in mat) mat.lightMap = null;
        mat.needsUpdate = true;
      });

      // Keep CAD-style borders visible for each part.
      if (node.geometry && !node.getObjectByName("__cad_edges__")) {
        const edgeGeo = new THREE.EdgesGeometry(
          node.geometry,
          CAD_EDGE_THRESHOLD_DEG
        );
        const edgeMat = new THREE.LineBasicMaterial({
          color: CAD_EDGE_COLOR,
          transparent: true,
          opacity: 0.95,
          toneMapped: false,
        });
        const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
        edgeLines.name = "__cad_edges__";
        edgeLines.renderOrder = 2;
        // Keep borders visual-only; avoid hover/raycast picking on helper edges.
        edgeLines.raycast = () => null;
        node.add(edgeLines);
      }

      const worldPos = new THREE.Vector3();
      node.getWorldPosition(worldPos);
      const offsetFromCenter = worldPos.clone().sub(center);

      const partName = node.name || `Part_${index}`;
      const jsonMeta = resolveExplodeMeta(
        partName,
        index,
        byExact,
        byNorm,
        partsMeta,
        partLookup
      );
      const fallbackDir = offsetFromCenter.clone();
      if (fallbackDir.lengthSq() < 1e-12) fallbackDir.set(0, 0, 1);
      else fallbackDir.normalize();

      const dir = jsonMeta?.dir
        ? jsonMeta.dir.clone()
        : fallbackDir.clone();
      const rawDist = jsonMeta?.distance;
      const baseDistance =
        rawDist != null &&
        Number.isFinite(Number(rawDist)) &&
        Number(rawDist) > 0
          ? Number(rawDist)
          : null;

      const partGroup = new THREE.Group();
      const jsonPartMeta =
        (partName && partLookup?.get(String(partName))) ||
        (partName && partLookup?.get(normalizeName(String(partName)))) ||
        null;
      // Internal stable ID: GLB node.name === exportName (order in parts[] may differ from traverse).
      const partId =
        jsonPartMeta?.exportName ||
        jsonMeta?.jsonName ||
        partName;

      partGroup.userData = {
        basePos: offsetFromCenter.clone(),
        dir,
        baseDistance,
        // Use technical ID (exportName) here so activePartRef (which stores IDs) matches.
        jsonLabel: partId,
      };

      node.position.set(0, 0, 0);
      if (node.parent) node.parent.remove(node);
      partGroup.add(node);
      // Name the group with the same stable ID used in metadata (exportName).
      partGroup.name = partId;

      root.add(partGroup);
      partsRef.current.push(partGroup);
      partsByNameRef.current[partGroup.name] = partGroup;
    });

    const metaCount = partsMeta?.filter(
      (p) =>
        Array.isArray(p.explodeDir) &&
        p.explodeDir.length >= 3 &&
        p.explodeDistance != null
    ).length;
    if (process.env.NODE_ENV === "development") {
      const meshN = partsRef.current.length;
      console.log(
        "[GlbExplodeViewer] mesh parts:",
        meshN,
        "| JSON explode entries:",
        metaCount
      );
      const jsonParts = partsMeta?.length ?? 0;
      if (jsonParts > 1 && meshN === 1) {
        console.warn(
          "[GlbExplodeViewer] 1 mesh in GLB but JSON lists",
          jsonParts,
          "parts — almost always a stale file (CloudFront/browser) or wrong URL. " +
            "Use the S3 object URL, invalidate CDN, or pass cacheBust on GlbExplodeViewer. " +
            "Loaded:",
          url
        );
      }
    }

    return { rootGroup: root, radius };
  }, [scene, url, partsMeta, byExact, byNorm, partLookup]);

  useFrame(() => {
    const t = explodeEnabledRef.current ? explodeRef.current : 0;
    const R = radiusRef.current;
    const span = normalizeTargetMaxSpanRef.current;
    let distanceScale;
    const hasMetaSpan =
      span != null && span > 0 && Number.isFinite(span);
    const assumeNormalizedNoMeta =
      !hasMetaSpan &&
      R > 0 &&
      R <= ASSUME_NORMALIZED_IF_BOUNDING_RADIUS_LE;
    const effectiveSpan = hasMetaSpan
      ? span
      : assumeNormalizedNoMeta
        ? 1
        : null;

    if (effectiveSpan != null) {
      // Normalized (or small-scene heuristic): amplify JSON distances; R term caps how “flat” huge sliders feel on big assemblies.
      distanceScale = Math.max(
        NORMALIZED_EXPLODE_DISTANCE_SCALE_MIN,
        NORMALIZED_EXPLODE_DISTANCE_SCALE_NUMERATOR / effectiveSpan,
        R * NORMALIZED_EXPLODE_DISTANCE_RADIUS_MULT
      );
    } else {
      // Legacy large CAD units: tie scale to model radius (JSON distances large, e.g. ~10).
      distanceScale = Math.max(1.0, R * LEGACY_EXPLODE_RADIUS_FACTOR);
    }

    if (screenPlaneExplode) {
      camera.getWorldDirection(_scratchViewDir);
    }

    partsRef.current.forEach((g) => {
      const base = g.userData.basePos;
      let dist;

      if (g.userData.baseDistance != null) {
        dist = t * g.userData.baseDistance * distanceScale;
      } else {
        dist = t * MAX_EXPLODE_SCALE * R;
      }

      let dir;
      if (screenPlaneExplode) {
        screenPlaneExplodeDirection(base, _scratchViewDir, _scratchExplodeDir);
        dir = _scratchExplodeDir;
      } else {
        dir = g.userData.dir;
      }

      g.position.copy(base).addScaledVector(dir, dist);

      const ap = activePartRef.current;
      const label = g.userData.jsonLabel || g.name;
      const isActive =
        ap && (ap === label || ap === g.name);
      g.traverse((child) => {
        if (!child.isMesh || !child.material) return;
        forEachMeshMaterial(child, (mat) => {
          if (!mat || !mat.color) return;
          if (!child.userData._origColors) child.userData._origColors = new Map();
          if (!child.userData._origEmissive)
            child.userData._origEmissive = new Map();
          if (!child.userData._origMetalness)
            child.userData._origMetalness = new Map();
          if (!child.userData._origRoughness)
            child.userData._origRoughness = new Map();
          if (!child.userData._origEmissiveIntensity)
            child.userData._origEmissiveIntensity = new Map();

          if (!child.userData._origColors.has(mat.uuid)) {
            child.userData._origColors.set(mat.uuid, mat.color.clone());
          }
          if (mat.emissive && !child.userData._origEmissive.has(mat.uuid)) {
            child.userData._origEmissive.set(mat.uuid, mat.emissive.clone());
          }
          if ("metalness" in mat && !child.userData._origMetalness.has(mat.uuid)) {
            child.userData._origMetalness.set(mat.uuid, mat.metalness);
          }
          if ("roughness" in mat && !child.userData._origRoughness.has(mat.uuid)) {
            child.userData._origRoughness.set(mat.uuid, mat.roughness);
          }
          if (
            "emissiveIntensity" in mat &&
            !child.userData._origEmissiveIntensity.has(mat.uuid)
          ) {
            child.userData._origEmissiveIntensity.set(
              mat.uuid,
              mat.emissiveIntensity
            );
          }

          const origColor = child.userData._origColors.get(mat.uuid);
          const origEmissive = mat.emissive
            ? child.userData._origEmissive.get(mat.uuid)
            : null;
          const origMetalness = child.userData._origMetalness.get(mat.uuid);
          const origRoughness = child.userData._origRoughness.get(mat.uuid);
          const origEmissiveIntensity =
            child.userData._origEmissiveIntensity.get(mat.uuid);

          if (isActive) {
            mat.color.set("#ffd54a");
            if (mat.emissive) {
              mat.emissive.set("#ffd54a");
              if ("emissiveIntensity" in mat) {
                mat.emissiveIntensity = 2.0;
              }
            }
            if ("metalness" in mat) mat.metalness = 0.0;
            if ("roughness" in mat) mat.roughness = 0.1;
          } else {
            if (origColor) mat.color.copy(origColor);
            if (mat.emissive && origEmissive) {
              mat.emissive.copy(origEmissive);
            }
            if ("metalness" in mat && origMetalness != null) {
              mat.metalness = origMetalness;
            }
            if ("roughness" in mat && origRoughness != null) {
              mat.roughness = origRoughness;
            }
            if ("emissiveIntensity" in mat && origEmissiveIntensity != null) {
              mat.emissiveIntensity = origEmissiveIntensity;
            }
          }
          mat.needsUpdate = true;
        });
      });

      const vis = partVisibilityRef.current;
      const vk = g.userData.jsonLabel || g.name;
      g.visible =
        vis == null || Object.keys(vis).length === 0 ? true : vis[vk] !== false;
    });
  });

  const handlePointerOver = useCallback(
    (e) => {
      if (!onHoverPart) return;
      e.stopPropagation();
      let g = e.object;
      // Walk up to the group that represents a logical part.
      while (g && !partsRef.current.includes(g)) {
        g = g.parent;
      }
      if (!g) return;
      const label = g.userData?.jsonLabel || g.name;
      if (label) onHoverPart(label);
    },
    [onHoverPart]
  );

  const handlePointerOut = useCallback(
    (e) => {
      if (!onHoverPart) return;
      e.stopPropagation();
      onHoverPart(null);
    },
    [onHoverPart]
  );

  return (
    <primitive
      object={rootGroup}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  );
}

export function GlbExplodeViewer({
  glbUrl,
  metaUrl,
  /**
   * false (default) = 3D dismantle using metadata explodeDir (radial from assembly center).
   * true = flatten motion to the screen plane (looks like sliding, not true explode).
   */
  screenPlaneExplode = false,
  /**
   * Change after each upload (e.g. timestamp) so CloudFront/browser fetch the new GLB/JSON.
   * Without this, the same path can keep serving an old merged GLB while JSON updates.
   */
  cacheBust,
}) {
  const resolvedGlbUrl = useMemo(
    () => withAssetCacheBust(glbUrl, cacheBust),
    [glbUrl, cacheBust]
  );
  const resolvedMetaUrl = useMemo(
    () => withAssetCacheBust(metaUrl, cacheBust),
    [metaUrl, cacheBust]
  );
  const [explode, setExplode] = useState(0);
  const [partsMeta, setPartsMeta] = useState([]);
  /** From meta JSON `normalizeTargetMaxSpan` when finite and > 0; null otherwise. */
  const [normalizeTargetMaxSpan, setNormalizeTargetMaxSpan] = useState(null);
  const [activePartName, setActivePartName] = useState(null);
  const [metaLoadStatus, setMetaLoadStatus] = useState(() =>
    resolvedMetaUrl ? "loading" : "no_url"
  );

  const [treeOpen, setTreeOpen] = useState(true);
  const [viewsOpen, setViewsOpen] = useState(true);
  const [explodePanelOpen, setExplodePanelOpen] = useState(false);
  const explodePanelRef = useRef(null);
  const [partVisibility, setPartVisibility] = useState({});
  const [camRequest, setCamRequest] = useState(null);
  const camReqIdRef = useRef(0);

  const partsForSidebar = useMemo(
    () =>
      (partsMeta || []).filter((p) => {
        if (!isValidPartBbox(p)) return false;
        // Skip obvious datum artifacts, based on the human name.
        return !isDatumPartName(p.name);
      }),
    [partsMeta]
  );

  const sidebarPartId = (p) =>
    p.exportName || (p.id != null ? String(p.id) : p.name || "");

  const hasPartsMeta = Array.isArray(partsMeta) && partsMeta.length > 0;

  useEffect(() => {
    if (!hasPartsMeta) setExplode(0);
  }, [hasPartsMeta]);

  useEffect(() => {
    if (!hasPartsMeta) setExplodePanelOpen(false);
  }, [hasPartsMeta]);

  useEffect(() => {
    if (!explodePanelOpen) return;
    const onPointerDown = (e) => {
      const t = e.target;
      if (t.closest?.("[data-glb-explode-panel]")) return;
      if (t.closest?.("[data-glb-explode-toggle]")) return;
      setExplodePanelOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [explodePanelOpen]);

  useEffect(() => {
    if (!resolvedMetaUrl) {
      setMetaLoadStatus("no_url");
      setPartsMeta([]);
      setNormalizeTargetMaxSpan(null);
      return;
    }

    setMetaLoadStatus("loading");
    setNormalizeTargetMaxSpan(null);
    let cancelled = false;

    fetch(resolvedMetaUrl, { mode: "cors" })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} for meta JSON`);
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const rawSpan = data?.normalizeTargetMaxSpan;
        const span =
          typeof rawSpan === "number" &&
          Number.isFinite(rawSpan) &&
          rawSpan > 0
            ? rawSpan
            : null;
        const parts = data?.parts;
        if (!Array.isArray(parts)) {
          console.error(
            "[GlbExplodeViewer] meta JSON missing top-level array `parts`",
            data
          );
          setPartsMeta([]);
          setNormalizeTargetMaxSpan(null);
          setMetaLoadStatus("bad_shape");
          return;
        }
        setNormalizeTargetMaxSpan(span);
        setPartsMeta(parts);
        setMetaLoadStatus(parts.length ? "ok" : "empty");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(
          "[GlbExplodeViewer] Failed to load meta JSON (often S3/CloudFront CORS).",
          err
        );
        setPartsMeta([]);
        setNormalizeTargetMaxSpan(null);
        setMetaLoadStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [resolvedMetaUrl]);

  const partsSidebarKey = useMemo(
    () =>
      partsForSidebar
        .map((p) => `${p.id ?? ""}\0${p.exportName ?? ""}\0${p.name ?? ""}`)
        .join("\n"),
    [partsForSidebar]
  );

  useEffect(() => {
    setPartVisibility((prev) => {
      const next = {};
      for (const p of partsForSidebar) {
        const id = sidebarPartId(p);
        next[id] = prev[id] !== undefined ? prev[id] : true;
      }
      return next;
    });
  }, [partsSidebarKey, partsForSidebar]);

  const pushCam = useCallback((partial) => {
    setCamRequest({ id: ++camReqIdRef.current, ...partial });
  }, []);

  // Human label shown in the UI.
  const sidebarPartLabel = (p) => {
    // Prefer the human-friendly CAD name when available.
    const rawName = p.name || "";
    const rawExport = p.exportName || "";

    // If backend hasn't yet separated name/exportName and they are identical,
    // derive something shorter from the exportName (e.g. keep just "(solid 3)").
    if (rawExport && (!rawName || rawName === rawExport)) {
      const solidIdx = rawExport.indexOf("(solid");
      if (solidIdx !== -1) {
        return rawExport.slice(solidIdx).trim();
      }
      // Fallback: strip common upload prefix noise if present.
      const uploadIdx = rawExport.indexOf("_designs_upload_");
      if (uploadIdx > 0) {
        return rawExport.slice(uploadIdx + "_designs_upload_".length);
      }
    }

    if (rawName) return rawName;
    if (rawExport) return rawExport;
    return p.id != null ? `Part ${p.id}` : "";
  };

  const allModelsVisible =
    partsForSidebar.length === 0
      ? true
      : partsForSidebar.every(
          (p) => partVisibility[sidebarPartId(p)] !== false
        );

  const toggleAllModelsVisible = () => {
    const nextVal = !allModelsVisible;
    setPartVisibility((prev) => {
      const o = { ...prev };
      for (const p of partsForSidebar) {
        o[sidebarPartId(p)] = nextVal;
      }
      return o;
    });
  };

  const togglePartVisible = (p) => {
    const k = sidebarPartId(p);
    setPartVisibility((prev) => ({
      ...prev,
      [k]: prev[k] === false ? true : false,
    }));
  };

  const ORBIT_NUDGE = 0.18;

  const chromeBtn = {
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
  };

  const handleHoverPartFromScene = useCallback((labelOrNull) => {
    // labelOrNull is the stable ID (exportName) coming from the GLB node.
    setActivePartName(labelOrNull || null);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: UI_VIEWER_ROOT_HEIGHT,
        minHeight: 320,
        background: UI_VIEWPORT_BG,
        overflow: "hidden",
      }}
    >
      <style>{`
        .glb-ev-range { -webkit-appearance: none; width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; outline: none; }
        .glb-ev-range::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; margin-top: -5px; border-radius: 50%; background: ${UI_ACCENT}; cursor: pointer; border: 2px solid rgba(255,255,255,0.95); box-shadow: 0 1px 3px rgba(0,0,0,0.35); }
        .glb-ev-range::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: ${UI_ACCENT}; cursor: pointer; border: 2px solid rgba(255,255,255,0.95); }
      `}</style>

      {/* Top bar — accent */}
      <header
        style={{
          flexShrink: 0,
          background: UI_ACCENT,
          color: "#ffffff",
          padding: "6px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          boxShadow: "0 1px 8px rgba(0,0,0,0.28)",
          minHeight: 42,
        }}
      >
        <button
          type="button"
          onClick={() => setTreeOpen((o) => !o)}
          style={{
            ...chromeBtn,
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "6px 11px",
            borderRadius: 5,
            background: "rgba(255,255,255,0.18)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <span style={{ fontSize: 15, lineHeight: 1 }}>☰</span>
          Assembly Tree
        </button>
        <button
          type="button"
          data-glb-explode-toggle
          aria-expanded={explodePanelOpen}
          aria-controls="glb-explode-range-panel"
          onClick={() => hasPartsMeta && setExplodePanelOpen((o) => !o)}
          style={{
            ...chromeBtn,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 11px",
            borderRadius: 5,
            background: explodePanelOpen
              ? "rgba(255,255,255,0.28)"
              : "rgba(255,255,255,0.16)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            opacity: hasPartsMeta ? 1 : 0.5,
            border: explodePanelOpen ? "2px solid rgba(255,255,255,0.9)" : "2px solid transparent",
            boxSizing: "border-box",
          }}
        >
          <span style={{ fontSize: 14 }}>▦</span>
          Explode
        </button>
      </header>

      {explodePanelOpen && hasPartsMeta && (
        <div
          ref={explodePanelRef}
          id="glb-explode-range-panel"
          role="dialog"
          aria-label="Explode amount"
          data-glb-explode-panel
          style={{
            position: "absolute",
            top: 48,
            right: 10,
            zIndex: 100,
            width: 216,
            background: UI_PANEL_RGBA,
            padding: "10px 10px 8px",
            borderRadius: 10,
            border: `1px solid rgba(97, 11, 238, 0.35)`,
            boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
              color: "#f4f4f8",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            <span>Explode</span>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setExplodePanelOpen(false)}
              style={{
                ...chromeBtn,
                padding: "0 6px",
                borderRadius: 4,
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: 14,
                lineHeight: 1.2,
              }}
            >
              ×
            </button>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(0,0,0,0.22)",
              padding: "8px 7px",
              borderRadius: 8,
            }}
          >
            <button
              type="button"
              aria-label="Decrease explode"
              onClick={() => setExplode((x) => Math.max(0, x - 0.05))}
              style={{
                ...chromeBtn,
                width: 24,
                height: 24,
                borderRadius: 5,
                background: UI_ACCENT,
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              −
            </button>
            <input
              type="range"
              className="glb-ev-range"
              min={0}
              max={1}
              step={0.01}
              value={explode}
              onChange={(e) => setExplode(Number(e.target.value))}
            />
            <button
              type="button"
              aria-label="Increase explode"
              onClick={() => setExplode((x) => Math.min(1, x + 0.05))}
              style={{
                ...chromeBtn,
                width: 24,
                height: 24,
                borderRadius: 5,
                background: UI_ACCENT,
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              +
            </button>
          </div>
          <div
            style={{
              textAlign: "center",
              color: "#c8c8d4",
              fontSize: 10,
              marginTop: 7,
              fontWeight: 600,
            }}
          >
            {Math.round(explode * 100)}%
          </div>
        </div>
      )}

      <div
        style={{
          flex: 1,
          display: "flex",
          minHeight: 0,
          minWidth: 0,
          position: "relative",
        }}
      >
        {/* Assembly tree drawer */}
        <aside
          style={{
            width: treeOpen ? UI_TREE_WIDTH : 0,
            flexShrink: 0,
            alignSelf: "flex-start",
            height: treeOpen ? UI_ASSEMBLY_PANEL_HEIGHT : 0,
            maxHeight: treeOpen ? UI_ASSEMBLY_PANEL_HEIGHT : 0,
            transition: "width 0.2s ease",
            overflow: "hidden",
            background: UI_PANEL_RGBA,
            borderRight: "1px solid rgba(255,255,255,0.07)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: UI_TREE_WIDTH,
              height: "100%",
              overflowX: "hidden",
              overflowY: "auto",
              padding: "10px 10px",
              color: "#e8e8ed",
              fontSize: 11,
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 12 }}>
              Assembly
            </div>
            {metaLoadStatus === "loading" && (
              <div style={{ color: "#94a3b8", marginBottom: 8 }}>
                Loading metadata…
              </div>
            )}
            {metaLoadStatus === "error" && (
              <div style={{ color: "#f87171", marginBottom: 8, lineHeight: 1.45 }}>
                Could not load JSON. Check Network / CORS or proxy the JSON URL.
              </div>
            )}
            {metaLoadStatus === "bad_shape" && (
              <div style={{ color: "#f87171", marginBottom: 8 }}>
                JSON must include a <code style={{ color: "#e2e8f0" }}>parts</code>{" "}
                array.
              </div>
            )}
            {metaLoadStatus === "ok" && partsForSidebar.length === 0 && (
              <div style={{ color: "#fbbf24", marginBottom: 8, lineHeight: 1.45 }}>
                No parts with valid <code style={{ color: "#e2e8f0" }}>bbox</code>.
              </div>
            )}
            {metaLoadStatus === "empty" && (
              <div style={{ color: "#fbbf24", marginBottom: 8 }}>
                Metadata loaded but <code style={{ color: "#e2e8f0" }}>parts</code>{" "}
                is empty.
              </div>
            )}

            {partsForSidebar.length > 0 && (
              <>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    marginBottom: 8,
                    fontWeight: 600,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={allModelsVisible}
                    onChange={toggleAllModelsVisible}
                    style={{ accentColor: UI_ACCENT, width: 16, height: 16 }}
                  />
                  Models
                </label>
                <div
                  style={{
                    paddingLeft: 10,
                    marginBottom: 8,
                    borderLeft: `2px solid ${UI_ACCENT}`,
                    opacity: 0.95,
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>
                    Components
                  </div>
                  {partsForSidebar.map((p, idx) => {
                    const partId = sidebarPartId(p);
                    const label = sidebarPartLabel(p);
                    const isActive = activePartName === partId;
                    return (
                      <label
                        key={p.id != null ? String(p.id) : `${name}-${idx}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          cursor: "pointer",
                          padding: "4px 2px",
                          borderRadius: 4,
                          background: isActive
                            ? "rgba(97, 11, 238, 0.35)"
                            : "transparent",
                        }}
                        onMouseEnter={() => setActivePartName(partId)}
                      >
                        <input
                          type="checkbox"
                          checked={partVisibility[partId] !== false}
                          onChange={() => togglePartVisible(p)}
                          onClick={(e) => e.stopPropagation()}
                          style={{ accentColor: UI_ACCENT, width: 15, height: 15 }}
                        />
                        <span style={{ flex: 1, lineHeight: 1.35 }}>{label}</span>
                      </label>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </aside>

        {/* Viewport + floating controls */}
        <div
          style={{ flex: 1, position: "relative", minWidth: 0 }}
          onMouseLeave={() => setActivePartName(null)}
        >
          <Canvas
            camera={{
              position: [0, 0, INITIAL_ORBIT_CAMERA_DISTANCE],
              fov: 45,
            }}
            dpr={[1, 2]}
            gl={{ antialias: true, powerPreference: "high-performance" }}
          >
            <color attach="background" args={[UI_VIEWPORT_BG]} />
            <ambientLight intensity={1.0} />
            <OrbitControls enableDamping makeDefault />
            <CameraViewControls request={camRequest} />

            <Suspense fallback={null}>
              <ExplodableModel
                key={resolvedGlbUrl}
                url={resolvedGlbUrl}
                explode={explode}
                activePartName={activePartName}
                partsMeta={partsMeta}
                normalizeTargetMaxSpan={normalizeTargetMaxSpan}
                partVisibility={partVisibility}
                onHoverPart={handleHoverPartFromScene}
                screenPlaneExplode={screenPlaneExplode}
                explodeEnabled={hasPartsMeta}
              />
            </Suspense>
          </Canvas>

          {/* Compact camera D-pad + 2-col views (reference proportions). */}
          <div
            style={{
              position: "absolute",
              right: 10,
              top: 10,
              width: UI_CONTROL_COLUMN_W,
              maxWidth: UI_CONTROL_COLUMN_W,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: 6,
              zIndex: 6,
              pointerEvents: "auto",
            }}
          >
            <div
              style={{
                background: UI_ACCENT,
                padding: 5,
                borderRadius: 8,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: "repeat(4, auto)",
                gap: 3,
                justifyItems: "center",
                alignItems: "center",
                boxShadow: "0 3px 10px rgba(0,0,0,0.32)",
              }}
            >
              <span />
              <button
                type="button"
                aria-label="Orbit up"
                onClick={() => pushCam({ kind: "nudge", dPhi: -ORBIT_NUDGE })}
                style={{
                  ...chromeBtn,
                  gridColumn: 2,
                  width: UI_DPAD_BTN,
                  height: UI_DPAD_BTN,
                  borderRadius: 4,
                  background: "rgba(0,0,0,0.18)",
                  color: "rgba(255,255,255,0.95)",
                  fontSize: 11,
                  lineHeight: 1,
                }}
              >
                ↑
              </button>
              <span />
              <button
                type="button"
                aria-label="Orbit left"
                onClick={() => pushCam({ kind: "nudge", dTheta: ORBIT_NUDGE })}
                style={{
                  ...chromeBtn,
                  width: UI_DPAD_BTN,
                  height: UI_DPAD_BTN,
                  borderRadius: 4,
                  background: "rgba(0,0,0,0.18)",
                  color: "rgba(255,255,255,0.95)",
                  fontSize: 11,
                  lineHeight: 1,
                }}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Isometric view"
                onClick={() => pushCam({ kind: "preset", name: "ISOMETRIC" })}
                style={{
                  ...chromeBtn,
                  width: UI_DPAD_BTN,
                  height: UI_DPAD_BTN,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.92)",
                  color: UI_ACCENT,
                  fontSize: 9,
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                ◎
              </button>
              <button
                type="button"
                aria-label="Orbit right"
                onClick={() => pushCam({ kind: "nudge", dTheta: -ORBIT_NUDGE })}
                style={{
                  ...chromeBtn,
                  width: UI_DPAD_BTN,
                  height: UI_DPAD_BTN,
                  borderRadius: 4,
                  background: "rgba(0,0,0,0.18)",
                  color: "rgba(255,255,255,0.95)",
                  fontSize: 11,
                  lineHeight: 1,
                }}
              >
                →
              </button>
              <span />
              <button
                type="button"
                aria-label="Orbit down"
                onClick={() => pushCam({ kind: "nudge", dPhi: ORBIT_NUDGE })}
                style={{
                  ...chromeBtn,
                  gridColumn: 2,
                  width: UI_DPAD_BTN,
                  height: UI_DPAD_BTN,
                  borderRadius: 4,
                  background: "rgba(0,0,0,0.18)",
                  color: "rgba(255,255,255,0.95)",
                  fontSize: 11,
                  lineHeight: 1,
                }}
              >
                ↓
              </button>
              <span />
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() => pushCam({ kind: "dolly", dir: 1 })}
                style={{
                  ...chromeBtn,
                  gridColumn: 1,
                  gridRow: 4,
                  width: 28,
                  height: UI_DPAD_ZOOM_H,
                  borderRadius: 4,
                  background: "rgba(0,0,0,0.18)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12,
                  lineHeight: 1,
                }}
              >
                −
              </button>
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() => pushCam({ kind: "dolly", dir: -1 })}
                style={{
                  ...chromeBtn,
                  gridColumn: 3,
                  gridRow: 4,
                  width: 28,
                  height: UI_DPAD_ZOOM_H,
                  borderRadius: 4,
                  background: "rgba(0,0,0,0.18)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12,
                  lineHeight: 1,
                }}
              >
                +
              </button>
            </div>

            <div
              style={{
                background: UI_PANEL_RGBA,
                borderRadius: 8,
                border: `1px solid rgba(97, 11, 238, 0.4)`,
                overflow: "hidden",
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
              }}
            >
              <button
                type="button"
                onClick={() => setViewsOpen((o) => !o)}
                style={{
                  ...chromeBtn,
                  width: "100%",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  padding: "6px 6px",
                  background: "rgba(245,245,248,0.97)",
                  color: UI_ACCENT,
                  fontWeight: 800,
                  fontSize: 9,
                  letterSpacing: "0.12em",
                }}
              >
                VIEWS
                <span style={{ fontSize: 8, opacity: 0.85, flexShrink: 0 }}>
                  {viewsOpen ? "▾" : "▸"}
                </span>
              </button>
              {viewsOpen && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                    gap: "4px 5px",
                    padding: "6px 5px 7px",
                    maxHeight: 160,
                    overflowX: "hidden",
                    overflowY: "auto",
                    boxSizing: "border-box",
                    width: "100%",
                    minWidth: 0,
                  }}
                >
                  {[
                    ["FRONT", "BACK"],
                    ["LEFT", "RIGHT"],
                    ["TOP", "BOTTOM"],
                  ].flatMap((pair) =>
                    pair.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => pushCam({ kind: "preset", name })}
                        style={{
                          ...chromeBtn,
                          minWidth: 0,
                          maxWidth: "100%",
                          boxSizing: "border-box",
                          textAlign: "center",
                          padding: "5px 2px",
                          borderRadius: 3,
                          background: "rgba(60,60,68,0.95)",
                          color: "#f0f0f5",
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.03em",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {name}
                      </button>
                    ))
                  )}
                  <button
                    type="button"
                    onClick={() => pushCam({ kind: "preset", name: "ISOMETRIC" })}
                    style={{
                      ...chromeBtn,
                      gridColumn: "1 / -1",
                      minWidth: 0,
                      maxWidth: "100%",
                      boxSizing: "border-box",
                      textAlign: "center",
                      padding: "5px 2px",
                      marginTop: 1,
                      borderRadius: 3,
                      background: "rgba(60,60,68,0.95)",
                      color: "#f0f0f5",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.03em",
                    }}
                  >
                    ISOMETRIC
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
