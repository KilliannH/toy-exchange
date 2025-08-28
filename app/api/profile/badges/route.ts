// app/api/profile/badges/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// Définition des badges disponibles
const AVAILABLE_BADGES = [
  {
    id: "first_exchange",
    name: "Premier échange",
    icon: "🥇",
    description: "Réalisez votre premier échange",
    requirement: (stats: any) => stats.exchangesCount >= 1
  },
  {
    id: "generous",
    name: "Généreux",
    icon: "💝",
    description: "Donnez 3 jouets",
    requirement: (stats: any) => stats.donationsCount >= 3
  },
  {
    id: "ambassador",
    name: "Ambassadeur",
    icon: "🌟",
    description: "Réalisez 20 échanges",
    requirement: (stats: any) => stats.exchangesCount >= 20
  },
  {
    id: "expert",
    name: "Expert",
    icon: "🎯",
    description: "Obtenez une note moyenne de 4.5+",
    requirement: (stats: any) => stats.avgRating >= 4.5
  },
  {
    id: "collector",
    name: "Collectionneur",
    icon: "📚",
    description: "Postez 10 jouets",
    requirement: (stats: any) => stats.toysCount >= 10
  },
  {
    id: "communicator",
    name: "Communicateur",
    icon: "💬",
    description: "Envoyez 50 messages",
    requirement: (stats: any) => stats.messagesCount >= 50
  }
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = session.user.id;

    // Récupérer les statistiques pour calculer les badges
    const toysCount = await prisma.toy.count({
      where: { userId }
    });

    let exchangesCount = 0;
    let avgRating = 0;
    let donationsCount = 0;
    let messagesCount = 0;

    try {
      // Échanges complétés
      exchangesCount = await prisma.exchange.count({
        where: {
          OR: [
            { requesterId: userId },
            { toy: { userId } }
          ],
          status: "COMPLETED"
        }
      });

      // Dons (mode DON)
      donationsCount = await prisma.toy.count({
        where: { 
          userId,
          mode: "DON"
        }
      });

      // Note moyenne
      const result = await prisma.review.aggregate({
        where: { revieweeId: userId },
        _avg: { rating: true }
      });
      avgRating = result._avg.rating || 0;

      // Messages envoyés
      messagesCount = await prisma.message.count({
        where: { senderId: userId }
      });

    } catch (error) {
      // Tables pas encore créées - pas de badges avancés pour l'instant
    }

    const stats = {
      toysCount,
      exchangesCount,
      donationsCount,
      messagesCount,
      avgRating
    };

    // Calculer quels badges sont débloqués
    const badges = AVAILABLE_BADGES.map(badge => ({
      ...badge,
      earned: badge.requirement(stats),
      progress: getProgress(badge.id, stats)
    }));

    return NextResponse.json({ badges, stats });

  } catch (error) {
    console.error("Erreur lors de la récupération des badges:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Fonction pour calculer le progrès vers un badge
function getProgress(badgeId: string, stats: any) {
  switch (badgeId) {
    case "first_exchange":
      return Math.min(stats.exchangesCount, 1);
    case "generous":
      return Math.min(stats.donationsCount / 3, 1);
    case "ambassador":
      return Math.min(stats.exchangesCount / 20, 1);
    case "expert":
      return Math.min(stats.avgRating / 4.5, 1);
    case "collector":
      return Math.min(stats.toysCount / 10, 1);
    case "communicator":
      return Math.min(stats.messagesCount / 50, 1);
    default:
      return 0;
  }
}