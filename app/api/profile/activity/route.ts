import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Récupérer les activités récentes
  const recentToys = await prisma.toy.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      id: true,
      title: true,
      createdAt: true
    }
  });

  const recentExchanges = await prisma.exchange.findMany({
    where: {
      OR: [
        { requesterId: session.user.id },
        { toy: { userId: session.user.id } }
      ]
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: {
      toy: { select: { title: true } }
    }
  });

  const recentMessages = await prisma.message.findMany({
    where: { receiverId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: {
      sender: { select: { name: true } }
    }
  });

  const activities = [
    ...recentToys.map(toy => ({
      type: 'post',
      action: 'Jouet ajouté',
      toy: toy.title,
      time: toy.createdAt
    })),
    ...recentExchanges.map(exchange => ({
      type: 'exchange',
      action: 'Nouvel échange proposé',
      toy: exchange.toy.title,
      time: exchange.createdAt
    })),
    ...recentMessages.map(message => ({
      type: 'message',
      action: 'Message reçu',
      toy: message.content.substring(0, 30) + '...',
      time: message.createdAt
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
   .slice(0, 5);

  return NextResponse.json(activities);
}