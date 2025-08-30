import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Storage } from "@google-cloud/storage";

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Rayon de la terre en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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
  const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

  const user = await prisma.user.findUnique({where: {id: session.user.id}});
  const lat = user.lat;
  const lng = user.lng;
  const radiusKm = user.radiusKm;

  const toys = await prisma.toy.findMany({
    where: { 
      status: "AVAILABLE",
      lat: { not: null },
      lng: { not: null },
     },
    include: { images: true, user: true },
    orderBy: { createdAt: "desc" },
  });

  const nearbyToys = toys.filter((toy) => {
    if (!toy.lat || !toy.lng) return false;
    const distance = getDistanceFromLatLonInKm(lat, lng, toy.lat, toy.lng);
    return distance <= radiusKm;
  });

  const toysWithSignedUrls = await Promise.all(
    nearbyToys.map(async (toy) => {
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
  const lat = session.user.lat;
  const lng = session.user.lng;

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
      pointsCost: body.pointsCost,
      userId: session.user.id,
      lat: lat,
      lng: lng,
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
