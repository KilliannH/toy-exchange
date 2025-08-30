// app/api/profile/stats/route.ts
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

    const userId = session.user.id;

    // Compter les jouets de l'utilisateur
    const toysCount = await prisma.toy.count({
      where: { userId, status: { not: "ARCHIVED"} }
    });

    // Compter les échanges actifs
    let exchangesCount = 0;
    try {
      exchangesCount = await prisma.exchange.count({
        where: {
          OR: [
            { requesterId: userId },
            { toy: { userId } }
          ],
          status: { in: ["PENDING", "ACCEPTED"] }
        }
      });
    } catch (error) {
      exchangesCount = 0;
    }

    // Compter les messages non lus
    let unreadMessages = 0;
    try {
      unreadMessages = await prisma.message.count({
        where: {
          receiverId: userId,
          isRead: false
        }
      });
    } catch (error) {
      unreadMessages = 0;
    }

    // Calculer la note moyenne
    let avgRating = 0;
    try {
      const result = await prisma.review.aggregate({
        where: { revieweeId: userId },
        _avg: { rating: true }
      });
      avgRating = result._avg.rating || 0;
    } catch (error) {
      avgRating = 0;
    }

    // Récupérer l’utilisateur avec createdAt et points
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true, points: true }
    });

    const monthsSinceJoin = user?.createdAt
      ? Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30))
      : 0;

    return NextResponse.json({
      toysCount,
      exchangesCount,
      unreadMessages,
      avgRating: Math.round(avgRating * 10) / 10,
      memberSince: monthsSinceJoin === 0 ? "Nouveau" : `${monthsSinceJoin} mois`,
      points: user?.points || 0
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des stats:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
