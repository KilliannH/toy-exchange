// app/api/toys/[id]/contact/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { sendNewMessageEmail } from "@/lib/mail";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { message } = await request.json();

  if (!message || !message.trim()) {
    return NextResponse.json({ error: "Message requis" }, { status: 400 });
  }

  const toy = await prisma.toy.findUnique({
    where: { id: params.id },
    select: { id: true, userId: true, title: true }
  });

  if (!toy) {
    return NextResponse.json({ error: "Jouet introuvable" }, { status: 404 });
  }

  if (toy.userId === session.user.id) {
    return NextResponse.json({ error: "Vous ne pouvez pas contacter votre propre annonce" }, { status: 400 });
  }

  // Crée d'abord le message (pour avoir un historique même si l'email échoue)
  const newMessage = await prisma.message.create({
    data: {
      senderId: session.user.id,
      receiverId: toy.userId,
      toyId: toy.id,
      content: message.trim()
    }
  });

  // Notifier par email le propriétaire de l'annonce
  try {
    const owner = await prisma.user.findUnique({
      where: { id: toy.userId },
      select: { email: true, name: true , notifyByEmail: true }
    });
    console.log(owner);

    if (owner?.email && owner.notifyByEmail) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
      const conversationUrl = `${appUrl}/messages/${toy.id}?partnerId=${session.user.id}`;
      const preview = message.trim().slice(0, 160);

      await sendNewMessageEmail({
        to: owner.email,
        name: owner.name,
        toyTitle: toy.title ?? "Votre jouet",
        preview,
        conversationUrl
      });
    }
  } catch (e) {
    // On loggue mais on ne casse pas la requête (MVP)
    console.warn("⚠️ Échec envoi email de notification:", e);
  }

  return NextResponse.json({ success: true, messageId: newMessage.id });
}