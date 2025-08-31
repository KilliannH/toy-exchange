// app/api/exchanges/[id]/reviews/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const exchangeId = params.id;
  const userId = session.user.id;
  const { rating, comment } = await request.json();

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid rating (1-5 required)" }, { status: 400 });
  }

  try {
    // Vérifie que l'échange existe et que l'user en fait partie
    const exchange = await prisma.exchange.findUnique({
      where: { id: exchangeId },
      include: { requester: true, toy: { include: { user: true } } },
    });

    if (!exchange) {
      return NextResponse.json({ error: "Exchange not found" }, { status: 404 });
    }

    if (exchange.status !== "COMPLETED" && exchange.status !== "CANCELLED") {
      return NextResponse.json({ error: "Exchange not completed" }, { status: 400 });
    }

    const donorId = exchange.toy.userId;
    const receiverId = exchange.requesterId;

    if (![donorId, receiverId].includes(userId)) {
      return NextResponse.json({ error: "Not part of this exchange" }, { status: 403 });
    }

    // Détermine qui est évalué
    const revieweeId = userId === donorId ? receiverId : donorId;

    // Vérifie si une review existe déjà pour cet utilisateur sur cet échange
    const existing = await prisma.review.findFirst({
      where: { exchangeId, reviewerId: userId },
    });

    if (existing) {
      return NextResponse.json({ error: "You already left a review" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        reviewerId: userId,
        revieweeId,
        exchangeId,
        rating,
        comment,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    console.error("Error creating review:", err);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

// Optionnel : GET pour voir les reviews d'un échange
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const paramsId = await params;
  try {
    const reviews = await prisma.review.findMany({
      where: { exchangeId: paramsId.id },
      include: {
        reviewer: { select: { id: true, name: true, email: true } },
        reviewee: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
