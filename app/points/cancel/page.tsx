// app/points/cancel/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    XCircle,
    RefreshCw,
    ToyBrick,
    Home,
    AlertCircle,
    CreditCard
} from "lucide-react";
import { usePointsCancelTranslations } from "@/hooks/usePointsCancelTranslations";

function CancelContent() {
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const t = usePointsCancelTranslations();

    useEffect(() => {
        // Simuler un petit délai pour l'effet de chargement
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-16 h-16 border-4 border-red-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-white text-lg">{t.loading.verification}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-red-400 to-pink-500 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '3s' }} />
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-xl animate-float text-red-400 opacity-60"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    >
                        💔
                    </div>
                ))}
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
                <div className="max-w-2xl w-full text-center">
                    {/* Cancel icon */}
                    <div className="mb-8 relative">
                        <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                            <XCircle className="w-16 h-16 text-white" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    </div>

                    {/* Cancel message */}
                    <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-red-400 via-pink-300 to-orange-300 bg-clip-text text-transparent mb-6 leading-tight">
                        {t.header.title}
                    </h1>

                    <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
                        {t.header.subtitle}
                    </p>

                    {/* Info box */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 max-w-md mx-auto">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <AlertCircle className="w-12 h-12 text-orange-400 animate-bounce" />
                            <div>
                                <div className="text-2xl font-bold text-white mb-2">
                                    {t.info.transactionCancelled}
                                </div>
                                <div className="text-gray-400 text-sm">
                                    {t.info.retryAnytime}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">{t.info.status}</span>
                                <span className="text-red-400 font-semibold">{t.info.cancelled}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">{t.info.amountCharged}</span>
                                <span className="text-green-400 font-semibold">{t.info.zeroAmount}</span>
                            </div>
                            {sessionId && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">{t.info.sessionIdLabel}</span>
                                    <span className="text-gray-300 font-mono text-xs">
                                        {t.getSessionId(sessionId)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reasons for cancellation */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 max-w-lg mx-auto">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                            {t.reasons.title}
                        </h3>
                        <ul className="text-sm text-gray-300 text-left space-y-2">
                            <li>{t.reasons.closedPage}</li>
                            <li>{t.reasons.clickedCancel}</li>
                            <li>{t.reasons.timeoutExpired}</li>
                            <li>{t.reasons.technicalProblem}</li>
                        </ul>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/points"
                            className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                                {t.buttons.retryPurchase}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>

                        <Link
                            href="/toys"
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <ToyBrick className="w-5 h-5" />
                            {t.buttons.viewFreeToys}
                        </Link>

                        <Link
                            href="/dashboard"
                            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            {t.buttons.backToDashboard}
                        </Link>
                    </div>

                    {/* Reassurance message */}
                    <div className="mt-12 text-center">
                        <div className="flex items-center justify-center gap-2 text-green-400 text-sm mb-2">
                            <CreditCard className="w-4 h-4" />
                            <span>{t.reassurance.noCharge}</span>
                        </div>
                        <p className="text-gray-500 text-sm">
                            {t.reassurance.securedByStripe}
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(10deg);
                    }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

function LoadingFallback() {
    const t = usePointsCancelTranslations();
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin w-16 h-16 border-4 border-red-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-white text-lg">{t.loading.general}</p>
            </div>
        </div>
    );
}

export default function PointsCancelPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <CancelContent />
        </Suspense>
    );
}