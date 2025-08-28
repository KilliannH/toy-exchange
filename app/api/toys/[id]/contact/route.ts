// app/api/toys/[id]/contact/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { message } = await request.json();

  const toy = await prisma.toy.findUnique({
    where: { id: params.id },
    select: { userId: true, title: true }
  });

  if (!toy) {
    return NextResponse.json({ error: "Jouet introuvable" }, { status: 404 });
  }

  if (toy.userId === session.user.id) {
    return NextResponse.json({ error: "Vous ne pouvez pas contacter votre propre annonce" }, { status: 400 });
  }

  const newMessage = await prisma.message.create({
    data: {
      senderId: session.user.id,
      receiverId: toy.userId,
      toyId: params.id,
      content: message
    }
  });

  return NextResponse.json({ success: true, messageId: newMessage.id });
}