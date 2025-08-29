// app/api/exchanges/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const { status } = await request.json();

  if (!["ACCEPTED", "REJECTED", "CANCELLED", "COMPLETED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const exchange = await prisma.exchange.findUnique({
      where: { id },
      include: { toy: true },
    });

    if (!exchange) {
      return NextResponse.json({ error: "Exchange not found" }, { status: 404 });
    }

    if (exchange.toy.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.exchange.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
    });

    // 👉 Cas ACCEPTED : réserver + annuler les autres
    if (status === "ACCEPTED") {
      await prisma.toy.update({
        where: { id: exchange.toyId },
        data: { status: "RESERVED" },
      });

      await prisma.exchange.updateMany({
        where: {
          toyId: exchange.toyId,
          id: { not: id },
          status: "PENDING",
        },
        data: { status: "CANCELLED" },
      });
    }

    // 👉 Cas COMPLETED : marquer toy EXCHANGED + annuler tout le reste
    if (status === "COMPLETED") {
      await prisma.toy.update({
        where: { id: exchange.toyId },
        data: { status: "EXCHANGED" },
      });

      await prisma.exchange.updateMany({
        where: {
          toyId: exchange.toyId,
          id: { not: id },
          status: { in: ["PENDING", "ACCEPTED"] },
        },
        data: { status: "CANCELLED" },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating exchange:", error);
    return NextResponse.json({ error: "Failed to update exchange" }, { status: 500 });
  }
}
