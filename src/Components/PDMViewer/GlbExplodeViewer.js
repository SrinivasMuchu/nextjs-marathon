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
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

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
const CAD_BASE_COLOR = "#9a9a9e";
/** GrabCAD-style satin metal: strong metalness, medium roughness (not chrome). */
const CAD_METALNESS = 0.88;
const CAD_ROUGHNESS = 0.42;
/** Dark CAD outline (GrabCAD-like). */
const CAD_EDGE_COLOR = "#050505";
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
 * Local IBL (no CDN): drei's `Environment preset="…"` fetches .hdr files and fails when DNS/network
 * blocks that host (ERR_NAME_NOT_RESOLVED). RoomEnvironment bakes reflections on the GPU only.
 */
function CadRoomEnvironment() {
  const { gl, scene } = useThree();
  useLayoutEffect(() => {
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

function getSectionGizmoAxisFromObject(obj) {
  let cur = obj;
  while (cur) {
    const ax = cur.userData?.sectionGizmoAxis;
    if (ax === "x" || ax === "y" || ax === "z") return ax;
    cur = cur.parent;
  }
  return null;
}

const _scratchViewDir = new THREE.Vector3();
const _scratchExplodeDir = new THREE.Vector3();
const _scratchPlaneNormal = new THREE.Vector3();
const _scratchPlanePoint = new THREE.Vector3();
const _scratchRay = new THREE.Raycaster();
const _scratchPointerNdc = new THREE.Vector2();
const _scratchIntersect = new THREE.Vector3();
const _scratchHitQ = new THREE.Vector3();
const _scratchAxisDir = new THREE.Vector3();
const _scratchW0 = new THREE.Vector3();
const _sectionPlanePool = [
  new THREE.Plane(),
  new THREE.Plane(),
  new THREE.Plane(),
];
/** When the ray is nearly parallel to the clip plane, intersect this view-facing plane instead (GrabCAD-style stable drag). */
const _dragAssistPlane = new THREE.Plane();
const _scratchCamToTarget = new THREE.Vector3();
/** Slightly larger than visual gizmo so the blue plane is easier to grab. */
const SECTION_GIZMO_HIT_SCALE = 1.14;
/** Invisible drag area, significantly larger than visible blue plane. */
const SECTION_GIZMO_PICK_SCALE = 1.25;
/** Visual size of section plane relative to model span. */
const SECTION_GIZMO_SPAN_MULT = 1.35;

/** X/Y/Z fixed indices for `_sectionPlanePool` (always 0,1,2 — inactive planes are ignored). */
const SECTION_AXIS_INDEX = { x: 0, y: 1, z: 2 };

/** GrabCAD-like section cap fill + gizmo tint */
const SECTION_CAP_COLOR = 0xcc2222;
const SECTION_CAP_OUTLINE = 0x00ff66;
const SECTION_GIZMO_COLOR = 0x4488ff;
/** GrabCAD-like travel: allow section planes beyond bbox half-size. */
const SECTION_OFFSET_MIN = -6.0;
const SECTION_OFFSET_MAX = 6.0;

const RENDER_ORDER_SECTION_STENCIL_BASE = 1;
const RENDER_ORDER_SECTION_CAP = 0.15;
const RENDER_ORDER_SECTION_CAP_OUTLINE = 0.18;
const RENDER_ORDER_CAD_MESH = 20;
const RENDER_ORDER_CAD_EDGES = 21;

/**
 * Plane size by axis using the in-plane bbox dimensions:
 * - X plane spans Y/Z
 * - Y plane spans X/Z
 * - Z plane spans X/Y
 */
function getSectionPlaneSpanByAxis(axis, h) {
  if (!h) return { sx: 1, sy: 1, sMax: 1 };
  const eps = 1e-6;
  const maxHalf = Math.max(h.x, h.y, h.z, eps);
  // Keep planes visible on ultra-thin models (e.g., sheet-like dimensions).
  const minInPlaneHalf = maxHalf * 0.35;
  let a = 1;
  let b = 1;
  if (axis === "x") {
    a = Math.max(h.z, eps);
    b = Math.max(h.y, eps);
  } else if (axis === "y") {
    a = Math.max(h.x, eps);
    b = Math.max(h.z, eps);
  } else {
    a = Math.max(h.x, eps);
    b = Math.max(h.y, eps);
  }
  // `h` is half-size; plane geometry scale expects full side length.
  const sx = Math.max(a, minInPlaneHalf) * 2 * SECTION_GIZMO_SPAN_MULT;
  const sy = Math.max(b, minInPlaneHalf) * 2 * SECTION_GIZMO_SPAN_MULT;
  return { sx, sy, sMax: Math.max(sx, sy, eps) };
}

/**
 * Stencil write pass (three.js `webgl_clipping_stencil`): marks cut region per clipping plane.
 */
function createStencilWriteMaterial(planeRef, backSide) {
  const mat = new THREE.MeshBasicMaterial();
  mat.clipping = true;
  mat.depthWrite = false;
  mat.depthTest = false;
  mat.colorWrite = false;
  mat.stencilWrite = true;
  mat.stencilFunc = THREE.AlwaysStencilFunc;
  mat.clippingPlanes = [planeRef];
  mat.side = backSide ? THREE.BackSide : THREE.FrontSide;
  if (backSide) {
    mat.stencilFail = THREE.IncrementWrapStencilOp;
    mat.stencilZFail = THREE.IncrementWrapStencilOp;
    mat.stencilZPass = THREE.IncrementWrapStencilOp;
  } else {
    mat.stencilFail = THREE.DecrementWrapStencilOp;
    mat.stencilZFail = THREE.DecrementWrapStencilOp;
    mat.stencilZPass = THREE.DecrementWrapStencilOp;
  }
  return mat;
}

function createCapFillMaterial() {
  return new THREE.MeshStandardMaterial({
    clipping: true,
    color: SECTION_CAP_COLOR,
    metalness: 0.05,
    roughness: 0.85,
    emissive: 0x330000,
    emissiveIntensity: 0.75,
    side: THREE.DoubleSide,
    toneMapped: false,
    stencilWrite: true,
    stencilRef: 0,
    stencilFunc: THREE.NotEqualStencilFunc,
    stencilFail: THREE.ReplaceStencilOp,
    stencilZFail: THREE.ReplaceStencilOp,
    stencilZPass: THREE.ReplaceStencilOp,
  });
}

function createCapOutlineMaterial() {
  return new THREE.LineBasicMaterial({
    clipping: true,
    color: SECTION_CAP_OUTLINE,
    linewidth: 1,
    toneMapped: false,
    stencilWrite: true,
    stencilRef: 0,
    stencilFunc: THREE.NotEqualStencilFunc,
    stencilFail: THREE.ReplaceStencilOp,
    stencilZFail: THREE.ReplaceStencilOp,
    stencilZPass: THREE.ReplaceStencilOp,
  });
}

/**
 * GrabCAD-style section: clipping planes + blue gizmo quads + stencil-filled caps (red) and quad outline (green).
 * Updates `root.userData.sectionActiveAxes` (e.g. `['x','z']`) for cap / stencil sync.
 *
 * @param {THREE.WebGLRenderer | null} gl — enables `localClippingEnabled` every apply (R3F sometimes renders before useFrame).
 */
function applySectionClipping(gl, root, section) {
  if (gl && typeof gl.localClippingEnabled === "boolean") {
    gl.localClippingEnabled = true;
  }

  const clearAll = () => {
    if (!root) return;
    if (gl && Array.isArray(gl.clippingPlanes)) {
      gl.clippingPlanes = [];
    }
    root.userData.sectionActiveAxes = [];
    root.traverse((obj) => {
      const applyMat = (mat) => {
        if (!mat) return;
        mat.clippingPlanes = null;
        mat.clipIntersection = false;
        if ("clipping" in mat) mat.clipping = false;
        delete mat.userData.__sectionClipCount;
        mat.needsUpdate = true;
      };
      if (obj.isMesh && obj.material && !obj.userData.skipCadMaterialClip) {
        forEachMeshMaterial(obj, applyMat);
      }
      if (obj.isLineSegments && obj.material) {
        const m = obj.material;
        if (Array.isArray(m)) m.forEach(applyMat);
        else applyMat(m);
      }
    });
    const gg = root.userData?.sectionGizmoGroup;
    if (gg) gg.visible = false;
    const cg = root.userData?.sectionCapGroup;
    if (cg) cg.visible = false;
  };

  if (!root?.userData?.bboxCenter || !section?.enabled) {
    clearAll();
    return;
  }

  const c = root.userData.bboxCenter;
  const h = root.userData.bboxHalfSize;
  const planes = [];
  const activeAxes = [];

  const pushPlane = (axis, on, flip, offsetNorm) => {
    if (!on) return;
    const pi = SECTION_AXIS_INDEX[axis];
    if (pi === undefined) return;
    _scratchPlaneNormal.set(0, 0, 0);
    if (axis === "x") _scratchPlaneNormal.x = flip ? -1 : 1;
    if (axis === "y") _scratchPlaneNormal.y = flip ? -1 : 1;
    if (axis === "z") _scratchPlaneNormal.z = flip ? -1 : 1;
    const ext = axis === "x" ? h.x : axis === "y" ? h.y : h.z;
    const dist = Number(offsetNorm) * ext;
    _scratchPlanePoint.copy(c);
    if (axis === "x") _scratchPlanePoint.x += dist;
    if (axis === "y") _scratchPlanePoint.y += dist;
    if (axis === "z") _scratchPlanePoint.z += dist;
    const pl = _sectionPlanePool[pi];
    pl.setFromNormalAndCoplanarPoint(_scratchPlaneNormal, _scratchPlanePoint);
    planes.push(pl);
    activeAxes.push(axis);
  };

  const on = section.on || {};
  const flip = section.flip || {};
  const off = section.offset || {};
  pushPlane("x", on.x, flip.x, off.x ?? 0);
  pushPlane("y", on.y, flip.y, off.y ?? 0);
  pushPlane("z", on.z, flip.z, off.z ?? 0);

  root.userData.sectionActiveAxes = activeAxes;

  /** `clipAway === false` = full model stays visible; only gizmo planes (overview). `true` = hide material past section planes (GrabCAD cut). */
  const clipAway = section.clipAway !== false;
  const planesForClip =
    planes.length > 0 && clipAway ? planes.map((p) => p.clone()) : null;

  root.traverse((obj) => {
    const applyMat = (mat) => {
      if (!mat) return;
      if (planesForClip?.length) {
        mat.clippingPlanes = planesForClip;
        mat.clipIntersection = false;
        if ("clipping" in mat) mat.clipping = true;
        const n = planesForClip.length;
        if (mat.userData.__sectionClipCount !== n) {
          mat.userData.__sectionClipCount = n;
          mat.needsUpdate = true;
        }
      } else {
        mat.clippingPlanes = null;
        mat.clipIntersection = false;
        if ("clipping" in mat) mat.clipping = false;
        if (mat.userData.__sectionClipCount != null) {
          delete mat.userData.__sectionClipCount;
          mat.needsUpdate = true;
        }
      }
    };
    if (obj.isMesh && obj.material && !obj.userData.skipCadMaterialClip) {
      forEachMeshMaterial(obj, applyMat);
    }
    if (obj.isLineSegments && obj.material) {
      const m = obj.material;
      if (Array.isArray(m)) m.forEach(applyMat);
      else applyMat(m);
    }
  });

  const gg = root.userData.sectionGizmoGroup;
  if (gg) {
    const show = section.showGizmos !== false;
    gg.visible = show && planes.length > 0;
    if (gg.visible) {
      let i = 0;
      const syncGizmo = (axis, on, _flip, offsetNorm) => {
        const wrap = gg.children[i++];
        if (!wrap) return;
        wrap.visible = !!on;
        if (!on) return;
        const ext = axis === "x" ? h.x : axis === "y" ? h.y : h.z;
        const dist = Number(offsetNorm) * ext;
        wrap.position.set(c.x, c.y, c.z);
        if (axis === "x") {
          wrap.position.x += dist;
          wrap.rotation.set(0, Math.PI / 2, 0);
        } else if (axis === "y") {
          wrap.position.y += dist;
          wrap.rotation.set(-Math.PI / 2, 0, 0);
        } else {
          wrap.position.z += dist;
          wrap.rotation.set(0, 0, 0);
        }
        const visual = wrap.children[0];
        const pick = wrap.children[1];
        const span = getSectionPlaneSpanByAxis(axis, h);
        if (visual) {
          visual.scale.set(
            span.sx * SECTION_GIZMO_HIT_SCALE,
            span.sy * SECTION_GIZMO_HIT_SCALE,
            1
          );
        }
        if (pick) {
          pick.scale.set(
            span.sx * SECTION_GIZMO_PICK_SCALE,
            span.sy * SECTION_GIZMO_PICK_SCALE,
            1
          );
        }
        wrap.scale.set(1, 1, 1);
      };
      syncGizmo("x", on.x, flip.x, off.x ?? 0);
      syncGizmo("y", on.y, flip.y, off.y ?? 0);
      syncGizmo("z", on.z, flip.z, off.z ?? 0);
    }
  }

  const cg = root.userData.sectionCapGroup;
  if (cg) {
    cg.visible =
      clipAway &&
      planes.length > 0 &&
      section.showGizmos !== false;
  }

  root.traverse((obj) => {
    const sub = obj.userData?.sectionStencilSubGroup;
    if (sub) {
      sub.visible =
        clipAway &&
        planes.length > 0 &&
        section.showGizmos !== false;
    }
  });
}

/**
 * Cap meshes clip against sibling section planes; stencil materials use pool planes (updated in `applySectionClipping`).
 */
function syncSectionCapsAndStencilMaterials(root, section) {
  if (
    !root?.userData?.bboxCenter ||
    !section?.enabled ||
    !root.userData.sectionActiveAxes?.length
  ) {
    return;
  }

  const on = section.on || {};
  const h = root.userData.bboxHalfSize;
  if (!h) return;

  const planeByAxis = {
    x: on.x ? _sectionPlanePool[0] : null,
    y: on.y ? _sectionPlanePool[1] : null,
    z: on.z ? _sectionPlanePool[2] : null,
  };

  const stencilMatLists = root.userData.sectionStencilWriteMats;
  if (stencilMatLists) {
    ["x", "y", "z"].forEach((ax) => {
      const pair = stencilMatLists[ax];
      if (!pair) return;
      const pl = planeByAxis[ax];
      if (pl && on[ax]) {
        pair[0].clippingPlanes = [pl];
        pair[1].clippingPlanes = [pl];
        pair[0].needsUpdate = true;
        pair[1].needsUpdate = true;
      }
    });
  }

  const capGroup = root.userData.sectionCapGroup;
  if (!capGroup) return;

  capGroup.children.forEach((child) => {
    const axis = child.userData.sectionCapAxis;
    if (!axis) return;
    const pl = planeByAxis[axis];
    if (!pl) {
      child.visible = false;
      return;
    }
    child.visible = true;
    const fill = child.userData.capFillMesh;
    const outline = child.userData.capOutline;

    const clipOthers = [];
    if (axis !== "x" && on.x) clipOthers.push(planeByAxis.x);
    if (axis !== "y" && on.y) clipOthers.push(planeByAxis.y);
    if (axis !== "z" && on.z) clipOthers.push(planeByAxis.z);

    if (fill?.material) {
      fill.material.clippingPlanes = clipOthers;
      fill.material.needsUpdate = true;
    }
    if (outline?.material) {
      outline.material.clippingPlanes = clipOthers;
      outline.material.needsUpdate = true;
    }

    pl.coplanarPoint(_scratchPlanePoint);
    child.position.copy(_scratchPlanePoint);
    child.lookAt(
      _scratchPlanePoint.x - pl.normal.x,
      _scratchPlanePoint.y - pl.normal.y,
      _scratchPlanePoint.z - pl.normal.z
    );
    const span = getSectionPlaneSpanByAxis(axis, h);
    child.scale.set(span.sx, span.sy, 1);
  });
}

function disposeSectionStencilResources(root) {
  if (!root?.userData) return;
  const sm = root.userData.sectionStencilWriteMats;
  if (sm) {
    ["x", "y", "z"].forEach((ax) => {
      sm[ax]?.forEach((m) => m.dispose());
    });
    delete root.userData.sectionStencilWriteMats;
  }
  const cg = root.userData.sectionCapGroup;
  if (cg) {
    while (cg.children.length) {
      const capWrapper = cg.children[0];
      cg.remove(capWrapper);
      capWrapper.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });
    }
  }
  root.traverse((obj) => {
    const sub = obj.userData?.sectionStencilSubGroup;
    if (sub) {
      sub.traverse((o) => {
        if (o.material) o.material.dispose();
      });
      obj.remove(sub);
      delete obj.userData.sectionStencilSubGroup;
    }
  });
}

function buildSectionStencilAndCaps(root, section) {
  disposeSectionStencilResources(root);

  if (!root?.userData?.bboxCenter || !section?.enabled) return;

  const on = section.on || {};
  const activeAxes = ["x", "y", "z"].filter((ax) => on[ax]);
  if (!activeAxes.length) return;

  const stencilMats = {};
  ["x", "y", "z"].forEach((ax) => {
    if (!on[ax]) return;
    const pi = SECTION_AXIS_INDEX[ax];
    stencilMats[ax] = [
      createStencilWriteMaterial(_sectionPlanePool[pi], true),
      createStencilWriteMaterial(_sectionPlanePool[pi], false),
    ];
  });
  root.userData.sectionStencilWriteMats = stencilMats;

  const partGroups = root.userData.explodePartGroups;
  if (Array.isArray(partGroups)) {
    partGroups.forEach((partGroup) => {
      const mesh = partGroup.children.find(
        (ch) =>
          ch.isMesh &&
          ch.geometry &&
          !ch.isSkinnedMesh &&
          !ch.isInstancedMesh
      );
      if (!mesh) return;

      const sub = new THREE.Group();
      sub.name = "__section_stencil_sub__";
      activeAxes.forEach((axis, idx) => {
        const ro = RENDER_ORDER_SECTION_STENCIL_BASE + idx * 2;
        const mats = stencilMats[axis];
        if (!mats) return;
        const mb = new THREE.Mesh(mesh.geometry, mats[0]);
        const mf = new THREE.Mesh(mesh.geometry, mats[1]);
        mb.frustumCulled = false;
        mf.frustumCulled = false;
        mb.renderOrder = ro;
        mf.renderOrder = ro;
        mb.userData.skipCadMaterialClip = true;
        mf.userData.skipCadMaterialClip = true;
        mb.userData.skipSectionHoverStyle = true;
        mf.userData.skipSectionHoverStyle = true;
        mb.raycast = () => {};
        mf.raycast = () => {};
        sub.add(mb, mf);
      });
      mesh.add(sub);
      mesh.userData.sectionStencilSubGroup = sub;
    });
  }

  let capGroup = root.userData.sectionCapGroup;
  if (!capGroup) {
    capGroup = new THREE.Group();
    capGroup.name = "__section_caps__";
    root.add(capGroup);
    root.userData.sectionCapGroup = capGroup;
  }

  const nStencilCaps = activeAxes.length;
  activeAxes.forEach((axis, idx) => {
    const ro = RENDER_ORDER_SECTION_STENCIL_BASE + idx * 2 + RENDER_ORDER_SECTION_CAP;
    const wrapper = new THREE.Group();
    wrapper.userData.sectionCapAxis = axis;

    const capGeo = new THREE.PlaneGeometry(1, 1);
    const edgeGeo = new THREE.EdgesGeometry(capGeo);

    const fillMat = createCapFillMaterial();
    fillMat.polygonOffset = true;
    fillMat.polygonOffsetFactor = -0.5;
    fillMat.polygonOffsetUnits = -0.5;
    const fill = new THREE.Mesh(capGeo, fillMat);
    fill.frustumCulled = false;
    fill.renderOrder = ro;
    /** Clear stencil once after the last cap only — intermediate clears break multi-axis stencil caps. */
    if (idx === nStencilCaps - 1) {
      fill.onAfterRender = (renderer) => {
        renderer.clearStencil();
      };
    }

    const outlineMat = createCapOutlineMaterial();
    const outline = new THREE.LineSegments(edgeGeo, outlineMat);
    outline.frustumCulled = false;
    outline.renderOrder = ro + RENDER_ORDER_SECTION_CAP_OUTLINE - RENDER_ORDER_SECTION_CAP;

    wrapper.add(fill);
    wrapper.add(outline);
    wrapper.userData.capFillMesh = fill;
    wrapper.userData.capOutline = outline;

    capGroup.add(wrapper);
  });
}

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
  /** GrabCAD-style section: `{ enabled, on:{x,y,z}, flip:{x,y,z}, offset:{x,y,z} }` */
  section = null,
  /** While true, dragging section gizmos updates offsets (viewport pointer). */
  sectionInteractionEnabled = false,
  /** `(axis, normalizedOffset)` — axis is `'x'|'y'|'z'`, offset in roughly [-1, 1]. */
  onSectionOffsetChange = null,
  /** Optional: e.g. set which axis the panel slider controls when user grabs a gizmo. */
  onSectionGizmoEngage = null,
}) {
  const { scene } = useGLTF(url);
  const { camera, gl, controls, raycaster } = useThree();
  const orbitControlsRef = useRef(controls ?? null);
  useLayoutEffect(() => {
    orbitControlsRef.current = controls ?? null;
  }, [controls]);

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

  const sectionRef = useRef(section);
  const rootForSectionRef = useRef(null);
  const sectionInteractionEnabledRef = useRef(sectionInteractionEnabled);
  const onSectionOffsetChangeRef = useRef(onSectionOffsetChange);
  const onSectionGizmoEngageRef = useRef(onSectionGizmoEngage);
  const sectionDragRef = useRef({ active: false, axis: null, pointerId: null });
  const applySectionDragClientRef = useRef(() => false);

  useLayoutEffect(() => {
    sectionRef.current = section;
  }, [section]);
  useLayoutEffect(() => {
    sectionInteractionEnabledRef.current = sectionInteractionEnabled;
  }, [sectionInteractionEnabled]);
  useLayoutEffect(() => {
    onSectionOffsetChangeRef.current = onSectionOffsetChange;
  }, [onSectionOffsetChange]);
  useLayoutEffect(() => {
    onSectionGizmoEngageRef.current = onSectionGizmoEngage;
  }, [onSectionGizmoEngage]);

  const sectionRebuildKey = useMemo(
    () =>
      `${section?.enabled ? 1 : 0}-${section?.on?.x ? 1 : 0}-${section?.on?.y ? 1 : 0}-${section?.on?.z ? 1 : 0}`,
    [section?.enabled, section?.on?.x, section?.on?.y, section?.on?.z]
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

      // GrabCAD-style: uniform gray satin metal + IBL/directional in the Canvas.
      forEachMeshMaterial(node, (mat) => {
        if (!mat || !mat.color) return;
        mat.color.set(CAD_BASE_COLOR);
        if ("metalness" in mat) mat.metalness = CAD_METALNESS;
        if ("roughness" in mat) mat.roughness = CAD_ROUGHNESS;
        if (mat.emissive) mat.emissive.set("#000000");
        if ("emissiveIntensity" in mat) mat.emissiveIntensity = 0;
        if ("envMapIntensity" in mat) mat.envMapIntensity = 1.0;
        // Uniform finish; env map supplies reflections.
        if ("map" in mat) mat.map = null;
        if ("aoMap" in mat) mat.aoMap = null;
        if ("lightMap" in mat) mat.lightMap = null;
        if ("clipping" in mat) mat.clipping = true;
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
          clipping: true,
        });
        const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
        edgeLines.name = "__cad_edges__";
        edgeLines.renderOrder = RENDER_ORDER_CAD_EDGES;
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

      node.renderOrder = RENDER_ORDER_CAD_MESH;
      node.userData.skipSectionHoverStyle = false;

      root.add(partGroup);
      partsRef.current.push(partGroup);
      partsByNameRef.current[partGroup.name] = partGroup;
    });

    const halfSize = box.getSize(new THREE.Vector3()).multiplyScalar(0.5);
    root.userData.bboxCenter = center.clone();
    root.userData.bboxHalfSize = halfSize.clone();
    root.userData.explodePartGroups = partsRef.current.slice();

    const gizmoGroup = new THREE.Group();
    gizmoGroup.name = "__section_gizmos__";
    gizmoGroup.visible = false;
    const gizmoGeo = new THREE.PlaneGeometry(1, 1);
    const mkGizmoMat = () =>
      new THREE.MeshBasicMaterial({
        color: SECTION_GIZMO_COLOR,
        transparent: true,
        opacity: 0.2,
        // Must be draggable from both camera sides like GrabCAD.
        side: THREE.DoubleSide,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
        dithering: false,
        alphaToCoverage: false,
        toneMapped: false,
      });
    const mkGizmoPickMat = () =>
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthTest: true,
        depthWrite: false,
        toneMapped: false,
      });
    const axesOrder = ["x", "y", "z"];
    axesOrder.forEach((ax) => {
      const wrap = new THREE.Group();
      wrap.userData.sectionGizmoAxis = ax;
      wrap.frustumCulled = false;

      const gm = new THREE.Mesh(gizmoGeo, mkGizmoMat());
      gm.userData.sectionGizmoAxis = ax;
      gm.renderOrder = 30;
      gm.frustumCulled = false;

      const pick = new THREE.Mesh(gizmoGeo, mkGizmoPickMat());
      pick.userData.sectionGizmoAxis = ax;
      pick.renderOrder = 31;
      pick.frustumCulled = false;

      wrap.add(gm, pick);
      gizmoGroup.add(wrap);
    });
    root.add(gizmoGroup);
    root.userData.sectionGizmoGroup = gizmoGroup;

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

  useLayoutEffect(() => {
    const root = rootGroup;
    rootForSectionRef.current = root;
    const s = sectionRef.current;
    buildSectionStencilAndCaps(root, s);
    applySectionClipping(gl, root, s);
    return () => {
      disposeSectionStencilResources(root);
      if (gl && Array.isArray(gl.clippingPlanes)) gl.clippingPlanes = [];
    };
  }, [rootGroup, sectionRebuildKey, gl]);

  useEffect(() => {
    const endSectionPlaneDrag = (evPointerId) => {
      const d = sectionDragRef.current;
      if (!d.active) return;
      try {
        const pid = evPointerId ?? d.pointerId;
        if (pid != null) {
          gl.domElement.releasePointerCapture(pid);
        }
      } catch (_) {
        /* ignore */
      }
      const ctl = orbitControlsRef.current;
      if (ctl && "enableRotate" in ctl) {
        ctl.enableRotate =
          typeof d.savedEnableRotate === "boolean"
            ? d.savedEnableRotate
            : true;
      }
      delete d.savedEnableRotate;
      d.active = false;
      d.axis = null;
      d.pointerId = null;
      delete d.lastNorm;
    };

    const applyDragFromClient = (clientX, clientY, axis) => {
      const root = rootForSectionRef.current;
      const fn = onSectionOffsetChangeRef.current;
      const ctl = orbitControlsRef.current;
      if (!root?.userData?.bboxCenter || !fn || !axis) return false;
      const c = root.userData.bboxCenter;
      const h = root.userData.bboxHalfSize;
      const ext = axis === "x" ? h.x : axis === "y" ? h.y : h.z;
      if (!ext || ext < 1e-20) return false;
      const rect = gl.domElement.getBoundingClientRect();
      _scratchPointerNdc.x =
        ((clientX - rect.left) / rect.width) * 2 - 1;
      _scratchPointerNdc.y =
        -((clientY - rect.top) / rect.height) * 2 + 1;
      _scratchRay.setFromCamera(_scratchPointerNdc, camera);
      const ray = _scratchRay.ray;
      // Project pointer ray to closest point on the active axis line (through bbox center).
      // This avoids the "always same value" bug from intersecting the clip plane itself.
      _scratchAxisDir.set(
        axis === "x" ? 1 : 0,
        axis === "y" ? 1 : 0,
        axis === "z" ? 1 : 0
      );
      _scratchW0.copy(ray.origin).sub(c);
      const b = ray.direction.dot(_scratchAxisDir);
      const rayProj = ray.direction.dot(_scratchW0);
      const e = _scratchAxisDir.dot(_scratchW0);
      const denom = 1 - b * b; // both ray.direction and axisDir are unit vectors

      let v = null;
      if (Math.abs(denom) > 1e-6) {
        const s = (e - b * rayProj) / denom; // axis-line parameter in world units
        v = s / ext;
      } else if (ctl?.target) {
        // Fallback when ray ~parallel to axis.
        const pi = SECTION_AXIS_INDEX[axis];
        if (pi !== undefined) {
          const clipPl = _sectionPlanePool[pi];
          clipPl.coplanarPoint(_scratchPlanePoint);
          _scratchCamToTarget
            .copy(camera.position)
            .sub(ctl.target)
            .normalize();
          _dragAssistPlane.setFromNormalAndCoplanarPoint(
            _scratchCamToTarget,
            _scratchPlanePoint
          );
          if (ray.intersectPlane(_dragAssistPlane, _scratchIntersect)) {
            if (axis === "x") v = (_scratchIntersect.x - c.x) / ext;
            else if (axis === "y") v = (_scratchIntersect.y - c.y) / ext;
            else v = (_scratchIntersect.z - c.z) / ext;
          }
        }
      }
      if (v == null || !Number.isFinite(v)) return false;
      const nv = Math.max(SECTION_OFFSET_MIN, Math.min(SECTION_OFFSET_MAX, v));
      sectionDragRef.current.lastNorm = nv;
      fn(axis, nv);
      return true;
    };
    applySectionDragClientRef.current = applyDragFromClient;

    const onMove = (ev) => {
      const d = sectionDragRef.current;
      if (!d.active || !d.axis) return;
      const rayOk = applyDragFromClient(ev.clientX, ev.clientY, d.axis);
      if (
        !rayOk &&
        (ev.movementX !== 0 || ev.movementY !== 0)
      ) {
        const fn = onSectionOffsetChangeRef.current;
        if (!fn) return;
        const rect = gl.domElement.getBoundingClientRect();
        const sens =
          5 /
          Math.max(120, Math.min(rect.width, rect.height));
        const base = Number.isFinite(d.lastNorm) ? d.lastNorm : 0;
        const nv = Math.max(
          SECTION_OFFSET_MIN,
          Math.min(SECTION_OFFSET_MAX, base + ev.movementX * sens)
        );
        d.lastNorm = nv;
        fn(d.axis, nv);
      }
    };

    const onUp = (ev) => {
      const d = sectionDragRef.current;
      if (!d.active) return;
      if (
        d.pointerId != null &&
        ev.pointerId != null &&
        ev.pointerId !== d.pointerId
      ) {
        return;
      }
      endSectionPlaneDrag(ev.pointerId);
    };

    const onWindowMouseUp = () => {
      if (sectionDragRef.current.active) {
        endSectionPlaneDrag(null);
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        endSectionPlaneDrag(null);
      }
    };

    const onLostCapture = () => {
      if (sectionDragRef.current.active) {
        endSectionPlaneDrag(null);
      }
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
    window.addEventListener("mouseup", onWindowMouseUp, true);
    document.addEventListener("visibilitychange", onVisibility);
    gl.domElement.addEventListener("lostpointercapture", onLostCapture);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      window.removeEventListener("mouseup", onWindowMouseUp, true);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.domElement.removeEventListener("lostpointercapture", onLostCapture);
    };
  }, [gl, camera]);

  useFrame(({ gl }) => {
    gl.localClippingEnabled = true;

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
        if (child.userData.skipSectionHoverStyle) return;
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
        });
      });

      const vis = partVisibilityRef.current;
      const vk = g.userData.jsonLabel || g.name;
      g.visible =
        vis == null || Object.keys(vis).length === 0 ? true : vis[vk] !== false;
    });

    const rootSec = rootForSectionRef.current;
    applySectionClipping(gl, rootSec, sectionRef.current);
    syncSectionCapsAndStencilMaterials(rootSec, sectionRef.current);
  });

  /**
   * GrabCAD-style: drag the cutting *plane* (not whichever solid the ray hits first).
   * R3F normally picks the nearest mesh; we take the pointer ray, find active clip planes
   * whose intersection is within tolerance of that first hit, and treat it as plane drag.
   */
  const handleSectionPointerDown = useCallback(
    (e) => {
      if (!onSectionOffsetChangeRef.current) return;

      const root = rootForSectionRef.current;
      const sec = sectionRef.current;
      if (!root?.userData?.bboxHalfSize || !sec?.enabled) return;

      // If pointer directly hits a gizmo visual/pick surface, use it immediately.
      let bestAx = getSectionGizmoAxisFromObject(e.object);

      if (!bestAx) {
        return;
      }

      const ax = bestAx;
      e.stopPropagation();
      onSectionGizmoEngageRef.current?.(ax);
      sectionDragRef.current = {
        active: true,
        axis: ax,
        pointerId: e.pointerId,
      };
      const ctl = orbitControlsRef.current;
      if (ctl && "enableRotate" in ctl) {
        sectionDragRef.current.savedEnableRotate = ctl.enableRotate !== false;
        ctl.enableRotate = false;
      }
      try {
        if (e.pointerId != null) {
          gl.domElement.setPointerCapture(e.pointerId);
        }
      } catch (_) {
        /* ignore */
      }
      applySectionDragClientRef.current(e.clientX, e.clientY, ax);
    },
    [gl]
  );

  const handlePointerOver = useCallback(
    (e) => {
      if (sectionDragRef.current.active) return;
      if (sectionInteractionEnabledRef.current) return;
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
      if (sectionDragRef.current.active) return;
      if (sectionInteractionEnabledRef.current) return;
      if (!onHoverPart) return;
      e.stopPropagation();
      onHoverPart(null);
    },
    [onHoverPart]
  );

  return (
    <primitive
      object={rootGroup}
      onPointerDown={handleSectionPointerDown}
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
  const [sectionPanelOpen, setSectionPanelOpen] = useState(false);
  const sectionPanelRef = useRef(null);
  const [sectionAxisOn, setSectionAxisOn] = useState({
    x: false,
    y: false,
    z: false,
  });
  const [sectionFlip, setSectionFlip] = useState({
    x: false,
    y: false,
    z: false,
  });
  const [sectionOffset, setSectionOffset] = useState({ x: 0, y: 0, z: 0 });
  const [sectionActiveAxis, setSectionActiveAxis] = useState("x");
  const [sectionAxisBtnHover, setSectionAxisBtnHover] = useState(null);
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
      if (t.closest?.("[data-glb-section-panel]")) return;
      if (t.closest?.("[data-glb-section-toggle]")) return;
      setExplodePanelOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [explodePanelOpen]);

  useEffect(() => {
    if (!sectionPanelOpen) return;
    const onPointerDown = (e) => {
      const t = e.target;
      if (t.closest?.("[data-glb-section-panel]")) return;
      if (t.closest?.("[data-glb-section-toggle]")) return;
      if (t.closest?.("[data-glb-explode-panel]")) return;
      if (t.closest?.("[data-glb-explode-toggle]")) return;
      setSectionPanelOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [sectionPanelOpen]);

  const sectionAnyAxisOn =
    sectionAxisOn.x || sectionAxisOn.y || sectionAxisOn.z;

  const sectionConfig = useMemo(() => {
    const anyOn = sectionAxisOn.x || sectionAxisOn.y || sectionAxisOn.z;
    return {
      enabled: anyOn,
      on: { ...sectionAxisOn },
      flip: { ...sectionFlip },
      offset: { ...sectionOffset },
      showGizmos: anyOn,
      clipAway: true,
    };
  }, [sectionAxisOn, sectionFlip, sectionOffset]);

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

  const handleSectionOffsetFromScene = useCallback((axis, v) => {
    setSectionOffset((o) => {
      const prev = o[axis] ?? 0;
      if (Math.abs(prev - v) < 1e-4) return o;
      return { ...o, [axis]: v };
    });
  }, []);

  const handleSectionGizmoEngage = useCallback((axis) => {
    setSectionActiveAxis(axis);
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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          type="button"
          data-glb-section-toggle
          aria-expanded={sectionPanelOpen}
          aria-controls="glb-section-panel"
          onClick={() => {
            setExplodePanelOpen(false);
            setSectionPanelOpen((o) => !o);
          }}
          style={{
            ...chromeBtn,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 11px",
            borderRadius: 5,
            background:
              sectionPanelOpen || sectionAnyAxisOn
                ? "rgba(255,80,80,0.35)"
                : "rgba(255,255,255,0.16)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            border:
              sectionPanelOpen || sectionAnyAxisOn
                ? "2px solid rgba(255,200,200,0.95)"
                : "2px solid transparent",
            boxSizing: "border-box",
          }}
        >
          <span style={{ fontSize: 14 }}>⊞</span>
          Section
        </button>
        <button
          type="button"
          data-glb-explode-toggle
          aria-expanded={explodePanelOpen}
          aria-controls="glb-explode-range-panel"
          onClick={() => {
            setSectionPanelOpen(false);
            hasPartsMeta && setExplodePanelOpen((o) => !o);
          }}
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
        </div>
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

      {sectionPanelOpen && (
        <div
          ref={sectionPanelRef}
          id="glb-section-panel"
          role="dialog"
          aria-label="Section planes"
          data-glb-section-panel
          style={{
            position: "absolute",
            top: 48,
            right: 10,
            zIndex: 100,
            width: 240,
            background: UI_PANEL_RGBA,
            padding: "10px 10px 8px",
            borderRadius: 10,
            border: "1px solid rgba(255,120,120,0.35)",
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
            <span>Section</span>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setSectionPanelOpen(false)}
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
          <div style={{ color: "#c8c8d4", fontSize: 10, marginBottom: 8, lineHeight: 1.35 }}>
            Select plane orientations (X / Y / Z). Each axis starts from center when enabled; drag the plane inward/outward across the design to section anywhere. Enabled axes share the same style; ⇄ flips the cut for the axis you last clicked (see ⇄ tooltip).
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 6,
              marginBottom: 10,
            }}
          >
            {(["x", "y", "z"]).map((ax) => {
              const isOn = sectionAxisOn[ax];
              const isSelectedAxis = sectionActiveAxis === ax;
              /** Every enabled plane uses the same chrome; ⇄ target is `sectionActiveAxis` (see flip button title). */
              const showHoverOnIdle =
                sectionAxisBtnHover === ax && !isOn;
              const looksActive = isOn || showHoverOnIdle;
              return (
              <button
                key={ax}
                type="button"
                aria-pressed={isOn}
                aria-current={isSelectedAxis && isOn ? "true" : undefined}
                title={
                  isOn
                    ? isSelectedAxis
                      ? `${ax.toUpperCase()} plane on (⇄ uses this axis)`
                      : `${ax.toUpperCase()} plane on`
                    : `${ax.toUpperCase()} plane off`
                }
                onMouseEnter={() => setSectionAxisBtnHover(ax)}
                onMouseLeave={() =>
                  setSectionAxisBtnHover((h) => (h === ax ? null : h))
                }
                onClick={() => {
                  setSectionActiveAxis(ax);
                  const turningOn = !sectionAxisOn[ax];
                  setSectionAxisOn((o) => ({ ...o, [ax]: !o[ax] }));
                  if (turningOn) {
                    // GrabCAD-like default: enabling an axis starts from center section.
                    setSectionOffset((o) => ({ ...o, [ax]: 0 }));
                  }
                }}
                style={{
                  ...chromeBtn,
                  padding: "6px 0",
                  borderRadius: 6,
                  fontWeight: 800,
                  fontSize: 12,
                  boxSizing: "border-box",
                  transition:
                    "background 0.12s ease, border-color 0.12s ease, color 0.12s ease",
                  color: looksActive ? "#fff" : "rgba(255,255,255,0.4)",
                  background: looksActive
                    ? "rgba(255,255,255,0.14)"
                    : "rgba(0,0,0,0.25)",
                  border: looksActive
                    ? "1px solid rgba(255,255,255,0.38)"
                    : "2px solid transparent",
                }}
              >
                {ax.toUpperCase()}
              </button>
            );
            })}
            <button
              type="button"
              title={`Flip section direction (${sectionActiveAxis.toUpperCase()} axis)`}
              aria-label={`Flip section direction for ${sectionActiveAxis.toUpperCase()} axis`}
              onClick={() =>
                setSectionFlip((o) => ({
                  ...o,
                  [sectionActiveAxis]: !o[sectionActiveAxis],
                }))
              }
              style={{
                ...chromeBtn,
                padding: "6px 0",
                borderRadius: 6,
                background: "rgba(0,0,0,0.25)",
                color: "#fff",
                fontSize: 14,
              }}
            >
              ⇄
            </button>
          </div>
          <button
            type="button"
            data-glb-section-clear
            aria-label="Remove all section planes"
            disabled={!sectionAnyAxisOn}
            onClick={() => {
              setSectionAxisOn({ x: false, y: false, z: false });
              setSectionOffset({ x: 0, y: 0, z: 0 });
              setSectionFlip({ x: false, y: false, z: false });
            }}
            style={{
              ...chromeBtn,
              width: "100%",
              marginTop: 2,
              padding: "8px 10px",
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 11,
              color: sectionAnyAxisOn ? "#fff" : "rgba(255,255,255,0.35)",
              background: sectionAnyAxisOn
                ? "rgba(180,60,60,0.45)"
                : "rgba(0,0,0,0.2)",
              border: sectionAnyAxisOn
                ? "1px solid rgba(255,160,160,0.5)"
                : "1px solid transparent",
              boxSizing: "border-box",
              cursor: sectionAnyAxisOn ? "pointer" : "default",
            }}
          >
            Remove sections
          </button>
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
            position: "absolute",
            left: 10,
            top: 10,
            zIndex: 7,
            width: UI_TREE_WIDTH,
            height: UI_ASSEMBLY_PANEL_HEIGHT,
            maxHeight: UI_ASSEMBLY_PANEL_HEIGHT,
            transition: "transform 0.2s ease, opacity 0.2s ease",
            transform: treeOpen ? "translateX(0)" : `translateX(-${UI_TREE_WIDTH + 20}px)`,
            opacity: treeOpen ? 1 : 0,
            pointerEvents: treeOpen ? "auto" : "none",
            overflow: "hidden",
            background: UI_PANEL_RGBA,
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 8,
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
            gl={{
              antialias: true,
              stencil: true,
              powerPreference: "high-performance",
              toneMapping: THREE.ACESFilmicToneMapping,
              outputColorSpace: THREE.SRGBColorSpace,
            }}
            onCreated={({ gl }) => {
              gl.localClippingEnabled = true;
            }}
          >
            <color attach="background" args={[UI_VIEWPORT_BG]} />
            <ambientLight intensity={0.32} />
            <directionalLight
              position={[10, 14, 8]}
              intensity={1.15}
            />
            <directionalLight position={[-6, 5, -5]} intensity={0.28} />
            <OrbitControls enableDamping makeDefault />
            <CameraViewControls request={camRequest} />
            <CadRoomEnvironment />

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
                section={sectionConfig}
                sectionInteractionEnabled={sectionAnyAxisOn}
                onSectionOffsetChange={handleSectionOffsetFromScene}
                onSectionGizmoEngage={handleSectionGizmoEngage}
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
