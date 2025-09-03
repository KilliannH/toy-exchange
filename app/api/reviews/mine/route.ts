// app/api/reviews/mine/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      );
    }

    // Récupérer les avis reçus par l'utilisateur connecté
    const reviews = await prisma.review.findMany({
      where: {
        revieweeId: session.user.id // Avis reçus
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20, // Limiter à 20 avis récents
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        // Inclure l'échange associé si nécessaire
        exchange: {
          select: {
            id: true,
            toy: {
              select: {
                title: true,
                id: true
              }
            }
          }
        }
      }
    });

    // Calculer la note moyenne
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    return NextResponse.json({
      reviews,
      stats: {
        totalReviews: reviews.length,
        avgRating: Math.round(avgRating * 10) / 10 // Arrondir à 1 décimale
      }
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des avis:", error);
    
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}