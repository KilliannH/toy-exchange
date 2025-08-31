import { prisma } from "@/lib/prisma";

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_APP_URL!;
  const toys = await prisma.toy.findMany({
    where: { status: "AVAILABLE" },
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 5000, // limite raisonnable
  });

  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/toys`, lastModified: new Date() },
    ...toys.map(t => ({
      url: `${base}/toys/${t.id}`,
      lastModified: t.updatedAt,
      changeFrequency: "daily",
      priority: 0.8,
    })),
  ];
}