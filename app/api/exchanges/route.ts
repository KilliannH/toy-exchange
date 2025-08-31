// app/api/exchanges/route.ts
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { sendNewMessageEmail } from "@/lib/mail"; // 👈 helper SMTP (Mailtrap/Namecheap)

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

    // Jouet ciblé
    const targetToy = await prisma.toy.findUnique({
      where: { id: toyId },
      select: { id: true, userId: true, status: true, mode: true, title: true },
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

    // Jouet proposé (doit appartenir au user connecté)
    const myToy = await prisma.toy.findUnique({
      where: { id: proposedToyId },
      select: { id: true, userId: true, status: true, title: true },
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

    // Créer l'échange
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

    // Créer le premier message dans la conversation (optionnel)
    if (message && message.trim().length > 0) {
      await prisma.message.create({
        data: {
          senderId: session.user.id,
          receiverId: targetToy.userId, // propriétaire du jouet demandé
          toyId: toyId,
          content: message,
          proposedToyId,
        },
      });
    }

    // Notifier par email
    try {
      // Récup destinataire (propriétaire du toy ciblé)
      const owner = await prisma.user.findUnique({
        where: { id: targetToy.userId },
        select: { email: true, name: true, notifyByEmail: true },
      });

      if (owner?.email &&  owner.notifyByEmail) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
        const conversationUrl = `${appUrl}/messages/${toyId}?partnerId=${session.user.id}`;
        const preview = (message && message.trim().length > 0)
          ? message.slice(0, 160)
          : `${session.user.name || "Un membre"} vous propose un échange pour "${targetToy.title}" avec "${myToy?.title ?? "un jouet"}".`;

        await sendNewMessageEmail({
          to: owner.email,
          name: owner.name,
          toyTitle: targetToy.title ?? "Votre jouet",
          preview,
          conversationUrl,
        });
      }
    } catch (e) {
      console.warn("⚠️ Email notification failed for exchange:", e);
      // On n'échoue pas la requête si l'email échoue
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
