"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Coins,
  CreditCard,
  ArrowLeft,
  Zap,
  Star,
  Crown,
  Loader2,
  CheckCircle,
  Gift,
  Sparkles,
  Shield
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { usePointsPageTranslations } from "@/hooks/usePointsPageTranslations";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface User {
  id: string;
  name?: string;
  email: string;
  points: number;
}

interface PointsPack {
  id: string;
  points: number;
  price: number;
  priceId: string;
  popular?: boolean;
  badge?: string;
  color: string;
  icon: React.ReactNode;
}

export default function PointsPageClient({ user }: { user: User }) {
  const [loading, setLoading] = useState<string | null>(null);
  const t = usePointsPageTranslations();

  const pointsPacks: PointsPack[] = [
    {
      id: "starter",
      points: 100,
      price: 5,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_100_POINTS || "price_starter",
      badge: t.packs.starter,
      color: "from-blue-500 to-cyan-500",
      icon: <Zap className="w-8 h-8" />
    },
    {
      id: "popular",
      points: 250,
      price: 10,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_250_POINTS || "price_popular",
      badge: t.packs.popular,
      popular: true,
      color: "from-purple-500 to-pink-500",
      icon: <Star className="w-8 h-8" />
    },
    {
      id: "premium",
      points: 600,
      price: 20,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_600_POINTS || "price_premium",
      badge: t.packs.premium,
      color: "from-yellow-500 to-orange-500",
      icon: <Crown className="w-8 h-8" />
    }
  ];

  const handlePurchase = async (pack: PointsPack) => {
    setLoading(pack.id);

    try {
      // Créer une session de checkout Stripe
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: pack.priceId,
          points: pack.points,
          userId: user.id
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Rediriger vers Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error(t.errors.stripeNotInitialized);
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

    } catch (error: any) {
      console.error('Erreur lors de l\'achat:', error);
      toast.error(t.getPurchaseError(error.message) || t.errors.generalPurchaseError);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 relative">

      <div className="relative z-10 pt-24 pb-12 px-6 max-w-6xl mx-auto">
        {/* Back button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          {t.navigation.backToDashboard}
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6 animate-bounce">
            <Coins className="w-16 h-16 text-yellow-400 mx-auto" />
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-white via-yellow-300 to-orange-300 bg-clip-text text-transparent mb-4">
            {t.header.title}
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            {t.header.subtitle}
          </p>
          
          {/* Points actuels */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md mx-auto mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Coins className="w-12 h-12 text-yellow-400" />
              <div>
                <div className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  {t.getCurrentPoints(user.points || 0)}
                </div>
                <div className="text-gray-400 text-sm">{t.header.availablePoints}</div>
              </div>
            </div>
            <div className="text-gray-300 text-sm">
              {t.getWelcomeMessage(user.name)}
            </div>
          </div>
        </div>

        {/* Packs de points */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            {t.packs.choosePackTitle}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pointsPacks.map((pack) => (
              <div
                key={pack.id}
                className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:scale-105 transition-all duration-500 ${
                  pack.popular ? 'ring-2 ring-purple-500/50' : ''
                }`}
              >
                {/* Badge populaire */}
                {pack.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl">
                      {t.packs.popularBadge}
                    </div>
                  </div>
                )}

                <div className="text-center">
                  {/* Icône */}
                  <div className={`text-6xl mb-4 bg-gradient-to-r ${pack.color} bg-clip-text text-transparent`}>
                    {pack.icon}
                  </div>

                  {/* Pack info */}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {pack.badge}
                  </h3>
                  
                  <div className={`text-4xl font-black mb-2 bg-gradient-to-r ${pack.color} bg-clip-text text-transparent`}>
                    {t.getPointsAmount(pack.points)}
                  </div>
                  
                  <div className="text-3xl font-bold text-white mb-6">
                    {t.getPrice(pack.price)}
                  </div>

                  {/* Avantages */}
                  <div className="text-sm text-gray-400 mb-6 space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>{t.benefits.instantPoints}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Gift className="w-4 h-4 text-green-400" />
                      <span>{t.benefits.premiumAccess}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-green-400" />
                      <span>{t.getValueRatio(pack.points / pack.price)}</span>
                    </div>
                  </div>

                  {/* Bouton d'achat */}
                  <button
                    onClick={() => handlePurchase(pack)}
                    disabled={loading === pack.id}
                    className={`group relative overflow-hidden w-full bg-gradient-to-r ${pack.color} text-white font-bold px-6 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading === pack.id ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {t.purchase.loading}
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          {t.purchase.buyNow}
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informations sécurité */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-green-400">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              {t.security.title}
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <CreditCard className="w-8 h-8 text-blue-400 mx-auto" />
              <div className="text-white font-medium">{t.security.stripeTitle}</div>
              <div className="text-sm text-gray-400">{t.security.stripeDescription}</div>
            </div>
            <div className="space-y-2">
              <Zap className="w-8 h-8 text-green-400 mx-auto" />
              <div className="text-white font-medium">{t.security.instantTitle}</div>
              <div className="text-sm text-gray-400">{t.security.instantDescription}</div>
            </div>
            <div className="space-y-2">
              <CheckCircle className="w-8 h-8 text-purple-400 mx-auto" />
              <div className="text-white font-medium">{t.security.guaranteeTitle}</div>
              <div className="text-sm text-gray-400">{t.security.guaranteeDescription}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}