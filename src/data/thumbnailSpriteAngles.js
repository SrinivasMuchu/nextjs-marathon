/**
 * Thumbnail sprite (x, y) rotations in degrees.
 * Must match marathon/api_server/server/scripts/grabcad_scraper/sprite_angles.py
 * and IndustryDesignsCarousel slides.
 */
export const THUMBNAIL_SPRITE_ANGLES = [
  { x: 0, y: 0 },
  { x: 0, y: 90 },
  { x: 0, y: 270 },
  { x: 90, y: 0 },
  { x: 270, y: 0 },
  { x: 60, y: 30 },
];

/** @param {string} baseUrl design CDN prefix, e.g. `${DESIGN_GLB_PREFIX_URL}${designId}` */
export function getThumbnailSpriteUrl(baseUrl, index) {
  const angle = THUMBNAIL_SPRITE_ANGLES[index % THUMBNAIL_SPRITE_ANGLES.length];
  return `${baseUrl}/sprite_${angle.x}_${angle.y}.webp`;
}
