// app/api/toys/[toyId]/donated/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestParams = await params;
  const toyId = requestParams.id;
   const { partnerId } = await request.json();

  if (!toyId) {
    return NextResponse.json(
      { error: "Toy ID is missing from the request" },
      { status: 400 }
    );
  }

  const userId = session.user.id;

  try {
    const toy = await prisma.toy.findUnique({
      where: { id: toyId },
      select: { userId: true, status: true },
    });

    if (!toy) {
      return NextResponse.json({ error: "Toy not found" }, { status: 404 });
    }

    if (toy.userId !== userId) {
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

    const updatedToy = await prisma.toy.update({
      where: { id: toyId },
      data: { status: "EXCHANGED" }, // 👈 mieux d’utiliser ton enum Status plutôt qu’un booléen
    });

    await prisma.exchange.create({
  data: {
    requesterId: partnerId, // celui qui reçoit le jouet
    toyId: toyId,
    status: "COMPLETED", // ou "ACCEPTED" + set completedAt
    completedAt: new Date(),
  }
});

    return NextResponse.json(updatedToy, { status: 200 });
  } catch (error) {
    console.error("Error confirming donation:", error);
    return NextResponse.json(
      { error: "Failed to confirm donation" },
      { status: 500 }
    );
  }
}
