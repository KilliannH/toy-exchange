// app/api/users/[id]/reviews/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reviews = await prisma.review.findMany({
      where: { revieweeId: params.id },
      include: {
        reviewer: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calcul d’une note moyenne en bonus
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : null;

    return NextResponse.json({ reviews, avgRating });
  } catch (err) {
    console.error("Error fetching user reviews:", err);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
