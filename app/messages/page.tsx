// app/messages/page.tsx
"use client";

import { useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { MessageSquare, Loader2, ArrowLeft, Frown, Plus } from "lucide-react";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function MessagesPage() {
    const { data: session } = useSession();
    const { data: conversations, error, isLoading } = useSWR(session ? "/api/conversations" : null, fetcher);

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center max-w-md">
                    <div className="text-8xl mb-6 text-red-400">
                        <Frown size={96} className="mx-auto" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Accès refusé</h2>
                    <p className="text-gray-300">Veuillez vous connecter pour voir vos messages.</p>
                    <Link
                        href="/login"
                        className="mt-6 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-6 py-3 rounded-xl transition-all duration-300"
                    >
                        Se connecter
                    </Link>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-6">
                <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-12 text-center max-w-md">
                    <div className="text-8xl mb-6 text-red-400">
                        <Frown size={96} className="mx-auto" />
                    </div>
                    <h2 className="text-3xl font-bold text-red-400 mb-4">Oups !</h2>
                    <p className="text-red-300">Impossible de charger vos conversations.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-6 py-3 rounded-xl transition-all duration-300"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading || !conversations) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
                    <p className="text-white/80 text-lg">Chargement de vos conversations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
            
            <div className="relative z-10 pt-24 pb-12 px-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-8">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent">
                        Mes conversations
                    </h1>
                    <Link
                        href="/post"
                        className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center gap-2"
                    >
                        <Plus size={20} /> Nouveau message
                    </Link>
                </div>

                {conversations.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
                        <MessageSquare size={96} className="text-gray-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-white mb-4">Aucune conversation</h2>
                        <p className="text-gray-400 max-w-md mx-auto">
                            Vous n'avez pas encore de messages. Parcourez les jouets pour trouver votre premier échange !
                        </p>
                        <Link
                            href="/toys"
                            className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl"
                        >
                            Parcourir les jouets
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {conversations.map((conv) => (
                            console.log(conv.toy),
                            <Link href={`/messages/${conv.toy.id}?partnerId=${conv.sender.id === session.user.id ? conv.receiver.id : conv.sender.id}`} key={conv.toy.id} className="relative group p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 block">
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-white/10">
                                        {conv.toy.images?.[0] && (
                                            <img src={conv.toy.images[0].signedUrl} alt={conv.toy.title} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                                                {conv.toy.title}
                                            </h3>
                                            <span className="text-xs text-gray-400">
                                                {new Date(conv.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm line-clamp-2 mt-1">
                                            {conv.content}
                                        </p>
                                    </div>
                                    <MessageSquare size={24} className={`text-gray-400 group-hover:text-cyan-400 transition-colors duration-300 ${!conv.isRead ? 'text-purple-400 animate-pulse' : ''}`} />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}