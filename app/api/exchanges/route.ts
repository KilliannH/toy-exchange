import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

// app/api/exchanges/route.ts
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { toyId, proposedToyId, message } = await request.json();

    if (!toyId || !proposedToyId) {
      return NextResponse.json(
        { error: "toyId and proposedToyId are required" },
        { status: 400 }
      );
    }

    // Vérifier que le jouet demandé existe
    const targetToy = await prisma.toy.findUnique({
      where: { id: toyId },
      select: { id: true, userId: true, status: true, mode: true },
    });

    if (!targetToy) {
      return NextResponse.json({ error: "Toy not found" }, { status: 404 });
    }

    if (targetToy.status !== "AVAILABLE" || targetToy.mode !== "EXCHANGE") {
      return NextResponse.json(
        { error: "Toy is not available for exchange" },
        { status: 400 }
      );
    }

    // Vérifier que le jouet proposé appartient bien à l'utilisateur connecté
    const myToy = await prisma.toy.findUnique({
      where: { id: proposedToyId },
      select: { id: true, userId: true, status: true },
    });

    if (!myToy || myToy.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only propose one of your own toys" },
        { status: 403 }
      );
    }

    if (myToy.status !== "AVAILABLE") {
      return NextResponse.json(
        { error: "Your toy is not available for exchange" },
        { status: 400 }
      );
    }

    // Créer l'exchange
    const exchange = await prisma.exchange.create({
      data: {
        requesterId: session.user.id,
        toyId,
        proposedToyId,
        message,
        status: "PENDING",
      },
      include: {
        toy: { select: { id: true, title: true, userId: true } },
        proposedToy: { select: { id: true, title: true } },
      },
    });

    // Créer le premier message dans la conversation
    if (message && message.trim().length > 0) {
      await prisma.message.create({
        data: {
          senderId: session.user.id,
          receiverId: targetToy.userId, // le propriétaire du jouet demandé
          toyId: toyId,
          content: message,
          proposedToyId,
        },
      });
    }

    return NextResponse.json(exchange, { status: 201 });
  } catch (error) {
    console.error("Error creating exchange:", error);
    return NextResponse.json(
      { error: "Failed to create exchange" },
      { status: 500 }
    );
  }
}
