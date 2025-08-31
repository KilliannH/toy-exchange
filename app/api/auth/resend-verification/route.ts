// app/api/auth/resend-verification/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { sendVerifyEmail } from "@/lib/mail";
import { createEmailVerificationToken } from "@/lib/verify";

// Assumant que vous avez ces fonctions quelque part
// import { generateEmailVerificationToken, sendVerificationEmail } from "@/lib/email-verification";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Adresse email requise" },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // Rate limiting - limiter à 3 tentatives par 15 minutes par IP
    const identifier = req.headers.get("x-forwarded-for")?.split(",")[0] || "anonymous";
    const { success, remaining } = await rateLimit({
      identifier: `resend-verification:${identifier}`,
      limit: 3,
      duration: 15 * 60 * 1000, // 15 minutes
    });

    if (!success) {
      return NextResponse.json(
        { 
          error: "Trop de tentatives. Veuillez attendre avant de réessayer.",
          retryAfter: "15 minutes"
        },
        { status: 429 }
      );
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // Ne pas révéler si l'email existe ou non pour la sécurité
      return NextResponse.json(
        { message: "Si cette adresse email est enregistrée, un nouveau lien de vérification a été envoyé." },
        { status: 200 }
      );
    }

    // Vérifier si l'email est déjà vérifié
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Cette adresse email est déjà vérifiée" },
        { status: 400 }
      );
    }

    // Supprimer les anciens tokens de vérification pour cet utilisateur
    await prisma.emailVerificationToken.deleteMany({
      where: { userId: user.id }
    });

    // Générer un nouveau token
    const token = await createEmailVerificationToken(user.id, user.email);
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

    // Envoyer l'email de vérification
    await sendVerifyEmail({
      to: user.email,
      name: user.name,
      verifyUrl,
    });

    return NextResponse.json(
      { message: "Un nouveau lien de vérification a été envoyé à votre adresse email." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors du renvoi de vérification:", error);
    
    return NextResponse.json(
      { error: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}