import { getDesignSpriteUrl, isDxfDesign } from '@/lib/designSpriteUrl';

/** Preload only — no visible UI, so desktop layout stays unchanged. */
export default function DesignViewerLcpImage({ designId, fileType }) {
  if (!designId || isDxfDesign(fileType)) {
    return null;
  }

  const src = getDesignSpriteUrl(designId, 0, 0, 'webp');

  return <link rel="preload" as="image" href={src} fetchPriority="high" />;
}
