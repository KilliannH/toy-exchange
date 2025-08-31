// app/api/auth/verify-email/route.ts
import { consumeEmailVerificationToken } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  if (!token) {
    return NextResponse.redirect(`${appUrl}/verify?verify=missing`);
  }

  try {
    const res = await consumeEmailVerificationToken(token);
    
    switch (res) {
      case "ok":
        return NextResponse.redirect(`${appUrl}/verify?verify=success`);
      case "expired":
        return NextResponse.redirect(`${appUrl}/verify?verify=expired`);
      default:
        return NextResponse.redirect(`${appUrl}/verify?verify=invalid`);
    }
  } catch (error) {
    console.error("Erreur lors de la vérification:", error);
    return NextResponse.redirect(`${appUrl}/verify?verify=invalid`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token manquant" },
        { status: 400 }
      );
    }

    const res = await consumeEmailVerificationToken(token);
    
    switch (res) {
      case "ok":
        return NextResponse.json(
          { message: "Email vérifié avec succès" },
          { status: 200 }
        );
      case "expired":
        return NextResponse.json(
          { error: "Token expired" },
          { status: 400 }
        );
      default:
        return NextResponse.json(
          { error: "Token invalide" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Erreur lors de la vérification:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}