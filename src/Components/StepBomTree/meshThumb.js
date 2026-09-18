import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const thumbCache = new Map();

const CAD_BASE_COLOR = "#9a9a9e";
const CAD_METALNESS = 0.88;
const CAD_ROUGHNESS = 0.42;
const CAD_EDGE_COLOR = "#050505";
const CAD_BG = "#1E1E1E";

let shared = null;

function getSharedRenderer(size) {
  if (typeof document === "undefined") return null;
  if (!shared) {
    const canvas = document.createElement("canvas");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true,
      powerPreference: "low-power",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    shared = { canvas, renderer, pmrem, envTex };
  }
  shared.renderer.setPixelRatio(1);
  shared.renderer.setSize(size, size, false);
  shared.renderer.setClearColor(CAD_BG, 1);
  return shared;
}

function buildGeometry(part) {
  const positions = Array.isArray(part?.positions) ? part.positions : [];
  if (positions.length < 9) return null;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  if (Array.isArray(part.indices) && part.indices.length >= 3) {
    geometry.setIndex(part.indices);
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

export function renderMeshThumb(part, size = 96) {
  const positions = part?.positions;
  const renderSize = Math.min(512, Math.max(128, Math.round(size * 2)));
  const key = `${part?.id || "mesh"}:${renderSize}:${positions?.length || 0}:${part?.indices?.length || 0}`;
  if (thumbCache.has(key)) return thumbCache.get(key);
  if (typeof document === "undefined" || !positions || positions.length < 9) {
    thumbCache.set(key, "");
    return "";
  }

  try {
    const ctx = getSharedRenderer(renderSize);
    if (!ctx) {
      thumbCache.set(key, "");
      return "";
    }

    const geometry = buildGeometry(part);
    if (!geometry) {
      thumbCache.set(key, "");
      return "";
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(CAD_BG);
    scene.environment = ctx.envTex;

    const material = new THREE.MeshStandardMaterial({
      color: CAD_BASE_COLOR,
      metalness: CAD_METALNESS,
      roughness: CAD_ROUGHNESS,
      envMapIntensity: 0.85,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry, 22),
      new THREE.LineBasicMaterial({ color: CAD_EDGE_COLOR }),
    );
    scene.add(edges);

    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
    keyLight.position.set(2.4, 3.2, 2.8);
    scene.add(keyLight);
    const fill = new THREE.DirectionalLight(0xc8d0e8, 0.35);
    fill.position.set(-2.2, -0.6, -1.6);
    scene.add(fill);

    if (!geometry.boundingSphere) geometry.computeBoundingSphere();
    const center = geometry.boundingSphere.center.clone();
    const radius = Math.max(geometry.boundingSphere.radius, 1e-3);
    const dist = radius * 2.45;
    const camera = new THREE.PerspectiveCamera(28, 1, Math.max(dist / 200, 0.01), dist * 20);
    camera.position.set(center.x + dist * 0.72, center.y + dist * 0.62, center.z + dist * 0.72);
    camera.lookAt(center);
    camera.updateProjectionMatrix();

    ctx.renderer.render(scene, camera);
    const url = ctx.canvas.toDataURL("image/png");

    geometry.dispose();
    edges.geometry.dispose();
    material.dispose();
    edges.material.dispose();

    thumbCache.set(key, url);
    return url;
  } catch (err) {
    console.warn("BOM thumb render failed", err);
    thumbCache.set(key, "");
    return "";
  }
}

export function mergeMeshes(parts) {
  const positions = [];
  const indices = [];
  for (const part of parts || []) {
    const offset = positions.length / 3;
    if (Array.isArray(part.positions)) positions.push(...part.positions);
    if (Array.isArray(part.indices)) {
      for (const idx of part.indices) indices.push(idx + offset);
    }
  }
  return { id: "merged", positions, indices };
}
