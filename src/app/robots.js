/** @returns {import('next').MetadataRoute.Robots} */
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}
