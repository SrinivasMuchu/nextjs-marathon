"use client";

import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  Suspense,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/** Bust browser + CDN caches (CloudFront often serves an old GLB after S3 overwrite). */
function withAssetCacheBust(url, cacheBust) {
  if (!url || cacheBust == null || cacheBust === "") return url;
  const join = url.includes("?") ? "&" : "?";
  return `${url}${join}v=${encodeURIComponent(String(cacheBust))}`;
}

/** Fallback when JSON has no per-part explode */
const MAX_EXPLODE_SCALE = 3.0;

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
    jsonName: meta.name,
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
  useLayoutEffect(() => {
    explodeRef.current = explode;
    activePartRef.current = activePartName;
    explodeEnabledRef.current = explodeEnabled;
  }, [explode, activePartName, explodeEnabled]);
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
      partGroup.userData = {
        basePos: offsetFromCenter.clone(),
        dir,
        baseDistance,
        jsonLabel: jsonMeta?.jsonName ?? partsMeta?.[index]?.name ?? partName,
      };

      node.position.set(0, 0, 0);
      if (node.parent) node.parent.remove(node);
      partGroup.add(node);
      partGroup.name = jsonMeta?.jsonName || partName;

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
    /** Stronger scale so dismantling reads clearly vs model size (JSON distance ~10). */
    const distanceScale = Math.max(1.0, R * 0.22);

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
          if (!child.userData._origColors.has(mat.uuid)) {
            child.userData._origColors.set(mat.uuid, mat.color.clone());
          }
          const orig = child.userData._origColors.get(mat.uuid);
          mat.color.copy(
            isActive ? new THREE.Color("#f97316") : orig
          );
        });
      });
    });
  });

  return <primitive object={rootGroup} />;
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
  const [activePartName, setActivePartName] = useState(null);
  const [metaLoadStatus, setMetaLoadStatus] = useState(() =>
    resolvedMetaUrl ? "loading" : "no_url"
  );

  const hasPartsMeta = Array.isArray(partsMeta) && partsMeta.length > 0;

  useEffect(() => {
    if (!hasPartsMeta) setExplode(0);
  }, [hasPartsMeta]);

  const partsForSidebar = useMemo(
    () =>
      (partsMeta || []).filter(
        (p) => isValidPartBbox(p) && !isDatumPartName(p.name)
      ),
    [partsMeta]
  );

  useEffect(() => {
    if (!resolvedMetaUrl) {
      setMetaLoadStatus("no_url");
      setPartsMeta([]);
      return;
    }

    setMetaLoadStatus("loading");
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
        const parts = data?.parts;
        if (!Array.isArray(parts)) {
          console.error(
            "[GlbExplodeViewer] meta JSON missing top-level array `parts`",
            data
          );
          setPartsMeta([]);
          setMetaLoadStatus("bad_shape");
          return;
        }
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
        setMetaLoadStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [resolvedMetaUrl]);

  return (
    <div style={{ display: "flex", width: "100%", height: "89vh" }}>
      {/* Left: simple parts list from JSON */}
      <div
        style={{
          width: 260,
          background: "#020617",
          color: "#e5e7eb",
          padding: "0.75rem",
          overflow: "auto",
          fontSize: 12,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Parts</div>
        {metaLoadStatus === "loading" && (
          <div style={{ color: "#94a3b8", marginBottom: 8 }}>Loading metadata…</div>
        )}
        {metaLoadStatus === "error" && (
          <div style={{ color: "#f87171", marginBottom: 8, lineHeight: 1.45 }}>
            Could not load JSON. Open DevTools → Network: if the request is
            blocked, add CORS on your bucket/CloudFront (GET for the JSON URL) or
            proxy the file through your API.
          </div>
        )}
        {metaLoadStatus === "bad_shape" && (
          <div style={{ color: "#f87171", marginBottom: 8 }}>
            JSON must include a <code style={{ color: "#e2e8f0" }}>parts</code>{" "}
            array (see FreeCAD macro output).
          </div>
        )}
        {metaLoadStatus === "ok" && partsForSidebar.length === 0 && (
          <div style={{ color: "#fbbf24", marginBottom: 8, lineHeight: 1.45 }}>
            No parts with valid <code style={{ color: "#e2e8f0" }}>bbox</code> in
            metadata. Check macro: each entry needs xmin…zmax and explode fields.
          </div>
        )}
        {metaLoadStatus === "empty" && (
          <div style={{ color: "#fbbf24", marginBottom: 8 }}>
            Metadata loaded but <code style={{ color: "#e2e8f0" }}>parts</code>{" "}
            is empty — macro found no meshable solids.
          </div>
        )}
        {partsForSidebar.map((p, idx) => {
          const name = p.name || `Part ${p.id}`;
          const isActive = activePartName === name;
          return (
            <div
              key={p.id != null ? String(p.id) : `${name}-${idx}`}
              onMouseEnter={() => setActivePartName(name)}
              onMouseLeave={() => setActivePartName(null)}
              style={{
                padding: "2px 4px",
                cursor: "pointer",
                background: isActive ? "#1d4ed8" : "transparent",
              }}
            >
              {name}
            </div>
          );
        })}
      </div>

      {/* Right: viewer */}
      <div
        style={{ flex: 1, position: "relative" }}
        onMouseLeave={() => setActivePartName(null)}
      >
        <Canvas
          camera={{ position: [0, 0, 570], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#111827"]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <OrbitControls
            enableDamping
            makeDefault
            minDistance={100}
            maxDistance={817}
          />

          <Suspense fallback={null}>
            <ExplodableModel
              key={resolvedGlbUrl}
              url={resolvedGlbUrl}
              explode={explode}
              activePartName={activePartName}
              partsMeta={partsMeta}
              screenPlaneExplode={screenPlaneExplode}
              explodeEnabled={hasPartsMeta}
            />
          </Suspense>
        </Canvas>

        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "1rem",
            transform: "translateX(-50%)",
            background: "rgba(15,23,42,0.9)",
            padding: "0.5rem 1rem",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#e5e7eb",
          }}
        >
          <span style={{ fontSize: 12 }}>Dismantle</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={explode}
            disabled={!hasPartsMeta}
            onChange={(e) => setExplode(Number(e.target.value))}
          />
          <span style={{ fontSize: 12 }}>{Math.round(explode * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
