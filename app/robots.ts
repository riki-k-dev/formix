import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://formix.rikikashyap.dev";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Prevent bots from indexing the private dashboard areas
      disallow: ["/dashboard/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
