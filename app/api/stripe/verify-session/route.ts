import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { use } from "react";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil', // Use the latest API version
});

// app/api/stripe/verify-session/route.ts
export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const userSession = await getServerSession(authOptions);
    const user = await prisma.user.findUnique({where: { id: userSession?.user.id} });
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      points: session.metadata?.points,
      amount: session.amount_total ? session.amount_total / 100 : null,
      totalPoints: user?.points,
      sessionId: session.id
    });
  } catch (error) {
    console.error('Stripe session retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}