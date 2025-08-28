import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});
const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);

// GET /api/toys : liste avec signed URLs
export async function GET() {
  const toys = await prisma.toy.findMany({
    where: { status: "AVAILABLE" },
    include: { images: true, user: true },
    orderBy: { createdAt: "desc" },
  });

  const toysWithSignedUrls = await Promise.all(
    toys.map(async (toy) => {
      const signedImages = await Promise.all(
        toy.images.map(async (img) => {
          const file = bucket.file(img.url); // ici `img.url` = fileName
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

// POST /api/toys : créer un jouet
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();

  const toy = await prisma.toy.create({
    data: {
      title: body.title,
      description: body.description,
      ageMin: body.ageMin,
      ageMax: body.ageMax,
      condition: body.condition,
      category: body.category,
      mode: body.mode,
      userId: session.user.id,
      images:
        body.images && body.images.length > 0
          ? {
            create: body.images.slice(0, 5).map((img: { fileName: string }) => ({
              url: img.fileName,
            })),
          }
          : undefined,
    },
    include: { images: true },
  });

  return NextResponse.json(toy);
}
