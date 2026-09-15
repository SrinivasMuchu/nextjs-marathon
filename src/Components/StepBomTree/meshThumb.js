const thumbCache = new Map();

function triangleList(positions, indices) {
  const tris = [];
  if (Array.isArray(indices) && indices.length >= 3) {
    for (let i = 0; i + 2 < indices.length; i += 3) {
      tris.push(indices[i], indices[i + 1], indices[i + 2]);
    }
    return tris;
  }
  const count = Math.floor((positions?.length || 0) / 9) * 3;
  for (let i = 0; i < count; i += 1) tris.push(i);
  return tris;
}

function vertex(positions, index) {
  const o = index * 3;
  return [positions[o] || 0, positions[o + 1] || 0, positions[o + 2] || 0];
}

export function renderMeshThumb(part, size = 96) {
  const positions = part?.positions;
  const key = `${part?.id || "mesh"}:${size}:${positions?.length || 0}:${part?.indices?.length || 0}`;
  if (thumbCache.has(key)) return thumbCache.get(key);
  if (typeof document === "undefined" || !positions || positions.length < 9) {
    thumbCache.set(key, "");
    return "";
  }

  const tris = triangleList(positions, part.indices);
  if (tris.length < 3) {
    thumbCache.set(key, "");
    return "";
  }

  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (z < minZ) minZ = z;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
    if (z > maxZ) maxZ = z;
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const cz = (minZ + maxZ) / 2;

  const fwd = [1, 1, 1.2];
  let fl = Math.hypot(fwd[0], fwd[1], fwd[2]) || 1;
  fwd[0] /= fl;
  fwd[1] /= fl;
  fwd[2] /= fl;
  const right = [-fwd[1], fwd[0], 0];
  let rl = Math.hypot(right[0], right[1], right[2]) || 1;
  right[0] /= rl;
  right[1] /= rl;
  const up = [
    right[1] * fwd[2] - 0 * fwd[1],
    0 * fwd[0] - right[0] * fwd[2],
    right[0] * fwd[1] - right[1] * fwd[0],
  ];
  let ul = Math.hypot(up[0], up[1], up[2]) || 1;
  up[0] /= ul;
  up[1] /= ul;
  up[2] /= ul;

  const light = [0.45, 0.3, 0.84];
  let ll = Math.hypot(light[0], light[1], light[2]) || 1;
  light[0] /= ll;
  light[1] /= ll;
  light[2] /= ll;

  const projected = new Array(positions.length / 3);
  let span = 1;
  for (let i = 0, v = 0; i < positions.length; i += 3, v += 1) {
    const dx = positions[i] - cx;
    const dy = positions[i + 1] - cy;
    const dz = positions[i + 2] - cz;
    const x = dx * right[0] + dy * right[1] + dz * right[2];
    const y = dx * up[0] + dy * up[1] + dz * up[2];
    const z = dx * fwd[0] + dy * fwd[1] + dz * fwd[2];
    projected[v] = [x, y, z];
    span = Math.max(span, Math.abs(x), Math.abs(y));
  }

  const faces = [];
  for (let i = 0; i + 2 < tris.length; i += 3) {
    const a = tris[i];
    const b = tris[i + 1];
    const c = tris[i + 2];
    const pa = projected[a];
    const pb = projected[b];
    const pc = projected[c];
    if (!pa || !pb || !pc) continue;
    const va = vertex(positions, a);
    const vb = vertex(positions, b);
    const vc = vertex(positions, c);
    const e1x = vb[0] - va[0];
    const e1y = vb[1] - va[1];
    const e1z = vb[2] - va[2];
    const e2x = vc[0] - va[0];
    const e2y = vc[1] - va[1];
    const e2z = vc[2] - va[2];
    let nx = e1y * e2z - e1z * e2y;
    let ny = e1z * e2x - e1x * e2z;
    let nz = e1x * e2y - e1y * e2x;
    const nl = Math.hypot(nx, ny, nz);
    if (nl < 1e-12) continue;
    nx /= nl;
    ny /= nl;
    nz /= nl;
    if (nx * fwd[0] + ny * fwd[1] + nz * fwd[2] > 0) {
      nx = -nx;
      ny = -ny;
      nz = -nz;
    }
    const shade = Math.max(0.18, Math.min(1, 0.22 + 0.78 * Math.max(0, nx * light[0] + ny * light[1] + nz * light[2])));
    faces.push({
      depth: (pa[2] + pb[2] + pc[2]) / 3,
      a: pa,
      b: pb,
      c: pc,
      shade,
    });
  }
  faces.sort((left, rightFace) => left.depth - rightFace.depth);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#160c24";
  ctx.fillRect(0, 0, size, size);

  const margin = 0.14;
  const scale = ((1 - margin) * (size / 2)) / span;
  const toX = (x) => size / 2 + x * scale;
  const toY = (y) => size / 2 - y * scale;

  for (const face of faces) {
    const t = face.shade;
    const r = Math.round(48 + (186 - 48) * t);
    const g = Math.round(36 + (168 - 36) * t);
    const b = Math.round(92 + (255 - 92) * t);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.beginPath();
    ctx.moveTo(toX(face.a[0]), toY(face.a[1]));
    ctx.lineTo(toX(face.b[0]), toY(face.b[1]));
    ctx.lineTo(toX(face.c[0]), toY(face.c[1]));
    ctx.closePath();
    ctx.fill();
  }

  const url = canvas.toDataURL("image/png");
  thumbCache.set(key, url);
  return url;
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
