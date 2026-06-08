/**
 * Thumbnail sprite angles — must match api_server grabcad_scraper/sprite_angles.py
 * Used for design carousel, library hover, and JSON-LD images.
 */
export const DESIGN_SPRITE_ANGLES = [
  { x: 0, y: 0 },
  { x: 0, y: 90 },
  { x: 0, y: 270 },
  { x: 90, y: 0 },
  { x: 270, y: 0 },
  { x: 60, y: 30 },
];

export function designSpriteWebpUrl(baseUrl, x, y) {
  const prefix = (baseUrl || '').replace(/\/?$/, '/');
  return `${prefix}sprite_${x}_${y}.webp`;
}

export function designSpriteSlides(pageTitle = 'design') {
  return DESIGN_SPRITE_ANGLES.map(({ x, y }) => ({
    x,
    y,
    title: `${pageTitle}_${x}_${y}_degree_snapshot`,
  }));
}
