import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getBucket } from "@/lib/storage";

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

// GET /api/toys : liste avec signed URLs
export async function GET(req: Request) {
  const bucket = getBucket();
  const { searchParams } = new URL(req.url);
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Params de pagination
  let limit = parseInt(searchParams.get("limit") || "20", 10);
  if (!Number.isFinite(limit) || limit <= 0) limit = 20;
  if (limit > 50) limit = 50;

  let page = parseInt(searchParams.get("page") || "1", 10);
  if (!Number.isFinite(page) || page <= 0) page = 1;

  // Récup user + coords
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { lat: true, lng: true, radiusKm: true },
  });

  const userHasGeo =
    user?.lat != null && user?.lng != null && user?.radiusKm != null;

  // On récupère les jouets triés par fraîcheur (createdAt desc)
  // (on pourrait réduire avec une bounding box si besoin perf, mais on reste simple)
  const toys = await prisma.toy.findMany({
    where: {
      status: "AVAILABLE",
      // si tu veux inclure aussi ceux sans coords quand pas de filtre geo:
      ...(userHasGeo
        ? { lat: { not: null }, lng: { not: null } }
        : {}),
    },
    include: { images: true, user: true },
    orderBy: { createdAt: "desc" },
  });

  // Filtre géo si l'utilisateur a des coords + radius
  let filtered = toys;
  if (userHasGeo) {
    const { lat, lng, radiusKm } = user!;
    filtered = toys.filter((toy) => {
      if (toy.lat == null || toy.lng == null) return false;
      const distance = getDistanceFromLatLonInKm(lat!, lng!, toy.lat, toy.lng);
      return distance <= (radiusKm as number);
    });
  }

  // Pagination en mémoire (simple & efficace pour un volume raisonnable)
  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const slice = filtered.slice(start, end);
  const hasMore = end < total;

  // Génération des signed URLs uniquement pour la page courante
  const items = await Promise.all(
    slice.map(async (toy) => {
      const signedImages = await Promise.all(
        toy.images.map(async (img) => {
          const file = bucket.file(img.url); // img.url = fileName
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

  return NextResponse.json({
    items,
    page,
    limit,
    total,
    hasMore,
  });
}

// POST /api/toys : créer un jouet
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { lat: true, lng: true, radiusKm: true },
  });

  const userHasGeo =
    user?.lat != null && user?.lng != null && user?.radiusKm != null;
  
  const lat = userHasGeo ? user.lat : null;
  const lng = userHasGeo ? user.lng : null;

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
