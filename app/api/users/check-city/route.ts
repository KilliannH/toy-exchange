import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Vérifier si l'utilisateur a une ville
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        city: true,
        lat: true,
        lng: true,
      },
    });

    const hasCity = !!(user?.city && user?.lat && user?.lng);

    return NextResponse.json({
      hasCity,
      city: user?.city || null,
    });

  } catch (error) {
    console.error("Erreur lors de la vérification de la ville:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}