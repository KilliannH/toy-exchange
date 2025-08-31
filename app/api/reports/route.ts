// app/api/reports/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { sendReportEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
        return NextResponse.json(
            { error: "Authentification requise" },
            { status: 401 }
        );
    }

    const { toyId, reason, message, reporterEmail } = await req.json();

    if (!toyId || !reason || !message?.trim()) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Rate limiting - 3 signalements par heure par IP
    const identifier = req.ip || 'anonymous';
    const { success } = await rateLimit({
      identifier: `report:${identifier}`,
      limit: 3,
      duration: 60 * 60 * 1000,
    });

    if (!success) {
      return NextResponse.json(
        { error: "Trop de signalements. Veuillez attendre avant de réessayer." },
        { status: 429 }
      );
    }

    // Vérifier que le jouet existe
    const toy = await prisma.toy.findUnique({
      where: { id: toyId },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    if (!toy) {
      return NextResponse.json(
        { error: "Jouet introuvable" },
        { status: 404 }
      );
    }

    if (session?.user?.id === toy.userId) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas signaler votre propre jouet" },
        { status: 400 }
      );
    }

    // Mapper la raison vers un libellé lisible
    const reasonLabels = {
      'scam': 'Arnaque / Escroquerie',
      'inappropriate': 'Contenu inapproprié', 
      'condition': 'Jouet en mauvais état',
      'fake': 'Fausse annonce',
      'other': 'Autre raison'
    };

    // Enregistrer le signalement
    const report = await prisma.report.create({
      data: {
        toyId,
        reason,
        message: message.trim(),
        reporterId: session?.user?.id || null,
        reporterEmail: reporterEmail || session?.user?.email,
        status: "PENDING"
      }
    });

    // Envoyer l'email avec la structure attendue par votre fonction
    try {
      await sendReportEmail({
        to: 'support@toy-exchange.org',
        toyTitle: toy.title,
        toyId: toy.id,
        ownerName: toy.user.name,
        ownerEmail: toy.user.email,
        reason: reasonLabels[reason] || reason,
        message: message.trim(),
        reporterName: session?.user?.name,
        reporterEmail: reporterEmail || session?.user?.email || 'Anonyme'
      });
    } catch (err) {
      console.error("❌ Erreur lors de l'envoi du mail de report:", err);
    }

    return NextResponse.json(
      { 
        message: "Signalement reçu avec succès. Notre équipe va examiner votre demande.",
        reportId: report.id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors du signalement:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}