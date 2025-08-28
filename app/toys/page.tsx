"use client";

import Link from "next/link";
import useSWR from "swr";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ToysPage() {
    const { data: toys, error, isLoading } = useSWR("/api/toys", fetcher);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
                <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-12 text-center max-w-md">
                    <div className="text-8xl mb-6">💥</div>
                    <h2 className="text-3xl font-bold text-red-400 mb-4">Oups !</h2>
                    <p className="text-red-300">Impossible de charger les jouets</p>
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

    if (isLoading || !toys) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative mb-8">
                        <div className="w-24 h-24 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">🎲</div>
                    </div>
                    <p className="text-white/80 text-xl font-light">Découverte des trésors en cours...</p>
                </div>
            </div>
        );
    }

    const filteredToys = toys.filter((toy: any) => {
        const matchesSearch = toy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             toy.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === "all" || toy.mode === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '4s' }} />
                <div className="absolute top-2/3 left-1/3 w-72 h-72 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 pt-24 pb-12 px-6 max-w-7xl mx-auto">
                {/* Hero header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent mb-4">
                        Galerie des Trésors
                    </h1>
                    <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">
                        Découvrez {toys.length} jouets extraordinaires prêts à être échangés
                    </p>
                </div>

                {/* Search and filters */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search bar */}
                        <div className="relative flex-1 group">
                            <input
                                type="text"
                                placeholder="🔍 Rechercher un jouet..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </div>

                        {/* Filter buttons */}
                        <div className="flex gap-3">
                            {[
                                { key: "all", label: "Tout", icon: "🎪" },
                                { key: "exchange", label: "Échange", icon: "🔄" },
                                { key: "lend", label: "Prêt", icon: "🤝" },
                                { key: "sell", label: "Vente", icon: "💰" }
                            ].map((filterOption) => (
                                <button
                                    key={filterOption.key}
                                    onClick={() => setFilter(filterOption.key)}
                                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                                        filter === filterOption.key
                                            ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg"
                                            : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/20"
                                    }`}
                                >
                                    <span className="text-sm">{filterOption.icon}</span>
                                    <span className="hidden sm:inline">{filterOption.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results count */}
                <div className="flex items-center justify-between mb-8">
                    <p className="text-gray-300">
                        <span className="text-cyan-400 font-bold text-lg">{filteredToys.length}</span> jouet{filteredToys.length !== 1 ? 's' : ''} trouvé{filteredToys.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex gap-2">
                        <button className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-300 hover:scale-105" title="Vue grille">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Toys grid */}
                {filteredToys.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-8xl mb-6">🕵️</div>
                        <h2 className="text-3xl font-bold text-white mb-4">Aucun résultat trouvé</h2>
                        <p className="text-gray-400 max-w-md mx-auto">
                            Essayez de modifier votre recherche ou vos filtres pour découvrir plus de jouets
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredToys.map((toy: any, index: number) => (
                            <div
                                key={toy.id}
                                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-500 relative"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Card glow effect */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                                
                                <div className="relative z-10">
                                    {/* Image section */}
                                    <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 overflow-hidden">
                                        {toy.images?.[0] ? (
                                            <div className="relative h-full">
                                                <img
                                                    src={toy.images[0].signedUrl}
                                                    alt={toy.title}
                                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                {toy.images[1] && (
                                                    <img
                                                        src={toy.images[1].signedUrl}
                                                        alt={toy.title}
                                                        className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                        ) : (
                                            <div className="h-full flex items-center justify-center">
                                                <div className="text-6xl group-hover:scale-110 transition-transform duration-300">🎮</div>
                                            </div>
                                        )}
                                        
                                        {/* Mode badge */}
                                        <div className="absolute top-4 right-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border ${
                                                toy.mode === "exchange" 
                                                    ? "bg-blue-500/80 text-blue-100 border-blue-400/50" 
                                                    : toy.mode === "lend" 
                                                    ? "bg-green-500/80 text-green-100 border-green-400/50"
                                                    : "bg-yellow-500/80 text-yellow-100 border-yellow-400/50"
                                            }`}>
                                                {toy.mode === "exchange" ? "🔄" : toy.mode === "lend" ? "🤝" : "💰"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h2 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2">
                                            <Link href={`/toys/${toy.id}`} className="hover:underline">
                                                {toy.title}
                                            </Link>
                                        </h2>
                                        
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                                            {toy.description}
                                        </p>
                                        
                                        {/* Age and condition tags */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium border border-purple-500/30 flex items-center gap-1">
                                                👶 {toy.ageMin}-{toy.ageMax} ans
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${
                                                toy.condition === "Excellent" 
                                                    ? "bg-green-500/20 text-green-300 border-green-500/30" 
                                                    : toy.condition === "Bon"
                                                    ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                                    : "bg-orange-500/20 text-orange-300 border-orange-500/30"
                                            }`}>
                                                {toy.condition === "Excellent" ? "⭐" : toy.condition === "Bon" ? "👍" : "🔧"} {toy.condition}
                                            </span>
                                        </div>

                                        {/* Action button */}
                                        <Link
                                            href={`/toys/${toy.id}`}
                                            className="group/btn w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-cyan-500/25 flex items-center justify-center gap-2"
                                        >
                                            <span>Voir les détails</span>
                                            <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating action button */}
            <Link
                href="/post"
                className="fixed bottom-8 right-8 group bg-gradient-to-r from-emerald-500 to-cyan-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-50"
            >
                <div className="flex items-center justify-center">
                    <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            </Link>

            {/* Custom styles */}
            <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}