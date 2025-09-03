// app/api/stripe/create-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      );
    }

    const { priceId, points, userId } = await req.json();

    if (!priceId || !points || !userId) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur correspond à la session
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: "Utilisateur non autorisé" },
        { status: 403 }
      );
    }

    // Créer la session de checkout Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/points/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/points?canceled=true`,
      customer_email: session.user.email,
      metadata: {
        userId: userId,
        points: points.toString(),
        type: 'points_purchase'
      },
      // Informations pour la facture
      invoice_creation: {
        enabled: true,
      },
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
    });

  } catch (error: any) {
    console.error("Erreur Stripe:", error);
    
    return NextResponse.json(
      { error: error.message || "Erreur lors de la création de la session de paiement" },
      { status: 500 }
    );
  }
}