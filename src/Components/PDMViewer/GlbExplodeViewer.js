"use client";

import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  Suspense,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/** Fallback when JSON has no per-part explode */
const MAX_EXPLODE_SCALE = 3.0;

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

function ExplodableModel({ url, explode, activePartName, partsMeta }) {
  const { scene } = useGLTF(url);
  const partsRef = useRef([]);
  const partsByNameRef = useRef({});
  const radiusRef = useRef(1);
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
      if (node.isMesh && node.geometry) meshNodes.push(node);
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
      const baseDistance = jsonMeta?.distance ?? null;

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
    console.log(
      "Explode parts:",
      partsRef.current.length,
      "| JSON explode entries:",
      metaCount
    );

    return { rootGroup: root, radius };
  }, [scene, url, partsMeta, byExact, byNorm, partLookup]);

  useFrame(() => {
    const R = radiusRef.current;
    /** Scale JSON distance (often ~10 in file units) so explosion is visible vs model size */
    const distanceScale = Math.max(0.75, R * 0.12);

    partsRef.current.forEach((g) => {
      const base = g.userData.basePos;
      const dir = g.userData.dir;
      let dist;

      if (g.userData.baseDistance != null) {
        dist = explode * g.userData.baseDistance * distanceScale;
      } else {
        dist = explode * MAX_EXPLODE_SCALE * R;
      }

      g.position.copy(base).addScaledVector(dir, dist);

      const label = g.userData.jsonLabel || g.name;
      const isActive =
        activePartName && (activePartName === label || activePartName === g.name);
      g.traverse((child) => {
        if (child.isMesh && child.material) {
          if (!child.userData._origColor) {
            child.userData._origColor = child.material.color.clone();
          }
          child.material.color.copy(
            isActive ? new THREE.Color("#f97316") : child.userData._origColor
          );
        }
      });
    });
  });

  return <primitive object={rootGroup} />;
}

export function GlbExplodeViewer({ glbUrl, metaUrl }) {
  const [explode, setExplode] = useState(0);
  const [partsMeta, setPartsMeta] = useState([]);
  const [activePartName, setActivePartName] = useState(null);

  const partsForSidebar = useMemo(
    () =>
      (partsMeta || []).filter(
        (p) => isValidPartBbox(p) && !isDatumPartName(p.name)
      ),
    [partsMeta]
  );

  useEffect(() => {
    if (!metaUrl) return;

    fetch(metaUrl)
      .then((res) => res.json())
      .then((data) => {
        setPartsMeta(data?.parts || []);
      })
      .catch((err) => {
        console.error("Failed to load meta JSON", err);
      });
  }, [metaUrl]);

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
        {partsForSidebar.map((p) => {
          const name = p.name || `Part ${p.id}`;
          const isActive = activePartName === name;
          return (
            <div
              key={p.id}
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
      <div style={{ flex: 1, position: "relative" }}>
        <Canvas
          camera={{ position: [0, 0, 570], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onPointerMove={(e) => {
            e.stopPropagation();
            const mesh = e.object;
            if (!mesh) return;

            // walk up to the named group created in ExplodableModel
            let group = mesh;
            while (group.parent && !group.name) {
              group = group.parent;
            }

            if (group && group.name) {
              setActivePartName(group.name);
            }
          }}
          onPointerMissed={() => setActivePartName(null)}
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
              url={glbUrl}
              explode={explode}
              activePartName={activePartName}
              partsMeta={partsMeta}
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
          <span style={{ fontSize: 12 }}>Explode</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={explode}
            onChange={(e) => setExplode(Number(e.target.value))}
          />
          <span style={{ fontSize: 12 }}>{Math.round(explode * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
