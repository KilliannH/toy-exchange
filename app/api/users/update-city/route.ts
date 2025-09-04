import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { city, lat, lng } = await req.json();

    if (!city || !lat || !lng) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    // Mettre à jour l'utilisateur avec la ville et les coordonnées
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        city,
        lat,
        lng,
      },
      select: {
        id: true,
        name: true,
        email: true,
        city: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.error("Erreur lors de la mise à jour de la ville:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}