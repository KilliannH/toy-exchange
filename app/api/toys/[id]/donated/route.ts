// app/api/toys/[toyId]/donated/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const paramsId = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const toyId = paramsId.id;
  const { partnerId } = await request.json();

  if (!toyId) {
    return NextResponse.json(
      { error: "Toy ID is missing from the request" },
      { status: 400 }
    );
  }

  try {
    const toy = await prisma.toy.findUnique({
      where: { id: toyId },
      select: { id: true, userId: true, status: true },
    });

    if (!toy) {
      return NextResponse.json({ error: "Toy not found" }, { status: 404 });
    }

    if (toy.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You are not the owner of this toy" },
        { status: 403 }
      );
    }

    if (toy.status === "EXCHANGED") {
      return NextResponse.json(
        { message: "Toy already marked as donated" },
        { status: 200 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Marquer le jouet comme échangé
      const updatedToy = await tx.toy.update({
        where: { id: toyId },
        data: { status: "EXCHANGED" },
      });

      // 2. Créer l'exchange associé
      const exchange = await tx.exchange.create({
        data: {
          requesterId: partnerId,
          toyId: toyId,
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });

      // 3. Annuler tous les autres échanges encore actifs liés à ce jouet
      await tx.exchange.updateMany({
        where: {
          toyId,
          id: { not: exchange.id },
          status: { in: ["PENDING", "ACCEPTED"] },
        },
        data: { status: "CANCELLED" },
      });

      // 4. Augmenter le donnateur de +10 points
      await prisma.user.update({
      where: { id: toy.userId },
      data: { points: { increment: 10 } },
    });

      return { updatedToy, exchange };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error confirming donation:", error);
    return NextResponse.json(
      { error: "Failed to confirm donation" },
      { status: 500 }
    );
  }
}
