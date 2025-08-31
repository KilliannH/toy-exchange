// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { createEmailVerificationToken } from "@/lib/verify";
import { sendVerifyEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  const { name, email, password, city, lat, lng } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email et mot de passe requis" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Email déjà utilisé" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashed, city, lat, lng },
  });

  // 1) Générer un token
  const token = await createEmailVerificationToken(user.id, user.email);
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

  // 2) Envoyer l'email
  try {
    await sendVerifyEmail({
      to: user.email,
      name: user.name,
      verifyUrl,
    });
  } catch (err) {
    console.error("Erreur envoi email:", err);
    // On laisse passer quand même : l’utilisateur est créé mais doit redemander un mail
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    needsVerification: true,
  });
}
