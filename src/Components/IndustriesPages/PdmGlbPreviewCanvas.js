"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const CAD_BASE_COLOR = "#9a9a9e";
const CAD_METALNESS = 0.88;
const CAD_ROUGHNESS = 0.42;
const CAD_EDGE_COLOR = "#050505";
const CAD_EDGE_THRESHOLD_DEG = 22;

function CadRoomEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    const roomScene = new RoomEnvironment();
    const renderTarget = pmremGenerator.fromScene(roomScene, 0.04);
    scene.environment = renderTarget.texture;
    return () => {
      scene.environment = null;
      renderTarget.dispose();
      pmremGenerator.dispose();
      roomScene.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Model({ glbUrl, modelRef }) {
  const { scene } = useGLTF(glbUrl);
  const model = useMemo(() => {
    const cloned = scene.clone(true);
    const root = new THREE.Group();
    root.add(cloned);

    root.traverse((node) => {
      if (!node.isMesh || !node.material) return;
      if (Array.isArray(node.material)) {
        node.material = node.material.map((m) => (m?.clone ? m.clone() : m));
      } else if (node.material?.clone) {
        node.material = node.material.clone();
      }

      const materials = Array.isArray(node.material) ? node.material : [node.material];
      materials.forEach((mat) => {
        if (!mat || !mat.color) return;
        mat.color.set(CAD_BASE_COLOR);
        if ("metalness" in mat) mat.metalness = CAD_METALNESS;
        if ("roughness" in mat) mat.roughness = CAD_ROUGHNESS;
        if ("envMapIntensity" in mat) mat.envMapIntensity = 1.0;
        if ("map" in mat) mat.map = null;
        mat.needsUpdate = true;
      });

      if (node.geometry && !node.getObjectByName("__cad_edges__")) {
        const edgeGeo = new THREE.EdgesGeometry(node.geometry, CAD_EDGE_THRESHOLD_DEG);
        const edgeMat = new THREE.LineBasicMaterial({
          color: CAD_EDGE_COLOR,
          transparent: true,
          opacity: 0.95,
          toneMapped: false,
        });
        const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
        edgeLines.name = "__cad_edges__";
        edgeLines.raycast = () => null;
        node.add(edgeLines);
      }
    });

    const box = new THREE.Box3().setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());
    root.position.sub(center);
    return root;
  }, [scene]);

  useEffect(() => {
    modelRef.current = model;
    return () => {
      modelRef.current = null;
    };
  }, [model, modelRef]);

  return <primitive object={model} />;
}

function ViewerController({ interactionMode, action, modelRef }) {
  const { camera, controls } = useThree();
  const initialViewRef = useRef(null);

  useEffect(() => {
    if (!controls || initialViewRef.current) return;
    initialViewRef.current = {
      position: camera.position.clone(),
      target: controls.target.clone(),
    };
  }, [camera, controls]);

  useEffect(() => {
    if (!controls) return;
    const MOUSE = THREE.MOUSE;
    if (interactionMode === "pan") {
      controls.enablePan = true;
      controls.enableZoom = false;
      controls.enableRotate = false;
      controls.mouseButtons = { LEFT: MOUSE.PAN, MIDDLE: null, RIGHT: null };
    } else if (interactionMode === "zoom") {
      controls.enablePan = false;
      controls.enableZoom = true;
      controls.enableRotate = false;
      controls.mouseButtons = { LEFT: MOUSE.DOLLY, MIDDLE: null, RIGHT: null };
    } else {
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.enableRotate = true;
      controls.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: null, RIGHT: null };
    }
    controls.update();
  }, [interactionMode, controls]);

  const fitView = useCallback(() => {
    if (!controls || !modelRef.current) return;
    modelRef.current.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(modelRef.current);
    if (box.isEmpty()) return;
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = THREE.MathUtils.degToRad(camera.fov);
    const distance = maxDim / (2 * Math.tan(fov / 2));
    const fitDistance = distance * 1.3;
    camera.position.set(center.x + fitDistance, center.y + fitDistance * 0.6, center.z + fitDistance);
    controls.target.copy(center);
    camera.near = Math.max(0.01, fitDistance / 100);
    camera.far = fitDistance * 100;
    camera.updateProjectionMatrix();
    controls.update();
  }, [camera, controls, modelRef]);

  useEffect(() => {
    if (!action || !controls) return;
    if (action.type === "fit") {
      fitView();
      return;
    }
    if (action.type === "reset") {
      const initial = initialViewRef.current;
      if (!initial) return;
      camera.position.copy(initial.position);
      controls.target.copy(initial.target);
      camera.updateProjectionMatrix();
      controls.update();
      return;
    }
    if (action.type === "zoomIn") {
      controls.dollyIn?.(1.2);
      controls.update();
      return;
    }
    if (action.type === "zoomOut") {
      controls.dollyOut?.(1.2);
      controls.update();
    }
  }, [action, camera, controls, fitView]);

  return null;
}

export default function PdmGlbPreviewCanvas({ glbUrl, interactionMode = "rotate", action }) {
  const modelRef = useRef(null);
  return (
    <Canvas
      camera={{ position: [1.8, 1.2, 2.6], fov: 40 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
    >
      <color attach="background" args={["#f7f7f8"]} />
      <ambientLight intensity={0.32} />
      <directionalLight position={[10, 14, 8]} intensity={1.15} />
      <directionalLight position={[-6, 5, -5]} intensity={0.28} />
      <CadRoomEnvironment />
      <Suspense fallback={null}>
        <Model glbUrl={glbUrl} modelRef={modelRef} />
      </Suspense>
      <OrbitControls enablePan enableZoom enableRotate makeDefault />
      <ViewerController interactionMode={interactionMode} action={action} modelRef={modelRef} />
    </Canvas>
  );
}
