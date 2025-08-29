// app/api/exchanges/[id]/confirm/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const exchangeId = params.id;

  const exchange = await prisma.exchange.findUnique({
    where: { id: exchangeId },
    include: { toy: true, proposedToy: true },
  });

  if (!exchange) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let updateData: any = {};
  if (exchange.requesterId === userId) {
    updateData.requesterConfirmed = true;
  } else if (exchange.toy.userId === userId) {
    updateData.ownerConfirmed = true;
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Met à jour la confirmation
  const updated = await prisma.exchange.update({
    where: { id: exchangeId },
    data: updateData,
  });

  // Si les 2 parties ont confirmé
  if (updated.requesterConfirmed && updated.ownerConfirmed && updated.status !== "COMPLETED") {
    await prisma.exchange.update({
      where: { id: exchangeId },
      data: { status: "COMPLETED" },
    });

    // Marquer les deux jouets comme échangés
    await prisma.toy.update({
      where: { id: exchange.toyId },
      data: { status: "EXCHANGED" },
    });
    await prisma.toy.update({
      where: { id: exchange.proposedToyId },
      data: { status: "EXCHANGED" },
    });

    // ❌ Annuler tous les autres échanges liés à ces jouets
    await prisma.exchange.updateMany({
      where: {
        id: { not: exchangeId },
        status: { in: ["PENDING", "ACCEPTED"] },
        OR: [
          { toyId: exchange.toyId },
          { toyId: exchange.proposedToyId },
          { proposedToyId: exchange.toyId },
          { proposedToyId: exchange.proposedToyId },
        ],
      },
      data: { status: "CANCELLED" },
    });
  }

  return NextResponse.json(updated);
}
