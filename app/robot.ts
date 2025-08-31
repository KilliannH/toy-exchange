export default function robots() {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://example.com";
  return {
    rules: [
      { userAgent: "*", allow: ["/"], disallow: ["/dashboard", "/messages", "/api/"] },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}