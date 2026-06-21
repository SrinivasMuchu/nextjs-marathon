const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://marathon-os.com";

const PRIVATE_PATHS = [
  "/dashboard/",
  "/account/",
  "/checkout/",
  "/payment/",
  "/admin/",
  "/api/",
  "/creator/",
];

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-User",
  "Google-Extended",
  "Bingbot",
];

/** @returns {import('next').MetadataRoute.Robots} */
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: PRIVATE_PATHS,
      })),
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
