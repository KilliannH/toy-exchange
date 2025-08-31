import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getBucket } from "@/lib/storage";

export async function GET() {
  const bucket = getBucket();
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const toys = await prisma.toy.findMany({
    where: { userId: session.user.id, status: { not: "ARCHIVED" } },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  const toysWithSignedUrls = await Promise.all(
    toys.map(async (toy) => {
      const signedImages = await Promise.all(
        toy.images.map(async (img) => {
          const file = bucket.file(img.url); // `img.url` = fileName en DB
          const [signedUrl] = await file.getSignedUrl({
            version: "v4",
            action: "read",
            expires: Date.now() + 15 * 60 * 1000,
          });
          return { ...img, signedUrl };
        })
      );
      return { ...toy, images: signedImages };
    })
  );

  return NextResponse.json(toysWithSignedUrls);
}
