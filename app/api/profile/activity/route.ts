// app/api/user/activities/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
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
        toy: { select: { title: true } },
        requester: { select: { name: true } }
      }
    });

    // Messages récents (envoyés ou reçus)
    const recentMessages = await prisma.message.findMany({
      where: { 
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        sender: { select: { name: true } },
        receiver: { select: { name: true } },
        toy: { select: { title: true } },
        proposedToy: { select: { title: true } }
      }
    });

    const activities = [
      ...recentToys.map(toy => ({
        type: 'post' as const,
        action: 'Jouet ajouté',
        toy: toy.title,
        time: toy.createdAt.toISOString()
      })),
      ...recentExchanges.map(exchange => ({
        type: 'exchange' as const,
        action: exchange.requesterId === session.user.id 
          ? 'Échange proposé' 
          : `Échange reçu de ${exchange.requester.name || 'Un utilisateur'}`,
        toy: exchange.toy.title,
        time: exchange.createdAt.toISOString()
      })),
      ...recentMessages.map(message => {
        const isSent = message.senderId === session.user.id;
        const otherUser = isSent ? message.receiver : message.sender;
        
        // Déterminer le contenu à afficher
        let displayContent = '';
        if (message.proposedToy) {
          displayContent = `Proposition d'échange: ${message.proposedToy.title}`;
        } else if (message.toy) {
          displayContent = `À propos de: ${message.toy.title}`;
        } else {
          displayContent = message.content.length > 30 
            ? message.content.substring(0, 30) + '...' 
            : message.content;
        }
        
        return {
          type: 'message' as const,
          action: isSent 
            ? `Message envoyé à ${otherUser.name || 'Un utilisateur'}`
            : `Message reçu de ${otherUser.name || 'Un utilisateur'}`,
          toy: displayContent,
          time: message.createdAt.toISOString()
        };
      })
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
     .slice(0, 5);

    return NextResponse.json(activities);

  } catch (error) {
    console.error("Erreur lors de la récupération des activités:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}