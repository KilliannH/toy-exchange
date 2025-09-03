// app/points/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    CheckCircle,
    Coins,
    ArrowRight,
    Sparkles,
    Gift,
    ToyBrick,
    Home,
    CreditCard
} from "lucide-react";

export default function PointsSuccessPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [purchaseData, setPurchaseData] = useState<any>(null);
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            // Vérifier le statut de la session de paiement
            fetch(`/api/stripe/verify-session?session_id=${sessionId}`)
                .then(res => res.json())
                .then(data => {
                    setPurchaseData(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Erreur lors de la vérification:', error);
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [sessionId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-white text-lg">Vérification de votre paiement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br pt-40 from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '3s' }} />
            </div>

            {/* Confetti animation */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-2xl animate-bounce text-yellow-400 opacity-70"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    >
                        ✨
                    </div>
                ))}
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
                <div className="max-w-2xl w-full text-center">
                    {/* Success icon */}
                    <div className="mb-8 relative">
                        <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                            <CheckCircle className="w-16 h-16 text-white" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    </div>

                    {/* Success message */}
                    <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-green-400 via-emerald-300 to-cyan-300 bg-clip-text text-transparent mb-6 leading-tight">
                        Paiement réussi !
                    </h1>

                    <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
                        Félicitations ! Vos points ont été ajoutés à votre compte avec succès.
                    </p>

                    {/* Purchase details */}
                    {purchaseData && (
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 max-w-md mx-auto">
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <Coins className="w-12 h-12 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                                <div>
                                    <div className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                        +{purchaseData.points}
                                    </div>
                                    <div className="text-gray-400 text-sm">Points ajoutés</div>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Montant payé :</span>
                                    <span className="text-white font-semibold">{purchaseData.amount || 'N/A'}€</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Points totaux :</span>
                                    <span className="text-green-400 font-semibold">{purchaseData.totalPoints || 'N/A'} points</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Transaction ID :</span>
                                    <span className="text-gray-300 font-mono text-xs">
                                        {purchaseData.sessionId?.slice(-8) || sessionId?.slice(-8) || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/toys"
                            className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <ToyBrick className="w-5 h-5" />
                                Découvrir les jouets
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>

                        <Link
                            href="/dashboard"
                            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            Retour au dashboard
                        </Link>
                    </div>

                    {/* Footer message */}
                    <div className="mt-12 text-center">
                        <p className="text-gray-500 text-sm mb-2">
                            Un reçu de votre achat a été envoyé par email
                        </p>
                        <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
                            <CreditCard className="w-4 h-4" />
                            <span>Paiement sécurisé par Stripe</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}