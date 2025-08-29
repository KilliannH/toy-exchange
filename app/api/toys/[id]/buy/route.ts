// app/api/toys/[id]/buy/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const toyId = params.id;
  const buyerId = session.user.id;

  const toy = await prisma.toy.findUnique({
    where: { id: toyId },
    include: { user: true },
  });

  if (!toy) return NextResponse.json({ error: "Toy not found" }, { status: 404 });

  if (toy.status !== "AVAILABLE" || toy.mode !== "POINTS") {
    return NextResponse.json({ error: "Toy not available for points" }, { status: 400 });
  }

  const buyer = await prisma.user.findUnique({ where: { id: buyerId } });
  if (!buyer) return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

  if (buyer.points < toy.pointsCost) {
    return NextResponse.json({ error: "Not enough points" }, { status: 400 });
  }

  // Transaction : débiter / créditer / update toy
  const result = await prisma.$transaction(async (tx) => {
    // Débiter l’acheteur
    await tx.user.update({
      where: { id: buyerId },
      data: { points: { decrement: toy.pointsCost } },
    });

    // Créditer le propriétaire
    await tx.user.update({
      where: { id: toy.userId },
      data: { points: { increment: toy.pointsCost } },
    });

    // Marquer le jouet comme échangé
    await tx.toy.update({
      where: { id: toyId },
      data: { status: "EXCHANGED" },
    });

    // Créer l’exchange en mode POINTS
    const exchange = await tx.exchange.create({
      data: {
        toyId: toy.id,
        requesterId: buyerId,
        status: "COMPLETED",
        mode: "POINTS",         // 👈 important
        completedAt: new Date(), // si tu as ce champ
      },
    });

    // Annuler tous les autres échanges actifs liés à ce jouet
    await tx.exchange.updateMany({
      where: {
        toyId,
        id: { not: exchange.id },
        status: { in: ["PENDING", "ACCEPTED"] },
      },
      data: { status: "CANCELLED" },
    });

    return exchange;
  });

  return NextResponse.json(result);
}
