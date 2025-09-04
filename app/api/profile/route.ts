import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getBucket } from "@/lib/storage";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { toys: { select: { id: true } }, receivedReviews: { select: { rating: true } } },
  });

  if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  let signedImageUrl: string | null = null;
  if (user.image) {
    // ⚠️ en DB tu dois stocker uniquement le chemin "avatars/xxx.png"
    const objectPath = user.image
      .replace(`https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/`, "")
      .split("?")[0];
      
    const bucket = getBucket();
    const file = bucket.file(objectPath);

    const [url] = await file.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    signedImageUrl = url;
  }

  return NextResponse.json({
    ...user,
    image: signedImageUrl,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  let finalImageUrl = body.image;

  // 👉 Si le client envoie un fichier à uploader
  if (body.fileName && body.fileType) {
    const bucket = getBucket();
    const uniqueFileName = `avatars/${Date.now()}-${body.fileName}`;
    const file = bucket.file(uniqueFileName);

    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 5 * 60 * 1000, // 5 min
      contentType: body.fileType,
    });

    finalImageUrl = `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${uniqueFileName}`;

    // ⚠️ Ici on ne fait pas l’upload du fichier nous-mêmes
    // → le client doit uploader ensuite avec la signedUrl
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: body.name,
      city: body.city,
      lat: body.lat,
      lng: body.lng,
      image: finalImageUrl,
      radiusKm: body.radiusKm,
    },
  });

  return NextResponse.json({ user: updated });
}