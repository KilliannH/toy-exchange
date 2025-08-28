import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});
const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const toy = await prisma.toy.findUnique({
    where: { id: params.id },
    include: { images: true },
  });

  if (!toy) {
    return NextResponse.json({ error: "Jouet introuvable" }, { status: 404 });
  }

  if (toy.userId !== session.user.id) {
    return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
  }

  // 🔥 Supprimer les images dans GCS
  for (const img of toy.images) {
    try {
      await bucket.file(img.url).delete(); // ici `url` = fileName
    } catch (err) {
      console.warn(`Erreur suppression image ${img.url}`, err);
    }
  }

  // Supprimer le jouet + ses entrées images en DB
  await prisma.toy.delete({ where: { id: toy.id } });

  return NextResponse.json({ success: true });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();

  const toy = await prisma.toy.findUnique({
    where: { id: params.id },
    include: { images: true },
  });

  const existingCount = await prisma.toyImage.count({
  where: { toyId: toy.id },
});

const spaceLeft = Math.max(0, 5 - existingCount);

if (body.newImages?.length > spaceLeft) {
  return NextResponse.json(
    { error: `Maximum 5 images par jouet (vous avez déjà ${existingCount}).` },
    { status: 400 }
  );
}

  if (!toy) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  if (toy.userId !== session.user.id) {
    return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
  }

  // 🔥 suppression d’images dans GCS
  if (body.removeImages?.length) {
    for (const fileName of body.removeImages) {
      try {
        await bucket.file(fileName).delete();
      } catch (err) {
        console.warn("Erreur suppression image:", fileName, err);
      }
    }
    await prisma.toyImage.deleteMany({
      where: { toyId: toy.id, url: { in: body.removeImages } },
    });
  }

  // 🔥 ajout d’images en DB
  if (body.newImages?.length) {
  await prisma.toyImage.createMany({
    data: body.newImages.slice(0, spaceLeft).map((fileName: string) => ({
      toyId: toy.id,
      url: fileName,
    })),
  });
}

  // 🔄 update infos texte
  const updated = await prisma.toy.update({
    where: { id: toy.id },
    data: {
      title: body.title,
      description: body.description,
      ageMin: body.ageMin,
      ageMax: body.ageMax,
      condition: body.condition,
      category: body.category,
      mode: body.mode,
    },
    include: { images: true },
  });

  return NextResponse.json(updated);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const toy = await prisma.toy.findUnique({
    where: { id: params.id },
    include: { images: true, user: true },
  });

  if (!toy) {
    return NextResponse.json({ error: "Toy not found" }, { status: 404 });
  }

  // Générer des signed URLs pour les images
  const signedImages = await Promise.all(
    toy.images.map(async (img) => {
      const file = bucket.file(img.url); // en DB c’est juste le fileName
      const [signedUrl] = await file.getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 15 * 60 * 1000, // 15 min
      });
      return { ...img, signedUrl };
    })
  );

  return NextResponse.json({ ...toy, images: signedImages });
}
