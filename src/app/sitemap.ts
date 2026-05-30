import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://buhgalter.tech";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/integrations`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  // Service pages
  const servicePages = [
    "vedenie-buhucheta",
    "nulevaya-otchetnost",
    "registraciya",
    "likvidaciya",
    "raschetny-schet",
    "vosstanovlenie",
    "kadrovyj-uchet",
    "konsultacii",
    "1c",
  ].map((slug) => ({
    url: `${baseUrl}/uslugi/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Blog posts (these would normally be fetched from database)
  const blogPosts = [
    "izmeneniya-nalogovoe-zakonodatelstvo-2026",
    "kak-vybrat-sistemu-nalogooblozheniya-ip",
    "obyazatelnaya-otchetnost-ooo-2026",
    "kak-pravilno-oformit-sotrudnika",
  ].map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...blogPosts];
}
