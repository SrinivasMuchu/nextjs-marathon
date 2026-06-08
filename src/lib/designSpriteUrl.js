import { DESIGN_GLB_PREFIX_URL } from '@/config';

export function getDesignSpriteUrl(designId, x = 0, y = 0, ext = 'webp') {
  const xStr = String(x).padStart(0, '0');
  const yStr = String(y).padStart(0, '0');
  return `${DESIGN_GLB_PREFIX_URL}${designId}/sprite_${xStr}_${yStr}.${ext}`;
}

export function isDxfDesign(fileType) {
  const t = (fileType || '').toLowerCase();
  return t === 'dxf' || t === 'dwg';
}
