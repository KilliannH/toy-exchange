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
    await tx.user.update({
      where: { id: buyerId },
      data: { points: { decrement: toy.pointsCost } },
    });

    await tx.user.update({
      where: { id: toy.userId },
      data: { points: { increment: toy.pointsCost } }, // si tu veux créditer le donateur
    });

    await tx.toy.update({
      where: { id: toyId },
      data: { status: "EXCHANGED" },
    });

    const exchange = await tx.exchange.create({
      data: {
        toyId: toy.id,
        requesterId: buyerId,
        status: "COMPLETED",
        mode: "POINTS",
      },
    });

    return exchange;
  });

  return NextResponse.json(result);
}
