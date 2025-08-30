import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      toys: {
        select: { id: true }
      },
      receivedReviews: {
        select: { rating: true }
      }
    }
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  const toysCount = user.toys.length;
  const avgRating = user.receivedReviews.length > 0
    ? user.receivedReviews.reduce((sum, review) => sum + review.rating, 0) / user.receivedReviews.length
    : 0;

  return NextResponse.json({
    ...user,
    stats: {
      toysCount,
      avgRating: Math.round(avgRating * 10) / 10
    }
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: body.name,
      city: body.city,
      lat: body.lat,
      lng: body.lng,
      radiusKm: body.radiusKm,
    },
  });

  return NextResponse.json(updated);
}