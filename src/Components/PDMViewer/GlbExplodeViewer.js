"use client";

import React, { useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MAX_EXPLODE_DISTANCE = 2;

function ExplodableModel({ url, explode }) {
  const { scene } = useGLTF(url);
  const partsRef = useRef([]);
  const { camera } = useThree();

  const rootGroup = useMemo(() => {
    const clone = scene.clone(true);
    clone.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const root = new THREE.Group();
    partsRef.current = [];

    clone.traverse((node) => {
      if (!node.isMesh || !node.geometry) return;

      const worldPos = new THREE.Vector3();
      node.getWorldPosition(worldPos);
      const dir = worldPos.clone().sub(center).normalize();

      const partGroup = new THREE.Group();
      partGroup.userData = {
        basePos: worldPos.clone(),
        dir: dir.clone(),
      };

      node.position.set(0, 0, 0);
      if (node.parent) node.parent.remove(node);
      partGroup.add(node);

      root.add(partGroup);
      partsRef.current.push(partGroup);
    });

    console.log("Explode parts count:", partsRef.current.length);

    return root;
  }, [scene, url]);

  useFrame(() => {
    const dist = explode * MAX_EXPLODE_DISTANCE;
    partsRef.current.forEach((g) => {
      const base = g.userData.basePos;
      const dir = g.userData.dir;
      g.position.copy(base).addScaledVector(dir, dist);
    });

    const zoomDistance = camera.position.length();
    console.log("Zoom distance:", zoomDistance);
  });

  return <primitive object={rootGroup} />;
}

export function GlbExplodeViewer({ glbUrl }) {
  const [explode, setExplode] = useState(0);

  return (
    <div style={{ width: "100%", height: "89vh", position: "relative" }}>
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
          <ExplodableModel url={glbUrl} explode={explode} />
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
  );
}

